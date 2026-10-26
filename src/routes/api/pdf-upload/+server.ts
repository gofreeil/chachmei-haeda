// ─────────────────────────────────────────────────────────────
// POST /api/pdf-upload — העלאת קובץ PDF לספריית המדיה של Strapi (אדמינים בלבד).
//
// לתפקיד chachmei_editor אין הרשאת upload בשרת המשותף (בכוונה — אחרת כל עורך
// היה יכול להעלות קבצים לספרייה), ולכן ההעלאה עוברת דרך שרת האתר עם
// STRAPI_TOKEN, בדיוק כמו בהעלאת תמונות באתרי הרשת האחרים. השער כאן: JWT של
// אדמין תוכן (ch_admin / super_admin) מאומת מול Strapi בכל בקשה.
//
// הגבלת גודל: 4MB — מתחת לתקרת גוף-הבקשה של פונקציות Vercel (4.5MB).
// ─────────────────────────────────────────────────────────────
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { STRAPI_URL } from '$lib/server/strapiClient';
import { requireUser, roleOf } from '$lib/server/adsAdmin';

const MAX_PDF_BYTES = 4 * 1024 * 1024;

/** כל PDF תקין נפתח ב-"%PDF-" — בודקים את הבייטים ולא רק את הסיומת/ה-MIME שהלקוח טוען. */
function looksLikePdf(bytes: Uint8Array): boolean {
	return bytes.length > 5 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d;
}

export const POST: RequestHandler = async ({ request }) => {
	let user;
	try {
		user = await requireUser(request);
	} catch {
		return json({ message: 'צריך להתחבר — היכנסו לחשבון ונסו שוב' }, { status: 401 });
	}
	if (!roleOf(user)) return json({ message: 'רק אדמין תוכן יכול להעלות קבצים' }, { status: 403 });
	if (!env.STRAPI_TOKEN) return json({ message: 'העלאת קבצים אינה מוגדרת בשרת' }, { status: 503 });

	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return json({ message: 'הבקשה אינה תקינה' }, { status: 400 });
	}
	const file = form.get('file');
	if (!(file instanceof File)) return json({ message: 'לא נשלח קובץ' }, { status: 400 });
	if (file.size > MAX_PDF_BYTES) {
		return json({ message: `הקובץ גדול מדי (עד ${MAX_PDF_BYTES / 1024 / 1024}MB)` }, { status: 413 });
	}
	const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
	if (!looksLikePdf(head)) return json({ message: 'הקובץ אינו PDF תקין' }, { status: 400 });

	// שם הקובץ מגיע מהמשתמש — משמש רק לתצוגה; האחסון בשרת נעשה בשם שהוא יוצר
	const safeName = file.name.replace(/[\\/\0]/g, '_').slice(0, 120) || 'document.pdf';
	const upstreamForm = new FormData();
	upstreamForm.append('files', new File([file], safeName, { type: 'application/pdf' }));

	let res: Response;
	try {
		res = await fetch(`${STRAPI_URL}/api/upload`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${env.STRAPI_TOKEN}` },
			body: upstreamForm
		});
	} catch {
		return json({ message: 'שרת הקבצים אינו זמין כרגע — נסו שוב בעוד כמה דקות' }, { status: 502 });
	}
	const result = (await res.json().catch(() => null)) as
		| Array<{ url?: string; name?: string; size?: number }>
		| { error?: { message?: string } }
		| null;
	if (!res.ok || !Array.isArray(result) || !result[0]?.url) {
		const msg = !Array.isArray(result) ? result?.error?.message : '';
		console.warn('[pdf-upload] Strapi upload failed:', res.status, msg);
		return json({ message: msg || 'העלאת הקובץ נכשלה' }, { status: res.ok ? 502 : res.status });
	}

	const stored = result[0];
	// ספק מקומי מחזיר נתיב יחסי (/uploads/...) — הופכים לכתובת מוחלטת של שרת ה-API
	const url = /^https?:\/\//i.test(stored.url!) ? stored.url! : `${STRAPI_URL}${stored.url}`;
	return json({ url, name: safeName, size: file.size });
};
