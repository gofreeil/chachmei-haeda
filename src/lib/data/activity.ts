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
		excerpt: 'בשנים האחרונות קהילות ברחבי העולם: מאפריקה ועד דרום אמריקה, מביעות עניין גובר בקשר היסטורי לשבטי ישראל.',
		videoUrl: 'https://www.youtube.com/embed/AE9mcu5t_aA?start=9',
		sourceUrl: 'https://israel365news.com/video/meet-a-returning-member-of-the-lost-tribe-of-ephraim/',
		body: `הציצו אל אחד מהמסעות האישית של חיפוש שורשים, וחיבור רוחני עמוק ליהדות על מנת להשתלב מחדש בעם היהודי.

חכמי העדה מקדמים ומסייעים בשיבה של שבטים אבודים אלו חזרה אל חיק העם, על ידי בירור זהות היסטורית והלכתית, יצירת מסלול מסודר לשיבה או גיור, והכנה להקמת מוסדות הנהגה רוחניים כלל לאומיים כימי קדם.`
	}
];

export function getActivityItem(slug: string): ActivityItem | undefined {
	return activity.find((a) => a.slug === slug);
}
