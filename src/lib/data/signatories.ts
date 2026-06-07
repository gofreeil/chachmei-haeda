export type LocalizedString = { he: string; en: string; ru: string };

export const pickLang = (v: any, l: string | null | undefined): string =>
	typeof v === 'string' ? v : (v?.[l ?? 'he'] ?? v?.he ?? '');

export interface Signatory {
	name: LocalizedString;
	role?: LocalizedString;
	city?: LocalizedString;
	date: string;
}

export const signatories: Signatory[] = [
	{
		name: { he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
		role: { he: 'אב בית הדין', en: 'Head of the Beit Din', ru: 'Глава Бейт Дина' },
		city: { he: 'ירושלים', en: 'Jerusalem', ru: 'Иерусалим' },
		date: '2026-01-15'
	},
	{
		name: { he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' },
		role: { he: 'דיין', en: 'Dayan (Judge)', ru: 'Даян (судья)' },
		city: { he: 'בני ברק', en: 'Bnei Brak', ru: 'Бней-Брак' },
		date: '2026-01-15'
	},
	{
		name: { he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' },
		role: { he: 'דיין', en: 'Dayan (Judge)', ru: 'Даян (судья)' },
		city: { he: 'אלעד', en: 'Elad', ru: 'Эльад' },
		date: '2026-01-15'
	},
	{
		name: { he: 'הרב אהרן ישראלי', en: 'Rabbi Aharon Israeli', ru: 'Рав Аарон Исраэли' },
		role: { he: 'דיין ופוסק', en: 'Dayan and Halachic Decisor', ru: 'Даян и галахический авторитет' },
		city: { he: 'בית שמש', en: 'Beit Shemesh', ru: 'Бейт-Шемеш' },
		date: '2026-02-02'
	},
	{
		name: { he: 'יעקב מזרחי', en: 'Yaakov Mizrahi', ru: 'Яаков Мизрахи' },
		role: { he: 'איש עסקים', en: 'Businessman', ru: 'Предприниматель' },
		city: { he: 'תל אביב', en: 'Tel Aviv', ru: 'Тель-Авив' },
		date: '2026-02-10'
	},
	{
		name: { he: 'שמואל פרידמן', en: 'Shmuel Friedman', ru: 'Шмуэль Фридман' },
		role: { he: 'יזם', en: 'Entrepreneur', ru: 'Предприниматель' },
		city: { he: 'ירושלים', en: 'Jerusalem', ru: 'Иерусалим' },
		date: '2026-02-22'
	},
	{
		name: { he: 'אברהם רוזנברג', en: 'Avraham Rosenberg', ru: 'Авраам Розенберг' },
		role: { he: 'בעל מפעל', en: 'Factory Owner', ru: 'Владелец завода' },
		city: { he: 'אשדוד', en: 'Ashdod', ru: 'Ашдод' },
		date: '2026-03-05'
	},
	{
		name: { he: 'ד"ר חיים שטרן', en: 'Dr. Chaim Stern', ru: 'Д-р Хаим Штерн' },
		role: { he: 'רופא', en: 'Physician', ru: 'Врач' },
		city: { he: 'חיפה', en: 'Haifa', ru: 'Хайфа' },
		date: '2026-03-18'
	},
	{
		name: { he: 'מרים גולדמן', en: 'Miriam Goldman', ru: 'Мирьям Голдман' },
		role: { he: 'יועצת עסקית', en: 'Business Consultant', ru: 'Бизнес-консультант' },
		city: { he: 'מודיעין', en: 'Modi\'in', ru: 'Модиин' },
		date: '2026-04-01'
	},
	{
		name: { he: 'יצחק ברגר', en: 'Yitzhak Berger', ru: 'Ицхак Бергер' },
		role: { he: 'עורך דין', en: 'Attorney', ru: 'Адвокат' },
		city: { he: 'פתח תקווה', en: 'Petah Tikva', ru: 'Петах-Тиква' },
		date: '2026-04-14'
	}
];
