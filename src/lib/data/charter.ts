// ─────────────────────────────────────────────────────────────
// אמנת חכמי העדה - מודל נתונים
// בעתיד יחובר ל-Strapi (CMS) - ראה charter-service.ts
// ─────────────────────────────────────────────────────────────

export type CharterStatus = 'pending' | 'signed' | 'disqualified';

export type LocalizedString = { he: string; en: string; ru: string };

/** Helper: pick localized value, falling back to Hebrew. Accepts plain strings too. */
export const pickLang = (v: any, l: string | null | undefined): string =>
	typeof v === 'string' ? v : (v?.[l ?? 'he'] ?? v?.he ?? '');

export interface CharterEntry {
	id: string;
	name: string | LocalizedString;
	businessName?: string | LocalizedString;
	role?: string | LocalizedString;
	city?: string | LocalizedString;
	email?: string;
	phone?: string;
	birthDate?: string;
	idNumber?: string;
	status: CharterStatus;
	/** תאריך החתימה / הצטרפות */
	date: string;
	/** במקרה של פסילה - סיבה ותאריך פסילה */
	disqualifiedReason?: string | LocalizedString;
	disqualifiedDate?: string;
	/** מי פסל (חבר ביה"ד) */
	disqualifiedBy?: string | LocalizedString;
	/** האם המשתמש סימן הסכמה מפורשת לאמנה */
	acceptedTerms?: boolean;
}

// פריטי דמו ראשוניים - יוחלפו על ידי Strapi בעתיד
export const initialCharterEntries: CharterEntry[] = [
	{
		id: 'demo-1',
		name: { he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
		role: { he: 'אב בית הדין', en: 'Head of the Beit Din', ru: 'Глава Бейт Дина' },
		city: { he: 'ירושלים', en: 'Jerusalem', ru: 'Иерусалим' },
		status: 'signed',
		date: '2026-01-15',
		acceptedTerms: true
	},
	{
		id: 'demo-2',
		name: { he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' },
		role: { he: 'דיין', en: 'Dayan (Judge)', ru: 'Даян (судья)' },
		city: { he: 'בני ברק', en: 'Bnei Brak', ru: 'Бней-Брак' },
		status: 'signed',
		date: '2026-01-15',
		acceptedTerms: true
	},
	{
		id: 'demo-3',
		name: { he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' },
		role: { he: 'דיין', en: 'Dayan (Judge)', ru: 'Даян (судья)' },
		city: { he: 'אלעד', en: 'Elad', ru: 'Эльад' },
		status: 'signed',
		date: '2026-01-15',
		acceptedTerms: true
	}
];
