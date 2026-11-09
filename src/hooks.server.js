// נתיבי סריקה של בוטים (וורדפרס/PHP/קבצי סודות) — לאתר הזה אין אף אחד מהם. בלי הקיצור כל
// ניסיון כזה מרנדר את דף ה-404 המלא (כולל ה-layout) ועולה זמן CPU; עונים בשורה אחת, ו-s-maxage
// נותן ל-CDN של Vercel לזכור את התשובה כך שחזרה על אותו נתיב לא מגיעה לפונקציה.
const JUNK_PATH =
	/\.(?:php\d*|aspx?|jsp|cgi)$|^\/(?:wp-[^/]*|wordpress|phpmyadmin|cgi-bin|\.env[^/]*|\.git|\.aws|\.ssh)(?:\/|$)/i;

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (event.request.method === 'GET' && JUNK_PATH.test(event.url.pathname)) {
		return new Response('Not found', {
			status: 404,
			headers: {
				'content-type': 'text/plain; charset=utf-8',
				'cache-control': 'public, s-maxage=86400'
			}
		});
	}
	return resolve(event);
}
