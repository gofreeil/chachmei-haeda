<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import FancyHeading from './FancyHeading.svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let { onClose }: { onClose?: () => void } = $props();

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};

	const preferredDate = $derived(page.url.searchParams.get('date') ?? '');

	// ───────────────── חתימה על UECC (פרופיל קיים) ─────────────────
	let isRegistered = $state(false);
	let hasAcceptedUECC = $state(false);
	let userName = $state('');
	let userPhone = $state('');
	let userEmail = $state('');

	// ───────────────── תוכן הדיון (טיוטה) ─────────────────
	type DrawerKey = 'nickname' | 'parties' | 'date' | null;
	let openDrawer = $state<DrawerKey>('nickname');

	let nickname = $state('');
	let plaintiffName = $state('');
	let plaintiffPhone = $state('');
	let defendantName = $state('');
	let defendantPhone = $state('');
	let subject = $state('');
	let details = $state('');
	let proposedDate = $state('');

	// ───────────────── שלב חתימה (לפני נעילה) ─────────────────
	let showSignatureStep = $state(false);
	let regUECC = $state(false);
	let regArbitration = $state(false);
	let signerName = $state('');
	let signerPhone = $state('');
	let signerEmail = $state('');

	// ───────────────── מצב אישורים (אחרי שמירה) ─────────────────
	let saved = $state(false);
	let caseId = $state('');
	let approvals = $state({
		plaintiff: false,
		defendant: false,
		beitDin: false
	});

	const allApproved = $derived(approvals.plaintiff && approvals.defendant && approvals.beitDin);
	let draftLoaded = $state(false);
	let draftRestoredNotice = $state(false);

	// ───────────────── טעינה: פרופיל + טיוטה ─────────────────
	onMount(() => {
		try {
			const user = JSON.parse(localStorage.getItem('chachmei-user') || 'null');
			if (user) {
				isRegistered = true;
				hasAcceptedUECC = !!user.uecc;
				userName = user.name || '';
				userPhone = user.phone || '';
				userEmail = user.email || '';
			}
			const draft = JSON.parse(localStorage.getItem('chachmei-hearing-draft') || 'null');
			if (draft) {
				nickname = draft.nickname || '';
				plaintiffName = draft.plaintiffName || '';
				plaintiffPhone = draft.plaintiffPhone || '';
				defendantName = draft.defendantName || '';
				defendantPhone = draft.defendantPhone || '';
				subject = draft.subject || '';
				details = draft.details || '';
				proposedDate = draft.proposedDate || '';
				if (nickname || plaintiffName || defendantName || subject) draftRestoredNotice = true;
			}
			if (!plaintiffName && userName) plaintiffName = userName;
			if (!plaintiffPhone && userPhone) plaintiffPhone = userPhone;
			if (preferredDate && !proposedDate) proposedDate = preferredDate;
		} catch {}
		draftLoaded = true;
	});

	// ───────────────── שמירה אוטומטית של טיוטה ─────────────────
	$effect(() => {
		if (!draftLoaded || saved) return;
		const draft = {
			nickname,
			plaintiffName,
			plaintiffPhone,
			defendantName,
			defendantPhone,
			subject,
			details,
			proposedDate
		};
		try {
			const hasAny = Object.values(draft).some((v) => String(v ?? '').trim());
			if (hasAny) localStorage.setItem('chachmei-hearing-draft', JSON.stringify(draft));
			else localStorage.removeItem('chachmei-hearing-draft');
		} catch {}
	});

	function toggle(key: DrawerKey) {
		openDrawer = openDrawer === key ? null : key;
	}

	function readyToSubmit(): boolean {
		return !!(
			nickname.trim() &&
			plaintiffName.trim() &&
			defendantName.trim() &&
			subject.trim() &&
			proposedDate
		);
	}

	function onSubmitDraft(e: Event) {
		e.preventDefault();
		if (!readyToSubmit()) return;
		if (isRegistered && hasAcceptedUECC) {
			finalizeCase();
		} else {
			signerName = userName || plaintiffName || '';
			signerPhone = userPhone || plaintiffPhone || '';
			signerEmail = userEmail || '';
			showSignatureStep = true;
			scrollToTop();
		}
	}

	function signAndFinalize() {
		if (!signerName.trim() || !signerPhone.trim() || !regUECC || !regArbitration) return;
		try {
			localStorage.setItem(
				'chachmei-user',
				JSON.stringify({
					name: signerName,
					phone: signerPhone,
					email: signerEmail,
					uecc: true,
					arbitration: true
				})
			);
		} catch {}
		isRegistered = true;
		hasAcceptedUECC = true;
		userName = signerName;
		userPhone = signerPhone;
		userEmail = signerEmail;
		if (!plaintiffName.trim()) plaintiffName = signerName;
		if (!plaintiffPhone.trim()) plaintiffPhone = signerPhone;
		showSignatureStep = false;
		finalizeCase();
	}

	function finalizeCase() {
		caseId = 'C-' + Math.floor(100000 + Math.random() * 900000);
		approvals = { plaintiff: true, defendant: false, beitDin: false };
		try {
			const cases = JSON.parse(localStorage.getItem('chachmei-cases') || '[]');
			cases.push({
				id: caseId,
				nickname,
				plaintiffName,
				plaintiffPhone,
				defendantName,
				defendantPhone,
				subject,
				details,
				proposedDate,
				approvals: { ...approvals },
				createdAt: new Date().toISOString()
			});
			localStorage.setItem('chachmei-cases', JSON.stringify(cases));
			localStorage.removeItem('chachmei-hearing-draft');
		} catch {}
		saved = true;
		scrollToTop();
	}

	function scrollToTop() {
		if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function backToForm() {
		showSignatureStep = false;
	}

	function clearDraft() {
		nickname = '';
		plaintiffName = userName || '';
		plaintiffPhone = userPhone || '';
		defendantName = '';
		defendantPhone = '';
		subject = '';
		details = '';
		proposedDate = '';
		try {
			localStorage.removeItem('chachmei-hearing-draft');
		} catch {}
		draftRestoredNotice = false;
	}

	function resetForm() {
		clearDraft();
		approvals = { plaintiff: false, defendant: false, beitDin: false };
		saved = false;
		openDrawer = 'nickname';
	}
</script>

<div class="max-w-3xl mx-auto">
	<header class="text-center mb-6 relative">
		{#if onClose}
			<button
				type="button"
				onclick={onClose}
				aria-label="סגור"
				class="absolute top-0 left-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl font-bold transition-colors flex items-center justify-center"
			>✕</button>
		{/if}
		<FancyHeading>
			<h2 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl md:text-3xl font-black text-transparent whitespace-nowrap">
				{tFn('req_hearing_h1')}
			</h2>
		</FancyHeading>
		<p class="mt-3 text-gray-300">{tFn('req_hearing_subtitle')}</p>
	</header>

	{#if saved}
		<!-- ───────────── מצב לאחר שמירה - לוח אישורים ───────────── -->
		<div class="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 md:p-8">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-2xl font-bold text-blue-300">{tFn('req_hearing_case_label')} #{caseId}</h2>
				<span class="text-sm text-gray-400">{nickname}</span>
			</div>

			<p class="text-gray-200 mb-5">
				{tFn('req_hearing_proposed_date_prefix')} <strong class="text-yellow-300">{proposedDate}</strong> {tFn('req_hearing_proposed_date_suffix')}
			</p>

			<div class="space-y-3">
				<div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
					<div>
						<div class="font-bold text-white">1. {tFn('req_hearing_plaintiff_label')}</div>
						<div class="text-sm text-gray-400">{plaintiffName}</div>
					</div>
					{#if approvals.plaintiff}
						<span class="text-green-400 font-bold">{tFn('req_hearing_approved_mark')}</span>
					{:else}
						<button
							onclick={() => (approvals.plaintiff = true)}
							class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold"
						>
							{tFn('req_hearing_approve_date_btn')}
						</button>
					{/if}
				</div>

				<div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
					<div>
						<div class="font-bold text-white">2. {tFn('req_hearing_defendant_label')}</div>
						<div class="text-sm text-gray-400">{defendantName}</div>
					</div>
					{#if approvals.defendant}
						<span class="text-green-400 font-bold">{tFn('req_hearing_approved_mark')}</span>
					{:else}
						<button
							onclick={() => (approvals.defendant = true)}
							class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold"
							title={tFn('req_hearing_awaiting_defendant_title')}
						>
							{tFn('req_hearing_awaiting_approval_btn')}
						</button>
					{/if}
				</div>

				<div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
					<div>
						<div class="font-bold text-white">3. {tFn('req_hearing_beit_din_label')}</div>
						<div class="text-sm text-gray-400">{tFn('req_hearing_beit_din_rabbis')}</div>
					</div>
					{#if approvals.beitDin}
						<span class="text-green-400 font-bold">{tFn('req_hearing_approved_mark')}</span>
					{:else}
						<button
							onclick={() => (approvals.beitDin = true)}
							class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold"
							title={tFn('req_hearing_awaiting_beit_din_title')}
						>
							{tFn('req_hearing_awaiting_approval_btn')}
						</button>
					{/if}
				</div>
			</div>

			{#if allApproved}
				<div class="mt-6 rounded-xl border-2 border-green-500/40 bg-green-500/10 p-5 text-center">
					<div class="text-4xl mb-2">🎉</div>
					<p class="text-green-200 font-bold text-lg">{tFn('req_hearing_all_approved_msg')}</p>
				</div>
			{:else}
				<div class="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-center text-sm text-yellow-200">
					{tFn('req_hearing_awaiting_others_msg')}
				</div>
			{/if}

			<button
				type="button"
				onclick={resetForm}
				class="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
			>
				{tFn('req_hearing_open_another_case')}
			</button>
		</div>
	{:else if showSignatureStep}
		<!-- ───────────── שלב חתימה: לפני נעילת התאריך ───────────── -->
		<div class="rounded-2xl border-2 border-yellow-400/40 bg-yellow-500/5 p-6 md:p-8">
			<div class="flex items-start justify-between gap-3 mb-2">
				<h2 class="text-xl md:text-2xl font-bold text-yellow-200">{tFn('req_hearing_signature_heading')}</h2>
				<button
					type="button"
					onclick={backToForm}
					class="shrink-0 text-sm text-blue-300 hover:text-blue-200 underline"
				>
					{tFn('req_hearing_back_to_form')}
				</button>
			</div>
			<p class="text-gray-300 mb-5 leading-relaxed">
				{tFn('req_hearing_signature_intro')}
			</p>
			<div class="grid md:grid-cols-2 gap-4">
				<label class="block">
					<span class="text-sm font-bold text-gray-300">{tFn('req_hearing_full_name_label')}</span>
					<input
						type="text"
						bind:value={signerName}
						required
						class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-yellow-400 focus:outline-none"
					/>
				</label>
				<label class="block">
					<span class="text-sm font-bold text-gray-300">{tFn('req_hearing_phone_label')}</span>
					<input
						type="tel"
						bind:value={signerPhone}
						required
						class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-yellow-400 focus:outline-none"
					/>
				</label>
			</div>
			<label class="block mt-4">
				<span class="text-sm font-bold text-gray-300">{tFn('req_hearing_email_label')}</span>
				<input
					type="email"
					bind:value={signerEmail}
					class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-yellow-400 focus:outline-none"
				/>
			</label>

			<div class="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 mt-5 space-y-3">
				<label class="flex items-start gap-3 cursor-pointer">
					<input type="checkbox" bind:checked={regUECC} class="mt-1" />
					<span class="text-gray-200 text-sm">
						{tFn('req_hearing_uecc_consent_prefix')}
						<a href="/heichal-hamaaseh/ethical-code" class="text-blue-300 underline">{tFn('req_hearing_uecc_link_text')}</a>
						{tFn('req_hearing_uecc_consent_suffix')}
					</span>
				</label>
				<label class="flex items-start gap-3 cursor-pointer">
					<input type="checkbox" bind:checked={regArbitration} class="mt-1" />
					<span class="text-gray-200 text-sm">
						{tFn('req_hearing_arbitration_consent')}
					</span>
				</label>
			</div>

			<button
				type="button"
				onclick={signAndFinalize}
				disabled={!signerName.trim() || !signerPhone.trim() || !regUECC || !regArbitration}
				class="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform"
			>
				{tFn('req_hearing_sign_and_lock_btn')}
			</button>
		</div>
	{:else}
		<!-- ───────────── המגירות (Accordion) ───────────── -->
		{#if isRegistered && hasAcceptedUECC}
			<div class="mb-5 rounded-xl border border-green-500/30 bg-green-500/5 p-3 text-center text-sm text-green-300">
				{tFn('req_hearing_logged_in_prefix')}<strong>{userName}</strong>{tFn('req_hearing_logged_in_suffix')}
			</div>
		{:else}
			<div class="mb-5 rounded-xl border border-blue-500/30 bg-blue-500/5 p-3 text-center text-sm text-blue-200">
				{tFn('req_hearing_draft_only_notice')}
			</div>
		{/if}

		{#if preferredDate}
			<div class="mb-3 rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-center">
				<span class="text-green-300 font-bold">{tFn('req_hearing_date_from_calendar')} {preferredDate}</span>
			</div>
		{/if}

		{#if draftRestoredNotice}
			<div class="mb-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 flex items-center justify-between gap-3">
				<span class="text-sm text-yellow-200">{tFn('req_hearing_draft_restored_notice')}</span>
				<button
					type="button"
					onclick={clearDraft}
					class="text-xs text-yellow-300 hover:text-yellow-100 underline shrink-0"
				>
					{tFn('req_hearing_start_over_btn')}
				</button>
			</div>
		{/if}

		<form onsubmit={onSubmitDraft} class="space-y-3">
			<!-- מגירה 1: שם כינוי לדיון -->
			<div class="rounded-xl border border-blue-500/20 bg-white/5 overflow-hidden">
				<button
					type="button"
					onclick={() => toggle('nickname')}
					class="w-full flex items-center justify-between p-4 hover:bg-white/5 text-right"
					aria-expanded={openDrawer === 'nickname'}
				>
					<span class="flex items-center gap-3">
						<span class="text-2xl">🏷️</span>
						<span class="font-bold text-white text-lg">{tFn('req_hearing_drawer_nickname_title')}</span>
						{#if nickname}<span class="text-green-400 text-sm">✓</span>{/if}
					</span>
					<svg class="h-5 w-5 text-gray-400 transition-transform {openDrawer === 'nickname' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
				</button>
				{#if openDrawer === 'nickname'}
					<div class="p-4 pt-0 border-t border-white/10">
						<input
							type="text"
							bind:value={nickname}
							placeholder={tFn('req_hearing_nickname_placeholder')}
							class="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
						/>
						<p class="text-xs text-gray-400 mt-2">{tFn('req_hearing_nickname_hint')}</p>
					</div>
				{/if}
			</div>

			<!-- מגירה 2: שמות המעורבים + נושא -->
			<div class="rounded-xl border border-blue-500/20 bg-white/5 overflow-hidden">
				<button
					type="button"
					onclick={() => toggle('parties')}
					class="w-full flex items-center justify-between p-4 hover:bg-white/5 text-right"
					aria-expanded={openDrawer === 'parties'}
				>
					<span class="flex items-center gap-3">
						<span class="text-2xl">👥</span>
						<span class="font-bold text-white text-lg">{tFn('req_hearing_drawer_parties_title')}</span>
						{#if plaintiffName && defendantName && subject}<span class="text-green-400 text-sm">✓</span>{/if}
					</span>
					<svg class="h-5 w-5 text-gray-400 transition-transform {openDrawer === 'parties' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
				</button>
				{#if openDrawer === 'parties'}
					<div class="p-4 pt-0 border-t border-white/10 space-y-4">
						<div class="grid md:grid-cols-2 gap-4">
							<label class="block">
								<span class="text-sm font-bold text-gray-300">{tFn('req_hearing_plaintiff_name_label')}</span>
								<input
									type="text"
									bind:value={plaintiffName}
									required
									class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
								/>
							</label>
							<label class="block">
								<span class="text-sm font-bold text-gray-300">{tFn('req_hearing_plaintiff_phone_label')}</span>
								<input
									type="tel"
									bind:value={plaintiffPhone}
									class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
								/>
							</label>
						</div>
						<div class="grid md:grid-cols-2 gap-4">
							<label class="block">
								<span class="text-sm font-bold text-gray-300">{tFn('req_hearing_defendant_name_label')}</span>
								<input
									type="text"
									bind:value={defendantName}
									required
									class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
								/>
							</label>
							<label class="block">
								<span class="text-sm font-bold text-gray-300">{tFn('req_hearing_defendant_phone_label')}</span>
								<input
									type="tel"
									bind:value={defendantPhone}
									class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
								/>
							</label>
						</div>
						<label class="block">
							<span class="text-sm font-bold text-gray-300">{tFn('req_hearing_subject_label')}</span>
							<input
								type="text"
								bind:value={subject}
								required
								placeholder={tFn('req_hearing_subject_placeholder')}
								class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
							/>
						</label>
						<label class="block">
							<span class="text-sm font-bold text-gray-300">{tFn('req_hearing_details_label')}</span>
							<textarea
								bind:value={details}
								rows="5"
								class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none resize-y"
							></textarea>
						</label>
						<p class="text-xs text-gray-400">
							{tFn('req_hearing_defendant_contact_note')}
						</p>
					</div>
				{/if}
			</div>

			<!-- מגירה 3: הצעת תאריך -->
			<div class="rounded-xl border border-blue-500/20 bg-white/5 overflow-hidden">
				<button
					type="button"
					onclick={() => toggle('date')}
					class="w-full flex items-center justify-between p-4 hover:bg-white/5 text-right"
					aria-expanded={openDrawer === 'date'}
				>
					<span class="flex items-center gap-3">
						<span class="text-2xl">📅</span>
						<span class="font-bold text-white text-lg">{tFn('req_hearing_drawer_date_title')}</span>
						{#if proposedDate}<span class="text-green-400 text-sm">✓</span>{/if}
					</span>
					<svg class="h-5 w-5 text-gray-400 transition-transform {openDrawer === 'date' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
				</button>
				{#if openDrawer === 'date'}
					<div class="p-4 pt-0 border-t border-white/10">
						<label class="block">
							<span class="text-sm font-bold text-gray-300">{tFn('req_hearing_agreed_date_label')}</span>
							<input
								type="date"
								bind:value={proposedDate}
								required
								class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
							/>
						</label>
						<p class="text-xs text-gray-400 mt-2">
							{tFn('req_hearing_date_lock_note')}
						</p>
					</div>
				{/if}
			</div>

			<button
				type="submit"
				disabled={!readyToSubmit()}
				class="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform"
			>
				{#if isRegistered && hasAcceptedUECC}
					{tFn('req_hearing_submit_to_rabbis_btn')}
				{:else}
					{tFn('req_hearing_continue_to_signature_btn')}
				{/if}
			</button>
		</form>
	{/if}
</div>
