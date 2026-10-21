// ============================================================
// eitanium.ts — חדרי המפגש של איתניום (eitanium.org) לדיונים ולפיוס וירטואליים.
//
// איתניום רץ על AVideo, וחדרי המפגש שלו (תוסף Meet) הם חדרי Jitsi. יוצרים חדר
// דרך ה-API שלהם בשם חשבון-שירות אחד (EITANIUM_USER / EITANIUM_PASS — חשבון עם
// ההרשאה "Can create meetings", בלי אימות דו-שלבי), ומקבלים שני קישורים:
//   • joinUrl — דף ההצטרפות באיתניום, עם סיסמת החדר: לצדדים. שם הם נכנסים
//     כמשתתפים רגילים (בלי הרשאות ניהול).
//   • hostUrl — כניסה ישירה לשרת הווידאו עם טוקן מנחה של חשבון-השירות: לבית הדין.
//     הטוקן תקף ~30 שעות מרגע היצירה, ולכן החדר נפתח סמוך למפגש ולא מראש.
//
// שני הקישורים הם סודות — הם נשמרים בתיק מוצפנים (sealSecret), ונמסרים רק למי
// שהשרת זיהה כצד בתיק או כבית הדין.
// ============================================================

import { env } from '$env/dynamic/private';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const TIMEOUT_MS = 15_000;

function baseUrl(): string {
    return (env.EITANIUM_URL || 'https://eitanium.org').trim().replace(/\/+$/, '');
}

export function eitaniumConfigured(): boolean {
    return !!(env.EITANIUM_USER?.trim() && env.EITANIUM_PASS);
}

export type EitaniumErrorCode = 'config' | 'auth' | 'upstream';

export class EitaniumError extends Error {
    constructor(message: string, readonly code: EitaniumErrorCode) {
        super(message);
        this.name = 'EitaniumError';
    }
}

export interface EitaniumRoom {
    meetId: number;
    joinUrl: string;
    hostUrl: string;
}

/** התשובה של saveMeet.json.php (הצלחה) או ApiObject של ה-API (כישלון) */
interface SaveMeetResponse {
    error?: boolean;
    msg?: string;
    message?: string;
    meet_schedule_id?: number | string;
    link?: string;
    iframeURL?: string;
    domain?: string;
    roomID?: string;
}

/** PHP עלול להדפיס אזהרות לפני ה-JSON — חותכים מהסוגר הראשון עד האחרון */
function parseLoose(text: string): SaveMeetResponse | null {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start < 0 || end <= start) return null;
    try {
        return JSON.parse(text.slice(start, end + 1)) as SaveMeetResponse;
    } catch {
        return null;
    }
}

function httpsUrl(raw: string | undefined): URL | null {
    try {
        const u = new URL(String(raw ?? ''));
        return u.protocol === 'https:' ? u : null;
    } catch {
        return null;
    }
}

/**
 * פותח חדר מפגש חדש באיתניום. החדר "ציבורי לבעלי הקישור" ומוגן בסיסמה אקראית
 * שנכנסת לקישור ההצטרפות; הוא פתוח מרגע היצירה.
 * `topic` מוצג באיתניום גם למי שלא יודע את הסיסמה — לא להכניס בו שמות או פרטי תיק.
 */
export async function createRoom(topic: string): Promise<EitaniumRoom> {
    if (!eitaniumConfigured()) {
        throw new EitaniumError('חיבור איתניום לא הוגדר בשרת (EITANIUM_USER / EITANIUM_PASS)', 'config');
    }
    const password = randomBytes(9).toString('base64url');
    const body = new URLSearchParams({
        user: env.EITANIUM_USER!.trim(),
        pass: env.EITANIUM_PASS!,
        RoomTopic: topic,
        public: '2',
        status: 'a',
        RoomPasswordNew: password,
    });

    let text: string;
    try {
        const res = await fetch(`${baseUrl()}/plugin/API/set.json.php?APIName=meet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
            body,
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        text = await res.text();
        if (!res.ok && !text.includes('{')) {
            throw new EitaniumError(`איתניום החזיר שגיאה ${res.status}`, 'upstream');
        }
    } catch (e) {
        if (e instanceof EitaniumError) throw e;
        throw new EitaniumError('איתניום לא הגיב — נסו שוב בעוד רגע', 'upstream');
    }

    const data = parseLoose(text);
    if (!data) throw new EitaniumError('תשובה לא צפויה מאיתניום', 'upstream');
    if (data.error) {
        const reason = String(data.message || data.msg || '');
        if (/cannot create/i.test(reason)) {
            throw new EitaniumError(
                'חשבון איתניום לא הצליח ליצור מפגש — בדקו את שם המשתמש והסיסמה ואת ההרשאה "Can create meetings"',
                'auth'
            );
        }
        if (/disabled/i.test(reason)) throw new EitaniumError('שירות המפגשים כבוי באיתניום', 'upstream');
        throw new EitaniumError(`איתניום: ${reason.slice(0, 160) || 'יצירת החדר נכשלה'}`, 'upstream');
    }

    const meetId = Number(data.meet_schedule_id);
    const join = httpsUrl(data.link);
    const host = httpsUrl(data.iframeURL) ?? httpsUrl(data.domain && data.roomID ? `https://${data.domain}/${data.roomID}` : '');
    if (!meetId || !join || !host) throw new EitaniumError('תשובה חלקית מאיתניום — החדר לא נפתח', 'upstream');
    join.searchParams.set('meet_password', password);

    return { meetId, joinUrl: join.toString(), hostUrl: host.toString() };
}

/** קישור ההצטרפות של צד, עם השם שיוצג לשאר המשתתפים */
export function participantEntryUrl(joinUrl: string, displayName: string): string {
    const u = new URL(joinUrl);
    if (displayName) u.searchParams.set('nameIdentification', displayName.slice(0, 60));
    return u.toString();
}

/** כניסת בית הדין: שם תצוגה וממשק בעברית דרך הגדרות ה-hash של Jitsi */
export function hostEntryUrl(url: string, displayName: string): string {
    const u = new URL(url);
    const hash = [`config.defaultLanguage=${encodeURIComponent('"he"')}`];
    if (displayName) hash.push(`userInfo.displayName=${encodeURIComponent(JSON.stringify(displayName.slice(0, 60)))}`);
    u.hash = hash.join('&');
    return u.toString();
}

// ───────────────────── הצפנת הקישורים בתיק ─────────────────────
// AES-256-GCM, מפתח שנגזר מסיסמת חשבון-השירות: מי שקורא את התיק ב-Strapi לא
// מקבל ממנו כניסה לחדר. החלפת הסיסמה פוסלת חדרים פתוחים — בית הדין פותח חדש.

function sealKey(): Buffer {
    return createHash('sha256').update(`chachmei-haeda/meet:${env.EITANIUM_PASS ?? ''}`).digest();
}

export function sealSecret(data: unknown): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', sealKey(), iv);
    const enc = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
    return [iv, cipher.getAuthTag(), enc].map((b) => b.toString('base64url')).join('.');
}

export function openSecret<T>(sealed: string | undefined): T | null {
    const parts = String(sealed ?? '').split('.');
    if (parts.length !== 3) return null;
    try {
        const [iv, tag, enc] = parts.map((p) => Buffer.from(p, 'base64url'));
        const decipher = createDecipheriv('aes-256-gcm', sealKey(), iv);
        decipher.setAuthTag(tag);
        return JSON.parse(Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8')) as T;
    } catch {
        return null;
    }
}
