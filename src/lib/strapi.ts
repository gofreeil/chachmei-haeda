// ─────────────────────────────────────────────────────────────
// קליינט פשוט ל-Strapi (community-il.duckdns.org).
// כל ה-content-types של חכמי העדה מאוכסנים בקידומת `ch-`.
// אם הסטראפי לא זמין/ריק → הקריאות מחזירות [] / null והדפים נופלים על הנתונים הסטטיים.
// ─────────────────────────────────────────────────────────────

const DEFAULT_URL = 'https://community-il.duckdns.org';

function resolveBaseUrl(): string {
	const fromVite = (import.meta as any)?.env?.PUBLIC_STRAPI_URL as string | undefined;
	if (fromVite && fromVite.trim()) return fromVite.replace(/\/$/, '');
	return DEFAULT_URL;
}

const BASE_URL = resolveBaseUrl();

export interface StrapiListResponse<T> {
	data: Array<{ id: number; documentId?: string; attributes?: T } & T>;
	meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
}

export interface StrapiSingleResponse<T> {
	data: ({ id: number; documentId?: string; attributes?: T } & T) | null;
}

function toQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
	const search = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) {
		if (v === undefined || v === null) continue;
		search.set(k, String(v));
	}
	const s = search.toString();
	return s ? `?${s}` : '';
}

export async function strapiGet<T = any>(
	path: string,
	params: Record<string, any> = {}
): Promise<T> {
	const url = `${BASE_URL}/api/${path}${toQueryString(params)}`;
	const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
	if (!res.ok) throw new Error(`Strapi GET ${path} failed: ${res.status}`);
	return res.json();
}

export async function strapiPost<T = any>(path: string, data: any): Promise<T> {
	const url = `${BASE_URL}/api/${path}`;
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ data })
	});
	if (!res.ok) throw new Error(`Strapi POST ${path} failed: ${res.status}`);
	return res.json();
}

/** Strapi 5 משטח attributes לתוך השורש של ה-object. גישה אחידה מחזירה תמיד object אחיד. */
export function flatten<T>(item: any): T & { id: number; documentId?: string } {
	if (!item) return item;
	const { attributes, ...rest } = item;
	return { ...rest, ...(attributes ?? {}) } as T & { id: number; documentId?: string };
}

export function flattenList<T>(resp: any): Array<T & { id: number; documentId?: string }> {
	const arr = resp?.data ?? [];
	return arr.map((x: any) => flatten<T>(x));
}

/** ניסיון GET; אם נכשל - מחזיר fallback (לרוב []). */
export async function safeStrapiList<T>(
	path: string,
	params: Record<string, any> = {}
): Promise<Array<T & { id: number; documentId?: string }>> {
	try {
		const resp = await strapiGet(path, params);
		return flattenList<T>(resp);
	} catch (e) {
		console.warn(`[strapi] ${path} fallback:`, e instanceof Error ? e.message : e);
		return [];
	}
}

export async function safeStrapiSingle<T>(
	path: string,
	params: Record<string, any> = {}
): Promise<(T & { id: number }) | null> {
	try {
		const resp = await strapiGet(path, params);
		if (!resp?.data) return null;
		return flatten<T>(resp.data);
	} catch (e) {
		console.warn(`[strapi] ${path} (single) fallback:`, e instanceof Error ? e.message : e);
		return null;
	}
}
