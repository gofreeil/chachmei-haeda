// עזרי תאריך עברי ↔ לועזי. הערך שנשמר ונשלח לשרת הוא תמיד ISO לועזי (YYYY-MM-DD);
// העברי הוא שכבת בחירה ותצוגה בלבד, כך שאין שינוי בנתונים הקיימים.
// הלוח העברי מחושב ע"י Intl (ca-hebrew) — אותו מנגנון של LiveCalendar.

const HEB_DAY_FMT = new Intl.DateTimeFormat('en-US-u-ca-hebrew', { day: 'numeric' });
const HEB_MONTH_FMT = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { month: 'long' });
const HEB_YEAR_FMT = new Intl.DateTimeFormat('en-US-u-ca-hebrew', { year: 'numeric' });
const GREG_MONTH_FMT = new Intl.DateTimeFormat('he-IL', { month: 'long' });

/** ISO (YYYY-MM-DD) → Date מקומי בחצות. null לערך לא תקין. */
export function parseISO(iso: string | null | undefined): Date | null {
	const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
	if (!m) return null;
	const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
	return Number.isNaN(d.getTime()) || d.getMonth() !== Number(m[2]) - 1 ? null : d;
}

export function toISO(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

export function hebDayNum(d: Date): number {
	return parseInt(HEB_DAY_FMT.format(d), 10);
}
export function hebMonthName(d: Date): string {
	return HEB_MONTH_FMT.format(d);
}
export function hebYearNum(d: Date): number {
	return parseInt(HEB_YEAR_FMT.format(d), 10);
}

/** 15 → "ט״ו", 786 → "תשפ״ו". מיועד ל-3 ספרות אחרונות (שנה) או ליום בחודש. */
export function numToGematria(n: number): string {
	const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
	const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
	const hundreds = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
	let str = hundreds[Math.floor(n / 100)] ?? '';
	const r = n % 100;
	if (r === 15) str += 'טו';
	else if (r === 16) str += 'טז';
	else {
		str += tens[Math.floor(r / 10)] ?? '';
		str += ones[r % 10] ?? '';
	}
	if (str.length === 1) return str + '׳';
	return str.slice(0, -1) + '״' + str.slice(-1);
}

export function hebYearGematria(d: Date): string {
	return numToGematria(hebYearNum(d) % 1000); // 5787 → 787 → "תשפ״ז"
}

export function startOfHebMonth(d: Date): Date {
	const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
	while (hebDayNum(x) !== 1) x.setDate(x.getDate() - 1);
	return x;
}
export function nextHebMonthStart(monthStart: Date): Date {
	const x = new Date(monthStart);
	x.setDate(x.getDate() + 1);
	while (hebDayNum(x) !== 1) x.setDate(x.getDate() + 1);
	return x;
}
export function prevHebMonthStart(monthStart: Date): Date {
	const x = new Date(monthStart);
	x.setDate(x.getDate() - 1);
	return startOfHebMonth(x);
}
/** מספר הימים בחודש העברי שמתחיל ב-monthStart (29 או 30). */
export function hebMonthLength(monthStart: Date): number {
	return Math.round((nextHebMonthStart(monthStart).getTime() - monthStart.getTime()) / 86400000);
}

/** "חודש שנה" — למשל "חשוון תשפ״ז". */
export function hebMonthLabel(monthStart: Date): string {
	return `${hebMonthName(monthStart)} ${hebYearGematria(monthStart)}`;
}

/** טווח החודשים הלועזיים שהחודש העברי נוגע בהם — "אוקטובר – נובמבר 2026". */
export function gregRangeLabel(monthStart: Date): string {
	const endD = new Date(nextHebMonthStart(monthStart).getTime() - 86400000);
	const sm = GREG_MONTH_FMT.format(monthStart);
	const em = GREG_MONTH_FMT.format(endD);
	const sy = monthStart.getFullYear();
	const ey = endD.getFullYear();
	if (sm === em && sy === ey) return `${sm} ${sy}`;
	if (sy === ey) return `${sm} – ${em} ${ey}`;
	return `${sm} ${sy} – ${em} ${ey}`;
}

/** תאריך עברי מלא של ISO לועזי: "ט״ו חשוון תשפ״ז". '' לערך לא תקין. */
export function formatHebrewDate(iso: string | null | undefined): string {
	const d = parseISO(iso);
	if (!d) return '';
	return `${numToGematria(hebDayNum(d))} ${hebMonthName(d)} ${hebYearGematria(d)}`;
}

/** תאריך לועזי קצר "26.10.2026". */
export function formatGregorianShort(iso: string | null | undefined): string {
	const d = parseISO(iso);
	if (!d) return '';
	return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}

/** תאריך לועזי ארוך "26 באוקטובר 2026" — בשפת הממשק (he כברירת מחדל). */
export function formatGregorianLong(iso: string | null | undefined, locale: string | null | undefined = 'he'): string {
	const d = parseISO(iso);
	if (!d) return '';
	const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
	try {
		return new Intl.DateTimeFormat(`${locale || 'he'}-u-ca-gregory-nu-latn`, opts).format(d);
	} catch {
		return new Intl.DateTimeFormat('he-u-ca-gregory', opts).format(d);
	}
}

/** תצוגה כפולה לרשימות וכרטיסים: "ט״ו חשוון תשפ״ז · 26.10.2026". ערך שאינו ISO חוזר כמות שהוא. */
export function formatDual(iso: string | null | undefined): string {
	const heb = formatHebrewDate(iso);
	if (!heb) return iso ?? '';
	return `${heb} · ${formatGregorianShort(iso)}`;
}
