<script lang="ts">
    import { onMount } from 'svelte';
    import { t, locale } from 'svelte-i18n';
    import { get } from 'svelte/store';

    let _loc = $state(get(locale));
    $effect(() => locale.subscribe(l => (_loc = l)));
    const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

    let showBanner = false;

    const ads = [
        {
            titleKey: 'mobile_ads_banner_ad_peace_houses_title',
            summaryKey: 'mobile_ads_banner_ad_peace_houses_summary',
            url: 'https://chachmim.vercel.app/',
            color: 'from-orange-600 to-red-600'
        },
        {
            titleKey: 'mobile_ads_banner_ad_neighborhood_committees_title',
            summaryKey: 'mobile_ads_banner_ad_neighborhood_committees_summary',
            url: 'https://neighborhoods-il.vercel.app/',
            color: 'from-blue-600 to-cyan-600'
        },
        {
            titleKey: 'mobile_ads_banner_ad_purchasing_group_title',
            summaryKey: 'mobile_ads_banner_ad_purchasing_group_summary',
            url: 'https://purchasing-groups.vercel.app/',
            color: 'from-green-600 to-emerald-600'
        },
        {
            titleKey: 'mobile_ads_banner_ad_home_growing_title',
            summaryKey: 'mobile_ads_banner_ad_home_growing_summary',
            url: 'https://www.melecshop.com/page/free',
            color: 'from-teal-500 to-teal-600'
        },
        {
            titleKey: 'mobile_ads_banner_ad_qualified_pros_title',
            summaryKey: 'mobile_ads_banner_ad_qualified_pros_summary',
            url: 'https://index-chi-sage.vercel.app/',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            titleKey: 'mobile_ads_banner_ad_municipality_review_title',
            summaryKey: 'mobile_ads_banner_ad_municipality_review_summary',
            url: 'https://criticism.vercel.app/',
            color: 'from-red-600 to-pink-600'
        }
    ];

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' && showBanner) {
            showBanner = false;
        }
    }

    onMount(() => {
        const timer = setTimeout(() => {
            showBanner = true;
        }, 5000);

        document.addEventListener('keydown', handleKeydown);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('keydown', handleKeydown);
        };
    });
</script>

<!-- Mobile Ads Banner - Hidden on desktop -->
<div class="lg:hidden fixed bottom-0 left-0 right-0 z-[200]" aria-live="polite" aria-atomic="true">
    {#if showBanner}
        <div
            role="region"
            aria-label={tFn('mobile_ads_banner_region_label')}
            class="bg-gradient-to-t from-black/90 to-black/70 backdrop-blur-sm p-4"
        >
            <div class="space-y-2">
                {#each ads as ad}
                    <a
                        href={ad.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="{tFn(ad.titleKey)} – {tFn(ad.summaryKey)} ({tFn('mobile_ads_banner_opens_new_window')})"
                        class="w-full flex items-center justify-between bg-gradient-to-r {ad.color} p-3 rounded-lg text-white hover:shadow-lg transition-all"
                    >
                        <div class="text-left">
                            <p class="font-bold text-sm">{tFn(ad.titleKey)}</p>
                            <p class="text-xs opacity-90">{tFn(ad.summaryKey)}</p>
                        </div>
                        <span class="text-lg" aria-hidden="true">→</span>
                    </a>
                {/each}
            </div>
            <button
                onclick={() => (showBanner = false)}
                aria-label={tFn('mobile_ads_banner_close_aria')}
                class="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-xs font-bold transition-colors"
            >
                {tFn('mobile_ads_banner_close')}
            </button>
        </div>
    {/if}
</div>
