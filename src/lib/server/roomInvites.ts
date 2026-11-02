// ============================================================
// roomInvites.ts — הזמנה חכמה להיכל משפט: בית הדין בוחר מי מוזמן (בעלי הדין של
// תיק, דיינים, מספרי טלפון נוספים) ולחיצה אחת שולחת לכולם את קישור המפגש.
//   • בעלי הדין — התובע והנתבע נשלפים מהתיק (גם נתבע שעוד לא אישר): SMS לנייד
//     שבתיק + הודעה בתיבה של החשבונות שלהם.
//   • דיינים — חשבונות האדמין של בית הדין; הודעה בתיבה, וה-lifecycle של messages
//     שולח להם SMS בעצמו.
//   • טלפון נוסף — SMS בלבד.
// הקישור עצמו מגיע מהלקוח אבל חייב להיות קישור לאתר הזה — אחרת אפשר היה להפוך
// את הכלי לשליחת SMS עם קישור זר בשם בית הדין.
// ============================================================

import { error } from '@sveltejs/kit';
import { strapiGet } from './strapiClient';
import { ADMIN_ROLES } from './adsAdmin';
import {
    type CaseViewer,
    deliverMessage,
    findDefendantAccounts,
    loadCase,
    phoneKey,
    type UserRow,
    userLabel,
} from './hearingCases';

export interface InviteDayan {
    id: number;
    name: string;
}

export interface InviteInput {
    /** קישור ההצטרפות — קישור הזמנה להיכל משפט, או דף החדר של תיק */
    link?: unknown;
    /** התיק ששולפים ממנו את בעלי הדין */
    caseId?: unknown;
    parties?: unknown;
    dayanIds?: unknown;
    phones?: unknown;
}

export interface InviteResult {
    name: string;
    /** sms — יצא SMS; inbox — הודעה בתיבה באתר; none — לא יצא כלום (אין טלפון/חשבון) */
    via: 'sms' | 'inbox' | 'both' | 'none';
    /** קישור וואטסאפ אישי — כשיש טלפון, גם כשה-SMS לא יצא */
    wa?: string;
}

const MAX_PHONES = 10;

function requireAdmin(viewer: CaseViewer): void {
    if (!viewer.isAdmin) throw error(403, 'רק בית הדין שולח הזמנות');
}

/** מספר מקומי (050…) → פורמט בינלאומי שוואטסאפ מקבל (972…) */
function waNumber(phone: string): string {
    const d = String(phone ?? '').replace(/\D/g, '');
    return d.startsWith('0') ? `972${d.slice(1)}` : d;
}

function viaOf(r: { sms: boolean; inbox: number }): InviteResult['via'] {
    if (r.sms && r.inbox > 0) return 'both';
    if (r.sms) return 'sms';
    return r.inbox > 0 ? 'inbox' : 'none';
}

/** הדיינים שאפשר להזמין — כל חשבונות בית הדין חוץ מהמזמין עצמו */
export async function listDayanim(viewer: CaseViewer): Promise<InviteDayan[]> {
    requireAdmin(viewer);
    const params: Record<string, string> = { 'pagination[limit]': '100' };
    ADMIN_ROLES.forEach((r, i) => {
        params[`filters[app_role][$in][${i}]`] = r;
    });
    const users = await strapiGet<UserRow[]>('/api/users', params).catch(() => []);
    return (Array.isArray(users) ? users : [])
        .filter((u) => u?.id && String(u.id) !== viewer.id)
        .map((u) => ({ id: u.id, name: userLabel(u) }))
        .sort((a, b) => a.name.localeCompare(b.name, 'he'));
}

async function loadUser(id: number | string): Promise<UserRow | null> {
    if (!/^\d+$/.test(String(id))) return null;
    return strapiGet<UserRow>(`/api/users/${id}`).catch(() => null);
}

export async function sendRoomInvites(viewer: CaseViewer, siteOrigin: string, input: InviteInput): Promise<InviteResult[]> {
    requireAdmin(viewer);

    const link = String(input.link ?? '');
    if (!link.startsWith(`${siteOrigin}/heichal-hamishpat?`) || link.length > 2000) throw error(400, 'קישור ההזמנה לא תקין');

    const caseId = String(input.caseId ?? '');
    const wantParties = new Set(Array.isArray(input.parties) ? input.parties.map(String) : []);
    const dayanIds = (Array.isArray(input.dayanIds) ? input.dayanIds : [])
        .map(Number)
        .filter((n, i, all) => Number.isInteger(n) && n > 0 && all.indexOf(n) === i);
    const phones = (Array.isArray(input.phones) ? input.phones : [])
        .map((p) => String(p).trim())
        .filter((p) => phoneKey(p).length >= 9)
        .slice(0, MAX_PHONES);

    const c = caseId ? await loadCase(caseId) : null;
    if (caseId && !c) throw error(404, 'התיק לא נמצא');
    if (wantParties.size > 0 && !c) throw error(400, 'כדי להזמין בעלי דין צריך לבחור תיק');
    if (wantParties.size === 0 && dayanIds.length === 0 && phones.length === 0) throw error(400, 'לא נבחרו מוזמנים');

    const text =
        `🎥 בית הדין חכמי העדה מזמין אותך למפגש וירטואלי${c ? ` בתיק ${c.meta.caseRef}` : ''}\n` +
        `להצטרפות: ${link}`;
    const waLink = (phone: string) => `https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(text)}`;
    const results: InviteResult[] = [];

    if (c) {
        const { meta } = c;
        if (wantParties.has('plaintiff')) {
            const u = await loadUser(meta.plaintiffUserId);
            const phone = u?.phone ?? '';
            const sent = await deliverMessage(text, phone, u ? [u] : []);
            results.push({ name: meta.plaintiffName, via: viaOf(sent), wa: phoneKey(phone).length >= 9 ? waLink(phone) : undefined });
        }
        if (wantParties.has('defendant')) {
            const accounts = await findDefendantAccounts(meta).catch(() => [] as UserRow[]);
            const approvedId = meta.approvals.defendant?.userId;
            if (approvedId && !accounts.some((u) => String(u.id) === approvedId)) {
                const u = await loadUser(approvedId);
                if (u) accounts.push(u);
            }
            const phone = meta.defendantPhone;
            const sent = await deliverMessage(text, phone, accounts);
            results.push({ name: meta.defendantName, via: viaOf(sent), wa: phoneKey(phone).length >= 9 ? waLink(phone) : undefined });
        }
    }

    if (dayanIds.length > 0) {
        const allowed = new Map((await listDayanim(viewer)).map((d) => [d.id, d.name]));
        for (const id of dayanIds) {
            const name = allowed.get(id);
            if (!name) continue; // לא חשבון של בית הדין — מדלגים
            const sent = await deliverMessage(text, '', [{ id }]);
            results.push({ name, via: viaOf(sent) });
        }
    }

    for (const phone of phones) {
        const sent = await deliverMessage(text, phone, []);
        results.push({ name: phone, via: viaOf(sent), wa: waLink(phone) });
    }

    return results;
}
