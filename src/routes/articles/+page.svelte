<script lang="ts">
	import { onMount } from 'svelte';
	import { articles as staticArticles, type Article } from '$lib/data/articles';
	import { qa, type QaItem } from '$lib/data/qa';
	import FancyHeading from '$lib/components/FancyHeading.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	const PAGE_SIZE = 8;

	let allArticles = $state<Article[]>(staticArticles);
	let searchQuery = $state('');
	let archivePage = $state(1);
	let qaPage = $state(1);
	let searchPage = $state(1);

	function fmtDate(d: string): string {
		const [y, m, day] = d.split('-');
		return `${day}.${m}.${y}`;
	}

	function slowScrollTo(targetId: string) {
		const el = document.getElementById(targetId);
		if (!el) return;
		const header = document.querySelector('.site-header') as HTMLElement | null;
		const headerOffset = header ? header.getBoundingClientRect().height : 0;
		const targetY = el.getBoundingClientRect().top + window.scrollY - headerOffset - 4;
		const startY = window.scrollY;
		const distance = targetY - startY;
		if (Math.abs(distance) < 2) return;
		const duration = Math.min(2400, Math.max(1000, Math.abs(distance) * 1.4));
		const startTime = Date.now();
		const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
		const handle = window.setInterval(() => {
			const elapsed = Date.now() - startTime;
			const t = Math.min(1, elapsed / duration);
			window.scrollTo(0, startY + distance * easeInOutCubic(t));
			if (t >= 1) window.clearInterval(handle);
		}, 16);
	}

	onMount(() => {
		try {
			const custom = JSON.parse(localStorage.getItem('chachmei-custom-articles') || '[]');
			if (Array.isArray(custom)) allArticles = [...custom, ...staticArticles];
		} catch {}
		// אם הגיעו עם ?q=... מקישור לתגית - אכלוס שדה החיפוש
		try {
			const params = new URLSearchParams(window.location.search);
			const q = params.get('q');
			if (q) searchQuery = q;
		} catch {}
	});

	let sorted = $derived([...allArticles].sort((a, b) => b.date.localeCompare(a.date)));
	let latest = $derived(sorted[0]);
	let archive = $derived(sorted.slice(1));

	// pagination לארכיון
	const archiveTotalPages = $derived(Math.max(1, Math.ceil(archive.length / PAGE_SIZE)));
	const archivePageSafe = $derived(Math.min(archivePage, archiveTotalPages));
	const archivePaged = $derived(
		archive.slice((archivePageSafe - 1) * PAGE_SIZE, archivePageSafe * PAGE_SIZE)
	);

	// שאלות-תשובות ממוינות ועם pagination
	const qaSorted = $derived([...qa].sort((a, b) => b.answerDate.localeCompare(a.answerDate)));
	const qaTotalPages = $derived(Math.max(1, Math.ceil(qaSorted.length / PAGE_SIZE)));
	const qaPageSafe = $derived(Math.min(qaPage, qaTotalPages));
	const qaPaged = $derived(
		qaSorted.slice((qaPageSafe - 1) * PAGE_SIZE, qaPageSafe * PAGE_SIZE)
	);

	// תוצאות חיפוש משולבות
	const articleMatches = $derived.by(() => {
		const q = searchQuery.trim().replace(/^#+/, '').toLowerCase();
		if (!q) return [] as Article[];
		return sorted.filter((a) => {
			const tagsStr = (a.tags ?? []).join(' ');
			const hay = `${a.title} ${a.author} ${a.excerpt} ${a.body} ${tagsStr}`.toLowerCase();
			return hay.includes(q);
		});
	});

	const qaMatches = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return [] as QaItem[];
		return qa.filter((item) => {
			const hay = `${item.question} ${item.answer} ${item.answeredBy} ${item.asker} ${item.topic}`.toLowerCase();
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
	const searchTotalPages = $derived(Math.max(1, Math.ceil(searchEntries.length / PAGE_SIZE)));
	const searchPageSafe = $derived(Math.min(searchPage, searchTotalPages));
	const searchPagedArticles = $derived(
		searchEntries
			.slice((searchPageSafe - 1) * PAGE_SIZE, searchPageSafe * PAGE_SIZE)
			.filter((e): e is { kind: 'article'; item: Article } => e.kind === 'article')
			.map((e) => e.item)
	);
	const searchPagedQa = $derived(
		searchEntries
			.slice((searchPageSafe - 1) * PAGE_SIZE, searchPageSafe * PAGE_SIZE)
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
	<title>היכל הרוח - חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-6">
		<FancyHeading>
			<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent whitespace-nowrap">
				היכל הרוח
			</h1>
		</FancyHeading>
	</header>

	<!-- ניווט מהיר -->
	<nav class="mb-6 flex flex-wrap justify-center gap-3" aria-label="ניווט בתוך העמוד">
		<button
			type="button"
			onclick={() => slowScrollTo('sep-articles')}
			class="px-5 py-2.5 rounded-full bg-blue-500/25 text-blue-100 font-bold text-sm md:text-base border border-blue-400/50 hover:bg-blue-500/35 hover:border-blue-300/70 transition-colors"
		>
			📜 מאמרים
		</button>
		<button
			type="button"
			onclick={() => slowScrollTo('sep-qa')}
			class="px-5 py-2.5 rounded-full bg-indigo-500/25 text-indigo-100 font-bold text-sm md:text-base border border-indigo-400/50 hover:bg-indigo-500/35 hover:border-indigo-300/70 transition-colors"
		>
			🕮 שאלות ותשובות
		</button>
	</nav>

	<!-- שורת חיפוש -->
	<div class="mb-8 max-w-2xl mx-auto">
		<div class="relative">
			<span class="absolute inset-y-0 right-3 flex items-center text-blue-700 text-lg pointer-events-none" aria-hidden="true">🔍</span>
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="חיפוש במאמרים ובתשובות..."
				aria-label="חיפוש במאמרים ובתשובות"
				class="w-full pr-10 pl-10 py-2.5 rounded-full bg-white/80 border-2 border-blue-300/60 text-gray-900 placeholder-gray-500 font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-colors shadow-sm"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => (searchQuery = '')}
					aria-label="נקה חיפוש"
					class="absolute inset-y-0 left-2 flex items-center justify-center w-7 h-full text-gray-600 hover:text-gray-900"
				>
					✕
				</button>
			{/if}
		</div>
		{#if searchQuery}
			<p class="mt-2 text-xs text-center text-gray-300 font-medium">
				נמצאו {totalMatches} תוצאות
				{#if totalMatches > 0}
					· {articleMatches.length} מאמרים · {qaMatches.length} שאלות-תשובות
				{/if}
			</p>
		{/if}
	</div>

	{#if searchQuery}
		<!-- תוצאות חיפוש -->
		{#if totalMatches === 0}
			<p class="text-center text-gray-400 py-12">לא נמצאו תוצאות עבור "{searchQuery}"</p>
		{/if}

		{#if searchPagedArticles.length > 0}
			<div class="mb-8">
				<h3 class="text-sm font-black text-blue-300 mb-3">📜 מאמרים ({articleMatches.length})</h3>
				<div class="space-y-3">
					{#each searchPagedArticles as a (a.slug)}
						<a
							href="/articles/{a.slug}"
							class="block rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:border-blue-400/70 transition-all p-5"
						>
							<div class="flex items-start justify-between gap-3 flex-wrap">
								<h2 class="text-lg md:text-xl font-bold text-white">{@html highlight(a.title, searchQuery)}</h2>
								<span class="text-xs text-gray-400 flex-shrink-0">{a.date}</span>
							</div>
							<p class="mt-1 text-xs text-blue-300">מאת: {@html highlight(a.author, searchQuery)}</p>
							<p class="mt-2 text-sm text-gray-300 leading-relaxed">{@html highlight(snippet(a.excerpt, searchQuery, 180), searchQuery)}</p>
							{#if a.tags && a.tags.length > 0}
								<div class="mt-3 flex flex-wrap gap-1.5">
									{#each a.tags as tag}
										<button
											type="button"
											onclick={(e) => { e.preventDefault(); e.stopPropagation(); searchQuery = '#' + tag; }}
											class="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-gray-300 text-[11px] font-medium hover:bg-white/15 hover:border-white/25 transition-colors"
										>
											#{tag}
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
				<h3 class="text-sm font-black text-indigo-300 mb-3">🕮 שאלות ותשובות ({qaMatches.length})</h3>
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
								<span class="text-indigo-300">שאלה:</span>
								{@html highlight(snippet(item.question, searchQuery, 140), searchQuery)}
							</p>
							<p class="mt-2 text-sm text-gray-300 leading-relaxed">
								<span class="text-indigo-300 font-bold">תשובת {item.answeredBy}:</span>
								{@html highlight(snippet(item.answer, searchQuery, 180), searchQuery)}
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
		<!-- ============ סקציית המאמרים ============ -->
		<div id="sep-articles" class="scroll-mt-24 mt-2 mb-8 flex items-center gap-3 max-w-3xl mx-auto" aria-hidden="true">
			<div
				class="h-2 flex-1 bg-gradient-to-l from-transparent via-blue-500/70 to-blue-700 shadow-[0_1px_2px_rgba(30,64,175,0.35)]"
				style="clip-path: polygon(0% 0%, 0% 100%, 100% 50%);"
			></div>
			<span class="text-xl md:text-2xl text-blue-400 drop-shadow-[0_1px_1px_rgba(30,64,175,0.4)]">📜</span>
			<div
				class="h-2 flex-1 bg-gradient-to-r from-transparent via-blue-500/70 to-blue-700 shadow-[0_1px_2px_rgba(30,64,175,0.35)]"
				style="clip-path: polygon(0% 50%, 100% 0%, 100% 100%);"
			></div>
		</div>
		<h2 class="text-center text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-6">
			מאמרים
		</h2>

		<!-- תצוגה רגילה (ללא חיפוש) -->
		{#if latest}
			<div class="mb-6">
				<div class="text-xs font-bold text-blue-300 mb-2">🆕 מאמר אחרון (מוצג גם בדף הבית)</div>
				<article
					id={latest.slug}
					class="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-5 md:p-7 scroll-mt-24"
				>
					<div class="flex items-start justify-between gap-3 flex-wrap">
						<h2 class="text-xl md:text-2xl font-bold text-white">{latest.title}</h2>
						<span class="text-xs text-gray-400 flex-shrink-0">{latest.date}</span>
					</div>
					<p class="mt-1 text-sm text-blue-300">מאת: {latest.author}</p>
					<p class="mt-3 text-gray-200 leading-relaxed font-medium">{latest.excerpt}</p>
					<div class="mt-5 pt-4 border-t border-white/10 text-gray-100 leading-relaxed text-sm md:text-base whitespace-pre-line">
						{latest.body}
					</div>
					{#if latest.tags && latest.tags.length > 0}
						<div class="mt-5 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
							{#each latest.tags as tag}
								<button
									type="button"
									onclick={() => (searchQuery = '#' + tag)}
									class="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-gray-300 text-[11px] font-medium hover:bg-white/15 hover:border-white/25 transition-colors"
								>
									#{tag}
								</button>
							{/each}
						</div>
					{/if}
					<div class="mt-3 text-left">
						<a href="/articles/{latest.slug}" class="text-[11px] text-blue-300/70 hover:text-blue-300 underline">
							קישור ישיר ←
						</a>
					</div>
				</article>
			</div>
		{/if}

		{#if archive.length > 0}
			<div class="text-xs font-bold text-gray-400 mb-3 mt-8">📚 מאמרים קודמים ({archive.length})</div>
			<div class="space-y-4">
				{#each archivePaged as a}
					<article
						id={a.slug}
						class="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-7 scroll-mt-24"
					>
						<div class="flex items-start justify-between gap-3 flex-wrap">
							<h2 class="text-xl md:text-2xl font-bold text-white">
								{a.title}
							</h2>
							<span class="text-xs text-gray-500 flex-shrink-0">{a.date}</span>
						</div>
						<p class="mt-1 text-sm text-blue-300">מאת: {a.author}</p>
						<p class="mt-3 text-gray-200 leading-relaxed font-medium">{a.excerpt}</p>
						<div class="mt-5 pt-4 border-t border-white/10 text-gray-100 leading-relaxed text-sm md:text-base whitespace-pre-line">
							{a.body}
						</div>
						{#if a.tags && a.tags.length > 0}
							<div class="mt-5 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
								{#each a.tags as tag}
									<button
										type="button"
										onclick={() => (searchQuery = '#' + tag)}
										class="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-gray-300 text-[11px] font-medium hover:bg-white/15 hover:border-white/25 transition-colors"
									>
										#{tag}
									</button>
								{/each}
							</div>
						{/if}
						<div class="mt-3 text-left">
							<a href="/articles/{a.slug}" class="text-[11px] text-blue-300/70 hover:text-blue-300 underline">
								קישור ישיר ←
							</a>
						</div>
					</article>
				{/each}
			</div>

			<Pagination
				currentPage={archivePageSafe}
				totalPages={archiveTotalPages}
				color="blue"
				onPageChange={(p) => (archivePage = p)}
			/>
		{/if}

		<!-- ============ סקציית שאלות ותשובות ============ -->
		<div id="sep-qa" class="scroll-mt-24 mt-14 mb-8 flex items-center gap-3 max-w-3xl mx-auto" aria-hidden="true">
			<div
				class="h-2 flex-1 bg-gradient-to-l from-transparent via-indigo-500/70 to-indigo-700 shadow-[0_1px_2px_rgba(79,70,229,0.35)]"
				style="clip-path: polygon(0% 0%, 0% 100%, 100% 50%);"
			></div>
			<span class="text-xl md:text-2xl text-indigo-400 drop-shadow-[0_1px_1px_rgba(79,70,229,0.4)]">🕮</span>
			<div
				class="h-2 flex-1 bg-gradient-to-r from-transparent via-indigo-500/70 to-indigo-700 shadow-[0_1px_2px_rgba(79,70,229,0.35)]"
				style="clip-path: polygon(0% 50%, 100% 0%, 100% 100%);"
			></div>
		</div>
		<h2 class="text-center text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent mb-2">
			שאלות ותשובות
		</h2>
		<p class="text-center text-gray-300 text-sm mb-6 max-w-2xl mx-auto">
			תשובות רבני בית הדין לשאלות בהלכה, מוסר עסקי, שלום בית ושבע מצוות בני נח
		</p>

		{#if qaSorted.length === 0}
			<p class="text-center text-gray-400 py-8">אין שאלות ותשובות להצגה.</p>
		{:else}
			<div class="space-y-5 max-w-3xl mx-auto">
				{#each qaPaged as q (q.slug)}
					<article
						id={q.slug}
						class="rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-5 md:p-6 scroll-mt-24"
					>
						<div class="flex items-center justify-end mb-3">
							<span class="text-xs font-bold text-gray-300">נשאל {fmtDate(q.askDate)}</span>
						</div>
						<h3 class="text-lg md:text-xl font-extrabold text-white mb-2">שאלה - {q.asker}</h3>
						<p class="text-gray-200 leading-relaxed mb-4">{q.question}</p>
						<div class="border-t border-indigo-300/40 pt-4">
							<h4 class="text-sm font-black text-indigo-300 mb-2">
								תשובת {q.answeredBy} · {fmtDate(q.answerDate)}
							</h4>
							<p class="text-gray-100 leading-relaxed font-medium">{q.answer}</p>
						</div>
						<div class="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2">
							<span class="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-gray-300 text-[11px] font-medium">
								#{q.topic}
							</span>
						</div>
					</article>
				{/each}
			</div>

			<a
				href="/ask"
				class="ask-cta mt-8 flex items-center justify-center gap-3 rounded-xl border-2 p-3 transition-all group max-w-3xl mx-auto"
			>
				<div class="text-2xl md:text-3xl flex-shrink-0 ask-cta-emoji">🕮</div>
				<div class="text-center min-w-0">
					<h3 class="ask-cta-title text-base md:text-lg font-black leading-tight">
						שאל את חכמי העדה
					</h3>
					<p class="ask-cta-text text-xs md:text-sm font-bold leading-snug">
						יש לך שאלה בהלכה, במוסר, בהבנת התורה, בחינוך, בשלום בית וכולי - פנה אל החכמים ותענה בהקדם האפשרי
					</p>
				</div>
			</a>

			<Pagination
				currentPage={qaPageSafe}
				totalPages={qaTotalPages}
				color="indigo"
				onPageChange={(p) => (qaPage = p)}
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
