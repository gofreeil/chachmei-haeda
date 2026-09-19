<script lang="ts">
	// ============================================================
	// /about — דף "אודותינו": פסקת פתיחה + אגף שאלות ותשובות.
	// המטרה: שמנועי חיפוש ומנועי AI יזהו בקלות מה האתר, למי ומה עושים בו.
	// התצוגה וסכמת FAQPage (JSON-LD) נבנות מאותו מקור אמת — $lib/aboutFaq —
	// כך שהזחלן רואה בדיוק את הטקסט שהגולש רואה.
	// הרבנים, החזון ומודל ההתנהלות נשארים בדף /about/revenue (מקושר מכאן).
	// ============================================================
	import Seo from '$lib/components/Seo.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import HeichalotGrid from '$lib/components/HeichalotGrid.svelte';
	import { SITE_NAME, PARENT_SITE, faqSchema, breadcrumbSchema } from '$lib/seo';
	import { aboutContentFor } from '$lib/aboutFaq';
	import { locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));

	const content = $derived(aboutContentFor(_loc));
	const dir = $derived(_loc && !['he', 'ps'].includes(_loc.slice(0, 2)) ? 'ltr' : 'rtl');

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
	keywords="אודות חכמי העדה, בתי הפיוס, בית דין לבוררות, שאלות ותשובות, יוצאים לחירות"
/>
<JsonLd data={schemas} />

<section class="py-10 md:py-14 px-4 max-w-3xl mx-auto" {dir}>
	<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl md:text-5xl font-black text-transparent text-center">
		{content.title}
	</h1>

	<div class="mt-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10">
		<p class="text-base md:text-lg text-gray-200 leading-loose">
			{content.intro}
		</p>
		{#if !_loc || _loc.startsWith('he')}
			<!-- שיוך גלוי לתנועה-האם עם קישור אמיתי (הפסקה למעלה מתורגמת ולכן טקסט בלבד) -->
			<p class="mt-4 text-base md:text-lg text-gray-200 leading-loose">
				חכמי העדה הוא מיזם של התנועה החברתית
				<a href={PARENT_SITE.url} target="_blank" rel="noopener" class="text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4 transition-colors">{PARENT_SITE.name}</a>
				ומופעל בהתנדבות.
			</p>
		{/if}
		<p class="mt-4 text-center">
			<a href="/about/revenue" class="text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4 transition-colors">
				{content.moreLink} ←
			</a>
		</p>
	</div>

	<div class="mt-8">
		<HeichalotGrid />
	</div>

	<!-- שאלות ותשובות — אותו מקור אמת כמו ה-JSON-LD למעלה -->
	<section id="faq" aria-labelledby="faq-title" class="mt-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10">
		<h2 id="faq-title" class="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-2xl md:text-3xl font-black text-transparent text-center mb-6">
			{content.faqTitle}
		</h2>

		<div class="flex flex-col gap-3">
			{#each content.faq as item, i (item.q)}
				<details
					class="group rounded-xl bg-white/5 border border-amber-400/20 open:border-amber-400/50 transition-colors"
					open={i < 2}
				>
					<summary class="cursor-pointer list-none flex items-start gap-3 p-4 text-base md:text-lg font-bold text-white hover:bg-white/5 rounded-xl">
						<span class="flex-shrink-0 text-amber-400 transition-transform group-open:rotate-90" aria-hidden="true">▸</span>
						<span>{item.q}</span>
					</summary>
					<p class="px-4 pb-4 ps-10 text-sm md:text-base text-gray-200 leading-loose">
						{item.a}
					</p>
				</details>
			{/each}
		</div>
	</section>
</section>

<style>
	/* מסתיר את משולש ברירת המחדל של הדפדפן — יש לנו חץ משלנו */
	summary::-webkit-details-marker {
		display: none;
	}
</style>
