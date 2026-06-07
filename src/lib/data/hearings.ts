export type LocalizedString = { he: string; en: string; ru: string };

export const pickLang = (v: any, l: string): string =>
	typeof v === 'string' ? v : (v?.[l] ?? v?.he ?? '');

export type HearingStatus = 'מתוכנן' | 'התקיים' | 'בוטל';

export const hearingStatusLabels: Record<HearingStatus, LocalizedString> = {
	מתוכנן: { he: 'מתוכנן', en: 'Scheduled', ru: 'Запланировано' },
	התקיים: { he: 'התקיים', en: 'Held', ru: 'Состоялось' },
	בוטל: { he: 'בוטל', en: 'Cancelled', ru: 'Отменено' }
};

export interface Hearing {
	id: string;
	caseName: LocalizedString;
	dayanim: LocalizedString[];
	zoomLink: string;
	date: string;
	time: string;
	status: HearingStatus;
}

export const hearings: Hearing[] = [
	{
		id: 'h-2026-005',
		caseName: {
			he: 'תיק 005/2026 - סכסוך מסחרי בין שותפים',
			en: 'Case 005/2026 - Commercial dispute between partners',
			ru: 'Дело 005/2026 — Коммерческий спор между партнёрами'
		},
		dayanim: [
			{ he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
			{ he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' },
			{ he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' }
		],
		zoomLink: 'https://zoom.us/j/000000001',
		date: '2026-05-20',
		time: '20:00',
		status: 'מתוכנן'
	},
	{
		id: 'h-2026-004',
		caseName: {
			he: 'תיק 004/2026 - בירור הסכם שכירות',
			en: 'Case 004/2026 - Review of rental agreement',
			ru: 'Дело 004/2026 — Рассмотрение договора аренды'
		},
		dayanim: [
			{ he: 'הרב אהרן ישראלי', en: 'Rabbi Aharon Yisraeli', ru: 'Рав Аарон Исраэли' },
			{ he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
			{ he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' }
		],
		zoomLink: 'https://zoom.us/j/000000002',
		date: '2026-05-15',
		time: '19:30',
		status: 'מתוכנן'
	},
	{
		id: 'h-2026-003',
		caseName: {
			he: 'תיק 003/2026 - הלנת שכר',
			en: 'Case 003/2026 - Withholding of wages',
			ru: 'Дело 003/2026 — Задержка выплаты заработной платы'
		},
		dayanim: [
			{ he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' },
			{ he: 'הרב אהרן ישראלי', en: 'Rabbi Aharon Yisraeli', ru: 'Рав Аарон Исраэли' },
			{ he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' }
		],
		zoomLink: 'https://zoom.us/j/000000003',
		date: '2026-04-28',
		time: '21:00',
		status: 'התקיים'
	}
];

export interface Ruling {
	id: string;
	caseId: string;
	caseName: LocalizedString;
	dayanim: LocalizedString[];
	date: string;
	summary: LocalizedString;
	decision: LocalizedString;
}

export const rulings: Ruling[] = [
	{
		id: 'r-2026-003',
		caseId: 'h-2026-003',
		caseName: {
			he: 'תיק 003/2026 - הלנת שכר',
			en: 'Case 003/2026 - Withholding of wages',
			ru: 'Дело 003/2026 — Задержка выплаты заработной платы'
		},
		dayanim: [
			{ he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' },
			{ he: 'הרב אהרן ישראלי', en: 'Rabbi Aharon Yisraeli', ru: 'Рав Аарон Исраэли' },
			{ he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' }
		],
		date: '2026-04-28',
		summary: {
			he: 'נטענה הלנת שכר בסך 18,000 ש"ח על ידי עובד נגד מעסיק. הצדדים הסכימו על דין תורה לפני בית הדין. נשמעו טענות הצדדים ועדויות. נבחנו תלושי שכר וחוזה העבודה.',
			en: 'An employee filed a claim of wage withholding in the amount of 18,000 NIS against an employer. Both parties agreed to a Din Torah before the Beit Din. The arguments of both sides and witness testimonies were heard. Pay slips and the employment contract were examined.',
			ru: 'Работник подал иск о задержке заработной платы на сумму 18 000 шекелей против работодателя. Стороны согласились на разбирательство по Дин Тора перед Бейт Дином. Были заслушаны доводы сторон и свидетельские показания. Изучены расчётные листки и трудовой договор.'
		},
		decision: {
			he: 'בית הדין פוסק: על המעסיק לשלם לעובד את מלוא הסכום שנותר חייב (18,000 ש"ח) בתוך 30 יום. כמו כן, לפנים משורת הדין, המעסיק יוסיף 1,000 ש"ח כפיצוי על העיכוב. הצדדים קיבלו את הפסק בקניין סודר.',
			en: 'The Beit Din rules: the employer is to pay the employee the full outstanding amount (18,000 NIS) within 30 days. Additionally, beyond the strict letter of the law (lifnim mishurat hadin), the employer shall add 1,000 NIS as compensation for the delay. The parties accepted the ruling by means of kinyan sudar.',
			ru: 'Бейт Дин постановляет: работодатель обязан выплатить работнику всю оставшуюся сумму задолженности (18 000 шекелей) в течение 30 дней. Кроме того, сверх строгой буквы закона (лифним мишурат а-дин), работодатель добавит 1 000 шекелей в качестве компенсации за задержку. Стороны приняли решение посредством киньян судар.'
		}
	},
	{
		id: 'r-2026-002',
		caseId: 'h-2026-002',
		caseName: {
			he: 'תיק 002/2026 - ערבות הלוואה',
			en: 'Case 002/2026 - Loan guarantee',
			ru: 'Дело 002/2026 — Поручительство по займу'
		},
		dayanim: [
			{ he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
			{ he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' },
			{ he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' }
		],
		date: '2026-03-10',
		summary: {
			he: 'מחלוקת על תוקף ערבות בעל-פה להלוואה של 50,000 ש"ח. הערב טוען שלא היה גמירות דעת.',
			en: 'A dispute over the validity of an oral guarantee for a loan of 50,000 NIS. The guarantor claims there was no firm resolve (gemirut da\'at).',
			ru: 'Спор о действительности устного поручительства по займу в размере 50 000 шекелей. Поручитель утверждает, что не было твёрдого намерения (гмирут даат).'
		},
		decision: {
			he: 'בית הדין קובע: הערבות תקפה חלקית. הערב חייב בסך 25,000 ש"ח (מחצית), והלווה יישא במחצית השנייה. החלוקה הזו על פי פשרה הקרובה לדין.',
			en: 'The Beit Din rules: the guarantee is partially valid. The guarantor is liable for 25,000 NIS (half), and the borrower shall bear the other half. This division is based on a compromise close to the strict law (peshara kerova ladin).',
			ru: 'Бейт Дин постановляет: поручительство действительно частично. Поручитель обязан выплатить 25 000 шекелей (половину), а заёмщик несёт ответственность за вторую половину. Такое распределение основано на компромиссе, близком к закону (пшара крова ла-дин).'
		}
	}
];

export function getHearing(id: string): Hearing | undefined {
	return hearings.find((h) => h.id === id);
}
