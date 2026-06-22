import { safeStrapiSingle, strapiPost } from '$lib/strapi';

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

/** העלאת קונפיג חדש (PUT דרך POST של ה-single type). */
export async function saveHomeConfig(input: HomeConfig): Promise<void> {
	await strapiPost(SINGLE, {
		homeVideoUrl: input.homeVideoUrl?.trim() || null,
		homeVideoTitle: input.homeVideoTitle?.trim() || null
	});
}
