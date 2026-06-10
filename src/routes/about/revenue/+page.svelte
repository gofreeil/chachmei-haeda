<script lang="ts">
	import { onMount } from 'svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import { defaultRabbis, RABBIS_STORAGE_KEY, type Rabbi } from '$lib/data/rabbis';
	import HeichalotGrid from '$lib/components/HeichalotGrid.svelte';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	let rabbis = $state<Rabbi[]>(defaultRabbis);

	onMount(() => {
		try {
			const raw = localStorage.getItem(RABBIS_STORAGE_KEY);
			if (raw) {
				const saved = JSON.parse(raw);
				if (Array.isArray(saved) && saved.every((r) => typeof r?.name === 'string')) {
					rabbis = saved as Rabbi[];
				}
			}
		} catch {}
	});
</script>

<svelte:head>
	<title>{tFn('about_page_title')}</title>
	<meta name="description" content={tFn('about_meta_description')} />
</svelte:head>

<section class="py-10 md:py-14 px-4 max-w-3xl mx-auto" dir="rtl" style="text-align: justify; text-justify: inter-word;">
	<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl md:text-5xl font-black text-transparent text-center" style="text-align: center;">
		{tFn('about_heading')}
	</h1>

	<div class="mt-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10">
		<p class="text-xl md:text-2xl font-bold text-white leading-relaxed" style="text-align: center;">
			{tFn('about_mission_statement')}
		</p>

		<blockquote class="mt-6 py-2" style="text-align: center;">
			<p class="text-lg md:text-xl leading-loose font-semibold" style="font-family: 'Frank Ruhl Libre', 'David Libre', serif; text-align: center; color: #92400e;">
				{tFn('about_verse_devarim_15_8')}
			</p>
			<footer class="mt-2 text-sm text-gray-400" style="text-align: center;">{tFn('about_verse_devarim_15_8_source')}</footer>
		</blockquote>

		<p class="mt-8 text-base md:text-lg text-gray-200 leading-loose">
			{tFn('about_platform_description')}
		</p>
		<p class="mt-4 text-lg md:text-xl font-bold text-white" style="text-align: center;">
			{tFn('about_subject_to_torah')}
		</p>
	</div>

	<div class="mt-10">
		<HeichalotGrid />
	</div>

	<!-- הדיינים -->
	<div class="mt-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10">
		<h2 class="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-2xl md:text-3xl font-black text-transparent text-center mb-6">
			{tFn('about_dayanim_heading')}
		</h2>

		<ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none">
			{#each rabbis as r (r.id)}
				<li class="flex items-center gap-3 rounded-xl bg-white/5 border border-amber-400/20 p-3 transition-colors hover:bg-white/10">
					<div class="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gradient-to-br from-amber-200/20 to-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center flex-shrink-0">
						{#if r.photo}
							<img src={r.photo} alt={r.name} class="w-full h-full object-cover" loading="lazy" />
						{:else}
							<svg viewBox="0 0 64 64" class="w-full h-full text-amber-300/70" fill="currentColor" aria-hidden="true">
								<circle cx="32" cy="24" r="12" />
								<path d="M12 60c0-11 9-20 20-20s20 9 20 20v4H12v-4z" />
							</svg>
						{/if}
					</div>
					<div class="min-w-0 flex-1 text-right">
						<div class="text-sm md:text-base text-white font-semibold leading-tight">{r.name}</div>
						{#if r.title}
							<div class="text-xs md:text-sm text-amber-200 font-bold leading-tight mt-0.5">{r.title}</div>
						{/if}
						{#if r.nickname}
							<div class="text-xs text-amber-300 italic leading-tight mt-0.5">"{r.nickname}"</div>
						{/if}
						{#if r.city}
							<div class="text-xs text-gray-300 leading-tight mt-0.5">📍 {r.city}</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>

		<div class="mt-8 pt-6 border-t border-amber-400/30 text-right space-y-4">
			<p class="text-base md:text-lg text-gray-100 leading-loose">
				{tFn('about_dayanim_collective_intro')}
			</p>
			<blockquote class="py-2 text-center">
				<p class="text-lg md:text-xl leading-loose font-semibold" style="font-family: 'Frank Ruhl Libre', 'David Libre', serif; color: #92400e;">
					{tFn('about_verse_devarim_16_18')}
				</p>
				<footer class="mt-1 text-sm text-gray-400">{tFn('about_verse_devarim_16_18_source')}</footer>
			</blockquote>
			<p class="text-base md:text-lg text-gray-100 leading-loose font-semibold text-center">
				{tFn('about_purpose_peace')}
			</p>
			<p class="text-base md:text-lg text-gray-100 leading-loose pt-2">
				{tFn('about_chachmei_concept_prefix')}<strong class="text-orange-700">{tFn('about_chachmei_concept_emphasis')}</strong>{tFn('about_chachmei_concept_suffix')}
			</p>
		</div>
	</div>

	<!-- באנר קריאה להצטרפות -->
	<div class="mt-10 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-orange-500/15 backdrop-blur-sm shadow-xl p-6 md:p-10" style="text-align: center;">
		<h2 class="bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-xl md:text-2xl font-black text-transparent mb-4">
			🤝 {tFn('about_join_call_heading')}
		</h2>
		<p class="text-base md:text-lg text-gray-100 leading-relaxed font-semibold" style="text-align: center;">
			{tFn('about_join_body_prefix')}<span class="text-orange-700 font-black">{tFn('about_join_body_emphasis')}</span>{tFn('about_join_body_suffix')}
		</p>
		<div class="mt-6 flex justify-center">
			<a
				href="mailto:freedomhasbegun@gmail.com?subject=%D7%91%D7%A7%D7%A9%D7%94%20%D7%9C%D7%94%D7%A6%D7%98%D7%A8%D7%A3%20%D7%9C%D7%97%D7%9B%D7%9E%D7%99%20%D7%94%D7%A2%D7%93%D7%94&body=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%94%D7%A6%D7%98%D7%A8%D7%A3%20%D7%9C%D7%97%D7%9B%D7%9E%D7%99%20%D7%94%D7%A2%D7%93%D7%94.%0A%0A%D7%A9%D7%9D%20%D7%9E%D7%9C%D7%90%3A%20%0A%D7%AA%D7%A4%D7%A7%D7%99%D7%93%2F%D7%AA%D7%95%D7%90%D7%A8%3A%20%0A%D7%A4%D7%9C%D7%92%2F%D7%A7%D7%94%D7%99%D7%9C%D7%94%3A%20%0A%D7%A2%D7%99%D7%A8%3A%20%0A%D7%98%D7%9C%D7%A4%D7%95%D7%9F%3A%20%0A"
				class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 font-black text-base border-2 border-amber-700/40 shadow-md hover:scale-105 hover:shadow-[0_0_20px_rgba(234,88,12,0.5)] transition-all"
				style="color: #fff8e7; text-shadow: 0 1px 2px rgba(120, 53, 15, 0.6);"
			>
				<span>✉️</span>
				<span>{tFn('about_contact_email_btn')}</span>
			</a>
		</div>
	</div>

	<!-- כפתור חזרה למעלה (מובייל בלבד) -->
	<div class="md:hidden flex justify-center mt-10 mb-4">
		<button
			type="button"
			onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			aria-label={tFn('about_scroll_to_top_aria')}
			class="flex flex-col items-center gap-1 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400/50 text-blue-100 font-bold shadow-lg active:scale-95 transition-transform"
		>
			<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<polyline points="6 15 12 9 18 15" />
			</svg>
			<span class="text-xs">{tFn('about_scroll_to_top_label')}</span>
		</button>
	</div>
</section>
