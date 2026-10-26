// קובץ PDF מצורף לתוכן (מאמר / פסק דין).
//
// הקובץ עצמו נשמר בספריית המדיה של Strapi (העלאה דרך /api/pdf-upload). ההפניה אליו
// נשמרת בתוך שדה ה-JSON הקיים של התוכן (body של מאמר, decision של פסק דין) תחת המפתח
// `pdf` — כך אין צורך בשינוי סכמה בבקאנד המשותף, וקוראים ישנים שמתעלמים מהמפתח
// ממשיכים לעבוד כרגיל. unpackPdf מפריד אותו חזרה מהטקסט המתורגם.
import { getJwt } from '$lib/strapi';

export interface PdfRef {
	url: string;
	name: string;
	size: number;
}

export const MAX_PDF_MB = 4;

/** הפניה תקינה בלבד: כתובת http(s) — לא javascript:/data: שהוזרקו לשדה. */
export function safePdfRef(raw: unknown): PdfRef | null {
	if (!raw || typeof raw !== 'object') return null;
	const r = raw as Record<string, unknown>;
	if (typeof r.url !== 'string' || !/^https?:\/\//i.test(r.url)) return null;
	return {
		url: r.url,
		name: typeof r.name === 'string' && r.name ? r.name : 'document.pdf',
		size: typeof r.size === 'number' ? r.size : 0
	};
}

type Loc = { he: string; en: string; ru: string };

/** מפריד את ה-PDF משדה JSON רב-לשוני שנטען מסטראפי. */
export function unpackPdf(raw: (Loc & { pdf?: unknown }) | null | undefined): { value: Loc; pdf: PdfRef | null } {
	if (!raw) return { value: { he: '', en: '', ru: '' }, pdf: null };
	// ערך ישן שנשמר כמחרוזת חשופה — עובר כמות שהוא (pickLang יודע לקרוא אותו)
	if (typeof raw !== 'object') return { value: raw as unknown as Loc, pdf: null };
	const { pdf, ...value } = raw;
	return { value: value as Loc, pdf: safePdfRef(pdf) };
}

/** מצרף הפניית PDF לשדה JSON רב-לשוני לפני שמירה (ללא PDF — השדה נשאר כמות שהוא). */
export function packPdf(value: Loc, pdf: PdfRef | null | undefined): Loc & { pdf?: PdfRef } {
	return pdf ? { ...value, pdf } : { ...value };
}

export function formatPdfSize(bytes: number): string {
	if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

/** העלאת PDF דרך שרת האתר. זורק Error עם הודעה בעברית. */
export async function uploadPdf(file: File): Promise<PdfRef> {
	if (file.size > MAX_PDF_MB * 1024 * 1024) {
		throw new Error(`הקובץ גדול מדי (עד ${MAX_PDF_MB}MB, הקובץ ${formatPdfSize(file.size)})`);
	}
	const jwt = getJwt();
	const form = new FormData();
	form.append('file', file);
	let res: Response;
	try {
		res = await fetch('/api/pdf-upload', {
			method: 'POST',
			headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
			body: form
		});
	} catch {
		throw new Error('לא הצלחנו להתחבר לשרת. בדקו את החיבור ונסו שוב');
	}
	const data = await res.json().catch(() => null);
	if (!res.ok) throw new Error(data?.message || `העלאת הקובץ נכשלה (${res.status})`);
	const ref = safePdfRef(data);
	if (!ref) throw new Error('השרת החזיר תשובה לא תקינה');
	return ref;
}
