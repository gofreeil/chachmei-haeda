import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { viewerFromRequest, getCaseView } from '$lib/server/hearingCases';

// דף התיק (/case/[id]) — פתוח לכל מי שקיבל את הקישור; מה מותר לו לאשר
// נקבע לפי ה-JWT (אם יש) בצד השרת.
export const GET: RequestHandler = async ({ params, request, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    return json(await getCaseView(params.id, viewer));
};
