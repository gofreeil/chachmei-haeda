import { error } from '@sveltejs/kit';
import { getArticle } from '$lib/data/articles';

export const load = ({ params }: { params: { slug: string } }) => {
	const article = getArticle(params.slug);
	if (!article) throw error(404, 'מאמר לא נמצא');
	return { article };
};
