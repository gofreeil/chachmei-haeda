import type { Actions, PageServerLoad } from './$types';
import { setEmailOptOut } from '$lib/server/emailOptOut';
import { verifyUnsub } from '$lib/server/emailCopy';

// החתימה נבדקת בשרת, והביטול הוא POST בלחיצה על הכפתור - כך סורקי מייל
// שפותחים קישורים אוטומטית לא מבטלים למישהו בטעות.
export const load: PageServerLoad = async ({ url, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex' });
	const e = url.searchParams.get('e') ?? '';
	const t = url.searchParams.get('t') ?? '';
	return { valid: verifyUnsub(e, t), e, t };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const e = String(form.get('e') ?? '');
		const t = String(form.get('t') ?? '');
		if (!verifyUnsub(e, t)) return { status: 'invalid' as const };
		try {
			return { status: (await setEmailOptOut(e)) > 0 ? ('done' as const) : ('notFound' as const) };
		} catch (err) {
			console.warn('[unsubscribe] failed:', err instanceof Error ? err.message : err);
			return { status: 'invalid' as const };
		}
	}
};
