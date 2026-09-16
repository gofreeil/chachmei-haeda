import type { PageServerLoad } from './$types';
import { getStrapiMe } from '$lib/server/strapiClient';

// זיהוי מראש דרך העוגייה המשותפת gofreeil-auth (.gofreeil.com): מי שכבר מחובר
// באתר אחר של יוצאים לחירות רואה "המשך כ-<שם>" בלחיצה אחת. עוגייה מתה או
// חסרה → null, וכפתור ה-SSO מוצג כאפשרות משנית בלבד (לא כהבטחה שתיכשל).
const SHARED_COOKIE = 'gofreeil-auth';

export const load: PageServerLoad = async ({ cookies }) => {
	let ssoName: string | null = null;
	const sharedJwt = cookies.get(SHARED_COOKIE);
	if (sharedJwt) {
		try {
			const me = await getStrapiMe(sharedJwt);
			if (me?.email) {
				ssoName = (me.name || me.username || me.email.split('@')[0] || '').trim() || 'חבר הקהילה';
			}
		} catch {
			/* Strapi לא זמין - מציגים את הדף הרגיל */
		}
	}
	return { ssoName };
};
