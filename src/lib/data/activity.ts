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
	tags?: string[];
}

export const activity: ActivityItem[] = [
	{
		slug: 'mifgash-har-habayit-pashtunim',
		kind: 'כתבה',
		title: 'מפגש בהר הבית: חיבור חזרה של צאצאי עשרת השבטים שהלכו לאיבוד אצל הפשטונים',
		author: 'חכמי העדה',
		date: '2026-06-04',
		excerpt:
			'מפגש מרתק בהר הבית בין נציגים מקהילות הפשטונים מאפגניסטן ופקיסטן לבין חכמי העדה. הפשטונים מחזיקים במסורות עתיקות שלפיהן הם צאצאי עשרת השבטים. חכמי העדה מקרבים אותם, מסבירים להם את עיקרי היהדות ומאפשרים להם גיור מתוך קבלת האמונה ותפיסה עמוקה של חשיבות תפקידו של עם ישראל - ומסייעים להם לחזור לחיק עמם.',
		videoUrl: 'https://www.youtube.com/embed/9ioV_PeaqWE',
		tags: ['עשרת השבטים', 'פשטונים', 'הר הבית', 'אפגניסטן', 'פקיסטן', 'שיבת שבטים']
	},
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

חכמי העדה מקדמים ומסייעים בשיבה של שבטים אבודים אלו חזרה אל חיק העם, על ידי בירור זהות היסטורית והלכתית, יצירת מסלול מסודר לשיבה או גיור, והכנה להקמת מוסדות הנהגה רוחניים כלל לאומיים כימי קדם.`,
		tags: ['שיבת שבטים', 'קיבוץ נידחים', 'גיור', 'אפריקה', 'דרום אמריקה']
	},
	{
		slug: 'kria-laaliyah-har-tzion',
		kind: 'סרטון',
		title: 'קריאה מבית הדין הר ציון לקהילות ישראל שבתפוצות: עת לעלות לארץ',
		author: 'חכמי העדה - בית הדין הר ציון',
		date: '2024-11-18',
		excerpt:
			`קריאה מחכמי העדה, בית הדין הר ציון - לכלל קהילות ישראל שבתפוצות: "סרה השגחת השם על קהילות חו"ל, זה הזמן לעלות לארץ להקים כאן את היעוד שלנו, בואו עם משפחותיכם".`,
		videoUrl: 'https://www.youtube.com/embed/eub7P1iNNb8',
		sourceUrl: 'https://www.youtube.com/watch?v=eub7P1iNNb8',
		tags: ['עלייה לארץ', 'קיבוץ גלויות', 'בית הדין הר ציון', 'קריאה לעם ישראל']
	}
];

export function getActivityItem(slug: string): ActivityItem | undefined {
	return activity.find((a) => a.slug === slug);
}

export function latestActivity(): ActivityItem {
	return [...activity].sort((a, b) => b.date.localeCompare(a.date))[0];
}
