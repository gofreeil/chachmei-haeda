import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { strapiPost } from '$lib/server/strapiClient';
import { ADMIN_ROLES } from '$lib/server/adsAdmin';
import { resolveAdminUserIds } from '$lib/server/adsNotify';

const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

// הגנה מספאם — כל שאלה שולחת SMS לאדמינים, לכן מגבילים לפי כתובת
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function tooMany(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) {
        hits.set(ip, recent);
        return true;
    }
    recent.push(now);
    hits.set(ip, recent);
    return false;
}

/**
 * הודעה לאדמינים על שאלה חדשה. נכתבת לאוסף messages המשותף — ה-lifecycle שלו
 * בבאקאנד שולח SMS לנייד של כל אדמין (השורה הראשונה = כותרת, הקישור האחרון מצורף).
 * best-effort: השאלה כבר נשמרה, כשל בהתראה לא מפיל אותה.
 */
async function notifyAdminsNewQuestion(
    q: { askerName: string; topic: string; question: string },
    link: string
): Promise<void> {
    try {
        const receivers = await resolveAdminUserIds(ADMIN_ROLES);
        if (receivers.length === 0) {
            console.warn('[ask] no admin recipient resolved — skipping new-question notification');
            return;
        }
        const preview = q.question.replace(/\s+/g, ' ').slice(0, 120);
        const content =
            `❓ שאלה חדשה לחכמי העדה${q.topic ? ` — ${q.topic}` : ''}\n` +
            `מאת: ${q.askerName}\n` +
            `${preview}\n` +
            `לטיפול בשאלה: ${link}`;
        await Promise.all(
            receivers.map((receiver) =>
                strapiPost('/api/messages', { data: { receiver, content, read: false } })
            )
        );
    } catch (err) {
        console.warn('[ask] new-question notification failed:', err instanceof Error ? err.message : err);
    }
}

// שליחת שאלה לחכמי העדה — שמירה + הודעה/SMS לאדמינים
export const POST: RequestHandler = async ({ request, url, setHeaders, getClientAddress }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    let ip = '';
    try { ip = getClientAddress(); } catch { /* ללא כתובת — ללא הגבלה */ }
    if (ip && tooMany(ip)) throw error(429, 'נשלחו יותר מדי שאלות — נסו שוב בעוד כמה דקות');

    const raw = await request.json().catch(() => ({}));
    const input = {
        askerName: clip(raw.askerName, 120),
        askerEmail: clip(raw.askerEmail, 200),
        askerPhone: clip(raw.askerPhone, 40),
        topic: clip(raw.topic, 120),
        question: clip(raw.question, 5000),
    };
    if (!input.askerName || !input.question) throw error(400, 'חסרים פרטים בשאלה');

    try {
        await strapiPost('/api/ch-question-submissions', {
            data: {
                askerName: input.askerName,
                askerEmail: input.askerEmail || undefined,
                askerPhone: input.askerPhone || undefined,
                topic: input.topic || undefined,
                question: input.question,
                status: 'pending',
            },
        });
    } catch (err) {
        console.warn('[ask] save failed:', err instanceof Error ? err.message : err);
        throw error(502, 'שמירת השאלה נכשלה');
    }

    await notifyAdminsNewQuestion(input, `${url.origin}/admin`);
    return json({ ok: true });
};
