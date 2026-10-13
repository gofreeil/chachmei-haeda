// ============================================================
// hearingCases.ts — תיקי דין תורה: פתיחה ע"י תובע רשום, ואישור המועד
// ע"י שלושת הצדדים — כשכל אחד מהם יכול לאשר רק בשם עצמו.
//
// אחסון: אוסף ch-hearing-requests הקיים — אפס שינוי סכמה בבאקאנד.
// מצב התיק (מי התובע, פרטי הנתבע, האישורים) נשמר כ-JSON בעמודת
// documentsNotes (מסומן ב-_case). ה-documentId של Strapi (לא-ניתן-לניחוש)
// הוא המזהה בקישור /case/<id> שהתובע משתף.
//
// הרשאות (נאכפות כאן בלבד, בצד השרת, מול JWT מאומת ב-/api/users/me):
//   • פתיחת תיק — כל משתמש מחובר; הוא נרשם כתובע (plaintiffUserId).
//   • אישור התובע — רק המשתמש שפתח את התיק.
//   • אישור הנתבע — רק משתמש מחובר שאינו התובע, ששמו בחשבון (כינוי/שם משתמש)
//     תואם לשם הנתבע שהתובע הקליד; וכשלשניהם יש טלפון — גם הטלפון חייב להתאים.
//   • אישור בית הדין — אדמין של חכמי העדה בלבד.
// שום דגל מהדפדפן לא נחשב.
// ============================================================

import { error } from '@sveltejs/kit';
import { strapiGet, strapiPost, strapiPut, getStrapiMe, StrapiContentTypeError } from './strapiClient';
import { roleOf, ADMIN_ROLES } from './adsAdmin';
import { resolveAdminUserIds } from './adsNotify';

const ENDPOINT = '/api/ch-hearing-requests';

export type Party = 'plaintiff' | 'defendant' | 'beitDin';

interface Approval {
    at: string;
    userId: string;
    name: string;
}

interface CaseMeta {
    _case: 1;
    caseRef: string;
    nickname: string;
    subject: string;
    details: string;
    proposedDate: string;
    plaintiffUserId: string;
    plaintiffName: string;
    defendantName: string;
    defendantPhone: string;
    approvals: Record<Party, Approval | null>;
    createdAt: string;
}

interface StrapiRequest {
    id?: number;
    documentId?: string;
    status?: string;
    documentsNotes?: string | null;
}

export interface CaseViewer {
    id: string;
    email: string;
    phone: string;
    /** כל השמות שבחשבון — מולם נבדק שם הנתבע */
    names: string[];
    display: string;
    isAdmin: boolean;
}

/** סיבת חסימה של אישור הנתבע — הלקוח מתרגם לפי הקוד */
export type DefendantBlock = 'login' | 'plaintiff' | 'name' | 'phone' | 'done';

// ───────────────────────── זהות ─────────────────────────

function bearerOf(request: Request): string | null {
    const m = /^Bearer\s+(.+)$/i.exec((request.headers.get('authorization') ?? '').trim());
    return m ? m[1].trim() : null;
}

// username שנוצר אוטומטית בהתחברות חברתית (google_<sub> וכו') אינו שם אמיתי
const PROVIDER_USERNAME = /^(google|facebook|apple|twitter|github|line|discord)[_-]/i;

export async function viewerFromRequest(request: Request): Promise<CaseViewer | null> {
    const jwt = bearerOf(request);
    if (!jwt) return null;
    const me = await getStrapiMe(jwt);
    if (!me) return null;
    const names = [me.nickname, me.name, PROVIDER_USERNAME.test(me.username ?? '') ? '' : me.username]
        .map((s) => (s ?? '').trim())
        .filter(Boolean);
    const email = (me.email ?? '').trim();
    const isAdmin = roleOf({
        id: String(me.id),
        email,
        name: names[0] ?? '',
        appRole: typeof me.app_role === 'string' ? me.app_role : null,
    }) !== null;
    return {
        id: String(me.id ?? ''),
        email,
        phone: (me.phone ?? '').trim(),
        names,
        display: names[0] || email.split('@')[0] || '',
        isAdmin,
    };
}

// תארים שאינם חלק מהשם — "הרב יהב אנטר" = "יהב אנטר"
const TITLES = new Set(['הרב', 'רב', 'רבי', 'ר', 'מר', 'גב', 'גברת', 'הגאון', 'rabbi', 'mr', 'mrs', 'ms']);

/** השוואת שמות סלחנית לסדר/ניקוד/פיסוק/תארים — "אנטר, יהב" = "יהב אנטר" */
export function normalizeName(s: string): string {
    return (s ?? '')
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[֑-ׇ]/g, '')
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .split(' ')
        .filter((w) => w && !TITLES.has(w))
        .sort()
        .join(' ');
}

/** 9 הספרות האחרונות — 054-1234567 = +972541234567 */
function phoneKey(s: string): string {
    const d = (s ?? '').replace(/\D/g, '');
    return d.length >= 9 ? d.slice(-9) : d;
}

function nameMatches(viewer: CaseViewer, defendantName: string): boolean {
    const target = normalizeName(defendantName);
    return !!target && viewer.names.some((n) => normalizeName(n) === target);
}

export function defendantBlock(meta: CaseMeta, viewer: CaseViewer | null): DefendantBlock | null {
    if (meta.approvals.defendant) return 'done';
    if (!viewer) return 'login';
    if (viewer.id === meta.plaintiffUserId) return 'plaintiff';
    if (!nameMatches(viewer, meta.defendantName)) return 'name';
    const want = phoneKey(meta.defendantPhone);
    const have = phoneKey(viewer.phone);
    if (want && have && want !== have) return 'phone';
    return null;
}

// ───────────────────────── אחסון ─────────────────────────

function parseMeta(raw: string | null | undefined): CaseMeta | null {
    if (!raw) return null;
    try {
        const m = JSON.parse(raw);
        return m && m._case === 1 ? (m as CaseMeta) : null;
    } catch {
        return null;
    }
}

async function loadCase(id: string): Promise<{ id: string; status: string; meta: CaseMeta } | null> {
    if (!/^[A-Za-z0-9]{8,64}$/.test(id)) return null;
    try {
        const res = await strapiGet<{ data: StrapiRequest }>(`${ENDPOINT}/${encodeURIComponent(id)}`);
        const meta = parseMeta(res?.data?.documentsNotes);
        if (!res?.data || !meta) return null;
        return { id: String(res.data.documentId ?? id), status: res.data.status ?? 'pending', meta };
    } catch (e) {
        // מסמך שלא קיים חוזר מ-Strapi כ-404 "Not Found" — הקליינט מסווג אותו כ-content-type חסר
        if (e instanceof StrapiContentTypeError || (e instanceof Error && /→ 404/.test(e.message))) return null;
        throw e;
    }
}

function describe(meta: CaseMeta): string {
    return [
        meta.subject,
        meta.details ? `\n\n${meta.details}` : '',
        `\n\nכינוי הדיון: ${meta.nickname}`,
        meta.defendantPhone ? `\nטלפון נתבע: ${meta.defendantPhone}` : '',
        `\nתאריך מוצע: ${meta.proposedDate}`,
        `\nמספר תיק: ${meta.caseRef}`,
    ].join('');
}

const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

export interface NewCaseInput {
    nickname: string;
    plaintiffName: string;
    plaintiffPhone: string;
    defendantName: string;
    defendantPhone: string;
    subject: string;
    details: string;
    proposedDate: string;
}

export async function createCase(viewer: CaseViewer, raw: Partial<NewCaseInput>, siteOrigin: string) {
    const input: NewCaseInput = {
        nickname: clip(raw.nickname, 120),
        plaintiffName: clip(raw.plaintiffName, 120),
        plaintiffPhone: clip(raw.plaintiffPhone, 30),
        defendantName: clip(raw.defendantName, 120),
        defendantPhone: clip(raw.defendantPhone, 30),
        subject: clip(raw.subject, 300),
        details: clip(raw.details, 5000),
        proposedDate: clip(raw.proposedDate, 10),
    };
    if (!input.nickname || !input.plaintiffName || !input.defendantName || !input.subject) {
        throw error(400, 'חסרים פרטים בתיק');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.proposedDate)) throw error(400, 'תאריך לא תקין');

    const now = new Date().toISOString();
    const meta: CaseMeta = {
        _case: 1,
        caseRef: 'C-' + Math.floor(100000 + Math.random() * 900000),
        nickname: input.nickname,
        subject: input.subject,
        details: input.details,
        proposedDate: input.proposedDate,
        plaintiffUserId: viewer.id,
        plaintiffName: input.plaintiffName,
        defendantName: input.defendantName,
        defendantPhone: input.defendantPhone,
        // מי שפותח את התיק מאשר בכך את המועד שהציע
        approvals: {
            plaintiff: { at: now, userId: viewer.id, name: viewer.display },
            defendant: null,
            beitDin: null,
        },
        createdAt: now,
    };

    const res = await strapiPost<{ data: StrapiRequest }>(ENDPOINT, {
        data: {
            requesterName: input.plaintiffName,
            requesterPhone: input.plaintiffPhone || undefined,
            requesterEmail: viewer.email || undefined,
            oppositeParty: input.defendantName,
            caseDescription: describe(meta),
            documentsNotes: JSON.stringify(meta),
            status: 'pending',
        },
    });
    const id = String(res?.data?.documentId ?? '');
    if (!id) throw error(502, 'שמירת התיק נכשלה');
    await notifyAdminsNewCase(meta, `${siteOrigin}/case/${id}`);
    return publicView({ id, status: 'pending', meta }, viewer);
}

/**
 * הודעה לאדמינים על תיק חדש, עם הקישור לדף התיק (שם הם מאשרים בשם בית הדין).
 * נכתבת לאוסף messages המשותף — ה-lifecycle שלו בבאקאנד שולח SMS לנייד של
 * כל אדמין: השורה הראשונה היא כותרת ה-SMS והקישור האחרון בטקסט מצורף אליה.
 * best-effort: התיק כבר נשמר, כשל בהתראה לא מפיל אותו.
 */
async function notifyAdminsNewCase(meta: CaseMeta, link: string): Promise<void> {
    try {
        const receivers = await resolveAdminUserIds(ADMIN_ROLES);
        if (receivers.length === 0) {
            console.warn('[cases] no admin recipient resolved — skipping new-case notification');
            return;
        }
        const content =
            `⚖️ תיק ${meta.caseRef} נפתח וממתין לאישור בית הדין — חכמי העדה\n` +
            `נושא: ${meta.subject}\n` +
            `${meta.plaintiffName} נגד ${meta.defendantName}\n` +
            `מועד מוצע: ${meta.proposedDate}\n` +
            `לאישור התיק: ${link}`;
        await Promise.all(receivers.map((receiver) =>
            strapiPost('/api/messages', { data: { receiver, content, read: false } })
        ));
    } catch (err) {
        console.warn('[cases] new-case notification failed:', err instanceof Error ? err.message : err);
    }
}

export async function getCaseView(id: string, viewer: CaseViewer | null) {
    const c = await loadCase(id);
    if (!c) throw error(404, 'התיק לא נמצא');
    return publicView(c, viewer);
}

export async function approveCase(id: string, party: Party, viewer: CaseViewer) {
    const c = await loadCase(id);
    if (!c) throw error(404, 'התיק לא נמצא');
    const { meta } = c;

    if (party === 'defendant') {
        const block = defendantBlock(meta, viewer);
        if (block === 'done') return publicView(c, viewer);
        if (block === 'plaintiff') throw error(403, 'התובע לא יכול לאשר במקום הנתבע');
        if (block === 'name') throw error(403, 'רק הנתבע הרשום בתיק יכול לאשר — השם בחשבון שלך לא תואם');
        if (block === 'phone') throw error(403, 'הטלפון בחשבון שלך לא תואם לטלפון הנתבע בתיק');
    } else if (party === 'beitDin') {
        if (!viewer.isAdmin) throw error(403, 'רק בית הדין יכול לאשר בשמו');
    } else if (party === 'plaintiff') {
        if (viewer.id !== meta.plaintiffUserId) throw error(403, 'רק התובע יכול לאשר בשמו');
    } else {
        throw error(400, 'צד לא מוכר');
    }

    if (!meta.approvals[party]) {
        meta.approvals[party] = { at: new Date().toISOString(), userId: viewer.id, name: viewer.display };
    }
    const all = !!(meta.approvals.plaintiff && meta.approvals.defendant && meta.approvals.beitDin);
    const status = all ? 'scheduled' : c.status;
    await strapiPut(`${ENDPOINT}/${encodeURIComponent(c.id)}`, {
        data: { documentsNotes: JSON.stringify(meta), status },
    });
    return publicView({ ...c, status, meta }, viewer);
}

// ───────────────────────── תצוגה ─────────────────────────

/** מה שהדפדפן מקבל: בלי טלפונים ומזהי משתמשים; הפירוט רק לצדדים ולבית הדין */
function publicView(c: { id: string; status: string; meta: CaseMeta }, viewer: CaseViewer | null) {
    const { meta } = c;
    const isPlaintiff = !!viewer && viewer.id === meta.plaintiffUserId;
    const isDefendant =
        !!viewer &&
        (meta.approvals.defendant?.userId === viewer.id ||
            (!isPlaintiff && nameMatches(viewer, meta.defendantName)));
    const role: Party | 'other' | null = !viewer
        ? null
        : isPlaintiff
          ? 'plaintiff'
          : isDefendant
            ? 'defendant'
            : viewer.isAdmin
              ? 'beitDin'
              : 'other';
    const block = defendantBlock(meta, viewer);
    return {
        id: c.id,
        caseRef: meta.caseRef,
        nickname: meta.nickname,
        subject: meta.subject,
        details: isPlaintiff || isDefendant || viewer?.isAdmin ? meta.details : '',
        proposedDate: meta.proposedDate,
        plaintiffName: meta.plaintiffName,
        defendantName: meta.defendantName,
        // לשיתוף מהיר בוואטסאפ/SMS — רק לתובע שהקליד אותו
        defendantPhone: isPlaintiff ? meta.defendantPhone : '',
        approvals: {
            plaintiff: !!meta.approvals.plaintiff,
            defendant: !!meta.approvals.defendant,
            beitDin: !!meta.approvals.beitDin,
        },
        status: c.status,
        viewer: viewer ? { role, name: viewer.display, isAdmin: viewer.isAdmin } : null,
        can: {
            plaintiff: isPlaintiff && !meta.approvals.plaintiff,
            defendant: block === null,
            beitDin: !!viewer?.isAdmin && !meta.approvals.beitDin,
        },
        defendantBlock: block,
    };
}

export type CaseView = ReturnType<typeof publicView>;
