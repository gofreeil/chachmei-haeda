// ============================================================
// generalRooms.ts — "חדר כללי" של בית הדין: חדר מפגש באיתניום שלא קשור לתיק
// (מפגש פיוס שתואם בטלפון, פגישת ייעוץ, בדיקה). אין לו רשומה בשרת:
//   • בית הדין מקבל hostToken — הקישור כמנחה, מוצפן — ושומר אותו בדפדפן שלו
//     כדי לחזור לחדר; רק אדמין פותח אותו.
//   • המשתתפים מקבלים קישור הזמנה לאתר עם invite — קישור ההצטרפות, מוצפן.
//     מי שמחזיק בקישור נכנס (כמו קישור זום), גם בלי חשבון באתר.
// שניהם פגים אחרי 28 שעות (טוקן המנחה של איתניום תקף 30 שעות).
// ============================================================

import { error } from '@sveltejs/kit';
import type { CaseViewer } from './hearingCases';
import { createRoom, EitaniumError, type EitaniumRoom, hostEntryUrl, openSecret, participantEntryUrl, sealSecret } from './eitanium';

const TTL_MS = 28 * 60 * 60 * 1000;

interface HostToken { kind: 'host'; hostUrl: string; openedAt: string }
interface InviteToken { kind: 'invite'; joinUrl: string; openedAt: string }

/** טוקן שנפתח, מהסוג הנכון ובתוקף — אחרת שגיאה ברורה */
function readToken<T extends HostToken | InviteToken>(token: string, kind: T['kind']): T {
    const t = openSecret<T>(token);
    if (!t || t.kind !== kind) throw error(404, 'הקישור לחדר לא תקין');
    if (Date.now() - Date.parse(t.openedAt) >= TTL_MS) throw error(410, 'תוקף החדר פג — בקשו מבית הדין קישור חדש');
    return t;
}

export async function openGeneralRoom(viewer: CaseViewer, siteOrigin: string) {
    if (!viewer.isAdmin) throw error(403, 'רק בית הדין פותח חדר כללי');
    let room: EitaniumRoom;
    try {
        // הנושא גלוי באיתניום גם בלי סיסמה — בלי שמות
        room = await createRoom(`ChachmeiHaeda ${Math.random().toString(36).slice(2, 10)}`);
    } catch (e) {
        if (e instanceof EitaniumError) {
            console.warn(`[rooms] eitanium general room failed (${e.code}):`, e.message);
            throw error(e.code === 'config' ? 503 : 502, e.message);
        }
        throw e;
    }
    const openedAt = new Date().toISOString();
    const invite = sealSecret({ kind: 'invite', joinUrl: room.joinUrl, openedAt } satisfies InviteToken);
    return {
        entry: { role: 'host' as const, url: hostEntryUrl(room.hostUrl, viewer.display), caseRef: '', nickname: '' },
        hostToken: sealSecret({ kind: 'host', hostUrl: room.hostUrl, openedAt } satisfies HostToken),
        inviteUrl: `${siteOrigin}/heichal-hamishpat?invite=${encodeURIComponent(invite)}#virtual-room`,
        openedAt,
    };
}

/** בית הדין חוזר לחדר הכללי שפתח */
export function enterGeneralRoom(token: string, viewer: CaseViewer) {
    if (!viewer.isAdmin) throw error(403, 'רק בית הדין נכנס כמנחה');
    const t = readToken<HostToken>(token, 'host');
    return { role: 'host' as const, url: hostEntryUrl(t.hostUrl, viewer.display), caseRef: '', nickname: '' };
}

/** משתתף שקיבל קישור הזמנה — גם בלי חשבון; בלי שם, איתניום שואל אותו בכניסה */
export function joinGeneralRoom(token: string, viewer: CaseViewer | null) {
    const t = readToken<InviteToken>(token, 'invite');
    return { role: 'participant' as const, url: participantEntryUrl(t.joinUrl, viewer?.display ?? ''), caseRef: '', nickname: '' };
}
