// "הבקשה הראשונה" של מי שנשלח להירשם/להתחבר באמצע פעולה.
//
// אורח שלוחץ על פעולה שדורשת חשבון נשלח להתחברות עם יעד חזרה. בסיום ההרשמה/התחברות
// הוא נוחת ביעד עם ?welcome=..., ומסך הפתיחה (WelcomeScreen) מציג:
// "השלמת את ההרשמה! כעת תועבר לבקשתך הראשונה — <תיאור>" ונסגר אל הבקשה עצמה.
// תיאור יש רק ליעדים שהם פעולה; דף הבית, דפי עיון והאזור האישי אינם "בקשה".

/** טפסים שנפתחים בתוך דף לפי ?open= (למשל /heichal-hamishpat?open=request-hearing) */
const OPEN_LABELS: Record<string, string> = {
    'request-hearing': 'בקשת דיון בבית הדין',
};

const ROUTE_LABELS: Array<[RegExp, string]> = [
    [/^\/case\/[^/]+$/, 'אישור התיק בבית הדין'],
    [/^\/about\/advertise\/manage(\/|$)/, 'ניהול המודעות שלך'],
    [/^\/about\/advertise(\/|$)/, 'בניית מודעה'],
    [/^\/admin(\/|$)/, 'ממשק הניהול'],
];

/** תיאור הבקשה לפי נתיב היעד (כולל query), או null כשהיעד אינו בקשה */
export function describeReturn(pathAndSearch: string): string | null {
    let url: URL;
    try { url = new URL(pathAndSearch, 'http://x'); } catch { return null; }
    const open = url.searchParams.get('open');
    if (open && OPEN_LABELS[open]) return OPEN_LABELS[open];
    const path = url.pathname.replace(/\/+$/, '') || '/';
    for (const [re, label] of ROUTE_LABELS) if (re.test(path)) return label;
    return null;
}
