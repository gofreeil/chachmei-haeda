import { loadAndApplyTextOverrides } from '$lib/services/text-overrides-service';

export const prerender = false;
export const ssr = true;

// דריסות-טקסט מהסטראפי מוחלות לפני הרינדור (בשרת וגם בלקוח) — כך העריכות של
// האדמין מופיעות כבר בציור הראשון, בלי הבהוב של הטקסט הישן
export const load = async () => {
	await loadAndApplyTextOverrides();
	return {};
};
