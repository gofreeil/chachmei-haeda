// ============================================================
// adsAdmin.ts — אימות צד-שרת של סטודיו הפרסומות (חכמי העדה)
//
// לאתר הזה אין hooks.server ואין סשן-שרת: ההתחברות היא JWT של
// users-permissions שנשמר ב-localStorage, וכל בדיקות התפקיד הקיימות
// באתר רצות בצד הלקוח. זה לא מספיק לסטודיו: ה-endpoints שלו רצים עם
// STRAPI_TOKEN רב-הרשאות, ובלי אימות שרת כל בקשת POST ישירה הייתה
// הופכת את מסך האישור ל-API פתוח.
//
// לכן כאן כל בקשה מוגנת חייבת לשאת Authorization: Bearer <jwt> —
// בדיוק הכותרת שהקליינט הקיים (src/lib/strapi.ts) כבר שולח לכל
// קריאת needAuth. השרת מאמת את ה-JWT מול /api/users/me ב-Strapi
// המשותף וקורא משם את app_role. שום דגל מהדפדפן לא נחשב.
//
// תפקידי ניהול: super_admin (גלובלי לרשת) או ch_admin (האדמין
// המקומי של חכמי העדה). בעל האתר (OWNER_EMAIL) תמיד סופר-אדמין.
// ============================================================

import { error } from '@sveltejs/kit';
import { getStrapiMe } from './strapiClient';

export const OWNER_EMAIL = 'yahavanter@gmail.com';

export const ADMIN_ROLES = ['super_admin', 'ch_admin'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface AuthedUser {
    id: string;
    email: string;
    name: string;
    appRole: string | null;
}

export interface AdminContext {
    user: AuthedUser;
    role: AdminRole;
    superAdmin: boolean;
}

/** קורא את ה-JWT מכותרת Authorization: Bearer. null כשאין. */
function bearerOf(request: Request): string | null {
    const h = request.headers.get('authorization') ?? '';
    const m = /^Bearer\s+(.+)$/i.exec(h.trim());
    return m ? m[1].trim() : null;
}

/**
 * המשתמש המחובר לפי ה-JWT שבבקשה — מאומת מול Strapi בכל קריאה.
 * null כשאין כותרת או שה-JWT פג/מזויף. לא זורק: הקורא מחליט מה
 * הודעת השגיאה המתאימה.
 */
export async function userFromRequest(request: Request): Promise<AuthedUser | null> {
    const jwt = bearerOf(request);
    if (!jwt) return null;
    const me = await getStrapiMe(jwt);
    if (!me) return null;
    return {
        id: String(me.id ?? ''),
        email: (me.email ?? '').trim(),
        name: (me.name ?? me.username ?? '').trim(),
        appRole: typeof me.app_role === 'string' ? me.app_role : null,
    };
}

/** חובה להיות מחובר — 401 עם הודעה בעברית כשלא. */
export async function requireUser(request: Request): Promise<AuthedUser> {
    const user = await userFromRequest(request);
    if (!user) {
        throw error(401, 'צריך להתחבר — היכנסו לחשבון ונסו שוב');
    }
    return user;
}

function roleOf(user: AuthedUser): AdminRole | null {
    if (user.email.toLowerCase() === OWNER_EMAIL) return 'super_admin';
    return user.appRole === 'super_admin' || user.appRole === 'ch_admin'
        ? user.appRole
        : null;
}

/**
 * שערת הניהול: כל פעולת אישור/דחייה/השהיה/קציבה/סידור חייבת לעבור
 * כאן, בצד השרת. 401 בלי התחברות, 403 בלי תפקיד ניהול.
 */
export async function getAdminContext(request: Request): Promise<AdminContext> {
    const user = await requireUser(request);
    const role = roleOf(user);
    if (!role) throw error(403, 'אין לך הרשאת גישה לניהול הפרסומות');
    return { user, role, superAdmin: role === 'super_admin' };
}
