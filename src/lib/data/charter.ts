// ─────────────────────────────────────────────────────────────
// אמנת חכמי העדה - מודל נתונים
// בעתיד יחובר ל-Strapi (CMS) - ראה charter-service.ts
// ─────────────────────────────────────────────────────────────

export type CharterStatus = 'pending' | 'signed' | 'disqualified';

export interface CharterEntry {
	id: string;
	name: string;
	role?: string;
	city?: string;
	email?: string;
	phone?: string;
	status: CharterStatus;
	/** תאריך החתימה / הצטרפות */
	date: string;
	/** במקרה של פסילה - סיבה ותאריך פסילה */
	disqualifiedReason?: string;
	disqualifiedDate?: string;
	/** מי פסל (חבר ביה"ד) */
	disqualifiedBy?: string;
	/** האם המשתמש סימן הסכמה מפורשת לאמנה */
	acceptedTerms?: boolean;
}

// פריטי דמו ראשוניים - יוחלפו על ידי Strapi בעתיד
export const initialCharterEntries: CharterEntry[] = [
	{
		id: 'demo-1',
		name: 'הרב יוסף כהן',
		role: 'אב בית הדין',
		city: 'ירושלים',
		status: 'signed',
		date: '2026-01-15',
		acceptedTerms: true
	},
	{
		id: 'demo-2',
		name: 'הרב דוד אברהם',
		role: 'דיין',
		city: 'בני ברק',
		status: 'signed',
		date: '2026-01-15',
		acceptedTerms: true
	},
	{
		id: 'demo-3',
		name: 'הרב משה לוי',
		role: 'דיין',
		city: 'אלעד',
		status: 'signed',
		date: '2026-01-15',
		acceptedTerms: true
	}
];
