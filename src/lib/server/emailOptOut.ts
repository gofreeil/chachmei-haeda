// ============================================================
// emailOptOut.ts — ביטול עותקי מייל לשואלים בלי חשבון
//
// אין לשואלים משתמש, ולכן הסימון נשמר על השאלות עצמן (emailOptOut). askerEmail
// הוא שדה private ואי אפשר לסנן לפיו ב-API, לכן סורקים את כל השאלות בעמודים.
// נפח השאלות קטן, והבדיקה קורית רק כשמפרסמים תשובה.
// ============================================================

import { strapiGet, strapiPut } from './strapiClient';

interface SubRow { documentId: string; askerEmail?: string | null; emailOptOut?: boolean | null }

const norm = (s: string | null | undefined) => (s ?? '').trim().toLowerCase();

async function* allSubmissions(): AsyncGenerator<SubRow> {
    for (let page = 1; page <= 50; page++) {
        const res = await strapiGet<{ data?: SubRow[]; meta?: { pagination?: { pageCount?: number } } }>(
            `/api/ch-question-submissions?pagination[page]=${page}&pagination[pageSize]=100`
        );
        for (const row of res?.data ?? []) yield row;
        if (page >= (res?.meta?.pagination?.pageCount ?? 1)) return;
    }
}

/** האם הכתובת ביטלה עותקי מייל (באחת מהשאלות שלה). שגיאה → false (לא חוסמים מילוליות) */
export async function isEmailOptedOut(email: string | null | undefined): Promise<boolean> {
    const want = norm(email);
    if (!want) return false;
    try {
        for await (const r of allSubmissions()) if (norm(r.askerEmail) === want && r.emailOptOut) return true;
    } catch (e) {
        console.warn('[emailOptOut] check failed:', e instanceof Error ? e.message : e);
    }
    return false;
}

/** מסמן את כל השאלות של הכתובת כ"בלי עותקי מייל". מחזיר כמה שאלות סומנו */
export async function setEmailOptOut(email: string): Promise<number> {
    const want = norm(email);
    if (!want) return 0;
    let n = 0;
    for await (const r of allSubmissions()) {
        if (norm(r.askerEmail) !== want) continue;
        await strapiPut(`/api/ch-question-submissions/${encodeURIComponent(r.documentId)}`, { data: { emailOptOut: true } });
        n++;
    }
    return n;
}
