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


/** מסגור התמונה בעיגול: זום (1 = בלי זום) ונקודת המרכז (x,y — שברים מהריבוע שמוצג, 0–1). */
export type PhotoFrame = { zoom: number; x: number; y: number };

/** מסגור ברירת מחדל לדיין המובלט כשלא נשמר לו מסגור — זום על הפנים. עריכת תמונה בפאנל גוברת עליו. */
export const FEATURED_DEFAULT_FRAME: PhotoFrame = { zoom: 1.8, x: 0.6, y: 0.36 };

/** מגביל את המסגור כך שהחלון הנראה תמיד בתוך התמונה (בלי שוליים ריקים בעיגול). */
export function clampFrame(f: PhotoFrame): PhotoFrame {
	const zoom = Math.min(4, Math.max(1, f.zoom));
	const half = 0.5 / zoom;
	return {
		zoom,
		x: Math.min(1 - half, Math.max(half, f.x)),
		y: Math.min(1 - half, Math.max(half, f.y))
	};
}

/** התמונה נשמרת בבאקאנד בשדה טקסט אחד: כתובת + (לא חובה) מסגור כ-fragment — `url#z=1.8&x=0.6&y=0.36`.
 *  ה-fragment לא נשלח לשרת ולא משנה את הקובץ, ולכן גם קוד שלא מכיר אותו מציג את התמונה במלואה. */
export function parsePhoto(photo?: string): { src?: string; frame?: PhotoFrame } {
	if (!photo) return {};
	const m = photo.match(/^(.*)#z=([\d.]+)&x=([\d.]+)&y=([\d.]+)$/s);
	if (!m) return { src: photo };
	const frame = { zoom: Number(m[2]), x: Number(m[3]), y: Number(m[4]) };
	if (![frame.zoom, frame.x, frame.y].every(Number.isFinite)) return { src: m[1] };
	return { src: m[1], frame: clampFrame(frame) };
}

export function buildPhoto(src: string, frame?: PhotoFrame): string {
	if (!frame) return src;
	const f = clampFrame(frame);
	return `${src}#z=${f.zoom.toFixed(2)}&x=${f.x.toFixed(3)}&y=${f.y.toFixed(3)}`;
}

/** סגנון CSS ל-<img> שיושב בתוך מיכל ריבועי עם overflow-hidden (ו-object-cover). */
export function frameStyle(frame?: PhotoFrame): string {
	if (!frame) return '';
	const { zoom, x, y } = frame;
	return (
		`transform-origin: ${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%; ` +
		`transform: translate(${((0.5 - x) * 100).toFixed(2)}%, ${((0.5 - y) * 100).toFixed(2)}%) scale(${zoom});`
	);
}
