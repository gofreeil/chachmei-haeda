import { redirect } from '@sveltejs/kit';

// דף "אודותנו" אוחד ל-/about — משאירים הפניה קבועה לקישורים ישנים.
export const load = () => {
	throw redirect(301, '/about');
};
