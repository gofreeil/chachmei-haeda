<script lang="ts">
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};

	const sections = [
		{ href: '/heichal-hamishpat?open=request-hearing', icon: '📂', titleKey: 'header_nav_shalom_open_case', descKey: 'shalom_idx_open_case_desc' },
		{ href: '/heichal-hashalom/lessons', icon: '🎓', titleKey: 'header_nav_shalom_lessons', descKey: 'shalom_idx_lessons_desc' },
		{ href: '/heichal-hashalom/recommendations', icon: '⭐', titleKey: 'header_nav_shalom_recommendations', descKey: 'shalom_idx_recommendations_desc' }
	];
</script>

<svelte:head>
	<title>{tFn('shalom_idx_page_title')}</title>
</svelte:head>

<section class="py-8 max-w-5xl mx-auto">
	<header class="text-center mb-10">
		<div class="text-6xl mb-3">🕊️</div>
		<h1 class="bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 bg-clip-text text-3xl md:text-5xl font-black text-transparent">
			{tFn('shalom_idx_heading')}
		</h1>
		<p class="mt-4 text-gray-800 text-base md:text-lg font-bold max-w-2xl mx-auto leading-relaxed">
			{tFn('shalom_idx_subtitle')}
		</p>
	</header>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
		{#each sections as s}
			<a
				href={s.href}
				class="block rounded-2xl border-2 border-sky-300/50 bg-gradient-to-br from-sky-100/70 via-cyan-50/60 to-blue-100/70 backdrop-blur-md p-6 md:p-8 text-center shadow-[0_8px_24px_-4px_rgba(56,189,248,0.35)] hover:shadow-[0_12px_36px_-4px_rgba(56,189,248,0.55)] hover:scale-[1.04] hover:border-sky-400 transition-all"
			>
				<div class="text-5xl mb-3 drop-shadow-lg">{s.icon}</div>
				<h3 class="text-lg md:text-xl font-black text-sky-900 mb-2">{tFn(s.titleKey)}</h3>
				<p class="text-sm text-sky-950/80 leading-snug">{tFn(s.descKey)}</p>
			</a>
		{/each}
	</div>
</section>
