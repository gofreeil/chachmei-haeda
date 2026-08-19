import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireUser } from '$lib/server/adsAdmin';
import { getAd, isAdOwner } from '$lib/server/adsStore';
import { getAdStats, type AdStats } from '$lib/server/adStats';
import { ownerCandidateKeys } from '$lib/server/ownership';
import { planFor } from '$lib/adPlans';

const STATS_DAYS = 14;

// דף ניהול הנכס של המפרסם: מדדים, עריכה מחדש וחידוש הפרסום.
// רק מי ששלח את המודעה רואה אותה (אימות מול submitted_by בכל קריאה).
export const GET: RequestHandler = async ({ params, request, setHeaders }) => {
    setHeaders({ 'cache-control': 'private, no-store' });
    const user = await requireUser(request);

    const ad = await getAd(params.id);
    if (!ad) throw error(404, 'הפרסומת לא נמצאה');
    if (!isAdOwner(ownerCandidateKeys(user), ad)) {
        throw error(403, 'רק מי שהעלה את הפרסומת יכול לנהל אותה. אם זו הפרסומת שלך — התחברו עם החשבון שממנו נשלחה.');
    }

    const stats = await getAdStats([ad.id], STATS_DAYS)
        .catch((): Record<string, AdStats> => ({}));
    const plan = planFor(ad.durationDays || ad.requestedDurationDays);

    return json({
        // כל התוכן חוזר ללקוח כדי שכפתור "ערוך" יוכל לטעון אותו לבונה
        ad: {
            id: ad.id,
            status: ad.status,
            title: ad.title,
            subtitle: ad.subtitle,
            hoverText: ad.hoverText,
            cta: ad.cta,
            gradient: ad.gradient,
            logo: ad.logo,
            mainImage: ad.mainImage,
            mainImageFit: ad.mainImageFit,
            landing: ad.landing,
            submittedAt: ad.submittedAt,
            editedAt: ad.editedAt,
            decidedAt: ad.decidedAt,
            rejectionReason: ad.rejectionReason,
            expiresAt: ad.expiresAt,
            durationDays: ad.durationDays,
            requestedDurationDays: ad.requestedDurationDays,
            payment: ad.payment,
        },
        plan,
        statsDays: STATS_DAYS,
        stats: stats[ad.id] ?? {
            totals: { impressions: 0, clicks: 0, landing: 0, leads: 0 },
            days: [],
        },
        notifyEmail: ad.submittedBy.email || user.email || '',
    });
};
