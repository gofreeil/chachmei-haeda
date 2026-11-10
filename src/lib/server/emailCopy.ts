// ============================================================
// emailCopy.ts — עותק במייל לכל SMS שנשלח למשתמש (Resend REST, בלי תלות חדשה)
//
// שולח מהדומיין המאומת gofreeil.com. best-effort: לעולם לא זורק, בלי
// RESEND_API_KEY פשוט מדלג. אותו קובץ משמש את אתרי הרשת — שינוי כאן ⇒ לעדכן שם.
// ============================================================

const FROM = process.env.NOTIFY_FROM_EMAIL || 'noreply@gofreeil.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** מייל עם אותו נוסח של ה-SMS. שורה ראשונה = נושא כשלא נמסר נושא. */
export async function sendEmailCopy(
    to: string | null | undefined,
    text: string,
    opts: { subject?: string; fromName?: string } = {},
): Promise<boolean> {
    try {
        const addr = (to ?? '').trim();
        if (!EMAIL_RE.test(addr)) return false;
        const key = process.env.RESEND_API_KEY;
        if (!key) return false;
        const subject = (opts.subject ?? text.split('\n')[0]).slice(0, 150);
        const html =
            `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;white-space:pre-line">` +
            esc(text).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>') +
            `</div>`;
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: `${opts.fromName ?? 'יוצאים לחירות'} <${FROM}>`, to: [addr], subject, text, html }),
        });
        if (!res.ok) console.warn('[emailCopy] failed:', res.status, (await res.text().catch(() => '')).slice(0, 200));
        return res.ok;
    } catch (e) {
        console.warn('[emailCopy] failed:', e instanceof Error ? e.message : e);
        return false;
    }
}
