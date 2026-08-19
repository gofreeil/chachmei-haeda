<script lang="ts">
    import { SITE_NAME, DEFAULT_OG_IMAGE, CONTACT_EMAIL, canonical } from '$lib/seo';
    // דף "פרסמו אצלנו" מקומי — אליו מופנים מתעניינים מהמודעות עצמן
    // (טור הדסקטופ והפופ-אפ בנייד) ומהפוטר. פורט מפינת האבדות והולבש
    // על ערכת הקלף הבהירה של חכמי העדה.
    const email = CONTACT_EMAIL;
    // הבילדר המקומי — שם מעצבים את הפרסומת, משלמים, והמודעה
    // עוברת אישור מנהל (/admin/ads) לפני שהיא עולה.
    const builderUrl = '/about/advertise/builder';
    const mailto =
        `mailto:${email}` +
        `?subject=${encodeURIComponent('פרסום באתר חכמי העדה')}` +
        `&body=${encodeURIComponent(
            'שלום,\nאשמח לפרסם באתר חכמי העדה.\n\n' +
            'שם העסק / הארגון:\n' +
            'טלפון לחזרה:\n' +
            'המסלול המבוקש:\n'
        )}`;

    // המחירון — מקור אמת יחיד ב-$lib/adPlans (משותף לבילדר, לשרת ולמסך האישור)
    import { adPlans } from '$lib/adPlans';
    import { setAdIntent } from '$lib/adIntent';

    // איפה הפרסומת מופיעה — שתי במות תצוגה:
    // בדסקטופ בטור הימני, ובנייד בפופ-אפ שנפתח לגולש.
    const placements = [
        {
            icon: '🖥️',
            title: 'בדסקטופ — הטור הימני',
            where: 'עמודה קבועה בצד ימין של האתר, בכל הדפים',
            points: [
                'מוצגת לכל גולשי הדסקטופ לאורך כל הביקור',
                'המודעות מתחלפות במחזור — כל מודעה מקבלת את הבמה',
                'נשארת על המסך גם בזמן גלילה',
            ],
        },
        {
            icon: '📱',
            title: 'בנייד — פופ-אפ ממוקד',
            where: 'אותה פרסומת, בחלונית מסך-מלא',
            points: [
                'נפתחת לגולש ברגעי המעבר בין תכנים — חשיפה מלאה',
                'מפרסמים משולמים מקבלים עדיפות על פרסומות הרשת',
                'לחיצה על המודעה מובילה לדף הנחיתה שלכם',
            ],
        },
    ];
</script>

<svelte:head>
    <title>פרסום באתר חכמי העדה — חשיפה לקהילה</title>
    <meta name="description" content="פרסום באתר חכמי העדה — טור פרסומות בדסקטופ ופופ-אפ בנייד. מעצבים את הפרסומת ישירות באתר, משלמים, והמודעה עולה מיד אחרי אישור מנהל." />
    <link rel="canonical" href={canonical('/about/advertise')} />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:title" content="פרסמו אצלנו — {SITE_NAME}" />
    <meta property="og:url" content={canonical('/about/advertise')} />
    <meta property="og:image" content={DEFAULT_OG_IMAGE} />
    <meta property="og:locale" content="he_IL" />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8 md:py-12" dir="rtl">

    <!-- באנר אחד — כל התוכן בקופסת קלף אחת, ההפרדה בקווים פנימיים -->
    <div class="rounded-3xl border border-[#d9c07a] bg-[#fffbe9] shadow-xl overflow-hidden">

    <!-- כותרת -->
    <div class="p-6 md:p-10 text-center">
        <div class="text-5xl mb-4">📢</div>
        <h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 bg-clip-text text-transparent mb-3">
            פרסמו בחכמי העדה
        </h1>
        <p class="text-[#5b4a1e] text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            גולשים מגיעים לכאן ללמוד, לשאול ולפנות לבית הדין לבוררות ושלום.
            המודעה שלכם פוגשת אותם בדיוק ברגעי העיון — וההכנסות מהפרסום
            עוזרות להחזיק את האתר פתוח לציבור.
        </p>
    </div>

    <!-- איפה הפרסומת מופיעה — מופרדים בקווים פנימיים מקוצרים -->
    <div class="mx-8 md:mx-12 border-t border-[#e6d194]"></div>
    <div class="grid md:grid-cols-2">
        {#each placements as p, i (p.title)}
            <div class="relative p-6 flex flex-col">
                {#if i === 1}
                    <div class="absolute top-0 right-8 left-8 border-t border-[#e6d194] md:top-6 md:bottom-6 md:right-0 md:left-auto md:border-t-0 md:border-r" aria-hidden="true"></div>
                {/if}
                <div class="text-4xl mb-3">{p.icon}</div>
                <h2 class="text-xl font-black text-amber-950 mb-1">{p.title}</h2>
                <p class="text-sm text-amber-800 font-bold mb-4">{p.where}</p>
                <ul class="space-y-2">
                    {#each p.points as point}
                        <li class="text-sm text-[#5b4a1e] flex items-start gap-2 leading-relaxed">
                            <span class="text-green-700 flex-shrink-0">✓</span>
                            {point}
                        </li>
                    {/each}
                </ul>
            </div>
        {/each}
    </div>

    <!-- איך מפרסמים -->
    <div class="mx-8 md:mx-12 border-t border-[#e6d194]"></div>
    <div class="p-6 md:p-8 text-center">
        <h2 class="text-2xl font-black text-amber-950 mb-6">איך מפרסמים?</h2>
        <ol class="text-right max-w-md mx-auto space-y-4 mb-8">
            <li class="flex items-start gap-3">
                <span class="w-7 h-7 rounded-full bg-amber-500 text-black text-sm font-black flex items-center justify-center flex-shrink-0">1</span>
                <span class="text-[#4a3a14] text-sm md:text-base leading-relaxed">מעצבים את הפרסומת בקלות ישירות על האתר.</span>
            </li>
            <li class="flex items-start gap-3">
                <span class="w-7 h-7 rounded-full bg-amber-500 text-black text-sm font-black flex items-center justify-center flex-shrink-0">2</span>
                <span class="text-[#4a3a14] text-sm md:text-base leading-relaxed">בוחרים תקופת פרסום ומשלמים מראש.</span>
            </li>
            <li class="flex items-start gap-3">
                <span class="w-7 h-7 rounded-full bg-amber-500 text-black text-sm font-black flex items-center justify-center flex-shrink-0">3</span>
                <span class="text-[#4a3a14] text-sm md:text-base leading-relaxed">הפרסומת עוברת אישור מנהל — ומיד עולה לאוויר.</span>
            </li>
        </ol>
        <!-- הגעה מדף המחירים = רכישת מודעה *נוספת*, לא עריכה של הקיימת.
             בלי הסימון הזה השרת מזהה "מפרסם חוזר" והאישור מוריד את המודעה
             שכבר רצה - גם כשהמפרסם שילם בכוונה על שתיים. -->
        <a
            href={builderUrl}
            onclick={() => setAdIntent('new')}
            class="inline-block rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 px-8 py-4 font-black text-white text-lg shadow-xl transition hover:opacity-90 hover:scale-[1.02]"
        >
            🎨 לעיצוב הפרסומת
        </a>
        <p class="mt-4 text-sm text-[#5b4a1e]">
            כבר יש לכם פרסומת?
            <a href="/about/advertise/manage" class="font-bold text-amber-800 underline hover:text-amber-600 transition-colors">
                לנתונים ולעריכה בדשבורד שלכם ←
            </a>
        </p>
        <p class="mt-3 text-xs text-[#8a7443]">
            שאלות? כתבו לנו:
            <a href={mailto} class="underline hover:text-amber-900 transition-colors" dir="ltr">{email}</a>
        </p>
    </div>

    <!-- מחירון — לבחור ולשלם מראש -->
    <div class="mx-8 md:mx-12 border-t border-[#e6d194]"></div>
    <div class="p-6 md:p-8" id="plans">
        <h2 class="text-2xl font-black text-amber-950 mb-2 text-center">לבחור ולשלם מראש</h2>
        <p class="text-sm text-[#5b4a1e] text-center mb-6">בוחרים תקופה, משלמים מראש — והמודעה רצה עד סופה.</p>
        <ul class="max-w-md mx-auto space-y-2">
            {#each adPlans as plan (plan.days)}
                <li class="flex items-baseline justify-between gap-3 rounded-xl bg-[#f7edcf] border border-[#e6d194] px-4 py-3">
                    <span class="text-[#4a3a14] text-sm md:text-base">{plan.title}</span>
                    <span class="text-amber-800 font-black text-base md:text-lg whitespace-nowrap">{plan.price} ₪</span>
                </li>
            {/each}
        </ul>
        <p class="mt-5 text-center text-sm text-[#5b4a1e]">
            <a href="/about/advertise/terms" class="underline hover:text-amber-900 transition-colors">📜 תנאי הפרסום</a>
            — מומלץ לקרוא לפני התשלום
        </p>
    </div>

    </div><!-- /הבאנר האחד -->
</div>
