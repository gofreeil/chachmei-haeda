// ─────────────────────────────────────────────────────────────
// charter-service - שכבת גישה לחתימות אמנת UECC
//
// מקור האמת: Strapi (collection `ch-charter-signatures`)
// fallback: נתוני הדמו ב-charter.ts (אם הסטראפי לא זמין)
// ─────────────────────────────────────────────────────────────

import { writable } from 'svelte/store';
import {
	initialCharterEntries,
	type CharterEntry,
	type CharterStatus
} from '$lib/data/charter';
import { safeStrapiList, strapiGet, strapiPost, strapiPut, strapiDelete, getJwt } from '$lib/strapi';

const COLLECTION = 'ch-charter-signatures';

/** האם למשתמש המחובר יש חתימה בתוקף — משמש להסתרת באנר ההצטרפות בלייאאוט.
 *  מתעדכן ב-loadMyEntry (טעינה) וב-addSignatory (חתימה חדשה); מתאפס ביציאה. */
export const hasSignedCharter = writable(false);

// ── קאש מקומי לסטטוס החתימה — חוסך את קריאת /mine ברוב טעינות העמוד ──
// המפתח נגזר מה-JWT, כך שהתחברות של משתמש אחר (או מחדש) לא קוראת קאש ישן.
const SIGNED_CACHE_KEY = 'chachmei-charter-signed';
const SIGNED_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // בדיקה מול השרת לכל היותר פעם ביממה למכשיר

function signedCacheId(): string | null {
	const jwt = getJwt();
	return jwt ? jwt.slice(-32) : null;
}

function readSignedCache(): boolean | null {
	const id = signedCacheId();
	if (!id || typeof localStorage === 'undefined') return null;
	try {
		const raw = localStorage.getItem(SIGNED_CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as { id: string; signed: boolean; ts: number };
		if (parsed.id !== id || Date.now() - parsed.ts > SIGNED_CACHE_TTL_MS) return null;
		return parsed.signed;
	} catch {
		return null;
	}
}

function writeSignedCache(signed: boolean): void {
	const id = signedCacheId();
	if (!id || typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(SIGNED_CACHE_KEY, JSON.stringify({ id, signed, ts: Date.now() }));
	} catch {
		/* private mode / storage מלא — ממשיכים בלי קאש */
	}
}

/** עדכון hasSignedCharter לבאנר/פרופיל: קודם מהקאש המקומי; רק אם אין — קריאה אחת לשרת.
 *  קריאות מקבילות (לייאאוט + עמוד) חולקות את אותה בקשה. */
let refreshInFlight: Promise<void> | null = null;
export function refreshSignedCharter(): Promise<void> {
	if (!getJwt()) {
		hasSignedCharter.set(false);
		return Promise.resolve();
	}
	const cached = readSignedCache();
	if (cached !== null) {
		hasSignedCharter.set(cached);
		return Promise.resolve();
	}
	if (!refreshInFlight) {
		// loadMyEntry מעדכן את ה-store וכותב לקאש
		refreshInFlight = loadMyEntry().then(() => {
			refreshInFlight = null;
		});
	}
	return refreshInFlight;
}

type StrapiCharterAttrs = {
	id?: number;
	documentId?: string;
	name?: any;
	businessName?: any;
	role?: any;
	city?: any;
	email?: string;
	phone?: string;
	birthDate?: string;
	idNumber?: string;
	status?: CharterStatus;
	signedDate?: string;
	disqualifiedReason?: any;
	disqualifiedBy?: any;
	disqualifiedDate?: string;
	acceptedTerms?: boolean;
	createdAt?: string;
	publishedAt?: string;
};

function fromStrapi(item: StrapiCharterAttrs): CharterEntry {
	return {
		id: item.documentId ?? String(item.id ?? ''),
		name: item.name ?? '',
		businessName: item.businessName ?? undefined,
		role: item.role ?? undefined,
		city: item.city ?? undefined,
		email: item.email,
		phone: item.phone,
		birthDate: item.birthDate,
		idNumber: item.idNumber,
		status: (item.status as CharterStatus) ?? 'signed',
		date: item.signedDate ?? item.createdAt?.slice(0, 10) ?? '',
		disqualifiedReason: item.disqualifiedReason ?? undefined,
		disqualifiedBy: item.disqualifiedBy ?? undefined,
		disqualifiedDate: item.disqualifiedDate,
		acceptedTerms: item.acceptedTerms ?? true
	};
}

export async function loadEntries(): Promise<CharterEntry[]> {
	const list = await safeStrapiList<StrapiCharterAttrs>(COLLECTION, {
		sort: 'signedDate:desc',
		'pagination[pageSize]': 200
	});
	if (list.length === 0) return [...initialCharterEntries];
	return list.map(fromStrapi);
}

/** החתימה של המשתמש המחובר (התאמה לפי email בצד השרת — כולל השדות הפרטיים שלו). */
export async function loadMyEntry(): Promise<CharterEntry | null> {
	if (!getJwt()) {
		hasSignedCharter.set(false);
		return null;
	}
	try {
		const resp = await strapiGet<{ data: StrapiCharterAttrs | null }>(
			`${COLLECTION}/mine`, {}, { needAuth: true }
		);
		const entry = resp?.data ? fromStrapi(resp.data) : null;
		const signed = entry?.status === 'signed';
		hasSignedCharter.set(signed);
		writeSignedCache(signed);
		return entry;
	} catch {
		// תקלת רשת — לא נוגעים במצב הקיים כדי לא להקפיץ את הבאנר לחותם
		return null;
	}
}

/** עריכה עצמית: מותר לחותם עצמו, לסופר-אדמין ולרכז — האכיפה בצד השרת (self-update).
 *  ריק ('') → null (ניקוי). undefined → לא נוגעים. */
export async function selfUpdateSignatory(
	id: string,
	fields: {
		name?: string;
		businessName?: string;
		role?: string;
		city?: string;
		email?: string;
		phone?: string;
	}
): Promise<CharterEntry | null> {
	const payload: Record<string, any> = {};
	for (const [k, v] of Object.entries(fields)) {
		if (v === undefined) continue;
		payload[k] = typeof v === 'string' ? v.trim() : v;
	}
	// strapiPut בונה /api/<path>/<id> → כאן ה"מזהה" הוא <documentId>/self-update
	const resp = await strapiPut<{ ok: boolean; data: StrapiCharterAttrs }>(
		COLLECTION, `${id}/self-update`, payload
	);
	return resp?.data ? fromStrapi(resp.data) : null;
}

export async function addSignatory(input: {
	name: string;
	businessName?: string;
	role?: string;
	city?: string;
	email?: string;
	phone?: string;
	birthDate?: string;
	idNumber?: string;
	acceptedTerms: boolean;
}): Promise<CharterEntry> {
	const payload = {
		name: input.name.trim(),
		businessName: input.businessName?.trim() || undefined,
		role: input.role?.trim() || undefined,
		city: input.city?.trim() || undefined,
		email: input.email?.trim() || undefined,
		phone: input.phone?.trim() || undefined,
		birthDate: input.birthDate?.trim() || undefined,
		idNumber: input.idNumber?.trim() || undefined,
		status: 'signed' as CharterStatus,
		signedDate: new Date().toISOString().slice(0, 10),
		acceptedTerms: input.acceptedTerms
	};
	const resp = await strapiPost<{ data: StrapiCharterAttrs }>(COLLECTION, payload);
	hasSignedCharter.set(true);
	writeSignedCache(true);
	const item = (resp?.data ?? payload) as StrapiCharterAttrs;
	return fromStrapi({ ...payload, ...item });
}

/** עדכון פרטי חתימה קיימת (שם/עסק/תפקיד/עיר/מייל/טלפון/תאריך).
 *  שולח רק שדות שהוגדרו. ריק ('') → null (ניקוי השדה). undefined → לא נוגעים. */
export async function updateSignatory(
	id: string,
	fields: {
		name?: string;
		businessName?: string;
		role?: string;
		city?: string;
		email?: string;
		phone?: string;
		signedDate?: string;
	}
): Promise<void> {
	const payload: Record<string, any> = {};
	for (const [k, v] of Object.entries(fields)) {
		if (v === undefined) continue;
		const trimmed = typeof v === 'string' ? v.trim() : v;
		payload[k] = trimmed === '' ? null : trimmed;
	}
	if (Object.keys(payload).length === 0) return;
	await strapiPut(COLLECTION, id, payload);
}

export function filterByStatus(
	entries: CharterEntry[],
	status: CharterStatus
): CharterEntry[] {
	return entries.filter((e) => e.status === status);
}

// ───────────────────────── Admin ─────────────────────────

export async function disqualifyEntry(id: string, reason: string, by: string): Promise<void> {
	await strapiPut(COLLECTION, id, {
		status: 'disqualified',
		disqualifiedReason: reason,
		disqualifiedBy: by,
		disqualifiedDate: new Date().toISOString().slice(0, 10)
	});
}

export async function reinstateEntry(id: string): Promise<void> {
	await strapiPut(COLLECTION, id, {
		status: 'signed',
		disqualifiedReason: null,
		disqualifiedBy: null,
		disqualifiedDate: null
	});
}

export async function deleteEntry(id: string): Promise<void> {
	await strapiDelete(COLLECTION, id);
}
