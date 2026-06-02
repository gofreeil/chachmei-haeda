<script lang="ts">
	import { onMount } from 'svelte';

	// אותו מקור שאתר "קהילה בשכונה" משתמש בו — סנכרון חד-כיווני משם לכאן.
	const NATIONAL_NEWS_API = 'https://criticism.vercel.app/api/national-news';
	const CUSTOM_NEWS_KEY = 'chachmei-custom-news';

	type NewsItem = {
		line1: string;
		line2: string;
		sourceUrl?: string | null;
		documentId?: string;
		local?: boolean;
	};

	// פריטי ברירת מחדל אם ה-API לא זמין ואין חדשות לוקאליות
	const fallbackItems: NewsItem[] = [
		{ line1: 'ברוכים הבאים לחכמי העדה', line2: 'בית דין לבוררות ושלום על פי תורת ישראל' },
		{ line1: 'מסלול "משכין שלום" — ליווי לאחר פסק דין', line2: 'בית הדין משיק מסלול ליווי חדש' },
		{ line1: 'הקוד האתי UECC', line2: 'הצטרף לחותמים על הקוד המוסרי הכלל-עולמי' }
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
	aria-label="חדשות"
	class="news-ticker-container border-y border-blue-900/40 bg-[#0f172a]/95 py-3 backdrop-blur-md shadow-lg"
>
	<!-- תוכן נגיש לקוראי מסך -->
	<ul class="sr-only">
		{#each newsItems as item}
			<li>{item.line1} – {item.line2}</li>
		{/each}
	</ul>

	<button
		onclick={() => (paused = !paused)}
		class="sr-only focus:not-sr-only focus:fixed focus:top-16 focus:right-4 focus:z-50 focus:bg-blue-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
		aria-label={paused ? 'המשך הפעלת טיקר חדשות' : 'עצור טיקר חדשות'}
	>
		{paused ? '▶ המשך' : '⏸ עצור'}
	</button>

	<div class="mx-auto max-w-7xl flex items-center px-4" aria-hidden="true">
		<!-- תווית "חדשות" — בדומה לאתר קהילה בשכונה -->
		<div
			class="z-10 bg-red-600 px-5 py-3 rounded-lg text-base font-black text-white shadow-xl flex-shrink-0 ml-5 flex-col items-center justify-center border border-red-400 lg:flex hidden leading-tight"
		>
			<span>חדשות</span>
		</div>

		<!-- תוכן גולל -->
		<div class="overflow-hidden flex-grow relative h-12">
			<div
				class="ticker-content flex gap-14 items-center absolute right-0 whitespace-nowrap h-full"
				class:paused
			>
				{#each [...newsItems, ...newsItems] as item}
					<div class="flex items-center gap-14 h-full">
						<div class="flex flex-col justify-center text-center">
							{#if item.local}
								<span class="text-[10px] font-bold text-amber-300 mb-0.5 tracking-wide">חכמי העדה</span>
							{/if}
							{#if item.sourceUrl}
								<a
									href={item.sourceUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="text-lg md:text-xl font-bold text-blue-100 hover:text-blue-300 transition-colors"
								>{item.line1}</a>
							{:else}
								<span class="text-lg md:text-xl font-bold text-blue-100">{item.line1}</span>
							{/if}
							{#if item.line2}
								<span class="text-sm md:text-base font-medium text-blue-300">{item.line2}</span>
							{/if}
						</div>
						<!-- מפריד -->
						<div class="h-10 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.ticker-content {
		right: 0;
		animation: ticker-move 85s linear infinite;
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
