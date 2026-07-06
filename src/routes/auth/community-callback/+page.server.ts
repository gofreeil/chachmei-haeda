import type { PageServerLoad } from './$types';

// חזרה מ-SSO של "יוצאים לחירות" (community.gofreeil.com/sso).
// קהילה כבר קבעה את העוגייה המשותפת `gofreeil-auth` על `.gofreeil.com`
// (httpOnly — לכן חייבים לקרוא אותה בצד שרת). היא מכילה את ה-JWT של
// ה-Strapi המשותף — בדיוק אותו Strapi (api.gofreeil.com) שחכמי העדה מדבר איתו,
// כך שאותו טוקן תקף כאן. אנחנו מאמתים אותו ומעבירים לדף הלקוח שישמור ב-localStorage.

const SHARED_COOKIE = 'gofreeil-auth';
const STRAPI_URL = 'https://api.gofreeil.com';

function safeReturn(raw: string | null): string {
	// רק נתיב פנימי — הגנה מ-open-redirect
	if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/profile';
	return raw;
}

export const load: PageServerLoad = async ({ cookies, url, fetch }) => {
	const returnTo = safeReturn(url.searchParams.get('returnTo'));

	// קהילה מסמנת כך שהמשתמש אינו רשום/מחובר
	if (url.searchParams.get('error')) {
		return { status: 'not_registered' as const, returnTo, jwt: null, name: null };
	}

	const jwt = cookies.get(SHARED_COOKIE);
	if (!jwt) {
		return { status: 'not_registered' as const, returnTo, jwt: null, name: null };
	}

	// אימות ה-JWT מול אותו Strapi המשותף
	try {
		const res = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
			headers: { Authorization: `Bearer ${jwt}` }
		});
		if (!res.ok) {
			// טוקן פג/לא תקף — מתייחסים כלא רשום
			return { status: 'not_registered' as const, returnTo, jwt: null, name: null };
		}
		const user = await res.json();
		const name: string | null = user?.username ?? user?.email ?? null;
		return { status: 'ok' as const, returnTo, jwt, name };
	} catch {
		return { status: 'error' as const, returnTo, jwt: null, name: null };
	}
};
