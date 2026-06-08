<script lang="ts">
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};
</script>

<svelte:head>
	<title>{tFn('shalom_lessons_page_title')}</title>
</svelte:head>

<section class="py-8 max-w-4xl mx-auto">
	<header class="text-center mb-8">
		<div class="text-5xl mb-3">🎓</div>
		<h1 class="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			{tFn('shalom_lessons_heading')}
		</h1>
		<p class="mt-3 text-gray-800 text-base md:text-lg font-bold max-w-2xl mx-auto">
			{tFn('shalom_lessons_subtitle')}
		</p>
	</header>

	<div class="rounded-2xl border-2 border-sky-300/40 bg-gradient-to-br from-sky-100/60 via-cyan-50/50 to-blue-100/60 p-8 md:p-12 text-center shadow-lg">
		<div class="text-6xl mb-4">📚</div>
		<h2 class="text-xl md:text-2xl font-black text-sky-900 mb-3">
			{tFn('shalom_lessons_coming_soon_title')}
		</h2>
		<p class="text-gray-800 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
			{tFn('shalom_lessons_coming_soon_body')}
		</p>
	</div>

	<div class="mt-8 text-center">
		<a
			href="/heichal-hamishpat?open=request-hearing"
			class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-black hover:scale-105 transition-transform shadow-lg"
		>
			🕊️ {tFn('shalom_lessons_cta_request_hearing')}
		</a>
	</div>
</section>
