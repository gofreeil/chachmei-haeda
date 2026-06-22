import { activity as staticActivity, type ActivityItem, type ActivityKind, type LocalizedText } from '$lib/data/activity';
import { safeStrapiList, strapiPost } from '$lib/strapi';

const COLLECTION = 'ch-activity-items';

type StrapiActivityAttrs = {
	id?: number;
	documentId?: string;
	slug?: string;
	kind?: any;
	title?: LocalizedText;
	author?: LocalizedText;
	activityDate?: string;
	excerpt?: LocalizedText;
	body?: LocalizedText;
	videoUrl?: string;
	imageUrl?: string;
	sourceUrl?: string;
	tags?: LocalizedText[];
	order?: number;
};

function fromStrapi(item: StrapiActivityAttrs): ActivityItem {
	const kind = (typeof item.kind === 'string' ? item.kind : item.kind?.he ?? 'מאמר') as ActivityKind;
	return {
		slug: item.slug ?? String(item.documentId ?? item.id ?? ''),
		kind,
		title: item.title ?? { he: '', en: '', ru: '' },
		author: item.author ?? { he: '', en: '', ru: '' },
		date: item.activityDate ?? '',
		excerpt: item.excerpt ?? { he: '', en: '', ru: '' },
		body: item.body,
		videoUrl: item.videoUrl,
		imageUrl: item.imageUrl,
		sourceUrl: item.sourceUrl,
		tags: item.tags
	};
}

export async function loadActivity(): Promise<ActivityItem[]> {
	const list = await safeStrapiList<StrapiActivityAttrs>(COLLECTION, {
		sort: 'activityDate:desc',
		'pagination[pageSize]': 200
	});
	const fromBackend = list.map(fromStrapi);
	const seenSlugs = new Set(fromBackend.map((a) => a.slug));
	const fallback = staticActivity.filter((a) => !seenSlugs.has(a.slug));
	return [...fromBackend, ...fallback];
}

export async function addActivity(input: ActivityItem): Promise<ActivityItem> {
	const payload = {
		slug: input.slug,
		kind: input.kind,
		title: input.title,
		author: input.author,
		activityDate: input.date ?? new Date().toISOString().slice(0, 10),
		excerpt: input.excerpt,
		body: input.body,
		videoUrl: input.videoUrl,
		imageUrl: input.imageUrl,
		sourceUrl: input.sourceUrl,
		tags: input.tags ?? []
	};
	const resp = await strapiPost<{ data: StrapiActivityAttrs }>(COLLECTION, payload);
	return fromStrapi({ ...payload, ...(resp?.data ?? {}) } as StrapiActivityAttrs);
}

export async function latestActivityAsync(): Promise<ActivityItem | null> {
	const items = await loadActivity();
	if (items.length === 0) return null;
	return [...items].sort((a, b) => b.date.localeCompare(a.date))[0];
}
