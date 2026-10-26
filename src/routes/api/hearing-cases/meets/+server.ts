import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { viewerFromRequest, listOpenMeets } from '$lib/server/hearingCases';

// חדרי המפגש הפתוחים שהמשתמש המחובר נכנס אליהם — לאזור "חדר הדיון הוירטואלי"
// בהיכל המשפט. בית הדין רואה את כולם, צד בתיק רק את התיקים שלו.
export const GET: RequestHandler = async ({ request, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    if (!viewer) throw error(401, 'צריך להתחבר');
    return json(await listOpenMeets(viewer));
};
