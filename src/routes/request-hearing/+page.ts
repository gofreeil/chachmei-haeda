import { redirect } from '@sveltejs/kit';

export const load = ({ url }: { url: URL }) => {
	const date = url.searchParams.get('date');
	const target = date
		? `/heichal-hamishpat?open=request-hearing&date=${encodeURIComponent(date)}`
		: '/heichal-hamishpat?open=request-hearing';
	throw redirect(308, target);
};
