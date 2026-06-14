<script lang="ts">
	import { addSignatory } from '$lib/services/charter-service';
	import HeichalNav from '$lib/components/HeichalNav.svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import { fade, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

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
</script>

<svelte:head>
	<title>{tFn('charter_join_page_title')}</title>
</svelte:head>

<section class="py-8 max-w-3xl mx-auto px-3">
	<header class="text-center mb-6">
		<div class="text-5xl mb-3">✍️</div>
		<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			{tFn('charter_join_heading')}
		</h1>
		<p class="mt-3 text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
			{tFn('charter_join_intro')}
		</p>
	</header>

	<HeichalNav />

	<!-- מלל האמנה -->
	<div class="rounded-t-2xl border-2 border-b-0 border-amber-700/40 bg-amber-50/70 p-5 md:p-7 shadow-sm">
		<h3 class="text-lg md:text-xl font-bold text-amber-900 mb-4 text-center">{tFn('charter_text_title')}</h3>
		<div class="text-sm md:text-base text-gray-900 leading-relaxed text-right whitespace-pre-line" dir="rtl">{tFn('charter_text_full')}</div>
	</div>

	<!-- טופס חתימה -->
	<form onsubmit={(e) => e.preventDefault()} class="rounded-b-2xl border-2 border-amber-700/40 bg-amber-50/40 p-5 md:p-7 mb-6 space-y-4 shadow-sm">
		<h2 class="text-xl font-black text-blue-200 mb-3">{tFn('charter_join_form_title')}</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
			<div class="md:col-span-2">
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

		<!-- אישור האמנה / הודעת ברכות -->
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

		<p class="text-xs text-gray-500 mt-2">
			{tFn('charter_join_privacy_note')}
		</p>
	</form>
</section>
