export type Rabbi = {
	id: string;
	name: string;
	photo?: string;
	title?: string;
	nickname?: string;
	city?: string;
};

export const defaultRabbis: Rabbi[] = [
	{
		id: 'r-abergil',
		name: "הרב אליהו אברג'יל",
		title: 'ראש ואב בית הדין'
	},
	{ id: 'r-stavsky', name: 'הרב דניאל סטבסקי' },
	{ id: 'r-zaga', name: 'הרב רועי זאגא' },
	{ id: 'r-lipo', name: 'הרב אריה ליפו' },
	{ id: 'r-malet', name: 'הרב בועז מלט' },
	{ id: 'r-wonder', name: 'הרב יעקב יוסף וונדר' },
	{ id: 'r-moreno', name: 'הרב שמואל מורנו' },
	{ id: 'r-sofi', name: 'הרב נדב סופי' },
	{ id: 'r-halevi', name: 'הרב מאיר הלוי' },
	{ id: 'r-schwartz', name: 'הרב בנימין שוורץ' }
];

export const RABBIS_STORAGE_KEY = 'chachmei-rabbis';

