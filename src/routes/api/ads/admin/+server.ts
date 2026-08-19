import { json, error, isHttpError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAdminContext } from '$lib/server/adsAdmin';
import {
    listAllForAdmin,
    approveAd,
    rejectAd,
    unapproveAd,
    moveApprovedAd,
    setAdSlot,
    computeAdSlots,
    setAdDuration,
    normalizeDurationDays,
    pauseAd,
    resumeAd,
} from '$lib/server/adsStore';
import { getAdStats, type AdStats, type AdCounters } from '$lib/server/adStats';
import { normalizePlanDays, planLabel } from '$lib/adPlans';
import { rightAds } from '$lib/rightAdsData';

// ============================================================
// ה-API של מסך ניהול הפרסומות (/admin/ads).
// באתר הזה אין סשן-שרת ואין form actions מאומתים, ולכן המסך עובד
// ב-fetch: GET מחזיר את כל הנתונים, POST מבצע פעולה. *כל* קריאה
// עוברת את getAdminContext — אימות Bearer מול Strapi בצד השרת.
// בלי זה ה-STRAPI_TOKEN רב-ההרשאות היה הופך את המסך ל-API פתוח.
// ============================================================

const DAY_MS = 24 * 60 * 60 * 1000;
const EMPTY: AdCounters = { impressions: 0, clicks: 0, landing: 0, leads: 0 };

function sumDays(st: AdStats | undefined): AdCounters {
    return (st?.days ?? []).reduce(
        (acc, d) => ({
            impressions: acc.impressions + d.impressions,
            clicks: acc.clicks + d.clicks,
            landing: acc.landing + d.landing,
            leads: acc.leads + d.leads,
        }),
        { ...EMPTY },
    );
}

export const GET: RequestHandler = async ({ request, setHeaders }) => {
    await getAdminContext(request);
    setHeaders({ 'cache-control': 'private, no-store' });

    let raw: Awaited<ReturnType<typeof listAllForAdmin>> = [];
    let backendUnavailable = false;
    try {
        raw = await listAllForAdmin();
    } catch (err) {
        console.error('admin/ads load failed:', err);
        backendUnavailable = true;
    }

    // המדדים של כל המודעות + סכום 7 הימים האחרונים (למגמה)
    const stats = await getAdStats(raw.map((a) => a.id), 7)
        .catch((): Record<string, AdStats> => ({}));

    const now = Date.now();
    // המספר הקבוע של כל מודעה מאושרת בלוח (1..16) — חישוב בזיכרון בלבד,
    // בלי כתיבה ל-Strapi; ההצמדה נעשית בפעולות הניהול עצמן.
    const slotMap = computeAdSlots(raw.filter((a) => a.status === 'approved'));
    // סדר הלוח בין המודעות *שבאוויר* — לחצי ההחלפה (מי שכנה של מי, והקצוות)
    const liveOrder = raw
        .filter((a) => a.status === 'approved')
        .filter((a) => !a.expiresAt || Date.parse(a.expiresAt) > now)
        .filter((a) => !a.paused)
        .slice()
        .sort((x, y) => (slotMap.get(x.id) ?? 0) - (slotMap.get(y.id) ?? 0))
        .map((a) => a.id);

    const ads = raw.map((a) => {
        const st = stats[a.id];
        const expiresTs = a.expiresAt ? Date.parse(a.expiresAt) : NaN;
        const daysLeft = Number.isNaN(expiresTs) ? null : Math.ceil((expiresTs - now) / DAY_MS);
        // אושרה ופג תוקפה — כבר לא תופסת משבצת (הרשומה נשארת לארכיון)
        const isExpired = a.status === 'approved' && daysLeft !== null && daysLeft <= 0;
        // מושהית: אושרה, לא פגה, אבל ירדה מהאתר עד להפעלה מחדש
        const isPaused = a.status === 'approved' && !isExpired && !!a.paused;
        const isActive = a.status === 'approved' && !isExpired && !isPaused;
        const totalDays = a.durationDays || null;
        // כמה מהתקופה נוצל — לפס ההתקדמות בלוח התפוסה
        const usedPct = isExpired
            ? 100
            : isActive && totalDays && daysLeft !== null
              ? Math.min(100, Math.max(0, Math.round((1 - daysLeft / totalDays) * 100)))
              : 0;
        return {
            ...a,
            totals: st?.totals ?? { ...EMPTY },
            week: sumDays(st),
            daysLeft,
            totalDays,
            usedPct,
            isActive,
            isExpired,
            isPaused,
            // מספר המקום הקבוע בלוח (1..16) — מה שהבורר "⇄ העבר" משנה
            slot: slotMap.get(a.id) ?? null,
            slotIndex: liveOrder.indexOf(a.id),
            slotTotal: liveOrder.length,
        };
    });

    const activeCount = ads.filter((a) => a.isActive).length;
    const inventory = {
        totalSlots: rightAds.length,
        occupied: Math.min(activeCount, rightAds.length),
        freeNow: Math.max(0, rightAds.length - activeCount),
        pending: ads.filter((a) => a.status === 'pending').length,
        expired: ads.filter((a) => a.isExpired).length,
    };

    return json({ ads, inventory, backendUnavailable });
};

// ---------- פעולות ----------

type ActionBody = {
    action?: string;
    id?: string;
    reason?: string;
    days?: number;
    durationDays?: number;
    keepPrevious?: boolean;
    dir?: string;
    slot?: number;
};

export const POST: RequestHandler = async ({ request }) => {
    const { user } = await getAdminContext(request);
    const decidedBy = user.email || user.name || '';

    let body: ActionBody;
    try {
        body = await request.json();
    } catch {
        throw error(400, 'גוף הבקשה חייב להיות JSON תקין');
    }
    const id = String(body.id ?? '');
    if (!id) throw error(400, 'חסר מזהה פרסומת');

    try {
        switch (body.action) {
            case 'approve': {
                // משך הפרסום נקבע כאן ולא ע"י המפרסם — לפי מה ששולם בפועל.
                const durationDays = normalizePlanDays(body.durationDays);
                const { replacedTitle } = await approveAd(id, {
                    durationDays,
                    decidedBy,
                    keepPrevious: body.keepPrevious === true,
                });
                return json({
                    ok: true,
                    message: replacedTitle
                        ? `הפרסומת אושרה ונכנסה במקום "${replacedTitle}", שירדה מהאתר ✅`
                        : `הפרסומת אושרה ופורסמה ל-${planLabel(durationDays)} ✅`,
                });
            }
            case 'reject': {
                await rejectAd(id, { reason: String(body.reason ?? ''), decidedBy });
                return json({ ok: true, message: 'הפרסומת נדחתה' });
            }
            case 'unapprove': {
                await unapproveAd(id, decidedBy);
                return json({ ok: true, message: 'הפרסומת הורדה מהאתר וחזרה לממתינות' });
            }
            case 'setDuration': {
                const days = normalizeDurationDays(body.days);
                const r = await setAdDuration(id, days);
                if (!r) throw error(404, 'הפרסומת לא נמצאה');
                const suffix = r.daysLeft < 0 ? ' — התקופה כבר חלפה, הפרסומת ירדה מהאתר' : '';
                return json({ ok: true, message: `${r.title}: ${days} ימים${suffix}` });
            }
            case 'pause': {
                const r = await pauseAd(id);
                if (!r) throw error(404, 'הפרסומת לא נמצאה');
                return json({ ok: true, message: `${r.title} הושהתה — ${r.daysLeft} ימים שמורים לה` });
            }
            case 'resume': {
                const r = await resumeAd(id);
                if (!r) throw error(404, 'הפרסומת לא נמצאה');
                return json({ ok: true, message: `${r.title} חזרה לאוויר — ${r.daysLeft} ימים` });
            }
            case 'move': {
                const r = await moveApprovedAd(id, body.dir === 'down' ? 'down' : 'up');
                if (!r) throw error(400, 'הפרסומת כבר בקצה הטור');
                return json({ ok: true, message: `${r.title} — משבצת ${r.position} מתוך ${r.total}` });
            }
            case 'setSlot': {
                const r = await setAdSlot(id, Number(body.slot));
                if (!r) throw error(404, 'הפרסומת לא נמצאה');
                return json({
                    ok: true,
                    message: r.swappedTitle
                        ? `"${r.title}" עברה למקום ${r.slot}, ו"${r.swappedTitle}" עברה למקום ${r.swappedSlot}`
                        : `"${r.title}" עברה למקום ${r.slot}`,
                });
            }
            default:
                throw error(400, 'פעולה לא מוכרת');
        }
    } catch (err) {
        if (isHttpError(err)) throw err;
        console.error(`admin/ads action "${body.action}" failed:`, err);
        throw error(502, 'הפעולה נכשלה — נסו שוב');
    }
};
