// ─────────────────────────────────────────────────────────────
// קליינט פשוט ל-Strapi (api.gofreeil.com).
// כל ה-content-types של חכמי העדה מאוכסנים בקידומת `ch-`.
// אם הסטראפי לא זמין/ריק → הקריאות מחזירות [] / null והדפים נופלים על הנתונים הסטטיים.
//
// Auth:
//   strapiLogin → JWT
//   ה-JWT נשמר ב-localStorage → נשאר גם אחרי סגירת הדפדפן (Strapi JWT תוקף 30 ימים)
//   כל קריאה עם needAuth=true שולחת אוטומטית Authorization: Bearer <jwt>
// ─────────────────────────────────────────────────────────────

const DEFAULT_URL = 'https://api.gofreeil.com';
const JWT_STORAGE_KEY = 'chachmei-strapi-jwt';
const LEGACY_SESSION_KEY = 'chachmei-strapi-jwt'; // היה ב-sessionStorage לפני

function resolveBaseUrl(): string {
	const fromVite = (import.meta as any)?.env?.PUBLIC_STRAPI_URL as string | undefined;
	if (fromVite && fromVite.trim()) return fromVite.replace(/\/$/, '');
	return DEFAULT_URL;
}

const BASE_URL = resolveBaseUrl();

export interface StrapiUser {
	id: number;
	documentId?: string;
	username: string;
	email: string;
	confirmed?: boolean;
	blocked?: boolean;
	role?: { id: number; name: string; type: string };
	app_role?: string;
	// שדות פרופיל מהרשימה המאוחדת (users/me מחזיר אותם) - לשימוש במילוי-אוטומטי
	nickname?: string;
	business?: string;
	city?: string;
	phone?: string;
	birth_date?: string;
}

export function getJwt(): string | null {
	if (typeof localStorage === 'undefined') return null;
	try {
		// קוראים קודם מ-localStorage, ואם אין - מנסים sessionStorage (מיגרציה ממשתמשים ישנים)
		const fromLocal = localStorage.getItem(JWT_STORAGE_KEY);
		if (fromLocal) return fromLocal;
		if (typeof sessionStorage !== 'undefined') {
			const fromSession = sessionStorage.getItem(LEGACY_SESSION_KEY);
			if (fromSession) {
				// מעבירים ל-localStorage כדי שזה יהיה persistent מהפעם הבאה
				localStorage.setItem(JWT_STORAGE_KEY, fromSession);
				sessionStorage.removeItem(LEGACY_SESSION_KEY);
				return fromSession;
			}
		}
		return null;
	} catch { return null; }
}

export function setJwt(jwt: string | null): void {
	if (typeof localStorage === 'undefined') return;
	try {
		if (jwt) localStorage.setItem(JWT_STORAGE_KEY, jwt);
		else localStorage.removeItem(JWT_STORAGE_KEY);
		// מנקים גם את sessionStorage למקרה שיש שאריות
		if (typeof sessionStorage !== 'undefined') {
			try { sessionStorage.removeItem(LEGACY_SESSION_KEY); } catch {}
		}
	} catch {}
}

function buildHeaders(needAuth: boolean): Record<string, string> {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (needAuth) {
		const jwt = getJwt();
		if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
	}
	return headers;
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
	params: Record<string, any> = {},
	opts: { needAuth?: boolean } = {}
): Promise<T> {
	const url = `${BASE_URL}/api/${path}${toQueryString(params)}`;
	const res = await fetch(url, { headers: buildHeaders(opts.needAuth ?? false) });
	if (!res.ok) throw new Error(`Strapi GET ${path} failed: ${res.status}`);
	return res.json();
}

export async function strapiPost<T = any>(
	path: string,
	data: any,
	opts: { needAuth?: boolean; raw?: boolean } = {}
): Promise<T> {
	const url = `${BASE_URL}/api/${path}`;
	const body = opts.raw ? JSON.stringify(data) : JSON.stringify({ data });
	const res = await fetch(url, {
		method: 'POST',
		headers: buildHeaders(opts.needAuth ?? false),
		body
	});
	if (!res.ok) {
		const txt = await res.text().catch(() => '');
		throw new Error(`Strapi POST ${path} failed: ${res.status} ${txt.slice(0, 200)}`);
	}
	return res.json();
}

export async function strapiPut<T = any>(
	path: string,
	id: string | number,
	data: any
): Promise<T> {
	const url = `${BASE_URL}/api/${path}/${id}`;
	const res = await fetch(url, {
		method: 'PUT',
		headers: buildHeaders(true),
		body: JSON.stringify({ data })
	});
	if (!res.ok) {
		const txt = await res.text().catch(() => '');
		throw new Error(`Strapi PUT ${path}/${id} failed: ${res.status} ${txt.slice(0, 200)}`);
	}
	return res.json();
}

export async function strapiDelete<T = any>(path: string, id: string | number): Promise<T> {
	const url = `${BASE_URL}/api/${path}/${id}`;
	const res = await fetch(url, { method: 'DELETE', headers: buildHeaders(true) });
	if (!res.ok) {
		const txt = await res.text().catch(() => '');
		throw new Error(`Strapi DELETE ${path}/${id} failed: ${res.status} ${txt.slice(0, 200)}`);
	}
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

export async function safeStrapiList<T>(
	path: string,
	params: Record<string, any> = {},
	opts: { needAuth?: boolean } = {}
): Promise<Array<T & { id: number; documentId?: string }>> {
	try {
		const resp = await strapiGet(path, params, opts);
		return flattenList<T>(resp);
	} catch (e) {
		console.warn(`[strapi] ${path} fallback:`, e instanceof Error ? e.message : e);
		return [];
	}
}

export async function safeStrapiSingle<T>(
	path: string,
	params: Record<string, any> = {},
	opts: { needAuth?: boolean } = {}
): Promise<(T & { id: number }) | null> {
	try {
		const resp = await strapiGet(path, params, opts);
		if (!resp?.data) return null;
		return flatten<T>(resp.data);
	} catch (e) {
		console.warn(`[strapi] ${path} (single) fallback:`, e instanceof Error ? e.message : e);
		return null;
	}
}

// ───────────────────────── Auth ─────────────────────────

export interface StrapiLoginResult {
	jwt: string;
	user: StrapiUser;
}

export async function strapiLogin(identifier: string, password: string): Promise<StrapiLoginResult> {
	const res = await fetch(`${BASE_URL}/api/auth/local`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identifier, password })
	});
	if (!res.ok) {
		const json = await res.json().catch(() => ({}));
		const msg = json?.error?.message || `Login failed: ${res.status}`;
		throw new Error(msg);
	}
	const data: StrapiLoginResult = await res.json();
	setJwt(data.jwt);
	return data;
}

export async function strapiRegister(input: {
	username: string;
	email: string;
	password: string;
}): Promise<StrapiLoginResult> {
	const res = await fetch(`${BASE_URL}/api/auth/local/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input)
	});
	if (!res.ok) {
		const json = await res.json().catch(() => ({}));
		const msg = json?.error?.message || `Register failed: ${res.status}`;
		throw new Error(msg);
	}
	const data: StrapiLoginResult = await res.json();
	setJwt(data.jwt);
	return data;
}

/** מחזיר את ה-URL להתחלת OAuth של Google דרך Strapi.
 *  שומר את returnTo ב-sessionStorage (Strapi v5 דורש callback מדויק בלי query params). */
export function googleOAuthStartUrl(returnTo: string = '/profile'): string {
	if (typeof sessionStorage !== 'undefined') {
		try { sessionStorage.setItem('chachmei-oauth-returnTo', returnTo); } catch {}
	}
	const callback = typeof window !== 'undefined'
		? `${window.location.origin}/auth/google-callback`
		: `/auth/google-callback`;
	return `${BASE_URL}/api/connect/google?callback=${encodeURIComponent(callback)}`;
}

/** ה-callback של Strapi מחזיר ?access_token=<Google_token>. צריך להחליפו ב-JWT של Strapi דרך /auth/{provider}/callback. */
export async function strapiGoogleExchange(allQueryParams: URLSearchParams): Promise<StrapiLoginResult> {
	const qs = allQueryParams.toString();
	const res = await fetch(`${BASE_URL}/api/auth/google/callback?${qs}`, {
		headers: { 'Content-Type': 'application/json' }
	});
	if (!res.ok) {
		const json = await res.json().catch(() => ({}));
		const msg = json?.error?.message || `Google exchange failed: ${res.status}`;
		throw new Error(msg);
	}
	const data: StrapiLoginResult = await res.json();
	setJwt(data.jwt);
	return data;
}

export async function getCurrentUser(): Promise<StrapiUser | null> {
	if (!getJwt()) return null;
	try {
		const data = await strapiGet<StrapiUser>('users/me?populate=role', {}, { needAuth: true });
		return data ?? null;
	} catch {
		// טוקן לא תקף
		setJwt(null);
		return null;
	}
}

/** בעלי האתר — תמיד סופר-אדמין עם כל ההרשאות, ללא תלות בהגדרת role/app_role בבאקאנד.
 *  רשת ביטחון: גם אם רשומת המשתמש ב-Strapi לא תוייגה, הבעלים לא ננעל בחוץ. */
export const SUPER_ADMIN_EMAILS = new Set<string>([
	'yahavanter@gmail.com'
]);

export function isSuperAdminEmail(email: string | null | undefined): boolean {
	if (!email) return false;
	return SUPER_ADMIN_EMAILS.has(email.trim().toLowerCase());
}

/** האם המשתמש רשאי לערוך תוכן בחכמי העדה */
export function isChachmeiAdmin(user: StrapiUser | null | undefined): boolean {
	if (!user) return false;
	if (isSuperAdminEmail(user.email)) return true;
	if (user.app_role === 'super_admin' || user.app_role === 'ch_admin') return true;
	const roleType = user.role?.type?.toLowerCase();
	if (roleType === 'chachmei_editor') return true;
	if (roleType === 'super_admin') return true;
	const roleName = user.role?.name?.toLowerCase();
	if (roleName === 'chachmei editor' || roleName === 'chachmei admin') return true;
	return false;
}

export function strapiLogout(): void {
	setJwt(null);
}
