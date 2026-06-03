<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import FancyHeading from '$lib/components/FancyHeading.svelte';

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

<svelte:head>
	<title>בקשת דיון - חכמי העדה</title>
</svelte:head>

<section class="py-8 max-w-3xl mx-auto px-3">
	<header class="text-center mb-8">
		<FancyHeading>
			<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent whitespace-nowrap">
				בקשת דיון
			</h1>
		</FancyHeading>
		<p class="mt-3 text-gray-300">פתיחת תיק חדש לבוררות ושלום על פי דין תורה</p>
	</header>

	{#if saved}
		<!-- ───────────── מצב לאחר שמירה - לוח אישורים ───────────── -->
		<div class="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 md:p-8">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-2xl font-bold text-blue-300">תיק #{caseId}</h2>
				<span class="text-sm text-gray-400">{nickname}</span>
			</div>

			<p class="text-gray-200 mb-5">
				התאריך המוצע <strong class="text-yellow-300">{proposedDate}</strong> לא יינעל ביומן עד שלושת הצדדים יאשרו:
			</p>

			<div class="space-y-3">
				<div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
					<div>
						<div class="font-bold text-white">1. התובע</div>
						<div class="text-sm text-gray-400">{plaintiffName}</div>
					</div>
					{#if approvals.plaintiff}
						<span class="text-green-400 font-bold">✓ אישר</span>
					{:else}
						<button
							onclick={() => (approvals.plaintiff = true)}
							class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold"
						>
							אשר תאריך
						</button>
					{/if}
				</div>

				<div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
					<div>
						<div class="font-bold text-white">2. הנתבע</div>
						<div class="text-sm text-gray-400">{defendantName}</div>
					</div>
					{#if approvals.defendant}
						<span class="text-green-400 font-bold">✓ אישר</span>
					{:else}
						<button
							onclick={() => (approvals.defendant = true)}
							class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold"
							title="המתנה לאישור הנתבע (סימולציה ב-MVP)"
						>
							ממתין לאישור
						</button>
					{/if}
				</div>

				<div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
					<div>
						<div class="font-bold text-white">3. בית הדין</div>
						<div class="text-sm text-gray-400">רבני חכמי העדה</div>
					</div>
					{#if approvals.beitDin}
						<span class="text-green-400 font-bold">✓ אישר</span>
					{:else}
						<button
							onclick={() => (approvals.beitDin = true)}
							class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold"
							title="המתנה לאישור בית הדין (סימולציה ב-MVP)"
						>
							ממתין לאישור
						</button>
					{/if}
				</div>
			</div>

			{#if allApproved}
				<div class="mt-6 rounded-xl border-2 border-green-500/40 bg-green-500/10 p-5 text-center">
					<div class="text-4xl mb-2">🎉</div>
					<p class="text-green-200 font-bold text-lg">המועד אושר על ידי כל הצדדים ונקבע ביומן!</p>
				</div>
			{:else}
				<div class="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-center text-sm text-yellow-200">
					⏳ המועד עוד לא נקבע ביומן - ממתינים לאישור שאר הצדדים
				</div>
			{/if}

			<button
				type="button"
				onclick={resetForm}
				class="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
			>
				← פתיחת תיק נוסף
			</button>
		</div>
	{:else if showSignatureStep}
		<!-- ───────────── שלב חתימה: לפני נעילת התאריך ───────────── -->
		<div class="rounded-2xl border-2 border-yellow-400/40 bg-yellow-500/5 p-6 md:p-8">
			<div class="flex items-start justify-between gap-3 mb-2">
				<h2 class="text-xl md:text-2xl font-bold text-yellow-200">🔑 שלב אחרון - חתימה על הקוד האתי</h2>
				<button
					type="button"
					onclick={backToForm}
					class="shrink-0 text-sm text-blue-300 hover:text-blue-200 underline"
				>
					← חזרה לעריכת הפרטים
				</button>
			</div>
			<p class="text-gray-300 mb-5 leading-relaxed">
				הפרטים נשמרו כטיוטה. כדי לנעול את התאריך ולפתוח את התיק, יש לאשר את הקוד האתי UECC ואת
				סמכות בית הדין. חתימה זו תקפה גם לדיונים עתידיים.
			</p>
			<div class="grid md:grid-cols-2 gap-4">
				<label class="block">
					<span class="text-sm font-bold text-gray-300">שם מלא *</span>
					<input
						type="text"
						bind:value={signerName}
						required
						class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-yellow-400 focus:outline-none"
					/>
				</label>
				<label class="block">
					<span class="text-sm font-bold text-gray-300">טלפון *</span>
					<input
						type="tel"
						bind:value={signerPhone}
						required
						class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-yellow-400 focus:outline-none"
					/>
				</label>
			</div>
			<label class="block mt-4">
				<span class="text-sm font-bold text-gray-300">אימייל</span>
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
						אני מקבל על עצמי את
						<a href="/ethical-code" class="text-blue-300 underline">הקוד האתי UECC</a>
						ושבע מצוות בני נח כתנאי לעריכת הדיון.
					</span>
				</label>
				<label class="flex items-start gap-3 cursor-pointer">
					<input type="checkbox" bind:checked={regArbitration} class="mt-1" />
					<span class="text-gray-200 text-sm">
						אני מסכים שהמחלוקת תוכרע בבית הדין של חכמי העדה על פי דין תורה, ומקבל על עצמי לציית
						לפסק הדין.
					</span>
				</label>
			</div>

			<button
				type="button"
				onclick={signAndFinalize}
				disabled={!signerName.trim() || !signerPhone.trim() || !regUECC || !regArbitration}
				class="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform"
			>
				✓ חתימה ונעילת התאריך
			</button>
		</div>
	{:else}
		<!-- ───────────── המגירות (Accordion) ───────────── -->
		{#if isRegistered && hasAcceptedUECC}
			<div class="mb-5 rounded-xl border border-green-500/30 bg-green-500/5 p-3 text-center text-sm text-green-300">
				✓ מחובר כ-<strong>{userName}</strong> · הקוד האתי UECC כבר חתום
			</div>
		{:else}
			<div class="mb-5 rounded-xl border border-blue-500/30 bg-blue-500/5 p-3 text-center text-sm text-blue-200">
				💡 מלא את הפרטים כטיוטה - חתימה על הקוד האתי תידרש רק בסוף, לפני נעילת התאריך.
			</div>
		{/if}

		{#if preferredDate}
			<div class="mb-3 rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-center">
				<span class="text-green-300 font-bold">📅 תאריך נבחר מהלוח: {preferredDate}</span>
			</div>
		{/if}

		{#if draftRestoredNotice}
			<div class="mb-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 flex items-center justify-between gap-3">
				<span class="text-sm text-yellow-200">📝 שחזרנו טיוטה שהתחלת קודם.</span>
				<button
					type="button"
					onclick={clearDraft}
					class="text-xs text-yellow-300 hover:text-yellow-100 underline shrink-0"
				>
					התחל מחדש
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
						<span class="font-bold text-white text-lg">שם כינוי לדיון זה</span>
						{#if nickname}<span class="text-green-400 text-sm">✓</span>{/if}
					</span>
					<svg class="h-5 w-5 text-gray-400 transition-transform {openDrawer === 'nickname' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
				</button>
				{#if openDrawer === 'nickname'}
					<div class="p-4 pt-0 border-t border-white/10">
						<input
							type="text"
							bind:value={nickname}
							placeholder="לדוגמה: מחלוקת שותפים - מאפיית הזית"
							class="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
						/>
						<p class="text-xs text-gray-400 mt-2">כינוי פנימי בלבד, לזיהוי מהיר של התיק.</p>
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
						<span class="font-bold text-white text-lg">שמות המעורבים ונושא התיק</span>
						{#if plaintiffName && defendantName && subject}<span class="text-green-400 text-sm">✓</span>{/if}
					</span>
					<svg class="h-5 w-5 text-gray-400 transition-transform {openDrawer === 'parties' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
				</button>
				{#if openDrawer === 'parties'}
					<div class="p-4 pt-0 border-t border-white/10 space-y-4">
						<div class="grid md:grid-cols-2 gap-4">
							<label class="block">
								<span class="text-sm font-bold text-gray-300">שם התובע *</span>
								<input
									type="text"
									bind:value={plaintiffName}
									required
									class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
								/>
							</label>
							<label class="block">
								<span class="text-sm font-bold text-gray-300">טלפון התובע</span>
								<input
									type="tel"
									bind:value={plaintiffPhone}
									class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
								/>
							</label>
						</div>
						<div class="grid md:grid-cols-2 gap-4">
							<label class="block">
								<span class="text-sm font-bold text-gray-300">שם הנתבע *</span>
								<input
									type="text"
									bind:value={defendantName}
									required
									class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
								/>
							</label>
							<label class="block">
								<span class="text-sm font-bold text-gray-300">טלפון הנתבע</span>
								<input
									type="tel"
									bind:value={defendantPhone}
									class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
								/>
							</label>
						</div>
						<label class="block">
							<span class="text-sm font-bold text-gray-300">נושא התיק *</span>
							<input
								type="text"
								bind:value={subject}
								required
								placeholder="לדוגמה: הלנת שכר, סכסוך שותפים, ערבות הלוואה..."
								class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
							/>
						</label>
						<label class="block">
							<span class="text-sm font-bold text-gray-300">פירוט הטענות</span>
							<textarea
								bind:value={details}
								rows="5"
								class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none resize-y"
							></textarea>
						</label>
						<p class="text-xs text-gray-400">
							💡 הנתבע ייצור איתו קשר ויחתום על הקוד האתי לפני שיוכל לאשר את התאריך.
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
						<span class="font-bold text-white text-lg">הצעת מועד לדיון</span>
						{#if proposedDate}<span class="text-green-400 text-sm">✓</span>{/if}
					</span>
					<svg class="h-5 w-5 text-gray-400 transition-transform {openDrawer === 'date' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
				</button>
				{#if openDrawer === 'date'}
					<div class="p-4 pt-0 border-t border-white/10">
						<label class="block">
							<span class="text-sm font-bold text-gray-300">תאריך שעליו אני ובעל דיני סיכמנו *</span>
							<input
								type="date"
								bind:value={proposedDate}
								required
								class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
							/>
						</label>
						<p class="text-xs text-gray-400 mt-2">
							התאריך לא יינעל ביומן עד שגם הנתבע וגם בית הדין יאשרו אותו.
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
					💾 שמור והעבר את ההצעה לרבנים
				{:else}
					← המשך לחתימה ונעילת התאריך
				{/if}
			</button>
		</form>
	{/if}
</section>
