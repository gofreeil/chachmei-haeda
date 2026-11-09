// ============================================================
// legalDocs.ts — המסמכים המשפטיים של "חכמי העדה — בתי הפיוס" (עמוד /about/legal):
// תנאי שימוש, מדיניות פרטיות ו-Cookies, תקנון הבוררות והצהרת נגישות.
//
// הנוסח מותאם לאתר: בית דין לבוררות ושלום על פי תורת ישראל — דיונים מוקלטים
// ומתועדים בפרוטוקול רשום, וחתימה על כתב קבלת פסק הדין לפני כל דיון. הוא נשען
// על מה שקיים באתר בפועל (טופס בקשה לדיון, חדרי איתניום, אזור אישי, Google
// Analytics וכו') — לא להוסיף כאן הצהרות על פיצ'רים או שירותים שאינם קיימים.
//
// עברית היא הנוסח המחייב; אנגלית ורוסית הן תרגומים לנוחות. שפות אחרות נופלות לעברית.
// כל שינוי בנוסח העברי דורש עדכון מקביל בשני התרגומים (המבנה — מספר הסעיפים, הבלוקים
// והסעיפים הרשימתיים — חייב להיות זהה בשלוש השפות).
// ============================================================

export const TAB_IDS = ['terms', 'privacy', 'arbitration', 'accessibility'] as const;
export type TabId = (typeof TAB_IDS)[number];

export const TAB_ICONS: Record<TabId, string> = {
	terms: '📋',
	privacy: '🔒',
	arbitration: '⚖️',
	accessibility: '♿'
};

/** סעיף ברשימה: טקסט רגיל, או כותרת מודגשת + תיאור */
export type LegalItem = string | { b: string; t: string };

export interface LegalBlock {
	/** כותרת משנה (אופציונלית) */
	sub?: string;
	/** פסקאות */
	p?: string[];
	/** רשימת תבליטים */
	li?: LegalItem[];
}

export interface LegalSection {
	title: string;
	blocks: LegalBlock[];
	/** קישור פנימי ללשונית אחרת בסוף הסעיף */
	link?: { label: string; tab: TabId };
	/** כרטיס יצירת קשר (דוא״ל וטלפון) בסוף הסעיף */
	contact?: boolean;
}

export interface LegalTabDoc {
	label: string;
	title: string;
	sections: LegalSection[];
	/** שורה מתחת לכרטיס יצירת הקשר (למשל זמן מענה) */
	replyNote?: string;
}

export interface LegalDoc {
	title: string;
	subtitle: string;
	/** הערה מתחת לכותרת (בתרגומים: העברית היא הנוסח המחייב) */
	note?: string;
	/** date: תאריך העדכון האחרון של המסמכים, מנוסח לפי השפה (מוצג בראש כל לשונית) */
	ui: { toc: string; updated: string; date: string; backHome: string; backTop: string };
	tabs: Record<TabId, LegalTabDoc>;
}

// ============================================================
// עברית — הנוסח המחייב
// ============================================================
const he: LegalDoc = {
	title: `מסמכים משפטיים`,
	subtitle: `תנאי שימוש, מדיניות פרטיות ו‑Cookies, תקנון הבוררות והצהרת נגישות`,
	ui: {
		toc: `תוכן עניינים`,
		updated: `תאריך עדכון אחרון:`,
		date: `9/11/2026`,
		backHome: `← חזרה לדף הבית`,
		backTop: `↑ עלה לראש הדף`
	},
	tabs: {
		// ---------------------------------------------------- תנאי שימוש
		terms: {
			label: `תנאי שימוש`,
			title: `תנאי שימוש`,
			sections: [
				{
					title: `פתיח והסכמה לתנאים`,
					blocks: [
						{
							p: [
								`אתר "חכמי העדה — בתי הפיוס" ("האתר") הוא בית דין לבוררות ושלום על פי תורת ישראל, המופעל בהתנדבות על ידי דיינים ומורי הוראה, במסגרת רשת האתרים של התנועה החברתית "יוצאים לחירות". באתר ניתן להגיש בקשה לדיון, לעיין בפסקי דין, במאמרים ובשיעורים, לשלוח שאלה בהלכה ולחתום על הקוד האתי העולמי (UECC).`,
								`השימוש באתר כפוף לתנאי שימוש אלה, למדיניות הפרטיות ולתקנון הבוררות. גלישה באתר, יצירת חשבון, מסירת פרטים, הגשת בקשה לדיון וחתימה על מסמך כלשהו באתר מהווים הסכמה לתנאים אלה. מי שאינו מסכים להם מתבקש שלא להשתמש באתר.`,
								`הגלישה באתר ועיון בתכניו פתוחים לכל אדם. שירותי בית הדין — הגשת בקשה לדיון, חתימה על כתב קבלת פסק הדין והשתתפות בדיון — מיועדים לבגירים בני 18 ומעלה בלבד.`
							]
						}
					]
				},
				{
					title: `מהות האתר והשירותים`,
					blocks: [
						{
							sub: `בית הדין`,
							p: [
								`האתר מאפשר לצדדים בסכסוך להביא את עניינם לבוררות ולפיוס בפני דיינים ומורי הוראה מתנדבים, בהסכמת כל הצדדים. בית הדין אינו בית משפט של המדינה, אינו גובה אגרות ואינו מחייב ייצוג בעורך דין. פרטי ההליך מפורטים בלשונית "תקנון הבוררות".`
							]
						},
						{
							sub: `תכנים והלכה`,
							p: [
								`האתר מפרסם פסקי דין, מאמרים, שיעורים, המלצות לשלום בית ושאלות ותשובות בהלכה. תשובה לשאלה שנשלחה דרך "שאל את חכמי העדה" היא הכוונה כללית על סמך הפרטים שנמסרו בלבד; היא אינה פסק דין, אינה מחייבת, ואינה תחליף לדיון בבית הדין או להתייעצות פרטנית עם מורה הוראה. שאלה ותשובה עשויות להתפרסם בארכיון השאלות והתשובות, בדרך כלל ללא פרטים מזהים.`
							]
						},
						{
							sub: `שירותים בתשלום`,
							p: [
								`הדיון בבית הדין, שליחת שאלה, עיון בתכנים וחתימה על הקוד האתי ניתנים ללא תשלום. פרסום מסחרי באתר (דף "פרסם אצלנו") הוא שירות בתשלום, ועולה לאוויר רק לאחר אישור מנהל האתר.`
							]
						}
					]
				},
				{
					title: `הרשמה וחשבון משתמש`,
					blocks: [
						{
							sub: `יצירת חשבון`,
							p: [
								`חלק מהשירותים — כגון הגשת בקשה לדיון, מעקב אחר תיקים וחתימה על הקוד האתי — מחייבים חשבון משתמש. יש למסור פרטים נכונים, מלאים ועדכניים, ובהם שם מלא, מספר טלפון וכתובת דוא״ל. ניתן להתחבר גם באמצעות חשבון Google או חשבון קיים ברשת האתרים.`
							]
						},
						{
							sub: `אבטחת החשבון`,
							p: [
								`המשתמש אחראי לשמירת סודיות פרטי הגישה לחשבונו. כל פעולה שנעשתה בחשבון — לרבות חתימה על כתב קבלת פסק הדין — תיחשב כפעולה של בעל החשבון. יש לדווח מיד על שימוש לא מורשה.`
							]
						},
						{
							sub: `השעיה וסגירה`,
							p: [
								`מפעילי האתר רשאים להשעות או לסגור חשבון בשל הפרת התנאים, מסירת פרטים כוזבים, שימוש לרעה בשירותים או לפי בקשת המשתמש. סגירת חשבון אינה מבטלת כתב קבלה שנחתם, ואינה מביאה למחיקת תיעוד של הליך שהתנהל בבית הדין.`
							]
						}
					]
				},
				{
					title: `בוררות, חתימה והקלטה`,
					blocks: [
						{
							p: [
								`הגשת בקשה לדיון, חתימה על כתב קבלת פסק הדין והשתתפות בדיון כפופות לתקנון הבוררות, המהווה חלק בלתי נפרד מתנאי השימוש. להלן עיקרי הדברים:`
							],
							li: [
								`לפני כל דיון חותם כל צד על כתב קבלת פסק הדין, ובלעדיו לא יתקיים דיון.`,
								`כל דיון מוקלט ומתועד בפרוטוקול רשום; ההקלטה והפרוטוקול הם התיעוד הרשמי של ההליך.`,
								`אסור לצלם, להקליט, לשדר או לפרסם דיון, הקלטה או פרוטוקול ללא היתר בכתב מבית הדין.`
							]
						}
					],
					link: { label: `← לקריאת תקנון הבוררות המלא`, tab: 'arbitration' }
				},
				{
					title: `שימוש מותר ואסור`,
					blocks: [
						{
							sub: `שימוש מותר`,
							p: [
								`עיון בתכני האתר, הגשת בקשה לדיון, שליחת שאלות בהלכה, חתימה על הקוד האתי, פרסום בהתאם לכללי דף "פרסם אצלנו", ושיתוף קישורים לתכני האתר וציטוט קצר מהם תוך ציון המקור.`
							]
						},
						{
							sub: `שימוש אסור`,
							p: [`המשתמש מתחייב שלא לבצע באתר את הפעולות הבאות:`],
							li: [
								`הפרת חוקי מדינת ישראל, הונאה, התחזות או מסירת מידע כוזב;`,
								`הגשת בקשה לדיון מתוך כוונה להטריד, לפגוע בשמו של אדם או להפעיל עליו לחץ;`,
								`פגיעה בפרטיות, לשון הרע, הסתה או תוכן פוגעני, גזעני או אלים;`,
								`העברת קישורי הצטרפות לדיון, או פרטי תיק, למי שאינו צד להליך או מורשה על ידי בית הדין;`,
								`צילום, הקלטה, שידור או פרסום של דיון, של הקלטה או של פרוטוקול, ללא היתר בכתב מבית הדין;`,
								`פרסום מסחרי ללא אישור, שליחת ספאם, שימוש ברובוטים או בכלים אוטומטיים לסריקת האתר, חדירה למערכותיו או שיבוש פעילותו.`
							]
						},
						{
							sub: `סנקציות`,
							p: [
								`מפעילי האתר רשאים לחסום משתמש, להסיר תוכן, להגביל גישה לשירותים, למסור מידע לרשויות במקרה של חשד לעבירה ולנקוט צעדים משפטיים. בית הדין רשאי להרחיק מדיון משתתף המפר את סדריו.`
							]
						}
					]
				},
				{
					title: `פרטיות ומידע אישי`,
					blocks: [
						{
							p: [
								`איסוף המידע, השימוש בו ושיתופו מפורטים במדיניות הפרטיות, המהווה חלק מתנאי השימוש. מידע הקשור לתיק בבית הדין, ובכלל זה הקלטות ופרוטוקולים, מטופל כמפורט בפרקים "הקלטת דיונים ופרוטוקולים" ו"שיתוף מידע עם אחרים" במדיניות הפרטיות ובתקנון הבוררות.`
							]
						}
					],
					link: { label: `← לקריאת מדיניות הפרטיות`, tab: 'privacy' }
				},
				{
					title: `קניין רוחני`,
					blocks: [
						{
							sub: `תכני האתר`,
							p: [
								`זכויות היוצרים בתכני האתר — עיצוב, טקסטים, תמונות, קוד, פסקי דין, מאמרים, שיעורים והקלטות — שייכות למפעילי האתר או למחבריהם, אלא אם צוין אחרת. אין להעתיק, לשכפל, לעבד או לפרסם אותם, כולם או חלקם, ללא אישור בכתב, מלבד שיתוף קישור, ציטוט קצר תוך ציון המקור ושימוש אישי לצורכי לימוד.`
							]
						},
						{
							sub: `פסק דין ומסמכי התיק`,
							p: [
								`אין באמור כדי להגביל את זכות הצדדים להשתמש בפסק הדין ובמסמכי התיק שנמסרו להם לצורך מימוש הפסק, אישורו ואכיפתו.`
							]
						},
						{
							sub: `תוכן שמוסר המשתמש`,
							p: [
								`מי שמוסר לאתר תוכן — כגון תיאור טענות בבקשה לדיון, שאלה בהלכה, חומרים לפרסום או מודעה — מצהיר שיש לו הזכות למסור אותו, ומאשר למפעילי האתר ולדיינים להשתמש בו לצורך מתן השירות שלשמו נמסר, לרבות הצגתו לדיינים ולצד שכנגד.`
							]
						},
						{
							sub: `הפרת זכויות יוצרים`,
							p: [
								`מי שסבור שתוכן באתר מפר זכויות יוצרים מוזמן לפנות למפעילי האתר, והם רשאים להסיר את התוכן לפי שיקול דעתם.`
							]
						}
					]
				},
				{
					title: `הגבלת אחריות`,
					blocks: [
						{
							sub: `אופי השירות`,
							p: [
								`האתר ניתן בהתנדבות וללא התחייבות לתוצאה. הדיינים ומפעילי האתר אינם אחראים להחלטות הצדדים, לתוצאות הדיון או להסתמכות על תכני האתר, ככל שהדין מאפשר להגביל אחריות.`
							]
						},
						{
							sub: `תכנים הלכתיים וכלליים`,
							p: [
								`התכנים באתר נועדו ללימוד ולמידע כללי, ואינם מהווים ייעוץ משפטי, רפואי, פיננסי או אחר. אין להסתמך עליהם כהוראה פרטנית ללא התייעצות עם מורה הוראה.`
							]
						},
						{
							sub: `זמינות ותקלות`,
							p: [
								`האתר, חדרי הדיונים והווידאו ניתנים כפי שהם. ייתכנו תקלות, עבודות תחזוקה והפסקות שירות, לרבות תקלה בשירותי צד שלישי (כגון שירות הווידאו), ובמקרה כזה ייתכן שיידרש לקבוע מועד חדש לדיון.`
							]
						},
						{
							sub: `אבטחה`,
							p: [
								`האתר נוקט אמצעי אבטחה סבירים, אך אינו יכול להבטיח הגנה מוחלטת מפני פריצות, דליפת מידע, תקיפות סייבר וכשלים טכנולוגיים.`
							]
						}
					]
				},
				{
					title: `מחיקת חשבון וזכויות המשתמש`,
					blocks: [
						{
							sub: `מחיקת חשבון`,
							p: [`ניתן לבקש מחיקת חשבון בכל עת בפנייה בדוא״ל. האתר יפעל בתוך זמן סביר ובהתאם לדין.`]
						},
						{
							sub: `תיעוד הליכים`,
							p: [
								`מחיקת חשבון אינה מביאה למחיקת תיעוד של הליך שהתנהל בבית הדין — כתב קבלת פסק הדין, פרוטוקולים, הקלטות ופסקי דין — שנשמר כדי להבטיח את שלמות ההליך ואת מימוש הפסק ואישורו, במידה שהדבר נדרש לפי דין, או לצורך הגנה בהליך משפטי.`
							]
						},
						{
							sub: `זכויות לפי חוק הגנת הפרטיות`,
							p: [
								`בהתאם לחוק הגנת הפרטיות, התשמ״א–1981, המשתמש זכאי לעיין במידע שנשמר עליו ולבקש את תיקונו או מחיקתו, בכפוף למגבלות המפורטות לעיל.`
							]
						}
					]
				},
				{
					title: `שינויים בתנאי השימוש`,
					blocks: [
						{
							p: [
								`מפעילי האתר רשאים לעדכן את תנאי השימוש בכל עת. שינויים מהותיים יפורסמו באתר, ותאריך העדכון יתעדכן בהתאם. המשך השימוש באתר לאחר הפרסום מהווה הסכמה לתנאים המעודכנים. שינוי בתקנון הבוררות חל על הליכים שנפתחו לאחר פרסומו, כמפורט בו.`
							]
						}
					]
				},
				{
					title: `הדין החל וסמכות שיפוט`,
					blocks: [
						{
							p: [
								`על תנאי שימוש אלה יחולו דיני מדינת ישראל. סכסוך הנוגע לשימוש באתר יידון בבתי המשפט המוסמכים במחוז ירושלים. סכסוך בין צדדים שהובא לבית הדין ונחתם בו כתב קבלה יוכרע בבית הדין, כמפורט בתקנון הבוררות.`
							]
						}
					]
				},
				{
					title: `יצירת קשר`,
					blocks: [{ p: [`לכל שאלה, פנייה, בקשה או דיווח ניתן לפנות למפעילי האתר:`] }],
					contact: true
				}
			]
		},

		// ---------------------------------------------------- מדיניות פרטיות
		privacy: {
			label: `מדיניות פרטיות ו‑Cookies`,
			title: `מדיניות פרטיות ו‑Cookies`,
			sections: [
				{
					title: `פתיח`,
					blocks: [
						{
							p: [
								`מדיניות זו מסבירה כיצד אתר "חכמי העדה — בתי הפיוס" אוסף, משתמש, שומר ומגן על מידע אישי, ובכלל זה מידע הנוגע להליכים בבית הדין, וכיצד האתר עושה שימוש בקבצי Cookies ובטכנולוגיות דומות. האתר פועל בהתאם לחוק הגנת הפרטיות, התשמ״א–1981 ותקנותיו.`,
								`מידע הקשור להליכי בוררות עשוי להיות רגיש — סכסוכים אישיים, משפחתיים וכספיים. מפעילי האתר והדיינים מחויבים לשמור עליו ולהשתמש בו רק למטרות המפורטות להלן. השימוש באתר מהווה הסכמה למדיניות זו ולתנאי השימוש.`
							]
						}
					]
				},
				{
					title: `מידע שאנו אוספים`,
					blocks: [
						{
							sub: `מידע שמוסר המשתמש`,
							li: [
								`פרטי חשבון: שם מלא, מספר טלפון וכתובת דוא״ל; בהתחברות באמצעות Google או חשבון ברשת האתרים — גם השם, הדוא״ל ותמונת הפרופיל שהספק מוסר.`,
								`פרטי תיק: שמות התובע והנתבע, מספרי טלפון, נושא התיק, פירוט הטענות, מועדי הדיון ומסמכים וחומרים שנמסרים לתיק.`,
								`חתימות והסכמות: חתימה על הקוד האתי UECC ועל כתב קבלת פסק הדין, ומועד החתימה.`,
								`שאלות בהלכה: שם, דוא״ל, טלפון, נושא ותוכן השאלה שנשלחה דרך "שאל את חכמי העדה".`,
								`מפרסמים: פרטי עסק ופרטי קשר לצורך פרסום מודעה באתר.`
							]
						},
						{
							sub: `מידע הנוצר בדיון`,
							p: [`קול ותמונה של המשתתפים בדיון המוקלט, הפרוטוקול הרשום, החלטות בית הדין ופסק הדין.`]
						},
						{
							sub: `מידע הנאסף אוטומטית`,
							p: [
								`כתובת IP, סוג דפדפן ומערכת הפעלה, עמודים שנצפו ונתוני שימוש, וכן מידע שנשמר ב-Cookies ובאחסון המקומי של הדפדפן.`
							]
						},
						{
							sub: `מידע מצדדים שלישיים`,
							p: [`מידע שמוסרים שירותי ההתחברות (Google ורשת האתרים) ושירות האנליטיקה.`]
						}
					]
				},
				{
					title: `הקלטת דיונים ופרוטוקולים`,
					blocks: [
						{
							p: [
								`כל דיון בבית הדין מוקלט (קול ותמונה, ככל שהדיון מתקיים בווידאו) ומתועד בפרוטוקול רשום. ההקלטה והפרוטוקול הם התיעוד הרשמי של ההליך.`
							]
						},
						{
							sub: `הסכמה להקלטה`,
							p: [
								`הצדדים והמשתתפים מסכימים להקלטה ולרישום בחתימתם על כתב קבלת פסק הדין ובהצטרפותם לדיון. מי שאינו מסכים להקלטה לא ישתתף בדיון. משתתף נוסף (כגון עד) יקבל על כך הודעה לפני שיצטרף.`
							]
						},
						{
							sub: `מטרות`,
							p: [
								`תיעוד מדויק של הטענות וההסכמות, עריכת פסק הדין, בירור טענות באשר לאופן ניהול ההליך, אישור הפסק ואכיפתו בבית משפט, והגנה בהליכים משפטיים.`
							]
						},
						{
							sub: `גישה`,
							p: [
								`הקלטות ופרוטוקולים נגישים לדיינים, לצדדים בתיק (באזור האישי באתר, לאחר סיום הדיון) ולמורשים מטעם בית הדין בלבד. הם לא יימסרו לאחר אלא בהסכמת הצדדים, לפי צו של בית משפט או כנדרש בדין.`
							]
						},
						{
							sub: `שמירה`,
							p: [
								`הקלטות ופרוטוקולים יישמרו לתקופה הנדרשת למטרות שלעיל ולפי הדין. בקשת מחיקה לא תתקבל במידה שהמחיקה פוגעת בשלמות ההליך, במימוש הפסק או באפשרות להגן בהליך משפטי.`
							]
						},
						{
							sub: `איסור הקלטה פרטית`,
							p: [
								`אסור לצד או למשתתף להקליט, לצלם, לשדר או לפרסם דיון, הקלטה או פרוטוקול ללא היתר בכתב מבית הדין.`
							]
						}
					]
				},
				{
					title: `מטרות השימוש במידע`,
					blocks: [
						{
							li: [
								`ניהול ההליך: קבלת בקשות, זימון הצדדים, קביעת מועדים, ניהול הדיון, תיעודו ומתן פסק דין.`,
								`תפעול ושיפור האתר, אבטחת מידע ומניעת הונאות ושימוש לרעה.`,
								`יצירת קשר: הודעות מערכת, תזכורות ומענה לפניות ולשאלות, לרבות בהודעת דוא״ל או SMS.`,
								`פרסום, בהתאם לפרק "פרסום פסקי דין ותכנים".`,
								`סטטיסטיקה: ניתוח שימוש כללי באתר ושיפור חוויית המשתמש.`,
								`עמידה בדרישות הדין ומענה לדרישות רשויות מוסמכות.`
							]
						}
					]
				},
				{
					title: `פרסום פסקי דין ותכנים`,
					blocks: [
						{
							p: [
								`פסקי דין מתפרסמים בארכיון האתר בשקיפות. בית הדין רשאי להשמיט או לטשטש פרטים מזהים — כולל שמות הצדדים — כשנדרש להגנה על פרטיות, שלום בית או מניעת נזק. בחתימה על כתב קבלת פסק הדין מסכימים הצדדים לפרסום פסק הדין כאמור.`,
								`שאלה ותשובה בהלכה עשויות להתפרסם בארכיון השאלות והתשובות, בדרך כלל ללא פרטים מזהים. פרטי הקשר של השואל משמשים למענה בלבד.`,
								`החותמים על הקוד האתי העולמי מופיעים באינדקס הציבורי של האמנה, בהתאם לפרטים שנמסרו לצורך זה.`
							]
						}
					]
				},
				{
					title: `שיתוף מידע עם אחרים`,
					blocks: [
						{
							p: [`האתר אינו מוכר מידע אישי. מידע עשוי להיות משותף עם:`],
							li: [
								`הדיינים והצד שכנגד, ככל הנדרש לניהול ההליך (כולל פרטי הקשר וטענות הצדדים);`,
								`ספקי תשתית ושירות: אחסון, מסד הנתונים של רשת האתרים, שירות הווידאו לחדרי הדיונים (Eitanium), שליחת דוא״ל והודעות SMS, ואנליטיקה (Google Analytics);`,
								`כלי עזר אוטומטיים, לרבות בינה מלאכותית, המשמשים את צוות האתר לעיבוד מסמכים שבית הדין מפרסם (כגון חילוץ כותרת ותקציר);`,
								`בתי משפט ורשויות מוסמכות — כנדרש בדין, וכן לצורך אישור פסק בורר ואכיפתו.`
							]
						}
					]
				},
				{
					title: `Cookies ואחסון מקומי`,
					blocks: [
						{
							sub: `מה זה`,
							p: [
								`Cookies ואחסון מקומי הם קבצים וערכים קטנים הנשמרים בדפדפן ומאפשרים זיהוי משתמש, שמירת העדפות ושיפור ביצועים.`
							]
						},
						{
							sub: `שימושים באתר`,
							li: [
								`חיוניים ופונקציונליים — התחברות, שפת התצוגה, שמירת טיוטת בקשה לדיון והעדפות;`,
								`אנליטיים — Google Analytics, נכס משותף לאתרי הרשת (ההפרדה בין האתרים נעשית לפי שם הדומיין);`,
								`צד שלישי — Google (התחברות) ו-YouTube (בעת צפייה בסרטון מוטמע).`
							]
						},
						{
							sub: `ניהול`,
							p: [
								`ניתן למחוק או לחסום Cookies דרך הגדרות הדפדפן. חסימה עלולה לפגוע בתפקוד האתר, כגון התחברות ושמירת טיוטות.`
							]
						}
					]
				},
				{
					title: `אבטחת מידע ושמירה`,
					blocks: [
						{
							p: [
								`האתר נוקט אמצעי אבטחה סבירים ומקובלים, לרבות הצפנת התקשורת ובקרות גישה. קישורי ההצטרפות לחדרי הדיונים נשמרים מוצפנים ונמסרים רק לצדדים בתיק ולבית הדין. אין אפשרות להבטיח אבטחה מוחלטת. במקרה של דליפת מידע האתר יפעל לצמצום הנזק, יעדכן את הנפגעים ויפעל בהתאם לדין.`,
								`מידע יישמר לצורך תפעול האתר, ניהול ההליכים, עמידה בדרישות הדין והגנה משפטית.`
							]
						}
					]
				},
				{
					title: `העברת מידע לחו״ל`,
					blocks: [
						{
							p: [
								`חלק מספקי השירות (למשל Google וספקי אחסון) עשויים לאחסן מידע בשרתים מחוץ לישראל. העברת מידע כזו נעשית בכפוף להגנות מקובלות ולדרישות הדין.`
							]
						}
					]
				},
				{
					title: `זכויות המשתמש`,
					blocks: [
						{
							p: [
								`לפי חוק הגנת הפרטיות זכאי כל אדם לעיין במידע שנשמר עליו, לבקש לתקנו, ולבקש את מחיקתו או הגבלת השימוש בו, וכן לבטל הסכמה לדיוור. מחיקה כפופה לאמור בפרק "הקלטת דיונים ופרוטוקולים" לעניין תיעוד של הליכים. למימוש הזכויות יש לפנות בדוא״ל.`
							]
						}
					]
				},
				{
					title: `קטינים`,
					blocks: [
						{
							p: [
								`האתר ושירותי בית הדין אינם מיועדים לקטינים, ואיננו אוספים ביודעין מידע על קטינים. אם נמסר מידע כזה — הורה רשאי לבקש את מחיקתו.`
							]
						}
					]
				},
				{
					title: `שינויים במדיניות`,
					blocks: [
						{
							p: [
								`מפעילי האתר רשאים לעדכן מדיניות זו. שינויים מהותיים יפורסמו באתר. המשך השימוש באתר מהווה הסכמה למדיניות המעודכנת.`
							]
						}
					]
				},
				{
					title: `יצירת קשר`,
					blocks: [{ p: [`לכל שאלה או בקשה בנוגע למדיניות:`] }],
					contact: true
				}
			]
		},

		// ---------------------------------------------------- תקנון הבוררות
		arbitration: {
			label: `תקנון הבוררות`,
			title: `תקנון הבוררות — חכמי העדה`,
			sections: [
				{
					title: `כללי ותחולה`,
					blocks: [
						{
							p: [
								`תקנון זה קובע את כללי ההליך בבית הדין "חכמי העדה — בתי הפיוס" ("בית הדין"). הוא חל על כל מי שמגיש בקשה לדיון, מוזמן להצטרף להליך או משתתף בדיון, והוא חלק בלתי נפרד מתנאי השימוש. חתימה על כתב קבלת פסק הדין מהווה קבלה של תקנון זה.`
							]
						}
					]
				},
				{
					title: `עקרונות ההליך`,
					blocks: [
						{
							li: [
								`ההליך מתנהל בהסכמת כל הצדדים בלבד.`,
								`בית הדין פועל על פי דין תורה, ומתוך מגמה להביא את הצדדים לפיוס ולשלום.`,
								`הדיינים מתנדבים, והדיון ללא אגרות ועלויות משפט.`,
								`ההליך אינו מחייב ייצוג בעורך דין.`
							]
						}
					]
				},
				{
					title: `פתיחת תיק`,
					blocks: [
						{
							p: [
								`תיק נפתח בהגשת בקשה לדיון באתר, הכוללת את פרטי התובע והנתבע, נושא התיק, פירוט הטענות ומועד מוצע. הצד שכנגד מוזמן להצטרף להליך, להתחבר לאתר ולחתום על הקוד האתי ועל כתב קבלת פסק הדין לפני שיוכל לאשר את מועד הדיון.`,
								`הדיון ייקבע לאחר אישור בית הדין. בית הדין רשאי לסרב לדון בתיק, לרבות מחמת העדר סמכות או חוסר התאמה.`
							]
						}
					]
				},
				{
					title: `כתב קבלת פסק הדין — חתימה לפני הדיון`,
					blocks: [
						{
							p: [`לפני כל דיון חותם כל צד באתר על כתב קבלת פסק הדין ("כתב הקבלה"). בכתב הקבלה הצד:`],
							li: [
								`מסכים שהמחלוקת תוכרע בבית הדין על פי דין תורה, ומקבל על עצמו לציית לפסק הדין;`,
								`מקבל על עצמו את הקוד האתי UECC ואת שבע מצוות בני נח כתנאי לעריכת הדיון;`,
								`מקבל את תקנון הבוררות, לרבות ההקלטה והפרוטוקול הרשום של הדיון.`
							]
						},
						{
							p: [
								`כתב הקבלה נחתם בחשבון המשתמש של כל צד, ונרשמים בו שם החותם ומועד החתימה. דיון לא יתקיים בלי חתימת כל הצדדים, ובית הדין רשאי לבטל מועד דיון שלא נחתם לגביו כתב קבלה.`,
								`החתימה על הקוד האתי ועל סמכות בית הדין תקפה גם לדיונים עתידיים של החותם בבית הדין. החתימה אינה הודאה בטענות הצד שכנגד ואינה פוגעת בזכות לטעון כל טענה בדיון.`
							]
						}
					]
				},
				{
					title: `מהלך הדיון`,
					blocks: [
						{
							li: [
								`הדיון מתקיים בווידאו, בחדר דיונים מאובטח באתר, או פנים אל פנים, לפי החלטת בית הדין.`,
								`קישורי ההצטרפות לחדר אישיים: הם נמסרים רק לצדדים בתיק ולבית הדין, ואין להעבירם לאחר.`,
								`הצדדים מתייצבים בעצמם במועד שנקבע. הבאת עד, מייצג או משתתף נוסף מותרת באישור מראש של בית הדין.`,
								`המשתתפים ינהגו בכבוד הדדי. בית הדין רשאי להפסיק או לדחות דיון ולהרחיק משתתף המפר את סדריו.`
							]
						}
					]
				},
				{
					title: `הקלטה ופרוטוקול רשום`,
					blocks: [
						{
							li: [
								`כל דיון מוקלט ומתועד בפרוטוקול רשום. הצדדים והמשתתפים מסכימים לכך בחתימתם על כתב הקבלה ובהצטרפותם לדיון; מי שאינו מסכים להקלטה לא ישתתף בדיון.`,
								`ההקלטה והפרוטוקול הרשום הם התיעוד הרשמי של ההליך.`,
								`לאחר הדיון מועמדים ההקלטה והפרוטוקול לעיון הצדדים באזור האישי באתר.`,
								`צד המעיר על דיוק הפרוטוקול רשאי לפנות לבית הדין בכתב תוך זמן סביר מקבלתו. בית הדין יבחן את ההערה, וייתכן שיתקן את הפרוטוקול או יצרף אליו את ההערה.`,
								`אסור לצלם, להקליט, לשדר או לפרסם דיון, הקלטה או פרוטוקול ללא היתר בכתב מבית הדין. הפרה עלולה להביא להרחקה מהדיון ולצעדים נוספים.`,
								`בית הדין והצדדים רשאים להגיש את ההקלטה והפרוטוקול לבית משפט לצורך אישור פסק הדין, אכיפתו או הליך אחר הקשור בו.`
							]
						}
					],
					link: { label: `← פרטים על שמירת ההקלטות והגישה אליהן — במדיניות הפרטיות`, tab: 'privacy' }
				},
				{
					title: `סודיות`,
					blocks: [
						{
							p: [
								`השתתפות בדיון מותרת רק למי שהוזמן או אושר על ידי בית הדין. המשתתפים מתחייבים לשמור בסוד את שנאמר בדיון ואת מסמכי התיק, ואין לגלותם לאחר אלא לצורך מימוש פסק הדין, אישורו ואכיפתו, לשם ייעוץ מקצועי, באישור בית הדין או כנדרש בדין. בית הדין והצוות מחויבים בסודיות כלפי תכני הדיון והתיק, בכפוף לפרסום פסק הדין כמפורט להלן.`
							]
						}
					]
				},
				{
					title: `פסק הדין`,
					blocks: [
						{
							p: [
								`בית הדין נותן פסק דין בכתב וחתום, ומוסר אותו לצדדים באזור האישי. הצדדים מחויבים לפסק הדין לפי כתב הקבלה. ניתן לבקש מבית משפט לאשר את פסק הדין כפסק בורר, בהתאם לחוק הבוררות, התשכ״ח–1968, ולאכוף אותו.`,
								`פסקי הדין מתפרסמים בארכיון האתר בשקיפות. בית הדין רשאי להשמיט או לטשטש פרטים מזהים של הצדדים, ובחתימה על כתב הקבלה מסכימים הצדדים לפרסום פסק הדין כאמור.`,
								`צוות משכין שלום עשוי ללוות את הצדדים ביישום ההכרעה ובחזרת האחווה.`
							]
						}
					]
				},
				{
					title: `עלויות`,
					blocks: [
						{
							p: [
								`בית הדין אינו גובה אגרות ועלויות משפט, והדיינים מתנדבים. הוצאות שהצדדים מוציאים בעצמם, כגון ייצוג או חוות דעת, הן על חשבונם, אלא אם הסכימו או קבע בית הדין אחרת.`
							]
						}
					]
				},
				{
					title: `אחריות`,
					blocks: [
						{
							p: [
								`בית הדין פועל בהתנדבות ואינו מתחייב לזמני טיפול או לתוצאה. אחריות בית הדין, הדיינים והמפעילים מוגבלת במידה שהדין מאפשר, כמפורט בתנאי השימוש.`
							]
						}
					]
				},
				{
					title: `שינויים בתקנון`,
					blocks: [
						{
							p: [
								`מפעילי האתר רשאים לעדכן את התקנון. שינוי יחול על בקשות לדיון שהוגשו לאחר פרסומו, ולא על הליך שנפתח לפניו אלא בהסכמת הצדדים.`
							]
						}
					]
				},
				{
					title: `יצירת קשר`,
					blocks: [{ p: [`לכל שאלה או בקשה בנוגע לתקנון ולהליך:`] }],
					contact: true
				}
			]
		},

		// ---------------------------------------------------- הצהרת נגישות
		accessibility: {
			label: `הצהרת נגישות`,
			title: `הצהרת נגישות`,
			replyNote: `נשתדל להשיב תוך 5 ימי עסקים.`,
			sections: [
				{
					title: `מטרה והתחייבות`,
					blocks: [
						{
							p: [
								`אתר "חכמי העדה — בתי הפיוס" מחויב להנגשת האתר והשירותים שבו — ובכלל זה הגשת בקשה לדיון וההשתתפות בדיון — לכלל המשתמשים, לרבות אנשים עם מוגבלויות. האתר שואף לעמוד בדרישות תקן ישראלי 5568 (WCAG 2.1 ברמה AA) ומיישם התאמות לאנשים עם לקויות ראייה, שמיעה, קוגניציה ומוטוריקה.`
							]
						}
					]
				},
				{
					title: `היקף`,
					blocks: [
						{
							p: [
								`ההצהרה חלה על דפי האתר, הטפסים, האזור האישי והמסמכים הדיגיטליים שמפרסם האתר. חדרי הדיונים בווידאו מסופקים על ידי צד שלישי (Eitanium), ונגישותם תלויה בו — ראו "מגבלות ידועות" להלן.`
							]
						}
					]
				},
				{
					title: `עקרונות הנגשה`,
					blocks: [
						{
							li: [
								{ b: `נגישות תוכן`, t: `טקסטים, תמונות, וידאו וקבצים יונגשו בהתאם להנחיות נגישות מקובלות.` },
								{ b: `נגישות ניווט`, t: `תפריטים וקישורים יהיו ברורים, עקביים ונגישים באמצעות מקלדת.` },
								{ b: `נגישות חזותית`, t: `צבעים וניגודיות ייבחרו כך שיתאימו לקריאה; טקסטים חשובים יהיו ניתנים להגדלה.` },
								{ b: `נגישות שמיעתית`, t: `בתכני וידאו נשאף לספק כתוביות או תמלול, ובדיונים — התאמות לפי בקשה (ראו "התאמות פרטניות").` },
								{ b: `נגישות טכנית`, t: `האתר שואף לעמוד בסטנדרטים טכניים מקובלים (WCAG) במידת האפשר.` }
							]
						}
					]
				},
				{
					title: `התאמות שבוצעו`,
					blocks: [
						{
							li: [
								`שפת הדף (lang) וכיוון הטקסט (dir) מתעדכנים לפי שפת התצוגה, לתמיכה בקוראי מסך`,
								`קישור "דלג לתוכן הראשי" מופיע עם פוקוס מקלדת לניווט מהיר`,
								`כפתורים, קישורים ותפריטים כוללים תיאורי aria-label`,
								`הודעות דינמיות (כגון שגיאות והצלחות) מוכרזות לקוראי מסך באמצעות aria-live`,
								`תפריטים נפתחים כוללים aria-expanded ו-aria-haspopup לציון מצב הפתיחה`,
								`אנימציות מצומצמות כשהמשתמש מגדיר העדפת תנועה מופחתת (prefers-reduced-motion)`,
								`תמונות דקורטיביות מסומנות alt="" ותמונות תוכן כוללות תיאור`,
								`טיקר החדשות הנע מוסתר מקוראי מסך`,
								`שדות בטפסים כוללים תוויות (label) מקושרות`
							]
						}
					]
				},
				{
					title: `מגבלות ידועות`,
					blocks: [
						{
							li: [
								`חדרי הדיונים בווידאו (Eitanium) הם שירות צד שלישי, וייתכן שחלק מפונקציותיהם אינן נגישות במלואן לקוראי מסך ולמשתמשי מקלדת. אדם הזקוק להתאמה בדיון — למשל דיון פנים אל פנים, תמלול או ערוץ אחר — מוזמן לפנות לבית הדין מראש.`,
								`מסמכי PDF של פסקי דין ומאמרים עשויים שלא להיות נגישים במלואם לקוראי מסך.`,
								`ייתכנו תכנים או שירותים שאינם ניתנים להנגשה מלאה מטעמי טכנולוגיה או צד שלישי; האתר יפעל לציין מגבלות אלה ולחפש חלופות.`
							]
						}
					]
				},
				{
					title: `התאמות פרטניות`,
					blocks: [
						{
							p: [
								`משתמשים הזקוקים להתאמות מיוחדות — באתר או בדיון — מוזמנים לפנות לצוות האתר. האתר ישקול בקשות סבירות ויפעל לספק פתרון בהתאם ליכולת הטכנית והמשאבים.`
							]
						}
					]
				},
				{
					title: `יצירת קשר ודיווח על בעיות נגישות`,
					blocks: [{ p: [`לכל בעיה או בקשה בנוגע לנגישות:`] }],
					contact: true
				}
			]
		}
	}
};

// ============================================================
// English — convenience translation (the Hebrew text is binding)
// ============================================================
const en: LegalDoc = {
	title: `Legal Documents`,
	subtitle: `Terms of Use, Privacy Policy & Cookies, Arbitration Rules and Accessibility Statement`,
	note: `The Hebrew text is the binding version. This translation is provided for convenience only.`,
	ui: {
		toc: `Table of contents`,
		updated: `Last updated:`,
		date: `9 November 2026`,
		backHome: `← Back to home page`,
		backTop: `↑ Back to top`
	},
	tabs: {
		// ---------------------------------------------------- Terms of Use
		terms: {
			label: `Terms of Use`,
			title: `Terms of Use`,
			sections: [
				{
					title: `Introduction and acceptance of the terms`,
					blocks: [
						{
							p: [
								`The "Chachmei Ha'Eda — Houses of Reconciliation" website (the "Site") is a Beit Din (rabbinical court) for arbitration and peace according to the Torah of Israel, operated on a volunteer basis by dayanim (judges) and halachic teachers as part of the network of sites of the "Yotzim LeCherut" social movement. On the Site you can submit a request for a hearing, read rulings, articles and lessons, send a halachic question, and sign the Universal Ethical Code (UECC).`,
								`Use of the Site is subject to these Terms of Use, the Privacy Policy and the Arbitration Rules. Browsing the Site, creating an account, providing details, submitting a hearing request, or signing any document on the Site constitutes acceptance of these terms. Anyone who does not agree to them is asked not to use the Site.`,
								`Browsing the Site and reading its content is open to everyone. The Beit Din's services — submitting a hearing request, signing the Acceptance of Ruling form, and taking part in a hearing — are intended for adults aged 18 and over only.`
							]
						}
					]
				},
				{
					title: `The Site and its services`,
					blocks: [
						{
							sub: `The Beit Din`,
							p: [
								`The Site enables parties to a dispute to bring their matter to arbitration and reconciliation before volunteer dayanim and halachic teachers, with the consent of all parties. The Beit Din is not a state court, does not charge court fees, and does not require representation by an attorney. The details of the proceeding are set out in the "Arbitration Rules" tab.`
							]
						},
						{
							sub: `Content and halacha`,
							p: [
								`The Site publishes rulings, articles, lessons, recommendations for domestic peace, and halachic questions and answers. An answer to a question sent through "Ask the Sages of the Community" is general guidance based solely on the details provided; it is not a ruling, is not binding, and is not a substitute for a hearing at the Beit Din or for individual consultation with a halachic authority. A question and its answer may be published in the Q&A archive, usually without identifying details.`
							]
						},
						{
							sub: `Paid services`,
							p: [
								`A hearing at the Beit Din, sending a question, reading content and signing the Ethical Code are free of charge. Commercial advertising on the Site (the "Advertise with us" page) is a paid service and goes live only after approval by the Site administrator.`
							]
						}
					]
				},
				{
					title: `Registration and user account`,
					blocks: [
						{
							sub: `Creating an account`,
							p: [
								`Some services — such as submitting a hearing request, tracking cases and signing the Ethical Code — require a user account. You must provide accurate, complete and up-to-date details, including your full name, telephone number and e-mail address. You can also sign in with a Google account or an existing account on the network of sites.`
							]
						},
						{
							sub: `Account security`,
							p: [
								`The user is responsible for keeping their login details confidential. Any action taken in the account — including signing the Acceptance of Ruling form — is deemed an action of the account holder. Unauthorized use must be reported immediately.`
							]
						},
						{
							sub: `Suspension and closure`,
							p: [
								`The Site operators may suspend or close an account for breach of these terms, providing false details, misuse of the services, or at the user's request. Closing an account does not cancel an Acceptance of Ruling form that was signed, and does not result in deletion of the records of a proceeding that took place at the Beit Din.`
							]
						}
					]
				},
				{
					title: `Arbitration, signing and recording`,
					blocks: [
						{
							p: [
								`Submitting a hearing request, signing the Acceptance of Ruling form and taking part in a hearing are subject to the Arbitration Rules, which form an integral part of these Terms of Use. In brief:`
							],
							li: [
								`Before every hearing each party signs the Acceptance of Ruling form; without it, no hearing will take place.`,
								`Every hearing is recorded and documented in an official written protocol; the recording and the protocol are the official record of the proceeding.`,
								`It is forbidden to film, record, broadcast or publish a hearing, a recording or a protocol without written permission from the Beit Din.`
							]
						}
					],
					link: { label: `← Read the full Arbitration Rules`, tab: 'arbitration' }
				},
				{
					title: `Permitted and prohibited use`,
					blocks: [
						{
							sub: `Permitted use`,
							p: [
								`Reading the Site's content, submitting a hearing request, sending halachic questions, signing the Ethical Code, advertising in accordance with the rules of the "Advertise with us" page, and sharing links to the Site's content and quoting briefly from it with attribution.`
							]
						},
						{
							sub: `Prohibited use`,
							p: [`The user undertakes not to do any of the following on the Site:`],
							li: [
								`Violating the laws of the State of Israel, fraud, impersonation, or providing false information;`,
								`Submitting a hearing request with the intent to harass a person, harm their reputation, or pressure them;`,
								`Violating privacy, defamation, incitement, or offensive, racist or violent content;`,
								`Passing hearing join links or case details to anyone who is not a party to the proceeding or authorized by the Beit Din;`,
								`Filming, recording, broadcasting or publishing a hearing, a recording or a protocol without written permission from the Beit Din;`,
								`Commercial advertising without approval, sending spam, using robots or automated tools to scan the Site, breaking into its systems or disrupting its operation.`
							]
						},
						{
							sub: `Sanctions`,
							p: [
								`The Site operators may block a user, remove content, restrict access to services, pass information to the authorities where an offense is suspected, and take legal action. The Beit Din may remove from a hearing any participant who violates its order.`
							]
						}
					]
				},
				{
					title: `Privacy and personal information`,
					blocks: [
						{
							p: [
								`The collection, use and sharing of information are detailed in the Privacy Policy, which forms part of these Terms of Use. Information relating to a case at the Beit Din, including recordings and protocols, is handled as set out in the sections "Recording of hearings and protocols" and "Sharing information with others" of the Privacy Policy and in the Arbitration Rules.`
							]
						}
					],
					link: { label: `← Read the Privacy Policy`, tab: 'privacy' }
				},
				{
					title: `Intellectual property`,
					blocks: [
						{
							sub: `Site content`,
							p: [
								`Copyright in the Site's content — design, texts, images, code, rulings, articles, lessons and recordings — belongs to the Site operators or their authors, unless stated otherwise. It may not be copied, reproduced, adapted or published, in whole or in part, without written permission, other than sharing a link, a brief quotation with attribution, and personal use for study.`
							]
						},
						{
							sub: `Rulings and case documents`,
							p: [
								`Nothing in this section limits the parties' right to use the ruling and the case documents delivered to them in order to carry out, confirm and enforce the ruling.`
							]
						},
						{
							sub: `Content provided by the user`,
							p: [
								`Anyone who provides content to the Site — such as a description of claims in a hearing request, a halachic question, materials for publication or an advertisement — declares that they have the right to provide it, and authorizes the Site operators and the dayanim to use it for the purpose of the service for which it was provided, including presenting it to the dayanim and to the opposing party.`
							]
						},
						{
							sub: `Copyright infringement`,
							p: [
								`Anyone who believes that content on the Site infringes copyright is welcome to contact the Site operators, who may remove the content at their discretion.`
							]
						}
					]
				},
				{
					title: `Limitation of liability`,
					blocks: [
						{
							sub: `Nature of the service`,
							p: [
								`The Site is provided on a volunteer basis and without any commitment as to results. The dayanim and the Site operators are not responsible for the parties' decisions, for the outcome of a hearing, or for reliance on the Site's content, to the extent that the law permits limiting liability.`
							]
						},
						{
							sub: `Halachic and general content`,
							p: [
								`The Site's content is intended for study and general information and does not constitute legal, medical, financial or other advice. It should not be relied upon as individual instruction without consulting a halachic authority.`
							]
						},
						{
							sub: `Availability and faults`,
							p: [
								`The Site, the hearing rooms and the video service are provided "as is". Faults, maintenance work and service interruptions may occur, including faults in third-party services (such as the video service); in such a case a new hearing date may be required.`
							]
						},
						{
							sub: `Security`,
							p: [
								`The Site takes reasonable security measures but cannot guarantee absolute protection against break-ins, information leaks, cyber attacks and technological failures.`
							]
						}
					]
				},
				{
					title: `Account deletion and user rights`,
					blocks: [
						{
							sub: `Deleting an account`,
							p: [`You may request deletion of your account at any time by e-mail. The Site will act within a reasonable time and in accordance with the law.`]
						},
						{
							sub: `Records of proceedings`,
							p: [
								`Deleting an account does not result in deletion of the records of a proceeding that took place at the Beit Din — the Acceptance of Ruling form, protocols, recordings and rulings — which are kept to ensure the integrity of the proceeding and the carrying out and confirmation of the ruling, to the extent required by law, or for defense in legal proceedings.`
							]
						},
						{
							sub: `Rights under the Privacy Protection Law`,
							p: [
								`In accordance with the Privacy Protection Law, 5741-1981, a user is entitled to review the information kept about them and to request its correction or deletion, subject to the limitations set out above.`
							]
						}
					]
				},
				{
					title: `Changes to the Terms of Use`,
					blocks: [
						{
							p: [
								`The Site operators may update the Terms of Use at any time. Material changes will be published on the Site and the update date will change accordingly. Continued use of the Site after publication constitutes acceptance of the updated terms. A change to the Arbitration Rules applies to proceedings opened after it is published, as set out there.`
							]
						}
					]
				},
				{
					title: `Governing law and jurisdiction`,
					blocks: [
						{
							p: [
								`These Terms of Use are governed by the laws of the State of Israel. A dispute concerning use of the Site will be heard by the competent courts in the Jerusalem District. A dispute between parties that was brought to the Beit Din and in which an Acceptance of Ruling form was signed will be decided at the Beit Din, as set out in the Arbitration Rules.`
							]
						}
					]
				},
				{
					title: `Contact`,
					blocks: [{ p: [`For any question, request or report, you may contact the Site operators:`] }],
					contact: true
				}
			]
		},

		// ---------------------------------------------------- Privacy
		privacy: {
			label: `Privacy Policy & Cookies`,
			title: `Privacy Policy & Cookies`,
			sections: [
				{
					title: `Introduction`,
					blocks: [
						{
							p: [
								`This policy explains how the "Chachmei Ha'Eda — Houses of Reconciliation" website collects, uses, stores and protects personal information, including information relating to proceedings at the Beit Din, and how the Site uses cookies and similar technologies. The Site operates in accordance with the Privacy Protection Law, 5741-1981 and its regulations.`,
								`Information relating to arbitration proceedings may be sensitive — personal, family and financial disputes. The Site operators and the dayanim are committed to protecting it and to using it only for the purposes set out below. Use of the Site constitutes agreement to this policy and to the Terms of Use.`
							]
						}
					]
				},
				{
					title: `Information we collect`,
					blocks: [
						{
							sub: `Information provided by the user`,
							li: [
								`Account details: full name, telephone number and e-mail address; when signing in with Google or an account on the network of sites — also the name, e-mail and profile picture that the provider supplies.`,
								`Case details: the names of the plaintiff and the defendant, telephone numbers, the subject of the case, the details of the claims, hearing dates, and documents and materials submitted to the case.`,
								`Signatures and consents: signing the UECC Ethical Code and the Acceptance of Ruling form, and the date of signing.`,
								`Halachic questions: name, e-mail, telephone, topic and content of a question sent through "Ask the Sages of the Community".`,
								`Advertisers: business and contact details for the purpose of publishing an advertisement on the Site.`
							]
						},
						{
							sub: `Information generated in a hearing`,
							p: [`The voice and image of participants in the recorded hearing, the official protocol, the decisions of the Beit Din and the ruling.`]
						},
						{
							sub: `Information collected automatically`,
							p: [
								`IP address, browser type and operating system, pages viewed and usage data, as well as information stored in cookies and in the browser's local storage.`
							]
						},
						{
							sub: `Information from third parties`,
							p: [`Information supplied by the sign-in services (Google and the network of sites) and by the analytics service.`]
						}
					]
				},
				{
					title: `Recording of hearings and protocols`,
					blocks: [
						{
							p: [
								`Every hearing at the Beit Din is recorded (audio and video, where the hearing is held by video) and documented in an official protocol. The recording and the protocol are the official record of the proceeding.`
							]
						},
						{
							sub: `Consent to recording`,
							p: [
								`The parties and participants consent to recording and documentation by signing the Acceptance of Ruling form and by joining the hearing. Anyone who does not consent to recording will not take part in the hearing. An additional participant (such as a witness) will be notified before joining.`
							]
						},
						{
							sub: `Purposes`,
							p: [
								`Accurate documentation of the claims and agreements, preparation of the ruling, clarifying claims about the conduct of the proceeding, confirmation and enforcement of the ruling in court, and defense in legal proceedings.`
							]
						},
						{
							sub: `Access`,
							p: [
								`Recordings and protocols are accessible only to the dayanim, to the parties to the case (in the personal area on the Site, after the hearing ends) and to persons authorized by the Beit Din. They will not be provided to anyone else except with the consent of the parties, by order of a court, or as required by law.`
							]
						},
						{
							sub: `Retention`,
							p: [
								`Recordings and protocols will be kept for the period required for the purposes above and by law. A request for deletion will not be granted to the extent that deletion would harm the integrity of the proceeding, the carrying out of the ruling, or the ability to defend in legal proceedings.`
							]
						},
						{
							sub: `Prohibition of private recording`,
							p: [
								`A party or participant may not record, film, broadcast or publish a hearing, a recording or a protocol without written permission from the Beit Din.`
							]
						}
					]
				},
				{
					title: `Purposes of using the information`,
					blocks: [
						{
							li: [
								`Managing the proceeding: receiving requests, summoning the parties, setting dates, conducting and documenting the hearing and issuing the ruling.`,
								`Operating and improving the Site, information security, and preventing fraud and misuse.`,
								`Communication: system messages, reminders and replies to inquiries and questions, including by e-mail or SMS.`,
								`Publication, in accordance with the section "Publication of rulings and content".`,
								`Statistics: analysis of general use of the Site and improving the user experience.`,
								`Compliance with the law and responding to demands of competent authorities.`
							]
						}
					]
				},
				{
					title: `Publication of rulings and content`,
					blocks: [
						{
							p: [
								`Rulings are published in the Site's archive, in the interest of transparency. The Beit Din may omit or blur identifying details — including the parties' names — where required to protect privacy, domestic peace or to prevent harm. By signing the Acceptance of Ruling form the parties consent to publication of the ruling as stated.`,
								`A halachic question and its answer may be published in the Q&A archive, usually without identifying details. The asker's contact details are used only to reply.`,
								`Those who sign the Universal Ethical Code appear in the public index of the Code, in accordance with the details provided for that purpose.`
							]
						}
					]
				},
				{
					title: `Sharing information with others`,
					blocks: [
						{
							p: [`The Site does not sell personal information. Information may be shared with:`],
							li: [
								`The dayanim and the opposing party, as required to conduct the proceeding (including contact details and the parties' claims);`,
								`Infrastructure and service providers: hosting, the database of the network of sites, the video service for the hearing rooms (Eitanium), e-mail and SMS delivery, and analytics (Google Analytics);`,
								`Automated tools, including artificial intelligence, used by the Site team to process documents that the Beit Din publishes (such as extracting a title and summary);`,
								`Courts and competent authorities — as required by law, and for the purpose of confirming and enforcing an arbitral award.`
							]
						}
					]
				},
				{
					title: `Cookies and local storage`,
					blocks: [
						{
							sub: `What they are`,
							p: [
								`Cookies and local storage are small files and values stored in the browser that allow identification of a user, saving preferences and improving performance.`
							]
						},
						{
							sub: `Use on the Site`,
							li: [
								`Essential and functional — signing in, display language, saving a draft hearing request, and preferences;`,
								`Analytics — Google Analytics, a property shared by the sites of the network (the sites are separated by domain name);`,
								`Third party — Google (sign-in) and YouTube (when watching an embedded video).`
							]
						},
						{
							sub: `Management`,
							p: [
								`You can delete or block cookies through your browser settings. Blocking may impair the Site's functioning, such as signing in and saving drafts.`
							]
						}
					]
				},
				{
					title: `Information security and retention`,
					blocks: [
						{
							p: [
								`The Site takes reasonable and accepted security measures, including encryption of communications and access controls. Links for joining the hearing rooms are stored encrypted and are provided only to the parties to the case and to the Beit Din. Absolute security cannot be guaranteed. In the event of an information leak the Site will act to limit the damage, notify those affected and act in accordance with the law.`,
								`Information is kept for the purpose of operating the Site, managing proceedings, complying with the law and legal defense.`
							]
						}
					]
				},
				{
					title: `Transfer of information abroad`,
					blocks: [
						{
							p: [
								`Some service providers (for example Google and hosting providers) may store information on servers outside Israel. Such transfer is subject to accepted safeguards and the requirements of the law.`
							]
						}
					]
				},
				{
					title: `User rights`,
					blocks: [
						{
							p: [
								`Under the Privacy Protection Law, every person is entitled to review the information kept about them, to request its correction, to request its deletion or restriction of its use, and to withdraw consent to mailings. Deletion is subject to the section "Recording of hearings and protocols" regarding records of proceedings. To exercise these rights, please contact us by e-mail.`
							]
						}
					]
				},
				{
					title: `Minors`,
					blocks: [
						{
							p: [
								`The Site and the Beit Din's services are not intended for minors, and we do not knowingly collect information about minors. If such information has been provided, a parent may request its deletion.`
							]
						}
					]
				},
				{
					title: `Changes to the policy`,
					blocks: [
						{
							p: [
								`The Site operators may update this policy. Material changes will be published on the Site. Continued use of the Site constitutes agreement to the updated policy.`
							]
						}
					]
				},
				{
					title: `Contact`,
					blocks: [{ p: [`For any question or request regarding this policy:`] }],
					contact: true
				}
			]
		},

		// ---------------------------------------------------- Arbitration Rules
		arbitration: {
			label: `Arbitration Rules`,
			title: `Arbitration Rules — Chachmei Ha'Eda`,
			sections: [
				{
					title: `General and application`,
					blocks: [
						{
							p: [
								`These rules set out the procedure at the "Chachmei Ha'Eda — Houses of Reconciliation" Beit Din (the "Beit Din"). They apply to everyone who submits a hearing request, is invited to join a proceeding, or takes part in a hearing, and they form an integral part of the Terms of Use. Signing the Acceptance of Ruling form constitutes acceptance of these rules.`
							]
						}
					]
				},
				{
					title: `Principles of the proceeding`,
					blocks: [
						{
							li: [
								`The proceeding is conducted only with the consent of all parties.`,
								`The Beit Din acts according to Torah law, with the aim of bringing the parties to reconciliation and peace.`,
								`The dayanim are volunteers, and the hearing is free of court fees and litigation costs.`,
								`The proceeding does not require representation by an attorney.`
							]
						}
					]
				},
				{
					title: `Opening a case`,
					blocks: [
						{
							p: [
								`A case is opened by submitting a hearing request on the Site, including the details of the plaintiff and the defendant, the subject of the case, the details of the claims and a proposed date. The opposing party is invited to join the proceeding, sign in to the Site and sign the Ethical Code and the Acceptance of Ruling form before being able to confirm the hearing date.`,
								`The hearing will be scheduled after approval by the Beit Din. The Beit Din may decline to hear a case, including for lack of jurisdiction or suitability.`
							]
						}
					]
				},
				{
					title: `Acceptance of Ruling form — signed before the hearing`,
					blocks: [
						{
							p: [`Before every hearing, each party signs the Acceptance of Ruling form (the "Acceptance Form") on the Site. In the Acceptance Form the party:`],
							li: [
								`Agrees that the dispute will be decided by the Beit Din according to Torah law, and undertakes to abide by the ruling;`,
								`Accepts the UECC Ethical Code and the Seven Noahide Laws as a condition for holding the hearing;`,
								`Accepts the Arbitration Rules, including the recording and official protocol of the hearing.`
							]
						},
						{
							p: [
								`The Acceptance Form is signed in each party's user account, and the signatory's name and the date of signing are recorded. No hearing will take place without the signature of all the parties, and the Beit Din may cancel a hearing date for which an Acceptance Form has not been signed.`,
								`Signing the Ethical Code and accepting the Beit Din's authority is valid also for the signatory's future hearings at the Beit Din. Signing is not an admission of the opposing party's claims and does not affect the right to raise any claim at the hearing.`
							]
						}
					]
				},
				{
					title: `Conduct of the hearing`,
					blocks: [
						{
							li: [
								`The hearing is held by video, in a secure hearing room on the Site, or in person, as decided by the Beit Din.`,
								`The links for joining the room are personal: they are provided only to the parties to the case and to the Beit Din, and must not be passed to anyone else.`,
								`The parties appear in person on the date set. Bringing a witness, representative or additional participant is permitted with the prior approval of the Beit Din.`,
								`Participants shall treat one another with respect. The Beit Din may stop or postpone a hearing and remove a participant who violates its order.`
							]
						}
					]
				},
				{
					title: `Recording and official protocol`,
					blocks: [
						{
							li: [
								`Every hearing is recorded and documented in an official protocol. The parties and participants consent to this by signing the Acceptance Form and by joining the hearing; anyone who does not consent to recording will not take part in the hearing.`,
								`The recording and the official protocol are the official record of the proceeding.`,
								`After the hearing, the recording and the protocol are made available to the parties for review in the personal area on the Site.`,
								`A party who comments on the accuracy of the protocol may contact the Beit Din in writing within a reasonable time of receiving it. The Beit Din will examine the comment, and may correct the protocol or attach the comment to it.`,
								`It is forbidden to film, record, broadcast or publish a hearing, a recording or a protocol without written permission from the Beit Din. A violation may lead to removal from the hearing and to further measures.`,
								`The Beit Din and the parties may submit the recording and the protocol to a court for the purpose of confirming or enforcing the ruling, or for any other related proceeding.`
							]
						}
					],
					link: { label: `← Details on retention of recordings and access to them — in the Privacy Policy`, tab: 'privacy' }
				},
				{
					title: `Confidentiality`,
					blocks: [
						{
							p: [
								`Participation in a hearing is permitted only to those invited or approved by the Beit Din. Participants undertake to keep confidential what is said at the hearing and the case documents, and not to disclose them to others except for the purpose of carrying out, confirming and enforcing the ruling, for professional advice, with the Beit Din's approval, or as required by law. The Beit Din and its staff are bound by confidentiality regarding the content of the hearing and the case, subject to publication of the ruling as set out below.`
							]
						}
					]
				},
				{
					title: `The ruling`,
					blocks: [
						{
							p: [
								`The Beit Din issues a written, signed ruling and delivers it to the parties in the personal area. The parties are bound by the ruling under the Acceptance Form. A court may be asked to confirm the ruling as an arbitral award, in accordance with the Arbitration Law, 5728-1968, and to enforce it.`,
								`Rulings are published in the Site's archive, in the interest of transparency. The Beit Din may omit or blur identifying details of the parties, and by signing the Acceptance Form the parties consent to publication of the ruling as stated.`,
								`A peacemaking team may accompany the parties in implementing the decision and restoring brotherhood.`
							]
						}
					]
				},
				{
					title: `Costs`,
					blocks: [
						{
							p: [
								`The Beit Din does not charge court fees or litigation costs, and the dayanim are volunteers. Expenses that the parties incur themselves, such as representation or expert opinions, are at their own cost, unless they agreed otherwise or the Beit Din decided otherwise.`
							]
						}
					]
				},
				{
					title: `Liability`,
					blocks: [
						{
							p: [
								`The Beit Din operates on a volunteer basis and does not commit to handling times or to results. The liability of the Beit Din, the dayanim and the operators is limited to the extent the law permits, as set out in the Terms of Use.`
							]
						}
					]
				},
				{
					title: `Changes to the rules`,
					blocks: [
						{
							p: [
								`The Site operators may update these rules. A change applies to hearing requests submitted after its publication, and not to a proceeding opened before it, except with the parties' consent.`
							]
						}
					]
				},
				{
					title: `Contact`,
					blocks: [{ p: [`For any question or request regarding the rules and the proceeding:`] }],
					contact: true
				}
			]
		},

		// ---------------------------------------------------- Accessibility
		accessibility: {
			label: `Accessibility Statement`,
			title: `Accessibility Statement`,
			replyNote: `We will try to reply within 5 business days.`,
			sections: [
				{
					title: `Purpose and commitment`,
					blocks: [
						{
							p: [
								`The "Chachmei Ha'Eda — Houses of Reconciliation" website is committed to making the Site and its services — including submitting a hearing request and taking part in a hearing — accessible to all users, including people with disabilities. The Site aims to meet the requirements of Israeli Standard 5568 (WCAG 2.1 level AA) and applies accommodations for people with visual, hearing, cognitive and motor impairments.`
							]
						}
					]
				},
				{
					title: `Scope`,
					blocks: [
						{
							p: [
								`This statement applies to the Site's pages, forms, personal area and the digital documents published by the Site. The video hearing rooms are provided by a third party (Eitanium), and their accessibility depends on it — see "Known limitations" below.`
							]
						}
					]
				},
				{
					title: `Accessibility principles`,
					blocks: [
						{
							li: [
								{ b: `Content accessibility`, t: `Texts, images, video and files will be made accessible in accordance with accepted accessibility guidelines.` },
								{ b: `Navigation accessibility`, t: `Menus and links will be clear, consistent and accessible by keyboard.` },
								{ b: `Visual accessibility`, t: `Colors and contrast will be chosen to suit reading; important texts can be enlarged.` },
								{ b: `Hearing accessibility`, t: `For video content we aim to provide captions or a transcript, and for hearings — accommodations on request (see "Individual accommodations").` },
								{ b: `Technical accessibility`, t: `The Site aims to meet accepted technical standards (WCAG) where possible.` }
							]
						}
					]
				},
				{
					title: `Accommodations made`,
					blocks: [
						{
							li: [
								`The page language (lang) and text direction (dir) are updated according to the display language, to support screen readers`,
								`A "Skip to main content" link appears with keyboard focus for quick navigation`,
								`Buttons, links and menus include aria-label descriptions`,
								`Dynamic messages (such as errors and successes) are announced to screen readers using aria-live`,
								`Drop-down menus include aria-expanded and aria-haspopup to indicate their open state`,
								`Animations are reduced when the user sets a reduced-motion preference (prefers-reduced-motion)`,
								`Decorative images are marked alt="" and content images include a description`,
								`The moving news ticker is hidden from screen readers`,
								`Form fields include associated labels (label)`
							]
						}
					]
				},
				{
					title: `Known limitations`,
					blocks: [
						{
							li: [
								`The video hearing rooms (Eitanium) are a third-party service, and some of their functions may not be fully accessible to screen readers and keyboard users. A person who needs an accommodation for a hearing — for example an in-person hearing, a transcript or another channel — is welcome to contact the Beit Din in advance.`,
								`PDF documents of rulings and articles may not be fully accessible to screen readers.`,
								`Some content or services may not be fully accessible for technological or third-party reasons; the Site will act to indicate these limitations and look for alternatives.`
							]
						}
					]
				},
				{
					title: `Individual accommodations`,
					blocks: [
						{
							p: [
								`Users who need special accommodations — on the Site or at a hearing — are welcome to contact the Site team. The Site will consider reasonable requests and will act to provide a solution in accordance with its technical capability and resources.`
							]
						}
					]
				},
				{
					title: `Contact and reporting accessibility problems`,
					blocks: [{ p: [`For any accessibility problem or request:`] }],
					contact: true
				}
			]
		}
	}
};

// ============================================================
// Русский — перевод для удобства (обязательной силой обладает текст на иврите)
// ============================================================
const ru: LegalDoc = {
	title: `Юридические документы`,
	subtitle: `Условия использования, политика конфиденциальности и Cookies, правила арбитража и заявление о доступности`,
	note: `Обязательной силой обладает текст на иврите. Данный перевод приводится только для удобства.`,
	ui: {
		toc: `Содержание`,
		updated: `Дата последнего обновления:`,
		date: `9 ноября 2026`,
		backHome: `← На главную`,
		backTop: `↑ Наверх`
	},
	tabs: {
		// ---------------------------------------------------- Условия использования
		terms: {
			label: `Условия использования`,
			title: `Условия использования`,
			sections: [
				{
					title: `Введение и согласие с условиями`,
					blocks: [
						{
							p: [
								`Сайт «Хахмей а-Эда — Дома примирения» («Сайт») — это бейт-дин (раввинский суд) для арбитража и мира по закону Торы Израиля, работающий на добровольных началах силами даянов (судей) и учителей Торы в составе сети сайтов общественного движения «Йоцим ле-Херут». На Сайте можно подать заявку на слушание, читать решения, статьи и уроки, задать галахический вопрос и подписать Всемирный этический кодекс (UECC).`,
								`Использование Сайта регулируется настоящими Условиями использования, Политикой конфиденциальности и Правилами арбитража. Просмотр Сайта, создание учётной записи, предоставление данных, подача заявки на слушание и подписание любого документа на Сайте означают согласие с этими условиями. Тех, кто с ними не согласен, просим не пользоваться Сайтом.`,
								`Просматривать Сайт и знакомиться с его материалами может любой человек. Услуги бейт-дина — подача заявки на слушание, подписание письменного согласия на принятие решения и участие в слушании — предназначены только для совершеннолетних лиц от 18 лет.`
							]
						}
					]
				},
				{
					title: `Сайт и его услуги`,
					blocks: [
						{
							sub: `Бейт-дин`,
							p: [
								`Сайт позволяет сторонам спора передать дело на арбитраж и примирение перед добровольными даянами и учителями Торы с согласия всех сторон. Бейт-дин не является государственным судом, не взимает судебных сборов и не требует представительства адвоката. Порядок разбирательства изложен на вкладке «Правила арбитража».`
							]
						},
						{
							sub: `Материалы и галаха`,
							p: [
								`На Сайте публикуются решения, статьи, уроки, рекомендации по семейному миру, а также вопросы и ответы по галахе. Ответ на вопрос, отправленный через форму «Спросите мудрецов общины», — это общее разъяснение, основанное только на предоставленных данных; он не является решением, не имеет обязательной силы и не заменяет слушание в бейт-дине или индивидуальную консультацию у авторитета в галахе. Вопрос и ответ могут быть опубликованы в архиве вопросов и ответов, как правило, без идентифицирующих данных.`
							]
						},
						{
							sub: `Платные услуги`,
							p: [
								`Слушание в бейт-дине, отправка вопроса, чтение материалов и подписание Этического кодекса бесплатны. Коммерческая реклама на Сайте (страница «Разместить рекламу») — платная услуга и публикуется только после одобрения администратора Сайта.`
							]
						}
					]
				},
				{
					title: `Регистрация и учётная запись`,
					blocks: [
						{
							sub: `Создание учётной записи`,
							p: [
								`Для некоторых услуг — например, подачи заявки на слушание, отслеживания дел и подписания Этического кодекса — необходима учётная запись. Необходимо указывать точные, полные и актуальные данные, включая полное имя, номер телефона и адрес электронной почты. Войти можно также через аккаунт Google или существующий аккаунт в сети сайтов.`
							]
						},
						{
							sub: `Безопасность учётной записи`,
							p: [
								`Пользователь отвечает за сохранность конфиденциальности своих данных для входа. Любое действие, совершённое в учётной записи, — включая подписание письменного согласия на принятие решения, — считается действием владельца учётной записи. О несанкционированном использовании необходимо сообщать немедленно.`
							]
						},
						{
							sub: `Приостановка и закрытие`,
							p: [
								`Операторы Сайта вправе приостановить или закрыть учётную запись за нарушение условий, предоставление ложных данных, злоупотребление услугами или по просьбе пользователя. Закрытие учётной записи не отменяет подписанное письменное согласие и не ведёт к удалению документации разбирательства, проведённого в бейт-дине.`
							]
						}
					]
				},
				{
					title: `Арбитраж, подписание и запись`,
					blocks: [
						{
							p: [
								`Подача заявки на слушание, подписание письменного согласия на принятие решения и участие в слушании регулируются Правилами арбитража, которые являются неотъемлемой частью Условий использования. Вкратце:`
							],
							li: [
								`Перед каждым слушанием каждая сторона подписывает письменное согласие на принятие решения; без него слушание не состоится.`,
								`Каждое слушание записывается и фиксируется в официальном протоколе; запись и протокол являются официальной документацией разбирательства.`,
								`Запрещается снимать, записывать, транслировать или публиковать слушание, запись или протокол без письменного разрешения бейт-дина.`
							]
						}
					],
					link: { label: `← Прочитать Правила арбитража полностью`, tab: 'arbitration' }
				},
				{
					title: `Разрешённое и запрещённое использование`,
					blocks: [
						{
							sub: `Разрешённое использование`,
							p: [
								`Чтение материалов Сайта, подача заявки на слушание, отправка вопросов по галахе, подписание Этического кодекса, размещение рекламы в соответствии с правилами страницы «Разместить рекламу», а также передача ссылок на материалы Сайта и краткое цитирование с указанием источника.`
							]
						},
						{
							sub: `Запрещённое использование`,
							p: [`Пользователь обязуется не совершать на Сайте следующих действий:`],
							li: [
								`нарушение законов государства Израиль, мошенничество, выдача себя за другое лицо или предоставление ложных сведений;`,
								`подача заявки на слушание с целью побеспокоить человека, навредить его репутации или оказать на него давление;`,
								`нарушение неприкосновенности частной жизни, клевета, подстрекательство, оскорбительный, расистский или насильственный контент;`,
								`передача ссылок для подключения к слушанию или данных дела тому, кто не является стороной разбирательства или не уполномочен бейт-дином;`,
								`съёмка, запись, трансляция или публикация слушания, записи или протокола без письменного разрешения бейт-дина;`,
								`коммерческая реклама без одобрения, рассылка спама, использование роботов или автоматических средств для сканирования Сайта, проникновение в его системы или нарушение их работы.`
							]
						},
						{
							sub: `Санкции`,
							p: [
								`Операторы Сайта вправе заблокировать пользователя, удалить контент, ограничить доступ к услугам, передать сведения властям при подозрении на правонарушение и принять юридические меры. Бейт-дин вправе удалить со слушания участника, нарушающего его порядок.`
							]
						}
					]
				},
				{
					title: `Конфиденциальность и личные данные`,
					blocks: [
						{
							p: [
								`Сбор, использование и передача данных подробно описаны в Политике конфиденциальности, которая является частью Условий использования. Сведения, относящиеся к делу в бейт-дине, включая записи и протоколы, обрабатываются так, как указано в разделах «Запись слушаний и протоколы» и «Передача данных третьим лицам» Политики конфиденциальности, а также в Правилах арбитража.`
							]
						}
					],
					link: { label: `← Прочитать Политику конфиденциальности`, tab: 'privacy' }
				},
				{
					title: `Интеллектуальная собственность`,
					blocks: [
						{
							sub: `Материалы Сайта`,
							p: [
								`Авторские права на материалы Сайта — оформление, тексты, изображения, код, решения, статьи, уроки и записи — принадлежат операторам Сайта или их авторам, если не указано иное. Их нельзя копировать, воспроизводить, перерабатывать или публиковать полностью или частично без письменного разрешения, кроме передачи ссылки, краткого цитирования с указанием источника и личного использования для обучения.`
							]
						},
						{
							sub: `Решение и документы дела`,
							p: [
								`Ничто в настоящем разделе не ограничивает право сторон использовать решение и переданные им документы дела для исполнения, подтверждения и принудительного исполнения решения.`
							]
						},
						{
							sub: `Контент, предоставляемый пользователем`,
							p: [
								`Тот, кто передаёт Сайту контент — например, описание требований в заявке на слушание, вопрос по галахе, материалы для публикации или объявление, — заявляет, что вправе его передавать, и разрешает операторам Сайта и даянам использовать его для оказания услуги, ради которой он передан, включая предоставление даянам и противоположной стороне.`
							]
						},
						{
							sub: `Нарушение авторских прав`,
							p: [
								`Тот, кто полагает, что материал на Сайте нарушает авторские права, может обратиться к операторам Сайта, которые вправе удалить материал по своему усмотрению.`
							]
						}
					]
				},
				{
					title: `Ограничение ответственности`,
					blocks: [
						{
							sub: `Характер услуги`,
							p: [
								`Сайт работает на добровольных началах и без гарантий результата. Даяны и операторы Сайта не отвечают за решения сторон, за исход слушания и за использование материалов Сайта, в той мере, в какой закон допускает ограничение ответственности.`
							]
						},
						{
							sub: `Галахические и общие материалы`,
							p: [
								`Материалы Сайта предназначены для изучения и общей информации и не являются юридической, медицинской, финансовой или иной консультацией. На них нельзя полагаться как на индивидуальное указание без консультации с авторитетом в галахе.`
							]
						},
						{
							sub: `Доступность и сбои`,
							p: [
								`Сайт, комнаты слушаний и видеосервис предоставляются «как есть». Возможны сбои, технические работы и перерывы в обслуживании, включая сбои сторонних сервисов (например, видеосервиса); в таком случае может потребоваться назначить новую дату слушания.`
							]
						},
						{
							sub: `Безопасность`,
							p: [
								`Сайт принимает разумные меры безопасности, но не может гарантировать абсолютную защиту от взломов, утечек данных, кибератак и технологических сбоев.`
							]
						}
					]
				},
				{
					title: `Удаление учётной записи и права пользователя`,
					blocks: [
						{
							sub: `Удаление учётной записи`,
							p: [`Вы можете в любое время запросить удаление учётной записи по электронной почте. Сайт выполнит запрос в разумный срок и в соответствии с законом.`]
						},
						{
							sub: `Документация разбирательств`,
							p: [
								`Удаление учётной записи не ведёт к удалению документации разбирательства, проведённого в бейт-дине, — письменного согласия на принятие решения, протоколов, записей и решений, — которая хранится для обеспечения целостности разбирательства, исполнения и подтверждения решения, в той мере, в какой этого требует закон, либо для защиты в судебных процедурах.`
							]
						},
						{
							sub: `Права по Закону о защите частной жизни`,
							p: [
								`В соответствии с Законом о защите частной жизни, 5741-1981, пользователь вправе знакомиться с хранящимися о нём данными и требовать их исправления или удаления с учётом изложенных выше ограничений.`
							]
						}
					]
				},
				{
					title: `Изменения Условий использования`,
					blocks: [
						{
							p: [
								`Операторы Сайта вправе в любое время обновлять Условия использования. Существенные изменения публикуются на Сайте, а дата обновления меняется соответственно. Продолжение использования Сайта после публикации означает согласие с обновлёнными условиями. Изменение Правил арбитража применяется к разбирательствам, начатым после его публикации, как указано в этих Правилах.`
							]
						}
					]
				},
				{
					title: `Применимое право и подсудность`,
					blocks: [
						{
							p: [
								`К настоящим Условиям использования применяется право государства Израиль. Спор, связанный с использованием Сайта, рассматривается компетентными судами Иерусалимского округа. Спор между сторонами, переданный в бейт-дин и по которому подписано письменное согласие на принятие решения, разрешается в бейт-дине, как указано в Правилах арбитража.`
							]
						}
					]
				},
				{
					title: `Контакты`,
					blocks: [{ p: [`По любым вопросам, обращениям, просьбам или сообщениям можно связаться с операторами Сайта:`] }],
					contact: true
				}
			]
		},

		// ---------------------------------------------------- Конфиденциальность
		privacy: {
			label: `Политика конфиденциальности и Cookies`,
			title: `Политика конфиденциальности и Cookies`,
			sections: [
				{
					title: `Введение`,
					blocks: [
						{
							p: [
								`Настоящая политика объясняет, как сайт «Хахмей а-Эда — Дома примирения» собирает, использует, хранит и защищает личные данные, включая сведения о разбирательствах в бейт-дине, и как Сайт использует файлы Cookies и аналогичные технологии. Сайт действует в соответствии с Законом о защите частной жизни, 5741-1981, и принятыми в его развитие правилами.`,
								`Сведения, связанные с арбитражем, могут быть чувствительными — личные, семейные и финансовые споры. Операторы Сайта и даяны обязаны их охранять и использовать только для целей, указанных ниже. Использование Сайта означает согласие с настоящей политикой и с Условиями использования.`
							]
						}
					]
				},
				{
					title: `Какие данные мы собираем`,
					blocks: [
						{
							sub: `Данные, которые предоставляет пользователь`,
							li: [
								`Данные учётной записи: полное имя, номер телефона и адрес электронной почты; при входе через Google или аккаунт в сети сайтов — также имя, адрес электронной почты и фото профиля, которые передаёт поставщик.`,
								`Данные дела: имена истца и ответчика, номера телефонов, предмет дела, описание требований, даты слушаний, а также документы и материалы, переданные в дело.`,
								`Подписи и согласия: подписание Этического кодекса UECC и письменного согласия на принятие решения, а также дата подписания.`,
								`Вопросы по галахе: имя, адрес электронной почты, телефон, тема и текст вопроса, отправленного через форму «Спросите мудрецов общины».`,
								`Рекламодатели: данные о бизнесе и контактные данные для публикации объявления на Сайте.`
							]
						},
						{
							sub: `Данные, возникающие на слушании`,
							p: [`Голос и изображение участников записываемого слушания, официальный протокол, постановления бейт-дина и решение.`]
						},
						{
							sub: `Данные, собираемые автоматически`,
							p: [
								`IP-адрес, тип браузера и операционной системы, просмотренные страницы и данные об использовании, а также данные, сохраняемые в Cookies и в локальном хранилище браузера.`
							]
						},
						{
							sub: `Данные от третьих лиц`,
							p: [`Сведения, которые передают сервисы входа (Google и сеть сайтов) и сервис аналитики.`]
						}
					]
				},
				{
					title: `Запись слушаний и протоколы`,
					blocks: [
						{
							p: [
								`Каждое слушание в бейт-дине записывается (звук и изображение, если слушание проходит по видео) и фиксируется в официальном протоколе. Запись и протокол являются официальной документацией разбирательства.`
							]
						},
						{
							sub: `Согласие на запись`,
							p: [
								`Стороны и участники соглашаются на запись и протоколирование, подписывая письменное согласие на принятие решения и подключаясь к слушанию. Кто не согласен на запись, в слушании не участвует. Дополнительный участник (например, свидетель) получит уведомление до подключения.`
							]
						},
						{
							sub: `Цели`,
							p: [
								`Точная фиксация требований и договорённостей, подготовка решения, выяснение претензий о ходе разбирательства, подтверждение решения и его принудительное исполнение в суде, а также защита в судебных процедурах.`
							]
						},
						{
							sub: `Доступ`,
							p: [
								`Записи и протоколы доступны только даянам, сторонам дела (в личном кабинете на Сайте после окончания слушания) и лицам, уполномоченным бейт-дином. Другим лицам они не передаются, кроме как с согласия сторон, по решению суда или в случаях, предусмотренных законом.`
							]
						},
						{
							sub: `Хранение`,
							p: [
								`Записи и протоколы хранятся в течение срока, необходимого для указанных целей и предусмотренного законом. Просьба об удалении не удовлетворяется в той мере, в какой удаление нарушает целостность разбирательства, исполнение решения или возможность защиты в судебных процедурах.`
							]
						},
						{
							sub: `Запрет частной записи`,
							p: [
								`Стороне или участнику запрещается записывать, снимать, транслировать или публиковать слушание, запись или протокол без письменного разрешения бейт-дина.`
							]
						}
					]
				},
				{
					title: `Цели использования данных`,
					blocks: [
						{
							li: [
								`Ведение разбирательства: приём заявок, вызов сторон, назначение дат, проведение слушания, его фиксация и вынесение решения.`,
								`Работа и улучшение Сайта, информационная безопасность, предотвращение мошенничества и злоупотреблений.`,
								`Связь: системные сообщения, напоминания и ответы на обращения и вопросы, в том числе по электронной почте или SMS.`,
								`Публикация в соответствии с разделом «Публикация решений и материалов».`,
								`Статистика: анализ общего использования Сайта и улучшение пользовательского опыта.`,
								`Соблюдение закона и ответы на требования компетентных органов.`
							]
						}
					]
				},
				{
					title: `Публикация решений и материалов`,
					blocks: [
						{
							p: [
								`Решения публикуются в архиве Сайта в интересах прозрачности. Бейт-дин вправе опустить или скрыть идентифицирующие данные, включая имена сторон, если это необходимо для защиты частной жизни, семейного мира или предотвращения ущерба. Подписывая письменное согласие на принятие решения, стороны соглашаются на публикацию решения в указанном порядке.`,
								`Вопрос по галахе и ответ на него могут быть опубликованы в архиве вопросов и ответов, как правило, без идентифицирующих данных. Контактные данные спрашивающего используются только для ответа.`,
								`Подписавшие Всемирный этический кодекс отображаются в публичном списке кодекса в соответствии с данными, предоставленными для этой цели.`
							]
						}
					]
				},
				{
					title: `Передача данных третьим лицам`,
					blocks: [
						{
							p: [`Сайт не продаёт личные данные. Данные могут передаваться:`],
							li: [
								`даянам и противоположной стороне — в той мере, в какой это необходимо для ведения разбирательства (включая контактные данные и требования сторон);`,
								`поставщикам инфраструктуры и услуг: хостинг, база данных сети сайтов, видеосервис для комнат слушаний (Eitanium), отправка электронной почты и SMS, аналитика (Google Analytics);`,
								`автоматическим инструментам, включая искусственный интеллект, которые команда Сайта использует для обработки документов, публикуемых бейт-дином (например, для выделения заголовка и краткого содержания);`,
								`судам и компетентным органам — в случаях, предусмотренных законом, а также для подтверждения и принудительного исполнения арбитражного решения.`
							]
						}
					]
				},
				{
					title: `Cookies и локальное хранилище`,
					blocks: [
						{
							sub: `Что это`,
							p: [
								`Cookies и локальное хранилище — небольшие файлы и значения, сохраняемые в браузере, которые позволяют распознавать пользователя, сохранять настройки и улучшать производительность.`
							]
						},
						{
							sub: `Использование на Сайте`,
							li: [
								`необходимые и функциональные — вход в систему, язык интерфейса, сохранение черновика заявки на слушание и настройки;`,
								`аналитические — Google Analytics, общий ресурс сайтов сети (сайты различаются по доменному имени);`,
								`сторонние — Google (вход) и YouTube (при просмотре встроенного видео).`
							]
						},
						{
							sub: `Управление`,
							p: [
								`Cookies можно удалить или заблокировать в настройках браузера. Блокировка может нарушить работу Сайта, например вход в систему и сохранение черновиков.`
							]
						}
					]
				},
				{
					title: `Безопасность и хранение данных`,
					blocks: [
						{
							p: [
								`Сайт принимает разумные и общепринятые меры безопасности, включая шифрование передачи данных и контроль доступа. Ссылки для подключения к комнатам слушаний хранятся в зашифрованном виде и передаются только сторонам дела и бейт-дину. Абсолютную безопасность гарантировать невозможно. В случае утечки данных Сайт примет меры для ограничения ущерба, уведомит пострадавших и будет действовать в соответствии с законом.`,
								`Данные хранятся для работы Сайта, ведения разбирательств, соблюдения закона и юридической защиты.`
							]
						}
					]
				},
				{
					title: `Передача данных за границу`,
					blocks: [
						{
							p: [
								`Некоторые поставщики услуг (например, Google и хостинг-провайдеры) могут хранить данные на серверах за пределами Израиля. Такая передача осуществляется с соблюдением общепринятых мер защиты и требований закона.`
							]
						}
					]
				},
				{
					title: `Права пользователя`,
					blocks: [
						{
							p: [
								`В соответствии с Законом о защите частной жизни каждый вправе знакомиться с хранящимися о нём данными, требовать их исправления, удаления или ограничения использования, а также отозвать согласие на рассылки. Удаление регулируется разделом «Запись слушаний и протоколы» в части документации разбирательств. Для реализации прав обращайтесь по электронной почте.`
							]
						}
					]
				},
				{
					title: `Несовершеннолетние`,
					blocks: [
						{
							p: [
								`Сайт и услуги бейт-дина не предназначены для несовершеннолетних, и мы сознательно не собираем сведения о них. Если такие сведения были предоставлены, родитель вправе потребовать их удаления.`
							]
						}
					]
				},
				{
					title: `Изменения политики`,
					blocks: [
						{
							p: [
								`Операторы Сайта вправе обновлять настоящую политику. Существенные изменения публикуются на Сайте. Продолжение использования Сайта означает согласие с обновлённой политикой.`
							]
						}
					]
				},
				{
					title: `Контакты`,
					blocks: [{ p: [`По любым вопросам или просьбам, связанным с политикой:`] }],
					contact: true
				}
			]
		},

		// ---------------------------------------------------- Правила арбитража
		arbitration: {
			label: `Правила арбитража`,
			title: `Правила арбитража — Хахмей а-Эда`,
			sections: [
				{
					title: `Общие положения и применение`,
					blocks: [
						{
							p: [
								`Настоящие правила устанавливают порядок разбирательства в бейт-дине «Хахмей а-Эда — Дома примирения» («бейт-дин»). Они применяются ко всем, кто подаёт заявку на слушание, приглашён присоединиться к разбирательству или участвует в слушании, и являются неотъемлемой частью Условий использования. Подписание письменного согласия на принятие решения означает принятие настоящих правил.`
							]
						}
					]
				},
				{
					title: `Принципы разбирательства`,
					blocks: [
						{
							li: [
								`Разбирательство проводится только с согласия всех сторон.`,
								`Бейт-дин действует по закону Торы, стремясь привести стороны к примирению и миру.`,
								`Даяны — добровольцы, слушание проходит без судебных сборов и издержек.`,
								`Разбирательство не требует представительства адвоката.`
							]
						}
					]
				},
				{
					title: `Открытие дела`,
					blocks: [
						{
							p: [
								`Дело открывается подачей на Сайте заявки на слушание, в которой указываются данные истца и ответчика, предмет дела, описание требований и предлагаемая дата. Противоположная сторона приглашается присоединиться к разбирательству, войти на Сайт и подписать Этический кодекс и письменное согласие на принятие решения, прежде чем сможет подтвердить дату слушания.`,
								`Слушание назначается после одобрения бейт-дина. Бейт-дин вправе отказаться рассматривать дело, в том числе из-за отсутствия компетенции или неподходящего характера дела.`
							]
						}
					]
				},
				{
					title: `Письменное согласие на принятие решения — подписание до слушания`,
					blocks: [
						{
							p: [`Перед каждым слушанием каждая сторона подписывает на Сайте письменное согласие на принятие решения («письменное согласие»). В письменном согласии сторона:`],
							li: [
								`соглашается, что спор будет разрешён бейт-дином по закону Торы, и обязуется подчиниться решению;`,
								`принимает этический кодекс UECC и семь заповедей сыновей Ноаха как условие проведения слушания;`,
								`принимает Правила арбитража, включая запись и официальный протокол слушания.`
							]
						},
						{
							p: [
								`Письменное согласие подписывается в учётной записи каждой стороны; в нём фиксируются имя подписавшего и дата подписания. Слушание не состоится без подписи всех сторон, и бейт-дин вправе отменить дату слушания, по которому письменное согласие не подписано.`,
								`Подписание Этического кодекса и признание компетенции бейт-дина действительно и для будущих слушаний подписавшего в бейт-дине. Подписание не является признанием требований противоположной стороны и не ограничивает право выдвигать любые доводы на слушании.`
							]
						}
					]
				},
				{
					title: `Ход слушания`,
					blocks: [
						{
							li: [
								`Слушание проходит по видео — в защищённой комнате слушаний на Сайте — или очно, по решению бейт-дина.`,
								`Ссылки для подключения к комнате персональные: они передаются только сторонам дела и бейт-дину, и их нельзя передавать другим.`,
								`Стороны являются лично в назначенное время. Участие свидетеля, представителя или дополнительного участника допускается с предварительного одобрения бейт-дина.`,
								`Участники обязаны вести себя уважительно. Бейт-дин вправе прервать или отложить слушание и удалить участника, нарушающего его порядок.`
							]
						}
					]
				},
				{
					title: `Запись и официальный протокол`,
					blocks: [
						{
							li: [
								`Каждое слушание записывается и фиксируется в официальном протоколе. Стороны и участники соглашаются с этим, подписывая письменное согласие и подключаясь к слушанию; кто не согласен на запись, в слушании не участвует.`,
								`Запись и официальный протокол являются официальной документацией разбирательства.`,
								`После слушания запись и протокол предоставляются сторонам для ознакомления в личном кабинете на Сайте.`,
								`Сторона, у которой есть замечания к точности протокола, вправе в разумный срок после его получения обратиться в бейт-дин письменно. Бейт-дин рассмотрит замечание и может исправить протокол или приложить к нему замечание.`,
								`Запрещается снимать, записывать, транслировать или публиковать слушание, запись или протокол без письменного разрешения бейт-дина. Нарушение может повлечь удаление со слушания и иные меры.`,
								`Бейт-дин и стороны вправе представлять запись и протокол в суд для подтверждения решения, его принудительного исполнения или в ином связанном с ним разбирательстве.`
							]
						}
					],
					link: { label: `← Подробнее о хранении записей и доступе к ним — в Политике конфиденциальности`, tab: 'privacy' }
				},
				{
					title: `Конфиденциальность`,
					blocks: [
						{
							p: [
								`Участвовать в слушании разрешено только тем, кого пригласил или кого одобрил бейт-дин. Участники обязуются сохранять в тайне сказанное на слушании и документы дела и не раскрывать их другим, кроме как для исполнения, подтверждения и принудительного исполнения решения, для профессиональной консультации, с одобрения бейт-дина или в случаях, предусмотренных законом. Бейт-дин и сотрудники обязаны хранить конфиденциальность содержания слушания и дела, с учётом публикации решения, как указано ниже.`
							]
						}
					]
				},
				{
					title: `Решение`,
					blocks: [
						{
							p: [
								`Бейт-дин выносит письменное подписанное решение и передаёт его сторонам в личном кабинете. Стороны обязаны подчиниться решению в соответствии с письменным согласием. Можно просить суд утвердить решение как арбитражное в соответствии с Законом об арбитраже, 5728-1968, и обеспечить его исполнение.`,
								`Решения публикуются в архиве Сайта в интересах прозрачности. Бейт-дин вправе опустить или скрыть идентифицирующие данные сторон, а подписывая письменное согласие, стороны соглашаются на публикацию решения в указанном порядке.`,
								`Команда примирения может сопровождать стороны при выполнении решения и восстановлении братских отношений.`
							]
						}
					]
				},
				{
					title: `Расходы`,
					blocks: [
						{
							p: [
								`Бейт-дин не взимает судебных сборов и издержек, а даяны — добровольцы. Расходы, которые стороны несут самостоятельно, например на представительство или экспертные заключения, остаются за их счёт, если стороны не договорились или бейт-дин не решил иначе.`
							]
						}
					]
				},
				{
					title: `Ответственность`,
					blocks: [
						{
							p: [
								`Бейт-дин работает на добровольных началах и не гарантирует сроки рассмотрения или результат. Ответственность бейт-дина, даянов и операторов ограничена в той мере, в какой это допускает закон, как указано в Условиях использования.`
							]
						}
					]
				},
				{
					title: `Изменения правил`,
					blocks: [
						{
							p: [
								`Операторы Сайта вправе обновлять настоящие правила. Изменение применяется к заявкам на слушание, поданным после его публикации, и не применяется к разбирательству, начатому до этого, кроме как с согласия сторон.`
							]
						}
					]
				},
				{
					title: `Контакты`,
					blocks: [{ p: [`По любым вопросам или просьбам, связанным с правилами и разбирательством:`] }],
					contact: true
				}
			]
		},

		// ---------------------------------------------------- Доступность
		accessibility: {
			label: `Заявление о доступности`,
			title: `Заявление о доступности`,
			replyNote: `Постараемся ответить в течение 5 рабочих дней.`,
			sections: [
				{
					title: `Цель и обязательство`,
					blocks: [
						{
							p: [
								`Сайт «Хахмей а-Эда — Дома примирения» стремится сделать сайт и его услуги — включая подачу заявки на слушание и участие в слушании — доступными для всех пользователей, в том числе для людей с ограниченными возможностями. Сайт стремится соответствовать требованиям израильского стандарта 5568 (WCAG 2.1, уровень AA) и применяет адаптации для людей с нарушениями зрения, слуха, когнитивными и двигательными нарушениями.`
							]
						}
					]
				},
				{
					title: `Область применения`,
					blocks: [
						{
							p: [
								`Заявление относится к страницам Сайта, формам, личному кабинету и цифровым документам, публикуемым Сайтом. Видеокомнаты слушаний предоставляются третьей стороной (Eitanium), и их доступность зависит от неё — см. «Известные ограничения» ниже.`
							]
						}
					]
				},
				{
					title: `Принципы доступности`,
					blocks: [
						{
							li: [
								{ b: `Доступность содержимого`, t: `Тексты, изображения, видео и файлы будут адаптироваться в соответствии с общепринятыми рекомендациями по доступности.` },
								{ b: `Доступность навигации`, t: `Меню и ссылки будут понятными, последовательными и доступными с клавиатуры.` },
								{ b: `Визуальная доступность`, t: `Цвета и контрастность выбираются так, чтобы текст было удобно читать; важные тексты можно увеличивать.` },
								{ b: `Доступность для слабослышащих`, t: `Для видеоматериалов мы стремимся предоставлять субтитры или расшифровку, а для слушаний — адаптации по запросу (см. «Индивидуальные адаптации»).` },
								{ b: `Техническая доступность`, t: `Сайт стремится по возможности соответствовать общепринятым техническим стандартам (WCAG).` }
							]
						}
					]
				},
				{
					title: `Выполненные адаптации`,
					blocks: [
						{
							li: [
								`Язык страницы (lang) и направление текста (dir) обновляются в зависимости от языка интерфейса, что поддерживает программы экранного доступа`,
								`Ссылка «Перейти к основному содержимому» появляется при фокусе с клавиатуры для быстрой навигации`,
								`Кнопки, ссылки и меню снабжены описаниями aria-label`,
								`Динамические сообщения (например, об ошибках и успехе) озвучиваются программами экранного доступа с помощью aria-live`,
								`Раскрывающиеся меню имеют атрибуты aria-expanded и aria-haspopup, указывающие их состояние`,
								`Анимации сокращаются, если пользователь выбрал настройку уменьшенного движения (prefers-reduced-motion)`,
								`Декоративные изображения помечены alt="", а смысловые изображения имеют описание`,
								`Бегущая строка новостей скрыта от программ экранного доступа`,
								`Поля форм снабжены связанными подписями (label)`
							]
						}
					]
				},
				{
					title: `Известные ограничения`,
					blocks: [
						{
							li: [
								`Видеокомнаты слушаний (Eitanium) — сторонний сервис, и некоторые его функции могут быть не полностью доступны для программ экранного доступа и пользователей клавиатуры. Тот, кому нужна адаптация для слушания — например, очное слушание, расшифровка или иной канал, — может заранее обратиться в бейт-дин.`,
								`PDF-документы решений и статей могут быть не полностью доступны для программ экранного доступа.`,
								`Некоторые материалы или услуги могут быть не полностью адаптируемы по техническим причинам или из-за третьей стороны; Сайт будет указывать такие ограничения и искать альтернативы.`
							]
						}
					]
				},
				{
					title: `Индивидуальные адаптации`,
					blocks: [
						{
							p: [
								`Пользователи, которым нужны особые адаптации — на Сайте или на слушании, — могут обратиться к команде Сайта. Сайт рассмотрит разумные просьбы и постарается предложить решение в соответствии с техническими возможностями и ресурсами.`
							]
						}
					]
				},
				{
					title: `Контакты и сообщения о проблемах доступности`,
					blocks: [{ p: [`По любой проблеме или просьбе, связанной с доступностью:`] }],
					contact: true
				}
			]
		}
	}
};

const DOCS = { he, en, ru } as const;

/** המסמכים לשפה הנוכחית; שפות ללא תרגום (es / ps / de) נופלות לעברית */
export function legalDocFor(loc: string | null | undefined): LegalDoc {
	const l = (loc ?? 'he').slice(0, 2);
	return l === 'en' ? DOCS.en : l === 'ru' ? DOCS.ru : DOCS.he;
}
