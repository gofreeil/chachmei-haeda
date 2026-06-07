<script lang="ts">
	import { rulings } from '$lib/data/hearings';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };
</script>

<svelte:head>
	<title>{tFn('rulings_page_head_title')}</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-8">
		<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			{tFn('rulings_page_h1_title')}
		</h1>
		<p class="mt-3 text-gray-300">{tFn('rulings_page_subtitle')}</p>
	</header>

	<div class="space-y-5">
		{#each rulings as r}
			<article class="rounded-2xl border border-white/10 bg-white/5 p-6">
				<div class="flex items-start justify-between gap-3 flex-wrap mb-3">
					<h2 class="text-xl md:text-2xl font-bold text-white">{r.caseName}</h2>
					<span class="text-sm text-gray-500">{r.date}</span>
				</div>
				<p class="text-sm text-blue-300 mb-4">{tFn('rulings_page_dayanim_panel')}: {r.dayanim.join(' • ')}</p>

				<div class="space-y-4">
					<div>
						<h3 class="font-bold text-yellow-300 mb-1">{tFn('rulings_page_summary_label')}</h3>
						<p class="text-gray-200 leading-relaxed">{r.summary}</p>
					</div>
					<div class="rounded-xl border border-green-500/30 bg-green-900/10 p-4">
						<h3 class="font-bold text-green-300 mb-1">{tFn('rulings_page_decision_label')}</h3>
						<p class="text-gray-100 leading-relaxed">{r.decision}</p>
					</div>
				</div>
			</article>
		{/each}
	</div>

	<div class="text-center mt-10 text-sm text-gray-500">
		{tFn('rulings_page_footer_note')}
	</div>
</section>
