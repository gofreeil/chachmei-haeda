export type LocalizedText = { he: string; en: string; ru: string };

export const QA_TOPICS = [
	'הלכה',
	'מוסר עסקי',
	'חושן משפט / ממונות',
	'שלום בית ומשפחה',
	'שבע מצוות בני נח',
	'אחר'
] as const;

export type QaTopic = (typeof QA_TOPICS)[number];

export const topicLabels: Record<QaTopic, LocalizedText> = {
	'הלכה': { he: 'הלכה', en: 'Halacha', ru: 'Галаха' },
	'מוסר עסקי': { he: 'מוסר עסקי', en: 'Business Ethics', ru: 'Деловая этика' },
	'חושן משפט / ממונות': {
		he: 'חושן משפט / ממונות',
		en: 'Choshen Mishpat / Monetary Law',
		ru: 'Хошен Мишпат / Имущественное право'
	},
	'שלום בית ומשפחה': {
		he: 'שלום בית ומשפחה',
		en: 'Shalom Bayit & Family',
		ru: 'Шалом Байт и семья'
	},
	'שבע מצוות בני נח': {
		he: 'שבע מצוות בני נח',
		en: 'The Seven Noahide Laws',
		ru: 'Семь заповедей сыновей Ноя'
	},
	'אחר': { he: 'אחר', en: 'Other', ru: 'Прочее' }
};

export const pickLang = (v: LocalizedText | string | undefined, l: string | null | undefined): string => {
	if (typeof v === 'string') return v;
	if (!v) return '';
	return (v as any)[l ?? 'he'] ?? v.he ?? '';
};

export interface QaItem {
	slug: string;
	topic: QaTopic;
	question: LocalizedText;
	asker: LocalizedText;
	askDate: string;
	answer: LocalizedText;
	answeredBy: LocalizedText;
	answerDate: string;
}

export const qa: QaItem[] = [
	{
		slug: 'shutaf-shelo-medaver',
		topic: 'מוסר עסקי',
		question: {
			he: 'שותף שלי בעסק הפסיק לדבר איתי כבר חודשיים בגלל אי הסכמה על חלוקת רווחים. אני רוצה לפתוח דין תורה, אבל לא בטוח אם זה הזמן הנכון או שעדיף לנסות פיוס נוסף קודם? אני חושש שאם אפתח עכשיו נאבד את הקשר לחלוטין, מצד שני אני חש שמנצלים את ענוותנותי.',
			en: 'My business partner has stopped speaking to me for two months over a disagreement about profit distribution. I want to open a Din Torah, but I am not sure whether this is the right time or whether I should try reconciliation once more first. I am afraid that if I file now we will lose contact altogether; on the other hand, I feel that my patience is being taken advantage of.',
			ru: 'Мой деловой партнёр уже два месяца не разговаривает со мной из-за разногласий по распределению прибыли. Я хочу обратиться в Дин Тора, но не уверен, подходящее ли это время, или лучше сначала ещё раз попытаться примириться. Я опасаюсь, что если подам сейчас, мы полностью потеряем связь; с другой стороны, чувствую, что моей кротостью пользуются.'
		},
		asker: { he: 'יוסי מ. - תל אביב', en: 'Yossi M. — Tel Aviv', ru: 'Йоси М. — Тель-Авив' },
		askDate: '2026-05-29',
		answer: {
			he: 'על פי הלכה, חובת הפיוס קודמת לפתיחת דין: "טוב לאדם שיתפייס עם חברו לפני שיבוא לבית דין" (רמב״ם הלכות דעות ו, ו). מומלץ קודם לשלוח פנייה כתובה ומכובדת לשותף, שבה אתה מציע מפגש בנוכחות אדם נייטרלי (רב, ידיד משותף). אם תוך 14 יום אין מענה - מותר ואף נכון לפתוח תיק בבית הדין. נדגיש שאצלנו צוות "משכין שלום" מלווה גם בשלב טרום-דיון בלי תשלום נוסף, ופעמים רבות הצלחנו להחזיר שותפויות עסקיות לתפקוד תקין אחרי שיחה אחת בלבד.',
			en: 'According to Halacha, the duty of reconciliation precedes opening a case: "It is better for a person to reconcile with his fellow before coming to Beit Din" (Rambam, Hilchot De\'ot 6:6). It is recommended to first send a written and respectful approach to your partner, in which you offer a meeting in the presence of a neutral person (a rabbi or mutual friend). If there is no response within 14 days, it is permitted — and even right — to open a case at the Beit Din. We should note that our "Mashkin Shalom" (peacemakers) team accompanies parties even in the pre-hearing stage at no additional charge, and we have often managed to restore business partnerships to proper functioning after a single conversation.',
			ru: 'Согласно Галахе, обязанность примирения предшествует открытию судебного разбирательства: «Лучше человеку помириться со своим ближним прежде, чем прийти в Бейт Дин» (Рамбам, Законы воззрений 6:6). Рекомендуется сначала направить партнёру письменное и уважительное обращение, в котором вы предложите встречу в присутствии нейтрального человека (раввина, общего друга). Если в течение 14 дней нет ответа, можно — и даже правильно — открыть дело в Бейт Дине. Подчеркнём, что у нас группа «Машкин Шалом» сопровождает стороны и на досудебном этапе без дополнительной оплаты, и нередко нам удавалось восстановить нормальную работу деловых партнёрств уже после одной беседы.'
		},
		answeredBy: { he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
		answerDate: '2026-06-01'
	},
	{
		slug: 'ben-noach-veshabbat',
		topic: 'שבע מצוות בני נח',
		question: {
			he: 'אני בן נח שמתעניין בקיום המצוות. האם מותר לי לשמור שבת או שיש בכך איסור? קראתי דעות שונות ואני מבולבל. מצד אחד שמירת שבת היא יום קודש, מצד שני שמעתי שזה אסור לבן נח.',
			en: 'I am a Noahide interested in keeping mitzvot. Am I permitted to observe Shabbat, or is there a prohibition against it? I have read differing opinions and I am confused. On the one hand, keeping Shabbat is a holy day; on the other, I have heard that it is forbidden for a Noahide.',
			ru: 'Я — сын Ноя, интересующийся исполнением заповедей. Можно ли мне соблюдать Шаббат, или это запрещено? Я читал разные мнения и запутался. С одной стороны, соблюдение Шаббата — святой день, с другой — я слышал, что сыну Ноя это запрещено.'
		},
		asker: { he: 'David L. - ניו יורק', en: 'David L. — New York', ru: 'Дэвид Л. — Нью-Йорк' },
		askDate: '2026-05-22',
		answer: {
			he: 'בן נח שאינו גר רשמית אינו מצווה לשמור שבת - ויש דעות בחז״ל שיש בכך אף איסור (סנהדרין נח ע״ב). עם זאת, אם הוא עושה לעצמו "שבת חלקית" - נמנע ממלאכות מסוימות לשם מנוחה ופנייה לרוחניות - אין בכך בעיה. ההמלצה: ביום שבת לקבוע זמן ללימוד שבע מצוות, ביקור משפחה, ומעשי חסד. אם רצונך להתחייב במצוות באופן מלא - פנה לבית דין לגיור. בכל מקרה, עצם רצונך להתקרב לקדושת השבת מעיד על נשמה גבוהה, וכל פעולה רוחנית שתעשה - גם בלי שבת מלאה - תחזק את הקשר שלך עם הבורא.',
			en: 'A Noahide who has not formally converted is not commanded to observe Shabbat, and there are opinions in Chazal that doing so is even forbidden (Sanhedrin 58b). However, if he makes for himself a "partial Shabbat" — refraining from certain activities for the sake of rest and spiritual focus — there is no problem with that. The recommendation: on Shabbat, set aside time for studying the Seven Mitzvot, visiting family, and acts of kindness. If you wish to take on the mitzvot in full, approach a Beit Din for conversion. In any case, the very fact that you desire to draw close to the holiness of Shabbat testifies to a lofty soul, and any spiritual act you do — even without a full Shabbat — will strengthen your bond with the Creator.',
			ru: 'Сын Ноя, не прошедший формального гиюра, не обязан соблюдать Шаббат, а есть мнения мудрецов, что это даже запрещено (Санѓедрин 58б). Однако если он устраивает себе «частичный Шаббат» — воздерживается от определённых работ ради отдыха и духовного сосредоточения — в этом нет проблемы. Рекомендация: в день Шаббата выделять время для изучения семи заповедей, посещения семьи и добрых дел. Если хотите принять заповеди в полном объёме — обратитесь в Бейт Дин для гиюра. В любом случае, само ваше желание приблизиться к святости Шаббата свидетельствует о возвышенной душе, и любое духовное действие — даже без полного Шаббата — укрепит вашу связь с Творцом.'
		},
		answeredBy: { he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' },
		answerDate: '2026-05-26'
	},
	{
		slug: 'shalom-bayit-tipul',
		topic: 'שלום בית ומשפחה',
		question: {
			he: 'אשתי דורשת שנלך לטיפול זוגי אצל פסיכולוגית חילונית. אני מעדיף יועץ דתי. איך מכריעים? אני חושש שיועצת חילונית תייעץ לנו לפעול בדרכים שמנוגדות להלכה, מצד שני אני לא רוצה לסרב לאשתי ולפגוע בקשר.',
			en: 'My wife insists that we go to couples therapy with a secular psychologist. I prefer a religious counselor. How do we decide? I am afraid that a secular therapist will guide us to act in ways contrary to Halacha; on the other hand, I do not want to refuse my wife and harm our relationship.',
			ru: 'Моя жена настаивает, чтобы мы пошли на семейную терапию к светскому психологу. Я предпочитаю религиозного консультанта. Как решить? Я опасаюсь, что светский специалист будет советовать нам поступать вопреки Галахе; с другой стороны, я не хочу отказывать жене и вредить отношениям.'
		},
		asker: { he: 'אנונימי', en: 'Anonymous', ru: 'Анонимно' },
		askDate: '2026-05-15',
		answer: {
			he: 'שלום בית הוא ערך עליון, ובחירת יועץ היא הכרעה משותפת שדורשת ענוה משני הצדדים. עיקרון מנחה: יש להעדיף יועץ ש(א) מקצועי ובעל הסמכה, (ב) לא ינחה לפעולות הסותרות הלכה. ישנם פסיכולוגים דתיים מקצועיים, וגם מטפלים חילוניים שמכבדים את עולם הערכים שלכם. הצעה מעשית: לכו לפגישת היכרות אצל שניים - אחד מכל סוג - ובחרו יחד את מי ששניכם חשים נוחים איתו. אם נשארים פערים, צרו קשר עם צוות "משכין שלום" שלנו לליווי בלתי-תלוי. חשוב לזכור: עצם נכונות אשתך לפנות לטיפול היא סימן מצוין לבריאות הקשר.',
			en: 'Shalom Bayit (marital harmony) is a supreme value, and the choice of counselor is a joint decision that requires humility from both sides. Guiding principle: prefer a counselor who is (a) professional and certified, and (b) will not direct you to actions that contradict Halacha. There are professional religious psychologists, and also secular therapists who respect your value system. Practical suggestion: go to an introductory meeting with two — one of each kind — and choose together the one with whom you both feel comfortable. If gaps remain, contact our "Mashkin Shalom" team for independent guidance. It is important to remember: the very fact that your wife is willing to turn to therapy is an excellent sign of the health of the relationship.',
			ru: 'Шалом Байт (мир в семье) — высшая ценность, а выбор консультанта — совместное решение, требующее смирения от обеих сторон. Руководящий принцип: следует предпочесть консультанта, который (а) является профессионалом с соответствующей сертификацией и (б) не будет советовать действия, противоречащие Галахе. Есть профессиональные религиозные психологи, а также светские терапевты, уважающие вашу систему ценностей. Практическое предложение: сходите на ознакомительную встречу к двум специалистам — по одному каждого типа — и вместе выберите того, с кем оба чувствуете себя комфортно. Если разногласия остаются, обратитесь к нашей группе «Машкин Шалом» для независимого сопровождения. Важно помнить: само согласие вашей жены обратиться к терапии — отличный признак здоровья отношений.'
		},
		answeredBy: { he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' },
		answerDate: '2026-05-20'
	},
	{
		slug: 'ribit-banki-bnei-noach',
		topic: 'שבע מצוות בני נח',
		question: {
			he: 'האם הריבית הבנקאית שאני, כבן נח, גובה מלקוחות בעסק האשראי שלי נחשבת לאיסור? קראתי שהיהדות אוסרת ריבית.',
			en: 'Is the bank interest that I, as a Noahide, charge clients in my credit business considered forbidden? I read that Judaism prohibits interest.',
			ru: 'Считается ли запрещённым банковский процент, который я, как сын Ноя, взимаю с клиентов в своём кредитном бизнесе? Я читал, что иудаизм запрещает проценты.'
		},
		asker: { he: 'Michael R. - אנגליה', en: 'Michael R. — England', ru: 'Майкл Р. — Англия' },
		askDate: '2026-05-10',
		answer: {
			he: 'איסור ריבית בתורה הוא במהותו איסור בין יהודי ליהודי (ויקרא כה, לו). בני נח אינם מצווים על איסור ריבית. עם זאת, יש איסור גזל ואונאה החלים על כולם, ולכן ריבית מוגזמת או הסתרת תנאי הלוואה - אסורים. כל עוד הריבית הוגנת, השקופה והמוסכמת, אין בעיה הלכתית. ראוי לזכור: הקוד האתי UECC ממליץ על שקיפות מלאה של תנאי האשראי, וזו דרך עסקית בריאה גם מנקודת מבט פרגמטית - לקוחות מבינים אוהבים שותפים שאינם מסתירים.',
			en: 'The Torah\'s prohibition of interest is essentially a prohibition between Jew and Jew (Vayikra 25:36). Noahides are not commanded regarding the prohibition of interest. However, the prohibitions of theft and deceit apply to all, and therefore excessive interest, or concealing the terms of a loan, are forbidden. As long as the interest is fair, transparent and agreed upon, there is no halachic problem. It is worth remembering: the UECC ethical code recommends full transparency of credit terms, and this is a healthy business practice from a pragmatic point of view as well — discerning clients prefer partners who do not hide things.',
			ru: 'Запрет процентов в Торе по сути является запретом между евреем и евреем (Ваикра 25:36). Сыновья Ноя не обязаны соблюдать запрет процентов. Тем не менее, существуют запреты грабежа и обмана, распространяющиеся на всех, и поэтому чрезмерные проценты или сокрытие условий кредита запрещены. Пока процент честен, прозрачен и согласован, галахической проблемы нет. Стоит помнить: этический кодекс UECC рекомендует полную прозрачность условий кредитования, и это здоровая деловая практика также с прагматической точки зрения — разумные клиенты ценят партнёров, ничего не скрывающих.'
		},
		answeredBy: { he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
		answerDate: '2026-05-14'
	},
	{
		slug: 'pidyon-shvuyim-bzman-haze',
		topic: 'הלכה',
		question: {
			he: 'האם מצוות פדיון שבויים חלה גם היום בכל מצב, או רק במצבים מסוימים? יש לי קרוב שנעצר במדינה זרה על עבירה כלכלית, ואני מתלבט אם להשתמש בכל המשאבים שלי כדי לשחררו, או שמא במקרה הזה זה לא נחשב פדיון שבויים כי הוא אכן עבר על החוק.',
			en: 'Does the mitzvah of redeeming captives (Pidyon Shvuyim) apply today in every situation, or only in certain ones? I have a relative who was arrested in a foreign country for a financial offense, and I am torn whether to use all my resources to free him, or whether in this case it does not count as Pidyon Shvuyim since he did in fact break the law.',
			ru: 'Применима ли заповедь выкупа пленных (Пидьон Швуим) сегодня в любой ситуации, или только в определённых? У меня есть родственник, арестованный в иностранном государстве за финансовое преступление, и я колеблюсь — использовать ли все свои средства, чтобы его освободить, или в этом случае это не считается Пидьон Швуим, поскольку он действительно нарушил закон.'
		},
		asker: { he: 'אברהם ק. - ירושלים', en: 'Avraham K. — Jerusalem', ru: 'Авраам К. — Иерусалим' },
		askDate: '2026-05-05',
		answer: {
			he: 'מצוות פדיון שבויים היא מהמצוות הגדולות שבהלכה. הרמב"ם פוסק: "אין לך מצווה גדולה כפדיון שבויים" (הלכות מתנות עניים ח, י). אבל יש הבחנה חשובה: במקרה של אדם שעבר עבירה ונכלא כדין, אין בכך פדיון שבויים מוחלט. כאן יש מצוות עזרה לקרוב משפחה, אבל לא בהיקף שמחייב למכור את כל הנכסים. ההמלצה: לעזור במידת היכולת בלי לרוקן את חסכונותיך, להבטיח לו ייצוג משפטי הוגן, ולתמוך במשפחתו. אם יש אפשרות חוקית להקלה בעונש, בוודאי לפעול לכך. במידה ויש שאלה הלכתית פרטנית - מומלץ לקבוע פגישה אישית בבית הדין.',
			en: 'The mitzvah of redeeming captives is one of the great mitzvot in Halacha. The Rambam rules: "There is no mitzvah greater than the redemption of captives" (Hilchot Matnot Aniyim 8:10). But there is an important distinction: in the case of a person who committed an offense and was lawfully imprisoned, this is not absolute Pidyon Shvuyim. Here there is the mitzvah of helping a family member, but not on a scale that obligates selling all one\'s assets. The recommendation: help to the best of your ability without emptying your savings; ensure that he receives fair legal representation; and support his family. If there is a legal way to ease the sentence, by all means pursue it. For a specific halachic question, it is recommended to schedule a personal meeting at the Beit Din.',
			ru: 'Заповедь выкупа пленных — одна из великих заповедей Галахи. Рамбам выносит решение: «Нет заповеди большей, чем выкуп пленных» (Законы даров бедным 8:10). Но есть важное различие: в случае человека, совершившего преступление и законно заключённого под стражу, это не является абсолютным Пидьон Швуим. Здесь есть заповедь помощи родственнику, но не в объёме, обязывающем продать всё имущество. Рекомендация: помогать по мере возможности, не опустошая своих сбережений; обеспечить ему достойное юридическое представительство; поддерживать его семью. Если существует законный путь смягчения наказания — безусловно следует им воспользоваться. При наличии конкретного галахического вопроса рекомендуется назначить личную встречу в Бейт Дине.'
		},
		answeredBy: { he: 'הרב אהרן ישראלי', en: 'Rabbi Aharon Yisraeli', ru: 'Рав Аарон Исраэли' },
		answerDate: '2026-05-09'
	},
	{
		slug: 'sodot-baavoda',
		topic: 'מוסר עסקי',
		question: {
			he: 'אני עובד בחברת טכנולוגיה ויש לי גישה למידע חסוי על תכניות שיווק עתידיות. חבר טוב שלי משקיע במניות החברה ושאל אותי על העתיד שלה. האם זה אסור לי לחלוק איתו מידע כללי? הרי הוא חבר ולא איזה זר.',
			en: 'I work at a tech company and have access to confidential information about future marketing plans. A good friend of mine invests in the company\'s stock and asked me about its future. Am I forbidden to share general information with him? After all, he is a friend, not some stranger.',
			ru: 'Я работаю в технологической компании и имею доступ к конфиденциальной информации о будущих маркетинговых планах. Мой близкий друг инвестирует в акции этой компании и спросил меня о её будущем. Запрещено ли мне делиться с ним общей информацией? Ведь он друг, а не какой-то посторонний.'
		},
		asker: { he: 'נתן ש. - חיפה', en: 'Natan S. — Haifa', ru: 'Натан Ш. — Хайфа' },
		askDate: '2026-04-28',
		answer: {
			he: 'יש כאן שני איסורים נפרדים: (א) שמירת סוד מקצועי - אם התחייבת בחוזה לשמור על סודיות, הפרת התחייבות זו היא גזל. (ב) Insider Trading - העברת מידע פנים לצורך מסחר בניירות ערך אסורה בחוק וגם בהלכה (משום גניבת דעת ופגיעה בשוויון). גם אם החבר לא יקנה/ימכור על סמך מה שתאמר, עצם החשיפה היא הפרת אמון. ההמלצה: אמור לחבר בכנות שאינך יכול לדבר על נושאים הקשורים לעבודה. חבר אמתי יכבד זאת. רעות צריכה להיבנות על דברים שמותר לדבר עליהם, לא על "הקלות" באתיקה.',
			en: 'There are two separate prohibitions here: (a) Keeping professional confidentiality — if you committed yourself contractually to confidentiality, breaching that commitment is theft. (b) Insider trading — passing inside information for the purpose of trading in securities is forbidden by law and also by Halacha (because of geneivat da\'at — deceiving — and harming equality). Even if your friend will not buy or sell based on what you say, the very disclosure is a breach of trust. The recommendation: tell your friend honestly that you cannot speak about matters related to work. A true friend will respect this. Friendship must be built on things you are permitted to talk about, not on "shortcuts" in ethics.',
			ru: 'Здесь два отдельных запрета: (а) Сохранение профессиональной тайны — если вы взяли на себя договорное обязательство о конфиденциальности, его нарушение является воровством. (б) Инсайдерская торговля — передача внутренней информации для торговли ценными бумагами запрещена законом и Галахой (как обман и нарушение равенства). Даже если друг не будет покупать или продавать на основании ваших слов, само раскрытие — это нарушение доверия. Рекомендация: честно скажите другу, что не можете говорить о вопросах, связанных с работой. Настоящий друг это поймёт. Дружба должна строиться на том, о чём говорить разрешено, а не на «послаблениях» в этике.'
		},
		answeredBy: { he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' },
		answerDate: '2026-05-02'
	},
	{
		slug: 'tzedaka-bishat-mashber',
		topic: 'הלכה',
		question: {
			he: 'אני בעצמי במצב כלכלי לא טוב. האם אני חייב להמשיך לתת מעשר כספים? לפעמים אני מרגיש שאני נותן ואחר כך לא יכול לעמוד בהוצאות שלי, מה דין במצב כזה?',
			en: 'I myself am in a difficult financial situation. Am I still obligated to give Maaser Kesafim (tithes on money)? Sometimes I feel that I give and then cannot cover my own expenses; what is the ruling in such a case?',
			ru: 'Я сам нахожусь в нелёгком материальном положении. Обязан ли я продолжать давать «маасер ксафим» (десятину с денег)? Иногда я чувствую, что даю, а потом не могу покрыть собственные расходы. Каков закон в такой ситуации?'
		},
		asker: { he: 'רחל ב. - בני ברק', en: 'Rachel B. — Bnei Brak', ru: 'Рахель Б. — Бней-Брак' },
		askDate: '2026-04-20',
		answer: {
			he: 'אדם שנמצא במצב של "מבקש לחם" - כלומר אין לו לפרנסת ביתו - פטור מצדקה. השולחן ערוך (יו"ד רנא) מבאר שהמילים "ולחי אחיך עמך" קודמות. אבל אם אתה במצב של "מתפרנס בדוחק" - יש לתת אפילו מעט. הצעה: חשב הוצאות חודשיות בסיסיות (דיור, מזון, חינוך, בריאות). אם ההכנסה מכסה אותן ונשאר משהו - עשה מהעודף הזה מעשר. אם לא נשאר - אתה פטור עד שמצבך ישתפר. בכל מקרה: מצווה לתת מצדקה ולו פרוטה אחת ביום, גם בעוני, כדי לשמור על הקשר הנפשי לנתינה. הקדוש ברוך הוא יראה ויברך.',
			en: 'A person who is in the state of "asking for bread" — that is, one who does not have enough to support his household — is exempt from tzedakah. The Shulchan Aruch (Yoreh De\'ah 251) explains that the words "and that your brother may live with you" come first. But if you are in the state of "barely making a living," you must give even a small amount. Suggestion: calculate basic monthly expenses (housing, food, education, health). If income covers them and something remains, take maaser from that surplus. If nothing remains, you are exempt until your situation improves. In any case, it is a mitzvah to give in tzedakah even a single coin a day, even in poverty, to preserve the emotional bond to giving. The Holy One, blessed be He, will see and bless.',
			ru: 'Человек, находящийся в положении «просящего хлеба» — то есть тот, у кого нет средств содержать дом, — освобождён от цдаки. Шулхан Арух (Йоре Деа 251) объясняет, что слова «и брат твой будет жить с тобою» имеют приоритет. Но если вы находитесь в положении «живущего скудно» — следует давать хотя бы немного. Предложение: подсчитайте базовые месячные расходы (жильё, еда, образование, здоровье). Если доход их покрывает и что-то остаётся, отделяйте маасер от этого излишка. Если ничего не остаётся — вы освобождены, пока ваше положение не улучшится. В любом случае: заповедь давать на цдаку хотя бы одну монету в день, даже в бедности, чтобы сохранить душевную связь с даянием. Святой, благословен Он, увидит и благословит.'
		},
		answeredBy: { he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' },
		answerDate: '2026-04-25'
	},
	{
		slug: 'kashrut-mitbach-mishutaf',
		topic: 'הלכה',
		question: {
			he: 'אני גרה בדירה משותפת עם חברה לעבודה שהיא לא דתית. היא מבשלת מאכלים לא כשרים על הכיריים המשותפות. איך אני יכולה לשמור על כשרות המטבח? האם אני צריכה לעבור דירה?',
			en: 'I share an apartment with a coworker who is not religious. She cooks non-kosher food on the shared stovetop. How can I maintain a kosher kitchen? Do I need to move out?',
			ru: 'Я живу в одной квартире с коллегой по работе, которая не соблюдает религию. Она готовит некошерную еду на общей плите. Как мне сохранить кашрут на кухне? Нужно ли мне переезжать?'
		},
		asker: { he: 'מיכל ל. - פתח תקווה', en: 'Michal L. — Petach Tikva', ru: 'Михаль Л. — Петах-Тиква' },
		askDate: '2026-04-12',
		answer: {
			he: 'אפשר לשמור כשרות במטבח משותף עם הקפדה: (א) כלים נפרדים לחלוטין - מאוחסנים בנפרד עם סימון ברור. (ב) על הכיריים - לבשל רק על אש פתוחה כשהמיקום ייעודי לך, או להשתמש בכיריים נפרדות (אינדוקציה ניידת). (ג) תנור - בעייתי במיוחד; עדיף שאתי לא תשתמשי בו אם החברה לא שומרת כשרות. (ד) מקרר - הפרידי מדפים. (ה) שיש - לכסות אזור עבודה לפני שימוש. אין צורך לעבור דירה - אבל יש צורך להגדיר כללים ברורים בכבוד הדדי עם החברה. רוב בחורות חילוניות מבינות ומכבדות זאת כאשר מסבירים יפה. אם אתן לא מצליחות להגיע להבנה - אז אולי מעבר באמת רצוי.',
			en: 'It is possible to keep kashrut in a shared kitchen with care: (a) Completely separate utensils — stored separately with clear marking. (b) On the stovetop — cook only on an open flame at a spot designated for you, or use a separate stove (a portable induction plate). (c) Oven — particularly problematic; it is preferable that you not use it if your roommate does not keep kashrut. (d) Refrigerator — separate the shelves. (e) Counter — cover the work area before use. There is no need to move out — but you do need to establish clear rules with mutual respect with your roommate. Most secular young women understand and respect this when it is explained nicely. If you cannot reach an understanding, then perhaps moving really is preferable.',
			ru: 'Можно соблюдать кашрут на общей кухне при внимательном подходе: (а) Полностью отдельная посуда — хранится отдельно с чёткой маркировкой. (б) На плите — готовить только на открытом огне на месте, отведённом для вас, или использовать отдельную плиту (переносную индукционную). (в) Духовка — особенно проблематична; предпочтительно не пользоваться ею, если соседка не соблюдает кашрут. (г) Холодильник — разделите полки. (д) Столешница — накрывайте рабочую зону перед использованием. Переезжать не обязательно — но необходимо установить чёткие правила во взаимном уважении с соседкой. Большинство светских девушек понимают и уважают это, когда объясняют по-доброму. Если договориться не удаётся — тогда, возможно, переезд действительно желателен.'
		},
		answeredBy: { he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
		answerDate: '2026-04-18'
	},
	{
		slug: 'gerushin-aniyim',
		topic: 'שלום בית ומשפחה',
		question: {
			he: 'אני בתהליך גירושין ואין לי כסף לעורך דין. בעלי לשעבר יש לו משאבים גדולים יותר. האם בית הדין הרבני מספק סיוע משפטי לחסרי אמצעים?',
			en: 'I am in the middle of divorce proceedings and have no money for a lawyer. My former husband has greater resources. Does the rabbinical court provide legal aid for those without means?',
			ru: 'Я в процессе развода, и у меня нет денег на адвоката. У моего бывшего мужа гораздо больше средств. Предоставляет ли раввинский суд юридическую помощь тем, у кого нет средств?'
		},
		asker: { he: 'אנונימית', en: 'Anonymous (female)', ru: 'Анонимно (жен.)' },
		askDate: '2026-04-05',
		answer: {
			he: 'בהחלט. הצדק אינו פריבילגיה של בעלי הכיס - הוא זכות בסיסית בהלכה. חכמי העדה מציעים: (א) ייצוג חינם לחסרי יכולת על בסיס בדיקת הכנסות. (ב) ליווי על ידי "טוען רבני" מתנדב. (ג) אם הצד השני אמיד - ניתן לחייב אותו בהוצאות המשפט שלך (תקנה הלכתית עתיקה למניעת קיפוח הצד החלש). הצעד הראשון: יצרי קשר עם המזכירות שלנו, הסבירי את מצבך, ונקבע פגישת ייעוץ ראשונית בחינם. בנוסף, צוות "משכין שלום" שלנו יכול לעיתים להגיע להסדר גירושין בהסכמה - מה שחוסך הוצאות וסבל לשני הצדדים, ובמיוחד לילדים אם יש.',
			en: 'Absolutely. Justice is not a privilege of the wealthy — it is a basic right in Halacha. Chachmei Ha\'Eda offers: (a) Free representation for those unable to pay, based on an income assessment. (b) Accompaniment by a volunteer "to\'en rabani" (rabbinical advocate). (c) If the other party is well-off, it is possible to obligate him to cover your legal costs (an ancient halachic ordinance to prevent the weaker side from being disadvantaged). The first step: contact our office, explain your situation, and we will schedule an initial consultation free of charge. In addition, our "Mashkin Shalom" team can sometimes reach a divorce agreement by consent — which saves both sides expense and suffering, and especially the children, if there are any.',
			ru: 'Безусловно. Справедливость — не привилегия состоятельных людей, это базовое право в Галахе. Хахмей а-Эда предлагает: (а) Бесплатное представительство для нуждающихся на основании проверки доходов. (б) Сопровождение волонтёром-«тоэн рабани» (раввинским адвокатом). (в) Если другая сторона состоятельна — можно обязать её оплатить ваши судебные расходы (древнее галахическое постановление, защищающее более слабую сторону). Первый шаг: свяжитесь с нашей канцелярией, объясните свою ситуацию, и мы назначим бесплатную первичную консультацию. Кроме того, наша группа «Машкин Шалом» порой может достичь развода по взаимному согласию — что экономит расходы и страдания обеим сторонам, и особенно детям, если они есть.'
		},
		answeredBy: { he: 'הרב משה לוי', en: 'Rabbi Moshe Levi', ru: 'Рав Моше Леви' },
		answerDate: '2026-04-10'
	},
	{
		slug: 'pikuah-nefesh-be-shabbat',
		topic: 'הלכה',
		question: {
			he: 'אני רופא בבית חולים ועובד בשבת. האם אני יכול גם לבצע פעולות שאינן הצלת חיים ממש - כמו רשומות רפואיות, ניירת אדמיניסטרטיבית? איפה הגבול?',
			en: 'I am a hospital physician and work on Shabbat. May I also perform actions that are not strictly lifesaving — such as medical records or administrative paperwork? Where is the line?',
			ru: 'Я больничный врач и работаю в Шаббат. Могу ли я также выполнять действия, не относящиеся непосредственно к спасению жизни — например, вести медицинские записи, заниматься административной документацией? Где проходит граница?'
		},
		asker: { he: 'ד"ר אבי פ. - רמת גן', en: 'Dr. Avi P. — Ramat Gan', ru: 'Д-р Ави П. — Рамат-Ган' },
		askDate: '2026-03-28',
		answer: {
			he: 'פיקוח נפש דוחה שבת - זהו עיקרון מוחלט. אבל יש דקויות: (א) פעולות ישירות להצלת חיים - מותרות בלי הגבלה. (ב) פעולות נלוות הכרחיות (רישום מינון תרופה, תיעוד שמדבר עליו ההמשך) - מותרות. (ג) פעולות אדמיניסטרטיביות שאינן דחופות - אסורות בשבת ודחה לאחר השבת. (ד) ניתן בקלות - להעדיף שיהודי אחר (אינו רופא) לא יבצע את הפעולה במקומך. בעיקרון, כל מה שמוטלת עליך כחובה משפטית או רפואית מתוקף תפקידך כרופא, ושאי-עשייתו עלול לסכן חיים בעתיד - מותר ואף מצווה. למקרים גבוליים - מומלץ לפתח קשר אישי עם רב בעל מומחיות ברפואה והלכה.',
			en: 'Pikuach nefesh (saving a life) overrides Shabbat — this is an absolute principle. But there are nuances: (a) Direct lifesaving actions are permitted without limit. (b) Necessary accompanying actions (recording medication dosage, documentation on which subsequent care depends) are permitted. (c) Administrative actions that are not urgent are forbidden on Shabbat and should be deferred until after Shabbat. (d) Where easily possible, prefer that another Jew (who is not a physician) not perform the action in your place. In principle, anything imposed on you as a legal or medical obligation by virtue of your role as a physician, and whose omission could endanger lives in the future, is permitted and even a mitzvah. For borderline cases, it is recommended to develop a personal relationship with a rabbi who has expertise in medicine and Halacha.',
			ru: 'Пикуах нефеш (спасение жизни) отменяет Шаббат — это абсолютный принцип. Но есть тонкости: (а) Действия, непосредственно направленные на спасение жизни, разрешены без ограничений. (б) Необходимые сопутствующие действия (запись дозы лекарства, документация, от которой зависит продолжение лечения) — разрешены. (в) Несрочные административные действия в Шаббат запрещены и должны быть отложены до его окончания. (г) Когда это возможно — предпочтительно, чтобы другой еврей (не врач) не выполнял действие вместо вас. В принципе, всё, что возложено на вас как юридическая или медицинская обязанность в силу вашей роли врача и чьё невыполнение может в будущем подвергнуть опасности жизни, — разрешено и даже является заповедью. В пограничных случаях рекомендуется наладить личный контакт с раввином, специализирующимся в медицине и Галахе.'
		},
		answeredBy: { he: 'הרב אהרן ישראלי', en: 'Rabbi Aharon Yisraeli', ru: 'Рав Аарон Исраэли' },
		answerDate: '2026-04-02'
	},
	{
		slug: 'tzava-vatorah',
		topic: 'אחר',
		question: {
			he: 'בני מתגייס לצבא בעוד חודש. אני חרד שייפגע ברוחניות שלו. איך לחזק אותו ולהכין אותו לקראת השירות?',
			en: 'My son is being drafted into the army in a month. I am worried that his spiritual life will be harmed. How can I strengthen him and prepare him for service?',
			ru: 'Через месяц мой сын призывается в армию. Я переживаю, что это повредит его духовной жизни. Как поддержать его и подготовить к службе?'
		},
		asker: { he: 'יעקב ה. - מודיעין', en: 'Yaakov H. — Modi\'in', ru: 'Яаков Х. — Модиин' },
		askDate: '2026-03-20',
		answer: {
			he: 'הצבא הוא אתגר רוחני אבל גם הזדמנות לצמיחה. עצות מעשיות: (א) הכנה רוחנית - לפני הגיוס, שגרת לימוד יומית קצרה אבל קבועה (15 דקות). (ב) קשר רציף - אל תהפכו את שיחות הטלפון לבדיקה אלא לחיבור. שאלו על חוויות, לא רק על מצב רוחני. (ג) חברים - עודדו אותו למצוא חברה של חיילים שמירים על אורח חיים דומה. (ד) רב צבאי - בכל יחידה יש; שיכיר אותו. (ה) ספרים בקומפקטיים - תהילים קטן, סידור צבאי, ספר תניא. (ו) הימנעו מלחץ - אם הוא מרגיש שאתם מודאגים ממנו, זה מקשה. הביעו אמון ביכולתו. הצבא דווקא חיזק רוחנית רבים שעברו אותו עם הכנה נכונה.',
			en: 'The army is a spiritual challenge but also an opportunity for growth. Practical advice: (a) Spiritual preparation — before enlistment, a short but consistent daily learning routine (15 minutes). (b) Continuous connection — don\'t turn phone conversations into interrogations, but into connection. Ask about experiences, not only about spiritual status. (c) Friends — encourage him to find a circle of soldiers who maintain a similar lifestyle. (d) Military rabbi — there is one in every unit; let him get to know him. (e) Compact books — a small Tehillim, an army-edition Siddur, a Tanya. (f) Avoid pressure — if he senses that you are worried about him, it makes things harder. Express confidence in him. The army has actually strengthened many spiritually who went through it with proper preparation.',
			ru: 'Армия — духовное испытание, но также и возможность для роста. Практические советы: (а) Духовная подготовка — до призыва ввести короткую, но постоянную ежедневную учёбу (15 минут). (б) Постоянная связь — не превращайте телефонные разговоры в проверку, а в общение. Спрашивайте о переживаниях, а не только о духовном состоянии. (в) Друзья — поощряйте его найти круг солдат, ведущих схожий образ жизни. (г) Военный раввин — есть в каждой части; пусть он с ним познакомится. (д) Компактные книги — маленький Теѓилим, армейский Сидур, книга Танья. (е) Избегайте давления — если он почувствует, что вы за него тревожитесь, это усложняет. Выражайте веру в его силы. Армия как раз укрепила духовно многих, кто прошёл её с надлежащей подготовкой.'
		},
		answeredBy: { he: 'הרב דוד אברהם', en: 'Rabbi David Avraham', ru: 'Рав Давид Авраам' },
		answerDate: '2026-03-26'
	},
	{
		slug: 'meshpat-bina-bnei',
		topic: 'חושן משפט / ממונות',
		question: {
			he: 'אבי נפטר והשאיר ירושה. יש לי שני אחים ואחות. האחות טוענת שמגיע לה חלק שווה כמו לבנים, ואחי הבכור טוען שמגיע לו פי שניים. מה דין התורה כאן?',
			en: 'My father passed away and left an inheritance. I have two brothers and a sister. My sister claims she is entitled to an equal share like the sons, and my eldest brother claims he is entitled to a double portion. What does Torah law say here?',
			ru: 'Мой отец скончался и оставил наследство. У меня есть два брата и сестра. Сестра утверждает, что ей полагается такая же доля, как сыновьям, а старший брат — что ему полагается двойная доля. Каков здесь закон Торы?'
		},
		asker: { he: 'שמעון א. - אשדוד', en: 'Shimon A. — Ashdod', ru: 'Шимон А. — Ашдод' },
		askDate: '2026-03-12',
		answer: {
			he: 'דיני ירושה בתורה הם נושא מורכב, ויש פערים בין דין התורה לחוק האזרחי. דין התורה (במדבר כז): (א) בנים יורשים, ולא בנות בנוכחות בנים. (ב) הבכור מקבל פי שניים מבן רגיל. (ג) האלמנה לא יורשת אלא מקבלת כתובה. אבל - בעידן המודרני, רוב בתי הדין מאמצים גישה הוגנת יותר על בסיס "מנהג המקום" ו"לפנים משורת הדין". כמו כן, אם אביכם השאיר צוואה אזרחית - דעת הפוסקים המודרניים שיש לכבד אותה גם מצד דין תורה. ההמלצה: פנו לבית הדין שלנו לדיון משפחתי. נסייע לכם להגיע להסדר הוגן שמכבד הן את ההלכה והן את רגשות כל הצדדים. תיק ירושה הוא לרוב יותר עניין רגשי מאשר ממוני, וצריך לנצל את ההזדמנות לחיזוק קשרי המשפחה ולא לקרע נוסף.',
			en: 'The laws of inheritance in the Torah are a complex topic, and there are gaps between Torah law and civil law. Torah law (Bamidbar 27): (a) Sons inherit, and not daughters in the presence of sons. (b) The firstborn receives a double portion compared to an ordinary son. (c) The widow does not inherit, but receives her Ketubah. However, in the modern era, most Batei Din adopt a more equitable approach based on "the custom of the place" and "lifnim mishurat hadin" (beyond the letter of the law). Likewise, if your father left a civil will, the view of modern poskim is that it should be honored from the standpoint of Torah law as well. The recommendation: turn to our Beit Din for a family hearing. We will help you reach a fair arrangement that respects both Halacha and the feelings of all sides. An inheritance case is usually more an emotional matter than a financial one, and the opportunity should be used to strengthen family ties, not to create another rift.',
			ru: 'Законы наследования в Торе — сложная тема, и существуют различия между законом Торы и гражданским правом. Закон Торы (Бемидбар 27): (а) Наследуют сыновья, а не дочери при наличии сыновей. (б) Первенец получает двойную долю по сравнению с обычным сыном. (в) Вдова не наследует, но получает ктубу. Однако в современную эпоху большинство раввинских судов принимают более справедливый подход на основе «обычая места» и «лифним мишурат ѓа-дин» (сверх буквы закона). Кроме того, если ваш отец оставил гражданское завещание — мнение современных поским таково, что его следует уважать и с точки зрения закона Торы. Рекомендация: обратитесь в наш Бейт Дин для семейного разбирательства. Мы поможем вам прийти к справедливому соглашению, уважающему и Галаху, и чувства всех сторон. Дело о наследстве — чаще эмоциональный вопрос, чем имущественный, и эту возможность следует использовать для укрепления семейных связей, а не для нового раскола.'
		},
		answeredBy: { he: 'הרב יוסף כהן', en: 'Rabbi Yosef Cohen', ru: 'Рав Йосеф Коэн' },
		answerDate: '2026-03-18'
	}
];

export function latestAnswer(): QaItem {
	return [...qa].sort((a, b) => b.answerDate.localeCompare(a.answerDate))[0];
}
