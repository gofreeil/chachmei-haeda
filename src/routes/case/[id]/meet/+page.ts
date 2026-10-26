import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// חדר המפגש עבר לאזור "חדר הדיון הוירטואלי" בהיכל המשפט — קישורים ישנים
// (הודעות, סימניות) ממשיכים לעבוד ונוחתים ישר בחדר של התיק.
export const load: PageLoad = ({ params }) => {
	throw redirect(307, `/heichal-hamishpat?room=${encodeURIComponent(params.id)}#virtual-room`);
};
