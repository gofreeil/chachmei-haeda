<script lang="ts">
	import HeichalHeader from '$lib/components/HeichalHeader.svelte';
	import FancyHeading from '$lib/components/FancyHeading.svelte';
	import { addSignatory } from '$lib/services/charter-service';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import { fade, scale } from 'svelte/transition';
	import { goto, afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	const mitzvotKeys = [
		{ n: 'eth_code_mitzvah_1_n', title: 'eth_code_mitzvah_1_title', body: 'eth_code_mitzvah_1_body', img: '/images/051bb5c2afa0f882cb69274d1d2762f43c07ec83a3762e6a52c0fe31 (1).jpg' },
		{ n: 'eth_code_mitzvah_2_n', title: 'eth_code_mitzvah_2_title', body: 'eth_code_mitzvah_2_body', img: '/images/copyof_e9e782464b20dd1a78dc695f7f96d22bce0eaa7c3bd658140125d327.jpg' },
		{ n: 'eth_code_mitzvah_3_n', title: 'eth_code_mitzvah_3_title', body: 'eth_code_mitzvah_3_body', img: '/images/66d586997b1916c727e39b860ac1aaf1adcd7e09858c1f9652d8474e (1).jpg' },
		{ n: 'eth_code_mitzvah_4_n', title: 'eth_code_mitzvah_4_title', body: 'eth_code_mitzvah_4_body', img: '/images/06906e45572ea20efba61c33ca2e0ee71d5f04fcb36dd24907a8f3e5 (1).jpg' },
		{ n: 'eth_code_mitzvah_5_n', title: 'eth_code_mitzvah_5_title', body: 'eth_code_mitzvah_5_body', img: '/images/598111f9fb5ce654ab97a14f7895e164e7bcce3dfca356213208dccd (1).jpg' },
		{ n: 'eth_code_mitzvah_6_n', title: 'eth_code_mitzvah_6_title', body: 'eth_code_mitzvah_6_body', img: '/images/425738cfb4e7e3542b6ae9a64e4f5ed4060d807af4cd440dad202f87 (1).jpg' },
		{ n: 'eth_code_mitzvah_7_n', title: 'eth_code_mitzvah_7_title', body: 'eth_code_mitzvah_7_body', img: '/images/7262c95d28eb13b988331fd0f3903273eee17bec96ad1b22378e0bb3 (1).jpg' }
	];

	let name = $state('');
	let role = $state('');
	let city = $state('');
	let email = $state('');
	let phone = $state('');
	let birthDate = $state('');
	let idNumber = $state('');
	let accepted = $state(false);
	let notice = $state('');
	let showCelebration = $state(false);
	let submitting = $state(false);

	function sendCharterEmail(toEmail: string) {
		if (!toEmail.trim()) return;
		const subject = tFn('charter_email_subject');
		const body = tFn('charter_email_intro') + '\n' + tFn('charter_text_full');
		const href = `mailto:${encodeURIComponent(toEmail.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		window.open(href, '_blank');
	}

	function onConsentChange() {
		if (!accepted || submitting) return;
		notice = '';
		if (!name.trim()) {
			notice = '⚠️ ' + tFn('charter_join_validation_name_required');
			accepted = false;
			return;
		}
		submitting = true;
		addSignatory({
			name,
			role,
			city,
			email,
			phone,
			birthDate,
			idNumber,
			acceptedTerms: true
		});
		sendCharterEmail(email);
		setTimeout(() => { showCelebration = true; }, 700);
		setTimeout(() => { goto('/charter-index'); }, 4200);
	}

	afterNavigate(async () => {
		if (window.location.hash !== '#join') return;
		await tick();
		const scrollToJoin = () => {
			const el = document.getElementById('join');
			if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		};
		scrollToJoin();
		setTimeout(scrollToJoin, 300);
		setTimeout(scrollToJoin, 900);
	});
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

		<div class="mt-8 mb-5 mx-auto h-0.5 w-48 md:w-64 bg-gradient-to-r from-transparent via-amber-700/60 to-transparent" aria-hidden="true"></div>

		<p>
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

	<section id="join" class="mt-10 scroll-mt-20">
		<header class="text-center mb-6">
			<FancyHeading>
				<h2 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent inline-block pb-1">
					{tFn('charter_join_heading')}
				</h2>
			</FancyHeading>
			<p class="mt-3 text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
				{tFn('charter_join_intro')}
			</p>
		</header>

		<div class="rounded-t-2xl border-2 border-b-0 border-amber-700/40 bg-amber-50/70 p-5 md:p-7 shadow-sm">
			<h3 class="text-lg md:text-xl font-bold text-amber-900 mb-4 text-center">{tFn('charter_text_title')}</h3>
			<div class="text-sm md:text-base text-gray-900 leading-relaxed text-right whitespace-pre-line" dir="rtl">{tFn('charter_text_full')}</div>
		</div>

		<form onsubmit={(e) => e.preventDefault()} class="rounded-b-2xl border-2 border-amber-700/40 bg-amber-50/40 p-4 md:p-5 mb-6 space-y-3 shadow-sm">
			<h3 class="text-xl font-black text-blue-200 mb-3">{tFn('charter_join_form_title')}</h3>

			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
				<div>
					<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-name">{tFn('charter_join_label_name')}</label>
					<input
						id="join-name"
						type="text"
						bind:value={name}
						required
						placeholder={tFn('charter_join_placeholder_name')}
						class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
					/>
				</div>
				<div>
					<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-role">{tFn('charter_join_label_role')}</label>
					<input
						id="join-role"
						type="text"
						bind:value={role}
						placeholder={tFn('charter_join_placeholder_role')}
						class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
					/>
				</div>
				<div>
					<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-city">{tFn('charter_join_label_city')}</label>
					<input
						id="join-city"
						type="text"
						bind:value={city}
						placeholder={tFn('charter_join_placeholder_city')}
						class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
					/>
				</div>
				<div>
					<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-phone">{tFn('charter_join_label_phone')}</label>
					<input
						id="join-phone"
						type="tel"
						bind:value={phone}
						dir="ltr"
						placeholder="050-0000000"
						class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none text-right"
					/>
				</div>
				<div>
					<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-birth-date">{tFn('charter_join_label_birth_date')}</label>
					<input
						id="join-birth-date"
						type="date"
						bind:value={birthDate}
						dir="ltr"
						class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none text-right"
					/>
				</div>
				<div>
					<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-id-number">{tFn('charter_join_label_id_number')}</label>
					<input
						id="join-id-number"
						type="text"
						inputmode="numeric"
						maxlength="9"
						bind:value={idNumber}
						dir="ltr"
						placeholder={tFn('charter_join_placeholder_id_number')}
						class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none text-right"
					/>
				</div>
				<div class="sm:col-span-2 md:col-span-3">
					<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-email">{tFn('charter_join_label_email')}</label>
					<input
						id="join-email"
						type="email"
						bind:value={email}
						dir="ltr"
						placeholder="name@example.com"
						class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none text-right"
					/>
				</div>
			</div>

			{#if !showCelebration}
				<label
					class="flex items-start gap-3 rounded-xl border-2 border-amber-700/50 bg-amber-100/60 p-4 cursor-pointer hover:bg-amber-100 transition-colors {submitting ? 'pointer-events-none opacity-95' : ''}"
					transition:fade={{ duration: 400 }}
				>
					<input
						type="checkbox"
						bind:checked={accepted}
						onchange={onConsentChange}
						disabled={submitting}
						class="mt-1 w-5 h-5 accent-amber-700 flex-shrink-0"
					/>
					<span class="text-sm md:text-base text-gray-900">
						<strong class="text-amber-900">{tFn('charter_join_consent_strong')}</strong> {tFn('charter_join_consent_body')}
					</span>
				</label>
			{:else}
				<div
					class="rounded-xl border-2 border-green-700/50 bg-green-100/70 p-6 text-center"
					transition:scale={{ duration: 450, start: 0.9 }}
				>
					<div class="text-5xl mb-2">✅</div>
					<h3 class="text-lg md:text-xl font-black text-green-900 mb-2">
						{tFn('charter_join_celebration_title')}
					</h3>
					<p class="text-sm md:text-base text-gray-900 mb-3">
						{tFn('charter_join_celebration_subtitle')}
					</p>
					<p class="text-xs md:text-sm text-green-800 font-bold">
						{tFn('charter_join_celebration_redirect')}
					</p>
				</div>
			{/if}

			{#if notice && !showCelebration}
				<p class="text-sm font-bold text-yellow-700">
					{notice}
				</p>
			{/if}
		</form>
	</section>
</article>

<style>
	.prose-rtl :global(p:not(.text-center)) {
		text-align: justify;
	}
</style>
