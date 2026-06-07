<script lang="ts">
	import HeichalHeader from '$lib/components/HeichalHeader.svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k); };

	const mitzvotKeys = [
		{ n: 'eth_code_mitzvah_1_n', title: 'eth_code_mitzvah_1_title', body: 'eth_code_mitzvah_1_body', img: '/images/051bb5c2afa0f882cb69274d1d2762f43c07ec83a3762e6a52c0fe31 (1).jpg' },
		{ n: 'eth_code_mitzvah_2_n', title: 'eth_code_mitzvah_2_title', body: 'eth_code_mitzvah_2_body', img: '/images/copyof_e9e782464b20dd1a78dc695f7f96d22bce0eaa7c3bd658140125d327.jpg' },
		{ n: 'eth_code_mitzvah_3_n', title: 'eth_code_mitzvah_3_title', body: 'eth_code_mitzvah_3_body', img: '/images/66d586997b1916c727e39b860ac1aaf1adcd7e09858c1f9652d8474e (1).jpg' },
		{ n: 'eth_code_mitzvah_4_n', title: 'eth_code_mitzvah_4_title', body: 'eth_code_mitzvah_4_body', img: '/images/06906e45572ea20efba61c33ca2e0ee71d5f04fcb36dd24907a8f3e5 (1).jpg' },
		{ n: 'eth_code_mitzvah_5_n', title: 'eth_code_mitzvah_5_title', body: 'eth_code_mitzvah_5_body', img: '/images/598111f9fb5ce654ab97a14f7895e164e7bcce3dfca356213208dccd (1).jpg' },
		{ n: 'eth_code_mitzvah_6_n', title: 'eth_code_mitzvah_6_title', body: 'eth_code_mitzvah_6_body', img: '/images/425738cfb4e7e3542b6ae9a64e4f5ed4060d807af4cd440dad202f87 (1).jpg' },
		{ n: 'eth_code_mitzvah_7_n', title: 'eth_code_mitzvah_7_title', body: 'eth_code_mitzvah_7_body', img: '/images/7262c95d28eb13b988331fd0f3903273eee17bec96ad1b22378e0bb3 (1).jpg' }
	];
</script>

<svelte:head>
	<title>{tFn('eth_code_page_title')}</title>
</svelte:head>

<article class="prose-rtl max-w-none py-8 px-2 md:px-4">
	<HeichalHeader subtitle={tFn('eth_code_header_subtitle')} />

	<section class="space-y-3 text-gray-200 leading-snug text-xs md:text-sm">
		<p>
			<strong class="text-blue-300">UECC</strong> – {tFn('eth_code_intro_p1')}
		</p>

		<p>
			{tFn('eth_code_intro_p2')}
		</p>

		<blockquote class="border-r-4 border-blue-400 pr-4 italic text-gray-300">
			{tFn('eth_code_quote_avraham')}
		</blockquote>

		<p>{tFn('eth_code_talmud_zohar')}</p>

		<h2 class="text-base md:text-lg font-bold text-yellow-300 mt-6">{tFn('eth_code_h2_central')}</h2>

		<blockquote class="border-r-4 border-yellow-400 pr-4 italic text-gray-300">
			{tFn('eth_code_quote_devarim')}
		</blockquote>

		<p>
			<strong class="text-yellow-300">"{tFn('eth_code_hayashar_word')}"</strong> {tFn('eth_code_hayashar_body')}
		</p>

		<p>
			<strong class="text-yellow-300">"{tFn('eth_code_hatov_word')}"</strong> {tFn('eth_code_hatov_body')}
		</p>

		<h2 class="text-base md:text-lg font-bold text-yellow-300 mt-6">{tFn('eth_code_h2_practical')}</h2>

		<p>
			{tFn('eth_code_practical_p1')}
		</p>

		<p>
			{tFn('eth_code_practical_p2')}
		</p>

		<h3 class="text-sm md:text-base font-bold text-blue-300 mt-6">{tFn('eth_code_h3_who_accepts')}</h3>
		<ul class="list-disc pr-6 space-y-2">
			<li>{tFn('eth_code_accepts_li_1')}</li>
			<li>{tFn('eth_code_accepts_li_2')}</li>
			<li>{tFn('eth_code_accepts_li_3')}</li>
			<li>{tFn('eth_code_accepts_li_4')}</li>
		</ul>

		<p class="border-t border-white/10 pt-5 mt-8">
			{tFn('eth_code_derech_eretz_p1')} <strong class="text-blue-300">UECC</strong> {tFn('eth_code_derech_eretz_p2')}
		</p>

		<p>
			{tFn('eth_code_business_yirah')}
		</p>

		<h2 class="text-base md:text-lg font-bold text-yellow-300 mt-8">{tFn('eth_code_h2_seven_mitzvot')}</h2>

		<p>
			{tFn('eth_code_seven_mitzvot_intro')}
		</p>

		<div class="rounded-xl border border-white/10 bg-white/5 p-3 md:p-4 my-4">
			<p class="text-xs text-gray-400 mb-1.5">{tFn('eth_code_gemara_citation')}</p>
			<p class="italic text-gray-200 text-xs md:text-sm leading-snug">
				{tFn('eth_code_gemara_text')}
			</p>
		</div>

		<div class="space-y-4 mt-6">
			{#each mitzvotKeys as m}
				<div class="rounded-xl border border-blue-500/20 bg-blue-900/10 p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3">
					<div class="flex-1 min-w-0">
						<h4 class="text-sm md:text-base font-bold text-blue-300">
							<span class="text-base text-yellow-400 ml-2">{tFn(m.n)}.</span>{tFn(m.title)}
						</h4>
						<p class="mt-1.5 text-gray-300 leading-snug text-xs md:text-sm">{tFn(m.body)}</p>
					</div>
					<img src={m.img} alt={tFn(m.title)} loading="lazy" class="w-full md:w-44 lg:w-52 h-auto max-h-36 object-contain rounded-lg flex-shrink-0" />
				</div>
			{/each}
		</div>

		<div class="rounded-xl border border-red-500/30 bg-red-900/10 p-3 md:p-4 mt-6">
			<h4 class="text-sm md:text-base font-bold text-red-300">{tFn('eth_code_yehareg_title')}</h4>
			<p class="mt-1 text-gray-300 text-xs md:text-sm">{tFn('eth_code_yehareg_body')}</p>
		</div>

		<p class="text-center text-sm md:text-base text-yellow-200 mt-6 font-bold">
			{tFn('eth_code_geulah_closing')}
		</p>
	</section>

	<footer class="mt-8 border-t border-white/10 pt-4 text-center">
		<p class="text-gray-400 text-xs md:text-sm">
			{tFn('eth_code_sources_footer')}
		</p>
	</footer>
</article>

<style>
	.prose-rtl :global(p:not(.text-center)) {
		text-align: justify;
	}
</style>
