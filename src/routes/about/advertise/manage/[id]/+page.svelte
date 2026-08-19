<script lang="ts">
    // ============================================================
    // דף ניהול הנכס של המפרסם (חכמי העדה)
    //   • מדדים: צפיות, הקלקות, צפיות בדף הנחיתה ופניות — סך הכל ולפי ימים
    //   • עריכה מחדש: טוען את המודעה לבונה ומחליף אותה בסיום (PUT)
    //   • חידוש: התראה לפני סוף התקופה + דרך ליצור קשר לחידוש
    // אין סשן-שרת: הנתונים נמשכים מ-/api/ads/mine/[id] עם Bearer,
    // והשרת מאמת שם שרק מי ששלח את המודעה רואה אותה.
    // ============================================================
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { getJwt } from '$lib/strapi';
    import {
        statusView, fmtDate, ctr, daysLeft, needsRenewal, isExpired,
        RENEW_WARNING_DAYS, type AdStatusKind,
    } from '$lib/adOwner';
    import { adImgFit, parseAdImageFit } from '$lib/adImageFit';

    let loading = $state(true);
    let loadError = $state('');
    let data = $state<any>(null);

    onMount(async () => {
        const path = `/about/advertise/manage/${page.params.id}`;
        const jwt = getJwt();
        if (!jwt) {
            void goto(`/login?returnTo=${encodeURIComponent(path)}`);
            return;
        }
        try {
            const res = await fetch(`/api/ads/mine/${encodeURIComponent(page.params.id ?? '')}`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (res.status === 401) {
                void goto(`/login?returnTo=${encodeURIComponent(path)}`);
                return;
            }
            if (!res.ok) {
                let msg = 'לא הצלחנו לטעון את הפרסומת — נסו לרענן';
                try {
                    const body = await res.json();
                    if (typeof body?.message === 'string' && /[֐-׿]/.test(body.message)) msg = body.message;
                } catch { /* ההודעה הכללית מספיקה */ }
                loadError = msg;
                return;
            }
            data = await res.json();
        } catch {
            loadError = 'בעיית תקשורת — בדקו את החיבור ונסו שוב';
        } finally {
            loading = false;
        }
    });

    const ad = $derived(data?.ad);
    const lp = $derived(data?.ad?.landing ?? {});
    const totals = $derived(data?.stats?.totals ?? { impressions: 0, clicks: 0, landing: 0, leads: 0 });
    const days = $derived(data?.stats?.days ?? []);

    const sv = $derived(ad ? statusView(ad.status as AdStatusKind, ad.expiresAt) : null);
    const left = $derived(ad ? daysLeft(ad.expiresAt) : null);
    const renew = $derived(
        ad
            ? needsRenewal(ad.status as AdStatusKind, ad.expiresAt) ||
              isExpired(ad.status as AdStatusKind, ad.expiresAt)
            : false
    );

    const TONE: Record<string, string> = {
        amber: 'border-amber-600/40 bg-amber-500/10 text-amber-800',
        emerald: 'border-emerald-600/40 bg-emerald-500/10 text-emerald-800',
        rose: 'border-rose-600/40 bg-rose-500/10 text-rose-800',
        slate: 'border-[#d9c07a] bg-[#f7edcf] text-[#5b4a1e]',
    };

    // הגרף: כל יום מוצג כעמודה. הסקאלה נגזרת מהיום החזק בתקופה.
    const maxDay = $derived(
        Math.max(1, ...days.map((d: { impressions: number }) => d.impressions))
    );
    function dayLabel(date: string): string {
        return new Date(date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
    }

    // ===== העברה לבונה לעריכה מחדש =====
    // הבונה קורא טיוטה מ-localStorage בעליית העמוד — לכן "עריכה" היא
    // כתיבת המודעה הקיימת לאותה טיוטה, בתוספת מזהה העריכה שאומר
    // לשלב האחרון להחליף את המודעה הקיימת ולא ליצור חדשה.
    const LS_KEY = 'ch_ad_builder_draft_v1';
    const EDIT_KEY = 'ch_ad_edit_id';
    let editError = $state('');

    function editInBuilder() {
        const adv = (lp.advantages ?? []) as string[];
        const draft = {
            logo: ad.logo ?? '',
            logoOriginal: ad.logo ?? '',
            hasCircleCrop: false,
            logoShape: 'square',
            logoPosition: 'right',
            logoPositionExplicit: false,
            mainImage: ad.mainImage ?? '',
            mainImageObjectX: ad.mainImageFit?.x ?? 50,
            mainImageObjectY: ad.mainImageFit?.y ?? 50,
            mainImageZoom: ad.mainImageFit?.z ?? 1,
            title: ad.title ?? '',
            titleColor: '#ffffff',
            titleOffsetY: 0,
            subtitle: ad.subtitle ?? '',
            hoverText: ad.hoverText ?? '',
            cta: ad.cta ?? '',
            gradient: ad.gradient ?? '',
            diagHeight: 12,
            landingHeadline: lp.headline ?? '',
            landingPitch: lp.pitch ?? '',
            landingExtended: lp.extended ?? '',
            landingImage: lp.image ?? '',
            landingAdvantages: [adv[0] ?? '', adv[1] ?? '', adv[2] ?? ''],
            uniqueness: lp.uniqueness ?? '',
            phone: lp.phone ?? '',
            whatsapp: lp.whatsapp ?? '',
            website: lp.website ?? '',
            email: lp.email ?? '',
            address: lp.address ?? '',
            hours: lp.hours ?? '',
            products: lp.products ?? [],
        };
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(draft));
            localStorage.setItem(EDIT_KEY, ad.id);
        } catch {
            // מקום אחסון מלא (תמונות data-URI כבדות) — לא נשלח לבונה חצי-טיוטה
            editError = 'לא הצלחנו לפתוח את הפרסומת לעריכה בדפדפן הזה. נסו לפנות מקום (היסטוריה/אחסון) או להשתמש בדפדפן אחר.';
            return;
        }
        void goto('/about/advertise/builder');
    }

    const WA_NUMBER = '972587448061';
    const renewWa = $derived(
        ad
            ? `https://wa.me/${WA_NUMBER}?text=` +
              encodeURIComponent(`שלום! אני רוצה לחדש את הפרסום של "${ad.title}" באתר חכמי העדה 🙂`)
            : ''
    );
</script>

<svelte:head><title>ניהול הפרסומת {ad?.title ?? ''} | חכמי העדה</title></svelte:head>

<section class="mx-auto max-w-3xl px-3 py-6 md:px-4" dir="rtl">
    <a href="/about/advertise/manage" class="inline-block rounded-full border border-[#d9c07a] bg-[#fffbe9] px-3.5 py-1.5 text-sm font-bold text-[#4a3a14] shadow-sm transition-colors hover:bg-[#f3e6bd] hover:text-amber-950">
        → לכל הנכסים שלי
    </a>

    {#if loading}
        <div class="mt-4 rounded-2xl border border-[#d9c07a] bg-[#fffbe9] px-6 py-12 text-center">
            <p class="text-sm font-bold text-[#5b4a1e]">⏳ טוען את נתוני הנכס…</p>
        </div>
    {:else if loadError || !ad}
        <div class="mt-4 rounded-2xl border border-rose-600/30 bg-rose-500/10 px-5 py-4 text-sm font-bold text-rose-800">
            {loadError || 'הפרסומת לא נמצאה'}
        </div>
    {:else}

    <!-- כרטיס הנכס: תצוגה מקדימה + מצב הפרסום -->
    <header class="mt-4 rounded-2xl border border-[#d9c07a] bg-[#fffbe9] p-4 md:p-5">
        <div class="flex flex-col gap-4 md:flex-row md:items-start">
            <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                    <h1 class="text-xl font-black leading-tight text-amber-950 md:text-2xl">{ad.title}</h1>
                    {#if sv}
                        <span class="rounded-full border px-2.5 py-0.5 text-xs font-bold {TONE[sv.tone]}">{sv.label}</span>
                    {/if}
                </div>
                {#if ad.subtitle}
                    <p class="mt-1.5 text-sm text-[#4a3a14]">{ad.subtitle}</p>
                {/if}
                {#if sv}
                    <p class="mt-1.5 text-xs text-[#8a7443]">{sv.hint}</p>
                {/if}

                <dl class="mt-3.5 grid grid-cols-1 gap-x-6 gap-y-1.5 border-t border-[#e6d194] pt-3.5 text-sm sm:grid-cols-2">
                    <div class="flex gap-1.5"><dt class="flex-shrink-0 text-[#8a7443]">מסלול:</dt><dd class="font-bold text-amber-950">{data.plan.label} ({data.plan.price} ₪)</dd></div>
                    {#if ad.expiresAt}
                        <div class="flex gap-1.5"><dt class="flex-shrink-0 text-[#8a7443]">בתוקף עד:</dt><dd class="font-bold text-amber-950">{fmtDate(ad.expiresAt)}</dd></div>
                    {/if}
                    <div class="flex gap-1.5"><dt class="flex-shrink-0 text-[#8a7443]">נשלחה:</dt><dd class="font-bold text-amber-950">{fmtDate(ad.submittedAt)}</dd></div>
                    {#if ad.editedAt}
                        <div class="flex gap-1.5"><dt class="flex-shrink-0 text-[#8a7443]">עודכנה:</dt><dd class="font-bold text-amber-950">{fmtDate(ad.editedAt)}</dd></div>
                    {/if}
                </dl>

                {#if ad.status === 'rejected' && ad.rejectionReason}
                    <p class="mt-3 rounded-xl border border-rose-600/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-800">
                        <span class="font-bold">סיבת הדחייה:</span> {ad.rejectionReason}
                    </p>
                {/if}

                <div class="mt-4 flex flex-wrap gap-2">
                    <button type="button" onclick={editInBuilder}
                        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-700 px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">
                        ✏️ ערוך את הפרסומת
                    </button>
                    {#if ad.status === 'approved'}
                        <a href="/ads/{ad.id}" target="_blank" rel="noopener"
                            class="inline-flex items-center gap-2 rounded-xl border border-[#d9c07a] bg-[#f7edcf] px-4 py-2 text-sm font-bold text-[#4a3a14] transition-colors hover:bg-[#f3e6bd]">
                            🔗 לדף הנחיתה
                        </a>
                    {/if}
                </div>
                {#if editError}
                    <p class="mt-2 text-sm font-bold text-rose-700">{editError}</p>
                {/if}
            </div>

            <!-- תצוגה מקדימה של הבאנר כפי שהוא מוצג באתר -->
            <div class="w-full flex-shrink-0 md:w-56">
                <div class="relative h-40 overflow-hidden rounded-xl border border-[#d9c07a] md:h-48"
                     style="background: {ad.gradient || 'linear-gradient(135deg, #f59e0b, #ea580c)'}">
                    {#if ad.mainImage}
                        <img src={ad.mainImage} alt="" class="h-full w-full object-cover" use:adImgFit={parseAdImageFit(ad.mainImageFit)} />
                    {:else}
                        <div class="flex h-40 items-center justify-center text-5xl md:h-48" aria-hidden="true">📢</div>
                    {/if}
                    <div class="px-3 py-2 text-center">
                        <p class="text-sm font-black text-white">{ad.title}</p>
                        {#if ad.cta}<p class="mt-0.5 text-[11px] font-bold text-white/90">{ad.cta}</p>{/if}
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- חידוש הפרסום -->
    {#if renew}
        <div class="mt-4 rounded-2xl border border-amber-600/40 bg-amber-500/10 p-4 md:p-5">
            <p class="text-base font-black text-amber-900">
                {#if isExpired(ad.status as AdStatusKind, ad.expiresAt)}
                    ⏳ הפרסום הסתיים — המודעה ירדה מהאתר
                {:else}
                    ⏳ הפרסום מסתיים בעוד {left} ימים
                {/if}
            </p>
            <p class="mt-1 text-sm leading-relaxed text-amber-900/80">
                חידוש שומר על אותה מודעה ואותם נתונים — בלי לבנות מחדש.
            </p>
            <div class="mt-3 flex flex-wrap gap-2">
                <a href={renewWa} target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">
                    💬 לחידוש בוואטסאפ
                </a>
                <a href="/about/advertise#plans"
                    class="inline-flex items-center gap-2 rounded-xl border border-[#d9c07a] bg-[#f7edcf] px-4 py-2 text-sm font-bold text-[#4a3a14] transition-colors hover:bg-[#f3e6bd]">
                    המחירון והמסלולים
                </a>
            </div>
        </div>
    {/if}

    <!-- מדדים -->
    <section class="mt-4 rounded-2xl border border-[#d9c07a] bg-[#fffbe9] p-4 md:p-5">
        <h2 class="text-lg font-black text-amber-950">📊 הביצועים שלך</h2>
        <p class="mt-1 text-xs text-[#8a7443]">
            נמדד מרגע העלאת המודעה. צפייה נספרת פעם אחת לכל מבקר.
        </p>

        <div class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {#snippet stat(label: string, value: number, hint: string, accent: string)}
                <div class="rounded-xl border border-[#e6d194] bg-[#f7edcf] px-3 py-3 text-center">
                    <p class="text-2xl font-black tabular-nums {accent}">{value}</p>
                    <p class="mt-0.5 text-xs font-bold text-[#4a3a14]">{label}</p>
                    <p class="mt-0.5 text-[11px] leading-tight text-[#8a7443]">{hint}</p>
                </div>
            {/snippet}
            {@render stat('צפיות', totals.impressions, 'המודעה נראתה', 'text-amber-950')}
            {@render stat('הקלקות', totals.clicks, `אחוז הקלקה ${ctr(totals.clicks, totals.impressions)}`, 'text-blue-800')}
            {@render stat('דף הנחיתה', totals.landing, 'נכנסו לדף שלך', 'text-purple-800')}
            {@render stat('פניות', totals.leads, 'טלפון · וואטסאפ · אתר', 'text-emerald-700')}
        </div>

        {#if days.length > 0}
            <h3 class="mt-5 text-sm font-bold text-[#4a3a14]">צפיות ב-{data.statsDays} הימים האחרונים</h3>
            <div class="mt-2 flex items-end justify-between gap-1" style="height: 96px">
                {#each days as d (d.date)}
                    <div class="flex h-full flex-1 flex-col justify-end" title="{dayLabel(d.date)}: {d.impressions} צפיות · {d.clicks} הקלקות">
                        <div class="rounded-t bg-gradient-to-t from-blue-700 to-blue-400"
                             style="height: {Math.round((d.impressions / maxDay) * 100)}%; min-height: {d.impressions > 0 ? '3px' : '2px'}"
                             class:opacity-25={d.impressions === 0}></div>
                    </div>
                {/each}
            </div>
            <div class="mt-1 flex justify-between text-[10px] text-[#8a7443]">
                <span>{dayLabel(days[0].date)}</span>
                <span>{dayLabel(days[days.length - 1].date)}</span>
            </div>
        {/if}

        {#if totals.impressions === 0}
            <p class="mt-4 rounded-xl border border-[#e6d194] bg-[#f7edcf] px-3 py-2.5 text-sm text-[#5b4a1e]">
                {#if ad.status === 'approved'}
                    עדיין לא נאספו נתונים — המספרים מתחילים לזוז ברגע שגולשים נחשפים למודעה.
                {:else}
                    המדידה מתחילה כשהמודעה מאושרת ועולה לאתר.
                {/if}
            </p>
        {/if}
    </section>

    <!-- התראות — בסיס להודעות האוטומטיות (חידוש / מבצעים) -->
    <section class="mt-4 rounded-2xl border border-[#d9c07a] bg-[#fffbe9] p-4 md:p-5">
        <h2 class="text-lg font-black text-amber-950">🔔 התראות ועדכונים</h2>
        <p class="mt-1.5 text-sm leading-relaxed text-[#5b4a1e]">
            עדכונים על הנכס נשלחים לכתובת <span class="font-bold text-amber-950" dir="ltr">{data.notifyEmail}</span>.
        </p>
        <ul class="mt-3 flex flex-col gap-2 text-sm text-[#5b4a1e]">
            <li class="rounded-xl border border-[#e6d194] bg-[#f7edcf] px-3 py-2">
                ⏳ <span class="font-bold text-amber-950">תזכורת חידוש</span> — {RENEW_WARNING_DAYS} ימים לפני סוף התקופה,
                וגם כאן בדף (הקריאה לחידוש מופיעה למעלה).
            </li>
            <li class="rounded-xl border border-[#e6d194] bg-[#f7edcf] px-3 py-2">
                🎁 <span class="font-bold text-amber-950">מבצעים למפרסמים קיימים</span> — הטבות ותוספות פרסום שכדאי לך להכיר.
            </li>
        </ul>
        <p class="mt-2 text-[11px] text-[#8a7443]">
            השליחה האוטומטית במייל בהקמה — בשלב הזה התזכורות מוצגות בדף הזה.
        </p>
    </section>

    {/if}
</section>
