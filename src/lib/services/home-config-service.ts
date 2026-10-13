import { safeStrapiSingle, strapiPutSingle } from '$lib/strapi';

const SINGLE = 'ch-home-config';

export interface HomeConfig {
	homeVideoUrl?: string;
	homeVideoTitle?: string;
}

type StrapiHomeConfigAttrs = HomeConfig & { id?: number; documentId?: string };

export async function loadHomeConfig(): Promise<HomeConfig> {
	const item = await safeStrapiSingle<StrapiHomeConfigAttrs>(SINGLE, { 'pagination[pageSize]': 1 });
	return {
		homeVideoUrl: item?.homeVideoUrl,
		homeVideoTitle: item?.homeVideoTitle
	};
}

/** שמירת הקונפיג — PUT על ה-single type (ל-single type אין POST בסטראפי). */
export async function saveHomeConfig(input: HomeConfig): Promise<void> {
	await strapiPutSingle(SINGLE, {
		homeVideoUrl: input.homeVideoUrl?.trim() || null,
		homeVideoTitle: input.homeVideoTitle?.trim() || null
	});
}
