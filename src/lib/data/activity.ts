export type ActivityKind = 'סרטון' | 'מאמר' | 'הודעה' | 'כתבה';

export interface ActivityItem {
	slug: string;
	kind: ActivityKind;
	title: string;
	author: string;
	date: string;
	excerpt: string;
	body?: string;
	videoUrl?: string;
	imageUrl?: string;
	sourceUrl?: string;
}

export const activity: ActivityItem[] = [
	{
		slug: 'shivat-shvatim-avudim',
		kind: 'כתבה',
		title: 'חכמי העדה מקדמים קיבוץ נידחים ושיבת שבטים אבודים חזרה לישראל',
		author: 'יהב אנטר',
		date: '2026-02-01',
		excerpt: 'תופעת שיבת השבטים האבודים מקבלת לאחרונה ביטוי חדש, עם פרסום סרטון המציג אדם הטוען למוצא משבט אפרים ומבקש לשוב ולהתחבר לעם ישראל.',
		videoUrl: 'https://www.youtube.com/embed/AE9mcu5t_aA?start=9',
		body: `בסרטון מתואר מסעו האישי, הכולל חיפוש שורשים, חיבור רוחני עמוק ליהדות ורצון להשתלב מחדש במסגרת העם היהודי.

בשנים האחרונות קהילות ברחבי העולם: מאפריקה ועד דרום אמריקה, מביעות עניין גובר בקשר היסטורי לשבטי ישראל.

חכמי העדה מקדמים שיבה של שבטים אבודים אלו חזרה אל חיק העם, על ידי בירור זהות היסטורית והלכתית, יצירת מסלול מסודר לשיבה או גיור, והכנה להקמת מוסדות הנהגה רוחניים כלל לאומיים כימי קדם.

לכתבה המלאה: https://israel365news.com/video/meet-a-returning-member-of-the-lost-tribe-of-ephraim/`
	}
];

export function getActivityItem(slug: string): ActivityItem | undefined {
	return activity.find((a) => a.slug === slug);
}
