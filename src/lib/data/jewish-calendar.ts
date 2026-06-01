// לוח שנה יהודי ל-10 שנים קדימה — חגים, מועדים, וזמני כניסת שבת בירושלים.

export type CalEventKind = 'יום-טוב' | 'חוה"מ' | 'צום' | 'מועד' | 'לאומי';
export interface CalEvent {
	date: string; // YYYY-MM-DD (גרגוריאני)
	name: string;
	kind: CalEventKind;
	blocking: boolean; // האם חוסם קביעת דיון
}

const HEB_DAY_FMT = new Intl.DateTimeFormat('en-US-u-ca-hebrew', { day: 'numeric' });
const HEB_MONTH_FMT = new Intl.DateTimeFormat('en-US-u-ca-hebrew', { month: 'long' });

function toISO(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

interface Rule {
	name: string;
	kind: CalEventKind;
	blocking: boolean;
}

// מפתח = "שם-חודש-עברי-יום". שם חודש כפי שמופק מ-Intl ('en-US-u-ca-hebrew').
const HOLIDAY_RULES: Record<string, Rule> = {
	'Tishri-1': { name: 'ראש השנה', kind: 'יום-טוב', blocking: true },
	"Tishri-2": { name: "ראש השנה ב'", kind: 'יום-טוב', blocking: true },
	'Tishri-3': { name: 'צום גדליה', kind: 'צום', blocking: false },
	'Tishri-10': { name: 'יום כיפור', kind: 'יום-טוב', blocking: true },
	'Tishri-15': { name: 'סוכות', kind: 'יום-טוב', blocking: true },
	"Tishri-16": { name: "סוכות ב'", kind: 'יום-טוב', blocking: true },
	'Tishri-17': { name: 'חוה"מ סוכות', kind: 'חוה"מ', blocking: false },
	'Tishri-18': { name: 'חוה"מ סוכות', kind: 'חוה"מ', blocking: false },
	'Tishri-19': { name: 'חוה"מ סוכות', kind: 'חוה"מ', blocking: false },
	'Tishri-20': { name: 'חוה"מ סוכות', kind: 'חוה"מ', blocking: false },
	'Tishri-21': { name: 'הושענא רבה', kind: 'חוה"מ', blocking: false },
	'Tishri-22': { name: 'שמיני עצרת', kind: 'יום-טוב', blocking: true },
	'Tishri-23': { name: 'שמחת תורה', kind: 'יום-טוב', blocking: true },
	'Kislev-25': { name: 'חנוכה (א)', kind: 'מועד', blocking: false },
	'Kislev-26': { name: 'חנוכה (ב)', kind: 'מועד', blocking: false },
	'Kislev-27': { name: 'חנוכה (ג)', kind: 'מועד', blocking: false },
	'Kislev-28': { name: 'חנוכה (ד)', kind: 'מועד', blocking: false },
	'Kislev-29': { name: 'חנוכה (ה)', kind: 'מועד', blocking: false },
	'Kislev-30': { name: 'חנוכה', kind: 'מועד', blocking: false },
	'Tevet-1': { name: 'חנוכה', kind: 'מועד', blocking: false },
	'Tevet-2': { name: 'חנוכה', kind: 'מועד', blocking: false },
	'Tevet-3': { name: 'חנוכה (ח)', kind: 'מועד', blocking: false },
	'Tevet-10': { name: 'עשרה בטבת', kind: 'צום', blocking: false },
	'Shevat-15': { name: 'ט"ו בשבט', kind: 'מועד', blocking: false },
	'Adar-13': { name: 'תענית אסתר', kind: 'צום', blocking: false },
	'Adar-14': { name: 'פורים', kind: 'מועד', blocking: true },
	'Adar-15': { name: 'שושן פורים', kind: 'מועד', blocking: false },
	'Adar II-13': { name: 'תענית אסתר', kind: 'צום', blocking: false },
	'Adar II-14': { name: 'פורים', kind: 'מועד', blocking: true },
	'Adar II-15': { name: 'שושן פורים', kind: 'מועד', blocking: false },
	'Nisan-14': { name: 'ערב פסח', kind: 'יום-טוב', blocking: true },
	'Nisan-15': { name: 'פסח', kind: 'יום-טוב', blocking: true },
	"Nisan-16": { name: "פסח ב'", kind: 'יום-טוב', blocking: true },
	'Nisan-17': { name: 'חוה"מ פסח', kind: 'חוה"מ', blocking: false },
	'Nisan-18': { name: 'חוה"מ פסח', kind: 'חוה"מ', blocking: false },
	'Nisan-19': { name: 'חוה"מ פסח', kind: 'חוה"מ', blocking: false },
	'Nisan-20': { name: 'חוה"מ פסח', kind: 'חוה"מ', blocking: false },
	'Nisan-21': { name: 'שביעי של פסח', kind: 'יום-טוב', blocking: true },
	'Nisan-27': { name: 'יום השואה', kind: 'לאומי', blocking: false },
	'Iyar-4': { name: 'יום הזיכרון', kind: 'לאומי', blocking: false },
	'Iyar-5': { name: 'יום העצמאות', kind: 'לאומי', blocking: false },
	'Iyar-18': { name: 'ל"ג בעומר', kind: 'מועד', blocking: false },
	'Iyar-28': { name: 'יום ירושלים', kind: 'לאומי', blocking: false },
	'Sivan-6': { name: 'שבועות', kind: 'יום-טוב', blocking: true },
	'Tamuz-17': { name: 'י"ז בתמוז', kind: 'צום', blocking: false },
	'Av-9': { name: 'תשעה באב', kind: 'צום', blocking: true },
	'Av-15': { name: 'ט"ו באב', kind: 'מועד', blocking: false }
};

function buildEventsCache(years: number): Map<string, CalEvent> {
	const map = new Map<string, CalEvent>();
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	start.setDate(start.getDate() - 35); // לכסות את כל החודש העברי הנוכחי גם אם התחיל לפני יותר מחודש לועזי
	const totalDays = years * 366 + 42;

	for (let i = 0; i < totalDays; i++) {
		const d = new Date(start);
		d.setDate(d.getDate() + i);
		const key = `${HEB_MONTH_FMT.format(d)}-${HEB_DAY_FMT.format(d)}`;
		const rule = HOLIDAY_RULES[key];
		if (rule) {
			const ds = toISO(d);
			map.set(ds, { date: ds, name: rule.name, kind: rule.kind, blocking: rule.blocking });
		}
	}
	return map;
}

// מטמון גלובלי לעשר שנים קדימה — נבנה פעם אחת בעת טעינת המודול.
export const calendarEvents: Map<string, CalEvent> = buildEventsCache(10);

export function getEvent(dateStr: string): CalEvent | undefined {
	return calendarEvents.get(dateStr);
}

// ---- זמני כניסת שבת בירושלים (חישוב NOAA, דיוק ±2 דקות) ----

const JERUSALEM_LAT = 31.7683;
const JERUSALEM_LNG = 35.2137;
const CANDLE_LIGHTING_OFFSET_MIN = 40; // מנהג ירושלים — 40 דקות לפני השקיעה

function dayOfYear(d: Date): number {
	const start = Date.UTC(d.getFullYear(), 0, 0);
	const cur = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
	return Math.floor((cur - start) / 86400000);
}

function sunsetUTCMinutes(d: Date, lat: number, lng: number): number {
	const N = dayOfYear(d);
	const gamma = ((2 * Math.PI) / 365) * (N - 1);
	const eqtime =
		229.18 *
		(0.000075 +
			0.001868 * Math.cos(gamma) -
			0.032077 * Math.sin(gamma) -
			0.014615 * Math.cos(2 * gamma) -
			0.040849 * Math.sin(2 * gamma));
	const decl =
		0.006918 -
		0.399912 * Math.cos(gamma) +
		0.070257 * Math.sin(gamma) -
		0.006758 * Math.cos(2 * gamma) +
		0.000907 * Math.sin(2 * gamma) -
		0.002697 * Math.cos(3 * gamma) +
		0.00148 * Math.sin(3 * gamma);
	const phi = (lat * Math.PI) / 180;
	const zenith = (90.833 * Math.PI) / 180;
	const cosH = (Math.cos(zenith) - Math.sin(phi) * Math.sin(decl)) / (Math.cos(phi) * Math.cos(decl));
	if (cosH < -1 || cosH > 1) return 1080; // fallback ~18:00 UTC
	const haDeg = (Math.acos(cosH) * 180) / Math.PI;
	// קונבנציית NOAA: lng חיובי למזרח, HA חיובי לשקיעה. סולאר-נון = 720 − 4·lng − eqtime; שקיעה = noon + 4·HA.
	return 720 - 4 * (lng - haDeg) - eqtime;
}

function inIsraelDST(d: Date): boolean {
	const year = d.getFullYear();
	const lastMar = new Date(year, 2, 31);
	while (lastMar.getDay() !== 0) lastMar.setDate(lastMar.getDate() - 1);
	const dstStart = new Date(lastMar);
	dstStart.setDate(dstStart.getDate() - 2); // יום שישי לפני יום ראשון האחרון של מרץ
	const lastOct = new Date(year, 9, 31);
	while (lastOct.getDay() !== 0) lastOct.setDate(lastOct.getDate() - 1);
	return d >= dstStart && d < lastOct;
}

function fmtTime(totalMinutes: number): string {
	let m = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
	const h = Math.floor(m / 60);
	const mm = m % 60;
	return `${h}:${String(mm).padStart(2, '0')}`;
}

// כניסת שבת ביום שישי. מחזיר undefined בימים אחרים.
export function shabbatEntryTime(d: Date): string | undefined {
	if (d.getDay() !== 5) return undefined;
	const sunsetUTC = sunsetUTCMinutes(d, JERUSALEM_LAT, JERUSALEM_LNG);
	const offset = inIsraelDST(d) ? 180 : 120;
	return fmtTime(sunsetUTC + offset - CANDLE_LIGHTING_OFFSET_MIN);
}

// צאת השבת בשבת (לפי שקיעה + 40 דק' בערך — מנהג רוב הקהילות).
export function shabbatExitTime(d: Date): string | undefined {
	if (d.getDay() !== 6) return undefined;
	const sunsetUTC = sunsetUTCMinutes(d, JERUSALEM_LAT, JERUSALEM_LNG);
	const offset = inIsraelDST(d) ? 180 : 120;
	return fmtTime(sunsetUTC + offset + 40);
}
