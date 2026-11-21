import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStrapiMe } from '$lib/server/strapiClient';
import { SHARED_COOKIE, sharedCookieOptions } from '$lib/server/recovery';

// נרשם/התחבר פעם אחת → מזוהה בכל אתרי הרשת. ההתחברות באתר הזה רצה בדפדפן
// (JWT ב-localStorage), ולכן הדפדפן מוסר כאן את ה-JWT והשרת כותב את העוגייה
// המשותפת gofreeil-auth (httpOnly, על .gofreeil.com) שכל אתר ברשת קורא.

const NO_STORE = { 'cache-control': 'private, no-store' };

/**
 * האם קיימת עוגייה משותפת (היא httpOnly — הדפדפן לא רואה אותה בעצמו).
 * עם ?adopt=1 (מבקר בלי חיבור מקומי) מוחזר גם ה-JWT, אבל רק אם הוא חי מול
 * Strapi — כך מי שהתחבר באתר אחר ברשת מזוהה כאן בלי שום פעולה. ה-JWT הזה
 * ממילא נשמר אצל הלקוח ב-localStorage, כך שאין חשיפה חדשה.
 */
export const GET: RequestHandler = async ({ cookies, url }) => {
	const jwt = cookies.get(SHARED_COOKIE);
	if (!jwt) return json({ shared: false }, { headers: NO_STORE });
	if (url.searchParams.get('adopt') !== '1') return json({ shared: true }, { headers: NO_STORE });
	const me = await getStrapiMe(jwt).catch(() => null);
	return json(me ? { shared: true, jwt } : { shared: true }, { headers: NO_STORE });
};

/** התנתקות כאן = התנתקות בכל הרשת (אחרת הזיהוי האוטומטי היה מחזיר את המשתמש). */
export const DELETE: RequestHandler = async ({ cookies, url }) => {
	cookies.delete(SHARED_COOKIE, { path: '/' });
	if (url.hostname === 'gofreeil.com' || url.hostname.endsWith('.gofreeil.com')) {
		cookies.delete(SHARED_COOKIE, { path: '/', domain: '.gofreeil.com' });
	}
	return json({ ok: true }, { headers: NO_STORE });
};

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
