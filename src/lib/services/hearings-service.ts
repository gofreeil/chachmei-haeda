import {
	hearings as staticHearings,
	rulings as staticRulings,
	type Hearing,
	type HearingStatus,
	type LocalizedString,
	type Ruling
} from '$lib/data/hearings';
import { safeStrapiList, strapiPost } from '$lib/strapi';

const HEARINGS = 'ch-hearings';
const RULINGS = 'ch-rulings';
const REQUESTS = 'ch-hearing-requests';

const STATUS_MAP_TO_HE: Record<string, HearingStatus> = {
	planned: 'מתוכנן',
	done: 'התקיים',
	cancelled: 'בוטל'
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

function fromStrapiHearing(item: StrapiHearingAttrs): Hearing {
	return {
		id: String(item.documentId ?? item.id ?? ''),
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

function fromStrapiRuling(item: StrapiRulingAttrs): Ruling {
	return {
		id: String(item.documentId ?? item.id ?? ''),
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

/** הגשת בקשה לדיון מהטופס /request-hearing. */
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
