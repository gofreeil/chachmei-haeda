import { addMessages } from 'svelte-i18n';
import { safeStrapiList, strapiPost, strapiPut } from '$lib/strapi';

// ─────────────────────────────────────────────────────────────
// דריסות-טקסט לדפי תוכן קבועים (ch-text-overrides).
// הטקסטים הקבועים של האתר חיים ב-i18n.ts ומקומפלים לקוד; דריסה בסטראפי
// גוברת עליהם בזמן-ריצה דרך addMessages — בלי דיפלוי. רשומה לכל מפתח:
// { key: 'eth_code_intro_p1', values: { he: '...', en: '...' } }
// ─────────────────────────────────────────────────────────────

const COLLECTION = 'ch-text-overrides';

export type TextOverride = { documentId?: string; key: string; values: Record<string, string> };

// מטמון ברמת המודול: בדפדפן — לכל חיי הטאב; בשרת (SSR) — משותף לבקשות, ולכן TTL קצר
let cache: { at: number; list: TextOverride[] } | null = null;
const TTL_MS = 60_000;

export async function loadTextOverrides(force = false): Promise<TextOverride[]> {
	if (!force && cache && Date.now() - cache.at < TTL_MS) return cache.list;
	const list = await safeStrapiList<{ key: string; values: Record<string, string> }>(COLLECTION, {
		'pagination[pageSize]': 500
	});
	const mapped = list.map((x) => ({ documentId: x.documentId, key: x.key, values: x.values ?? {} }));
	cache = { at: Date.now(), list: mapped };
	return mapped;
}

export function applyTextOverrides(list: TextOverride[]): void {
	const byLocale: Record<string, Record<string, string>> = {};
	for (const o of list) {
		if (!o.key) continue;
		for (const [loc, val] of Object.entries(o.values ?? {})) {
			if (typeof val === 'string' && val.trim()) (byLocale[loc] ??= {})[o.key] = val;
		}
	}
	for (const [loc, msgs] of Object.entries(byLocale)) addMessages(loc, msgs);
}

/** טעינה והחלה עם תקרת-זמן — רצה ב-load של ה-layout (שרת ולקוח) לפני הרינדור,
 *  כך שהדריסות מופיעות כבר בציור הראשון. לעולם לא חוסמת את האתר מעבר לתקרה. */
export async function loadAndApplyTextOverrides(timeoutMs = 2500): Promise<void> {
	try {
		const list = await Promise.race([
			loadTextOverrides(),
			new Promise<TextOverride[]>((resolve) => setTimeout(() => resolve(cache?.list ?? []), timeoutMs))
		]);
		applyTextOverrides(list);
	} catch {
		/* בלי דריסות — הטקסט המוטמע בקוד מוצג */
	}
}

/** שמירת דריסה למפתח בשפה נתונה (upsert לפי key) + החלה מיידית בזיכרון */
export async function saveTextOverride(key: string, locale: string, value: string): Promise<void> {
	const all = await loadTextOverrides(true);
	const existing = all.find((o) => o.key === key);
	if (existing?.documentId) {
		const values = { ...existing.values, [locale]: value };
		await strapiPut(COLLECTION, existing.documentId, { key, values });
		existing.values = values;
	} else {
		const resp = await strapiPost<{ data?: { documentId?: string } }>(
			COLLECTION,
			{ key, values: { [locale]: value } },
			{ needAuth: true }
		);
		cache?.list.push({ documentId: resp?.data?.documentId, key, values: { [locale]: value } });
	}
	addMessages(locale, { [key]: value });
}
