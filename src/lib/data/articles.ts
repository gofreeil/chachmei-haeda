export type LocalizedString = { he: string; en: string; ru: string };

export const pickLang = (v: any, l: string): string =>
	typeof v === 'string' ? v : (v?.[l] ?? v?.he ?? '');

export interface Article {
	slug: string;
	title: LocalizedString;
	author: LocalizedString;
	date: string;
	excerpt: LocalizedString;
	body: LocalizedString;
	approvedBy: LocalizedString[]; // שמות 3 הרבנים שאישרו
	tags?: LocalizedString[]; // תגיות לאיתור (#שבטאפרים, #גיור וכו')
}

export const articles: Article[] = [
	{
		slug: 'shalom-bayit-darkhei-noam',
		title: {
			he: 'שלום בית בעידן המודרני — בין רגש לתבונה',
			en: 'Shalom Bayit in the Modern Era — Between Emotion and Reason',
			ru: 'Шалом байт в современную эпоху — между чувством и разумом'
		},
		author: {
			he: 'הרב משה לוי',
			en: 'Rabbi Moshe Levi',
			ru: 'Рав Моше Леви'
		},
		date: '2026-06-02',
		excerpt: {
			he: 'הזוגיות המודרנית ניצבת מול אתגרים שלא היו לדורות הקודמים — לחצי קריירה, רשתות חברתיות, ודאגות כלכליות. כיצד התורה מנחה לבנות בית של "דרכי נועם" בעולם רועש?',
			en: 'Modern marriage faces challenges unknown to previous generations — career pressures, social networks, and financial worries. How does the Torah guide us to build a home of "pleasant ways" in a noisy world?',
			ru: 'Современная семейная жизнь сталкивается с вызовами, неизвестными прежним поколениям — давление карьеры, социальные сети и финансовые тревоги. Как Тора наставляет нас строить дом "путей приятных" в шумном мире?'
		},
		body: {
			he: `שלום בית הוא אחד היסודות שעליהם נשען עם ישראל. חז"ל מלמדים: "מה שמו של הקדוש ברוך הוא? שלום" (שבת י ע"ב). הכלי שדרכו השכינה שורה בבית הוא השלום בין בני הזוג, ובלעדיו - אין ברכה.

==== א. שורש הזוגיות בתורה ====

הפסוק הראשון על אשה הוא: "לֹא טוֹב הֱיוֹת הָאָדָם לְבַדּוֹ אֶעֱשֶׂה לּוֹ עֵזֶר כְּנֶגְדּוֹ" (בראשית ב, יח). הביטוי "עזר כנגדו" אינו מקרי - יש בו שני קצוות: "עזר" כשמתאחדים, ו"כנגדו" כשצריך לאזן. הזוגיות אינה זהות אלא השלמה.

הרב סולוביצ'יק זצ"ל ביאר: "האשה איננה בבואה של האיש - היא הזיווג של ההשלמה". המבנה הזה אמור להוליד ענווה, הקשבה והערכה הדדית.

==== ב. שבעת היסודות לשלום בית ====

חכמי המוסר ציינו שבעה יסודות מעשיים:

1. **שיחה יומית** - לא רק "מה היה היום" אלא שיחה מהותית של 15-20 דקות.
2. **הקפדה על כבוד** - לא להעליב, גם לא בבדיחה, גם לא בכעס.
3. **שיתוף בהחלטות** - אפילו בקטנות; ההרגשה של "אנחנו" חזקה יותר מהתוצאה הטכנית.
4. **זמן איכות** - לפחות ערב אחד בשבוע פנוי לזוגיות בלבד.
5. **התפללות יחד** - לאו דווקא בבית כנסת; ברכת המזון משותפת, תפילת לילה.
6. **סליחה מהירה** - "אל יבוא השמש על מריבה" (אבות דרבי נתן).
7. **תמיכה הדדית בעת מצוקה** - האחד הוא הבית הראשון של השני.

==== ג. אתגרים מודרניים ====

הדור שלנו ניצב מול אתגרים שלא היו לקודמים:

**רשתות חברתיות** - השוואה בלתי פוסקת עם זוגות "מושלמים" באינסטגרם. ההמלצה: צמצמו חשיפה, הקפידו על "פרטיות זוגית" - לא לשתף כל דבר אונליין.

**עומס תעסוקתי** - גם הגבר וגם האשה פעמים רבות עובדים. ההמלצה: קבעו "שעת זוגיות" קבועה - אפילו 30 דקות בשבוע ללא הסחות.

**הלחץ הכלכלי** - מקור מספר אחת למחלוקות בבתים צעירים. ההמלצה: תקציב משותף בכתב, פגישת תקציב חודשית בנעימים, ושקיפות מלאה.

**הילדים** - הופכים פעמים רבות למוקד היחיד, על חשבון הזוגיות. ההמלצה: הזוגיות קודמת לילדים; "הילדים גדלים, הזוגיות נשארת".

==== ד. כיצד למנוע משבר ====

סימני אזהרה מוקדמים:
- הפסקת שיחה משמעותית
- ביקורת חוזרת ונשנית
- ביטוי בוז (גלגול עיניים, לעג)
- התנהגות חמקמקה - הסתרת מידע "כדי שלא יכעס/תכעס"

כל אחד מאלה מצדיק התייעצות מוקדמת. עדיף לבוא לרב או לטיפול זוגי כשעדיין יש אהבה, מאשר כשכבר אין כוח.

==== ה. כשמשבר כבר פרץ ====

אם המשבר התעצם:

1. **קח אחריות** - אל תאשים. שאל "מה אני יכול לתקן?", לא "מה היא עשתה?".
2. **דבר עם רב מנוסה** - חכמי העדה מציעים פגישות ייעוץ דיסקרטיות.
3. **טיפול זוגי** - מומלץ אצל מטפל דתי. אם אין - חילוני שמכבד את עולם הערכים שלכם.
4. **התפלל** - יום אחד בשבוע צום קטן ותפילה מיוחדת על שלום הבית.
5. **התרחק מגירושין כברירת מחדל** - הגירושין הופכים את הכל, גם לטוב, אבל פעמים רבות לרעה (במיוחד עם ילדים).

==== ו. צוות "משכין שלום" של חכמי העדה ====

אצלנו פועל צוות "משכין שלום" - רבנים ויועצים זוגיים המלווים זוגות בכל שלב: מהיכרות והכנה לחתונה, דרך עזרה בשנים הראשונות, ועד טיפול במשברים חמורים. השירות חינמי לזוגות שאינם יכולים לשלם.

המוטו שלנו: "כל זוג שמצליחים להציל הוא משפחה שהצלנו". לפעמים גירושין הם הכרח (במקרה של אלימות, בגידה חוזרת או אי-יכולת אמיתית לחיות יחד) - אבל ברוב המקרים, עם ליווי נכון, ניתן להחזיר את האהבה והקרבה.

==== סיכום ====

שלום בית אינו מתנה שניתנת - הוא הישג שמושג בעבודה יומיומית. כל יום שאתם בוחרים בזוגיות שלכם מחדש, מעל לעייפות וההסחות - זו בחירה רוחנית גדולה.

חכמי העדה כאן בשבילכם. אל תהססו לפנות.`,
			en: `Shalom Bayit (marital harmony) is one of the foundations on which the Jewish people stand. Our Sages teach: "What is the Name of the Holy One, blessed be He? Peace" (Shabbat 10b). The vessel through which the Shechinah dwells in the home is peace between husband and wife — without it, there is no blessing.

==== A. The Root of Marriage in the Torah ====

The first verse about woman states: "It is not good for man to be alone; I will make him a helper corresponding to him" (Genesis 2:18). The phrase "helper corresponding to him" is not accidental — it contains two poles: "helper" when united, and "corresponding" (literally, "opposite") when balance is needed. Marriage is not identity but completion.

Rabbi Soloveitchik zt"l explained: "The woman is not a reflection of the man — she is the partner of completion." This structure should give rise to humility, listening, and mutual appreciation.

==== B. The Seven Foundations of Shalom Bayit ====

Our teachers of ethics identified seven practical foundations:

1. **Daily conversation** — not just "how was your day?" but a substantive 15-20 minute talk.
2. **Honoring each other** — never insulting, not even as a joke, not even in anger.
3. **Sharing decisions** — even small ones; the feeling of "we" is stronger than any technical outcome.
4. **Quality time** — at least one evening a week devoted exclusively to the marriage.
5. **Praying together** — not necessarily in the synagogue; saying Birkat HaMazon together, night prayers.
6. **Quick forgiveness** — "Let the sun not set on a quarrel" (Avot d'Rabbi Natan).
7. **Mutual support in distress** — each is the other's first home.

==== C. Modern Challenges ====

Our generation faces challenges previous ones did not:

**Social networks** — endless comparison with "perfect" couples on Instagram. Recommendation: reduce exposure, maintain "marital privacy" — do not share everything online.

**Work overload** — often both husband and wife work. Recommendation: set a fixed "couple's hour" — even 30 minutes a week with no distractions.

**Financial pressure** — the number-one source of disputes in young homes. Recommendation: a written joint budget, a pleasant monthly budget meeting, and full transparency.

**The children** — often become the sole focus, at the expense of the marriage. Recommendation: the marriage comes before the children; "the children grow up, the marriage remains."

==== D. How to Prevent a Crisis ====

Early warning signs:
- Cessation of meaningful conversation
- Repeated criticism
- Expressions of contempt (eye-rolling, mockery)
- Evasive behavior — hiding information "so he/she won't get angry"

Each of these justifies early consultation. Better to come to a rabbi or marriage therapy while love still exists, than when there is no strength left.

==== E. When a Crisis Has Already Erupted ====

If the crisis has escalated:

1. **Take responsibility** — do not blame. Ask "What can I fix?", not "What did she do?".
2. **Speak with an experienced rabbi** — Chachmei Ha'Eda offers discreet consultation sessions.
3. **Couples therapy** — preferably with a religious therapist. If unavailable — a secular one who respects your value system.
4. **Pray** — one day a week, a small fast and a special prayer for the peace of the home.
5. **Avoid divorce as a default** — divorce changes everything, sometimes for good, but often for the worse (especially with children).

==== F. The "Mashkin Shalom" Team of Chachmei Ha'Eda ====

We operate a "Mashkin Shalom" team — rabbis and marriage counselors who accompany couples at every stage: from courtship and wedding preparation, through help in the early years, to handling severe crises. The service is free for couples who cannot afford to pay.

Our motto: "Every couple we manage to save is a family we have saved." Sometimes divorce is necessary (in cases of violence, repeated infidelity, or true inability to live together) — but in most cases, with proper guidance, love and closeness can be restored.

==== Summary ====

Shalom Bayit is not a gift that is given — it is an achievement won through daily work. Every day you choose your marriage anew, above the fatigue and distractions — that is a great spiritual choice.

Chachmei Ha'Eda is here for you. Do not hesitate to reach out.`,
			ru: `Шалом байт (мир в семье) — одна из основ, на которых стоит народ Израиля. Мудрецы учат: "Каково Имя Святого, благословен Он? Мир" (Шаббат 10б). Сосуд, через который Шхина пребывает в доме, — это мир между супругами, и без него нет благословения.

==== А. Корень супружества в Торе ====

Первый стих о женщине гласит: "Нехорошо быть человеку одному; сделаю ему помощника, соответственного ему" (Берешит 2:18). Выражение "помощник, соответственный ему" не случайно — в нём два полюса: "помощник", когда они едины, и "напротив него", когда требуется равновесие. Супружество — это не тождество, а взаимодополнение.

Рав Соловейчик зацаль объяснял: "Жена — не отражение мужа, она пара взаимодополнения". Эта структура должна порождать смирение, умение слушать и взаимное уважение.

==== Б. Семь основ шалом байт ====

Учителя мусара выделили семь практических основ:

1. **Ежедневная беседа** — не просто "как прошёл день?", а содержательный разговор 15-20 минут.
2. **Уважение друг к другу** — не оскорблять, даже в шутку, даже в гневе.
3. **Совместные решения** — даже в мелочах; ощущение "мы" сильнее любого технического результата.
4. **Качественное время** — хотя бы один вечер в неделю посвящён только супружеству.
5. **Совместная молитва** — не обязательно в синагоге; совместное Биркат а-мазон, вечерняя молитва.
6. **Быстрое прощение** — "Пусть солнце не зайдёт над ссорой" (Авот де-рабби Натан).
7. **Взаимная поддержка в беде** — каждый — первый дом другого.

==== В. Современные вызовы ====

Наше поколение сталкивается с вызовами, которых не было прежде:

**Социальные сети** — бесконечное сравнение с "идеальными" парами в Инстаграм. Рекомендация: уменьшите присутствие, соблюдайте "супружескую приватность" — не делитесь всем онлайн.

**Перегрузка на работе** — часто работают и муж, и жена. Рекомендация: установите постоянный "час супружества" — хотя бы 30 минут в неделю без отвлечений.

**Финансовое давление** — источник номер один споров в молодых семьях. Рекомендация: совместный письменный бюджет, ежемесячная спокойная встреча по бюджету и полная прозрачность.

**Дети** — часто становятся единственным фокусом за счёт супружества. Рекомендация: супружество предшествует детям; "дети вырастают, супружество остаётся".

==== Г. Как предотвратить кризис ====

Ранние тревожные признаки:
- Прекращение содержательного разговора
- Повторяющаяся критика
- Проявления презрения (закатывание глаз, насмешки)
- Скрытное поведение — утаивание информации, "чтобы он/она не разозлился"

Каждый из этих признаков оправдывает раннюю консультацию. Лучше прийти к раввину или на семейную терапию, пока ещё есть любовь, чем когда сил уже нет.

==== Д. Когда кризис уже разразился ====

Если кризис углубился:

1. **Возьмите ответственность** — не обвиняйте. Спросите: "Что я могу исправить?", а не "Что она сделала?".
2. **Поговорите с опытным раввином** — Хахмей а-Эда предлагает конфиденциальные консультации.
3. **Семейная терапия** — желательно у религиозного терапевта. Если нет — у светского, уважающего вашу систему ценностей.
4. **Молитесь** — один день в неделю — небольшой пост и особая молитва о мире в доме.
5. **Избегайте развода как умолчания** — развод меняет всё, иногда к лучшему, но часто к худшему (особенно с детьми).

==== Е. Команда "Машкин шалом" Хахмей а-Эда ====

У нас действует команда "Машкин шалом" — раввины и семейные консультанты, сопровождающие пары на всех этапах: от знакомства и подготовки к свадьбе, через помощь в первые годы, до работы с тяжёлыми кризисами. Услуга бесплатна для пар, которые не могут оплатить.

Наш девиз: "Каждая пара, которую удалось спасти, — это семья, которую мы спасли". Иногда развод необходим (в случаях насилия, повторных измен или подлинной невозможности жить вместе) — но в большинстве случаев при правильном сопровождении можно вернуть любовь и близость.

==== Итог ====

Шалом байт — это не подарок, а достижение, которое завоёвывается ежедневным трудом. Каждый день, когда вы заново выбираете своё супружество вопреки усталости и отвлечениям, — это великий духовный выбор.

Хахмей а-Эда — с вами. Не стесняйтесь обращаться.`
		},
		approvedBy: [
			{ he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' },
			{ he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
			{ he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' }
		],
		tags: [
			{ he: 'שלום בית', en: 'Shalom Bayit', ru: 'Шалом байт' },
			{ he: 'זוגיות', en: 'Marriage', ru: 'Супружество' },
			{ he: 'משפחה', en: 'Family', ru: 'Семья' },
			{ he: 'משכין שלום', en: 'Mashkin Shalom', ru: 'Машкин шалом' },
			{ he: 'גישור', en: 'Mediation', ru: 'Медиация' }
		]
	},
	{
		slug: 'kibud-horim-be-iddan-modern',
		title: {
			he: 'כיבוד הורים בעידן המודרני — חובות וגבולות',
			en: 'Honoring Parents in the Modern Era — Duties and Boundaries',
			ru: 'Почитание родителей в современную эпоху — обязанности и границы'
		},
		author: {
			he: 'הרב יוסף כהן',
			en: 'Rabbi Yosef Cohen',
			ru: 'Рав Йосеф Коэн'
		},
		date: '2026-05-17',
		excerpt: {
			he: 'מצוות כיבוד אב ואם היא אחת מעשרת הדיברות, ובכל זאת מעלת הקיום שלה מורכבת במציאות שבה ההורים חיים יותר שנים, פעמים רבות במרחק גיאוגרפי גדול, ועם אתגרים בריאותיים מתמשכים.',
			en: 'The mitzvah of honoring father and mother is one of the Ten Commandments, yet fulfilling it is complex in a reality where parents live longer years, often at great geographic distance, and with ongoing health challenges.',
			ru: 'Заповедь почитания отца и матери — одна из десяти заповедей, и всё же её исполнение усложняется в реальности, где родители живут дольше, часто на большом географическом расстоянии и с длительными проблемами со здоровьем.'
		},
		body: {
			he: `מצוות כיבוד אב ואם נמנית בעשרת הדיברות (שמות כ, יב), ומקבילה במשקלה לכיבוד הבורא עצמו. חז"ל הסיקו: "שלושה שותפים יש באדם: הקדוש ברוך הוא, אביו ואמו" (קידושין ל ע"ב). זה אומר שהיחס להורים הוא חלק מהיחס לקדוש ברוך הוא.

==== א. ההבדל בין "כיבוד" ל"מורא" ====

ההלכה מפרידה בין שני מושגים:

**כיבוד** - מעשי שירות חיוביים: להאכיל, להלביש, להוציא ולהכניס. הרמב"ם (הלכות ממרים ו, ג): "איזהו כיבוד? מאכילו ומשקהו, מלביש ומכסה, מוציא ומכניס".

**מורא** - הימנעות ממעשי זלזול: לא לסתור דבריו, לא לישב במקומו, לא לקרוא לו בשמו. "איזהו מורא? לא עומד במקומו, ולא יושב במקומו, ולא סותר את דבריו, ולא מכריעו".

שני המושגים יחד יוצרים את הגישה הכוללת להורים.

==== ב. מי משלם? ====

שאלה הלכתית מעניינת: כיבוד הורים מחייב אותך לשלם מכספך, או רק להשקיע זמן וכוח?

הגמרא (קידושין לא ע"ב) דנה ופוסקת: "כיבוד הוא משל אב, ומורא הוא משלו". כלומר, אם להורה יש מהיכן לכלכל את עצמו - אינך חייב להוציא כסף; אבל חייב להשקיע זמן וכוח. אם להורה אין - חובה עליך לכלכלו, גם אם זה דורש עזרה כלכלית משמעותית.

הרמ"א מוסיף: "מצוה גדולה היא לפרנס את אביו אם אין לו". יש כאן רובד נוסף: לא רק חובה, אלא מצווה גדולה.

==== ג. מתי מותר לסרב? ====

יש מקרים שבהם מותר ואף חובה לסרב להוראת ההורה:

1. **כשההורה מצווה לעבור על איסור** - "אני ועצומי מצווין על כיבוד אבי, אבל אם אמר לי 'עבור על דברי תורה' - לא אשמע לו" (יבמות ו ע"א).

2. **כשההוראה גורמת נזק לזולת** - הורה אינו רשאי לחייב אותך לפגוע באחר.

3. **כשמדובר בהחלטות אישיות בסיסיות** - בחירת בן/בת זוג, מקצוע, מקום מגורים. ההורה רשאי לייעץ אבל לא לכפות. הרמ"א (יו"ד רמ): "אם רוצה הבן לישא אשה הראויה לו, אין האב יכול לעכבו".

==== ד. כיבוד הורים מרחוק ====

בעידן המודרני, פעמים רבות הילדים גרים רחוק מההורים - אפילו בארץ אחרת. איך מקיימים כיבוד מרחוק?

1. **טלפון יומי או שבועי קבוע** - אפילו שיחה של עשר דקות יוצרת קשר משמעותי.
2. **ביקור פיזי תקופתי** - לפחות פעמיים בשנה, אם אפשרי.
3. **תמיכה כלכלית** - אם נדרשת, באמצעות העברה בנקאית קבועה.
4. **טכנולוגיה לעזר** - וידאו-קונפרנס בחגים, סבא וסבתא רואים נכדים.
5. **ארגון עזרה מקומית** - אם ההורה זקוק לסיעוד והבן רחוק, חובה לארגן מטפל/ת.

==== ה. כשההורה הופך לתלוי ====

עידן הזקנה הארוכה (תוחלת חיים גבוהה) יצר אתגר חדש: הורים שחיים עד 90 ויותר, אך מתפקודית תלויים בבן/בת.

עקרונות לטיפול נכון:

**טיפוח כבוד גם בתלות** - אל תנהג בהורה כילד. גם כשמטפל פיזית, השפה והגישה צריכות להישאר של "אב/אם".

**הסתפקות במציאות** - אם ההורה סובל מדמנציה ואינו מזהה - המצווה לא בטלה. גם להניק זקן הלוקה בתודעתו - זו מצווה.

**אחריות מחולקת בין אחים** - אסור שאח אחד יישא בכל הנטל. חלוקה הוגנת היא מצווה גם של "אחים שותפים". אם יש פערים יכולתיים - להסדיר באופן הוגן.

**עזרה מקצועית** - אין מצווה להרוס את חייך לטובת ההורה. אם נדרש סייעת מקצועית או דיור מוגן - אלה אופציות לגיטימיות, ובלבד שמלווים בקשר תכוף.

==== ו. הקשר עם הורים בעייתיים ====

מה אם ההורה היה רע אליך? לא תפקד? אלים? פגע?

ההלכה מורכבת כאן. עיקרי הגישה:

1. **חובת הכיבוד נשארת** - גם אם ההורה לא תפקד. "אבי ואמי עזבוני וה' יאספני" (תהילים).
2. **אבל ניתן להגדיר גבולות** - אינך חייב להישאר במקום שפוגעים בך. ניתן לכבד מרחוק.
3. **טיפול בצלקות** - מומלץ ליווי טיפולי כדי לא לחזור על דפוסים פוגעניים.
4. **מחילה אינה חובה** - בניגוד למיתוס, אינך חייב לסלוח. אבל כדאי לעבד את הפגיעה כדי שלא תכביד עליך.

==== סיכום ====

כיבוד אב ואם הוא אחת המצוות העמוקות ביותר. כשמקיימים אותה כראוי - היא מטהרת את הנפש, מחזקת את ההמשכיות בעם, ופותחת ערוצי שפע.

חכמי העדה תמיד כאן לייעוץ במקרים מורכבים, כולל מצבי דמנציה, סכסוכי ירושה במשפחה, ועזרה משפטית לזכויות הורים זקנים.`,
			en: `The mitzvah of honoring father and mother is counted among the Ten Commandments (Exodus 20:12), and is equated in weight with honoring the Creator Himself. Our Sages concluded: "There are three partners in a person: the Holy One blessed be He, his father, and his mother" (Kiddushin 30b). This means our relationship with our parents is part of our relationship with the Holy One.

==== A. The Difference Between "Kibud" and "Mora" ====

Halacha distinguishes between two concepts:

**Kibud (honor)** — positive acts of service: feeding, clothing, helping them in and out. Rambam (Hilchot Mamrim 6:3): "What is honor? Feeding and giving them drink, clothing and covering them, helping them in and out."

**Mora (reverence)** — avoiding acts of disrespect: not contradicting them, not sitting in their place, not calling them by their first name. "What is reverence? Not standing in his place, not sitting in his place, not contradicting his words, not overruling him."

The two concepts together form the complete approach to parents.

==== B. Who Pays? ====

An interesting halachic question: does honoring parents require you to pay from your own money, or only to invest time and effort?

The Gemara (Kiddushin 31b) discusses and rules: "Honor is from the father's, and reverence is from his own." That is, if the parent has means of self-support — you are not obligated to spend money; but you are obligated to invest time and effort. If the parent has nothing — you are obligated to support them, even if this requires significant financial help.

The Rama adds: "It is a great mitzvah to support one's father if he has nothing." There is an added layer here: not only an obligation, but a great mitzvah.

==== C. When Is It Permitted to Refuse? ====

There are cases where it is permitted, and even required, to refuse a parent's instruction:

1. **When the parent commands transgression of a prohibition** — "I and my household are commanded to honor my father, but if he tells me 'transgress the words of Torah' — I shall not listen to him" (Yevamot 6a).

2. **When the instruction causes harm to others** — a parent has no right to compel you to harm another.

3. **When it concerns basic personal decisions** — choice of spouse, profession, place of residence. The parent may advise but not coerce. The Rama (Yoreh Deah 240): "If the son wishes to marry a woman suitable for him, the father cannot prevent him."

==== D. Honoring Parents from a Distance ====

In the modern era, children often live far from their parents — even in another country. How does one fulfill the mitzvah from a distance?

1. **A regular daily or weekly phone call** — even a ten-minute conversation creates meaningful connection.
2. **Periodic physical visits** — at least twice a year, if possible.
3. **Financial support** — if needed, through regular bank transfers.
4. **Technology as a helper** — video conferences on holidays, grandparents seeing grandchildren.
5. **Arranging local help** — if the parent needs care and the son is far away, it is an obligation to arrange a caregiver.

==== E. When the Parent Becomes Dependent ====

The era of long old age (high life expectancy) has created a new challenge: parents who live to 90 and beyond, but become functionally dependent on a son or daughter.

Principles for proper care:

**Cultivating respect even in dependence** — do not treat the parent as a child. Even when caring for them physically, language and approach must remain those of "father/mother."

**Acceptance of reality** — if the parent suffers from dementia and does not recognize you — the mitzvah is not nullified. Even nursing an elder afflicted in mind is a mitzvah.

**Responsibility shared among siblings** — one sibling must not bear the entire burden. A fair division is also a mitzvah of "partner siblings." Where there are differences in capacity — to settle this fairly.

**Professional help** — there is no mitzvah to ruin your own life for the parent. If a professional caregiver or assisted living is required — these are legitimate options, provided they are accompanied by frequent contact.

==== F. The Relationship with Problematic Parents ====

What if the parent was bad to you? Did not function? Was violent? Hurt you?

Halacha here is complex. The main principles:

1. **The obligation of honor remains** — even if the parent did not function. "My father and mother have forsaken me, but the Lord will gather me in" (Psalms).
2. **But boundaries may be set** — you are not required to remain where you are harmed. You can honor from a distance.
3. **Healing the scars** — therapeutic accompaniment is recommended to avoid repeating harmful patterns.
4. **Forgiveness is not obligatory** — contrary to myth, you are not required to forgive. But it is worthwhile to process the hurt so it does not weigh on you.

==== Summary ====

Honoring father and mother is one of the deepest mitzvot. When fulfilled properly — it purifies the soul, strengthens continuity within the people, and opens channels of abundance.

Chachmei Ha'Eda is always here for counsel in complex cases, including situations of dementia, family inheritance disputes, and legal assistance for the rights of elderly parents.`,
			ru: `Заповедь почитания отца и матери входит в десять заповедей (Шмот 20:12) и по весу приравнивается к почитанию Самого Творца. Мудрецы заключили: "У человека три партнёра: Святой, благословен Он, его отец и его мать" (Кидушин 30б). Это означает, что отношение к родителям — часть отношения к Святому, благословен Он.

==== А. Различие между "кибуд" и "мора" ====

Галаха разделяет два понятия:

**Кибуд (почитание)** — положительные действия служения: накормить, одеть, ввести и вывести. Рамбам (Илхот мамрим 6:3): "Что такое почитание? Кормит и поит, одевает и покрывает, вводит и выводит".

**Мора (трепет)** — избегание действий пренебрежения: не противоречить им, не сидеть на их месте, не называть их по имени. "Что такое трепет? Не стоять на его месте, не сидеть на его месте, не противоречить его словам, не отменять его решения".

Оба понятия вместе образуют целостный подход к родителям.

==== Б. Кто платит? ====

Интересный галахический вопрос: обязывает ли почитание родителей платить из своих денег или только тратить время и силы?

Гемара (Кидушин 31б) обсуждает и постановляет: "Почитание — из имущества отца, а трепет — из своего". То есть если у родителя есть средства к существованию — вы не обязаны тратить деньги; но обязаны тратить время и силы. Если у родителя нет — вы обязаны содержать его, даже если это требует значительной финансовой помощи.

Рама добавляет: "Великая заповедь — содержать отца, если у него нет". Здесь есть дополнительный слой: не просто обязанность, а великая заповедь.

==== В. Когда можно отказать? ====

Есть случаи, когда разрешено и даже обязательно отказать в указании родителя:

1. **Когда родитель велит нарушить запрет** — "Я и мои близкие обязаны почитать отца, но если он скажет мне 'нарушь слова Торы' — я не послушаю его" (Йевамот 6а).

2. **Когда указание причиняет вред другому** — родитель не вправе обязывать вас причинять вред другому.

3. **Когда речь о базовых личных решениях** — выбор супруга/супруги, профессии, места жительства. Родитель вправе советовать, но не принуждать. Рама (Йоре Деа 240): "Если сын хочет жениться на женщине, ему подходящей, отец не вправе ему препятствовать".

==== Г. Почитание родителей издалека ====

В современную эпоху дети часто живут далеко от родителей — даже в другой стране. Как исполнять заповедь издалека?

1. **Регулярный ежедневный или еженедельный звонок** — даже десятиминутный разговор создаёт значимую связь.
2. **Периодические физические визиты** — хотя бы дважды в год, если возможно.
3. **Финансовая поддержка** — если требуется, через регулярные банковские переводы.
4. **Технология в помощь** — видеосвязь на праздники, дедушка и бабушка видят внуков.
5. **Организация местной помощи** — если родитель нуждается в уходе, а сын далеко, — обязанность организовать сиделку.

==== Д. Когда родитель становится зависимым ====

Эпоха долгой старости (высокая продолжительность жизни) создала новый вызов: родители, живущие до 90 и более, но функционально зависимые от сына или дочери.

Принципы правильного ухода:

**Сохранение уважения даже при зависимости** — не относитесь к родителю как к ребёнку. Даже при физическом уходе язык и подход должны оставаться "отец/мать".

**Принятие реальности** — если родитель страдает деменцией и не узнаёт — заповедь не отменена. Даже кормить старика, помрачённого рассудком, — это заповедь.

**Ответственность, разделённая между братьями и сёстрами** — нельзя, чтобы один нёс всё бремя. Справедливое распределение — тоже заповедь "братьев-партнёров". При различии возможностей — урегулировать справедливо.

**Профессиональная помощь** — нет заповеди разрушать свою жизнь ради родителя. Если требуется профессиональная сиделка или дом престарелых — это законные варианты при условии частого общения.

==== Е. Отношения с проблемными родителями ====

Что если родитель был плох к вам? Не справился? Был жесток? Ранил?

Галаха здесь сложна. Основные принципы:

1. **Обязанность почитания остаётся** — даже если родитель не справился. "Отец и мать оставили меня, но Г-сподь примет меня" (Псалмы).
2. **Но можно установить границы** — вы не обязаны оставаться там, где вам причиняют вред. Можно почитать издалека.
3. **Работа со шрамами** — рекомендуется терапевтическое сопровождение, чтобы не повторять травмирующих моделей.
4. **Прощение не обязательно** — вопреки мифу, вы не обязаны прощать. Но стоит проработать обиду, чтобы она не давила на вас.

==== Итог ====

Почитание отца и матери — одна из глубочайших заповедей. Когда её исполняют должным образом, она очищает душу, укрепляет преемственность народа и открывает каналы изобилия.

Хахмей а-Эда всегда готовы консультировать в сложных случаях, включая ситуации деменции, семейные споры о наследстве и юридическую помощь по правам пожилых родителей.`
		},
		approvedBy: [
			{ he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
			{ he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' },
			{ he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' }
		],
		tags: [
			{ he: 'כיבוד הורים', en: 'Honoring Parents', ru: 'Почитание родителей' },
			{ he: 'מורא הורים', en: 'Reverence for Parents', ru: 'Трепет перед родителями' },
			{ he: 'משפחה', en: 'Family', ru: 'Семья' },
			{ he: 'זקנה', en: 'Old Age', ru: 'Старость' },
			{ he: 'דורות', en: 'Generations', ru: 'Поколения' }
		]
	},
	{
		slug: 'tzniut-be-iddan-digitali',
		title: {
			he: 'צניעות בעידן הדיגיטלי — מסכים, רשתות, וזהות',
			en: 'Tzniut in the Digital Era — Screens, Networks, and Identity',
			ru: 'Цниют в цифровую эпоху — экраны, сети и идентичность'
		},
		author: {
			he: 'הרב אהרן ישראלי',
			en: 'Rabbi Aharon Yisraeli',
			ru: 'Рав Аарон Исраэли'
		},
		date: '2026-04-08',
		excerpt: {
			he: 'מושג הצניעות, שעוצב לפני אלפי שנים, מתייצב מול אתגרים בלתי-נתפסים: חשיפה ברשתות חברתיות, "מותגים אישיים", סלפי וזליגה דיגיטלית. כיצד שומרים על "צנע לכת" בעולם השקוף?',
			en: 'The concept of tzniut (modesty), shaped thousands of years ago, faces unimaginable challenges: exposure on social networks, "personal brands," selfies, and digital leakage. How do we preserve "walking humbly" in a transparent world?',
			ru: 'Понятие цниют (скромности), сформированное тысячи лет назад, сталкивается с невообразимыми вызовами: открытость в социальных сетях, "личные бренды", селфи и цифровая утечка. Как сохранить "ходить смиренно" в прозрачном мире?'
		},
		body: {
			he: `המילה "צניעות" מקבילה במהותה למילה "כבוד פנימי". חז"ל לימדו: "כל כבודה בת מלך פנימה" (תהילים מה, יד) - הכבוד האמתי הוא פנימי, לא תצוגה חיצונית. אבל מה קורה כשכל החיים שלנו חשופים ברשת?

==== א. הגדרת צניעות בתורה ====

הצניעות בתורה אינה רק לבוש. היא גישה כללית לחיים: "הצנע לכת עם אלוקיך" (מיכה ו, ח). חז"ל מנו ארבעה מימדים:

1. **צניעות בלבוש** - הימנעות מבגדים פרובוקטיביים.
2. **צניעות בדיבור** - הימנעות מניבול פה ומדיבור מופרז על עצמי.
3. **צניעות במעשים** - הימנעות מהפגנת מעלות לתועלת הראווה.
4. **צניעות במחשבה** - שמירת המחשבות הפנימיות לעולם הפנימי.

ארבעת המימדים הללו, יחד, יוצרים אישיות שלמה.

==== ב. הצניעות והרשתות החברתיות ====

הרשתות החברתיות בנויות על העיקרון ההפוך לצניעות: חשיפה. ככל שאתה חושף יותר - מגיב יותר - חשוף יותר - המעגל גדל.

אתגרים מרכזיים:

**סלפי וצילום עצמי** - לא רק נשים, גם גברים. הצורך לראות את עצמי כל הזמן הוא נרקיסיזם דק. עצה: צלם אנשים אחרים, מקומות, רגעים - לא את עצמך. אם כן צילום עצמי - לא יותר מפעם בחודש.

**סטטוסים אישיים** - חשיפה מיותרת של רגשות. עצה: לפני שאתה כותב משהו רגשי, שאל את עצמך: "האם אני בטוח שאני אסכים עם זה בעוד שנה?". אם לא בטוח - אל תפרסם.

**הגדרת זוגיות ברשת** - להציג את הזוגיות "פתוחה" לעיני כולם הוא הפך הצניעות. עצה: שמרו על קודש הזוגיות לעצמכם. תמונה חתונה - בסדר; פוסטים יומיים על "כמה שאני אוהב/ת אותה/אותו" - מיותרים.

**מצוות בפרסום** - לפעמים מצלמים את עצמם נותנים צדקה או מתפללים. הרמב"ם מציין שלוש דרגות בצדקה, והדרגה הגבוהה היא "הנותן ואין יודע למי נותן". פרסום מצוות מקטין את הזכות.

==== ג. צניעות הילדים ברשת ====

בעיה גדולה: הורים מפרסמים תמונות של ילדיהם בפייסבוק, אינסטגרם וכו'. מה הבעיות?

1. **חוסר הסכמה** - הילד לא יכול להסכים בגיל צעיר.
2. **רישום דיגיטלי לכל החיים** - תמונה מגיל 3 תרדוף את הילד בגיל 30.
3. **סכנה ביטחונית** - חשיפת מיקום, שגרה, מצב כלכלי - מידע יקר לעבריינים.
4. **השפעה על דימוי עצמי** - הילד גדל מתוך תפיסה שהחיים הם תצוגה.

המלצה: **אל תפרסמו תמונות של ילדיכם ברשתות פתוחות**. אם רוצים לשתף משפחה רחוקה - השתמשו ב-WhatsApp פרטי או באלבום משפחתי מוצפן.

==== ד. צניעות בעבודה הדיגיטלית ====

אנשי עסקים, פרילנסרים ועצמאים נדרשים פעמים רבות ל"מותג אישי" - להיות נוכחים ברשת כדי להרוויח לקוחות.

האם זה הפך הצניעות? לא בהכרח. הקריטריון:

**מותג של מעלות מקצועיות** - מותר ומומלץ. הצגת ידע, פתרונות, ניסיון מקצועי.

**מותג של חיים פרטיים** - בעייתי. אנשים שמשתמשים בילדיהם, בני זוגם או בחייהם הפרטיים כדי להמכר.

הכלל: אם הפרסום הוא **על הערך שאתה מספק**, זה בסדר. אם הפרסום הוא **על מי שאתה** - בעייתי.

==== ה. צניעות הלבוש בעידן הזה ====

זה נושא רגיש מאוד. כמה עקרונות:

**שמרנות אינה תוקפנות** - אינך חייב לתקוף חברה שלובשת אחרת. צניעות שלך אינה היתר לאלימות עליהם.

**גמישות בסיטואציות** - חכמינו מקלים יותר בעולם העבודה, פחות בבית הכנסת. אין "תלבושת אחידה לחיים".

**איכות ולא מקח שווא** - הצניעות אינה חתימה של עוני. אפשר ללבוש איכותי, מכובד, נשי/גברי - תוך שמירה על קודי הצניעות.

**מודרניות בעיצוב** - גם אצל החרדים בעידן הזה יש עיצובים מודרניים שמכבדים את הצניעות. אין צורך להיראות מהמאה ה-19.

==== ו. צניעות ויראת שמים ====

הצניעות העמוקה ביותר אינה אופנה אלא יראה. כשאדם פנימי - כל פרט בחייו מאיר.

חז"ל אמרו: "אין השכינה שורה אלא מתוך שמחה של מצוה" (פסחים קיז ע"א). וגם: "אין השכינה שורה אלא במקום צנוע". שני התנאים יחד - שמחה מהמצוות + צניעות - הופכים את האדם לבית המקדש הפרטי שלו.

==== סיכום ====

הצניעות בעידן הדיגיטלי דורשת מאיתנו יותר מצניעות בכל דור קודם. כי לא רק שצריך לשמור על עצמנו - גם צריך לשמור על המכשירים והרשתות מליטול מאיתנו את הצניעות.

המלצה מעשית: **יום אחד בשבוע ללא רשתות חברתיות**. רוב הצדיקים שמרו על שבת ללא מסכים. נסו את זה. השינוי בנפש מורגש כבר אחרי חודש.

חכמי העדה מציעים סדנאות "צניעות דיגיטלית" לזוגות צעירים ולמשפחות. צרו קשר אם זה מעניין אתכם.`,
			en: `The word "tzniut" (modesty) is essentially parallel to "inner dignity." Our Sages taught: "All the glory of the king's daughter is within" (Psalms 45:14) — true honor is internal, not external display. But what happens when our entire life is exposed online?

==== A. Defining Tzniut in the Torah ====

Tzniut in the Torah is not only clothing. It is a comprehensive approach to life: "Walk humbly with your God" (Micah 6:8). Our Sages identified four dimensions:

1. **Modesty in dress** — refraining from provocative clothing.
2. **Modesty in speech** — refraining from foul language and excessive talk about oneself.
3. **Modesty in deeds** — refraining from displaying virtues for show.
4. **Modesty in thought** — keeping inner thoughts in the inner world.

These four dimensions, together, create a whole personality.

==== B. Tzniut and Social Networks ====

Social networks are built on the opposite principle to tzniut: exposure. The more you expose — the more engagement — the more exposure — the cycle grows.

Central challenges:

**Selfies and self-photography** — not only women, also men. The need to see oneself all the time is a thin form of narcissism. Advice: photograph other people, places, moments — not yourself. If self-photography — no more than once a month.

**Personal status updates** — unnecessary exposure of emotion. Advice: before writing something emotional, ask yourself: "Am I sure I will agree with this in a year?" If not sure — do not post.

**Defining a relationship online** — presenting a relationship as "open" to all eyes is the opposite of tzniut. Advice: keep the sanctity of your relationship to yourselves. A wedding photo — fine; daily posts about "how much I love him/her" — unnecessary.

**Publicizing mitzvot** — sometimes people photograph themselves giving charity or praying. Rambam lists three levels of charity, and the highest is "the giver who does not know to whom he gives." Publicizing mitzvot diminishes the merit.

==== C. The Tzniut of Children Online ====

A major problem: parents publish photos of their children on Facebook, Instagram, etc. What are the problems?

1. **Lack of consent** — the child cannot consent at a young age.
2. **Lifelong digital record** — a photo from age 3 will haunt the child at age 30.
3. **Security risk** — exposure of location, routine, financial status — valuable information to criminals.
4. **Impact on self-image** — the child grows up viewing life as a display.

Recommendation: **Do not publish photos of your children on open networks.** If you want to share with distant family — use private WhatsApp or an encrypted family album.

==== D. Tzniut in Digital Work ====

Businesspeople, freelancers, and self-employed individuals are often required to have a "personal brand" — to be present online in order to gain clients.

Is this the opposite of tzniut? Not necessarily. The criterion:

**A brand of professional virtues** — permitted and recommended. Presenting knowledge, solutions, professional experience.

**A brand of private life** — problematic. People who use their children, spouses, or private lives to sell.

The rule: if the marketing is **about the value you provide**, it is fine. If the marketing is **about who you are** — problematic.

==== E. Modesty in Dress in This Era ====

This is a very sensitive subject. A few principles:

**Conservatism is not aggression** — you are not required to attack a woman dressed differently. Your modesty is not a license for violence against her.

**Flexibility for situations** — our Sages are more lenient in the workplace, less so in the synagogue. There is no "uniform for life."

**Quality not pretense** — modesty is not a mark of poverty. One can dress with quality, with dignity, feminine/masculine — while preserving codes of modesty.

**Modernity in design** — even among Charedim today there are modern designs that respect modesty. There is no need to look like the 19th century.

==== F. Tzniut and the Fear of Heaven ====

The deepest tzniut is not fashion but reverence. When a person is inward — every detail of his life shines.

Our Sages said: "The Shechinah dwells only amid joy of a mitzvah" (Pesachim 117a). And also: "The Shechinah dwells only in a modest place." Both conditions together — joy from mitzvot + modesty — turn a person into his own private Beit HaMikdash.

==== Summary ====

Tzniut in the digital era demands more of us than tzniut in any previous generation. Because we must not only guard ourselves — we must also guard the devices and networks from taking our tzniut from us.

A practical recommendation: **one day a week without social networks**. Most tzaddikim kept Shabbat without screens. Try it. The change in the soul is felt within a month.

Chachmei Ha'Eda offers "digital tzniut" workshops for young couples and families. Contact us if this interests you.`,
			ru: `Слово "цниют" (скромность) по сути параллельно "внутреннему достоинству". Мудрецы учили: "Вся слава дочери царя — внутри" (Псалмы 45:14) — истинная честь внутренняя, а не внешний показ. Но что происходит, когда вся наша жизнь выставлена в сеть?

==== А. Определение цниют в Торе ====

Цниют в Торе — это не только одежда. Это общий подход к жизни: "Ходи смиренно с Б-гом твоим" (Миха 6:8). Мудрецы выделили четыре измерения:

1. **Скромность в одежде** — воздержание от провокационных нарядов.
2. **Скромность в речи** — воздержание от грубых выражений и чрезмерного разговора о себе.
3. **Скромность в делах** — воздержание от демонстрации добродетелей напоказ.
4. **Скромность в мыслях** — сохранение внутренних мыслей во внутреннем мире.

Эти четыре измерения вместе создают целостную личность.

==== Б. Цниют и социальные сети ====

Социальные сети построены на принципе, противоположном цниют: открытости. Чем больше вы раскрываете — тем больше реакций — тем больше открытости — круг растёт.

Центральные вызовы:

**Селфи и самосъёмка** — не только женщины, но и мужчины. Потребность постоянно видеть себя — это тонкая форма нарциссизма. Совет: фотографируйте других людей, места, мгновения — не себя. Если уж селфи — не чаще раза в месяц.

**Личные статусы** — лишнее обнажение чувств. Совет: прежде чем написать что-то эмоциональное, спросите себя: "Уверен ли я, что соглашусь с этим через год?". Если нет — не публикуйте.

**Определение отношений в сети** — представление отношений "открытыми" на всеобщее обозрение — противоположность цниют. Совет: храните святость отношений для себя. Свадебное фото — нормально; ежедневные посты о том, "как сильно я её/его люблю", — излишни.

**Публичность заповедей** — иногда люди фотографируют, как дают цдаку или молятся. Рамбам выделяет три уровня цдаки, и высший — "дающий и не знающий, кому даёт". Огласка заповеди уменьшает заслугу.

==== В. Цниют детей в сети ====

Серьёзная проблема: родители публикуют фотографии своих детей в Фейсбуке, Инстаграме и т. п. В чём проблемы?

1. **Отсутствие согласия** — ребёнок не может дать согласие в раннем возрасте.
2. **Пожизненный цифровой след** — фотография в 3 года будет преследовать ребёнка в 30.
3. **Угроза безопасности** — раскрытие местонахождения, распорядка, финансового положения — ценная информация для преступников.
4. **Влияние на самооценку** — ребёнок растёт с представлением, что жизнь — это показ.

Рекомендация: **не публикуйте фотографии своих детей в открытых сетях**. Если хотите делиться с далёкой роднёй — используйте приватный WhatsApp или зашифрованный семейный альбом.

==== Г. Цниют в цифровой работе ====

Бизнесмены, фрилансеры и самозанятые часто вынуждены иметь "личный бренд" — присутствовать в сети, чтобы привлекать клиентов.

Противоречит ли это цниют? Не обязательно. Критерий:

**Бренд профессиональных достоинств** — разрешено и рекомендуется. Демонстрация знаний, решений, профессионального опыта.

**Бренд частной жизни** — проблематично. Люди, которые используют своих детей, супругов или личную жизнь, чтобы продавать.

Правило: если реклама — **о ценности, которую вы предоставляете**, это нормально. Если реклама — **о том, кто вы**, это проблематично.

==== Д. Скромность в одежде в эту эпоху ====

Это очень чувствительная тема. Несколько принципов:

**Консерватизм — не агрессия** — вы не обязаны нападать на женщину, одетую иначе. Ваша скромность — не разрешение на насилие над ней.

**Гибкость по ситуациям** — мудрецы более снисходительны в рабочей среде, менее — в синагоге. Нет "единой формы на всю жизнь".

**Качество, а не убожество** — скромность — не печать бедности. Можно одеваться качественно, достойно, женственно/мужественно, соблюдая кодексы скромности.

**Современность в дизайне** — даже у харедим сегодня есть современные дизайны, уважающие скромность. Не нужно выглядеть как в XIX веке.

==== Е. Цниют и страх Небес ====

Глубочайший цниют — это не мода, а трепет. Когда человек внутренний — каждая деталь его жизни сияет.

Мудрецы сказали: "Шхина пребывает только в радости заповеди" (Псахим 117а). И ещё: "Шхина пребывает только в скромном месте". Оба условия вместе — радость от заповедей и скромность — делают человека его собственным Бейт а-Микдашем.

==== Итог ====

Цниют в цифровую эпоху требует от нас больше, чем в любом прежнем поколении. Потому что мы должны не только хранить себя — но и хранить устройства и сети, чтобы они не отняли у нас цниют.

Практическая рекомендация: **один день в неделю без социальных сетей**. Большинство цадиким соблюдали шаббат без экранов. Попробуйте. Изменения в душе ощущаются уже через месяц.

Хахмей а-Эда предлагают мастер-классы "цифровой цниют" для молодых пар и семей. Свяжитесь с нами, если это вам интересно.`
		},
		approvedBy: [
			{ he: 'הרב אהרן ישראלי', en: 'Rabbi Aharon Yisraeli', ru: 'Рав Аарон Исраэли' },
			{ he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' },
			{ he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' }
		],
		tags: [
			{ he: 'צניעות', en: 'Tzniut', ru: 'Цниют' },
			{ he: 'רשתות חברתיות', en: 'Social Networks', ru: 'Социальные сети' },
			{ he: 'דיגיטל', en: 'Digital', ru: 'Цифровое' },
			{ he: 'חינוך ילדים', en: 'Raising Children', ru: 'Воспитание детей' },
			{ he: 'מותג אישי', en: 'Personal Brand', ru: 'Личный бренд' }
		]
	},
	{
		slug: 'din-torah-yesodot',
		title: {
			he: 'יסודות דין תורה במחלוקות בין אדם לחברו',
			en: 'Foundations of Din Torah in Disputes Between People',
			ru: 'Основы дин Торы в спорах между людьми'
		},
		author: {
			he: 'הרב יוסף כהן',
			en: 'Rabbi Yosef Cohen',
			ru: 'Рав Йосеф Коэн'
		},
		date: '2026-04-12',
		excerpt: {
			he: 'מבט מקיף על העקרונות ההלכתיים שבבסיס דין תורה ובוררות בין יהודי ליהודי - מסמכות הדיינים ועד דרך הפשרה כדרך אידאלית לקיום השלום.',
			en: 'A comprehensive look at the halachic principles underlying Din Torah and arbitration between Jew and Jew — from the authority of the judges to compromise as the ideal way of maintaining peace.',
			ru: 'Всесторонний взгляд на галахические принципы, лежащие в основе дин Торы и арбитража между евреем и евреем — от полномочий судей до компромисса как идеального пути сохранения мира.'
		},
		body: {
			he: `דין תורה הוא הדרך המקורית והאמתית שבה ראוי ליהודי לפתור את מחלוקותיו עם זולתו. אין מדובר במנגנון משפטי בלבד, אלא במסגרת שלמה של ערכים, השקפת עולם ודרך חיים שהקדוש ברוך הוא הנחיל לעמו ישראל בסיני.

שורש העניין נעוץ בציווי המפורש בפרשת משפטים (שמות כא, א): "וְאֵלֶּה הַמִּשְׁפָּטִים אֲשֶׁר תָּשִׂים לִפְנֵיהֶם". ומדייקים חז"ל: "לפניהם - של דייני ישראל, ולא לפני ערכאות של גויים" (גיטין פח ע"ב). פסיקה זו אינה רק טכנית - היא הצהרה עקרונית על מקור הסמכות השיפוטית בעולם היהודי.

==== א. סמכות הדיינים ====

הדיינים בעם ישראל אינם פקידי מדינה אלא שלוחי ההלכה. סמכותם נובעת ישירות מהתורה ומהמסורת בעל פה. הרמב"ם (הלכות סנהדרין פרק א) מבאר שדיין צריך להיות "חכם וירא חטא, ענוותן, שונא בצע, אוהב את האמת ואוהב את הבריות, ובעל שם טוב". זוהי הקפדה רוחנית-מוסרית עמוקה הרבה יותר מאשר תארים אקדמיים בלבד.

בית הדין הוא לב הקהילה היהודית. לאורך אלפי שנות גלות, אפילו כשלא היו ליהודים זכויות אזרחיות במדינות שגרו בהן, התקיימו בתי דין רבניים שפסקו במחלוקות ממוניות, גירושין, ירושות ועניינים אישיים אחרים. כך נשמרה זהותו של עם ישראל גם בתנאי גלות קשים.

==== ב. חובת הציות לפסק ====

מי שמסכים להתדיין בפני בית דין רבני מקבל על עצמו את הפסק מראש. סירוב לקבל פסק לאחר הדיון נחשב לעבירה חמורה. השולחן ערוך (חושן משפט יד) פוסק שניתן לכפות על המתחייב לקיים את פסק הבית דין, ואף לפרסם את עוול המסרב כדי שיתבייש וישוב מדרכו.

חשוב להבין: הציות לפסק אינו ביטוי של חולשה אלא של גבורה רוחנית. כדברי הרמח"ל ב"מסילת ישרים": "הכניעה לאמת היא הניצחון האמתי". כשאדם מקבל פסק שלא נוח לו, הוא מבטא את אהבתו לאמת ולשלום מעל לאינטרסים אישיים.

==== ג. הפשרה כדרך אידאלית ====

חז"ל מלמדים: "יפה כוח הפשרה מכוח הדין" (סנהדרין ו ע"ב). פשרה אינה ויתור על הצדק - היא חיפוש אחר פתרון שמאפשר לשני הצדדים להמשיך לחיות יחד בקהילה ולשמור על קשרי משפחה וחברות.

בבית הדין שלנו, חכמי העדה, אנו פועלים תמיד לעודד את הצדדים להגיע לפשרה לפני שלב הפסק. צוות "משכין שלום" שלנו מלווה את הצדדים בתהליך גישור בלי תשלום נוסף, ומסייע להם למצוא דרך מקובלת על שניהם.

==== ד. ערכאות אזרחיות ====

הלכה ידועה היא שאסור ליהודי לפנות לערכאות אזרחיות נגד חברו היהודי בעניינים שאפשר לדון בהם בבית דין רבני (שו"ע חו"מ כו). הסיבה: "המעלה דבריו לערכאות של גויים הרי הוא רשע, וכאילו חרף וגדף והרים יד בתורת משה רבנו" (לשון הרמב"ם, הלכות סנהדרין כו).

יש כמה יוצאי דופן: כאשר הצד השני מסרב להתדיין בפני בית דין, או כאשר מדובר בעניין שאינו בסמכות בית דין רבני (כגון מעצרים פליליים). אבל אלה חריגים שצריכים אישור ספציפי של בית דין.

==== ה. בית הדין במציאות המודרנית ====

בעידן המודרני, בית הדין הרבני מצוי באתגרים חדשים: עסקים בינלאומיים, רשת אינטרנט, סוגיות של פרטיות דיגיטלית, ועוד. בית הדין שלנו פועל להתאים את ההלכה למציאות החדשה תוך שמירה על העקרונות הבסיסיים.

אנו מקבלים תיקים מרחבי העולם - מארץ ישראל, ארצות הברית, אירופה ואסיה. הדיונים מתקיימים גם פנים-אל-פנים וגם בוידאו-קונפרנס, וכל פסק מנומק ומפורסם (בכפוף לפרטיות הצדדים) כדי לחזק את גוף ההלכה.

==== סיכום ====

דין תורה אינו עניין ארכאי או מיושן - הוא מערכת חיה ופועלת שהוכיחה את עצמה לאורך אלפי שנים. הוא מבוסס על אמת, צדק, רחמים ושלום. כל יהודי שמכיר בערך עצמו וערך עמו צריך להעדיף את דרך התורה על פני כל מנגנון משפטי אחר.

חכמי העדה עומדים לרשותכם. בכל שאלה - פנו אלינו בבטחה, ונסייע לכם למצוא את הדרך הראויה.`,
			en: `Din Torah is the original and true way in which a Jew should resolve disputes with his fellow. It is not merely a legal mechanism, but a complete framework of values, worldview, and way of life that the Holy One, blessed be He, bequeathed to His people Israel at Sinai.

The root of the matter lies in the explicit commandment in Parashat Mishpatim (Exodus 21:1): "And these are the laws which you shall set before them." Our Sages explain precisely: "Before them — meaning before the judges of Israel, and not before the courts of the gentiles" (Gittin 88b). This ruling is not merely technical — it is a principled declaration about the source of judicial authority in the Jewish world.

==== A. The Authority of the Judges ====

The judges of Israel are not state officials but emissaries of Halacha. Their authority derives directly from the Torah and the Oral Tradition. The Rambam (Hilchot Sanhedrin chapter 1) explains that a judge must be "wise and God-fearing, humble, hating ill-gotten gain, loving truth and loving creatures, and of good reputation." This is a much deeper spiritual-moral standard than mere academic degrees.

The Beit Din is the heart of the Jewish community. Throughout thousands of years of exile, even when Jews had no civil rights in the lands where they lived, rabbinical Batei Din existed and ruled on monetary disputes, divorces, inheritances, and other personal matters. Thus the identity of the people of Israel was preserved even under harsh exile.

==== B. The Obligation to Obey the Ruling ====

One who agrees to be judged before a rabbinical Beit Din accepts the ruling in advance. Refusing to accept a ruling after the hearing is considered a serious transgression. The Shulchan Aruch (Choshen Mishpat 14) rules that one may compel the committed party to fulfill the ruling of the Beit Din, and even publicize the wrong of the refuser so that he is shamed and returns from his way.

It is important to understand: obedience to the ruling is not an expression of weakness but of spiritual courage. As the Ramchal wrote in Mesillat Yesharim: "Submission to truth is the true victory." When a person accepts a ruling that does not suit him, he expresses his love of truth and peace above personal interests.

==== C. Compromise as the Ideal Way ====

Our Sages teach: "Greater is the power of compromise than the power of judgment" (Sanhedrin 6b). Compromise is not a concession of justice — it is a search for a solution that allows both parties to continue living together in the community and to preserve family and social ties.

In our Beit Din, Chachmei Ha'Eda, we always work to encourage the parties to reach a compromise before the ruling stage. Our "Mashkin Shalom" team accompanies the parties through a mediation process at no additional charge and helps them find a way acceptable to both.

==== D. Civil Courts ====

It is a well-known Halacha that a Jew is forbidden to turn to civil courts against his fellow Jew in matters that may be adjudicated in a rabbinical Beit Din (Shulchan Aruch CM 26). The reason: "He who brings his case before the courts of the gentiles is wicked, as though he blasphemed and cursed and raised his hand against the Torah of Moshe Rabbeinu" (the language of Rambam, Hilchot Sanhedrin 26).

There are a few exceptions: when the other party refuses to be judged before a Beit Din, or when the matter is not within the jurisdiction of a rabbinical Beit Din (such as criminal arrests). But these are exceptions that require specific approval from a Beit Din.

==== E. The Beit Din in Modern Reality ====

In the modern era, the rabbinical Beit Din faces new challenges: international business, the internet, issues of digital privacy, and more. Our Beit Din works to adapt Halacha to the new reality while preserving the basic principles.

We receive cases from around the world — from the Land of Israel, the United States, Europe, and Asia. Hearings are held both in person and by video conference, and every ruling is reasoned and published (subject to party privacy) in order to strengthen the body of Halacha.

==== Summary ====

Din Torah is not an archaic or outdated matter — it is a living, working system that has proven itself over thousands of years. It is based on truth, justice, mercy, and peace. Every Jew who recognizes his own value and the value of his people should prefer the way of the Torah over any other legal mechanism.

Chachmei Ha'Eda stands at your service. With any question — turn to us in confidence, and we will help you find the proper way.`,
			ru: `Дин Тора — это изначальный и истинный путь, которым еврею подобает разрешать споры со своим ближним. Это не просто правовой механизм, а цельная система ценностей, мировоззрения и образа жизни, которую Святой, благословен Он, передал Своему народу Израиля на Синае.

Корень этого вопроса лежит в явной заповеди в недельной главе "Мишпатим" (Шмот 21:1): "И вот законы, которые ты предложишь им". Мудрецы уточняют: "Им — то есть судьям Израиля, а не судам неевреев" (Гитин 88б). Это постановление не просто техническое — это принципиальное заявление об источнике судебной власти в еврейском мире.

==== А. Полномочия судей ====

Судьи Израиля — не государственные чиновники, а посланцы Галахи. Их полномочия исходят непосредственно от Торы и Устной Традиции. Рамбам (Илхот Санедрин, глава 1) разъясняет, что судья должен быть "мудрым и богобоязненным, смиренным, ненавидящим неправедный заработок, любящим истину и любящим людей, имеющим доброе имя". Это духовно-нравственная требовательность гораздо более глубокая, чем одни лишь академические степени.

Бейт-дин — сердце еврейской общины. На протяжении тысяч лет изгнания, даже когда у евреев не было гражданских прав в странах проживания, существовали раввинские бейт-дины, выносившие решения по денежным спорам, разводам, наследствам и другим личным делам. Так сохранялась идентичность народа Израиля даже в тяжёлых условиях изгнания.

==== Б. Обязанность подчиняться решению ====

Тот, кто соглашается судиться перед раввинским бейт-дином, заранее принимает на себя решение. Отказ принять решение после слушания считается тяжким нарушением. Шулхан Арух (Хошен Мишпат 14) постановляет, что можно принудить обязавшегося исполнить решение бейт-дина и даже огласить неправоту отказывающегося, чтобы он устыдился и вернулся со своего пути.

Важно понять: послушание решению — не выражение слабости, а духовного мужества. Как пишет Рамхаль в "Месилат Йешарим": "Покорение перед истиной — это истинная победа". Когда человек принимает неудобное для него решение, он выражает свою любовь к истине и миру выше личных интересов.

==== В. Компромисс как идеальный путь ====

Мудрецы учат: "Прекрасна сила компромисса больше силы суда" (Санедрин 6б). Компромисс — это не уступка справедливости, а поиск решения, позволяющего обеим сторонам продолжать жить вместе в общине и сохранять семейные и общественные связи.

В нашем бейт-дине Хахмей а-Эда мы всегда стремимся побудить стороны прийти к компромиссу до этапа решения. Наша команда "Машкин шалом" сопровождает стороны через процесс посредничества без дополнительной оплаты и помогает найти путь, приемлемый для обоих.

==== Г. Светские суды ====

Известная Галаха: еврею запрещено обращаться в светские суды против ближнего еврея по делам, которые можно разбирать в раввинском бейт-дине (Шулхан Арух Х"М 26). Причина: "Тот, кто доводит своё дело до судов неевреев, является злодеем, как будто хулил и проклинал и поднял руку на Тору Моше рабейну" (выражение Рамбама, Илхот Санедрин 26).

Есть несколько исключений: когда вторая сторона отказывается судиться перед бейт-дином или когда дело не входит в юрисдикцию раввинского бейт-дина (например, уголовные аресты). Но это исключения, требующие специального разрешения бейт-дина.

==== Д. Бейт-дин в современной реальности ====

В современную эпоху раввинский бейт-дин сталкивается с новыми вызовами: международный бизнес, сеть интернет, вопросы цифровой приватности и многое другое. Наш бейт-дин работает над адаптацией Галахи к новой реальности при сохранении базовых принципов.

Мы принимаем дела со всего мира — из Земли Израиля, Соединённых Штатов, Европы и Азии. Заседания проводятся как очно, так и по видеосвязи, а каждое решение обосновывается и публикуется (с соблюдением конфиденциальности сторон) для укрепления свода Галахи.

==== Итог ====

Дин Тора — не архаичный и не устаревший вопрос: это живая, действующая система, доказавшая себя на протяжении тысяч лет. Она основана на истине, справедливости, милосердии и мире. Каждый еврей, осознающий свою ценность и ценность своего народа, должен предпочитать путь Торы любому иному правовому механизму.

Хахмей а-Эда — к вашим услугам. По любому вопросу обращайтесь с доверием, и мы поможем найти подобающий путь.`
		},
		approvedBy: [
			{ he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
			{ he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' },
			{ he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' }
		],
		tags: [
			{ he: 'דין תורה', en: 'Din Torah', ru: 'Дин Тора' },
			{ he: 'בוררות', en: 'Arbitration', ru: 'Арбитраж' },
			{ he: 'בית דין', en: 'Beit Din', ru: 'Бейт-дин' },
			{ he: 'פשרה', en: 'Compromise', ru: 'Компромисс' }
		]
	},
	{
		slug: 'gzel-vehonaah',
		title: {
			he: 'איסור גזל והונאת דברים בעסקים',
			en: 'The Prohibition of Theft and Verbal Deception in Business',
			ru: 'Запрет грабежа и обмана словом в делах'
		},
		author: {
			he: 'הרב דוד אברהם',
			en: 'Rabbi David Avraham',
			ru: 'Рав Давид Авраам'
		},
		date: '2026-04-25',
		excerpt: {
			he: 'איסור גזל אינו מתמצה בנטילת ממון בפועל - הוא חובק את כל ענייני המסחר, מהאונאה במקח וממכר ועד הלנת שכר וזכויות העובד.',
			en: 'The prohibition of theft is not limited to the actual taking of money — it encompasses all matters of commerce, from deception in sales to withholding wages and workers\' rights.',
			ru: 'Запрет грабежа не сводится к фактическому присвоению денег — он охватывает все вопросы торговли, от обмана в купле-продаже до задержки заработной платы и нарушения прав работника.'
		},
		body: {
			he: `איסור גזל הוא אחד משבע מצוות בני נח, ולכן הוא מחייב את כל באי עולם - יהודים וגויים כאחד. הוא נמנה בין המצוות החמורות ביותר, וחז"ל אמרו שהוא היה הגורם המרכזי לחורבן דור המבול: "ותימלא הארץ חמס" (בראשית ו, יג) - "לא נחתם גזר דינם אלא על הגזל" (סנהדרין קח ע"א).

==== א. הגדרת איסור גזל ====

גזל בהגדרתו הצרה הוא נטילת ממון של חברו בלי רשותו. אבל חז"ל הרחיבו את ההגדרה: גם הונאה בדיבור, גם איחור בתשלום, גם שימוש בחפץ של חברו בלי רשות - הכל בכלל גזל.

הרמב"ם (הלכות גזלה ואבדה א, ב) מציין שגזל אסור אפילו על שווה פרוטה, ואפילו על דבר שאדם רגיל לוותר עליו. הסיבה: גם הוויתור הקטן ביותר על עיקרון הקניין מחליש את חוסר היציבות החברתית.

==== ב. אונאה במקח וממכר ====

האונאה במקח וממכר היא מצב שבו מוכר גובה יותר ממה שהמוצר באמת שווה, או קונה משלם פחות ממה שהמוכר ראוי לקבל. ההלכה קובעת: אם ההפרש הוא יותר משישית מהמחיר הראוי, העסקה מתבטלת לחלוטין (שו"ע חו"מ רכז).

נקודה חשובה: גם אם הקונה הסכים מרצונו - אם המוכר ידע שהמחיר מופרז, יש כאן איסור. הסיבה: הקונה הסתמך על הנחת תום-לב מצד המוכר. ניצול תום-הלב הזה הוא צורה של גזל.

בעידן המסחר המודרני, הסוגיה הזו רלוונטית במיוחד: השוואת מחירים באינטרנט, אלגוריתמי תמחור דינמיים, "הצעות מיוחדות" שאינן כאלה באמת. כל אלה דורשים בחינה הלכתית קפדנית.

==== ג. הונאת דברים ====

הונאת דברים היא רחבה יותר מאונאה ממונית. היא כוללת:

א) שאלה למוכר על מחיר שאין כוונת רכישה - גרימת ציפייה שווא.
ב) הזכרה לאדם על עבר רע שלו - גרימת בושה.
ג) הצעת עצה רעה מתוך אינטרס אישי - הטעיה.
ד) שיווק מטעה - תיאור מוצר באופן שיוצר רושם מוטעה.

חז"ל מחמירים בהונאת דברים יותר מאונאת ממון, שכן "ממון משלם והונאה אינה משלמת" (ב"מ נח ע"ב). כלומר, נזק כספי ניתן לתקן בהשבה - נזק רגשי קשה לתיקון.

==== ד. הלנת שכר ====

הלנת שכר היא איסור חמור במיוחד. התורה מצווה: "בְּיוֹמוֹ תִתֵּן שְׂכָרוֹ" (דברים כד, טו), ועובר על איסור זה עובר על חמישה לאוין (ב"מ קיא ע"א).

איסור זה חל גם על מעסיק שמעכב בכוונה, וגם על מעסיק שמתרשל במנגנוני התשלום. בעידן המודרני, חברות גדולות מחזיקות "תור תשלומים" שלעיתים גורר עיכובים של חודשים - ויש בכך עבירה הלכתית.

חכמי העדה מטפלים בעשרות מקרים של עובדים שלא קיבלו שכר, ובמרבית המקרים הצלחנו להגיע לפתרון מהיר באמצעות פנייה ישירה למעסיק עם הסבר על חומרת האיסור.

==== ה. זכויות העובד ====

הזכויות ההלכתיות של עובד רחבות מאלה החוקיות:

א) זכות למזון בשעת העבודה (אם הוא עובד עם פירות).
ב) זכות לימי מחלה מסוימים.
ג) זכות להפסקות במהלך יום העבודה.
ד) זכות שלא להיות מנוצל בשעות נוספות מעבר למוסכם.

המעסיק שאינו מקיים זכויות אלה - אף שהוא משלם את השכר במלואו - יש בו צד של עוול. חכמי העדה ממליצים לכל מעסיק לחתום על "אמנת המעסיק היהודי" שמסכמת את הזכויות וההתחייבויות.

==== ו. עצות מעשיות לאיש העסקים ====

א) קבע מחירים שקופים. הסבר מה הם כוללים ומה לא.
ב) שלם שכר בזמן - גם אם זה אומר לדחות הוצאות אחרות.
ג) הימנע משיווק מוטעה - אם המוצר טוב, הוא לא צריך הגזמות.
ד) אם טעית - תתקן מיד. בקש סליחה אם פגעת.
ה) במקרה של מחלוקת - פנה לבית דין רבני לפני בית משפט אזרחי.

==== סיכום ====

איסור גזל הוא יסוד הציביליזציה הבריאה. כשהוא נשמר - חברה משגשגת. כשהוא מופר - היא קורסת. כל אחד מאיתנו, בעסק שלו ובחיי היומיום, יכול לתרום לחיזוק יסוד זה.

האמנה המוסרית UECC שאנו מקדמים מהווה דרך מעשית לחתום על התחייבות לשמירת איסור גזל בכל אופניו. הצטרפותכם תחזק את כל מי שמסביבכם.`,
			en: `The prohibition of theft is one of the seven Noahide commandments, and therefore binds all who come into the world — Jews and gentiles alike. It is counted among the most severe commandments, and our Sages said that it was the main cause of the destruction of the generation of the Flood: "And the earth was filled with violence" (Genesis 6:13) — "Their fate was sealed only because of theft" (Sanhedrin 108a).

==== A. Defining the Prohibition of Theft ====

Theft, in its narrow definition, is taking another's money without his permission. But our Sages broadened the definition: also deception by speech, also delay in payment, also using another's object without permission — all are included in theft.

The Rambam (Hilchot Gezelah Va'Avedah 1:2) notes that theft is forbidden even for the worth of a prutah, and even for something a person usually forgoes. The reason: even the smallest concession on the principle of property weakens social stability.

==== B. Deception in Sales ====

Deception in sales is a situation in which a seller charges more than the product is truly worth, or a buyer pays less than the seller deserves to receive. Halacha establishes: if the gap is more than one-sixth of the appropriate price, the transaction is completely void (Shulchan Aruch CM 227).

An important point: even if the buyer agreed willingly — if the seller knew the price was excessive, there is a prohibition here. The reason: the buyer relied on a presumption of good faith from the seller. Exploiting this good faith is a form of theft.

In the era of modern commerce, this issue is especially relevant: online price comparison, dynamic pricing algorithms, "special offers" that aren't really special. All require careful halachic examination.

==== C. Verbal Deception (Ona'at Devarim) ====

Verbal deception is broader than monetary deception. It includes:

a) Asking a merchant about a price with no intent to buy — creating false expectation.
b) Reminding a person of his bad past — causing shame.
c) Offering bad advice out of personal interest — misleading.
d) Misleading marketing — describing a product in a way that creates a false impression.

Our Sages are stricter regarding verbal deception than monetary deception, since "money can be repaid but deception cannot" (Bava Metzia 58b). That is, financial damage can be repaired by restitution — emotional damage is hard to repair.

==== D. Withholding Wages ====

Withholding wages is an especially severe prohibition. The Torah commands: "On his day you shall give him his wages" (Deuteronomy 24:15), and one who transgresses this prohibition violates five negative commandments (Bava Metzia 111a).

This prohibition applies both to an employer who intentionally delays and to an employer who is negligent in his payment mechanisms. In the modern era, large companies maintain "payment queues" that sometimes drag on for months — and there is a halachic transgression in this.

Chachmei Ha'Eda handles dozens of cases of workers who did not receive their wages, and in most cases we have managed to reach a quick solution through direct contact with the employer and explanation of the severity of the prohibition.

==== E. The Rights of the Worker ====

The halachic rights of a worker are broader than the legal ones:

a) The right to food during work (if he works with produce).
b) The right to certain sick days.
c) The right to breaks during the workday.
d) The right not to be exploited for overtime beyond what was agreed.

The employer who does not fulfill these rights — even if he pays the wages in full — has a side of injustice. Chachmei Ha'Eda recommends that every employer sign the "Jewish Employer Charter" summarizing rights and obligations.

==== F. Practical Advice for the Businessperson ====

a) Set transparent prices. Explain what they include and what they do not.
b) Pay wages on time — even if this means postponing other expenses.
c) Avoid misleading marketing — if the product is good, it does not need exaggerations.
d) If you erred — fix it immediately. Apologize if you hurt.
e) In case of dispute — turn to a rabbinical Beit Din before a civil court.

==== Summary ====

The prohibition of theft is the foundation of a healthy civilization. When it is kept — society flourishes. When it is breached — it collapses. Each of us, in our business and in daily life, can contribute to strengthening this foundation.

The UECC moral charter that we promote is a practical way to sign a commitment to keeping the prohibition of theft in all its forms. Your joining will strengthen everyone around you.`,
			ru: `Запрет грабежа — одна из семи заповедей сыновей Ноаха, и потому обязывает всех приходящих в мир — евреев и неевреев одинаково. Он входит в число строжайших заповедей, и мудрецы сказали, что именно он был главной причиной уничтожения поколения Потопа: "И наполнилась земля насилием" (Берешит 6:13) — "Приговор их был запечатан только из-за грабежа" (Санедрин 108а).

==== А. Определение запрета грабежа ====

Грабёж в узком определении — это присвоение чужого имущества без разрешения. Но мудрецы расширили это определение: и обман словом, и задержка платежа, и использование чужой вещи без разрешения — всё это включается в грабёж.

Рамбам (Илхот Гезела ва-Аведа 1:2) отмечает, что грабёж запрещён даже на стоимость пруты и даже на то, чем человек обычно готов поступиться. Причина: даже малейшая уступка в принципе собственности подрывает социальную стабильность.

==== Б. Обман в купле-продаже ====

Обман в купле-продаже — это ситуация, когда продавец берёт больше реальной стоимости товара, либо покупатель платит меньше, чем продавцу полагается получить. Галаха устанавливает: если разница более одной шестой от подобающей цены — сделка полностью аннулируется (Шулхан Арух Х"М 227).

Важный момент: даже если покупатель согласился добровольно — если продавец знал, что цена завышена, здесь запрет. Причина: покупатель полагался на презумпцию добросовестности продавца. Эксплуатация этой добросовестности — форма грабежа.

В эпоху современной торговли этот вопрос особенно актуален: сравнение цен в интернете, алгоритмы динамического ценообразования, "специальные предложения", которые таковыми не являются. Всё это требует тщательного галахического разбора.

==== В. Обман словом (онаат дварим) ====

Обман словом шире денежного обмана. Он включает:

а) Вопрос продавцу о цене без намерения купить — создание ложного ожидания.
б) Напоминание человеку о его дурном прошлом — причинение стыда.
в) Совет, дурной из-за личного интереса, — введение в заблуждение.
г) Вводящий в заблуждение маркетинг — описание товара так, что создаётся ложное впечатление.

Мудрецы строже относятся к обману словом, чем к обману денежному, ибо "деньги возвращаются, а обман — не возвращается" (Бава Мециа 58б). То есть денежный ущерб можно возместить — эмоциональный трудно поправить.

==== Г. Задержка заработной платы ====

Задержка заработной платы — особенно строгий запрет. Тора повелевает: "В тот же день дай ему плату его" (Дварим 24:15), и нарушающий этот запрет преступает пять запретительных заповедей (Бава Мециа 111а).

Этот запрет относится как к работодателю, умышленно задерживающему, так и к работодателю, нерадиво относящемуся к механизмам оплаты. В современную эпоху крупные компании держат "очередь платежей", иногда тянущуюся месяцами, — и здесь есть галахическое нарушение.

Хахмей а-Эда рассматривают десятки случаев работников, не получивших заработной платы, и в большинстве случаев нам удавалось быстро найти решение через прямое обращение к работодателю с разъяснением суровости запрета.

==== Д. Права работника ====

Галахические права работника шире установленных законом:

а) Право на пищу во время работы (если он работает с плодами).
б) Право на определённые дни по болезни.
в) Право на перерывы в течение рабочего дня.
г) Право не быть эксплуатируемым во внеурочное время сверх согласованного.

Работодатель, не соблюдающий эти права, — даже выплачивая полную заработную плату — несёт в себе сторону несправедливости. Хахмей а-Эда рекомендуют каждому работодателю подписать "Хартию еврейского работодателя", обобщающую права и обязанности.

==== Е. Практические советы предпринимателю ====

а) Устанавливайте прозрачные цены. Объясняйте, что в них входит и что нет.
б) Платите заработную плату вовремя — даже если это означает отложить другие расходы.
в) Избегайте вводящего в заблуждение маркетинга — если товар хорош, ему не нужны преувеличения.
г) Если ошиблись — исправьте немедленно. Попросите прощения, если причинили вред.
д) В случае спора — обращайтесь в раввинский бейт-дин прежде, чем в гражданский суд.

==== Итог ====

Запрет грабежа — основа здоровой цивилизации. Когда он соблюдается, общество процветает. Когда нарушается — разрушается. Каждый из нас в своём деле и в повседневной жизни может укрепить эту основу.

Нравственная хартия UECC, которую мы продвигаем, — практический способ подписать обязательство соблюдать запрет грабежа во всех его проявлениях. Ваше присоединение укрепит всех вокруг вас.`
		},
		approvedBy: [
			{ he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' },
			{ he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
			{ he: 'הרב אהרן ישראלי', en: 'Rabbi Aharon Yisraeli', ru: 'Рав Аарон Исраэли' }
		],
		tags: [
			{ he: 'גזל', en: 'Theft', ru: 'Грабёж' },
			{ he: 'מוסר עסקי', en: 'Business Ethics', ru: 'Деловая этика' },
			{ he: 'הונאה', en: 'Deception', ru: 'Обман' },
			{ he: 'זכויות עובדים', en: 'Workers\' Rights', ru: 'Права работников' },
			{ he: 'שכר', en: 'Wages', ru: 'Заработная плата' }
		]
	},
	{
		slug: 'shevet-mitzvot-bnei-noach',
		title: {
			he: 'שבע מצוות בני נח כיסוד לציביליזציה עולמית',
			en: 'The Seven Noahide Commandments as the Foundation of World Civilization',
			ru: 'Семь заповедей сыновей Ноаха как основа мировой цивилизации'
		},
		author: {
			he: 'הרב אהרן ישראלי',
			en: 'Rabbi Aharon Yisraeli',
			ru: 'Рав Аарон Исраэли'
		},
		date: '2026-05-03',
		excerpt: {
			he: 'הרמב"ם מורה: כל אומה שאינה מקיימת שבע מצוות אינה יכולה להוות חברה צודקת. סקירה מקיפה על המסגרת המוסרית הכלל-עולמית שניתנה לכל בני האדם.',
			en: 'Rambam teaches: any nation that does not keep the seven commandments cannot form a just society. A comprehensive overview of the universal moral framework given to all human beings.',
			ru: 'Рамбам учит: любой народ, не соблюдающий семь заповедей, не может составлять справедливое общество. Всесторонний обзор универсальной нравственной системы, данной всем людям.'
		},
		body: {
			he: `שבע מצוות בני נח אינן מצוות פרטיות בלבד - הן מסגרת מוסרית כלל-עולמית שהקדוש ברוך הוא הטיל על כל בני האדם, מאז נח עד אחרית הימים. הן הבסיס לכל ציביליזציה בריאה ולכל שיתוף פעולה אנושי תקין.

==== א. מה הן שבע המצוות? ====

הרמב"ם (הלכות מלכים ט, א) מפרט את שבע המצוות:

1) **איסור עבודה זרה** - לא לעבוד אל זר ולא להשתחוות לפסל.
2) **איסור קללת השם** - לא לחלל את שם ה' ולא לקלל את הבורא.
3) **איסור שפיכות דמים** - לא לרצוח ולא לפגוע בחיי אדם.
4) **איסור גילוי עריות** - לא לקיים יחסי אישות אסורים.
5) **איסור גזל** - לא ליטול ממון של חברו בלי רשות.
6) **איסור אבר מן החי** - לא לאכול בשר מבעל חיים בעודו חי.
7) **חובת הקמת בתי דין** - לכל אומה למנות שופטים ולקיים מערכת משפט צודקת.

המצווה השביעית, חובת הדיינים, היא המסגרת שבה כל שאר המצוות יכולות להתממש. בלי מערכת משפט תקינה - האיסורים נשארים מילים בעלמא.

==== ב. למה דווקא שבע? ====

חז"ל מסבירים שמספר שבע מסמל שלמות ושפע. שבעה ימי הבריאה, שבעה ימי השבוע, שבע השמיטות עד היובל. השבע מצוות הן הציר שעליו עומדת בריאת העולם המוסרית.

נוסף לכך, הרמב"ם מציין שאלה הן המצוות המינימליות שבלעדיהן אי אפשר לקיים חברה אנושית מתפקדת. הן אינן עניין דתי בלבד - הן דרישה אנושית בסיסית.

==== ג. כל אומה - חובה ====

הרמב"ם פוסק (הלכות מלכים ט, יד): "וכן נצטוו (בני נח) להושיב דיינים בכל פלך ופלך לדון בשש מצוות אלו". כלומר, אין אומה שפטורה. אין תרבות שיכולה להתפתח בלעדיהן.

ההיסטוריה מאשרת זאת: כל ציביליזציה גדולה שקמה ופרחה - מימי מצרים העתיקה ועד תקופות הזוהר של אסיה - כללה במערכת החוקים שלה איסורים על רצח, גזל וכדומה. כשאיסורים אלו התרופפו, התרבות התדרדרה.

==== ד. בני נח הצדיקים ====

חז"ל מכנים גוי שמקיים את שבע המצוות "חסיד אומות העולם". מעמדו רוחני גבוה ביותר - לפי הרמב"ם הוא זוכה לחיי העולם הבא לצד צדיקי ישראל.

ההבדל בין יהודי לבן נח אינו בערך הרוחני אלא בתפקיד: יהודים נצטוו ב-613 מצוות וקיבלו על עצמם להיות "ממלכת כוהנים וגוי קדוש" - להיות אור לעמים. בני נח מקיימים את שבע המצוות ומשמשים יסוד מוסרי לכלל העולם.

==== ה. תנועת בני נח בזמננו ====

בעשורים האחרונים אנו עדים לתופעה מעניינת: אנשים מכל העולם, מתרבויות שונות, מגלים את שבע המצוות ומאמצים אותן כדרך חיים. יש קהילות בני נח בארצות הברית, באירופה, באפריקה ובאסיה.

חכמי העדה תומכים בתנועה זו ומספקים ליווי רוחני, לימוד הלכה והכוונה. אנו רואים בכך התגשמות נבואת ישעיהו: "כִּי אָז אֶהְפֹּךְ אֶל עַמִּים שָׂפָה בְרוּרָה לִקְרֹא כֻלָּם בְּשֵׁם ה' לְעָבְדוֹ שְׁכֶם אֶחָד" (צפניה ג, ט).

==== ו. שבע מצוות והאמנה UECC ====

האמנה המוסרית האוניברסלית (UECC - Universal Ethical Code Charter) שאנו מקדמים מבוססת ישירות על שבע מצוות בני נח. היא מתרגמת את העקרונות העתיקים לשפה מודרנית ולמסגרות עסקיות, חברתיות ומשפחתיות.

החותם על האמנה מתחייב:
- שלא להונות בעסקים (איסור גזל)
- לשמור על קדושת המשפחה (איסור עריות)
- לקדם פתרון מחלוקות בדרכי שלום (חובת הדיינים)
- לכבד את חיי הזולת (איסור שפיכות דמים)

==== ז. השפעה על העסקים ====

עסק המבוסס על שבע המצוות מקבל "תו תקן מוסרי" בעיני הקהילה. שותפים, לקוחות ועובדים יודעים שהם מתנהלים עם אדם הוגן. זה יוצר אמון, ואמון יוצר שגשוג.

מחקרים בכלכלת התנהגות מאשרים: עסקים עם מוניטין מוסרי גבוה מציגים רווחיות ארוכת-טווח טובה יותר. הקדוש ברוך הוא לא רק אומר "התנהגו ביושר" - הוא גם בנה את העולם כך שיושר משתלם.

==== ח. אתגרים ופתרונות ====

ההתחייבות לשבע מצוות אינה תמיד פשוטה. בעולם תחרותי, יש פיתויים לקצרים. חכמי העדה מציעים מסגרת תמיכה:

א) **קבוצות לימוד** - שבועיות, פתוחות לכולם.
ב) **ייעוץ אישי** - ליווי בהחלטות מורכבות.
ג) **בית דין נגיש** - לפתרון מחלוקות במהירות.
ד) **קהילה תומכת** - מפגשי חיזוק.

==== סיכום ====

שבע מצוות בני נח הן מתנת הבורא לכל באי עולם. הן אינן הגבלה - הן שחרור. שחרור מהכאוס שנוצר כשבני אדם פועלים בלי מצפן מוסרי.

הזמן הוא עכשיו: כל אומה, כל קהילה, כל יחיד - מוזמן לקבל את העיקרון הזה ולהיות חלק מתיקון העולם.

הצטרפו אלינו. חתמו על האמנה. הביאו אור לסביבתכם.`,
			en: `The seven Noahide commandments are not merely individual mitzvot — they are a universal moral framework that the Holy One, blessed be He, placed upon all human beings, from Noah until the End of Days. They are the basis of every healthy civilization and every sound human cooperation.

==== A. What Are the Seven Commandments? ====

The Rambam (Hilchot Melachim 9:1) details the seven commandments:

1) **The prohibition of idolatry** — not to worship a foreign god and not to bow to an idol.
2) **The prohibition of cursing God's Name** — not to profane the Name of Hashem and not to curse the Creator.
3) **The prohibition of bloodshed** — not to murder and not to harm human life.
4) **The prohibition of forbidden relations** — not to engage in prohibited sexual relations.
5) **The prohibition of theft** — not to take another's property without permission.
6) **The prohibition of eating a limb from a living animal** — not to eat meat from a living creature.
7) **The obligation to establish courts** — every nation must appoint judges and maintain a just judicial system.

The seventh commandment, the obligation of judges, is the framework within which all the other commandments can be realized. Without a proper judicial system — the prohibitions remain mere words.

==== B. Why Specifically Seven? ====

Our Sages explain that the number seven symbolizes completeness and abundance. The seven days of creation, the seven days of the week, the seven shemitah cycles to the Yovel. The seven commandments are the axis on which the moral creation of the world stands.

In addition, the Rambam notes that these are the minimal commandments without which it is impossible to maintain a functioning human society. They are not merely a religious matter — they are a basic human requirement.

==== C. Every Nation — Obligation ====

The Rambam rules (Hilchot Melachim 9:14): "And they (the children of Noah) were also commanded to establish judges in every district to judge regarding these six commandments." That is, no nation is exempt. No culture can develop without them.

History confirms this: every great civilization that arose and flourished — from ancient Egypt to the golden ages of Asia — included in its legal system prohibitions against murder, theft, and the like. When these prohibitions weakened, the culture declined.

==== D. The Righteous Noahides ====

Our Sages call a gentile who keeps the seven commandments a "Chassid Umot Ha'Olam" (righteous among the nations). His spiritual status is very high — according to the Rambam, he merits the life of the World to Come alongside the righteous of Israel.

The difference between a Jew and a Noahide is not in spiritual value but in role: Jews were commanded with 613 mitzvot and took upon themselves to be "a kingdom of priests and a holy nation" — to be a light unto the nations. Noahides keep the seven commandments and serve as a moral foundation for the entire world.

==== E. The Noahide Movement in Our Time ====

In recent decades we have witnessed an interesting phenomenon: people from all over the world, from different cultures, discover the seven commandments and adopt them as a way of life. There are Noahide communities in the United States, Europe, Africa, and Asia.

Chachmei Ha'Eda supports this movement and provides spiritual accompaniment, halachic study, and guidance. We see in this the fulfillment of the prophecy of Isaiah: "For then I will convert the peoples to a pure language, that all may call upon the Name of Hashem to serve Him with one consent" (Zephaniah 3:9).

==== F. The Seven Commandments and the UECC Charter ====

The Universal Ethical Code Charter (UECC) that we promote is directly based on the seven Noahide commandments. It translates the ancient principles into modern language and into business, social, and family frameworks.

The signatory to the charter commits:
- Not to deceive in business (prohibition of theft)
- To preserve the sanctity of the family (prohibition of forbidden relations)
- To promote peaceful resolution of disputes (obligation of judges)
- To respect the lives of others (prohibition of bloodshed)

==== G. Impact on Business ====

A business based on the seven commandments receives a "moral seal of standard" in the eyes of the community. Partners, customers, and employees know they are dealing with an honest person. This creates trust, and trust creates prosperity.

Behavioral economics studies confirm: businesses with a high moral reputation show better long-term profitability. The Holy One, blessed be He, does not only say "behave honestly" — He also built the world such that honesty pays.

==== H. Challenges and Solutions ====

Commitment to the seven commandments is not always simple. In a competitive world, there are temptations to take shortcuts. Chachmei Ha'Eda offers a framework of support:

a) **Study groups** — weekly, open to all.
b) **Personal counseling** — accompaniment in complex decisions.
c) **An accessible Beit Din** — for swift resolution of disputes.
d) **A supportive community** — strengthening gatherings.

==== Summary ====

The seven Noahide commandments are the Creator's gift to all who come into the world. They are not a restriction — they are a liberation. Liberation from the chaos created when people act without a moral compass.

The time is now: every nation, every community, every individual — is invited to receive this principle and be part of the repair of the world.

Join us. Sign the charter. Bring light to your surroundings.`,
			ru: `Семь заповедей сыновей Ноаха — не только частные заповеди: это универсальная нравственная система, которую Святой, благословен Он, возложил на всех людей со времён Ноаха до конца дней. Они — основа всякой здоровой цивилизации и всякого надлежащего человеческого сотрудничества.

==== А. Что такое семь заповедей? ====

Рамбам (Илхот Мелахим 9:1) перечисляет семь заповедей:

1) **Запрет идолопоклонства** — не служить чужому богу и не поклоняться идолу.
2) **Запрет богохульства** — не осквернять Имя Всевышнего и не проклинать Творца.
3) **Запрет кровопролития** — не убивать и не причинять вреда человеческой жизни.
4) **Запрет запрещённых половых отношений** — не вступать в запрещённые связи.
5) **Запрет грабежа** — не присваивать чужое имущество без разрешения.
6) **Запрет употребления части от живого** — не есть мясо от живого животного.
7) **Обязанность учреждать суды** — каждый народ должен назначать судей и поддерживать справедливую судебную систему.

Седьмая заповедь, обязанность судей, — рамка, в которой могут осуществляться все остальные заповеди. Без надлежащей судебной системы запреты остаются пустыми словами.

==== Б. Почему именно семь? ====

Мудрецы объясняют, что число семь символизирует полноту и изобилие. Семь дней творения, семь дней недели, семь шмит до йовеля. Семь заповедей — ось, на которой стоит нравственное творение мира.

Кроме того, Рамбам отмечает, что это минимальные заповеди, без которых невозможно функциональное человеческое общество. Это не только религиозный вопрос — это базовое человеческое требование.

==== В. Каждый народ — обязанность ====

Рамбам постановляет (Илхот Мелахим 9:14): "И также повелено им (сыновьям Ноаха) поставить судей в каждом округе, чтобы судить по этим шести заповедям". То есть нет освобождённого народа. Нет культуры, которая может развиваться без них.

История это подтверждает: каждая великая цивилизация, восставшая и расцветшая — от древнего Египта до золотых эпох Азии — включала в свою правовую систему запреты на убийство, грабёж и тому подобное. Когда эти запреты ослабевали, культура приходила в упадок.

==== Г. Праведные сыновья Ноаха ====

Мудрецы называют нееврея, соблюдающего семь заповедей, "Хасид умот а-олам" (праведник народов мира). Его духовный уровень очень высок — по Рамбаму, он удостаивается жизни в Грядущем мире рядом с праведниками Израиля.

Разница между евреем и сыном Ноаха не в духовной ценности, а в роли: евреям заповедано 613 заповедей, и они приняли на себя быть "царством священников и народом святым" — быть светом для народов. Сыны Ноаха соблюдают семь заповедей и служат нравственной основой всему миру.

==== Д. Движение сыновей Ноаха в наше время ====

В последние десятилетия мы видим интересное явление: люди со всего мира, из разных культур, открывают семь заповедей и принимают их как образ жизни. Существуют общины сыновей Ноаха в Соединённых Штатах, Европе, Африке и Азии.

Хахмей а-Эда поддерживают это движение и обеспечивают духовное сопровождение, изучение Галахи и направление. Мы видим в этом исполнение пророчества Йешаяу: "Ибо тогда сделаю Я народам уста чистые, чтобы все они призывали Имя Г-спода, служить Ему единодушно" (Цфания 3:9).

==== Е. Семь заповедей и хартия UECC ====

Универсальная этическая хартия (UECC — Universal Ethical Code Charter), которую мы продвигаем, основана непосредственно на семи заповедях сыновей Ноаха. Она переводит древние принципы на современный язык — в деловые, общественные и семейные рамки.

Подписывающий хартию обязуется:
- Не обманывать в делах (запрет грабежа)
- Хранить святость семьи (запрет запрещённых связей)
- Способствовать мирному разрешению споров (обязанность судей)
- Уважать жизнь ближнего (запрет кровопролития)

==== Ж. Влияние на бизнес ====

Бизнес, основанный на семи заповедях, получает "знак нравственного стандарта" в глазах общины. Партнёры, клиенты и работники знают, что имеют дело с честным человеком. Это создаёт доверие, а доверие создаёт процветание.

Исследования в поведенческой экономике подтверждают: бизнесы с высокой нравственной репутацией показывают лучшую долгосрочную прибыльность. Святой, благословен Он, не просто говорит "ведите себя честно" — Он построил мир так, что честность окупается.

==== З. Вызовы и решения ====

Обязательство по семи заповедям не всегда просто. В мире конкуренции есть соблазны срезать углы. Хахмей а-Эда предлагают систему поддержки:

а) **Учебные группы** — еженедельные, открытые для всех.
б) **Личные консультации** — сопровождение в сложных решениях.
в) **Доступный бейт-дин** — для быстрого разрешения споров.
г) **Поддерживающее сообщество** — укрепляющие встречи.

==== Итог ====

Семь заповедей сыновей Ноаха — дар Творца всем приходящим в мир. Это не ограничение, а освобождение. Освобождение от хаоса, возникающего, когда люди действуют без нравственного компаса.

Время — сейчас: каждый народ, каждая община, каждый человек приглашены принять этот принцип и быть частью исправления мира.

Присоединяйтесь к нам. Подпишите хартию. Несите свет вашему окружению.`
		},
		approvedBy: [
			{ he: 'הרב אהרן ישראלי', en: 'Rabbi Aharon Yisraeli', ru: 'Рав Аарон Исраэли' },
			{ he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' },
			{ he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' }
		],
		tags: [
			{ he: 'בני נח', en: 'Noahides', ru: 'Сыны Ноаха' },
			{ he: 'שבע מצוות', en: 'Seven Commandments', ru: 'Семь заповедей' },
			{ he: 'מוסר', en: 'Ethics', ru: 'Нравственность' },
			{ he: 'UECC', en: 'UECC', ru: 'UECC' },
			{ he: 'אוניברסלי', en: 'Universal', ru: 'Универсальное' }
		]
	}
];

export function getArticle(slug: string): Article | undefined {
	return articles.find((a) => a.slug === slug);
}
