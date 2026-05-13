<script lang="ts">
	let { data } = $props();
	const a = data.article;
</script>

<svelte:head>
	<title>{a.title} — חכמי העדה</title>
</svelte:head>

<article class="py-8 max-w-3xl mx-auto">
	<a href="/articles" class="text-blue-300 hover:text-blue-200 text-sm">← חזרה לרשימת המאמרים</a>

	<header class="mt-4 mb-8">
		<h1 class="text-3xl md:text-4xl font-black text-white leading-tight">{a.title}</h1>
		<div class="mt-3 text-sm text-gray-400">
			מאת: <span class="text-blue-300">{a.author}</span> • {a.date}
		</div>
	</header>

	<div class="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg whitespace-pre-line">
		{a.body}
	</div>

	<footer class="mt-10 border-t border-white/10 pt-6">
		<p class="text-sm text-green-400 mb-2">✓ מאמר זה אושר על ידי שלושה רבנים:</p>
		<div class="flex flex-wrap gap-2">
			{#each a.approvedBy as r}
				<span class="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
					{r}
				</span>
			{/each}
		</div>
		<p class="mt-6 text-xs text-gray-500 italic">
			על פי מדיניות חכמי העדה, לא ניתן להגיב למאמרים. ניתן לפנות לרב המחבר דרך טופס יצירת קשר.
		</p>
	</footer>
</article>
