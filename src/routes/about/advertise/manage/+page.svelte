<script lang="ts">
    // "הנכסים שלי" — רשימת הפרסומות של המפרסם המחובר.
    // כל שורה: תצוגה מקדימה, סטטוס, ומדדי-על. הניהול המלא בדף הנכס.
    // באתר הזה אין סשן-שרת: הרשימה נמשכת ב-fetch מ-/api/ads/mine עם
    // Authorization Bearer (ה-JWT מ-localStorage), והשרת מאמת מול Strapi.
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getJwt } from '$lib/strapi';
    import { statusView, fmtDate, needsRenewal, type AdStatusKind } from '$lib/adOwner';
    import { adImgFit, parseAdImageFit } from '$lib/adImageFit';

    interface OwnerAd {
        id: string;
        title: string;
        subtitle: string;
        status: string;
        gradient: string;
        mainImage: string;
        mainImageFit: { x: number; y: number; z: number };
        submittedAt: string;
        editedAt: string | null;
        expiresAt: string | null;
        rejectionReason: string;
        totals: { impressions: number; clicks: number; landing: number; leads: number };
    }

    let loading = $state(true);
    let loadFailed = $state(false);
    let ads = $state<OwnerAd[]>([]);
    let userEmail = $state('');

    onMount(async () => {
        const jwt = getJwt();
        if (!jwt) {
            void goto(`/login?returnTo=${encodeURIComponent('/about/advertise/manage')}`);
            return;
        }
        try {
            const res = await fetch('/api/ads/mine', {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (res.status === 401) {
                void goto(`/login?returnTo=${encodeURIComponent('/about/advertise/manage')}`);
                return;
            }
            if (!res.ok) throw new Error(String(res.status));
            const data = await res.json();
            ads = Array.isArray(data.ads) ? data.ads : [];
            userEmail = data.user?.email ?? '';
            loadFailed = Boolean(data.loadFailed);
        } catch {
            loadFailed = true;
        } finally {
            loading = false;
        }
    });

    const TONE: Record<string, string> = {
        amber: 'border-amber-600/40 bg-amber-500/10 text-amber-800',
        emerald: 'border-emerald-600/40 bg-emerald-500/10 text-emerald-800',
        rose: 'border-rose-600/40 bg-rose-500/10 text-rose-800',
        slate: 'border-[#d9c07a] bg-[#f7edcf] text-[#5b4a1e]',
    };
</script>

<svelte:head><title>הנכסים שלי | חכמי העדה</title></svelte:head>

<section class="mx-auto max-w-4xl px-3 py-6 md:px-4" dir="rtl">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
            <h1 class="text-2xl font-black text-amber-950 md:text-3xl">📢 הנכסים שלי</h1>
            <p class="mt-2 inline-block rounded-full border border-[#d9c07a] bg-[#fffbe9] px-3 py-1 text-xs font-semibold text-[#4a3a14] shadow-sm">
                {ads.length} פרסומות בחשבון {userEmail}
            </p>
        </div>
        <a href="/about/advertise" class="rounded-full border border-[#d9c07a] bg-[#fffbe9] px-3.5 py-1.5 text-sm font-bold text-[#4a3a14] shadow-sm transition-colors hover:bg-[#f3e6bd] hover:text-amber-950">
            ➕ פרסומת חדשה
        </a>
    </div>

    {#if loading}
        <div class="rounded-2xl border border-[#d9c07a] bg-[#fffbe9] px-6 py-12 text-center shadow-sm">
            <p class="text-sm font-bold text-[#5b4a1e]">⏳ טוען את הפרסומות שלך…</p>
        </div>
    {:else if loadFailed}
        <div class="rounded-2xl border border-rose-600/30 bg-rose-500/10 px-5 py-4 text-sm font-bold text-rose-800">
            לא הצלחנו לטעון את הפרסומות שלך כרגע. רעננו את העמוד בעוד רגע.
        </div>
    {:else if ads.length === 0}
        <div class="rounded-2xl border border-[#d9c07a] bg-[#fffbe9] px-6 py-12 text-center shadow-sm">
            <div class="mb-4 text-5xl" aria-hidden="true">📢</div>
            <p class="text-lg font-bold text-amber-950">אין לך עדיין פרסומות</p>
            <p class="mt-2 text-sm text-[#5b4a1e]">כשתעלו פרסומת בבונה — היא תופיע כאן, עם נתוני הצפיות וההקלקות.</p>
            <a href="/about/advertise" class="mt-5 inline-block rounded-xl bg-gradient-to-r from-amber-600 to-orange-700 px-6 py-3 font-bold text-white transition hover:opacity-90">
                לפרסום באתר ←
            </a>
        </div>
    {:else}
        <div class="flex flex-col gap-4">
            {#each ads as ad (ad.id)}
                {@const sv = statusView(ad.status as AdStatusKind, ad.expiresAt)}
                <article class="overflow-hidden rounded-2xl border border-[#d9c07a] bg-[#fffbe9] transition-all hover:border-amber-700/50 hover:bg-[#fdf6dd]">
                    <a href="/about/advertise/manage/{ad.id}" class="flex items-stretch gap-4 p-4">
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <h2 class="text-lg font-black leading-tight text-amber-950">{ad.title}</h2>
                                <span class="rounded-full border px-2 py-0.5 text-xs font-bold {TONE[sv.tone]}">{sv.label}</span>
                                {#if needsRenewal(ad.status as AdStatusKind, ad.expiresAt)}
                                    <span class="rounded-full border border-amber-600/40 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-800">⏳ לחידוש</span>
                                {/if}
                            </div>
                            {#if ad.subtitle}
                                <p class="mt-1 line-clamp-2 text-sm text-[#5b4a1e]">{ad.subtitle}</p>
                            {/if}
                            <p class="mt-1 text-xs text-[#8a7443]">{sv.hint}{ad.expiresAt ? ` · עד ${fmtDate(ad.expiresAt)}` : ''}</p>

                            <dl class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                                <div class="flex items-baseline gap-1.5">
                                    <dt class="text-[#8a7443]">צפיות</dt>
                                    <dd class="font-black tabular-nums text-amber-950">{ad.totals.impressions}</dd>
                                </div>
                                <div class="flex items-baseline gap-1.5">
                                    <dt class="text-[#8a7443]">הקלקות</dt>
                                    <dd class="font-black tabular-nums text-amber-950">{ad.totals.clicks}</dd>
                                </div>
                                <div class="flex items-baseline gap-1.5">
                                    <dt class="text-[#8a7443]">דף הנחיתה</dt>
                                    <dd class="font-black tabular-nums text-amber-950">{ad.totals.landing}</dd>
                                </div>
                                <div class="flex items-baseline gap-1.5">
                                    <dt class="text-[#8a7443]">פניות</dt>
                                    <dd class="font-black tabular-nums text-emerald-700">{ad.totals.leads}</dd>
                                </div>
                            </dl>
                            <p class="mt-3 text-sm font-bold text-blue-800">לניהול הנכס ←</p>
                        </div>

                        <!-- ב-RTL האיבר האחרון יושב בצד שמאל -->
                        <div
                            class="relative flex min-h-[130px] w-2/5 max-w-[190px] flex-shrink-0 items-center justify-center self-stretch overflow-hidden rounded-xl border border-[#d9c07a]"
                            style="background: {ad.gradient || 'linear-gradient(135deg, #f59e0b, #ea580c)'}"
                        >
                            {#if ad.mainImage}
                                <img src={ad.mainImage} alt="" class="h-full w-full object-cover" use:adImgFit={parseAdImageFit(ad.mainImageFit)} />
                            {:else}
                                <span class="text-4xl" aria-hidden="true">📢</span>
                            {/if}
                        </div>
                    </a>
                </article>
            {/each}
        </div>
    {/if}
</section>
