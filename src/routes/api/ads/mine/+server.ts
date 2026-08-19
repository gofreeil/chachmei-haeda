import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireUser } from '$lib/server/adsAdmin';
import { getOwnerAssets } from '$lib/server/ownerAssets';

// "הנכסים שלי" — הפרסומות שהמשתמש המחובר שלח (עם המדדים שלהן).
// באתר הזה אין סשן-שרת, ולכן הדשבורד (/about/advertise/manage) מושך
// את הרשימה מכאן עם Authorization Bearer — מאומת בשרת מול Strapi.
export const GET: RequestHandler = async ({ request, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const user = await requireUser(request);
    const assets = await getOwnerAssets(user);
    return json({
        user: { name: user.name, email: user.email },
        ...assets,
    });
};
