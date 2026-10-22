// ============================================================
// adGradient.ts — צבע הרצועה/הכפתור של מודעה, מצויר בדיוק כמו ב"קהילה בשכונה"
// ------------------------------------------------------------
// באתר הזה הגרדיאנט נשמר כמחרוזת CSS (linear-gradient(135deg, #hex, #hex)),
// ובקהילה בשכונה כזוג מחלקות Tailwind (from-X to-Y) שמצויר עם
// bg-gradient-to-br ברצועה ו-bg-gradient-to-r בכפתור. שתי הצורות מייצגות
// את אותה פלטה של 22 צבעים, אבל הציור שונה: Tailwind v4 מערבב ב-oklab עם
// צבעי oklch, ו-CSS הקבוע כאן ב-hex של v3 בזווית 135°. כדי שמודעה תיראה
// זהה בשני האתרים, ערך מוכר מהפלטה מצויר דרך אותן מחלקות Tailwind בדיוק;
// רק ערך שאינו בפלטה נופל ל-background inline.
//
// המחלקות כתובות כאן במלואן (ולא מורכבות ממחרוזות) כדי ש-Tailwind ימצא
// אותן בסריקת הקוד ויפיק אותן.
// ============================================================

/** הפלטה של הבילדר: מחרוזת ה-CSS שנשמרת ← זוג המחלקות שקהילה בשכונה שומרת */
export const AD_GRADIENTS: ReadonlyArray<{ id: string; css: string; tw: string }> = [
    { id: 'amber',    css: 'linear-gradient(135deg, #f59e0b, #ea580c)', tw: 'from-amber-500 to-orange-600' },
    { id: 'orange',   css: 'linear-gradient(135deg, #f97316, #ef4444)', tw: 'from-orange-500 to-red-500' },
    { id: 'yellow',   css: 'linear-gradient(135deg, #facc15, #f59e0b)', tw: 'from-yellow-400 to-amber-500' },
    { id: 'red',      css: 'linear-gradient(135deg, #dc2626, #db2777)', tw: 'from-red-600 to-pink-600' },
    { id: 'rose',     css: 'linear-gradient(135deg, #f43f5e, #c026d3)', tw: 'from-rose-500 to-fuchsia-600' },
    { id: 'crimson',  css: 'linear-gradient(135deg, #be123c, #7f1d1d)', tw: 'from-rose-700 to-red-900' },
    { id: 'fuchsia',  css: 'linear-gradient(135deg, #d946ef, #9333ea)', tw: 'from-fuchsia-500 to-purple-600' },
    { id: 'purple',   css: 'linear-gradient(135deg, #9333ea, #db2777)', tw: 'from-purple-600 to-pink-600' },
    { id: 'violet',   css: 'linear-gradient(135deg, #7c3aed, #4338ca)', tw: 'from-violet-600 to-indigo-700' },
    { id: 'indigo',   css: 'linear-gradient(135deg, #4f46e5, #2563eb)', tw: 'from-indigo-600 to-blue-600' },
    { id: 'blue',     css: 'linear-gradient(135deg, #2563eb, #0891b2)', tw: 'from-blue-600 to-cyan-600' },
    { id: 'sky',      css: 'linear-gradient(135deg, #38bdf8, #3b82f6)', tw: 'from-sky-400 to-blue-500' },
    { id: 'teal',     css: 'linear-gradient(135deg, #14b8a6, #0891b2)', tw: 'from-teal-500 to-cyan-600' },
    { id: 'emerald',  css: 'linear-gradient(135deg, #10b981, #0f766e)', tw: 'from-emerald-500 to-teal-700' },
    { id: 'green',    css: 'linear-gradient(135deg, #16a34a, #059669)', tw: 'from-green-600 to-emerald-600' },
    { id: 'lime',     css: 'linear-gradient(135deg, #a3e635, #22c55e)', tw: 'from-lime-400 to-green-500' },
    { id: 'slate',    css: 'linear-gradient(135deg, #64748b, #374151)', tw: 'from-slate-500 to-gray-700' },
    { id: 'dark',     css: 'linear-gradient(135deg, #1f2937, #0f172a)', tw: 'from-gray-800 to-slate-900' },
    { id: 'peach',    css: 'linear-gradient(135deg, #fdba74, #f472b6)', tw: 'from-orange-300 to-pink-400' },
    { id: 'mint',     css: 'linear-gradient(135deg, #6ee7b7, #2dd4bf)', tw: 'from-emerald-300 to-teal-400' },
    { id: 'gold',     css: 'linear-gradient(135deg, #eab308, #b45309)', tw: 'from-yellow-500 to-amber-700' },
    { id: 'midnight', css: 'linear-gradient(135deg, #334155, #1e3a8a)', tw: 'from-slate-700 to-blue-900' },
];

export const DEFAULT_AD_GRADIENT = AD_GRADIENTS[0].css;

/** כיוון הציור: br = הרצועה האלכסונית, r = רצועת/כפתור ה-CTA (כמו בקהילה בשכונה) */
const DIRECTION = { br: 'bg-gradient-to-br', r: 'bg-gradient-to-r' } as const;

const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase();
const BY_CSS = new Map(AD_GRADIENTS.map((g) => [norm(g.css), g.tw]));
const TW_PAIRS = new Set(AD_GRADIENTS.map((g) => g.tw));

/** זוג מחלקות ה-Tailwind של הערך, או '' כשהוא לא מהפלטה */
function twPair(value: string): string {
    const raw = value.trim();
    if (/^(linear|radial|conic)-gradient\(/i.test(raw)) return BY_CSS.get(norm(raw)) ?? '';
    // ערך שהגיע בפורמט של קהילה בשכונה (from-X to-Y)
    const pair = raw.split(/\s+/).filter((c) => /^(from|to)-/.test(c)).join(' ');
    return TW_PAIRS.has(pair) ? pair : '';
}

/**
 * הצבע של רכיב בכרטיס: מחלקות (כשהערך מהפלטה) או style inline (כשלא).
 * ערך ריק מקבל את ברירת המחדל של הבילדר.
 */
export function adGradient(value: string | null | undefined, dir: keyof typeof DIRECTION): { cls: string; style: string } {
    const raw = (value ?? '').trim() || DEFAULT_AD_GRADIENT;
    const pair = twPair(raw);
    if (pair) return { cls: `${DIRECTION[dir]} ${pair}`, style: '' };
    return { cls: '', style: `background: ${raw};` };
}
