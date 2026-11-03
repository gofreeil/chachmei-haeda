// ─────────────────────────────────────────────────────────────
// POST /api/image-upload — העלאת תמונה לספריית המדיה של Strapi (אדמינים בלבד).
// אותו מנגנון כמו /api/pdf-upload: ההעלאה עוברת דרך שרת האתר עם STRAPI_TOKEN,
// והשער הוא JWT של אדמין תוכן. הסוג נבדק לפי הבייטים ולא לפי ה-MIME של הלקוח.
// ─────────────────────────────────────────────────────────────
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { STRAPI_URL } from '$lib/server/strapiClient';
import { requireUser, roleOf } from '$lib/server/adsAdmin';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function sniffImage(b: Uint8Array): 'image/jpeg' | 'image/png' | 'image/webp' | null {
	if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
	if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
	if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
	return null;
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
	if (file.size > MAX_IMAGE_BYTES) {
		return json({ message: `התמונה גדולה מדי (עד ${MAX_IMAGE_BYTES / 1024 / 1024}MB)` }, { status: 413 });
	}
	const type = sniffImage(new Uint8Array(await file.slice(0, 16).arrayBuffer()));
	if (!type) return json({ message: 'הקובץ אינו תמונה תקינה (JPG / PNG / WebP)' }, { status: 400 });

	const safeName = file.name.replace(/[\/\0]/g, '_').slice(0, 120) || 'image';
	const upstreamForm = new FormData();
	upstreamForm.append('files', new File([file], safeName, { type }));

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
		| Array<{ url?: string }>
		| { error?: { message?: string } }
		| null;
	if (!res.ok || !Array.isArray(result) || !result[0]?.url) {
		const msg = !Array.isArray(result) ? result?.error?.message : '';
		console.warn('[image-upload] Strapi upload failed:', res.status, msg);
		return json({ message: msg || 'העלאת התמונה נכשלה' }, { status: res.ok ? 502 : res.status });
	}
	const stored = result[0].url!;
	const url = /^https?:\/\//i.test(stored) ? stored : `${STRAPI_URL}${stored}`;
	return json({ url });
};
