import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { strapiGet, strapiPost } from '$lib/server/strapiClient';
import { viewerFromRequest } from '$lib/server/hearingCases';

interface Submission {
    askerName?: string;
    askerPhone?: string | null;
    status?: string;
}

// ספרות בלבד — מספיק כדי לדעת אם יש נייד שאפשר לשלוח אליו
const digits = (s: string) => s.replace(/\D/g, '');

// אדמין פרסם תשובה → SMS עם קישור לתשובה למי ששאל (אם השאיר נייד).
// הנייד נשלף בשרת מהשאלה השמורה — לא מגיע מהדפדפן.
export const POST: RequestHandler = async ({ request, url, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    if (!viewer) throw error(401, 'צריך להתחבר');
    if (!viewer.isAdmin) throw error(403, 'אין הרשאה');

    const raw = await request.json().catch(() => ({}));
    const submissionId = String(raw.submissionId ?? '').trim();
    const slug = String(raw.slug ?? '').trim();
    if (!submissionId || !/^[\w-]+$/.test(slug)) throw error(400, 'חסרים פרטים');

    const res = await strapiGet<{ data?: Submission }>(
        `/api/ch-question-submissions/${encodeURIComponent(submissionId)}`
    ).catch(() => null);
    const sub = res?.data;
    if (!sub) throw error(404, 'השאלה לא נמצאה');

    const phone = (sub.askerPhone ?? '').trim();
    if (digits(phone).length < 9) return json({ ok: true, sent: false, reason: 'no-phone' });

    const link = `${url.origin}/qa#${slug}`;
    const greet = sub.askerName ? `שלום ${sub.askerName}, ` : 'שלום, ';
    const message = `${greet}השאלה ששלחת לחכמי העדה נענתה 📚\nלצפייה בתשובה: ${link}`;
    try {
        const out = await strapiPost<{ results?: Array<{ ok: boolean; error?: string }> }>(
            '/api/admin/sms/send',
            { recipients: [{ phone }], message }
        );
        const ok = !!out?.results?.[0]?.ok;
        if (!ok) console.warn('[ask] answer SMS not sent:', out?.results?.[0]?.error ?? 'unknown');
        return json({ ok: true, sent: ok });
    } catch (err) {
        console.warn('[ask] answer SMS failed:', err instanceof Error ? err.message : err);
        return json({ ok: true, sent: false, reason: 'sms-failed' });
    }
};
