export type Rabbi = {
	id: string;
	name: string;
	photo?: string;
};

export const defaultRabbis: Rabbi[] = [
	{ id: 'r-stavsky', name: 'הרב דניאל סטבסקי' },
	{ id: 'r-zaga', name: 'הרב רועי זאגא' },
	{ id: 'r-lipo', name: 'הרב אריה ליפו' },
	{ id: 'r-malet', name: 'הרב בועז מלט' },
	{ id: 'r-wonder', name: 'הרב יעקב יוסף וונדר' },
	{ id: 'r-moreno', name: 'הרב שמואל מורנו' },
	{ id: 'r-sofi', name: 'הרב נדב סופי' },
	{ id: 'r-halevi', name: 'הרב מאיר הלוי' }
];

export const RABBIS_STORAGE_KEY = 'chachmei-rabbis';
