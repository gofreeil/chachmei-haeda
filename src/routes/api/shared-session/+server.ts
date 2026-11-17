import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStrapiMe } from '$lib/server/strapiClient';
import { SHARED_COOKIE, sharedCookieOptions } from '$lib/server/recovery';

// נרשם/התחבר פעם אחת → מזוהה בכל אתרי הרשת. ההתחברות באתר הזה רצה בדפדפן
// (JWT ב-localStorage), ולכן הדפדפן מוסר כאן את ה-JWT והשרת כותב את העוגייה
// המשותפת gofreeil-auth (httpOnly, על .gofreeil.com) שכל אתר ברשת קורא.

const NO_STORE = { 'cache-control': 'private, no-store' };

/** האם קיימת עוגייה משותפת (היא httpOnly — הדפדפן לא רואה אותה בעצמו). */
export const GET: RequestHandler = async ({ cookies }) =>
	json({ shared: !!cookies.get(SHARED_COOKIE) }, { headers: NO_STORE });

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const body = (await request.json().catch(() => null)) as { jwt?: unknown } | null;
	const jwt = typeof body?.jwt === 'string' ? body.jwt : '';
	if (!jwt) return json({ ok: false }, { status: 400, headers: NO_STORE });
	// רק JWT חי של ה-Strapi המשותף נכתב לעוגייה
	const me = await getStrapiMe(jwt).catch(() => null);
	if (!me) return json({ ok: false }, { status: 401, headers: NO_STORE });
	cookies.set(SHARED_COOKIE, jwt, sharedCookieOptions(url));
	return json({ ok: true }, { headers: NO_STORE });
};
