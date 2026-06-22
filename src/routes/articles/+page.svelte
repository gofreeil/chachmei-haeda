<script lang="ts">
	import { onMount } from 'svelte';
	import { articles as staticArticles, pickLang, type Article } from '$lib/data/articles';
	import { qa as staticQa, pickLang as pickLangQa, type QaItem } from '$lib/data/qa';
	import { loadArticles } from '$lib/services/articles-service';
	import { loadQa } from '$lib/services/qa-service';
	import FancyHeading from '$lib/components/FancyHeading.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	const ITEMS_PAGE_SIZE = 3; // עד 3 פריטים לעמוד (כדי להכיל פריטים מרובים לאורך הסרגל הצדדי)
	const SEARCH_PAGE_SIZE = 8;

	let allArticles = $state<Article[]>(staticArticles);
	let qa = $state<QaItem[]>(staticQa);
	let searchQuery = $state('');
	// ברירת מחדל = העמוד החדש ביותר (האחרון). מספר גבוה ייחתך אוטומטית ל-itemsTotalPages.
	let itemsPage = $state(Number.MAX_SAFE_INTEGER);
	let searchPage = $state(1);

	function fmtDate(d: string): string {
		const [y, m, day] = d.split('-');
		return `${day}.${m}.${y}`;
	}

	type Entry =
		| { type: 'article'; date: string; item: Article }
		| { type: 'qa'; date: string; item: QaItem };

	onMount(async () => {
		try {
			const params = new URLSearchParams(window.location.search);
			const q = params.get('q');
			if (q) searchQuery = q;
		} catch {}
		try {
			const [a, q] = await Promise.all([loadArticles(), loadQa()]);
			if (a.length) allArticles = a;
			if (q.length) qa = q;
		} catch {}
	});

	let sorted = $derived([...allArticles].sort((a, b) => b.date.localeCompare(a.date)));

	// איחוד מאמרים ושאלות-תשובות בסדר עולה לפי תאריך (ישן→חדש)
	// המספור: #1=הישן ביותר, #N=החדש ביותר. דף 1 מכיל את הפריטים הישנים, הדף האחרון את החדשים.
	const entriesAsc = $derived.by<Entry[]>(() => {
		const articleEntries: Entry[] = allArticles.map((a) => ({
			type: 'article' as const,
			date: a.date,
			item: a
		}));
		const qaEntries: Entry[] = qa.map((q) => ({
			type: 'qa' as const,
			date: q.answerDate,
			item: q
		}));
		return [...articleEntries, ...qaEntries].sort((a, b) => a.date.localeCompare(b.date));
	});

	// מספור סידורי כרונולוגי (1=הישן ביותר)
	const entriesNumbered = $derived(
		entriesAsc.map((e, i) => ({ ...e, number: i + 1 }))
	);

	// pagination — בתוך כל עמוד הסדר הפוך (חדש למעלה) כדי שהפריט המאוחר ביותר יוצג ראשון
	const itemsTotalPages = $derived(Math.max(1, Math.ceil(entriesNumbered.length / ITEMS_PAGE_SIZE)));
	const itemsPageSafe = $derived(Math.min(itemsPage, itemsTotalPages));
	const itemsPaged = $derived(
		entriesNumbered
			.slice((itemsPageSafe - 1) * ITEMS_PAGE_SIZE, itemsPageSafe * ITEMS_PAGE_SIZE)
			.slice()
			.reverse()
	);

	// תוצאות חיפוש משולבות
	const articleMatches = $derived.by(() => {
		const q = searchQuery.trim().replace(/^#+/, '').toLowerCase();
		if (!q) return [] as Article[];
		return sorted.filter((a) => {
			const tagsStr = (a.tags ?? []).map((t) => pickLang(t, _loc)).join(' ');
			const hay = `${pickLang(a.title, _loc)} ${pickLang(a.author, _loc)} ${pickLang(a.excerpt, _loc)} ${pickLang(a.body, _loc)} ${tagsStr}`.toLowerCase();
			return hay.includes(q);
		});
	});

	const qaMatches = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return [] as QaItem[];
		return qa.filter((item) => {
			const hay = `${pickLangQa(item.question, _loc)} ${pickLangQa(item.answer, _loc)} ${pickLangQa(item.answeredBy, _loc)} ${pickLangQa(item.asker, _loc)} ${item.topic}`.toLowerCase();
			return hay.includes(q);
		});
	});

	const totalMatches = $derived(articleMatches.length + qaMatches.length);

	// pagination לתוצאות חיפוש — איחוד מאמרים ושאלות-תשובות לעמוד אחיד
	type SearchEntry = { kind: 'article'; item: Article } | { kind: 'qa'; item: QaItem };
	const searchEntries = $derived.by<SearchEntry[]>(() => [
		...articleMatches.map((item) => ({ kind: 'article' as const, item })),
		...qaMatches.map((item) => ({ kind: 'qa' as const, item }))
	]);
	const searchTotalPages = $derived(Math.max(1, Math.ceil(searchEntries.length / SEARCH_PAGE_SIZE)));
	const searchPageSafe = $derived(Math.min(searchPage, searchTotalPages));
	const searchPagedArticles = $derived(
		searchEntries
			.slice((searchPageSafe - 1) * SEARCH_PAGE_SIZE, searchPageSafe * SEARCH_PAGE_SIZE)
			.filter((e): e is { kind: 'article'; item: Article } => e.kind === 'article')
			.map((e) => e.item)
	);
	const searchPagedQa = $derived(
		searchEntries
			.slice((searchPageSafe - 1) * SEARCH_PAGE_SIZE, searchPageSafe * SEARCH_PAGE_SIZE)
			.filter((e): e is { kind: 'qa'; item: QaItem } => e.kind === 'qa')
			.map((e) => e.item)
	);

	// איפוס עמוד החיפוש כשהמחרוזת משתנה
	$effect(() => {
		searchQuery;
		searchPage = 1;
	});

	function highlight(text: string, q: string): string {
		if (!q) return text;
		const needle = q.trim();
		if (!needle) return text;
		const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		return text.replace(new RegExp(escaped, 'gi'), (m) => `<mark class="bg-yellow-200 text-gray-900 px-0.5 rounded">${m}</mark>`);
	}

	function snippet(text: string, q: string, len = 160): string {
		if (!q) return text.slice(0, len);
		const needle = q.trim().toLowerCase();
		const idx = text.toLowerCase().indexOf(needle);
		if (idx < 0) return text.slice(0, len);
		const start = Math.max(0, idx - 40);
		const end = Math.min(text.length, idx + needle.length + 120);
		return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
	}
</script>

<svelte:head>
	<title>{tFn('articles_page_title')}</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-6">
		<FancyHeading>
			<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent whitespace-nowrap">
				{tFn('articles_hero_title')}
			</h1>
		</FancyHeading>
	</header>

	<!-- כותרת משנה מאוחדת -->
	<h2 class="text-center text-xl md:text-2xl font-black bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-6">
		📜 {tFn('articles_subtitle')} 📚
	</h2>

	<!-- שורת חיפוש -->
	<div class="mb-8 max-w-2xl mx-auto">
		<div class="relative">
			<span class="absolute inset-y-0 right-3 flex items-center text-blue-700 text-lg pointer-events-none" aria-hidden="true">🔍</span>
			<input
				type="search"
				bind:value={searchQuery}
				placeholder={tFn('articles_search_placeholder')}
				aria-label={tFn('articles_search_aria')}
				class="w-full pr-10 pl-10 py-2.5 rounded-full bg-white/80 border-2 border-blue-300/60 text-gray-900 placeholder-gray-500 font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-colors shadow-sm"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => (searchQuery = '')}
					aria-label={tFn('articles_clear_search')}
					class="absolute inset-y-0 left-2 flex items-center justify-center w-7 h-full text-gray-600 hover:text-gray-900"
				>
					✕
				</button>
			{/if}
		</div>
		{#if searchQuery}
			<p class="mt-2 text-xs text-center text-gray-300 font-medium">
				{tFn('articles_results_found')} {totalMatches} {tFn('articles_results_word')}
				{#if totalMatches > 0}
					· {articleMatches.length} {tFn('articles_label_articles')} · {qaMatches.length} {tFn('articles_label_qa')}
				{/if}
			</p>
		{/if}
	</div>

	{#if searchQuery}
		<!-- תוצאות חיפוש -->
		{#if totalMatches === 0}
			<p class="text-center text-gray-400 py-12">{tFn('articles_no_results')} "{searchQuery}"</p>
		{/if}

		{#if searchPagedArticles.length > 0}
			<div class="mb-8">
				<h3 class="text-sm font-black text-blue-300 mb-3">📜 {tFn('articles_label_articles')} ({articleMatches.length})</h3>
				<div class="space-y-3">
					{#each searchPagedArticles as a (a.slug)}
						<a
							href="/articles/{a.slug}"
							class="block rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:border-blue-400/70 transition-all p-5"
						>
							<div class="flex items-start justify-between gap-3 flex-wrap">
								<h2 class="text-lg md:text-xl font-bold text-white">{@html highlight(pickLang(a.title, _loc), searchQuery)}</h2>
								<span class="text-xs text-gray-400 flex-shrink-0">{a.date}</span>
							</div>
							<p class="mt-1 text-xs text-blue-300">{tFn('articles_by')} {@html highlight(pickLang(a.author, _loc), searchQuery)}</p>
							<p class="mt-2 text-sm text-gray-300 leading-relaxed">{@html highlight(snippet(pickLang(a.excerpt, _loc), searchQuery, 180), searchQuery)}</p>
							{#if a.tags && a.tags.length > 0}
								<div class="mt-3 flex flex-wrap gap-1.5">
									{#each a.tags as tag}
										{@const tagStr = pickLang(tag, _loc)}
										<button
											type="button"
											onclick={(e) => { e.preventDefault(); e.stopPropagation(); searchQuery = '#' + tagStr; }}
											class="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-gray-300 text-[11px] font-medium hover:bg-white/15 hover:border-white/25 transition-colors"
										>
											#{tagStr}
										</button>
									{/each}
								</div>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		{/if}

		{#if searchPagedQa.length > 0}
			<div class="mb-8">
				<h3 class="text-sm font-black text-indigo-300 mb-3">📚 {tFn('articles_label_qa_full')} ({qaMatches.length})</h3>
				<div class="space-y-3">
					{#each searchPagedQa as item (item.slug)}
						<a
							href="/qa#{item.slug}"
							class="block rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:border-indigo-400/70 transition-all p-5"
						>
							<div class="flex items-start justify-end mb-1">
								<span class="text-xs text-gray-400">{item.answerDate}</span>
							</div>
							<p class="mt-2 text-sm font-bold text-white leading-snug">
								<span class="text-indigo-300">{tFn('articles_question_label')}</span>
								{@html highlight(snippet(pickLangQa(item.question, _loc), searchQuery, 140), searchQuery)}
							</p>
							<p class="mt-2 text-sm text-gray-300 leading-relaxed">
								<span class="text-indigo-300 font-bold">{tFn('articles_answer_by')} {pickLangQa(item.answeredBy, _loc)}:</span>
								{@html highlight(snippet(pickLangQa(item.answer, _loc), searchQuery, 180), searchQuery)}
							</p>
							<div class="mt-3 flex flex-wrap gap-1.5">
								<span class="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-gray-300 text-[11px] font-medium">
									#{item.topic}
								</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		{#if totalMatches > 0}
			<Pagination
				currentPage={searchPageSafe}
				totalPages={searchTotalPages}
				color="blue"
				onPageChange={(p) => (searchPage = p)}
			/>
		{/if}
	{:else}
		<!-- רשימה מאוחדת: מאמרים ושאלות-תשובות לפי תאריך -->
		{#if entriesNumbered.length === 0}
			<p class="text-center text-gray-400 py-12">{tFn('articles_no_items')}</p>
		{:else}
			<div class="space-y-4">
				{#each itemsPaged as entry (entry.type + ':' + entry.item.slug)}
					{#if entry.type === 'article'}
						{@const a = entry.item}
						<article
							id={a.slug}
							class="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-5 md:p-7 scroll-mt-24"
						>
							<div class="flex items-center gap-3 mb-3 flex-wrap">
								<span class="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/30 border-2 border-blue-300/50 text-white font-black text-base md:text-lg shadow-[0_2px_8px_rgba(37,99,235,0.35)]">
									{entry.number}
								</span>
								<span class="text-xs font-bold text-blue-200">📜 {tFn('articles_item_article')} · {tFn('articles_item_word')} {entry.number} {tFn('articles_item_of')} {entriesNumbered.length}</span>
							</div>
							<div class="flex items-start justify-between gap-3 flex-wrap">
								<h2 class="text-xl md:text-2xl font-bold text-white">{pickLang(a.title, _loc)}</h2>
								<span class="text-xs text-gray-400 flex-shrink-0">{a.date}</span>
							</div>
							<p class="mt-1 text-sm text-blue-300">{tFn('articles_by')} {pickLang(a.author, _loc)}</p>
							<p class="mt-3 text-gray-200 leading-relaxed font-medium">{pickLang(a.excerpt, _loc)}</p>
							<div class="mt-5 pt-4 border-t border-white/10 text-gray-100 leading-relaxed text-sm md:text-base whitespace-pre-line">
								{pickLang(a.body, _loc)}
							</div>
							{#if a.tags && a.tags.length > 0}
								<div class="mt-5 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
									{#each a.tags as tag}
										{@const tagStr = pickLang(tag, _loc)}
										<button
											type="button"
											onclick={() => (searchQuery = '#' + tagStr)}
											class="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-gray-300 text-[11px] font-medium hover:bg-white/15 hover:border-white/25 transition-colors"
										>
											#{tagStr}
										</button>
									{/each}
								</div>
							{/if}
							<div class="mt-3 text-left">
								<a href="/articles/{a.slug}" class="text-[11px] text-blue-300/70 hover:text-blue-300 underline">
									{tFn('articles_direct_link')}
								</a>
							</div>
						</article>
					{:else}
						{@const q = entry.item}
						<article
							id={q.slug}
							class="rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-5 md:p-7 scroll-mt-24"
						>
							<div class="flex items-center gap-3 mb-3 flex-wrap">
								<span class="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-500/30 border-2 border-indigo-300/50 text-white font-black text-base md:text-lg shadow-[0_2px_8px_rgba(79,70,229,0.35)]">
									{entry.number}
								</span>
								<span class="text-xs font-bold text-indigo-200">📚 {tFn('articles_item_qa')} · {tFn('articles_item_word')} {entry.number} {tFn('articles_item_of')} {entriesNumbered.length}</span>
							</div>
							<div class="flex items-start justify-between gap-3 flex-wrap">
								<h2 class="text-xl md:text-2xl font-bold text-white">{tFn('articles_question_word')} - {pickLangQa(q.asker, _loc)}</h2>
								<span class="text-xs text-gray-400 flex-shrink-0">{fmtDate(q.answerDate)}</span>
							</div>
							<p class="mt-1 text-sm text-indigo-300">{tFn('articles_asked_on')} {fmtDate(q.askDate)}</p>
							<p class="mt-3 text-gray-200 leading-relaxed font-medium whitespace-pre-line">{pickLangQa(q.question, _loc)}</p>
							<div class="mt-5 pt-4 border-t border-white/10">
								<h4 class="text-sm md:text-base font-black text-indigo-300 mb-2">
									{tFn('articles_answer_of')} {pickLangQa(q.answeredBy, _loc)} · {fmtDate(q.answerDate)}
								</h4>
								<p class="text-gray-100 leading-relaxed text-sm md:text-base whitespace-pre-line">{pickLangQa(q.answer, _loc)}</p>
							</div>
							<div class="mt-5 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
								<button
									type="button"
									onclick={() => (searchQuery = q.topic)}
									class="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-gray-300 text-[11px] font-medium hover:bg-white/15 hover:border-white/25 transition-colors"
								>
									#{q.topic}
								</button>
							</div>
						</article>
					{/if}
				{/each}
			</div>

			<a
				href="/ask"
				class="ask-cta mt-8 flex items-center justify-center gap-3 rounded-2xl border-2 p-4 md:p-5 transition-all group"
			>
				<img
					src="/images/1124a5ea-412c-4c49-8d76-e4366711384d.jfif"
					alt={tFn('home_logo_alt')}
					class="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 object-cover rounded-full ring-2 ring-white/80 shadow-lg"
				/>
				<div class="text-center min-w-0">
					<h3 class="ask-cta-title text-base md:text-lg font-black leading-tight">
						{tFn('home_ask_cta_title')}
					</h3>
					<p class="ask-cta-text text-xs md:text-sm font-bold leading-snug">
						{tFn('home_ask_cta_text')}
					</p>
				</div>
			</a>

			<Pagination
				currentPage={itemsPageSafe}
				totalPages={itemsTotalPages}
				color="blue"
				onPageChange={(p) => (itemsPage = p)}
			/>
		{/if}
	{/if}
</section>

<style>
	:global(.ask-cta) {
		background-image: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%) !important;
		border-color: #c7d2fe !important;
		box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.45), 0 4px 10px -4px rgba(79, 70, 229, 0.35) !important;
	}
	:global(.ask-cta:hover) {
		background-image: linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #1d4ed8 100%) !important;
		box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.6), 0 6px 12px -4px rgba(79, 70, 229, 0.5) !important;
		transform: scale(1.02);
	}
	:global(.ask-cta .ask-cta-title),
	:global(.ask-cta .ask-cta-text) {
		color: #ffffff !important;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
		-webkit-text-fill-color: #ffffff !important;
		background: none !important;
	}
	:global(.ask-cta .ask-cta-emoji) {
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
	}
</style>
