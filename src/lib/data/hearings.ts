export interface Hearing {
	id: string;
	caseName: string;
	dayanim: string[];
	zoomLink: string;
	date: string;
	time: string;
	status: 'מתוכנן' | 'התקיים' | 'בוטל';
}

export const hearings: Hearing[] = [
	{
		id: 'h-2026-005',
		caseName: 'תיק 005/2026 — סכסוך מסחרי בין שותפים',
		dayanim: ['הרב יוסף כהן', 'הרב דוד אברהם', 'הרב משה לוי'],
		zoomLink: 'https://zoom.us/j/000000001',
		date: '2026-05-20',
		time: '20:00',
		status: 'מתוכנן'
	},
	{
		id: 'h-2026-004',
		caseName: 'תיק 004/2026 — בירור הסכם שכירות',
		dayanim: ['הרב אהרן ישראלי', 'הרב יוסף כהן', 'הרב משה לוי'],
		zoomLink: 'https://zoom.us/j/000000002',
		date: '2026-05-15',
		time: '19:30',
		status: 'מתוכנן'
	},
	{
		id: 'h-2026-003',
		caseName: 'תיק 003/2026 — הלנת שכר',
		dayanim: ['הרב דוד אברהם', 'הרב אהרן ישראלי', 'הרב יוסף כהן'],
		zoomLink: 'https://zoom.us/j/000000003',
		date: '2026-04-28',
		time: '21:00',
		status: 'התקיים'
	}
];

export interface Ruling {
	id: string;
	caseId: string;
	caseName: string;
	dayanim: string[];
	date: string;
	summary: string;
	decision: string;
}

export const rulings: Ruling[] = [
	{
		id: 'r-2026-003',
		caseId: 'h-2026-003',
		caseName: 'תיק 003/2026 — הלנת שכר',
		dayanim: ['הרב דוד אברהם', 'הרב אהרן ישראלי', 'הרב יוסף כהן'],
		date: '2026-04-28',
		summary:
			'נטענה הלנת שכר בסך 18,000 ש"ח על ידי עובד נגד מעסיק. הצדדים הסכימו על דין תורה לפני בית הדין. נשמעו טענות הצדדים ועדויות. נבחנו תלושי שכר וחוזה העבודה.',
		decision:
			'בית הדין פוסק: על המעסיק לשלם לעובד את מלוא הסכום שנותר חייב (18,000 ש"ח) בתוך 30 יום. כמו כן, לפנים משורת הדין, המעסיק יוסיף 1,000 ש"ח כפיצוי על העיכוב. הצדדים קיבלו את הפסק בקניין סודר.'
	},
	{
		id: 'r-2026-002',
		caseId: 'h-2026-002',
		caseName: 'תיק 002/2026 — ערבות הלוואה',
		dayanim: ['הרב יוסף כהן', 'הרב משה לוי', 'הרב דוד אברהם'],
		date: '2026-03-10',
		summary:
			'מחלוקת על תוקף ערבות בעל-פה להלוואה של 50,000 ש"ח. הערב טוען שלא היה גמירות דעת.',
		decision:
			'בית הדין קובע: הערבות תקפה חלקית. הערב חייב בסך 25,000 ש"ח (מחצית), והלווה יישא במחצית השנייה. החלוקה הזו על פי פשרה הקרובה לדין.'
	}
];

export function getHearing(id: string): Hearing | undefined {
	return hearings.find((h) => h.id === id);
}
