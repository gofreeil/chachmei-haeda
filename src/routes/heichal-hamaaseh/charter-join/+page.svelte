<script lang="ts">
	import { addSignatory } from '$lib/services/charter-service';
	import HeichalNav from '$lib/components/HeichalNav.svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	let name = $state('');
	let role = $state('');
	let city = $state('');
	let email = $state('');
	let phone = $state('');
	let accepted = $state(false);
	let notice = $state('');
	let submitted = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		notice = '';
		if (!name.trim()) {
			notice = '⚠️ ' + tFn('charter_join_validation_name_required');
			return;
		}
		if (!accepted) {
			notice = '⚠️ ' + tFn('charter_join_validation_accept_required');
			return;
		}
		addSignatory({
			name,
			role,
			city,
			email,
			phone,
			acceptedTerms: true
		});
		submitted = true;
		notice = '✅ ' + tFn('charter_join_success_message');
		// איפוס שדות
		name = '';
		role = '';
		city = '';
		email = '';
		phone = '';
		accepted = false;
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
	<div class="rounded-2xl border-2 border-amber-700/40 bg-amber-50/70 p-5 md:p-7 mb-6 shadow-sm">
		<h3 class="text-lg md:text-xl font-bold text-amber-900 mb-4 text-center">{tFn('charter_text_title')}</h3>
		<div class="text-sm md:text-base text-gray-900 leading-relaxed text-right whitespace-pre-line" dir="rtl">{tFn('charter_text_full')}</div>
	</div>

	<!-- טופס חתימה -->
	<form onsubmit={handleSubmit} class="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 md:p-7 space-y-4">
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

		<!-- אישור האמנה -->
		<label class="flex items-start gap-3 rounded-xl border-2 border-amber-700/50 bg-amber-100/60 p-4 cursor-pointer hover:bg-amber-100 transition-colors">
			<input
				type="checkbox"
				bind:checked={accepted}
				class="mt-1 w-5 h-5 accent-amber-700 flex-shrink-0"
			/>
			<span class="text-sm md:text-base text-gray-900">
				<strong class="text-amber-900">{tFn('charter_join_consent_strong')}</strong> {tFn('charter_join_consent_body')}
			</span>
		</label>

		{#if notice}
			<p class="text-sm font-bold {notice.startsWith('✅') ? 'text-green-300' : 'text-yellow-300'}">
				{notice}
			</p>
		{/if}

		<div class="flex gap-3 flex-wrap pt-2">
			<button
				type="submit"
				class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black text-lg hover:opacity-90 transition-opacity"
			>
				✍️ {tFn('charter_join_btn_submit')}
			</button>
			{#if submitted}
				<a
					href="/charter-index"
					class="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
				>
					← {tFn('charter_join_btn_view_index')}
				</a>
			{/if}
		</div>

		<p class="text-xs text-gray-500 mt-2">
			{tFn('charter_join_privacy_note')}
		</p>
	</form>
</section>
