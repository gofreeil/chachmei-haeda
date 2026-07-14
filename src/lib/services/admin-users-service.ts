// ─────────────────────────────────────────────────────────────
// admin-users-service — ניהול אדמינים מוגבלים (סופר-אדמין בלבד)
//
// endpoints מותאמים בבקאנד (users-permissions extension):
//   GET  /ch-admins?q=…       — רשימת אדמינים / חיפוש משתמש
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

/** בלי q — כל האדמינים הקיימים; עם q — חיפוש משתמש לפי מייל/שם (עד 20 תוצאות) */
export async function listAdmins(q?: string): Promise<AdminUser[]> {
	const params: Record<string, string> = {};
	if (q?.trim()) params.q = q.trim();
	const resp = await strapiGet<{ data: AdminUser[] }>('ch-admins', params, { needAuth: true });
	return resp?.data ?? [];
}

export async function setAdminRole(email: string, role: 'ch_admin' | 'user'): Promise<void> {
	await strapiPost('ch-admins/set-role', { email, role }, { needAuth: true, raw: true });
}
