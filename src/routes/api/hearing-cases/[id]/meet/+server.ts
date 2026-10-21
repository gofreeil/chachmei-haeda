import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { viewerFromRequest, openCaseMeet, closeCaseMeet, caseMeetEntry } from '$lib/server/hearingCases';

// חדר המפגש של התיק (איתניום). GET — הקישור האישי לכניסה: בית הדין כמנחה,
// הצדדים כמשתתפים. POST — פתיחה/סגירה, לבית הדין בלבד (נבדק ב-hearingCases).
export const GET: RequestHandler = async ({ params, request, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    if (!viewer) throw error(401, 'צריך להתחבר כדי להיכנס לחדר המפגש');
    return json(await caseMeetEntry(params.id, viewer));
};

export const POST: RequestHandler = async ({ params, request, url, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    if (!viewer) throw error(401, 'צריך להתחבר');
    const { action } = await request.json().catch(() => ({}));
    if (action === 'open') return json(await openCaseMeet(params.id, viewer, url.origin));
    if (action === 'close') return json(await closeCaseMeet(params.id, viewer));
    throw error(400, 'פעולה לא מוכרת');
};
