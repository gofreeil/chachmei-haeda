// ─────────────────────────────────────────────────────────────
// admin-users-service — ניהול אדמינים ורשימת רשומים (סופר-אדמין בלבד)
//
// endpoints מותאמים בבקאנד (users-permissions extension):
//   GET  /ch-admins?q=…             — רשימת אדמינים / חיפוש משתמש
//   GET  /ch-users?scope=community  — רשומים ששייכים לחכמי העדה (+ othersCount)
//   GET  /ch-users?scope=others     — שאר הרשומים (מאתרי gofreeil אחרים)
//   POST /ch-admins/set-role        — מינוי ch_admin או החזרה ל-user
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

/** רשומים ששייכים לחכמי העדה (מי שביצע פעולה באתר / אדמין), חדשים תחילה.
 *  מחזיר גם את מספר "שאר הרשומים" — לתצוגה על הכפתור בלי לטעון אותם. */
export async function listCommunityUsers(): Promise<{ users: RegisteredUser[]; othersCount: number }> {
	const resp = await strapiGet<{ data: RegisteredUser[]; othersCount?: number }>(
		'ch-users',
		{ scope: 'community' },
		{ needAuth: true }
	);
	return { users: resp?.data ?? [], othersCount: resp?.othersCount ?? 0 };
}

/** שאר הרשומים — כאלה שאין להם פעילות בחכמי העדה (הגיעו מאתרי gofreeil אחרים). */
export async function listOtherUsers(): Promise<RegisteredUser[]> {
	const resp = await strapiGet<{ data: RegisteredUser[] }>(
		'ch-users',
		{ scope: 'others' },
		{ needAuth: true }
	);
	return resp?.data ?? [];
}

export async function setAdminRole(email: string, role: 'ch_admin' | 'user'): Promise<void> {
	await strapiPost('ch-admins/set-role', { email, role }, { needAuth: true, raw: true });
}
