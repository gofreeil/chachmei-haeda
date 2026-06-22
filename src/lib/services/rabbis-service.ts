import { defaultRabbis, type Rabbi } from '$lib/data/rabbis';
import { safeStrapiList, strapiPost } from '$lib/strapi';

const COLLECTION = 'ch-rabbis';

type StrapiRabbiAttrs = {
	id?: number;
	documentId?: string;
	rabbiName?: any;
	rabbiTitle?: any;
	rabbiNickname?: any;
	rabbiCity?: any;
	photo?: string;
	order?: number;
};

function fromStrapi(item: StrapiRabbiAttrs): Rabbi {
	const pick = (v: any): string | undefined => {
		if (!v) return undefined;
		if (typeof v === 'string') return v;
		return v.he ?? v.en ?? undefined;
	};
	return {
		id: String(item.documentId ?? item.id ?? ''),
		name: pick(item.rabbiName) ?? '',
		title: pick(item.rabbiTitle),
		nickname: pick(item.rabbiNickname),
		city: pick(item.rabbiCity),
		photo: item.photo
	};
}

export async function loadRabbis(): Promise<Rabbi[]> {
	const list = await safeStrapiList<StrapiRabbiAttrs>(COLLECTION, {
		sort: 'order:asc',
		'pagination[pageSize]': 200
	});
	if (list.length === 0) return [...defaultRabbis];
	return list.map(fromStrapi);
}

export async function addRabbi(r: Rabbi): Promise<Rabbi> {
	const payload = {
		rabbiName: r.name,
		rabbiTitle: r.title,
		rabbiNickname: r.nickname,
		rabbiCity: r.city,
		photo: r.photo,
		order: 100
	};
	const resp = await strapiPost<{ data: StrapiRabbiAttrs }>(COLLECTION, payload);
	return fromStrapi({ ...payload, ...(resp?.data ?? {}) } as StrapiRabbiAttrs);
}
