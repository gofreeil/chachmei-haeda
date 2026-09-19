<script lang="ts">
    // ============================================================
    // Seo.svelte — כל תגי ה-SEO של דף בשורה אחת.
    // מזריק title, description, canonical, robots, Open Graph ו-Twitter Card.
    // תגי OG פר-דף מוגדרים כאן ולא ב-app.html, כדי שכל דף ישותף עם הכותרת
    // והכתובת שלו (ולא של דף הבית) וכדי שלא ייווצרו תגים כפולים.
    // ============================================================
    import { SITE_NAME, DEFAULT_OG_IMAGE, canonical, PARENT_BRAND } from '$lib/seo';

    let {
        title,
        description,
        path = '/',
        image = DEFAULT_OG_IMAGE,
        type = 'website',
        keywords = '',
        noindex = false,
    }: {
        title: string;
        description: string;
        path?: string;
        image?: string;
        type?: string;
        keywords?: string;
        noindex?: boolean;
    } = $props();

    const url = $derived(canonical(path));
    /** כל כותרת מסתיימת ב"| יוצאים לחירות" — כמו בשאר אתרי הרשת. בלי זה גוגל לא
     *  מקשר בין התנועה לאתר, וחיפוש "יוצאים לחירות חכמי העדה" מוביל לאתרים זרים. */
    const fullTitle = $derived(title.includes(PARENT_BRAND) ? title : `${title} | ${PARENT_BRAND}`);
    const robots = $derived(
        noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1',
    );
</script>

<svelte:head>
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={url} />
    <meta name="robots" content={robots} />
    {#if keywords}<meta name="keywords" content={keywords} />{/if}
    <meta property="og:type" content={type} />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:locale" content="he_IL" />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={fullTitle} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
</svelte:head>
