import { articles as staticArticles, type Article, type LocalizedString } from '$lib/data/articles';
import { safeStrapiList, strapiPost, strapiPut, strapiDelete } from '$lib/strapi';
import { packPdf, unpackPdf } from '$lib/pdfAttachment';

const COLLECTION = 'ch-articles';

type StrapiArticleAttrs = {
	id?: number;
	documentId?: string;
	slug?: string;
	title?: LocalizedString;
	author?: LocalizedString;
	articleDate?: string;
	excerpt?: LocalizedString;
	body?: LocalizedString & { pdf?: unknown }; // ה-PDF המצורף נשמר תחת body.pdf (ראה pdfAttachment.ts)
	approvedBy?: LocalizedString[];
	tags?: LocalizedString[];
	order?: number;
};

/** מאמר עם מזהה הרשומה בסטראפי — נחוץ לעריכה במקום. מאמר סטטי מגיע בלעדיו. */
export type ArticleWithId = Article & { documentId?: string };

function fromStrapi(item: StrapiArticleAttrs): ArticleWithId {
	const { value: body, pdf } = unpackPdf(item.body);
	return {
		documentId: item.documentId,
		slug: item.slug ?? String(item.documentId ?? item.id ?? ''),
		title: item.title ?? { he: '', en: '', ru: '' },
		author: item.author ?? { he: '', en: '', ru: '' },
		date: item.articleDate ?? '',
		excerpt: item.excerpt ?? { he: '', en: '', ru: '' },
		body,
		pdf,
		approvedBy: item.approvedBy ?? [],
		tags: item.tags ?? []
	};
}

/** מאמרים: מאחד את הסטטיים עם הסטראפי, סטראפי מנצח על אותו slug. */
export async function loadArticles(): Promise<ArticleWithId[]> {
	const list = await safeStrapiList<StrapiArticleAttrs>(COLLECTION, {
		sort: 'articleDate:desc',
		'pagination[pageSize]': 200
	});
	const fromBackend = list.map(fromStrapi);
	const seenSlugs = new Set(fromBackend.map((a) => a.slug));
	const fallback = staticArticles.filter((a) => !seenSlugs.has(a.slug));
	return [...fromBackend, ...fallback];
}

/** מחיקת מאמר מסטראפי — מסירה אותו מהאתר לכולם. */
export async function deleteArticle(documentId: string): Promise<void> {
	await strapiDelete(COLLECTION, documentId);
}

export async function addArticle(input: Omit<Article, 'date'> & { date?: string }): Promise<Article> {
	const payload = {
		slug: input.slug,
		title: input.title,
		author: input.author,
		articleDate: input.date ?? new Date().toISOString().slice(0, 10),
		excerpt: input.excerpt,
		body: packPdf(input.body, input.pdf),
		approvedBy: input.approvedBy ?? [],
		tags: input.tags ?? []
	};
	const resp = await strapiPost<{ data: StrapiArticleAttrs }>(COLLECTION, payload, { needAuth: true });
	return fromStrapi({ ...payload, ...(resp?.data ?? {}) } as StrapiArticleAttrs);
}

/** עריכת מאמר בידי אדמין: מאמר שמקורו בסטראפי מתעדכן במקומו; מאמר סטטי (ללא
 *  documentId) מקבל רשומת-דריסה בסטראפי עם אותו slug — והסטראפי מנצח בטעינה. */
export async function saveArticleEdit(
	article: ArticleWithId,
	patch: Partial<Pick<Article, 'title' | 'body' | 'excerpt'>>
): Promise<ArticleWithId> {
	const payload = {
		slug: article.slug,
		title: patch.title ?? article.title,
		author: article.author,
		articleDate: article.date,
		excerpt: patch.excerpt ?? article.excerpt,
		body: packPdf(patch.body ?? article.body, article.pdf),
		approvedBy: article.approvedBy ?? [],
		tags: article.tags ?? []
	};
	if (article.documentId) {
		await strapiPut(COLLECTION, article.documentId, payload);
		return { ...article, title: payload.title, excerpt: payload.excerpt, body: patch.body ?? article.body };
	}
	const resp = await strapiPost<{ data: StrapiArticleAttrs }>(COLLECTION, payload, { needAuth: true });
	return fromStrapi({ ...payload, ...(resp?.data ?? {}) } as StrapiArticleAttrs);
}
