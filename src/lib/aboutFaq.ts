// ============================================================
// aboutFaq.ts — מקור אמת יחיד לדף "אודותינו" (/about):
// כותרת, פסקת פתיחה ואגף השאלות והתשובות.
// גם התצוגה בדף וגם סכמת FAQPage (JSON-LD) נבנות מכאן, כך שמנועי
// חיפוש ומנועי AI רואים בדיוק את אותו טקסט שהגולש רואה.
// התוכן מבוסס על מה שקיים באתר בפועל (seo.ts, i18n, llms.txt) — לא להמציא
// פיצ'רים, מספרים או פרטי קשר שאינם בקוד.
// ============================================================

export interface FaqItem {
    q: string;
    a: string;
}

export interface AboutContent {
    /** כותרת הדף (h1) */
    title: string;
    /** פסקת פתיחה — 2-4 משפטים */
    intro: string;
    /** כותרת אגף השו"ת (h2) */
    faqTitle: string;
    /** קישור לדף הרבנים והחזון */
    moreLink: string;
    faq: FaqItem[];
}

export type AboutLocale = 'he' | 'en' | 'ru' | 'es' | 'ps';

export const ABOUT_CONTENT: Record<AboutLocale, AboutContent> = {
    he: {
        title: 'אודותינו',
        intro:
            'חכמי העדה — בתי הפיוס (chachmim.gofreeil.com) הוא בית דין לבוררות ושלום על פי תורת ישראל: בוררות, גישור ופתרון סכסוכים בהתנדבות, בלי אגרות ובלי עלויות משפט. לצד בית הפיוס האתר מפרסם פסקי דין, מאמרים מחכמי ישראל, שאלות ותשובות בהלכה ואת הקוד האתי העולמי (UECC). האתר הוא חלק מרשת האתרים של התנועה החברתית "יוצאים לחירות".',
        faqTitle: 'שאלות ותשובות',
        moreLink: 'הרבנים והדיינים, החזון ומודל ההתנהלות',
        faq: [
            {
                q: 'מה זה "חכמי העדה — בתי הפיוס" ומה מטרתו?',
                a: 'חכמי העדה — בתי הפיוס (chachmim.gofreeil.com) הוא בית דין לבוררות ושלום על פי תורת ישראל. המטרה היא לאפשר לצדדים בסכסוך להגיע להכרעה ולפיוס בפני דיינים ומורי הוראה מתנדבים, בהסכמת הצדדים, בלי עלויות של עורכי דין ובלי המתנה של שנים בבית המשפט. לצד זה האתר מבקש לקדם שלום בארץ ולהחזיר לישראל את מושג "חכמי העדה" — מקום אחד המשותף לכלל הפלגים והזרמים.',
            },
            {
                q: 'למי האתר מיועד?',
                a: 'לכל אדם בישראל שנמצא בסכסוך ומעדיף פיוס על התדיינות: סכסוכי שכנים, מחלוקות כספיות ועסקיות, שכירות, שותפות, לשון הרע, שלום בית וסכסוכי משפחה, מחלוקות בוועדי בית ובארגונים. גם מי שמחפש תשובה בהלכה או הכוונה בענייני חיים, ומי שרוצה לחתום על הקוד האתי העולמי — כאדם פרטי, כעסק או כארגון.',
            },
            {
                q: 'מה אפשר למצוא ולעשות באתר?',
                a: 'האתר בנוי מארבעה היכלות. בהיכל המשפט מגישים בקשה לדיון ורואים את לוח הדיונים ואת ארכיון פסקי הדין; בהיכל השלום יש שיעורים והמלצות לשלום בית ולמניעת סכסוכים; בהיכל הרוח מתפרסמים מאמרים מחכמי העדה, כל אחד מאושר בידי שלושה רבנים, וכן ארכיון שאלות ותשובות בהלכה עם אפשרות לשלוח שאלה חדשה; ובהיכל המעשה מוצגת הפעילות הציבורית והקוד האתי העולמי (UECC) עם אינדקס החתומים עליו.',
            },
            {
                q: 'האם השימוש באתר בתשלום?',
                a: 'לא. הדיינים מתנדבים, והדיון בבית הפיוס, שליחת שאלה בהלכה, קריאת הפסקים והמאמרים והחתימה על הקוד האתי — הכול בחינם, בלי אגרות ובלי עלויות משפט. רק פרסום מסחרי באתר (בדף "פרסם אצלנו") הוא שירות בתשלום, וגם הוא עולה לאוויר רק אחרי אישור מנהל.',
            },
            {
                q: 'איך מגישים בקשה לדיון?',
                a: 'נכנסים להיכל המשפט ולוחצים על "בקשה לדיון", ממלאים את פרטי הצדדים ותמצית הסכסוך ובוחרים מועד מלוח הדיונים. לפני שליחת הבקשה מאשרים את הקוד האתי ואת הסכמת הבוררות. הצד השני מוזמן להביע את הסכמתו לדיון — בוררות מחייבת הסכמה של שני הצדדים — ולאחר אישור בית הדין נקבע המועד. הדיון נערך בזום או פנים אל פנים, והפסק ניתן בכתב וניתן לאישור כפסק בורר.',
            },
            {
                q: 'מי עומד מאחורי האתר?',
                a: 'בית הפיוס מופעל על ידי אוסף של דיינים ומורי הוראה מכלל הארץ, שהתאגדו בהתנדבות לקיים את מצוות התורה "שופטים ושוטרים תיתן לך". האתר הוא חלק מרשת האתרים של התנועה החברתית "יוצאים לחירות" (gofreeil.com), ובתוכה הוא ממלא את התפקיד של יישוב סכסוכים, הכרעה הלכתית והקוד האתי המשותף לכל אתרי הרשת.',
            },
            {
                q: 'במה בית הפיוס שונה מבית משפט או ממשרד גישור?',
                a: 'ההליך מבוסס על הסכמה של שני הצדדים ומכוון לפיוס ולא לניצחון של צד אחד. הוא ניתן בהתנדבות ובחינם, בלי עורכי דין, בלי אגרות ובלי המתנה ארוכה. הדיון נערך על פי תורת ישראל, פסקי הדין מתפרסמים בשקיפות בארכיון האתר, וכל הצדדים מקבלים על עצמם את הקוד האתי העולמי כבסיס משותף להתנהלות.',
            },
            {
                q: 'איך יוצרים קשר או מדווחים על בעיה?',
                a: 'דרך הקישור "צור קשר" שבתחתית כל דף, השולח מייל לכתובת freedomhasbegun@gmail.com. שאלות בהלכה או בענייני חיים שולחים בטופס "שאל את חכמי העדה", וסכסוך שמבקשים להביא לדיון מגישים דרך "בקשה לדיון" בהיכל המשפט.',
            },
            {
                q: 'מהו הקוד האתי העולמי (UECC) ולמה חותמים עליו?',
                a: 'הקוד האתי העולמי הוא אמנת יושר ואחריות שאנשים, עסקים וארגונים מקבלים על עצמם. החתימה עליו היא תנאי להגשת בקשה לדיון ולפתיחת האזור האישי באתר, והחתומים מופיעים באינדקס הציבורי של האמנה. כך נוצר בסיס משותף של הגינות בין כל מי שפועל במסגרת בתי הפיוס וברשת "יוצאים לחירות".',
            },
        ],
    },

    en: {
        title: 'About Us',
        intro:
            "Chachmei HaEda — Houses of Reconciliation (chachmim.gofreeil.com) is a court of arbitration and peace according to the Torah of Israel: volunteer-based arbitration, mediation and dispute resolution, with no fees and no litigation costs. Alongside the House of Reconciliation, the site publishes rulings, articles by the sages of Israel, halachic questions and answers, and the Universal Ethical Code of Conduct (UECC). The site is part of the website network of the social movement \"Yotzim LeCherut\" (Going Out to Freedom).",
        faqTitle: 'Questions and Answers',
        moreLink: 'The rabbis and judges, the vision and the operating model',
        faq: [
            {
                q: 'What is "Chachmei HaEda — Houses of Reconciliation" and what is its purpose?',
                a: 'Chachmei HaEda — Houses of Reconciliation (chachmim.gofreeil.com) is a court of arbitration and peace according to the Torah of Israel. Its purpose is to let parties in a dispute reach a decision and reconciliation before volunteer judges and halachic authorities, by mutual consent, without lawyer costs and without years of waiting in court. Beyond that, the site seeks to promote peace in Israel and to restore the concept of "Chachmei HaEda" — one shared place for all legitimate streams and factions.',
            },
            {
                q: 'Who is the site for?',
                a: 'For anyone in Israel who is in a dispute and prefers reconciliation over litigation: neighbor disputes, financial and business disagreements, rentals, partnerships, defamation, domestic peace and family conflicts, disputes in building committees and organizations. Also for anyone seeking a halachic answer or guidance on life matters, and anyone who wishes to sign the Universal Ethical Code — as an individual, a business or an organization.',
            },
            {
                q: 'What can you find and do on the site?',
                a: 'The site is built of four halls. In the Hall of Justice you submit a hearing request and see the hearing calendar and the rulings archive; the Hall of Peace offers lessons and recommendations for domestic peace and conflict prevention; the Hall of Spirit publishes articles by the sages, each approved by three rabbis, plus an archive of halachic questions and answers with an option to send a new question; and the Hall of Action presents the public activity and the Universal Ethical Code (UECC) with the index of its signatories.',
            },
            {
                q: 'Is there a fee for using the site?',
                a: 'No. The judges are volunteers, and the hearing at the House of Reconciliation, sending a halachic question, reading rulings and articles, and signing the ethical code are all free — no fees and no litigation costs. Only commercial advertising on the site (on the "Advertise with us" page) is a paid service, and even that goes live only after administrator approval.',
            },
            {
                q: 'How do you submit a hearing request?',
                a: 'Enter the Hall of Justice and click "Hearing request", fill in the parties\' details and a summary of the dispute, and choose a date from the hearing calendar. Before submitting, you confirm the ethical code and the arbitration consent. The other party is invited to give their consent — arbitration requires the agreement of both sides — and after the court\'s approval the date is set. The hearing is held on Zoom or in person, and the ruling is given in writing and can be confirmed as an arbitration award.',
            },
            {
                q: 'Who is behind the site?',
                a: 'The House of Reconciliation is run by a group of judges and halachic authorities from across the country who joined together voluntarily to fulfill the Torah commandment "Judges and officers shall you appoint". The site is part of the website network of the social movement "Yotzim LeCherut" (gofreeil.com), where it fills the role of dispute resolution, halachic decision-making and the ethical code shared by all the network\'s sites.',
            },
            {
                q: 'How is the House of Reconciliation different from a court or a mediation office?',
                a: 'The process is based on the consent of both parties and aims at reconciliation rather than the victory of one side. It is provided voluntarily and free of charge, without lawyers, fees or long waits. The hearing follows the Torah of Israel, the rulings are published transparently in the site\'s archive, and all parties accept the Universal Ethical Code as a shared basis for conduct.',
            },
            {
                q: 'How do you get in touch or report a problem?',
                a: 'Through the "Contact us" link at the bottom of every page, which sends an email to freedomhasbegun@gmail.com. Halachic or life questions are sent via the "Ask Chachmei HaEda" form, and a dispute you wish to bring to a hearing is submitted through "Hearing request" in the Hall of Justice.',
            },
            {
                q: 'What is the Universal Ethical Code (UECC) and why sign it?',
                a: 'The Universal Ethical Code of Conduct is a charter of honesty and responsibility that individuals, businesses and organizations take upon themselves. Signing it is a condition for submitting a hearing request and for opening a personal area on the site, and signatories appear in the charter\'s public index. This creates a shared foundation of fairness among everyone acting within the Houses of Reconciliation and the "Yotzim LeCherut" network.',
            },
        ],
    },

    ru: {
        title: 'О нас',
        intro:
            'Хахмей а-Эда — Дома примирения (chachmim.gofreeil.com) — это суд арбитража и мира по Торе Израиля: арбитраж, посредничество и разрешение споров на добровольных началах, без пошлин и без судебных расходов. Наряду с Домом примирения сайт публикует судебные решения, статьи мудрецов Израиля, галахические вопросы и ответы и Всемирный этический кодекс (UECC). Сайт входит в сеть сайтов общественного движения «Йоцим ле-херут» («Выходим на свободу»).',
        faqTitle: 'Вопросы и ответы',
        moreLink: 'Раввины и судьи, видение и модель работы',
        faq: [
            {
                q: 'Что такое «Хахмей а-Эда — Дома примирения» и какова его цель?',
                a: 'Хахмей а-Эда — Дома примирения (chachmim.gofreeil.com) — это суд арбитража и мира по Торе Израиля. Его цель — дать сторонам спора возможность прийти к решению и примирению перед судьями и законоучителями-добровольцами, по согласию сторон, без расходов на адвокатов и без многолетнего ожидания в суде. Кроме того, сайт стремится продвигать мир в стране и вернуть Израилю понятие «Хахмей а-Эда» — единое место, общее для всех легитимных течений и направлений.',
            },
            {
                q: 'Для кого предназначен сайт?',
                a: 'Для каждого человека в Израиле, который находится в споре и предпочитает примирение судебной тяжбе: споры с соседями, денежные и деловые разногласия, аренда, партнёрство, клевета, мир в семье и семейные конфликты, споры в домовых комитетах и организациях. Также для тех, кто ищет галахический ответ или наставление в жизненных вопросах, и для тех, кто хочет подписать Всемирный этический кодекс — как частное лицо, бизнес или организация.',
            },
            {
                q: 'Что можно найти и сделать на сайте?',
                a: 'Сайт состоит из четырёх залов. В Зале суда подают запрос на слушание и видят календарь слушаний и архив решений; в Зале мира есть уроки и рекомендации по миру в семье и предотвращению конфликтов; в Зале духа публикуются статьи мудрецов, каждая одобрена тремя раввинами, а также архив галахических вопросов и ответов с возможностью задать новый вопрос; в Зале действия представлена общественная деятельность и Всемирный этический кодекс (UECC) с индексом подписавших.',
            },
            {
                q: 'Платное ли использование сайта?',
                a: 'Нет. Судьи — добровольцы, и слушание в Доме примирения, отправка галахического вопроса, чтение решений и статей и подписание этического кодекса — всё бесплатно, без пошлин и судебных расходов. Только коммерческая реклама на сайте (на странице «Разместить рекламу») является платной услугой, и даже она публикуется только после одобрения администратора.',
            },
            {
                q: 'Как подать запрос на слушание?',
                a: 'Зайдите в Зал суда и нажмите «Запрос на слушание», заполните данные сторон и краткое описание спора и выберите дату из календаря слушаний. Перед отправкой вы подтверждаете этический кодекс и согласие на арбитраж. Вторая сторона приглашается дать своё согласие — арбитраж требует согласия обеих сторон, — и после одобрения судом назначается дата. Слушание проходит в Zoom или лично, а решение выдаётся в письменном виде и может быть утверждено как арбитражное решение.',
            },
            {
                q: 'Кто стоит за сайтом?',
                a: 'Дом примирения ведёт группа судей и законоучителей со всей страны, объединившихся на добровольных началах, чтобы исполнить заповедь Торы «Судей и надзирателей поставь себе». Сайт входит в сеть сайтов общественного движения «Йоцим ле-херут» (gofreeil.com), где выполняет роль разрешения споров, галахических решений и этического кодекса, общего для всех сайтов сети.',
            },
            {
                q: 'Чем Дом примирения отличается от суда или бюро медиации?',
                a: 'Процесс основан на согласии обеих сторон и направлен на примирение, а не на победу одной из сторон. Он проводится добровольно и бесплатно, без адвокатов, пошлин и долгого ожидания. Слушание проходит по Торе Израиля, решения прозрачно публикуются в архиве сайта, и все стороны принимают Всемирный этический кодекс как общую основу поведения.',
            },
            {
                q: 'Как связаться или сообщить о проблеме?',
                a: 'Через ссылку «Связаться с нами» внизу каждой страницы, которая отправляет письмо на адрес freedomhasbegun@gmail.com. Галахические и жизненные вопросы отправляют через форму «Спросить Хахмей а-Эда», а спор, который вы хотите вынести на слушание, подают через «Запрос на слушание» в Зале суда.',
            },
            {
                q: 'Что такое Всемирный этический кодекс (UECC) и зачем его подписывать?',
                a: 'Всемирный этический кодекс — это хартия честности и ответственности, которую принимают на себя люди, бизнесы и организации. Его подписание — условие для подачи запроса на слушание и для открытия личного кабинета на сайте, а подписавшие отображаются в публичном индексе хартии. Так создаётся общая основа порядочности между всеми, кто действует в рамках Домов примирения и сети «Йоцим ле-херут».',
            },
        ],
    },

    es: {
        title: 'Quiénes somos',
        intro:
            'Jajmei HaEdá — Casas de Reconciliación (chachmim.gofreeil.com) es un tribunal de arbitraje y paz según la Torá de Israel: arbitraje, mediación y resolución de conflictos de forma voluntaria, sin tasas y sin costos judiciales. Junto a la Casa de Reconciliación, el sitio publica fallos, artículos de los sabios de Israel, preguntas y respuestas de halajá y el Código Ético Universal (UECC). El sitio forma parte de la red de sitios del movimiento social "Yotzim LeJerut" (Salimos a la libertad).',
        faqTitle: 'Preguntas y respuestas',
        moreLink: 'Los rabinos y jueces, la visión y el modelo de funcionamiento',
        faq: [
            {
                q: '¿Qué es "Jajmei HaEdá — Casas de Reconciliación" y cuál es su propósito?',
                a: 'Jajmei HaEdá — Casas de Reconciliación (chachmim.gofreeil.com) es un tribunal de arbitraje y paz según la Torá de Israel. Su propósito es permitir que las partes en conflicto lleguen a una decisión y a la reconciliación ante jueces y autoridades halájicas voluntarios, con el consentimiento de las partes, sin costos de abogados y sin años de espera en los tribunales. Además, el sitio busca promover la paz en el país y devolver a Israel el concepto de "Jajmei HaEdá": un único lugar común a todas las corrientes y facciones legítimas.',
            },
            {
                q: '¿A quién está dirigido el sitio?',
                a: 'A toda persona en Israel que se encuentre en un conflicto y prefiera la reconciliación al litigio: disputas entre vecinos, desacuerdos económicos y comerciales, alquileres, sociedades, difamación, paz en el hogar y conflictos familiares, disputas en comités de edificios y organizaciones. También a quien busca una respuesta halájica u orientación en asuntos de la vida, y a quien desea firmar el Código Ético Universal, como particular, empresa u organización.',
            },
            {
                q: '¿Qué se puede encontrar y hacer en el sitio?',
                a: 'El sitio está compuesto por cuatro salas. En la Sala de Justicia se presenta una solicitud de audiencia y se ven el calendario de audiencias y el archivo de fallos; la Sala de la Paz ofrece lecciones y recomendaciones para la paz en el hogar y la prevención de conflictos; la Sala del Espíritu publica artículos de los sabios, cada uno aprobado por tres rabinos, además de un archivo de preguntas y respuestas de halajá con la opción de enviar una nueva pregunta; y la Sala de la Acción presenta la actividad pública y el Código Ético Universal (UECC) con el índice de sus firmantes.',
            },
            {
                q: '¿El uso del sitio es de pago?',
                a: 'No. Los jueces son voluntarios, y la audiencia en la Casa de Reconciliación, el envío de una pregunta halájica, la lectura de fallos y artículos y la firma del código ético son gratuitos, sin tasas ni costos judiciales. Solo la publicidad comercial en el sitio (en la página "Anúnciate con nosotros") es un servicio de pago, y aun así se publica únicamente tras la aprobación de un administrador.',
            },
            {
                q: '¿Cómo se presenta una solicitud de audiencia?',
                a: 'Se entra en la Sala de Justicia y se pulsa "Solicitud de audiencia", se completan los datos de las partes y un resumen del conflicto y se elige una fecha del calendario de audiencias. Antes de enviar, se confirman el código ético y el consentimiento de arbitraje. La otra parte es invitada a dar su consentimiento (el arbitraje requiere el acuerdo de ambas partes) y, tras la aprobación del tribunal, se fija la fecha. La audiencia se realiza por Zoom o en persona, y el fallo se entrega por escrito y puede homologarse como laudo arbitral.',
            },
            {
                q: '¿Quién está detrás del sitio?',
                a: 'La Casa de Reconciliación es dirigida por un grupo de jueces y autoridades halájicas de todo el país que se unieron de forma voluntaria para cumplir el mandamiento de la Torá "Jueces y oficiales pondrás para ti". El sitio forma parte de la red de sitios del movimiento social "Yotzim LeJerut" (gofreeil.com), donde cumple la función de resolución de conflictos, decisiones halájicas y el código ético común a todos los sitios de la red.',
            },
            {
                q: '¿En qué se diferencia la Casa de Reconciliación de un tribunal o de una oficina de mediación?',
                a: 'El proceso se basa en el consentimiento de ambas partes y busca la reconciliación, no la victoria de una de ellas. Se ofrece de forma voluntaria y gratuita, sin abogados, sin tasas y sin largas esperas. La audiencia se rige por la Torá de Israel, los fallos se publican con transparencia en el archivo del sitio y todas las partes aceptan el Código Ético Universal como base común de conducta.',
            },
            {
                q: '¿Cómo se contacta o se informa de un problema?',
                a: 'A través del enlace "Contáctanos" al pie de cada página, que envía un correo a freedomhasbegun@gmail.com. Las preguntas de halajá o de la vida se envían mediante el formulario "Pregunta a Jajmei HaEdá", y un conflicto que se desea llevar a audiencia se presenta mediante "Solicitud de audiencia" en la Sala de Justicia.',
            },
            {
                q: '¿Qué es el Código Ético Universal (UECC) y por qué firmarlo?',
                a: 'El Código Ético Universal es una carta de honestidad y responsabilidad que personas, empresas y organizaciones asumen. Firmarlo es condición para presentar una solicitud de audiencia y para abrir el área personal del sitio, y los firmantes aparecen en el índice público de la carta. Así se crea una base común de integridad entre todos los que actúan en el marco de las Casas de Reconciliación y de la red "Yotzim LeJerut".',
            },
        ],
    },

    ps: {
        title: 'زموږ په اړه',
        intro:
            'د عدې حکیمان — د روغې جوړې کورونه (chachmim.gofreeil.com) د اسرائیلو د تورات له مخې د منځګړیتوب او سولې محکمه ده: په داوطلبانه توګه منځګړیتوب، میانجیګري او د شخړو حل، پرته له فیس او پرته له قضایي لګښتونو. د روغې جوړې کور تر څنګ، سایټ پرېکړې، د اسرائیلو د حکیمانو مقالې، د هلاخا پوښتنې او ځوابونه او نړیوال اخلاقي کوډ (UECC) خپروي. سایټ د ټولنیز غورځنګ «یوتسیم لحیروت» (آزادۍ ته وتل) د سایټونو د شبکې برخه ده.',
        faqTitle: 'پوښتنې او ځوابونه',
        moreLink: 'ربانیان او قاضیان، لیدلوری او د کار ماډل',
        faq: [
            {
                q: '«د عدې حکیمان — د روغې جوړې کورونه» څه دي او موخه یې څه ده؟',
                a: 'د عدې حکیمان — د روغې جوړې کورونه (chachmim.gofreeil.com) د اسرائیلو د تورات له مخې د منځګړیتوب او سولې محکمه ده. موخه یې دا ده چې د شخړې اړخونه د داوطلب قاضیانو او د هلاخا استادانو په وړاندې، د اړخونو په رضایت، پرته له وکیلانو لګښتونو او پرته له کلونو انتظار څخه پرېکړې او روغې جوړې ته ورسیږي. سربېره پر دې، سایټ غواړي په هېواد کې سوله وده ورکړي او د «د عدې حکیمان» مفهوم اسرائیلو ته بېرته راولي — یو ګډ ځای د ټولو مشروعو ډلو او جریانونو لپاره.',
            },
            {
                q: 'سایټ د چا لپاره دی؟',
                a: 'په اسرائیلو کې د هر هغه کس لپاره چې په شخړه کې دی او روغه جوړه پر محکمه غوره ګڼي: د ګاونډیانو شخړې، مالي او سوداګریزې اختلافونه، کرایه، شراکت، بدنامي، د کور سوله او کورنۍ شخړې، په ودانۍ کمیټو او سازمانونو کې اختلافونه. همدارنګه د هغه چا لپاره چې د هلاخا ځواب یا د ژوند په چارو کې لارښوونه غواړي، او هغه څوک چې غواړي نړیوال اخلاقي کوډ لاسلیک کړي — د فرد، سوداګرۍ یا سازمان په توګه.',
            },
            {
                q: 'په سایټ کې څه موندلی او کولی شو؟',
                a: 'سایټ له څلورو تالارونو جوړ دی. د عدالت په تالار کې د اورېدنې غوښتنه وړاندې کوئ او د اورېدنو جنتري او د پرېکړو ارشیف ګورئ؛ د سولې تالار د کور د سولې او د شخړو د مخنیوي لپاره درسونه او سپارښتنې لري؛ د روح تالار د حکیمانو مقالې خپروي چې هره یوه د درېو ربانیانو له خوا تایید شوې، او همدارنګه د هلاخا د پوښتنو او ځوابونو ارشیف د نوې پوښتنې د لېږلو امکان سره؛ او د عمل تالار عامه فعالیت او نړیوال اخلاقي کوډ (UECC) د لاسلیک کوونکو له شاخص سره وړاندې کوي.',
            },
            {
                q: 'آیا د سایټ کارول پیسې غواړي؟',
                a: 'نه. قاضیان داوطلب دي، او د روغې جوړې په کور کې اورېدنه، د هلاخا پوښتنې لېږل، د پرېکړو او مقالو لوستل او د اخلاقي کوډ لاسلیک — ټول وړیا دي، پرته له فیس او قضایي لګښتونو. یوازې په سایټ کې سوداګریز اعلانات (د «زموږ سره اعلان وکړئ» په پاڼه کې) پیسو سره خدمت دی، او هغه هم یوازې د مدیر له تایید وروسته خپرېږي.',
            },
            {
                q: 'د اورېدنې غوښتنه څنګه وړاندې کوو؟',
                a: 'د عدالت تالار ته ننوځئ او «د اورېدنې غوښتنه» کلیک کړئ، د اړخونو معلومات او د شخړې لنډیز ډک کړئ او د اورېدنو له جنترۍ نېټه وټاکئ. له لېږلو مخکې اخلاقي کوډ او د منځګړیتوب رضایت تاییدوئ. بل اړخ ته بلنه ورکول کېږي چې خپل رضایت څرګند کړي — منځګړیتوب د دواړو اړخونو موافقې ته اړتیا لري — او د محکمې له تایید وروسته نېټه ټاکل کېږي. اورېدنه په زوم یا مخامخ ترسره کېږي، او پرېکړه په لیکلې بڼه ورکول کېږي او د منځګړیتوب د پرېکړې په توګه تایید کېدای شي.',
            },
            {
                q: 'د سایټ تر شا څوک دی؟',
                a: 'د روغې جوړې کور د هېواد له ټولو برخو د قاضیانو او د هلاخا د استادانو یوې ډلې لخوا چلول کېږي چې په داوطلبانه توګه سره یوځای شوي ترڅو د تورات امر «قاضیان او افسران به ځان ته وټاکې» عملي کړي. سایټ د ټولنیز غورځنګ «یوتسیم لحیروت» (gofreeil.com) د سایټونو د شبکې برخه ده، چې په هغې کې د شخړو د حل، د هلاخا د پرېکړو او د شبکې د ټولو سایټونو د ګډ اخلاقي کوډ دنده ترسره کوي.',
            },
            {
                q: 'د روغې جوړې کور له محکمې یا د میانجیګرۍ له دفتر څه توپیر لري؟',
                a: 'بهیر د دواړو اړخونو پر رضایت ولاړ دی او موخه یې روغه جوړه ده، نه د یوه اړخ بریا. دا په داوطلبانه توګه او وړیا وړاندې کېږي، پرته له وکیلانو، فیسونو او اوږد انتظار. اورېدنه د اسرائیلو د تورات له مخې ترسره کېږي، پرېکړې په روڼتیا سره د سایټ په ارشیف کې خپرېږي، او ټول اړخونه نړیوال اخلاقي کوډ د چلند د ګډ بنسټ په توګه مني.',
            },
            {
                q: 'څنګه اړیکه ونیسو یا ستونزه راپور کړو؟',
                a: 'د هرې پاڼې په پای کې د «موږ سره اړیکه» له لینک له لارې، چې freedomhasbegun@gmail.com پتې ته برېښنالیک لېږي. د هلاخا یا د ژوند پوښتنې د «د عدې له حکیمانو وپوښتئ» د فورمې له لارې لېږل کېږي، او هغه شخړه چې غواړئ اورېدنې ته یې راوړئ د عدالت په تالار کې د «د اورېدنې غوښتنه» له لارې وړاندې کېږي.',
            },
            {
                q: 'نړیوال اخلاقي کوډ (UECC) څه دی او ولې یې لاسلیک کوو؟',
                a: 'نړیوال اخلاقي کوډ د صداقت او مسؤلیت منشور دی چې کسان، سوداګرۍ او سازمانونه یې پر ځان مني. د هغه لاسلیک د اورېدنې د غوښتنې وړاندې کولو او په سایټ کې د شخصي برخې پرانیستلو شرط دی، او لاسلیک کوونکي د منشور په عامه شاخص کې ښکاري. په دې توګه د روغې جوړې د کورونو او د «یوتسیم لحیروت» د شبکې په چوکاټ کې د ټولو فعالینو ترمنځ د انصاف ګډ بنسټ رامنځته کېږي.',
            },
        ],
    },
};

/** תוכן דף האודות לפי שפת הממשק, עם נפילה לעברית. */
export function aboutContentFor(locale: string | null | undefined): AboutContent {
    const key = (locale ?? 'he').slice(0, 2) as AboutLocale;
    return ABOUT_CONTENT[key] ?? ABOUT_CONTENT.he;
}

/** השו"ת בעברית — לשימוש בטקסטים לזחלנים (llms.txt וכדומה). */
export const ABOUT_FAQ: FaqItem[] = ABOUT_CONTENT.he.faq;
