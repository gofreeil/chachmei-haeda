// ─────────────────────────────────────────────────────────────
// charter-service - שכבת גישה לחתימות אמנת UECC
//
// מקור האמת: Strapi (collection `ch-charter-signatures`)
// fallback: נתוני הדמו ב-charter.ts (אם הסטראפי לא זמין)
// ─────────────────────────────────────────────────────────────

import {
	initialCharterEntries,
	type CharterEntry,
	type CharterStatus
} from '$lib/data/charter';
import { safeStrapiList, strapiPost, strapiPut, strapiDelete } from '$lib/strapi';

const COLLECTION = 'ch-charter-signatures';

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
