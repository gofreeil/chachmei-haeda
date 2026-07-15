// ─────────────────────────────────────────────────────────────
// admin-users-service — ניהול אדמינים ורשימת רשומים (סופר-אדמין בלבד)
//
// endpoints מותאמים בבקאנד (users-permissions extension):
//   GET  /ch-admins?q=…       — רשימת אדמינים / חיפוש משתמש
//   GET  /ch-users?q=…        — רשימת כל הרשומים (לתצוגה קומפקטית בפאנל)
//   POST /ch-admins/set-role  — מינוי ch_admin או החזרה ל-user
// האכיפה (סופר-אדמין בלבד) נעשית בצד השרת.
// ─────────────────────────────────────────────────────────────

import { strapiGet, strapiPost } from '$lib/strapi';

export interface AdminUser {
	id: number;
	email: string;
	username?: string;
	nickname?: string;
	app_role: string;
}

/** משתמש רשום — כפי שמוחזר מ-/ch-users (שדות בטוחים בלבד) */
export interface RegisteredUser extends AdminUser {
	city?: string;
	phone?: string;
	confirmed?: boolean;
	blocked?: boolean;
	createdAt?: string;
}

/** בלי q — כל האדמינים הקיימים; עם q — חיפוש משתמש לפי מייל/שם (עד 20 תוצאות) */
export async function listAdmins(q?: string): Promise<AdminUser[]> {
	const params: Record<string, string> = {};
	if (q?.trim()) params.q = q.trim();
	const resp = await strapiGet<{ data: AdminUser[] }>('ch-admins', params, { needAuth: true });
	return resp?.data ?? [];
}

/** כל המשתמשים הרשומים לאתר (חדשים תחילה). q — סינון אופציונלי בצד השרת. */
export async function listAllUsers(q?: string): Promise<RegisteredUser[]> {
	const params: Record<string, string> = {};
	if (q?.trim()) params.q = q.trim();
	const resp = await strapiGet<{ data: RegisteredUser[] }>('ch-users', params, { needAuth: true });
	return resp?.data ?? [];
}

export async function setAdminRole(email: string, role: 'ch_admin' | 'user'): Promise<void> {
	await strapiPost('ch-admins/set-role', { email, role }, { needAuth: true, raw: true });
}
