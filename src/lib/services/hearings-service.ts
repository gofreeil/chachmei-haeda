import {
	hearings as staticHearings,
	rulings as staticRulings,
	type Hearing,
	type HearingStatus,
	type LocalizedString,
	type Ruling
} from '$lib/data/hearings';
import { safeStrapiList, strapiPost, strapiPut, strapiDelete } from '$lib/strapi';

const HEARINGS = 'ch-hearings';
const RULINGS = 'ch-rulings';
const REQUESTS = 'ch-hearing-requests';

const STATUS_MAP_TO_HE: Record<string, HearingStatus> = {
	planned: 'מתוכנן',
	done: 'התקיים',
	cancelled: 'בוטל'
};
const STATUS_MAP_TO_BACKEND: Record<HearingStatus, string> = {
	'מתוכנן': 'planned',
	'התקיים': 'done',
	'בוטל': 'cancelled'
};

type StrapiHearingAttrs = {
	id?: number;
	documentId?: string;
	caseName?: LocalizedString;
	dayanim?: LocalizedString[];
	zoomLink?: string;
	hearingDate?: string;
	hearingTime?: string;
	status?: string;
	summary?: LocalizedString;
};

function fromStrapiHearing(item: StrapiHearingAttrs): Hearing & { documentId: string } {
	return {
		id: String(item.documentId ?? item.id ?? ''),
		documentId: String(item.documentId ?? item.id ?? ''),
		caseName: item.caseName ?? { he: '', en: '', ru: '' },
		dayanim: item.dayanim ?? [],
		zoomLink: item.zoomLink ?? '',
		date: item.hearingDate ?? '',
		time: item.hearingTime ?? '',
		status: STATUS_MAP_TO_HE[item.status ?? 'planned'] ?? 'מתוכנן'
	};
}

export async function loadHearings(): Promise<Hearing[]> {
	const list = await safeStrapiList<StrapiHearingAttrs>(HEARINGS, {
		sort: 'hearingDate:desc',
		'pagination[pageSize]': 200
	});
	if (list.length === 0) return [...staticHearings];
	return list.map(fromStrapiHearing);
}

type StrapiRulingAttrs = {
	id?: number;
	documentId?: string;
	caseRef?: string;
	caseName?: LocalizedString;
	dayanim?: LocalizedString[];
	rulingDate?: string;
	summary?: LocalizedString;
	decision?: LocalizedString;
};

function fromStrapiRuling(item: StrapiRulingAttrs): Ruling & { documentId: string } {
	return {
		id: String(item.documentId ?? item.id ?? ''),
		documentId: String(item.documentId ?? item.id ?? ''),
		caseId: item.caseRef ?? '',
		caseName: item.caseName ?? { he: '', en: '', ru: '' },
		dayanim: item.dayanim ?? [],
		date: item.rulingDate ?? '',
		summary: item.summary ?? { he: '', en: '', ru: '' },
		decision: item.decision ?? { he: '', en: '', ru: '' }
	};
}

export async function loadRulings(): Promise<Ruling[]> {
	const list = await safeStrapiList<StrapiRulingAttrs>(RULINGS, {
		sort: 'rulingDate:desc',
		'pagination[pageSize]': 200
	});
	if (list.length === 0) return [...staticRulings];
	return list.map(fromStrapiRuling);
}

export async function submitHearingRequest(input: {
	requesterName: string;
	requesterPhone?: string;
	requesterEmail?: string;
	oppositeParty?: string;
	caseDescription: string;
	amount?: string;
	documentsNotes?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
	try {
		await strapiPost(REQUESTS, {
			requesterName: input.requesterName.trim(),
			requesterPhone: input.requesterPhone?.trim() || undefined,
			requesterEmail: input.requesterEmail?.trim() || undefined,
			oppositeParty: input.oppositeParty?.trim() || undefined,
			caseDescription: input.caseDescription.trim(),
			amount: input.amount?.trim() || undefined,
			documentsNotes: input.documentsNotes?.trim() || undefined,
			status: 'pending'
		});
		return { ok: true };
	} catch (e) {
		return { ok: false, error: e instanceof Error ? e.message : String(e) };
	}
}

// ───────────────────────── Admin ─────────────────────────

export interface HearingRequest {
	id: number;
	documentId: string;
	requesterName: string;
	requesterPhone?: string;
	requesterEmail?: string;
	oppositeParty?: string;
	caseDescription: string;
	amount?: string;
	documentsNotes?: string;
	status: 'pending' | 'accepted' | 'rejected' | 'scheduled';
	createdAt?: string;
}

export async function loadHearingRequests(): Promise<HearingRequest[]> {
	const list = await safeStrapiList<HearingRequest>(REQUESTS, {
		sort: 'createdAt:desc',
		'pagination[pageSize]': 200
	}, { needAuth: true });
	return list as HearingRequest[];
}

export async function setRequestStatus(
	id: string,
	status: 'pending' | 'accepted' | 'rejected' | 'scheduled'
): Promise<void> {
	await strapiPut(REQUESTS, id, { status });
}

export async function deleteHearingRequest(id: string): Promise<void> {
	await strapiDelete(REQUESTS, id);
}

export async function createHearing(input: {
	caseName: string;
	dayanim: string[];
	zoomLink: string;
	date: string;
	time: string;
	status: HearingStatus;
}): Promise<void> {
	await strapiPost(HEARINGS, {
		caseName: { he: input.caseName, en: input.caseName, ru: input.caseName },
		dayanim: input.dayanim.filter(Boolean).map((d) => ({ he: d, en: d, ru: d })),
		zoomLink: input.zoomLink,
		hearingDate: input.date,
		hearingTime: input.time,
		status: STATUS_MAP_TO_BACKEND[input.status]
	});
}

export async function updateHearing(id: string, input: Partial<{
	caseName: string;
	dayanim: string[];
	zoomLink: string;
	date: string;
	time: string;
	status: HearingStatus;
}>): Promise<void> {
	const payload: any = {};
	if (input.caseName !== undefined) payload.caseName = { he: input.caseName, en: input.caseName, ru: input.caseName };
	if (input.dayanim !== undefined) payload.dayanim = input.dayanim.filter(Boolean).map((d) => ({ he: d, en: d, ru: d }));
	if (input.zoomLink !== undefined) payload.zoomLink = input.zoomLink;
	if (input.date !== undefined) payload.hearingDate = input.date;
	if (input.time !== undefined) payload.hearingTime = input.time;
	if (input.status !== undefined) payload.status = STATUS_MAP_TO_BACKEND[input.status];
	await strapiPut(HEARINGS, id, payload);
}

export async function deleteHearing(id: string): Promise<void> {
	await strapiDelete(HEARINGS, id);
}

export async function createRuling(input: {
	caseRef?: string;
	caseName: string;
	dayanim: string[];
	date: string;
	summary: string;
	decision: string;
}): Promise<void> {
	await strapiPost(RULINGS, {
		caseRef: input.caseRef,
		caseName: { he: input.caseName, en: input.caseName, ru: input.caseName },
		dayanim: input.dayanim.filter(Boolean).map((d) => ({ he: d, en: d, ru: d })),
		rulingDate: input.date,
		summary: { he: input.summary, en: input.summary, ru: input.summary },
		decision: { he: input.decision, en: input.decision, ru: input.decision }
	});
}

export async function deleteRuling(id: string): Promise<void> {
	await strapiDelete(RULINGS, id);
}
