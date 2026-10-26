import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { viewerFromRequest, roomBoard } from '$lib/server/hearingCases';

// לוח חדרי הדיון לאזור "חדר הדיון הוירטואלי" בהיכל המשפט: בית הדין רואה את
// כל התיקים (ופותח/נכנס/סוגר משם), צד בתיק — רק את התיקים שלו.
export const GET: RequestHandler = async ({ request, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    if (!viewer) throw error(401, 'צריך להתחבר');
    return json(await roomBoard(viewer));
};
