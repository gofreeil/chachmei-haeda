<script lang="ts">
	import { activity, type ActivityKind } from '$lib/data/activity';

	let filter = $state<'הכל' | ActivityKind>('הכל');

	const filtered = $derived(
		filter === 'הכל' ? activity : activity.filter((a) => a.kind === filter)
	);

	const kindStyles: Record<ActivityKind, string> = {
		'סרטון': 'bg-red-500/15 border-red-400/40 text-red-200',
		'מאמר': 'bg-blue-500/15 border-blue-400/40 text-blue-200',
		'הודעה': 'bg-amber-500/15 border-amber-400/40 text-amber-200'
	};
	const kindIcons: Record<ActivityKind, string> = {
		'סרטון': '🎬',
		'מאמר': '📝',
		'הודעה': '📣'
	};
</script>

<svelte:head>
	<title>הפעילות שלנו - חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-8">
		<h1 class="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			הפעילות שלנו
		</h1>
		<p class="mt-3 text-gray-300 max-w-2xl mx-auto">
			סרטונים, מאמרים והודעות שחכמי בית הדין מפרסמים - מתעדכן באופן שוטף
		</p>
	</header>

	<div class="flex flex-wrap gap-2 justify-center mb-6">
		{#each ['הכל', 'סרטון', 'מאמר', 'הודעה'] as f}
			<button
				type="button"
				onclick={() => (filter = f as typeof filter)}
				class="px-4 py-1.5 rounded-full text-sm font-bold border transition-colors {filter === f
					? 'bg-indigo-500/40 border-indigo-300 text-white'
					: 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'}"
			>
				{f}
			</button>
		{/each}
	</div>

	<div class="space-y-4">
		{#each filtered as a (a.slug)}
			<article
				class="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-5 md:p-6"
			>
				<div class="flex items-start justify-between gap-3 flex-wrap mb-2">
					<div class="flex items-center gap-2">
						<span
							class="text-xs font-bold px-2.5 py-1 rounded-full border {kindStyles[a.kind]}"
						>
							{kindIcons[a.kind]} {a.kind}
						</span>
						<span class="text-xs text-gray-500">{a.date}</span>
					</div>
					<span class="text-sm text-indigo-300">מאת: {a.author}</span>
				</div>
				<h2 class="text-xl md:text-2xl font-bold text-white">{a.title}</h2>
				<p class="mt-2 text-gray-300 leading-relaxed">{a.excerpt}</p>

				{#if a.videoUrl}
					<div class="mt-4 rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
						<iframe
							src={a.videoUrl}
							title={a.title}
							class="w-full h-full"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
						></iframe>
					</div>
				{/if}

				{#if a.body}
					<p class="mt-4 text-gray-200 leading-relaxed whitespace-pre-line">{a.body}</p>
				{/if}
			</article>
		{/each}
	</div>

	{#if filtered.length === 0}
		<p class="text-center text-gray-400 py-12">אין פריטים בקטגוריה זו</p>
	{/if}
</section>
