<script lang="ts">
	// ============================================================
	// /about — דף "אודותינו" היחיד: פסקת פתיחה, משפט המטרה, הסנהדרין, הדיינים,
	// קריאה להצטרפות ואגף שאלות ותשובות. (/about/revenue הופנה לכאן.)
	// המטרה: שמנועי חיפוש ומנועי AI יזהו בקלות מה האתר, למי ומה עושים בו.
	// התצוגה וסכמת FAQPage (JSON-LD) נבנות מאותו מקור אמת — $lib/aboutFaq —
	// כך שהזחלן רואה בדיוק את הטקסט שהגולש רואה.
	// ============================================================
	import Seo from '$lib/components/Seo.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import HeichalotGrid from '$lib/components/HeichalotGrid.svelte';
	import SanhedrinAbout from '$lib/components/SanhedrinAbout.svelte';
	import { SITE_NAME, faqSchema, breadcrumbSchema } from '$lib/seo';
	import { aboutContentFor } from '$lib/aboutFaq';
	import { defaultRabbis, RABBIS_STORAGE_KEY, type Rabbi } from '$lib/data/rabbis';
	import { loadRabbis } from '$lib/services/rabbis-service';
	import { onMount } from 'svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	// כתובת אתר הרשת מופיעה בתשובות כטקסט רגיל (כך נשאר תקין גם ב-JSON-LD) — בתצוגה הופכים אותה לקישור
	const NETWORK_DOMAIN = 'gofreeil.com';

	const content = $derived(aboutContentFor(_loc));
	const dir = $derived(_loc && !['he', 'ps'].includes(_loc.slice(0, 2)) ? 'ltr' : 'rtl');

	let rabbis = $state<Rabbi[]>(defaultRabbis);
	// מוצג גדול ובמרכז רק דיין שהוגדר לו תפקיד (למשל "ראש ואב בית הדין"); בלי תפקיד — אף אחד לא מובלט
	const headRabbi = $derived(rabbis.find((r) => r.title));
	const otherRabbis = $derived(rabbis.filter((r) => r !== headRabbi));

	onMount(async () => {
		// גיבוי מיידי מ-localStorage כדי שלא יהבהב, ואז מקור-האמת מהבאקאנד
		try {
			const raw = localStorage.getItem(RABBIS_STORAGE_KEY);
			if (raw) {
				const saved = JSON.parse(raw);
				if (Array.isArray(saved) && saved.every((r) => typeof r?.name === 'string')) {
					rabbis = saved as Rabbi[];
				}
			}
		} catch {}
		try {
			const backend = await loadRabbis();
			if (backend.length) rabbis = backend;
		} catch {}
	});

	const schemas = $derived([
		breadcrumbSchema([
			{ name: SITE_NAME, path: '/' },
			{ name: content.title, path: '/about' },
		]),
		faqSchema(content.faq),
	]);
</script>

<Seo
	title="{content.title} | {SITE_NAME}"
	description={content.intro}
	path="/about"
	keywords="אודות חכמי העדה, בתי הפיוס, בית דין לבוררות, סנהדרין, הרבנים, דיינים מתנדבים, חזון בתי הפיוס, שאלות ותשובות, יוצאים לחירות"
/>
<JsonLd data={schemas} />

<section class="py-10 md:py-14 px-4 max-w-3xl mx-auto" {dir}>
	<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl md:text-5xl font-black text-transparent text-center">
		{content.title}
	</h1>

	<div class="mt-8 px-1">
		<p class="text-base md:text-lg text-gray-200 leading-[1.35]">
			{content.intro}
		</p>
		<!-- משפט המטרה (הועבר מ-/about/revenue) — באותו כרטיס עם הפתיחה, בלי הפרדה -->
		<p class="mt-1 text-base md:text-lg font-bold text-white leading-[1.35] text-center">
			{tFn('about_mission_statement')}
		</p>

		<blockquote class="mt-1 py-0 text-center">
			<p class="text-base md:text-lg leading-[1.35] font-semibold" style="font-family: 'Frank Ruhl Libre', 'David Libre', serif; color: #92400e;">
				{tFn('about_verse_devarim_15_8')}
			</p>
			<footer class="mt-0 leading-tight text-base md:text-lg text-gray-400">{tFn('about_verse_devarim_15_8_source')}</footer>
		</blockquote>

		<p class="mt-1 text-base md:text-lg text-gray-200 leading-[1.35]">
			{tFn('about_platform_description')}
		</p>
	</div>
	<p class="mt-1 text-base md:text-lg font-bold text-white text-center">
		{tFn('about_subject_to_torah')}
	</p>

	<div class="mt-8">
		<HeichalotGrid />
	</div>

	<!-- הדיינים (הועבר מ-/about/revenue) -->
	<div class="mt-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10">
		<h2 class="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-2xl md:text-3xl font-black text-transparent text-center mb-6">
			{tFn('about_dayanim_heading')}
		</h2>

		{#if headRabbi}
			<div class="flex flex-col items-center text-center mb-5">
				<div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-amber-200/20 to-amber-500/20 border-4 border-amber-400 ring-4 ring-amber-300/40 shadow-[0_0_28px_rgba(251,191,36,0.55)] flex items-center justify-center">
					{#if headRabbi.photo}
						<img src={headRabbi.photo} alt="תמונתו של {headRabbi.name}" width="128" height="128" class="w-full h-full object-cover" decoding="async" />
					{:else}
						<svg viewBox="0 0 64 64" class="w-full h-full text-amber-300/70" fill="currentColor" aria-hidden="true">
							<circle cx="32" cy="24" r="12" />
							<path d="M12 60c0-11 9-20 20-20s20 9 20 20v4H12v-4z" />
						</svg>
					{/if}
				</div>
				<div class="mt-2 text-lg md:text-xl text-white font-black leading-tight">{headRabbi.name}</div>
				{#if headRabbi.title}
					<div class="text-sm md:text-base text-amber-200 font-bold leading-tight">{headRabbi.title}</div>
				{/if}
			</div>
		{/if}

		<ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none">
			{#each otherRabbis as r (r.id)}
				<li class="flex items-center gap-3 rounded-xl bg-white/5 border border-amber-400/20 p-3 transition-colors hover:bg-white/10 sm:last:odd:col-span-2 sm:last:odd:justify-self-center sm:last:odd:w-[calc(50%-0.375rem)]">
					<div class="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gradient-to-br from-amber-200/20 to-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center flex-shrink-0">
						{#if r.photo}
							<img src={r.photo} alt="תמונתו של {r.name}" width="80" height="80" class="w-full h-full object-cover" loading="lazy" decoding="async" />
						{:else}
							<svg viewBox="0 0 64 64" class="w-full h-full text-amber-300/70" fill="currentColor" aria-hidden="true">
								<circle cx="32" cy="24" r="12" />
								<path d="M12 60c0-11 9-20 20-20s20 9 20 20v4H12v-4z" />
							</svg>
						{/if}
					</div>
					<div class="min-w-0 flex-1 text-start">
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

		<div class="mt-8 pt-6 border-t border-amber-400/30 text-start space-y-4">
			<p class="text-base md:text-lg text-gray-100 leading-snug">
				{tFn('about_dayanim_collective_intro')}
			</p>
			<blockquote class="py-2 text-center">
				<p class="text-base md:text-lg leading-snug font-semibold" style="font-family: 'Frank Ruhl Libre', 'David Libre', serif; color: #92400e;">
					{tFn('about_verse_devarim_16_18')}
				</p>
				<footer class="mt-1 text-sm text-gray-400">{tFn('about_verse_devarim_16_18_source')}</footer>
			</blockquote>
			<p class="text-base md:text-lg text-gray-100 leading-snug font-semibold text-center">
				{tFn('about_purpose_peace')}
			</p>
			<p class="text-base md:text-lg text-gray-100 leading-snug pt-2">
				{tFn('about_chachmei_concept_prefix')}<strong class="text-orange-700">{tFn('about_chachmei_concept_emphasis')}</strong>{tFn('about_chachmei_concept_suffix')}
			</p>
		</div>
	</div>

	<!-- הסנהדרין — רקע, ועדת פיוס, מה נדרש מכל יהודי והערות -->
	<div class="mt-8"><SanhedrinAbout /></div>

	<!-- שאלות ותשובות — אותו מקור אמת כמו ה-JSON-LD למעלה -->
	<section id="faq" aria-labelledby="faq-title" class="mt-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10">
		<h2 id="faq-title" class="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-2xl md:text-3xl font-black text-transparent text-center mb-6">
			{content.faqTitle}
		</h2>

		<div class="flex flex-col gap-3">
			{#each content.faq as item (item.q)}
				<details
					class="group rounded-xl bg-white/5 border border-amber-400/20 open:border-amber-400/50 transition-colors"
				>
					<summary class="cursor-pointer list-none flex items-start gap-3 p-4 text-base md:text-lg font-bold text-white hover:bg-white/5 rounded-xl">
						<span class="flex-shrink-0 text-amber-400 transition-transform group-open:rotate-90" aria-hidden="true">▸</span>
						<span>{item.q}</span>
					</summary>
					<p class="px-4 pb-4 ps-10 text-sm md:text-base text-gray-200 leading-snug">{#each item.a.split(NETWORK_DOMAIN) as part, i}{#if i > 0}<a href="https://{NETWORK_DOMAIN}/" target="_blank" rel="noopener noreferrer" dir="ltr" class="font-bold text-amber-800 underline hover:text-amber-600 transition-colors">{NETWORK_DOMAIN}</a>{/if}{part}{/each}</p>
				</details>
			{/each}
		</div>
	</section>

	<!-- באנר קריאה להצטרפות (הועבר מ-/about/revenue) -->
	<div class="mt-8 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-orange-500/15 backdrop-blur-sm shadow-xl p-6 md:p-10 text-center">
		<h2 class="bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-xl md:text-2xl font-black text-transparent mb-4">
			🤝 {tFn('about_join_call_heading')}
		</h2>
		<p class="text-base md:text-lg text-gray-100 leading-relaxed font-semibold">
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
</section>

<style>
	/* מסתיר את משולש ברירת המחדל של הדפדפן — יש לנו חץ משלנו */
	summary::-webkit-details-marker {
		display: none;
	}
</style>
