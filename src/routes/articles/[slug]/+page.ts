import { getArticle } from '$lib/data/articles';

export const load = ({ params }: { params: { slug: string } }) => {
	const article = getArticle(params.slug);
	return { article: article ?? null, slug: params.slug };
};
