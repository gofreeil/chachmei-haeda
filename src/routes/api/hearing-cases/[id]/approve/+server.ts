import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { viewerFromRequest, approveCase, type Party } from '$lib/server/hearingCases';

const PARTIES: Party[] = ['plaintiff', 'defendant', 'beitDin'];

// אישור המועד בשם אחד הצדדים — כל צד רק בשם עצמו (נבדק ב-approveCase).
export const POST: RequestHandler = async ({ params, request, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    if (!viewer) throw error(401, 'צריך להתחבר כדי לאשר');
    const { party } = await request.json().catch(() => ({}));
    if (!PARTIES.includes(party)) throw error(400, 'צד לא מוכר');
    return json(await approveCase(params.id, party, viewer));
};
