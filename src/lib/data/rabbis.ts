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
		title: 'ראש ואב בית הדין',
		photo: '/images/rabbis/abergil.png'
	},
	{ id: 'r-stavsky', name: 'הרב דניאל סטבסקי', photo: '/images/rabbis/stavsky.jpg' },
	{ id: 'r-zaga', name: 'הרב רועי זאגא', photo: '/images/rabbis/zaga.jpg' },
	{ id: 'r-lipo', name: 'הרב אריה ליפו', photo: '/images/rabbis/lipo.jpg' },
	{ id: 'r-malet', name: 'הרב בועז מלט', photo: '/images/rabbis/malet.jpg' },
	{ id: 'r-wonder', name: 'הרב יעקב יוסף וונדר' },
	{ id: 'r-moreno', name: 'הרב שמואל מורנו', photo: '/images/rabbis/moreno.jpg' },
	{ id: 'r-sofi', name: 'הרב נדב סופי', photo: '/images/rabbis/sofi.jpg' },
	{ id: 'r-halevi', name: 'הרב מאיר הלוי', photo: '/images/rabbis/halevi.jpg' },
	{ id: 'r-schwartz', name: 'הרב בנימין שוורץ', photo: '/images/rabbis/schwartz.jpg' }
];

export const RABBIS_STORAGE_KEY = 'chachmei-rabbis';

/** מבטיח שראש ואב בית הדין תמיד בראש הרשימה — גם כשהרשימה נטענת מהבאקאנד/localStorage שלא כוללים אותו. */
export function withHeadRabbi(list: Rabbi[]): Rabbi[] {
	const head = defaultRabbis[0];
	const isHead = (r: Rabbi) => r.id === head.id || /אברג/.test(r.name);
	const existing = list.find(isHead);
	const rest = list.filter((r) => !isHead(r));
	return [existing ? { ...head, ...existing, title: existing.title || head.title, photo: existing.photo || head.photo } : head, ...rest];
}
