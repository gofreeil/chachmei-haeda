import { error } from '@sveltejs/kit';
import { getArticle } from '$lib/data/articles';

export const prerender = true;

export const load = ({ params }: { params: { slug: string } }) => {
	const article = getArticle(params.slug);
	if (!article) throw error(404, 'מאמר לא נמצא');
	return { article };
};

export function entries() {
	// generate routes at build time
	return [
		{ slug: 'din-torah-yesodot' },
		{ slug: 'gzel-vehonaah' },
		{ slug: 'shevet-mitzvot-bnei-noach' }
	];
}
