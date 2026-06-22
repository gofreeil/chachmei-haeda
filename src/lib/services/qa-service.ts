import { qa as staticQa, type QaItem, type QaTopic, type LocalizedText } from '$lib/data/qa';
import { safeStrapiList, strapiPost } from '$lib/strapi';

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

/** שליחת שאלה חדשה דרך /ask. נשמר ב-ch-question-submissions עד שחכם משיב. */
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
