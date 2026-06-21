export type LocalizedText = { he: string; en: string; ru: string };

export const pickLang = (v: any, l: string | null | undefined): string =>
    typeof v === 'string' ? v : (v?.[l ?? 'he'] ?? v?.he ?? '');

export interface Ad {
    id: number;
    title: LocalizedText;
    description: LocalizedText;
    cta: LocalizedText;
    href: string;
    image: string;
    color: string;
    imageHeight?: string;   // גובה מותאם לתמונה (ברירת מחדל: auto)
    imageScale?: number;    // זום על התמונה (ברירת מחדל: 1)
    hover?: LocalizedText;  // טקסט tooltip בריחוף מעל כפתור ה-CTA
}

export const ads: Ad[] = [
    {
        id: 1,
        title: {
            he: "קהילה בשכונה",
            en: "Neighborhood Community",
            ru: "Соседская община"
        },
        description: {
            he: "האתר השכונתי המוביל - חיבור תושבים, גמ\"חים, חוגים ועוד",
            en: "The leading neighborhood site — connecting residents, free-loan funds, classes and more",
            ru: "Ведущий соседский сайт — объединяет жителей, благотворительные фонды, кружки и многое другое"
        },
        cta: {
            he: "תהנה מכל היתרונות של הקהילה בשכונה שלך",
            en: "Enjoy all the benefits of the community in your neighborhood",
            ru: "Пользуйтесь всеми преимуществами общины в вашем районе"
        },
        href: "https://community-il.vercel.app/",
        image: "/images/community-neighborhood.png",
        color: "from-blue-500 to-purple-600"
    },
    {
        id: 9,
        title: {
            he: 'הגמ"ח הארצי',
            en: 'The National Gemach',
            ru: 'Национальный гмах'
        },
        description: {
            he: 'כל הגמחים תחת קורת גג אחת',
            en: 'All the gemachs (free-loan funds) under one roof',
            ru: 'Все гмахи (благотворительные фонды) под одной крышей'
        },
        cta: {
            he: 'לאתר הגמ"ח הארצי',
            en: 'To the National Gemach site',
            ru: 'На сайт Национального гмаха'
        },
        hover: {
            he: 'מצא כל גמח בקלות!',
            en: 'Find any gemach easily!',
            ru: 'Легко найдите любой гмах!'
        },
        href: "https://national-gemach.vercel.app/",
        image: "/images/gemach-harzi.png",
        color: "from-pink-600 via-fuchsia-600 to-purple-700",
    },
    {
        id: 2,
        title: {
            he: "ועדי שכונות",
            en: "Neighborhood Committees",
            ru: "Соседские комитеты"
        },
        description: {
            he: "מהפכת משילות העם על המוסדות",
            en: "The revolution of public governance over institutions",
            ru: "Революция народного управления над учреждениями"
        },
        cta: {
            he: "הכר והשתתף במהפכת משילות העם על מוסדותיו",
            en: "Learn about and join the revolution of public governance over its institutions",
            ru: "Узнайте и присоединяйтесь к революции народного управления своими учреждениями"
        },
        href: "https://neighborhoods-il.vercel.app/",
        image: "/images/news/vaadei-shchunot.png",
        color: "from-blue-600 to-cyan-600"
    },
    {
        id: 5,
        title: {
            he: "מבקר רשויות המדינה",
            en: "State Authorities Auditor",
            ru: "Контролёр государственных органов"
        },
        description: {
            he: "מבקרים את הרשויות, ממצים את זכות התושב",
            en: "Auditing the authorities, securing the resident's rights",
            ru: "Контролируем власти, отстаиваем права жителей"
        },
        cta: {
            he: "מבקרים את הרשויות, ממצים את זכות התושב",
            en: "Auditing the authorities, securing the resident's rights",
            ru: "Контролируем власти, отстаиваем права жителей"
        },
        href: "https://criticism.vercel.app/",
        image: "/images/mevaker-rashuyot.png",
        color: "from-blue-700 to-indigo-700",
        imageHeight: "120px",
        imageScale: 1.2,
    },
    {
        id: 10,
        title: {
            he: "דירוג ציבורי",
            en: "Public Rating",
            ru: "Народный рейтинг"
        },
        description: {
            he: "העם מדרג את הרשויות ועובדי הציבור",
            en: "The public rates the authorities and public servants",
            ru: "Народ оценивает власти и государственных служащих"
        },
        cta: {
            he: "העם מדרג את הרשויות ועובדי הציבור",
            en: "The public rates the authorities and public servants",
            ru: "Народ оценивает власти и государственных служащих"
        },
        href: "https://public-rating-il.vercel.app/",
        image: "/images/public-rating.jpeg",
        color: "from-indigo-600 to-blue-600",
        imageHeight: "200px",
        imageScale: 0.9,
    },
    {
        id: 8,
        title: {
            he: "משאלי העם",
            en: "Public Referendums",
            ru: "Народные референдумы"
        },
        description: {
            he: "הבע דעתך על הסוגיות האקטואליות",
            en: "Voice your opinion on the current issues",
            ru: "Выскажите своё мнение по актуальным вопросам"
        },
        cta: {
            he: "הבע דעתך על הסוגיות האקטואליות",
            en: "Voice your opinion on the current issues",
            ru: "Выскажите своё мнение по актуальным вопросам"
        },
        hover: {
            he: "הבע דעתך על הסוגיות האקטואליות",
            en: "Voice your opinion on the current issues",
            ru: "Выскажите своё мнение по актуальным вопросам"
        },
        href: "https://referendum-il.vercel.app/",
        image: "/images/referendum.png",
        color: "from-purple-600 to-indigo-700"
    },
    {
        id: 3,
        title: {
            he: "קבוצת רכישה",
            en: "Group Purchasing",
            ru: "Закупочная группа"
        },
        description: {
            he: "הוזל את ההוצאות שלך",
            en: "Reduce your expenses",
            ru: "Снизьте свои расходы"
        },
        cta: {
            he: "הצטרף לקבוצת הרכישה שלנו והוזל מיד את ההוצאות!",
            en: "Join our purchasing group and cut your expenses right away!",
            ru: "Присоединяйтесь к нашей закупочной группе и сразу же сократите расходы!"
        },
        href: "https://purchasing-groups.vercel.app/",
        image: "/images/whatsapp_cta.png",
        color: "from-green-800 to-emerald-900"
    },
    {
        id: 6,
        title: {
            he: "בעלי מקצוע כשירים",
            en: "Qualified Professionals",
            ru: "Квалифицированные специалисты"
        },
        description: {
            he: "חתמו על תנאי הקהילה ונותנים לנו הנחות והטבות יחודיות",
            en: "They have signed our community terms and offer us unique discounts and benefits",
            ru: "Подписали условия общины и предоставляют нам уникальные скидки и льготы"
        },
        cta: {
            he: "מחפש בעל מקצוע איכותי באזורך?",
            en: "Looking for a quality professional in your area?",
            ru: "Ищете качественного специалиста в вашем районе?"
        },
        href: "https://index-chi-sage.vercel.app/",
        image: "/images/professionals.png",
        color: "from-yellow-500 to-orange-500"
    },
    {
        id: 11,
        title: {
            he: "החנות החברתית",
            en: "The Social Store",
            ru: "Социальный магазин"
        },
        description: {
            he: "מוצרים נבחרים לבריאות טבעית, חקלאות ביתית, טכנולוגיה ועוד",
            en: "Selected products for natural health, home agriculture, technology and more",
            ru: "Избранные товары для натурального здоровья, домашнего хозяйства, технологий и многого другого"
        },
        cta: {
            he: "כנסו לחנות לחיים טובים יותר",
            en: "Enter the store for a better life",
            ru: "Зайдите в магазин для лучшей жизни"
        },
        hover: {
            he: "החנות שלנו!",
            en: "Our store!",
            ru: "Наш магазин!"
        },
        href: "https://heirut-shop.vercel.app/",
        image: "/images/freedom-store.png",
        color: "from-emerald-600 to-teal-700"
    }
];
