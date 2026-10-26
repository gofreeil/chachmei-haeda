import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { viewerFromRequest, roomBoard } from '$lib/server/hearingCases';
import { openGeneralRoom, enterGeneralRoom, joinGeneralRoom } from '$lib/server/generalRooms';

// לוח חדרי הדיון לאזור "חדר הדיון הוירטואלי" בהיכל המשפט: בית הדין רואה את
// כל התיקים (ופותח/נכנס/סוגר משם), צד בתיק — רק את התיקים שלו.
export const GET: RequestHandler = async ({ request, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    if (!viewer) throw error(401, 'צריך להתחבר');
    return json(await roomBoard(viewer));
};

// "חדר כללי" (לא קשור לתיק): בית הדין פותח וחוזר אליו; מי שקיבל הזמנה נכנס —
// גם בלי חשבון, כי ההזמנה עצמה היא ההרשאה.
export const POST: RequestHandler = async ({ request, url, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    const { action, token } = await request.json().catch(() => ({}));
    if (action === 'join-invite') return json(joinGeneralRoom(String(token ?? ''), viewer));
    if (!viewer) throw error(401, 'צריך להתחבר');
    if (action === 'open-general') return json(await openGeneralRoom(viewer, url.origin));
    if (action === 'enter-general') return json(enterGeneralRoom(String(token ?? ''), viewer));
    throw error(400, 'פעולה לא מוכרת');
};
