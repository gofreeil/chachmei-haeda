<script lang="ts">
    import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { page } from '$app/state';

    interface Props {
        currentUser?: any;
        onLogout?: () => void;
        onShowAuth?: () => void;
    }

    import { fade } from "svelte/transition";
    import { ads, type Ad } from "$lib/adsData";
    import FullAdModal from "$lib/components/FullAdModal.svelte";

    let { currentUser, onLogout, onShowAuth }: Props = $props();

    let languages = [
        { name: "עברית", code: "he", flag: "il" },
        { name: "English", code: "en", flag: "us" },
        { name: "русский", code: "ru", flag: "ru" },
    ];

    let showLangDropdown = $state(false);
    let showNavMenu = $state(false);

    // ─── סגירת תפריט בהחלקה כלפי מעלה (swipe-up) ───
    let touchStartY = 0;
    let touchCurrentY = 0;
    function navMenuTouchStart(e: TouchEvent) {
        touchStartY = e.changedTouches[0].screenY;
        touchCurrentY = touchStartY;
    }
    function navMenuTouchMove(e: TouchEvent) {
        touchCurrentY = e.changedTouches[0].screenY;
    }
    function navMenuTouchEnd() {
        // נגיבה כלפי מעלה ביותר מ-50px → סגור תפריט
        if (touchStartY - touchCurrentY > 50) {
            showNavMenu = false;
        }
        touchStartY = 0;
        touchCurrentY = 0;
    }

    const navGroups = [
        {
            titleKey: 'header_nav_group_home_about',
            items: [
                { href: '/', labelKey: 'header_nav_home', icon: '🏠', image: '/images/chachmei-logo.png' },
                { href: '/about/revenue', labelKey: 'header_nav_about', icon: 'ℹ️', image: '/images/bati-hapius.png', imgStyle: 'object-position: top; transform: scale(1.15);' },
            ],
        },
        {
            titleKey: 'header_nav_group_four_heichalot',
            items: [
                {
                    href: '/heichal-hamishpat',
                    labelKey: 'header_nav_heichal_mishpat',
                    icon: '⚖️',
                    bg: 'bg-gradient-to-br from-slate-600 via-slate-800 to-slate-900',
                    border: 'border-slate-300',
                    shadow: 'shadow-[0_8px_24px_-4px_rgba(15,23,42,0.6),inset_0_2px_0_rgba(255,255,255,0.18)]',
                    titleColor: '#ffffff',
                    hover: 'hover:from-slate-500 hover:via-slate-700 hover:to-slate-800 hover:border-slate-100',
                    bgStyle: '',
                    subBg: 'bg-slate-700/40',
                    subBorder: 'border-slate-300/50',
                    subText: 'text-slate-100',
                    children: [
                        { href: '/heichal-hamishpat?open=request-hearing', labelKey: 'header_nav_open_case', icon: '📂' },
                        { href: '/hearings', labelKey: 'header_nav_zoom_hearings', icon: '🎥' },
                        { href: '/rulings', labelKey: 'header_nav_rulings', icon: '📋' },
                    ],
                },
                {
                    href: '/heichal-hashalom',
                    labelKey: 'header_nav_heichal_shalom',
                    icon: '🕊️',
                    bg: 'bg-gradient-to-br from-sky-200/60 via-cyan-100/50 to-blue-200/60 backdrop-blur-md',
                    border: 'border-sky-200',
                    shadow: 'shadow-[0_8px_24px_-4px_rgba(56,189,248,0.45),inset_0_2px_0_rgba(255,255,255,0.85)]',
                    titleColor: '#082f49',
                    hover: 'hover:from-sky-300/70 hover:via-cyan-200/60 hover:to-blue-300/70 hover:border-white',
                    bgStyle: '',
                    subBg: 'bg-sky-200/40',
                    subBorder: 'border-sky-300/60',
                    subText: 'text-sky-950',
                    children: [
                        { href: '/heichal-hamishpat?open=request-hearing', labelKey: 'header_nav_shalom_open_case', icon: '📂' },
                        { href: '/heichal-hashalom/lessons', labelKey: 'header_nav_shalom_lessons', icon: '🎓' },
                        { href: '/heichal-hashalom/recommendations', labelKey: 'header_nav_shalom_recommendations', icon: '⭐' },
                    ],
                },
                {
                    href: '/heichal-hamaaseh/activity',
                    labelKey: 'header_nav_heichal_maaseh',
                    icon: '🛠️',
                    bg: '',
                    bgStyle:
                        "background-image:" +
                        "repeating-linear-gradient(90deg, rgba(48,20,8,0.18) 0px, rgba(48,20,8,0.18) 1px, transparent 1px, transparent 4px)," +
                        "linear-gradient(90deg, rgba(60,30,10,0.35) 0%, transparent 7%, rgba(60,30,10,0.25) 14%, transparent 22%, rgba(80,40,15,0.3) 32%, transparent 42%, rgba(60,30,10,0.2) 55%, transparent 65%, rgba(80,40,15,0.32) 78%, transparent 88%, rgba(60,30,10,0.25) 100%)," +
                        "linear-gradient(180deg, rgba(255,237,178,0.22) 0%, transparent 40%, rgba(0,0,0,0.18) 100%)," +
                        "linear-gradient(135deg, #92400e 0%, #78350f 50%, #713f12 100%);",
                    border: 'border-amber-300',
                    shadow: 'shadow-[0_8px_24px_-4px_rgba(120,53,15,0.65),inset_0_2px_0_rgba(255,237,178,0.3)]',
                    titleColor: '#ffffff',
                    hover: 'hover:border-amber-100 hover:brightness-110',
                    subBg: 'bg-amber-900/35',
                    subBorder: 'border-amber-400/55',
                    subText: 'text-amber-50',
                    children: [
                        { href: '/heichal-hamaaseh/ethical-code', labelKey: 'header_nav_ethical_code', icon: '📜' },
                        { href: '/charter-index', labelKey: 'header_nav_charter_index', icon: '📑' },
                        { href: '/heichal-hamaaseh/charter-join', labelKey: 'header_nav_charter_join', icon: '🤝' },
                    ],
                },
                {
                    href: '/articles',
                    labelKey: 'header_nav_heichal_ruach',
                    icon: '',
                    image: '/images/1124a5ea-412c-4c49-8d76-e4366711384d.jfif',
                    bg: 'bg-gradient-to-br from-gray-200 via-slate-300 to-gray-400',
                    border: 'border-white',
                    shadow: 'shadow-[0_8px_24px_-4px_rgba(100,116,139,0.55),inset_0_2px_0_rgba(255,255,255,0.9)]',
                    titleColor: '#0f172a',
                    hover: 'hover:from-gray-100 hover:via-slate-200 hover:to-gray-300 hover:border-slate-100',
                    bgStyle: '',
                    subBg: 'bg-slate-300/50',
                    subBorder: 'border-slate-400/60',
                    subText: 'text-slate-900',
                    children: [
                        { href: '/articles', labelKey: 'header_nav_rabbis_articles', icon: '📚' },
                        { href: '/qa', labelKey: 'header_nav_qa', icon: '💬' },
                        { href: '/ask', labelKey: 'header_nav_ask_chachmei', icon: '❓' },
                    ],
                },
            ],
        },
    ];

    let tooltipX = $state(0);
    let tooltipY = $state(0);
    let showProfileTooltip = $state(false);

    function handleProfileMouseMove(e: MouseEvent) {
        tooltipX = e.clientX + 12;
        tooltipY = e.clientY + 18;
    }

    // מעגל מילוי פרופיל בהדר
    const headerRingC = 2 * Math.PI * 30; // r=30, SVG 68×68

    let headerCompletion = $derived(
        currentUser ? Math.round([
            !!currentUser.avatar_url,
            !!currentUser.name,
            !!currentUser.nickname,
            !!currentUser.phone,
            !!currentUser.city,
            !!currentUser.neighborhood,
            !!currentUser.gender,
            !!currentUser.business,
            !!currentUser.family_status,
            !!currentUser.notifications,
        ].filter(Boolean).length / 10 * 100) : 0
    );

    let headerRingColor = $derived(
        headerCompletion < 40 ? '#ef4444' :
        headerCompletion < 70 ? '#eab308' : '#22c55e'
    );

    let selectedAdForModal = $state<Ad | null>(null);

    // חיפוש
    let searchQuery     = $state('');
    let showMobileSearch = $state(false);

    function doSearch() {
        const q = searchQuery.trim();
        if (!q) return;
        goto(`/search?q=${encodeURIComponent(q)}`);
        showMobileSearch = false;
        searchQuery = '';
    }
    function handleSearchKey(e: KeyboardEvent) {
        if (e.key === 'Enter') doSearch();
        if (e.key === 'Escape') { showMobileSearch = false; searchQuery = ''; }
    }

    function changeLang(language: { name: string; code: string }) {
        locale.set(language.code);
        try { localStorage.setItem('lang', language.code); } catch {}
    }

    onMount(() => {
        // שחזר שפה שמורה
        try {
            const saved = localStorage.getItem('lang');
            if (saved) locale.set(saved);
        } catch {}

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".lang-dropdown-container")) {
            showLangDropdown = false;
        }
        if (!target.closest(".nav-menu-container")) {
            showNavMenu = false;
        }
    }

    function handleLangKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            showLangDropdown = false;
            return;
        }

        // פתיחת הרשימה עם חץ למטה כשהיא סגורה
        if (event.key === 'ArrowDown' && !showLangDropdown) {
            event.preventDefault();
            showLangDropdown = true;
            setTimeout(() => {
                const container = (event.target as HTMLElement).closest('.lang-dropdown-container');
                const firstOption = container?.querySelector('[role="option"]') as HTMLElement;
                firstOption?.focus();
            }, 0);
            return;
        }

        if (!showLangDropdown) return;

        const target = event.target as HTMLElement;
        const container = target.closest('.lang-dropdown-container');
        if (!container) return;

        const options = Array.from(container.querySelectorAll('[role="option"]')) as HTMLElement[];
        if (options.length === 0) return;

        const currentIndex = options.indexOf(target);

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            options[currentIndex < options.length - 1 ? currentIndex + 1 : 0].focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            options[currentIndex > 0 ? currentIndex - 1 : options.length - 1].focus();
        } else if (event.key === 'Home') {
            event.preventDefault();
            options[0].focus();
        } else if (event.key === 'End') {
            event.preventDefault();
            options[options.length - 1].focus();
        }
    }
	// tFn: תרגום reactive - $t אסור ב-Svelte 5
	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };


</script>

<header
    class="site-header sticky top-0 z-50 border-b-2 md:border-b-4 border-blue-600 shadow-lg backdrop-blur-lg"
    style="background: linear-gradient(to bottom, rgba(248, 238, 203, 0.95) 0%, rgba(240, 227, 184, 0.92) 66%, rgba(240, 227, 184, 0.1) 100%);"
>
    <div class="relative mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <!-- Mobile Header Area -->
        <div class="md:hidden h-[80px] relative">
                <!-- Mobile Header -->
                <div
                    class="flex items-center justify-between h-full px-1 absolute inset-0"
                >
                    <a
                        href="/"
                        class="flex items-center gap-2.5 flex-1 min-w-0"
                    >
                        <div class="relative">
                            <div class="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                                <img
                                    src="/images/chachmei-logo.png"
                                    alt={tFn('header_logo_alt')}
                                    class="w-full h-full object-cover scale-[1.5]"
                                />
                            </div>
                            <div
                                class="hidden absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"
                            ></div>
                        </div>
                        <div class="min-w-0 flex-1">
                            <h1
                                class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-black text-transparent leading-tight truncate"
                            >
                                {tFn("welcome")}
                            </h1>
                            <p class="text-xs text-gray-400 leading-tight truncate">
                                {tFn("app_description")}
                            </p>
                        </div>
                    </a>

                    <div class="flex items-center gap-1.5">
                        <!-- תפריט ניווט נפתח - מובייל -->
                        <div class="nav-menu-container relative">
                            <button
                                onclick={() => (showNavMenu = !showNavMenu)}
                                class="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
                                aria-label={tFn('header_menu_aria')}
                                aria-haspopup="menu"
                                aria-expanded={showNavMenu}
                            >
                                <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
                                    <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            {#if showNavMenu}
                                <div
                                    class="fixed left-1/2 -translate-x-1/2 top-[72px] z-[160] w-[94vw] max-w-md max-h-[85vh] overflow-y-auto rounded-xl bg-[#f0e3b8]/95 backdrop-blur-md border border-amber-700/20 shadow-2xl p-3"
                                    role="menu"
                                    aria-label={tFn('header_nav_aria')}
                                    ontouchstart={navMenuTouchStart}
                                    ontouchmove={navMenuTouchMove}
                                    ontouchend={navMenuTouchEnd}
                                >
                                    <!-- ידית גרירה — רמז לסגירה בהחלקה כלפי מעלה -->
                                    <button
                                        type="button"
                                        onclick={() => (showNavMenu = false)}
                                        aria-label={tFn('header_close_menu_aria')}
                                        class="block mx-auto mb-2 w-12 h-1.5 rounded-full bg-amber-700/40 hover:bg-amber-700/60 active:bg-amber-700/80 transition-colors"
                                    ></button>
                                    {#each navGroups as group, gi}
                                        {#if gi === 0}
                                            <!-- Row 1: Home + About (mobile) -->
                                            <div class="flex justify-center items-center gap-6 mb-3">
                                                {#each group.items as item}
                                                    <a
                                                        href={item.href}
                                                        role="menuitem"
                                                        class="flex items-center justify-center gap-2 px-2 py-1.5 text-gray-900 font-bold no-underline"
                                                        onclick={() => (showNavMenu = false)}
                                                    >
                                                        {#if 'image' in item && item.image}
                                                            <div class="w-16 h-16 rounded-full overflow-hidden ring-2 ring-amber-400/70 shadow-[0_8px_24px_rgba(120,53,15,0.5)] bg-amber-50 flex-shrink-0">
                                                                <img src={item.image} alt={tFn(item.labelKey)} class="w-full h-full object-cover" style={(item as any).imgStyle ?? 'transform: scale(1.4);'} />
                                                            </div>
                                                        {:else}
                                                            <span class="text-2xl inline-block" aria-hidden="true">{item.icon}</span>
                                                        {/if}
                                                        <span class="text-base font-bold">{tFn(item.labelKey)}</span>
                                                    </a>
                                                {/each}
                                            </div>
                                        {:else}
                                            <!-- Row 2: 4 Heichalot in 2x2 grid with sub-items -->
                                            <div class="grid grid-cols-2 gap-x-2 gap-y-5">
                                                {#each group.items as item}
                                                    {@const h = item as any}
                                                    <div class="flex flex-col">
                                                        <a
                                                            href={item.href}
                                                            role="menuitem"
                                                            class="flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl border-4 {h.border ?? ''} {h.bg ?? ''} {h.shadow ?? ''} transition-all no-underline ring-1 ring-black/20 min-h-[95px] text-center"
                                                            style={h.bgStyle ?? ''}
                                                            onclick={() => (showNavMenu = false)}
                                                        >
                                                            {#if 'image' in item && item.image}
                                                                <img src={item.image} alt={tFn(item.labelKey)} class="w-10 h-10 object-cover rounded-full ring-2 ring-white/80 drop-shadow-lg" />
                                                            {:else}
                                                                <span class="text-2xl drop-shadow-lg" aria-hidden="true">{item.icon}</span>
                                                            {/if}
                                                            <span class="text-xs font-black text-center leading-tight drop-shadow-sm" style="color: {h.titleColor ?? '#ffffff'} !important">{tFn(item.labelKey)}</span>
                                                        </a>
                                                        {#if 'children' in item && item.children && item.children.length}
                                                            <div class="mt-1.5 space-y-1.5">
                                                                {#each item.children as child}
                                                                    <a
                                                                        href={child.href}
                                                                        role="menuitem"
                                                                        class="flex items-center gap-1.5 rounded-full border border-amber-700/25 bg-amber-50/70 hover:bg-amber-100 px-3 min-h-[44px] text-sm text-gray-800 font-bold transition-colors no-underline"
                                                                        onclick={() => (showNavMenu = false)}
                                                                    >
                                                                        <span class="text-base flex-shrink-0" aria-hidden="true">{child.icon}</span>
                                                                        <span class="leading-tight">{tFn(child.labelKey)}</span>
                                                                    </a>
                                                                {/each}
                                                            </div>
                                                        {/if}
                                                    </div>
                                                {/each}
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            {/if}
                        </div>
                        <!-- כפתור דגל שפה - מובייל -->
                        <div class="relative lang-dropdown-container">
                            <button
                                onclick={() => (showLangDropdown = !showLangDropdown)}
                                onkeydown={handleLangKeydown}
                                class="flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
                                aria-label={tFn('header_choose_lang_aria')}
                                aria-haspopup="listbox"
                                aria-expanded={showLangDropdown}
                            >
                                <span
                                    class="fi fi-{languages.find((l) => l.code === $locale || $locale?.startsWith(l.code))?.flag || 'il'}"
                                    style="font-size: 1.2rem;"
                                    aria-hidden="true"
                                ></span>
                            </button>
                            {#if showLangDropdown}
                                <div
                                    class="absolute left-0 z-[160] mt-2 w-36 rounded-lg bg-[#0f172a] border border-white/10 shadow-xl"
                                    role="listbox"
                                    aria-label={tFn('header_choose_lang_aria')}
                                >
                                    {#each languages as langOption}
                                        <button
                                            class="flex w-full items-center gap-3 px-3 py-2 text-right text-white hover:bg-white/10 transition-colors"
                                            onclick={() => { changeLang(langOption); showLangDropdown = false; }}
                                            onkeydown={handleLangKeydown}
                                            role="option"
                                            aria-selected={$locale === langOption.code || $locale?.startsWith(langOption.code)}
                                        >
                                            <span class="fi fi-{langOption.flag}" style="font-size: 1.2rem;" aria-hidden="true"></span>
                                            <span class="text-sm">{langOption.name}</span>
                                        </button>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        {#if currentUser}
                            <a href="/profile" class="relative group flex-shrink-0" aria-label="{tFn('header_profile_aria_user')} – {currentUser.username ?? tFn('header_user_fallback')}">
                                {#if currentUser.avatar_url}
                                    <img
                                        src={currentUser.avatar_url}
                                        alt=""
                                        class="h-9 w-9 rounded-full object-cover border-2 border-purple-500/40 shadow-lg"
                                    />
                                {:else}
                                    <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500 shadow-lg border border-white/10" aria-hidden="true">
                                        <span class="font-bold text-white text-xs">{currentUser.username?.charAt(0) || "U"}</span>
                                    </div>
                                {/if}
                            </a>
                        {:else}
                            <a
                                href="/profile"
                                class="relative group flex-shrink-0"
                                aria-label={tFn('header_profile_area')}
                            >
                                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 rounded-full border-2 border-white/20 group-hover:border-purple-400 transition-all">
                                    <circle cx="20" cy="20" r="20" fill="#374151"/>
                                    <circle cx="20" cy="16" r="7" fill="#6b7280"/>
                                    <ellipse cx="20" cy="34" rx="12" ry="8" fill="#6b7280"/>
                                </svg>
                                <span class="absolute bottom-full right-1/2 translate-x-1/2 mb-2 hidden group-hover:block
                                             bg-gray-900 text-white text-[10px] font-bold rounded-lg px-2 py-1
                                             whitespace-nowrap border border-white/10 shadow-xl pointer-events-none">
                                    {tFn('header_profile_area')}
                                </span>
                            </a>
                        {/if}
                    </div>
                </div>
        </div>

        <!-- Desktop Header - Full Layout -->
        <div
            class="hidden md:flex flex-col items-center pt-0 pb-0.5 md:flex-row md:items-center md:justify-between"
        >
            <div class="header-logo-title flex items-center space-x-4">
                <div class="relative group">
                    <a
                        href="/"
                        class="logo-link flex h-16 w-16 items-center justify-center rounded-xl"
                    >
                        <div class="h-14 w-14 rounded-full overflow-hidden">
                            <img
                                src="/images/chachmei-logo.png"
                                alt={tFn('header_logo_alt')}
                                class="w-full h-full object-contain scale-[1.15]"
                                style="image-rendering: -webkit-optimize-contrast;"
                            />
                        </div>
                    </a>
                    <!-- Tooltip - Below enlarged logo (1.9x = ~213px tall, grows leftward from top-right anchor) -->
                    <div
                        class="absolute top-full -translate-x-1/2 mt-28 hidden group-hover:block z-[9999]"
                        style="left: 6px;"
                    >
                        <div
                            class="bg-gray-900 text-white text-sm rounded-lg px-4 py-2 shadow-xl whitespace-nowrap"
                        >
                            {tFn("back_home")}
                            <div
                                class="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-gray-900"
                            ></div>
                        </div>
                    </div>
                </div>
                <a href="/" class="group header-title-block">
                    <h1
                        class="header-title-h1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent group-hover:opacity-80 transition-opacity"
                    >
                        {tFn("welcome")}
                    </h1>
                    <p class="header-title-p text-lg text-gray-100 font-extrabold group-hover:opacity-80 transition-opacity">{tFn("app_description")}</p>
                </a>
            </div>
<div class="flex items-center gap-2">
                <!-- תפריט ניווט נפתח -->
                <div class="nav-menu-container relative">
                    <button
                        class="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-sm text-white transition-colors"
                        onclick={() => (showNavMenu = !showNavMenu)}
                        aria-label={tFn('header_menu_aria')}
                        aria-haspopup="menu"
                        aria-expanded={showNavMenu}
                    >
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
                            <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span class="font-bold">{tFn('header_menu_label')}</span>
                    </button>
                    {#if showNavMenu}
                        <div
                            class="fixed left-1/2 -translate-x-1/2 top-[80px] z-[160] w-[680px] max-h-[85vh] overflow-y-auto rounded-xl bg-[#f0e3b8]/95 backdrop-blur-md border border-amber-700/20 shadow-2xl p-4"
                            role="menu"
                            aria-label={tFn('header_nav_aria')}
                            ontouchstart={navMenuTouchStart}
                            ontouchmove={navMenuTouchMove}
                            ontouchend={navMenuTouchEnd}
                        >
                            <!-- ידית גרירה — רמז לסגירה בהחלקה כלפי מעלה -->
                            <button
                                type="button"
                                onclick={() => (showNavMenu = false)}
                                aria-label={tFn('header_close_menu_aria')}
                                class="block mx-auto mb-2 w-14 h-1.5 rounded-full bg-amber-700/40 hover:bg-amber-700/60 active:bg-amber-700/80 transition-colors"
                            ></button>
                            {#each navGroups as group, gi}
                                {#if gi === 0}
                                    <!-- Row 1: Home + About items (horizontal, no frame, no title) -->
                                    <div class="flex justify-center items-center gap-8 mb-4">
                                        {#each group.items as item}
                                            <a
                                                href={item.href}
                                                role="menuitem"
                                                class="group flex items-center justify-center gap-3 px-3 py-2 text-gray-900 font-bold no-underline"
                                                onclick={() => (showNavMenu = false)}
                                            >
                                                {#if 'image' in item && item.image}
                                                    <div class="w-20 h-20 rounded-full overflow-hidden ring-2 ring-amber-400/70 shadow-[0_8px_24px_rgba(120,53,15,0.5)] bg-amber-50 transition-transform duration-200 group-hover:scale-110 flex-shrink-0">
                                                        <img src={item.image} alt={tFn(item.labelKey)} class="w-full h-full object-cover" style={(item as any).imgStyle ?? 'transform: scale(1.4);'} />
                                                    </div>
                                                {:else}
                                                    <span class="text-3xl inline-block transition-transform duration-200 group-hover:scale-110" aria-hidden="true">{item.icon}</span>
                                                {/if}
                                                <span class="text-xl font-bold">{tFn(item.labelKey)}</span>
                                            </a>
                                        {/each}
                                    </div>
                                {:else}
                                    <!-- Row 2+: Heichalot — 4-column grid with sub-items below each (no title) -->
                                    <div>
                                        <div class="grid grid-cols-4 gap-2">
                                            {#each group.items as item}
                                                {@const h = item as any}
                                                <div class="flex flex-col">
                                                    <a
                                                        href={item.href}
                                                        role="menuitem"
                                                        class="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border-4 {h.border ?? ''} {h.bg ?? ''} {h.hover ?? ''} {h.shadow ?? ''} transition-all no-underline ring-1 ring-black/20 min-h-[110px] text-center"
                                                        style={h.bgStyle ?? ''}
                                                        onclick={() => (showNavMenu = false)}
                                                    >
                                                        {#if 'image' in item && item.image}
                                                            <img src={item.image} alt={tFn(item.labelKey)} class="w-12 h-12 object-cover rounded-full ring-2 ring-white/80 drop-shadow-lg" />
                                                        {:else}
                                                            <span class="text-3xl drop-shadow-lg" aria-hidden="true">{item.icon}</span>
                                                        {/if}
                                                        <span class="text-xs font-black text-center leading-tight drop-shadow-sm" style="color: {h.titleColor ?? '#ffffff'} !important">{tFn(item.labelKey)}</span>
                                                    </a>
                                                    {#if 'children' in item && item.children && item.children.length}
                                                        <div class="mt-1.5 space-y-1.5">
                                                            {#each item.children as child}
                                                                <a
                                                                    href={child.href}
                                                                    role="menuitem"
                                                                    class="flex items-center gap-1.5 rounded-full border border-amber-700/25 bg-amber-50/70 hover:bg-amber-100 px-3 py-1.5 text-xs text-gray-800 font-bold transition-colors no-underline"
                                                                    onclick={() => (showNavMenu = false)}
                                                                >
                                                                    <span class="text-sm flex-shrink-0" aria-hidden="true">{child.icon}</span>
                                                                    <span class="leading-tight">{tFn(child.labelKey)}</span>
                                                                </a>
                                                            {/each}
                                                        </div>
                                                    {/if}
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    {/if}
                </div>
                <!-- Language Dropdown -->
                <div class="lang-dropdown-container relative">
                    <button
                        class="flex items-center rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-sm text-white transition-colors"
                        onclick={() => (showLangDropdown = !showLangDropdown)}
                        onkeydown={handleLangKeydown}
                        aria-label={tFn('header_choose_lang_aria')}
                        aria-haspopup="listbox"
                        aria-expanded={showLangDropdown}
                    >
                        <span
                            class="fi fi-{languages.find(
                                (l) => l.code === $locale || $locale?.startsWith(l.code),
                            )?.flag || 'il'} ml-2"
                            style="font-size: 1.5rem; margin-left: 0.75rem;"
                            aria-hidden="true"
                        ></span>
                        {languages.find((l) => l.code === $locale || $locale?.startsWith(l.code))?.name ||
                            tFn('header_lang_default')}
                        <svg
                            class="mr-1 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    {#if showLangDropdown}
                        <div
                            class="absolute right-0 z-[160] mt-2 w-44 rounded-lg bg-[#0f172a] border border-white/10 shadow-xl"
                            role="listbox"
                            aria-label={tFn('header_choose_lang_aria')}
                        >
                            {#each languages as langOption}
                                <button
                                    class="flex w-full items-center gap-4 px-4 py-2 text-right text-white hover:bg-white/10 transition-colors"
                                    onclick={() => {
                                        changeLang(langOption);
                                        showLangDropdown = false;
                                    }}
                                    onkeydown={handleLangKeydown}
                                    role="option"
                                    aria-selected={$locale === langOption.code || $locale?.startsWith(langOption.code)}
                                >
                                    <span class="text-sm">{langOption.name}</span>
                                    <span
                                        class="fi fi-{langOption.flag}"
                                        style="font-size: 1.5rem;"
                                        aria-hidden="true"
                                    ></span>
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
            {#if true}
                <div class="flex items-center gap-4">
                    {#if currentUser}
                        {@const userName = currentUser.username ?? "U"}
                        <div class="flex items-center gap-3">
                            <!-- תמונת פרופיל עם hover -->
                            <a
                                href="/profile"
                                class="relative flex-shrink-0"
                                aria-label="{tFn('header_profile_aria_user')} – {userName}"
                                onmouseenter={() => showProfileTooltip = true}
                                onmouseleave={() => showProfileTooltip = false}
                                onmousemove={handleProfileMouseMove}
                            >
                                {#if currentUser.avatar_url}
                                    <img
                                        src={currentUser.avatar_url}
                                        alt=""
                                        class="h-14 w-14 rounded-full object-cover border-2 border-purple-500/40
                                               shadow-lg hover:border-purple-400 transition-all"
                                    />
                                {:else}
                                    <div class="flex h-14 w-14 items-center justify-center rounded-full
                                                bg-gradient-to-br from-green-400 to-blue-500 shadow-lg
                                                border-2 border-transparent hover:border-purple-400 transition-all"
                                         aria-hidden="true">
                                        <span class="font-bold text-white text-sm">{userName.charAt(0)}</span>
                                    </div>
                                {/if}
                            </a>
                        </div>
                    {:else}
                        <a
                            href="/profile"
                            class="relative group flex-shrink-0"
                            aria-label={tFn('header_profile_area')}
                        >
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 rounded-full border-2 border-white/20 group-hover:border-purple-400 transition-all">
                                <circle cx="20" cy="20" r="20" fill="#374151"/>
                                <circle cx="20" cy="16" r="7" fill="#6b7280"/>
                                <ellipse cx="20" cy="34" rx="12" ry="8" fill="#6b7280"/>
                            </svg>
                            <span class="absolute top-full right-1/2 translate-x-1/2 mt-2 hidden group-hover:block
                                         bg-gray-900 text-white text-sm font-bold rounded-lg px-3 py-1.5
                                         whitespace-nowrap border border-white/10 shadow-xl pointer-events-none z-50">
                                {tFn('header_profile_area')}
                            </span>
                        </a>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</header>

<!-- Cursor-following profile tooltip -->
{#if showProfileTooltip}
    <div
        class="fixed z-[9999] pointer-events-none"
        style="left: {tooltipX}px; top: {tooltipY}px;"
    >
        <div class="bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 shadow-xl whitespace-nowrap border border-white/10">
            👤 {tFn('header_to_my_profile')}
        </div>
    </div>
{/if}

<!-- FullAdModal popup -->
{#if selectedAdForModal}
    <FullAdModal ad={selectedAdForModal} onClose={() => selectedAdForModal = null} />
{/if}

<style>
    @keyframes pulse-slow {
        0%,
        100% {
            opacity: 1;
        }
        36% {
            opacity: 0.75;
        }
    }

    :global(.animate-pulse-slow) {
        animation: pulse-slow 11s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    :global(.logo-link) {
        transition: transform 0.3s ease-out;
        transform-origin: center center;
        will-change: transform;
    }
    :global(.logo-link:hover) {
        transform: scale(1.3);
        z-index: 60;
    }

</style>
