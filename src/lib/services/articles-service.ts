import { articles as staticArticles, type Article, type LocalizedString } from '$lib/data/articles';
import { safeStrapiList, strapiPost } from '$lib/strapi';

const COLLECTION = 'ch-articles';

type StrapiArticleAttrs = {
	id?: number;
	documentId?: string;
	slug?: string;
	title?: LocalizedString;
	author?: LocalizedString;
	articleDate?: string;
	excerpt?: LocalizedString;
	body?: LocalizedString;
	approvedBy?: LocalizedString[];
	tags?: LocalizedString[];
	order?: number;
};

function fromStrapi(item: StrapiArticleAttrs): Article {
	return {
		slug: item.slug ?? String(item.documentId ?? item.id ?? ''),
		title: item.title ?? { he: '', en: '', ru: '' },
		author: item.author ?? { he: '', en: '', ru: '' },
		date: item.articleDate ?? '',
		excerpt: item.excerpt ?? { he: '', en: '', ru: '' },
		body: item.body ?? { he: '', en: '', ru: '' },
		approvedBy: item.approvedBy ?? [],
		tags: item.tags ?? []
	};
}

/** מאמרים: מאחד את הסטטיים עם הסטראפי, סטראפי מנצח על אותו slug. */
export async function loadArticles(): Promise<Article[]> {
	const list = await safeStrapiList<StrapiArticleAttrs>(COLLECTION, {
		sort: 'articleDate:desc',
		'pagination[pageSize]': 200
	});
	const fromBackend = list.map(fromStrapi);
	const seenSlugs = new Set(fromBackend.map((a) => a.slug));
	const fallback = staticArticles.filter((a) => !seenSlugs.has(a.slug));
	return [...fromBackend, ...fallback];
}

export async function addArticle(input: Omit<Article, 'date'> & { date?: string }): Promise<Article> {
	const payload = {
		slug: input.slug,
		title: input.title,
		author: input.author,
		articleDate: input.date ?? new Date().toISOString().slice(0, 10),
		excerpt: input.excerpt,
		body: input.body,
		approvedBy: input.approvedBy ?? [],
		tags: input.tags ?? []
	};
	const resp = await strapiPost<{ data: StrapiArticleAttrs }>(COLLECTION, payload);
	return fromStrapi({ ...payload, ...(resp?.data ?? {}) } as StrapiArticleAttrs);
}
