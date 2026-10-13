<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import FancyHeading from './FancyHeading.svelte';
	import CaseBoard from './CaseBoard.svelte';
	import { openCase, type CaseView } from '$lib/services/hearings-service';
	import { getCurrentUser, type StrapiUser } from '$lib/strapi';
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
	// פתיחת תיק — רק למשתמש רשום ומחובר (JWT), שנרשם בשרת כתובע.
	let authUser = $state<StrapiUser | null>(null);
	let authChecked = $state(false);
	const isRegistered = $derived(!!authUser);
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
	// התיק כפי שהשרת החזיר — האישורים עצמם עוברים רק דרך השרת (CaseBoard)
	let caseView = $state<CaseView | null>(null);
	const saved = $derived(!!caseView);
	let submitting = $state(false);
	let submitError = $state('');
	let draftLoaded = $state(false);
	let draftRestoredNotice = $state(false);

	// ───────────────── טעינה: פרופיל + טיוטה ─────────────────
	onMount(() => {
		try {
			const user = JSON.parse(localStorage.getItem('chachmei-user') || 'null');
			if (user) {
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
		getCurrentUser().then((u) => {
			authUser = u;
			authChecked = true;
			if (!u) return;
			if (!userName) userName = u.nickname || (u.username?.includes('_') ? '' : u.username) || '';
			if (!userEmail) userEmail = u.email || '';
			if (!userPhone) userPhone = u.phone || '';
			if (!plaintiffName && userName) plaintiffName = userName;
			if (!plaintiffPhone && userPhone) plaintiffPhone = userPhone;
		});
	});

	function goLogin() {
		// הטיוטה כבר שמורה ב-localStorage — חוזרים לטופס אחרי ההתחברות
		window.location.href = `/login?returnTo=${encodeURIComponent('/heichal-hamishpat?open=request-hearing')}`;
	}

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
		if (!isRegistered) {
			goLogin();
			return;
		}
		if (hasAcceptedUECC) {
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
		hasAcceptedUECC = true;
		userName = signerName;
		userPhone = signerPhone;
		userEmail = signerEmail;
		if (!plaintiffName.trim()) plaintiffName = signerName;
		if (!plaintiffPhone.trim()) plaintiffPhone = signerPhone;
		showSignatureStep = false;
		finalizeCase();
	}

	async function finalizeCase() {
		submitting = true;
		submitError = '';
		try {
			const view = await openCase({
				nickname,
				plaintiffName,
				plaintiffPhone,
				defendantName,
				defendantPhone,
				subject,
				details,
				proposedDate
			});
			try {
				const cases = JSON.parse(localStorage.getItem('chachmei-cases') || '[]');
				cases.push({
					id: view.caseRef,
					docId: view.id,
					nickname,
					plaintiffName,
					plaintiffPhone,
					defendantName,
					defendantPhone,
					subject,
					details,
					proposedDate,
					approvals: { ...view.approvals },
					createdAt: new Date().toISOString()
				});
				localStorage.setItem('chachmei-cases', JSON.stringify(cases));
				localStorage.removeItem('chachmei-hearing-draft');
			} catch {}
			caseView = view;
			scrollToTop();
		} catch (e) {
			if ((e as { status?: number })?.status === 401) {
				authUser = null;
				submitError = tFn('req_hearing_login_required');
			} else {
				submitError = tFn('req_hearing_submit_error');
			}
		} finally {
			submitting = false;
		}
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
		caseView = null;
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
				class="absolute top-0 left-0 w-9 h-9 rounded-full bg-white/70 hover:bg-white/80 text-gray-900 text-xl font-bold transition-colors flex items-center justify-center"
			>✕</button>
		{/if}
		<FancyHeading>
			<h2 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl md:text-3xl font-black text-transparent whitespace-nowrap">
				{tFn('req_hearing_h1')}
			</h2>
		</FancyHeading>
		<p class="mt-3 text-gray-700">{tFn('req_hearing_subtitle')}</p>
	</header>

	{#if saved}
		<!-- ───────────── מצב לאחר שמירה - לוח אישורים ───────────── -->
		{#if caseView}
			<CaseBoard view={caseView} onChange={(v) => (caseView = v)} />
		{/if}
		<div class="mt-3 flex gap-2">
			<a
				href="/case/{caseView?.id}"
				class="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-center hover:opacity-90"
			>
				{tFn('case_page_link')}
			</a>
			<button
				type="button"
				onclick={resetForm}
				class="flex-1 py-2.5 rounded-xl bg-white/70 hover:bg-white/80 text-gray-900 font-bold transition-colors"
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
			<p class="text-gray-700 mb-5 leading-relaxed">
				{tFn('req_hearing_signature_intro')}
			</p>
			<div class="grid md:grid-cols-2 gap-4">
				<label class="block">
					<span class="text-sm font-bold text-gray-700">{tFn('req_hearing_full_name_label')}</span>
					<input
						type="text"
						bind:value={signerName}
						required
						class="mt-1 w-full rounded-lg bg-white/60 border border-amber-400/40 px-4 py-3 text-gray-900 focus:border-amber-500 focus:outline-none"
					/>
				</label>
				<label class="block">
					<span class="text-sm font-bold text-gray-700">{tFn('req_hearing_phone_label')}</span>
					<input
						type="tel"
						bind:value={signerPhone}
						required
						class="mt-1 w-full rounded-lg bg-white/60 border border-amber-400/40 px-4 py-3 text-gray-900 focus:border-amber-500 focus:outline-none"
					/>
				</label>
			</div>
			<label class="block mt-4">
				<span class="text-sm font-bold text-gray-700">{tFn('req_hearing_email_label')}</span>
				<input
					type="email"
					bind:value={signerEmail}
					class="mt-1 w-full rounded-lg bg-white/60 border border-amber-400/40 px-4 py-3 text-gray-900 focus:border-amber-500 focus:outline-none"
				/>
			</label>

			<div class="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 mt-5 space-y-3">
				<label class="flex items-start gap-3 cursor-pointer">
					<input type="checkbox" bind:checked={regUECC} class="mt-1" />
					<span class="text-gray-800 text-sm">
						{tFn('req_hearing_uecc_consent_prefix')}
						<a href="/heichal-hamaaseh/ethical-code" class="text-blue-300 underline">{tFn('req_hearing_uecc_link_text')}</a>
						{tFn('req_hearing_uecc_consent_suffix')}
					</span>
				</label>
				<label class="flex items-start gap-3 cursor-pointer">
					<input type="checkbox" bind:checked={regArbitration} class="mt-1" />
					<span class="text-gray-800 text-sm">
						{tFn('req_hearing_arbitration_consent')}
					</span>
				</label>
			</div>

			<button
				type="button"
				onclick={signAndFinalize}
				disabled={submitting || !signerName.trim() || !signerPhone.trim() || !regUECC || !regArbitration}
				class="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform"
			>
				{submitting ? tFn('req_hearing_submitting') : tFn('req_hearing_sign_and_lock_btn')}
			</button>
			{#if submitError}
				<p class="mt-3 text-sm text-red-700 text-center">{submitError}</p>
			{/if}
		</div>
	{:else}
		<!-- ───────────── המגירות (Accordion) ───────────── -->
		{#if isRegistered && hasAcceptedUECC}
			<div class="mb-5 rounded-xl border border-green-500/30 bg-green-500/5 p-3 text-center text-sm text-green-300">
				{tFn('req_hearing_logged_in_prefix')}<strong>{userName}</strong>{tFn('req_hearing_logged_in_suffix')}
			</div>
		{:else if authChecked && !isRegistered}
			<div class="mb-5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 flex items-center justify-between gap-3">
				<span class="text-sm text-gray-800">{tFn('req_hearing_login_required')}</span>
				<button
					type="button"
					onclick={goLogin}
					class="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:opacity-90"
				>
					{tFn('req_hearing_login_btn')}
				</button>
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
					class="text-xs text-amber-700 hover:text-yellow-100 underline shrink-0"
				>
					{tFn('req_hearing_start_over_btn')}
				</button>
			</div>
		{/if}

		<form onsubmit={onSubmitDraft} class="space-y-3">
			<!-- מגירה 1: שם כינוי לדיון -->
			<div class="rounded-xl border border-blue-500/20 bg-white/60 overflow-hidden">
				<button
					type="button"
					onclick={() => toggle('nickname')}
					class="w-full flex items-center justify-between p-4 hover:bg-white/60 text-right"
					aria-expanded={openDrawer === 'nickname'}
				>
					<span class="flex items-center gap-3">
						<span class="text-2xl">🏷️</span>
						<span class="font-bold text-gray-900 text-lg">{tFn('req_hearing_drawer_nickname_title')}</span>
						{#if nickname}<span class="text-green-400 text-sm">✓</span>{/if}
					</span>
					<svg class="h-5 w-5 text-gray-600 transition-transform {openDrawer === 'nickname' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
				</button>
				{#if openDrawer === 'nickname'}
					<div class="p-4 pt-0 border-t border-amber-400/40">
						<input
							type="text"
							bind:value={nickname}
							placeholder={tFn('req_hearing_nickname_placeholder')}
							class="w-full rounded-lg bg-white/60 border border-amber-400/40 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none"
						/>
						<p class="text-xs text-gray-600 mt-2">{tFn('req_hearing_nickname_hint')}</p>
					</div>
				{/if}
			</div>

			<!-- מגירה 2: שמות המעורבים + נושא -->
			<div class="rounded-xl border border-blue-500/20 bg-white/60 overflow-hidden">
				<button
					type="button"
					onclick={() => toggle('parties')}
					class="w-full flex items-center justify-between p-4 hover:bg-white/60 text-right"
					aria-expanded={openDrawer === 'parties'}
				>
					<span class="flex items-center gap-3">
						<span class="text-2xl">👥</span>
						<span class="font-bold text-gray-900 text-lg">{tFn('req_hearing_drawer_parties_title')}</span>
						{#if plaintiffName && defendantName && subject}<span class="text-green-400 text-sm">✓</span>{/if}
					</span>
					<svg class="h-5 w-5 text-gray-600 transition-transform {openDrawer === 'parties' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
				</button>
				{#if openDrawer === 'parties'}
					<div class="p-4 pt-0 border-t border-amber-400/40 space-y-4">
						<div class="grid md:grid-cols-2 gap-4">
							<label class="block">
								<span class="text-sm font-bold text-gray-700">{tFn('req_hearing_plaintiff_name_label')}</span>
								<input
									type="text"
									bind:value={plaintiffName}
									required
									class="mt-1 w-full rounded-lg bg-white/60 border border-amber-400/40 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none"
								/>
							</label>
							<label class="block">
								<span class="text-sm font-bold text-gray-700">{tFn('req_hearing_plaintiff_phone_label')}</span>
								<input
									type="tel"
									bind:value={plaintiffPhone}
									class="mt-1 w-full rounded-lg bg-white/60 border border-amber-400/40 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none"
								/>
							</label>
						</div>
						<div class="grid md:grid-cols-2 gap-4">
							<label class="block">
								<span class="text-sm font-bold text-gray-700">{tFn('req_hearing_defendant_name_label')}</span>
								<input
									type="text"
									bind:value={defendantName}
									required
									class="mt-1 w-full rounded-lg bg-white/60 border border-amber-400/40 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none"
								/>
							</label>
							<label class="block">
								<span class="text-sm font-bold text-gray-700">{tFn('req_hearing_defendant_phone_label')}</span>
								<input
									type="tel"
									bind:value={defendantPhone}
									class="mt-1 w-full rounded-lg bg-white/60 border border-amber-400/40 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none"
								/>
							</label>
						</div>
						<label class="block">
							<span class="text-sm font-bold text-gray-700">{tFn('req_hearing_subject_label')}</span>
							<input
								type="text"
								bind:value={subject}
								required
								placeholder={tFn('req_hearing_subject_placeholder')}
								class="mt-1 w-full rounded-lg bg-white/60 border border-amber-400/40 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none"
							/>
						</label>
						<label class="block">
							<span class="text-sm font-bold text-gray-700">{tFn('req_hearing_details_label')}</span>
							<textarea
								bind:value={details}
								rows="5"
								class="mt-1 w-full rounded-lg bg-white/60 border border-amber-400/40 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none resize-y"
							></textarea>
						</label>
						<p class="text-xs text-gray-600">
							{tFn('req_hearing_defendant_contact_note')}
						</p>
					</div>
				{/if}
			</div>

			<!-- מגירה 3: הצעת תאריך -->
			<div class="rounded-xl border border-blue-500/20 bg-white/60 overflow-hidden">
				<button
					type="button"
					onclick={() => toggle('date')}
					class="w-full flex items-center justify-between p-4 hover:bg-white/60 text-right"
					aria-expanded={openDrawer === 'date'}
				>
					<span class="flex items-center gap-3">
						<span class="text-2xl">📅</span>
						<span class="font-bold text-gray-900 text-lg">{tFn('req_hearing_drawer_date_title')}</span>
						{#if proposedDate}<span class="text-green-400 text-sm">✓</span>{/if}
					</span>
					<svg class="h-5 w-5 text-gray-600 transition-transform {openDrawer === 'date' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
				</button>
				{#if openDrawer === 'date'}
					<div class="p-4 pt-0 border-t border-amber-400/40">
						<label class="block">
							<span class="text-sm font-bold text-gray-700">{tFn('req_hearing_agreed_date_label')}</span>
							<input
								type="date"
								bind:value={proposedDate}
								required
								class="mt-1 w-full rounded-lg bg-white/60 border border-amber-400/40 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none"
							/>
						</label>
						<p class="text-xs text-gray-600 mt-2">
							{tFn('req_hearing_date_lock_note')}
						</p>
					</div>
				{/if}
			</div>

			<button
				type="submit"
				disabled={submitting || !readyToSubmit()}
				class="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-gray-900 font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform"
			>
				{#if submitting}
					{tFn('req_hearing_submitting')}
				{:else if !isRegistered}
					{tFn('req_hearing_login_btn')}
				{:else if hasAcceptedUECC}
					{tFn('req_hearing_submit_to_rabbis_btn')}
				{:else}
					{tFn('req_hearing_continue_to_signature_btn')}
				{/if}
			</button>
			{#if submitError}
				<p class="text-sm text-red-700 text-center">{submitError}</p>
			{/if}
		</form>
	{/if}
</div>
