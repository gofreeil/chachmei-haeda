import { defaultRabbis, type Rabbi } from '$lib/data/rabbis';
import { safeStrapiList, strapiPost, strapiPut, strapiDelete, jsonText, getJwt } from '$lib/strapi';

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
		rabbiName: jsonText(r.name),
		rabbiTitle: r.title ? jsonText(r.title) : null,
		rabbiNickname: r.nickname ? jsonText(r.nickname) : null,
		rabbiCity: r.city ? jsonText(r.city) : null,
		photo: r.photo ?? null,
		...(order !== undefined ? { order } : {})
	};
}

export async function addRabbi(r: Rabbi, order = 100): Promise<Rabbi> {
	const payload = toPayload(r, order);
	const resp = await strapiPost<{ data: StrapiRabbiAttrs }>(COLLECTION, payload, { needAuth: true });
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
		await strapiPost(COLLECTION, toPayload(rabbis[i], i), { needAuth: true });
	}
	return listBackendRabbis();
}

/** העלאת תמונה לספריית המדיה של Strapi (דרך שרת האתר) — מחזיר כתובת מוחלטת. */
export async function uploadRabbiPhoto(file: Blob, name = 'rabbi.jpg'): Promise<string> {
	const jwt = getJwt();
	const form = new FormData();
	form.append('file', file, name);
	let res: Response;
	try {
		res = await fetch('/api/image-upload', {
			method: 'POST',
			headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
			body: form
		});
	} catch {
		throw new Error('לא הצלחנו להתחבר לשרת. בדקו את החיבור ונסו שוב');
	}
	const data = await res.json().catch(() => null);
	if (!res.ok || !data?.url) throw new Error(data?.message || `העלאת התמונה נכשלה (${res.status})`);
	return data.url as string;
}

/** תמונה שעדיין לא בבאקאנד: נתיב יחסי מהאתר (/images/…) או data: URL. */
export function isLocalPhoto(photo?: string): boolean {
	return !!photo && (photo.startsWith('/') || photo.startsWith('data:'));
}

/** מעביר לבאקאנד את כל התמונות שעדיין מקומיות, ושומר את הכתובת החדשה בכל דיין. מחזיר כמה הועברו. */
export async function migrateRabbiPhotosToBackend(rabbis: Rabbi[]): Promise<number> {
	let moved = 0;
	for (const r of rabbis) {
		if (!isLocalPhoto(r.photo)) continue;
		const blob = await (await fetch(r.photo!)).blob();
		const url = await uploadRabbiPhoto(blob, r.photo!.split('/').pop() || 'rabbi.jpg');
		await updateRabbi(r.id, { ...r, photo: url });
		moved++;
	}
	return moved;
}

/** מוסיף לבאקאנד את ראש ואב בית הדין (הראשון ב-defaultRabbis) אם חסר, ומציב אותו ראשון ברשימה. */
export async function ensureHeadRabbiInBackend(current: Rabbi[]): Promise<Rabbi[]> {
	const head = defaultRabbis[0];
	if (!current.some((r) => r.name === head.name)) {
		await addRabbi(head, 0);
		const list = await listBackendRabbis();
		const h = list.find((r) => r.name === head.name);
		if (h) await saveRabbisOrder([h, ...list.filter((r) => r !== h)]);
	}
	return listBackendRabbis();
}
