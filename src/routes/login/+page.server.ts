import type { PageServerLoad } from './$types';
import { getStrapiMe } from '$lib/server/strapiClient';

// זיהוי מראש דרך העוגייה המשותפת gofreeil-auth (.gofreeil.com): מי שכבר מחובר
// באתר אחר של יוצאים לחירות רואה "המשך כ-<שם>" בלחיצה אחת. עוגייה מתה או
// חסרה → null, וכפתור ה-SSO מוצג כאפשרות משנית בלבד (לא כהבטחה שתיכשל).
const SHARED_COOKIE = 'gofreeil-auth';

// username שנוצר אוטומטית בהתחברות חברתית (google_1164…, facebook_123…) הוא מזהה, לא שם.
const MACHINE_USERNAME = /^[a-z][a-z0-9]*[_-]\d{5,}$/i;

function friendlyName(me: { nickname?: string | null; name?: string | null; username?: string | null; email: string }): string {
	for (const raw of [me.nickname, me.name, me.username]) {
		const s = (raw ?? '').trim();
		if (s && !s.includes('@') && !MACHINE_USERNAME.test(s)) return s;
	}
	return (me.email.split('@')[0] ?? '').trim();
}

export const load: PageServerLoad = async ({ cookies }) => {
	let ssoName: string | null = null;
	const sharedJwt = cookies.get(SHARED_COOKIE);
	if (sharedJwt) {
		try {
			const me = await getStrapiMe(sharedJwt);
			if (me?.email) {
				ssoName = friendlyName(me) || 'חבר הקהילה';
			}
		} catch {
			/* Strapi לא זמין - מציגים את הדף הרגיל */
		}
	}
	return { ssoName };
};
