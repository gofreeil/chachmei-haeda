<script lang="ts">
	import { onMount } from 'svelte';
	import { articles as staticArticles, type Article } from '$lib/data/articles';
	import { qa, type QaItem } from '$lib/data/qa';
	import FancyHeading from '$lib/components/FancyHeading.svelte';

	let allArticles = $state<Article[]>(staticArticles);
	let searchQuery = $state('');

	onMount(() => {
		try {
			const custom = JSON.parse(localStorage.getItem('chachmei-custom-articles') || '[]');
			if (Array.isArray(custom)) allArticles = [...custom, ...staticArticles];
		} catch {}
	});

	let sorted = $derived([...allArticles].sort((a, b) => b.date.localeCompare(a.date)));
	let latest = $derived(sorted[0]);
	let archive = $derived(sorted.slice(1));

	// תוצאות חיפוש משולבות
	const articleMatches = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return [] as Article[];
		return sorted.filter((a) => {
			const hay = `${a.title} ${a.author} ${a.excerpt} ${a.body}`.toLowerCase();
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
	<title>ארכיון מאמרי רבנים - חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-8">
		<FancyHeading>
			<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent whitespace-nowrap">
				ארכיון מאמרי רבנים
			</h1>
		</FancyHeading>
		<p class="mt-3 text-gray-300">כל מאמר אושר על ידי שלושה רבנים לפחות</p>
		<p class="mt-1 text-sm text-gray-500">המאמר האחרון מוצג בדף הבית; כל הקודמים מופיעים כאן</p>
	</header>

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

		{#if articleMatches.length > 0}
			<div class="mb-8">
				<h3 class="text-sm font-black text-blue-300 mb-3">📜 מאמרים ({articleMatches.length})</h3>
				<div class="space-y-3">
					{#each articleMatches as a (a.slug)}
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
						</a>
					{/each}
				</div>
			</div>
		{/if}

		{#if qaMatches.length > 0}
			<div class="mb-8">
				<h3 class="text-sm font-black text-indigo-300 mb-3">🕮 שאלות ותשובות ({qaMatches.length})</h3>
				<div class="space-y-3">
					{#each qaMatches as item (item.slug)}
						<a
							href="/qa#{item.slug}"
							class="block rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:border-indigo-400/70 transition-all p-5"
						>
							<div class="flex items-start justify-between gap-3 flex-wrap">
								<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600/80 text-white">{item.topic}</span>
								<span class="text-xs text-gray-400 flex-shrink-0">{item.answerDate}</span>
							</div>
							<p class="mt-2 text-sm font-bold text-white leading-snug">
								<span class="text-indigo-300">שאלה:</span>
								{@html highlight(snippet(item.question, searchQuery, 140), searchQuery)}
							</p>
							<p class="mt-2 text-sm text-gray-300 leading-relaxed">
								<span class="text-indigo-300 font-bold">תשובת {item.answeredBy}:</span>
								{@html highlight(snippet(item.answer, searchQuery, 180), searchQuery)}
							</p>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<!-- תצוגה רגילה (ללא חיפוש) -->
		{#if latest}
			<div class="mb-6">
				<div class="text-xs font-bold text-blue-300 mb-2">🆕 מאמר אחרון (מוצג גם בדף הבית)</div>
				<a
					href="/articles/{latest.slug}"
					class="block rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:border-blue-400/70 transition-all p-5"
				>
					<div class="flex items-start justify-between gap-3 flex-wrap">
						<h2 class="text-xl md:text-2xl font-bold text-white">{latest.title}</h2>
						<span class="text-xs text-gray-400 flex-shrink-0">{latest.date}</span>
					</div>
					<p class="mt-1 text-sm text-blue-300">מאת: {latest.author}</p>
					<p class="mt-3 text-gray-300 leading-relaxed">{latest.excerpt}</p>
				</a>
			</div>
		{/if}

		{#if archive.length > 0}
			<div class="text-xs font-bold text-gray-400 mb-3 mt-8">📚 מאמרים קודמים</div>
			<div class="space-y-4">
				{#each archive as a}
					<a
						href="/articles/{a.slug}"
						class="block rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/50 transition-all p-5"
					>
						<div class="flex items-start justify-between gap-3 flex-wrap">
							<h2 class="text-xl md:text-2xl font-bold text-white">
								{a.title}
							</h2>
							<span class="text-xs text-gray-500 flex-shrink-0">{a.date}</span>
						</div>
						<p class="mt-1 text-sm text-blue-300">מאת: {a.author}</p>
						<p class="mt-3 text-gray-300 leading-relaxed">{a.excerpt}</p>
					</a>
				{/each}
			</div>
		{/if}

		<div class="mt-10 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5 text-center">
			<p class="text-yellow-200">
				<strong>הערה:</strong> רק רבנים מורשים יכולים להוסיף מאמרים. כל מאמר טעון אישור שלושה רבנים לפחות
				לפני פרסום.
			</p>
		</div>
	{/if}
</section>
