// ─────────────────────────────────────────────────────────────
// charter-service - שכבת גישה לנתוני האמנה
//
// כעת: שומר ב-localStorage של הדפדפן
// בעתיד: יחליפו את הקריאות ל-fetch מול Strapi
//
// כדי להתחבר לסטראפי:
//   1. הזן את ה-URL ב-STRAPI_BASE_URL (למשל https://cms.gofreeil.com)
//   2. החלף את ה-loadEntries / saveEntries בקריאות fetch
//   3. ראה הערות TODO בקוד
// ─────────────────────────────────────────────────────────────

import {
	initialCharterEntries,
	type CharterEntry,
	type CharterStatus
} from '$lib/data/charter';

const STORAGE_KEY = 'chachmei-charter-entries';

// TODO: כשמחברים ל-Strapi
// const STRAPI_BASE_URL = 'https://your-strapi.example.com';
// const STRAPI_TOKEN = '...';

function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/** טעינת כל הרשומות. בעתיד: GET /api/charter-entries מסטראפי */
export function loadEntries(): CharterEntry[] {
	if (!isBrowser()) return [...initialCharterEntries];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			// פעם ראשונה - אתחל עם נתוני הדמו
			localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCharterEntries));
			return [...initialCharterEntries];
		}
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) return parsed as CharterEntry[];
	} catch {}
	return [...initialCharterEntries];
}

/** שמירת כל הרשומות. בעתיד: PUT / POST לסטראפי */
function saveEntries(entries: CharterEntry[]): void {
	if (!isBrowser()) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
	} catch {}
}

function genId(): string {
	const t = (typeof Date !== 'undefined' ? Date.now() : 0).toString(36);
	const r = Math.floor(Math.random() * 1e6).toString(36);
	return `c-${t}-${r}`;
}

/** הוספת חתימה חדשה. בעתיד: POST /api/charter-entries לסטראפי */
export function addSignatory(input: {
	name: string;
	role?: string;
	city?: string;
	email?: string;
	phone?: string;
	birthDate?: string;
	idNumber?: string;
	acceptedTerms: boolean;
}): CharterEntry {
	const entry: CharterEntry = {
		id: genId(),
		name: input.name.trim(),
		role: input.role?.trim() || undefined,
		city: input.city?.trim() || undefined,
		email: input.email?.trim() || undefined,
		phone: input.phone?.trim() || undefined,
		birthDate: input.birthDate?.trim() || undefined,
		idNumber: input.idNumber?.trim() || undefined,
		status: 'signed',
		date: new Date().toISOString().slice(0, 10),
		acceptedTerms: input.acceptedTerms
	};
	const all = loadEntries();
	const next = [entry, ...all];
	saveEntries(next);
	return entry;
}

/** סינון לפי סטטוס */
export function filterByStatus(
	entries: CharterEntry[],
	status: CharterStatus
): CharterEntry[] {
	return entries.filter((e) => e.status === status);
}

/** מחיקה לפי id (לאדמין). בעתיד: DELETE לסטראפי */
export function deleteEntry(id: string): void {
	const next = loadEntries().filter((e) => e.id !== id);
	saveEntries(next);
}

/** שינוי סטטוס - חתימה → פסילה (לאדמין). בעתיד: PUT לסטראפי */
export function setStatus(
	id: string,
	status: CharterStatus,
	options?: { reason?: string; by?: string }
): void {
	const next = loadEntries().map((e) => {
		if (e.id !== id) return e;
		if (status === 'disqualified') {
			return {
				...e,
				status,
				disqualifiedReason: options?.reason,
				disqualifiedBy: options?.by,
				disqualifiedDate: new Date().toISOString().slice(0, 10)
			};
		}
		return { ...e, status };
	});
	saveEntries(next);
}
