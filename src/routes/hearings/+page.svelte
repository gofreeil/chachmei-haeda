<script lang="ts">
	import { hearings, pickLang } from '$lib/data/hearings';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};
	const upcoming = hearings.filter((h) => h.status === 'מתוכנן');
	const past = hearings.filter((h) => h.status !== 'מתוכנן');
</script>

<svelte:head>
	<title>{tFn('hearings_page_page_title')}</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-8">
		<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			{tFn('hearings_page_heading')}
		</h1>
		<p class="mt-3 text-gray-300">{tFn('hearings_page_subheading')}</p>
	</header>

	<h2 class="text-xl font-bold text-yellow-300 mb-4 mt-6">{tFn('hearings_page_upcoming_title')}</h2>
	<div class="space-y-3 mb-10">
		{#each upcoming as h}
			<div class="rounded-2xl border border-blue-500/30 bg-blue-900/10 p-5">
				<div class="flex items-start justify-between gap-3 flex-wrap">
					<div class="flex-1 min-w-0">
						<h3 class="text-lg font-bold text-white">{pickLang(h.caseName, _loc)}</h3>
						<p class="mt-1 text-sm text-gray-400">
							{tFn('hearings_page_panel_label')}: {h.dayanim.map((d) => pickLang(d, _loc)).join(' • ')}
						</p>
						<p class="mt-2 text-sm">
							<span class="text-yellow-300">📆 {h.date}</span>
							<span class="text-yellow-300 mr-3">🕐 {h.time}</span>
						</p>
					</div>
					<a
						href={h.zoomLink}
						target="_blank"
						rel="noopener noreferrer"
						class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:scale-105 transition-transform whitespace-nowrap"
					>
						{tFn('hearings_page_join_zoom')}
					</a>
				</div>
			</div>
		{/each}
	</div>

	<h2 class="text-xl font-bold text-gray-300 mb-4">{tFn('hearings_page_past_title')}</h2>
	<div class="space-y-3">
		{#each past as h}
			<div class="rounded-2xl border border-white/10 bg-white/5 p-5 opacity-80">
				<h3 class="text-lg font-bold text-white">{pickLang(h.caseName, _loc)}</h3>
				<p class="mt-1 text-sm text-gray-400">
					{tFn('hearings_page_panel_label')}: {h.dayanim.map((d) => pickLang(d, _loc)).join(' • ')}
				</p>
				<p class="mt-2 text-sm text-gray-500">{h.date} {h.time}</p>
				<a href="/rulings" class="inline-block mt-3 text-sm text-blue-300 hover:text-blue-200">
					{tFn('hearings_page_view_ruling')}
				</a>
			</div>
		{/each}
	</div>
</section>
