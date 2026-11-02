import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { viewerFromRequest } from '$lib/server/hearingCases';
import { listDayanim, sendRoomInvites } from '$lib/server/roomInvites';

// הזמנה להיכל משפט — לבית הדין בלבד (נבדק ב-roomInvites).
// GET: הדיינים שאפשר להזמין. POST: שליחת הקישור למוזמנים שנבחרו.
export const GET: RequestHandler = async ({ request, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    if (!viewer) throw error(401, 'צריך להתחבר');
    return json({ dayanim: await listDayanim(viewer) });
};

export const POST: RequestHandler = async ({ request, url, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    if (!viewer) throw error(401, 'צריך להתחבר');
    const body = await request.json().catch(() => ({}));
    return json({ results: await sendRoomInvites(viewer, url.origin, body) });
};
