// חילוץ טקסט מקובץ PDF בדפדפן (pdf.js) — כדי להטמיע את תוכן ה-PDF באתר כטקסט
// רגיל, ניתן לעריכה, לחיפוש ול-SEO. הכול רץ אצל האדמין, בלי שליחת הקובץ לשום שירות.
//
// מגבלות (הטקסט המחולץ הוא טיוטה שהאדמין בודק לפני פרסום):
//  • רק PDF "דיגיטלי" (נוצר מוורד/גוגל-דוקס וכד') עם שכבת טקסט. PDF סרוק (תמונה בלבד)
//    אין בו מה לחלץ — נדרש OCR; extractPdfText מחזיר hasText=false והממשק מסביר זאת.
//  • pdf.js מחזיר את הפריטים בסדר הציור (ויזואלי), לא בסדר הקריאה. בשורות עבריות אנחנו
//    מסדרים אותם מחדש מימין לשמאל; ערבוב צמוד של עברית, ספרות ולועזית באותה מילה
//    עשוי להישאר בסדר לא מושלם.

/** פריט טקסט כפי ש-pdf.js מחזיר מ-getTextContent (רק השדות שבשימוש). */
export interface PdfTextItem {
	str: string;
	transform: number[];
	width: number;
	height: number;
	hasEOL?: boolean;
}

interface Line {
	text: string;
	y: number;
	height: number;
	minX: number;
	maxX: number;
}

const HEBREW = /[֐-׿יִ-ﭏ]/;
const LATIN_OR_DIGIT = /[A-Za-z0-9]/;

type Kind = 'R' | 'L' | 'N';
/** R = מכיל עברית, L = לועזית/ספרות בלבד, N = ניטרלי (רווח/פיסוק). */
function kindOf(s: string): Kind {
	if (HEBREW.test(s)) return 'R';
	return LATIN_OR_DIGIT.test(s) ? 'L' : 'N';
}

/** פיסוק שנצמד לקצה של קטע לועזי בציור ויזואלי (".PDF" = "PDF." בקריאה) — מחזירים למקומו הלוגי. */
function fixLatinEdgePunct(s: string): string {
	const lead = /^[.,;:!?)\]"״׳']+/.exec(s)?.[0] ?? '';
	const rest = s.slice(lead.length);
	const trail = /[(\[]+$/.exec(rest)?.[0] ?? '';
	return trail + rest.slice(0, rest.length - trail.length) + lead;
}

interface Placed {
	str: string;
	x: number;
	w: number;
}

/** סדר קריאה לשורה עברית: מימין לשמאל, וקטעי לועזית/מספרים רצופים נשארים משמאל לימין. */
function orderRtl(items: Placed[]): Placed[] {
	const sorted = [...items].sort((a, b) => b.x - a.x);
	const kinds = sorted.map((p) => kindOf(p.str));
	const out: Placed[] = [];
	let i = 0;
	while (i < sorted.length) {
		if (kinds[i] !== 'L') {
			out.push(sorted[i++]);
			continue;
		}
		// מרחיבים את הקבוצה כל עוד הבא הוא L, או ניטרלי שאחריו עוד L
		let j = i;
		while (j + 1 < sorted.length) {
			if (kinds[j + 1] === 'L') j++;
			else if (kinds[j + 1] === 'N' && j + 2 < sorted.length && kinds[j + 2] === 'L') j += 2;
			else break;
		}
		const group = sorted.slice(i, j + 1).reverse();
		for (const g of group) out.push(kindOf(g.str) === 'L' ? { ...g, str: fixLatinEdgePunct(g.str) } : g);
		i = j + 1;
	}
	return out;
}

function buildLineText(items: Placed[], h: number): string {
	const rtl =
		items.filter((p) => HEBREW.test(p.str)).length >= items.filter((p) => kindOf(p.str) === 'L').length &&
		items.some((p) => HEBREW.test(p.str));
	const ordered = rtl ? orderRtl(items) : [...items].sort((a, b) => a.x - b.x);
	let text = '';
	let prev: Placed | null = null;
	for (const p of ordered) {
		if (prev && text && p.str) {
			// מרחק בין תיבות הפריטים, בלי תלות בכיוון הכתיבה
			const gap = Math.max(p.x - (prev.x + prev.w), prev.x - (p.x + p.w));
			if (gap > h * 0.12 && !/\s$/.test(text) && !/^\s/.test(p.str)) text += ' ';
		}
		text += p.str;
		if (p.str) prev = p;
	}
	return text.replace(/[ \t ]+/g, ' ').trim();
}

/** המרת פריטי עמוד לשורות: מקבצים לפי גובה (y), ואז מסדרים כל שורה לסדר קריאה. */
function itemsToLines(items: PdfTextItem[]): Line[] {
	const groups: { y: number; height: number; items: Placed[] }[] = [];
	let cur: (typeof groups)[number] | null = null;
	for (const it of items) {
		if (typeof it.str !== 'string' || it.str === '') continue;
		const x = it.transform[4];
		const y = it.transform[5];
		const h = Math.abs(it.height) || Math.abs(it.transform[3]) || 10;
		if (!cur || Math.abs(y - cur.y) > Math.max(cur.height, h) * 0.6) {
			cur = { y, height: h, items: [] };
			groups.push(cur);
		}
		cur.items.push({ str: it.str, x, w: it.width });
		cur.height = Math.max(cur.height, h);
	}
	return groups
		.map((g) => ({
			text: buildLineText(g.items, g.height),
			y: g.y,
			height: g.height,
			minX: Math.min(...g.items.map((p) => p.x)),
			maxX: Math.max(...g.items.map((p) => p.x + p.w))
		}))
		.filter((l) => l.text.length > 0);
}

const SENTENCE_END = /[.!?:׃״"”)\]]$/;

/** שורות עמוד → פסקאות. שורות רצופות באותה פסקה מחוברות ברווח (שבירת השורה ב-PDF היא ויזואלית בלבד). */
export function assemblePageText(items: PdfTextItem[]): string {
	const lines = itemsToLines(items);
	if (lines.length === 0) return '';
	const widest = Math.max(...lines.map((l) => l.maxX - l.minX));
	const paragraphs: string[] = [];
	let para = lines[0].text;
	for (let i = 1; i < lines.length; i++) {
		const prev = lines[i - 1];
		const cur = lines[i];
		const tallest = Math.max(prev.height, cur.height);
		const bigGap = Math.abs(prev.y - cur.y) > tallest * 1.45;
		// כותרת = שינוי גודל גופן משמעותי
		const sizeChanged = Math.abs(prev.height - cur.height) > tallest * 0.2;
		const prevWidth = prev.maxX - prev.minX;
		// שורה קצרה מאוד מסיימת פסקה; שורה "בינונית" רק אם היא מסתיימת בסוף משפט
		const endsParagraph =
			prevWidth < widest * 0.6 || (prevWidth < widest * 0.82 && SENTENCE_END.test(prev.text));
		if (bigGap || sizeChanged || endsParagraph) {
			paragraphs.push(para);
			para = cur.text;
		} else {
			para += (para.endsWith('-') ? '' : ' ') + cur.text;
		}
	}
	paragraphs.push(para);
	return paragraphs.join('\n\n');
}

export interface PdfTextResult {
	text: string;
	pages: number;
	/** האם נמצאה שכבת טקסט משמעותית (false = כנראה PDF סרוק) */
	hasText: boolean;
}

/** חילוץ הטקסט מכל עמודי הקובץ. רץ בדפדפן בלבד (דורש Web Worker). */
export async function extractPdfText(file: File): Promise<PdfTextResult> {
	// ה-build ה-"legacy": ה-build הרגיל דורש Promise.try (דפדפנים מ-2024-25 בלבד)
	const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
	const workerUrl = (await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')).default;
	pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

	const data = new Uint8Array(await file.arrayBuffer());
	const task = pdfjs.getDocument({ data });
	const doc = await task.promise;
	try {
		const parts: string[] = [];
		for (let p = 1; p <= doc.numPages; p++) {
			const page = await doc.getPage(p);
			const content = await page.getTextContent();
			const pageText = assemblePageText(content.items as unknown as PdfTextItem[]);
			if (pageText) parts.push(pageText);
		}
		const text = parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
		// עמוד סרוק מחזיר 0-ריק; סף קטן מספיק כדי להבדיל מכמה תווים תועים
		const hasText = text.replace(/\s/g, '').length >= 20 * Math.max(1, Math.min(doc.numPages, 3));
		return { text, pages: doc.numPages, hasText };
	} finally {
		void task.destroy();
	}
}
