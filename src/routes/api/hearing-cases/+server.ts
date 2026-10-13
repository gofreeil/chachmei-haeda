import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { viewerFromRequest, createCase } from '$lib/server/hearingCases';

// פתיחת תיק דין תורה — רק למשתמש רשום ומחובר, שנרשם כתובע בתיק.
// עם הפתיחה האדמינים מקבלים הודעה + SMS עם קישור לאישור התיק.
export const POST: RequestHandler = async ({ request, url, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const viewer = await viewerFromRequest(request);
    if (!viewer) throw error(401, 'כדי לפתוח תיק צריך להירשם ולהתחבר');
    const body = await request.json().catch(() => ({}));
    return json(await createCase(viewer, body, url.origin));
};
