import { defaultRabbis, type Rabbi } from '$lib/data/rabbis';
import { safeStrapiList, strapiPost, strapiPut, strapiDelete } from '$lib/strapi';

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

/** הרשימה כפי שהיא בסטראפי בלבד — ריקה אם עוד לא נזרעה (בלי נפילה לברירת מחדל).
 *  ה-id של כל דיין הוא ה-documentId, כך שעריכה/מחיקה עובדות ישירות מולו. */
export async function listBackendRabbis(): Promise<Rabbi[]> {
	const list = await safeStrapiList<StrapiRabbiAttrs>(COLLECTION, {
		sort: 'order:asc',
		'pagination[pageSize]': 200
	});
	return list.map(fromStrapi);
}

function toPayload(r: Rabbi, order?: number) {
	return {
		rabbiName: r.name,
		rabbiTitle: r.title ?? null,
		rabbiNickname: r.nickname ?? null,
		rabbiCity: r.city ?? null,
		photo: r.photo ?? null,
		...(order !== undefined ? { order } : {})
	};
}

export async function addRabbi(r: Rabbi, order = 100): Promise<Rabbi> {
	const payload = toPayload(r, order);
	const resp = await strapiPost<{ data: StrapiRabbiAttrs }>(COLLECTION, payload);
	return fromStrapi({ ...payload, ...(resp?.data ?? {}) } as StrapiRabbiAttrs);
}

export async function updateRabbi(documentId: string, r: Rabbi): Promise<void> {
	await strapiPut(COLLECTION, documentId, toPayload(r));
}

export async function deleteRabbiBackend(documentId: string): Promise<void> {
	await strapiDelete(COLLECTION, documentId);
}

/** קיבוע סדר התצוגה: order = המיקום ברשימה. */
export async function saveRabbisOrder(rabbis: Rabbi[]): Promise<void> {
	await Promise.all(rabbis.map((r, i) => strapiPut(COLLECTION, r.id, { order: i })));
}

/** זריעת הרשימה הנוכחית לסטראפי (כשעוד אין שם דיינים) — מחזירה את הרשימה
 *  כפי שנשמרה, עם documentId-ים אמיתיים בתור id. */
export async function seedRabbis(rabbis: Rabbi[]): Promise<Rabbi[]> {
	for (let i = 0; i < rabbis.length; i++) {
		await strapiPost(COLLECTION, toPayload(rabbis[i], i));
	}
	return listBackendRabbis();
}
