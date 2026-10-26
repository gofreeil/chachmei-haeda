// ניתוח אוטומטי של טקסט שחולץ מ-PDF (דרך /api/pdf-analyze): סוג המסמך + שדות הטופס.
// הניתוח אופציונלי — כשהוא נכשל (אין מפתח בשרת, תקלה זמנית) הטפסים נשארים עם המילוי הבסיסי.
import { getJwt } from '$lib/strapi';

export type PdfDocType = 'article' | 'ruling';

export interface PdfAnalysis {
	docType: PdfDocType;
	/** מאמר: כותרת. פסק דין: שם התיק */
	title: string;
	author: string;
	/** YYYY-MM-DD, או ריק כשלא נמצא תאריך ודאי */
	dateISO: string;
	/** מאמר: תקציר. פסק דין: סיכום הדיון */
	excerpt: string;
	tags: string[];
	dayanim: string[];
	caseRef: string;
	/** שורות כותרת/מחבר/תאריך מתחילת הטקסט — מוסרות מגוף המאמר כדי שלא יוצגו פעמיים */
	headerLines: string[];
}

export interface AnalyzeContext {
	/** הטופס שהאדמין פתח — משמש כברירת מחדל כשסוג המסמך לא חד-משמעי */
	hint?: PdfDocType;
	/** שמות רבנים/דיינים מוכרים — לאחידות הכתיב */
	knownNames?: string[];
	/** תגיות קיימות באתר — להעדפת תגיות קיימות על פני חדשות */
	knownTags?: string[];
}

/** זורק Error עם הודעה בעברית כשהניתוח נכשל. */
export async function analyzePdfText(text: string, ctx: AnalyzeContext = {}): Promise<PdfAnalysis> {
	const jwt = getJwt();
	let res: Response;
	try {
		res = await fetch('/api/pdf-analyze', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}) },
			body: JSON.stringify({ text, ...ctx })
		});
	} catch {
		throw new Error('לא הצלחנו להתחבר לשרת הניתוח');
	}
	const data = await res.json().catch(() => null);
	if (!res.ok) throw new Error(data?.message || `הניתוח נכשל (${res.status})`);
	if (!data || (data.docType !== 'article' && data.docType !== 'ruling')) throw new Error('השרת החזיר תשובה לא תקינה');
	return data as PdfAnalysis;
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * מסיר מתחילת הטקסט את הפסקאות שהן כותרת/מחבר/תאריך (כפי שזוהו בניתוח), כדי שלא יופיעו פעמיים —
 * פעם בשדה ייעודי ופעם בגוף. מסיר רק פסקאות שזהות במלואן לשורת כותרת; כל השאר נשאר.
 */
export function stripHeaderLines(text: string, headerLines: string[]): string {
	if (headerLines.length === 0) return text;
	const wanted = new Set(headerLines.map(norm).filter(Boolean));
	const paras = text.split(/\n{2,}/);
	let i = 0;
	while (i < paras.length && i < 6 && wanted.has(norm(paras[i]))) i++;
	return i === 0 ? text : paras.slice(i).join('\n\n').trim();
}

/** "#תגית1 #תגית2" — פורמט שדה התגיות בטופס המאמר */
export function tagsToField(tags: string[]): string {
	return tags.map((t) => `#${t}`).join(' ');
}
