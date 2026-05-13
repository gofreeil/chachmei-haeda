export interface Signatory {
	name: string;
	role?: string;
	city?: string;
	date: string;
}

export const signatories: Signatory[] = [
	{ name: 'הרב יוסף כהן', role: 'אב בית הדין', city: 'ירושלים', date: '2026-01-15' },
	{ name: 'הרב דוד אברהם', role: 'דיין', city: 'בני ברק', date: '2026-01-15' },
	{ name: 'הרב משה לוי', role: 'דיין', city: 'אלעד', date: '2026-01-15' },
	{ name: 'הרב אהרן ישראלי', role: 'דיין ופוסק', city: 'בית שמש', date: '2026-02-02' },
	{ name: 'יעקב מזרחי', role: 'איש עסקים', city: 'תל אביב', date: '2026-02-10' },
	{ name: 'שמואל פרידמן', role: 'יזם', city: 'ירושלים', date: '2026-02-22' },
	{ name: 'אברהם רוזנברג', role: 'בעל מפעל', city: 'אשדוד', date: '2026-03-05' },
	{ name: 'ד"ר חיים שטרן', role: 'רופא', city: 'חיפה', date: '2026-03-18' },
	{ name: 'מרים גולדמן', role: 'יועצת עסקית', city: 'מודיעין', date: '2026-04-01' },
	{ name: 'יצחק ברגר', role: 'עורך דין', city: 'פתח תקווה', date: '2026-04-14' }
];
