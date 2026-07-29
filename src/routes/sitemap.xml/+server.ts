// ============================================================
// sitemap.xml — מפת האתר. כוללת את כל הדפים הציבוריים וכל מאמר בנפרד
// (סטטיים + מה שמנוהל ב-Strapi), כדי שגוגל יגלה וימפה כל דף תוכן.
// ============================================================

import type { RequestHandler } from './$types';
import { SITE_URL } from '$lib/seo';
import { articles as staticArticles } from '$lib/data/articles';
import { loadArticles } from '$lib/services/articles-service';

export const prerender = false;

interface SitemapUrl {
    loc: string;
    changefreq: string;
    priority: string;
    lastmod?: string;
}

/** בריחת תווים אסורים ב-XML */
function xmlEscape(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async ({ setHeaders }) => {
    // מאמרים: קודם מהבאקאנד (כולל חדשים שנוספו בפאנל), ואם הוא לא זמין —
    // הרשימה הסטטית, כדי שמפת האתר לא תתרוקן בגלל תקלת רשת.
    let articles = staticArticles.map((a) => ({ slug: a.slug, date: a.date }));
    try {
        const fromBackend = await loadArticles();
        if (fromBackend.length) articles = fromBackend.map((a) => ({ slug: a.slug, date: a.date }));
    } catch {
        /* נשארים עם הסטטיים */
    }

    const staticUrls: SitemapUrl[] = [
        { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
        { loc: `${SITE_URL}/heichal-hamishpat`, changefreq: 'weekly', priority: '0.9' },
        { loc: `${SITE_URL}/heichal-hashalom`, changefreq: 'weekly', priority: '0.8' },
        { loc: `${SITE_URL}/heichal-hashalom/lessons`, changefreq: 'weekly', priority: '0.7' },
        { loc: `${SITE_URL}/heichal-hashalom/recommendations`, changefreq: 'weekly', priority: '0.7' },
        { loc: `${SITE_URL}/heichal-hamaaseh/activity`, changefreq: 'weekly', priority: '0.8' },
        { loc: `${SITE_URL}/heichal-hamaaseh/ethical-code`, changefreq: 'monthly', priority: '0.8' },
        { loc: `${SITE_URL}/articles`, changefreq: 'weekly', priority: '0.9' },
        { loc: `${SITE_URL}/qa`, changefreq: 'weekly', priority: '0.9' },
        { loc: `${SITE_URL}/ask`, changefreq: 'monthly', priority: '0.7' },
        { loc: `${SITE_URL}/rulings`, changefreq: 'weekly', priority: '0.8' },
        { loc: `${SITE_URL}/hearings`, changefreq: 'daily', priority: '0.8' },
        { loc: `${SITE_URL}/charter-index`, changefreq: 'weekly', priority: '0.6' },
        { loc: `${SITE_URL}/about/revenue`, changefreq: 'monthly', priority: '0.5' },
    ];

    const articleUrls: SitemapUrl[] = articles
        .filter((a) => a.slug)
        .map((a) => ({
            loc: `${SITE_URL}/articles/${encodeURIComponent(a.slug)}`,
            lastmod: a.date || undefined,
            changefreq: 'monthly',
            priority: '0.7',
        }));

    const urls = [...staticUrls, ...articleUrls];

    const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
            .map(
                (u) =>
                    `  <url>\n` +
                    `    <loc>${xmlEscape(u.loc)}</loc>\n` +
                    (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : '') +
                    `    <changefreq>${u.changefreq}</changefreq>\n` +
                    `    <priority>${u.priority}</priority>\n` +
                    `  </url>`,
            )
            .join('\n') +
        `\n</urlset>`;

    setHeaders({
        'Content-Type': 'application/xml',
        'cache-control': 'public, max-age=0, s-maxage=1800, stale-while-revalidate=3600',
    });
    return new Response(xml);
};
