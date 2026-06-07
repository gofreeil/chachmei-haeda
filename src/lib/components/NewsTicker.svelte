<script lang="ts">
	import { onMount } from 'svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	// אותו מקור שאתר "קהילה בשכונה" משתמש בו - סנכרון חד-כיווני משם לכאן.
	const NATIONAL_NEWS_API = 'https://criticism.vercel.app/api/national-news';
	const CUSTOM_NEWS_KEY = 'chachmei-custom-news';

	type NewsItem = {
		line1: string;
		line2: string;
		sourceUrl?: string | null;
		documentId?: string;
		local?: boolean;
		fallbackKey?: string; // when set, line1/line2 are i18n keys
	};

	// פריטי ברירת מחדל אם ה-API לא זמין ואין חדשות לוקאליות
	const fallbackItems: NewsItem[] = [
		{ line1: 'news_ticker_fallback_1_line1', line2: 'news_ticker_fallback_1_line2', fallbackKey: '1' },
		{ line1: 'news_ticker_fallback_2_line1', line2: 'news_ticker_fallback_2_line2', fallbackKey: '2' },
		{ line1: 'news_ticker_fallback_3_line1', line2: 'news_ticker_fallback_3_line2', fallbackKey: '3' }
	];

	let paused = $state(false);
	let newsItems = $state<NewsItem[]>(fallbackItems);

	function loadLocal(): NewsItem[] {
		try {
			const raw = JSON.parse(localStorage.getItem(CUSTOM_NEWS_KEY) || '[]');
			if (!Array.isArray(raw)) return [];
			return raw
				.map((p: any) => ({
					line1: (p.title || p.line1 || '').toString().trim(),
					line2: (p.summary || p.line2 || '').toString().trim(),
					sourceUrl: p.sourceUrl || null,
					documentId: p.id || p.documentId,
					local: true
				}))
				.filter((p: NewsItem) => p.line1);
		} catch {
			return [];
		}
	}

	onMount(async () => {
		let remote: NewsItem[] = [];
		try {
			const res = await fetch(NATIONAL_NEWS_API);
			if (res.ok) {
				const data = await res.json();
				if (data.posts && data.posts.length > 0) {
					remote = data.posts.map((p: any) => ({
						line1: p.title,
						line2: p.summary || p.category || '',
						sourceUrl: p.sourceUrl || null,
						documentId: p.documentId
					}));
				}
			}
		} catch {
			// fallback להמשך
		}

		const local = loadLocal();
		const merged = [...local, ...remote];
		if (merged.length > 0) newsItems = merged;
	});
</script>

<section
	aria-label={tFn('news_ticker_aria_section')}
	class="news-ticker-container border-y border-indigo-300/50 bg-[linear-gradient(to_right,#e9d5ff_0%,#ddd6fe_25%,#c7d2fe_50%,#ddd6fe_75%,#e9d5ff_100%)] py-3 backdrop-blur-md shadow-lg"
>
	<!-- תוכן נגיש לקוראי מסך -->
	<ul class="sr-only">
		{#each newsItems as item}
			<li>{item.fallbackKey ? tFn(item.line1) : item.line1} – {item.fallbackKey ? tFn(item.line2) : item.line2}</li>
		{/each}
	</ul>

	<button
		onclick={() => (paused = !paused)}
		class="sr-only focus:not-sr-only focus:fixed focus:top-16 focus:right-4 focus:z-50 focus:bg-blue-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
		aria-label={paused ? tFn('news_ticker_aria_resume') : tFn('news_ticker_aria_pause')}
	>
		{paused ? tFn('news_ticker_btn_resume') : tFn('news_ticker_btn_pause')}
	</button>

	<div class="mx-auto max-w-7xl flex items-center px-8 md:px-4" aria-hidden="true">
		<!-- תווית "חדשות" - בזהב/ענבר להתאמה לערכת הצבעים של האתר -->
		<div
			class="z-10 bg-gradient-to-br from-amber-400 to-yellow-600 px-5 py-3 rounded-lg text-base font-black text-gray-900 shadow-xl flex-shrink-0 ml-5 flex-col items-center justify-center border-2 border-amber-200 lg:flex hidden leading-tight"
		>
			<span>{tFn('news_ticker_label_news')}</span>
		</div>

		<!-- תוכן גולל -->
		<div class="ticker-viewport overflow-hidden flex-grow relative h-12">
			<div
				class="ticker-content flex gap-6 md:gap-14 items-center absolute right-0 whitespace-nowrap h-full"
				class:paused
			>
				{#each [...newsItems, ...newsItems] as item}
					<div class="flex items-center gap-6 md:gap-14 h-full">
						<div class="flex flex-col justify-center text-center">
							{#if item.local}
								<span class="text-[10px] font-bold text-indigo-700 mb-0.5 tracking-wide">{tFn('news_ticker_brand_badge')}</span>
							{/if}
							{#if item.sourceUrl}
								<a
									href={item.sourceUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="text-xs md:text-xl font-extrabold text-indigo-900 hover:text-indigo-700 transition-colors"
								>{item.fallbackKey ? tFn(item.line1) : item.line1}</a>
							{:else}
								<span class="text-xs md:text-xl font-extrabold text-indigo-900">{item.fallbackKey ? tFn(item.line1) : item.line1}</span>
							{/if}
							{#if item.line2}
								<span class="text-[10px] md:text-base font-bold text-slate-700">{item.fallbackKey ? tFn(item.line2) : item.line2}</span>
							{/if}
						</div>
						<!-- מפריד -->
						<div class="h-10 w-px bg-gradient-to-b from-transparent via-purple-500/60 to-transparent"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.ticker-viewport {
		mask-image: linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%);
		-webkit-mask-image: linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%);
	}
	.ticker-content {
		right: 0;
		animation: ticker-move 60s linear infinite;
	}

	@keyframes ticker-move {
		from { transform: translateX(0); }
		to   { transform: translateX(50%); }
	}

	.news-ticker-container:hover .ticker-content,
	.ticker-content.paused {
		animation-play-state: paused;
	}

	@media (prefers-reduced-motion: reduce) {
		.ticker-content {
			animation: none;
			position: static;
			white-space: normal;
			flex-wrap: wrap;
		}
	}
</style>
