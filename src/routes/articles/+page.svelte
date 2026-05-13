<script lang="ts">
	import { articles } from '$lib/data/articles';
</script>

<svelte:head>
	<title>מאמרי רבנים — חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-8">
		<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			מאמרי רבנים
		</h1>
		<p class="mt-3 text-gray-300">כל מאמר אושר על ידי שלושה רבנים לפחות</p>
		<p class="mt-1 text-sm text-gray-500">תגובות אינן אפשריות במסגרת זו</p>
	</header>

	<div class="space-y-4">
		{#each articles as a}
			<a
				href="/articles/{a.slug}"
				class="block rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/50 transition-all p-5 group"
			>
				<div class="flex items-start justify-between gap-3 flex-wrap">
					<h2 class="text-xl md:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
						{a.title}
					</h2>
					<span class="text-xs text-gray-500 flex-shrink-0">{a.date}</span>
				</div>
				<p class="mt-1 text-sm text-blue-300">מאת: {a.author}</p>
				<p class="mt-3 text-gray-300 leading-relaxed">{a.excerpt}</p>
				<div class="mt-4 flex items-center gap-2 flex-wrap">
					<span class="text-xs text-green-400">✓ אושר על ידי {a.approvedBy.length} רבנים</span>
					{#each a.approvedBy as r}
						<span class="text-xs px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-300">{r}</span>
					{/each}
				</div>
			</a>
		{/each}
	</div>

	<div class="mt-10 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5 text-center">
		<p class="text-yellow-200">
			<strong>הערה:</strong> רק רבנים מורשים יכולים להוסיף מאמרים. כל מאמר טעון אישור שלושה רבנים לפחות
			לפני פרסום.
		</p>
	</div>
</section>
