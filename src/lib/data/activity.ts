export type ActivityKind = 'סרטון' | 'מאמר' | 'הודעה' | 'כתבה';

export interface LocalizedText {
	he: string;
	en: string;
	ru: string;
}

export interface ActivityItem {
	slug: string;
	kind: ActivityKind;
	title: LocalizedText;
	author: LocalizedText;
	date: string;
	excerpt: LocalizedText;
	body?: LocalizedText;
	videoUrl?: string;
	imageUrl?: string;
	sourceUrl?: string;
	tags?: LocalizedText[];
}

export const pickLang = (v: any, l: string): string =>
	typeof v === 'string' ? v : (v?.[l] ?? v?.he ?? '');

export const activity: ActivityItem[] = [
	{
		slug: 'mifgash-har-habayit-pashtunim',
		kind: 'כתבה',
		title: {
			he: 'מפגש בהר הבית: חיבור חזרה של צאצאי עשרת השבטים שהלכו לאיבוד אצל הפשטונים',
			en: 'Meeting on the Temple Mount: Reconnecting Descendants of the Lost Ten Tribes Among the Pashtuns',
			ru: 'Встреча на Храмовой горе: воссоединение с потомками десяти потерянных колен среди пуштунов'
		},
		author: {
			he: 'חכמי העדה',
			en: "Chachmei Ha'Eda",
			ru: 'Хахмей а-Эда'
		},
		date: '2026-06-04',
		excerpt: {
			he: 'מפגש מרתק בהר הבית בין נציגים מקהילות הפשטונים מאפגניסטן ופקיסטן לבין חכמי העדה. הפשטונים מחזיקים במסורות עתיקות שלפיהן הם צאצאי עשרת השבטים. חכמי העדה מקרבים אותם, מסבירים להם את עיקרי היהדות ומאפשרים להם גיור מתוך קבלת האמונה ותפיסה עמוקה של חשיבות תפקידו של עם ישראל - ומסייעים להם לחזור לחיק עמם.',
			en: "A fascinating meeting on the Temple Mount between representatives of Pashtun communities from Afghanistan and Pakistan and the sages of Chachmei Ha'Eda. The Pashtuns hold ancient traditions according to which they are descendants of the Ten Tribes. Chachmei Ha'Eda welcomes them, teaches them the foundations of Judaism, and enables their conversion through genuine acceptance of faith and a deep understanding of the role of the People of Israel — helping them return to the embrace of their people.",
			ru: 'Удивительная встреча на Храмовой горе между представителями пуштунских общин Афганистана и Пакистана и мудрецами Хахмей а-Эда. Пуштуны хранят древние традиции, согласно которым они являются потомками десяти колен. Мудрецы Хахмей а-Эда приближают их, разъясняют им основы иудаизма и дают им возможность пройти гиюр на основе подлинного принятия веры и глубокого осознания предназначения народа Израиля, помогая им вернуться в лоно своего народа.'
		},
		videoUrl: 'https://www.youtube.com/embed/9ioV_PeaqWE',
		tags: [
			{ he: 'עשרת השבטים', en: 'Ten Tribes', ru: 'Десять колен' },
			{ he: 'פשטונים', en: 'Pashtuns', ru: 'Пуштуны' },
			{ he: 'הר הבית', en: 'Temple Mount', ru: 'Храмовая гора' },
			{ he: 'אפגניסטן', en: 'Afghanistan', ru: 'Афганистан' },
			{ he: 'פקיסטן', en: 'Pakistan', ru: 'Пакистан' },
			{ he: 'שיבת שבטים', en: 'Return of the Tribes', ru: 'Возвращение колен' }
		]
	},
	{
		slug: 'shivat-shvatim-avudim',
		kind: 'כתבה',
		title: {
			he: 'חכמי העדה מקדמים קיבוץ נידחים ושיבת שבטים אבודים חזרה לישראל',
			en: "Chachmei Ha'Eda Promotes the Ingathering of the Dispersed and the Return of the Lost Tribes to Israel",
			ru: 'Хахмей а-Эда содействует собиранию рассеянных и возвращению потерянных колен в Израиль'
		},
		author: {
			he: 'יהב אנטר',
			en: 'Yahav Anter',
			ru: 'Яхав Антер'
		},
		date: '2026-02-01',
		excerpt: {
			he: 'בשנים האחרונות קהילות ברחבי העולם: מאפריקה ועד דרום אמריקה, מביעות עניין גובר בקשר היסטורי לשבטי ישראל.',
			en: 'In recent years, communities around the world — from Africa to South America — have expressed growing interest in their historical connection to the Tribes of Israel.',
			ru: 'В последние годы общины по всему миру — от Африки до Южной Америки — проявляют растущий интерес к своей исторической связи с коленами Израиля.'
		},
		videoUrl: 'https://www.youtube.com/embed/AE9mcu5t_aA?start=9',
		sourceUrl: 'https://israel365news.com/video/meet-a-returning-member-of-the-lost-tribe-of-ephraim/',
		body: {
			he: `הציצו אל אחד מהמסעות האישית של חיפוש שורשים, וחיבור רוחני עמוק ליהדות על מנת להשתלב מחדש בעם היהודי.

חכמי העדה מקדמים ומסייעים בשיבה של שבטים אבודים אלו חזרה אל חיק העם, על ידי בירור זהות היסטורית והלכתית, יצירת מסלול מסודר לשיבה או גיור, והכנה להקמת מוסדות הנהגה רוחניים כלל לאומיים כימי קדם.`,
			en: `Take a glimpse into one of the personal journeys of searching for roots and forging a deep spiritual connection to Judaism in order to rejoin the Jewish people.

Chachmei Ha'Eda promotes and assists the return of these lost tribes to the embrace of the nation, by clarifying historical and Halachic identity, establishing an orderly path to return or conversion, and preparing to re-establish national spiritual leadership institutions as in days of old.`,
			ru: `Загляните в одно из личных путешествий поиска корней и обретения глубокой духовной связи с иудаизмом ради возвращения в еврейский народ.

Хахмей а-Эда содействует возвращению этих потерянных колен в лоно народа путём выяснения исторической и галахической принадлежности, создания упорядоченного пути возвращения или гиюра и подготовки к восстановлению общенациональных духовных институтов руководства, как в древние времена.`
		},
		tags: [
			{ he: 'שיבת שבטים', en: 'Return of the Tribes', ru: 'Возвращение колен' },
			{ he: 'קיבוץ נידחים', en: 'Ingathering of the Dispersed', ru: 'Собирание рассеянных' },
			{ he: 'גיור', en: 'Conversion', ru: 'Гиюр' },
			{ he: 'אפריקה', en: 'Africa', ru: 'Африка' },
			{ he: 'דרום אמריקה', en: 'South America', ru: 'Южная Америка' }
		]
	},
	{
		slug: 'kria-laaliyah-har-tzion',
		kind: 'סרטון',
		title: {
			he: 'קריאה מבית הדין הר ציון לקהילות ישראל שבתפוצות: עת לעלות לארץ',
			en: 'A Call from the Beit Din Har Tzion to the Communities of Israel in the Diaspora: The Time Has Come to Make Aliyah',
			ru: 'Призыв Бейт Дина Хар Цион к общинам Израиля в диаспоре: настало время репатриироваться'
		},
		author: {
			he: 'חכמי העדה - בית הדין הר ציון',
			en: "Chachmei Ha'Eda — Beit Din Har Tzion",
			ru: 'Хахмей а-Эда — Бейт Дин Хар Цион'
		},
		date: '2024-11-18',
		excerpt: {
			he: `קריאה מחכמי העדה, בית הדין הר ציון - לכלל קהילות ישראל שבתפוצות: "סרה השגחת השם על קהילות חו"ל, זה הזמן לעלות לארץ להקים כאן את היעוד שלנו, בואו עם משפחותיכם".`,
			en: `A call from Chachmei Ha'Eda, the Beit Din Har Tzion, to all the communities of Israel in the Diaspora: "Hashem's protective providence has departed from the communities abroad. This is the time to make Aliyah to the Land and establish our destiny here. Come with your families."`,
			ru: `Призыв от Хахмей а-Эда, Бейт Дин Хар Цион, ко всем общинам Израиля в диаспоре: «Провидение Всевышнего отступило от общин за рубежом, настало время репатриироваться в Землю Израиля и осуществить здесь наше предназначение, приезжайте со своими семьями».`
		},
		videoUrl: 'https://www.youtube.com/embed/eub7P1iNNb8',
		sourceUrl: 'https://www.youtube.com/watch?v=eub7P1iNNb8',
		tags: [
			{ he: 'עלייה לארץ', en: 'Aliyah to the Land', ru: 'Репатриация в Землю Израиля' },
			{ he: 'קיבוץ גלויות', en: 'Ingathering of the Exiles', ru: 'Собирание изгнаний' },
			{ he: 'בית הדין הר ציון', en: 'Beit Din Har Tzion', ru: 'Бейт Дин Хар Цион' },
			{ he: 'קריאה לעם ישראל', en: 'Call to the People of Israel', ru: 'Обращение к народу Израиля' }
		]
	}
];

export function getActivityItem(slug: string): ActivityItem | undefined {
	return activity.find((a) => a.slug === slug);
}

export function latestActivity(): ActivityItem {
	return [...activity].sort((a, b) => b.date.localeCompare(a.date))[0];
}
