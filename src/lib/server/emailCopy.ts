// ============================================================
// emailCopy.ts — עותק במייל לכל SMS שנשלח למשתמש (Resend REST, בלי תלות חדשה)
//
// שולח מהדומיין המאומת gofreeil.com. best-effort: לעולם לא זורק, בלי
// RESEND_API_KEY פשוט מדלג. בתחתית כל מייל קישור חתום לביטול (HMAC על האימייל
// עם AUTH_SECRET של האתר) + כותרת List-Unsubscribe; דף /unsubscribe באתר מאמת
// את החתימה. אותו קובץ משמש את אתרי הרשת — שינוי כאן ⇒ לעדכן שם.
// ============================================================

import { createHmac, timingSafeEqual } from 'node:crypto';

const FROM = process.env.NOTIFY_FROM_EMAIL || 'noreply@gofreeil.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function sign(email: string): string {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return '';
    return createHmac('sha256', secret).update('unsub:' + email.trim().toLowerCase()).digest('hex').slice(0, 32);
}

/** כתובת הביטול למייל נתון ('' כשאין AUTH_SECRET) */
export function unsubUrl(origin: string, email: string): string {
    const t = sign(email);
    return t ? `${origin}/unsubscribe?e=${encodeURIComponent(email.trim())}&t=${t}` : '';
}

export function verifyUnsub(email: string, token: string): boolean {
    const want = sign(email);
    if (!want || !token || token.length !== want.length) return false;
    return timingSafeEqual(Buffer.from(want), Buffer.from(token));
}

/**
 * מייל עם אותו נוסח של ה-SMS. שורה ראשונה = נושא כשלא נמסר נושא.
 * origin = כתובת האתר השולח (לקישור הביטול). optedOut=true → לא שולח.
 */
export async function sendEmailCopy(
    to: string | null | undefined,
    text: string,
    opts: { origin: string; subject?: string; fromName?: string; optedOut?: boolean },
): Promise<boolean> {
    try {
        const addr = (to ?? '').trim();
        if (opts.optedOut || !EMAIL_RE.test(addr)) return false;
        const key = process.env.RESEND_API_KEY;
        if (!key) return false;
        const subject = (opts.subject ?? text.split('\n')[0]).slice(0, 150);
        const unsub = unsubUrl(opts.origin, addr);
        const body = unsub ? `${text}\n\n---\nלהפסקת קבלת הודעות במייל: ${unsub}` : text;
        const html =
            `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;white-space:pre-line">` +
            esc(body).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>') +
            `</div>`;
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: `${opts.fromName ?? 'יוצאים לחירות'} <${FROM}>`,
                to: [addr],
                subject,
                text: body,
                html,
                ...(unsub ? { headers: { 'List-Unsubscribe': `<${unsub}>` } } : {}),
            }),
        });
        if (!res.ok) console.warn('[emailCopy] failed:', res.status, (await res.text().catch(() => '')).slice(0, 200));
        return res.ok;
    } catch (e) {
        console.warn('[emailCopy] failed:', e instanceof Error ? e.message : e);
        return false;
    }
}
