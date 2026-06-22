import { safeStrapiList, strapiPost } from '$lib/strapi';
import type { LocalizedText } from '$lib/data/qa';

const COLLECTION = 'ch-news-items';

export interface NewsItem {
	id: string;
	line1: LocalizedText | string;
	line2?: LocalizedText | string;
	sourceUrl?: string;
	active: boolean;
	order?: number;
}

type StrapiNewsAttrs = {
	id?: number;
	documentId?: string;
	line1?: any;
	line2?: any;
	sourceUrl?: string;
	active?: boolean;
	order?: number;
};

function fromStrapi(item: StrapiNewsAttrs): NewsItem {
	return {
		id: String(item.documentId ?? item.id ?? ''),
		line1: item.line1 ?? '',
		line2: item.line2,
		sourceUrl: item.sourceUrl,
		active: item.active ?? true,
		order: item.order
	};
}

export async function loadNews(): Promise<NewsItem[]> {
	const list = await safeStrapiList<StrapiNewsAttrs>(COLLECTION, {
		'filters[active][$eq]': true,
		sort: 'order:asc',
		'pagination[pageSize]': 200
	});
	return list.map(fromStrapi);
}

export async function addNewsItem(input: { line1: string; line2?: string; sourceUrl?: string }): Promise<NewsItem> {
	const payload = {
		line1: input.line1,
		line2: input.line2,
		sourceUrl: input.sourceUrl,
		active: true,
		order: 100
	};
	const resp = await strapiPost<{ data: StrapiNewsAttrs }>(COLLECTION, payload);
	return fromStrapi({ ...payload, ...(resp?.data ?? {}) } as StrapiNewsAttrs);
}
