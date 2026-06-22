import { qa as staticQa, type QaItem, type QaTopic, type LocalizedText } from '$lib/data/qa';
import { safeStrapiList, strapiPost, strapiPut, strapiDelete } from '$lib/strapi';

const COLLECTION = 'ch-qa-items';
const SUBMISSIONS = 'ch-question-submissions';

type StrapiQaAttrs = {
	id?: number;
	documentId?: string;
	slug?: string;
	topic?: any;
	question?: LocalizedText;
	asker?: LocalizedText;
	askDate?: string;
	answer?: LocalizedText;
	answeredBy?: LocalizedText;
	answerDate?: string;
};

function fromStrapi(item: StrapiQaAttrs): QaItem {
	const topic = typeof item.topic === 'string' ? item.topic : (item.topic?.he ?? 'אחר');
	return {
		slug: item.slug ?? String(item.documentId ?? item.id ?? ''),
		topic: topic as QaTopic,
		question: item.question ?? { he: '', en: '', ru: '' },
		asker: item.asker ?? { he: '', en: '', ru: '' },
		askDate: item.askDate ?? '',
		answer: item.answer ?? { he: '', en: '', ru: '' },
		answeredBy: item.answeredBy ?? { he: '', en: '', ru: '' },
		answerDate: item.answerDate ?? ''
	};
}

export async function loadQa(): Promise<QaItem[]> {
	const list = await safeStrapiList<StrapiQaAttrs>(COLLECTION, {
		sort: 'answerDate:desc',
		'pagination[pageSize]': 200
	});
	const fromBackend = list.map(fromStrapi);
	const seenSlugs = new Set(fromBackend.map((q) => q.slug));
	const fallback = staticQa.filter((q) => !seenSlugs.has(q.slug));
	return [...fromBackend, ...fallback];
}

export async function submitQuestion(input: {
	askerName: string;
	askerEmail?: string;
	askerPhone?: string;
	topic?: string;
	question: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
	try {
		await strapiPost(SUBMISSIONS, {
			askerName: input.askerName.trim(),
			askerEmail: input.askerEmail?.trim() || undefined,
			askerPhone: input.askerPhone?.trim() || undefined,
			topic: input.topic?.trim() || undefined,
			question: input.question.trim(),
			status: 'pending'
		});
		return { ok: true };
	} catch (e) {
		return { ok: false, error: e instanceof Error ? e.message : String(e) };
	}
}

// ───────────────────────── Admin ─────────────────────────

export interface QaSubmission {
	id: number;
	documentId: string;
	askerName: string;
	askerEmail?: string;
	askerPhone?: string;
	topic?: string;
	question: string;
	status: 'pending' | 'answered' | 'rejected';
	publishedQaSlug?: string;
	createdAt?: string;
}

export async function loadPendingSubmissions(): Promise<QaSubmission[]> {
	const list = await safeStrapiList<QaSubmission>(SUBMISSIONS, {
		'filters[status][$eq]': 'pending',
		sort: 'createdAt:desc',
		'pagination[pageSize]': 200
	}, { needAuth: true });
	return list as QaSubmission[];
}

export async function loadAllSubmissions(): Promise<QaSubmission[]> {
	const list = await safeStrapiList<QaSubmission>(SUBMISSIONS, {
		sort: 'createdAt:desc',
		'pagination[pageSize]': 200
	}, { needAuth: true });
	return list as QaSubmission[];
}

export async function publishAnswer(input: {
	slug: string;
	topic: string;
	question: string;
	asker: string;
	askDate: string;
	answer: string;
	answeredBy: string;
}): Promise<void> {
	await strapiPost(COLLECTION, {
		slug: input.slug,
		topic: input.topic,
		question: { he: input.question, en: input.question, ru: input.question },
		asker: { he: input.asker, en: input.asker, ru: input.asker },
		askDate: input.askDate,
		answer: { he: input.answer, en: input.answer, ru: input.answer },
		answeredBy: { he: input.answeredBy, en: input.answeredBy, ru: input.answeredBy },
		answerDate: new Date().toISOString().slice(0, 10)
	});
}

export async function markSubmissionAnswered(id: string, qaSlug: string): Promise<void> {
	await strapiPut(SUBMISSIONS, id, { status: 'answered', publishedQaSlug: qaSlug });
}

export async function rejectSubmission(id: string): Promise<void> {
	await strapiPut(SUBMISSIONS, id, { status: 'rejected' });
}

export async function deleteSubmission(id: string): Promise<void> {
	await strapiDelete(SUBMISSIONS, id);
}

export async function deleteQa(id: string): Promise<void> {
	await strapiDelete(COLLECTION, id);
}
