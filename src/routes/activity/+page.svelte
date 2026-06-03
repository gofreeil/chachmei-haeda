<script lang="ts">
	import { onMount } from 'svelte';
	import { activity as staticActivity, type ActivityKind, type ActivityItem } from '$lib/data/activity';
	import FancyHeading from '$lib/components/FancyHeading.svelte';

	const ACTIVITY_KEY = 'chachmei-custom-activity';

	let filter = $state<'הכל' | ActivityKind>('הכל');
	let customActivity = $state<ActivityItem[]>([]);

	onMount(() => {
		try {
			const raw = localStorage.getItem(ACTIVITY_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) customActivity = parsed;
			}
		} catch {}
	});

	const allItems = $derived([...customActivity, ...staticActivity]);

	const filtered = $derived(
		filter === 'הכל' ? allItems : allItems.filter((a) => a.kind === filter)
	);

	const kindStyles: Record<ActivityKind, string> = {
		'סרטון': 'bg-red-500/15 border-red-400/40 text-red-200',
		'מאמר': 'bg-blue-500/15 border-blue-400/40 text-blue-200',
		'הודעה': 'bg-amber-500/15 border-amber-400/40 text-amber-200',
		'כתבה': 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
	};
	const kindIcons: Record<ActivityKind, string> = {
		'סרטון': '🎬',
		'מאמר': '📝',
		'הודעה': '📣',
		'כתבה': '📰'
	};
</script>

<svelte:head>
	<title>היכל המעשה - חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-8">
		<FancyHeading>
			<h1 class="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-3xl md:text-4xl font-black text-transparent whitespace-nowrap">
				היכל המעשה
			</h1>
		</FancyHeading>
		<p class="mt-3 text-gray-300 max-w-2xl mx-auto">
			סרטונים, מאמרים והודעות שחכמי בית הדין מפרסמים
		</p>
		<div class="mt-2 mx-auto h-0.5 w-48 md:w-64 bg-gradient-to-r from-transparent via-amber-700 to-transparent" aria-hidden="true"></div>
	</header>

	<div class="flex flex-wrap gap-2 justify-center mb-6">
		{#each ['הכל', 'סרטון', 'מאמר', 'הודעה', 'כתבה'] as f}
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
			{@const hasMedia = !!(a.videoUrl || a.imageUrl)}
			<article
				class="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4 md:p-5"
			>
				<!-- שורה עליונה: סוג ותאריך מימין, מחבר משמאל -->
				<div class="flex items-start justify-between gap-3 flex-wrap mb-3">
					<div class="flex items-center gap-2">
						<span
							class="text-[11px] font-bold px-2 py-0.5 rounded-full border {kindStyles[a.kind]}"
						>
							{kindIcons[a.kind]} {a.kind}
						</span>
						<span class="text-[11px] text-gray-500">{a.date}</span>
					</div>
					<span class="text-xs text-indigo-300">מאת: {a.author}</span>
				</div>

				<!-- כותרת ממורכזת -->
				<h2 class="text-base md:text-lg font-bold text-white text-center mb-6 md:mb-8">{a.title}</h2>

				<!-- תוכן: טקסט מימין, מדיה משמאל -->
				{#if hasMedia}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-start">
						<!-- ימין: טקסט -->
						<div class="space-y-3 md:order-1">
							<p class="text-sm text-gray-300 leading-relaxed">{a.excerpt}</p>
							{#if a.body}
								<p class="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{a.body}</p>
							{/if}
						</div>

						<!-- שמאל: מדיה -->
						<div class="space-y-3 md:order-2">
							{#if a.imageUrl}
								<div class="rounded-xl overflow-hidden border border-white/10 bg-black/30">
									<img src={a.imageUrl} alt={a.title} class="w-full h-auto max-h-[480px] object-contain mx-auto" />
								</div>
							{/if}
							{#if a.videoUrl}
								<div class="rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
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
						</div>
					</div>
				{:else}
					<!-- ללא מדיה: טקסט בלבד -->
					<p class="text-sm text-gray-300 leading-relaxed">{a.excerpt}</p>
					{#if a.body}
						<p class="mt-3 text-sm text-gray-200 leading-relaxed whitespace-pre-line">{a.body}</p>
					{/if}
				{/if}

				<!-- קישור למקור מתחת להכל -->
				{#if a.sourceUrl}
					<div class="mt-5 pt-4 border-t border-white/10 text-center">
						<a
							href={a.sourceUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-block text-xs text-indigo-300 hover:text-indigo-200 underline break-all"
						>
							🔗 לכתבה המלאה
						</a>
					</div>
				{/if}
			</article>
		{/each}
	</div>

	{#if filtered.length === 0}
		<p class="text-center text-gray-400 py-12">אין פריטים בקטגוריה זו</p>
	{/if}
</section>
