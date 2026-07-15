// ─────────────────────────────────────────────────────────────
// Proxy שקוף ל-Strapi (api.gofreeil.com).
//
// למה: הדפדפן קורא כאן ל-same-origin (`/api/...` על הדומיין של האתר), ו-Vercel/השרת
// מעביר את הבקשה אל שרת ה-API מאחורי הקלעים. כך הדפדפן לעולם לא פונה ישירות
// ל-api.gofreeil.com — ומשתמשים שאצלם הדומיין הזה חסום (חוסם-פרסומות / DNS מסנן /
// רשת/VPN) כבר לא מקבלים "failed to fetch" בהרשמה / התחברות / חתימה.
//
// הערות:
//  • קריאות צד-שרת (SSR) פונות ישירות ל-Strapi ולא עוברות דרך כאן (ראה BASE_URL ב-strapi.ts).
//  • אין CORS כאן — הבקשה היא same-origin, אז אין preflight כלל.
//  • ה-JWT עובר בכותרת Authorization (לא בעוגיות), לכן די להעביר אותה כמו-שהיא.
//  • OAuth (ניווט-דף-מלא) לא עובר כאן — הוא פונה ישירות לדומיין ה-API.
// ─────────────────────────────────────────────────────────────
import type { RequestHandler } from './$types';

const BACKEND = 'https://api.gofreeil.com';

// כותרות שאסור להעביר הלאה (hop-by-hop / כאלה שיסביבו בעיה).
const SKIP_REQUEST_HEADERS = new Set(['host', 'connection', 'content-length', 'accept-encoding']);

const handle: RequestHandler = async ({ params, request, url }) => {
	const path = params.path ?? '';
	const target = `${BACKEND}/api/${path}${url.search}`;

	const headers = new Headers();
	for (const [key, value] of request.headers) {
		if (!SKIP_REQUEST_HEADERS.has(key.toLowerCase())) headers.set(key, value);
	}

	const init: RequestInit = { method: request.method, headers };
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		init.body = await request.arrayBuffer();
	}

	let upstream: Response;
	try {
		upstream = await fetch(target, init);
	} catch {
		return new Response(JSON.stringify({ error: { message: 'Upstream unreachable' } }), {
			status: 502,
			headers: { 'content-type': 'application/json' }
		});
	}

	// מעבירים רק כותרות תוכן רלוונטיות (בלי CORS/hop-by-hop — הבקשה same-origin).
	const outHeaders = new Headers();
	const ct = upstream.headers.get('content-type');
	if (ct) outHeaders.set('content-type', ct);
	const cd = upstream.headers.get('content-disposition');
	if (cd) outHeaders.set('content-disposition', cd);

	const body = await upstream.arrayBuffer();
	return new Response(body, { status: upstream.status, headers: outHeaders });
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
