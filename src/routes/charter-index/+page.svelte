<script lang="ts">
	import { onMount } from 'svelte';
	import { loadEntries, filterByStatus, loadMyEntry, selfUpdateSignatory } from '$lib/services/charter-service';
	import { getCurrentUser, canEditAnyCharterEntry } from '$lib/strapi';
	import type { CharterEntry } from '$lib/data/charter';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string, values?: Record<string, any>) => {
		void _loc;
		return get(t)(k, values ? { values } : undefined);
	};
	const pickLang = (v: any): string =>
		typeof v === 'string' ? v : (v?.[_loc as any] ?? v?.he ?? '');

	let entries = $state<CharterEntry[]>([]);
	let loading = $state(true);
	let tab = $state<'signed' | 'disqualified'>('signed');
	let searchType = $state<'name' | 'business'>('name');
	let search = $state('');

	// עריכה: מותרת לחותם עצמו (זיהוי בצד השרת לפי email), לסופר-אדמין ולרכזים
	let myEntry = $state<CharterEntry | null>(null);
	let canEditAll = $state(false);
	let editing = $state<CharterEntry | null>(null);
	let editForm = $state({ name: '', businessName: '', role: '', city: '', email: '', phone: '' });
	let editInitial: Record<string, string> = {};
	let saving = $state(false);
	let editError = $state('');

	onMount(async () => {
		try {
			entries = await loadEntries();
		} finally {
			loading = false;
		}
		// זיהוי הרשאות עריכה ברקע — לא מעכב את הצגת הרשימה
		try {
			const [user, mine] = await Promise.all([getCurrentUser(), loadMyEntry()]);
			canEditAll = canEditAnyCharterEntry(user);
			myEntry = mine;
		} catch { /* אורח — אין כפתורי עריכה */ }
	});

	const canEdit = (e: CharterEntry) => canEditAll || (!!myEntry && e.id === myEntry.id);

	function openEdit(e: CharterEntry) {
		// לחתימה שלי יש גם email/phone (הגיעו מ-mine); לחתימות אחרות השדות הפרטיים לא נטענים
		const src = myEntry && e.id === myEntry.id ? myEntry : e;
		editForm = {
			name: pickLang(src.name),
			businessName: pickLang(src.businessName),
			role: pickLang(src.role),
			city: pickLang(src.city),
			email: src.email ?? '',
			phone: src.phone ?? ''
		};
		editInitial = { ...editForm };
		editError = '';
		editing = e;
	}

	async function saveEdit() {
		if (!editing || saving) return;
		if (!editForm.name.trim()) {
			editError = '⚠️ ' + tFn('charter_join_validation_name_required');
			return;
		}
		// שולחים רק שדות שהשתנו — לא דורסים email/phone פרטיים שלא נטענו (עריכת אדמין)
		const changed: Record<string, string> = {};
		for (const k of Object.keys(editForm) as (keyof typeof editForm)[]) {
			if (editForm[k].trim() !== (editInitial[k] ?? '').trim()) changed[k] = editForm[k];
		}
		if (Object.keys(changed).length === 0) { editing = null; return; }
		saving = true;
		editError = '';
		try {
			const updated = await selfUpdateSignatory(editing.id, changed);
			if (updated) {
				entries = entries.map((en) => (en.id === editing!.id ? updated : en));
				if (myEntry && myEntry.id === editing.id) myEntry = updated;
			}
			editing = null;
		} catch {
			editError = '⚠️ ' + tFn('charter_idx_edit_failed');
		} finally {
			saving = false;
		}
	}

	const signed = $derived(filterByStatus(entries, 'signed'));
	const disqualified = $derived(filterByStatus(entries, 'disqualified'));

	const current = $derived(tab === 'signed' ? signed : disqualified);
	const filtered = $derived.by(() => {
		const q = search.trim();
		if (q === '') return current;
		return current.filter((e) => {
			const field = searchType === 'business' ? pickLang(e.businessName) : pickLang(e.name);
			return field.includes(q);
		});
	});
</script>

<svelte:head>
	<title>{tFn('charter_idx_page_title')}</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-6">
		<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl md:text-3xl font-black text-transparent leading-tight">
			{tFn('charter_idx_heading')}
		</h1>
		<h2 class="mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-black tracking-[0.25em] text-xl md:text-2xl">UECC</h2>
		<p class="mt-3 text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
			{tFn('charter_idx_subtitle')}
		</p>
	</header>

	<!-- לשוניות -->
	<div class="flex justify-center gap-2 mb-6 flex-wrap">
		<button
			type="button"
			onclick={() => (tab = 'signed')}
			class="px-5 py-2 rounded-full text-sm font-bold border transition-colors {tab === 'signed'
				? 'bg-emerald-500/40 border-emerald-300 text-white'
				: 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'}"
		>
			✅ {tFn('charter_idx_tab_signed')} ({signed.length})
		</button>
		<button
			type="button"
			onclick={() => (tab = 'disqualified')}
			class="px-5 py-2 rounded-full text-sm font-bold border transition-colors {tab === 'disqualified'
				? 'bg-red-500/40 border-red-300 text-white'
				: 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'}"
		>
			⛔ {tFn('charter_idx_tab_disqualified')} ({disqualified.length})
		</button>
	</div>

	<!-- חיפוש -->
	<div class="max-w-md mx-auto mb-6">
		<div class="rounded-2xl border-2 border-blue-400/40 bg-black/30 overflow-hidden shadow-lg">
			<!-- בורר סוג חיפוש מחובר ל-input -->
			<div class="grid grid-cols-2 bg-black/40" role="tablist">
				<button
					type="button"
					role="tab"
					aria-selected={searchType === 'name'}
					onclick={() => (searchType = 'name')}
					class="px-4 py-3 text-sm md:text-base font-bold transition-colors flex items-center justify-center gap-2 border-b-2 {searchType === 'name'
						? 'bg-blue-500/40 text-white border-blue-300'
						: 'text-gray-400 border-transparent hover:text-white hover:bg-white/10'}"
				>
					<span class="text-lg" aria-hidden="true">👤</span>
					{tFn('charter_idx_search_type_name')}
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={searchType === 'business'}
					onclick={() => (searchType = 'business')}
					class="px-4 py-3 text-sm md:text-base font-bold transition-colors flex items-center justify-center gap-2 border-b-2 {searchType === 'business'
						? 'bg-blue-500/40 text-white border-blue-300'
						: 'text-gray-400 border-transparent hover:text-white hover:bg-white/10'}"
				>
					<span class="text-lg" aria-hidden="true">🏢</span>
					{tFn('charter_idx_search_type_business')}
				</button>
			</div>
			<!-- שורת ה-input עצמה -->
			<div class="flex items-center gap-2 px-4 py-3">
				<span class="text-gray-400 text-lg" aria-hidden="true">🔍</span>
				<input
					type="text"
					bind:value={search}
					placeholder={searchType === 'business'
						? tFn('charter_idx_search_placeholder_business')
						: tFn('charter_idx_search_placeholder_name')}
					class="flex-1 min-w-0 bg-transparent text-white placeholder-gray-400 focus:outline-none text-right text-base"
				/>
				{#if search}
					<button
						type="button"
						onclick={() => (search = '')}
						aria-label="נקה"
						class="text-gray-400 hover:text-white text-xl leading-none px-1"
					>×</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- רשימה -->
	{#if loading}
		<div class="rounded-xl border border-white/10 bg-white/5 p-8 text-center max-w-lg mx-auto">
			<div class="text-4xl mb-2">⏳</div>
			<p class="text-gray-300">{tFn('charter_idx_loading') || 'טוען חתימות...'}</p>
		</div>
	{:else if filtered.length === 0}
		<div class="rounded-xl border border-white/10 bg-white/5 p-8 text-center max-w-lg mx-auto">
			<div class="text-4xl mb-2">{tab === 'signed' ? '📭' : '🕊️'}</div>
			<p class="text-gray-300">
				{#if search.trim()}
					{tFn('charter_idx_empty_search', { query: search })}
				{:else if tab === 'signed'}
					{tFn('charter_idx_empty_signed_prefix')} <a href="/heichal-hamaaseh/ethical-code#join" class="text-blue-300 underline">{tFn('charter_idx_empty_signed_link')}</a>
				{:else}
					{tFn('charter_idx_empty_disqualified')}
				{/if}
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
			{#each filtered as e (e.id)}
				<div
					class="rounded-xl border p-4 flex items-center gap-3 transition-colors
						{tab === 'signed'
						? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
						: 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10'}"
				>
					<div
						class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg
							{tab === 'signed'
							? 'bg-gradient-to-br from-emerald-500 to-blue-500'
							: 'bg-gradient-to-br from-red-500 to-orange-500'}"
					>
						{pickLang(e.name).charAt(0)}
					</div>
					<div class="flex-1 min-w-0">
						<p class="font-bold text-white text-sm">{pickLang(e.name)}</p>
						<p class="text-xs text-gray-400">
							{pickLang(e.role)}{pickLang(e.role) && pickLang(e.city) ? ' • ' : ''}{pickLang(e.city)}
						</p>
						{#if tab === 'signed'}
							<p class="text-[11px] text-emerald-300 mt-0.5">{tFn('charter_idx_signed_on')}: {e.date}</p>
						{:else}
							<p class="text-[11px] text-red-300 mt-0.5">
								{tFn('charter_idx_disqualified_on')}: {e.disqualifiedDate || e.date}
							</p>
							{#if e.disqualifiedReason}
								<p class="text-[11px] text-gray-400 mt-0.5 italic">"{e.disqualifiedReason}"</p>
							{/if}
						{/if}
					</div>
					<div class="flex items-center gap-1.5 flex-shrink-0">
						{#if canEdit(e)}
							<button
								type="button"
								onclick={() => openEdit(e)}
								title={tFn('charter_idx_edit_btn')}
								aria-label={tFn('charter_idx_edit_btn')}
								class="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 flex items-center justify-center text-sm transition-colors"
							>✏️</button>
						{/if}
						<span class="text-xl" title={tab === 'signed' ? tFn('charter_idx_status_signed') : tFn('charter_idx_status_disqualified')}>
							{tab === 'signed' ? '✅' : '⛔'}
						</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- מודל עריכת חתימה -->
	{#if editing}
		<div
			class="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center p-3 md:p-6 overflow-y-auto"
			onclick={(ev) => { if (ev.target === ev.currentTarget && !saving) editing = null; }}
			role="dialog"
			aria-modal="true"
		>
			<div class="w-full max-w-md rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-[#f8eecb] via-[#f0e3b8] to-[#e8d8a8] shadow-2xl p-4 md:p-5 my-4">
				<h3 class="text-base md:text-lg font-black text-amber-900 mb-3 text-center">✏️ {tFn('charter_idx_edit_title')}</h3>
				<form onsubmit={(ev) => { ev.preventDefault(); saveEdit(); }} class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
					<div>
						<label class="block text-xs font-bold text-amber-900 mb-1" for="edit-name">{tFn('charter_join_label_name')}</label>
						<input id="edit-name" type="text" bind:value={editForm.name} required
							class="w-full px-3 py-1.5 rounded-lg bg-white/70 border border-amber-700/30 text-gray-900 focus:border-amber-600 focus:outline-none text-sm" />
					</div>
					<div>
						<label class="block text-xs font-bold text-amber-900 mb-1" for="edit-business">{tFn('charter_join_label_business_name')}</label>
						<input id="edit-business" type="text" bind:value={editForm.businessName}
							class="w-full px-3 py-1.5 rounded-lg bg-white/70 border border-amber-700/30 text-gray-900 focus:border-amber-600 focus:outline-none text-sm" />
					</div>
					<div>
						<label class="block text-xs font-bold text-amber-900 mb-1" for="edit-role">{tFn('charter_join_label_role')}</label>
						<input id="edit-role" type="text" bind:value={editForm.role}
							class="w-full px-3 py-1.5 rounded-lg bg-white/70 border border-amber-700/30 text-gray-900 focus:border-amber-600 focus:outline-none text-sm" />
					</div>
					<div>
						<label class="block text-xs font-bold text-amber-900 mb-1" for="edit-city">{tFn('charter_join_label_city')}</label>
						<input id="edit-city" type="text" bind:value={editForm.city}
							class="w-full px-3 py-1.5 rounded-lg bg-white/70 border border-amber-700/30 text-gray-900 focus:border-amber-600 focus:outline-none text-sm" />
					</div>
					<div>
						<label class="block text-xs font-bold text-amber-900 mb-1" for="edit-phone">{tFn('charter_join_label_phone')}</label>
						<input id="edit-phone" type="tel" bind:value={editForm.phone} dir="ltr"
							class="w-full px-3 py-1.5 rounded-lg bg-white/70 border border-amber-700/30 text-gray-900 focus:border-amber-600 focus:outline-none text-sm text-right" />
					</div>
					<div>
						<label class="block text-xs font-bold text-amber-900 mb-1" for="edit-email">{tFn('charter_join_label_email')}</label>
						<input id="edit-email" type="email" bind:value={editForm.email} dir="ltr"
							class="w-full px-3 py-1.5 rounded-lg bg-white/70 border border-amber-700/30 text-gray-900 focus:border-amber-600 focus:outline-none text-sm text-right" />
					</div>
					{#if editError}
						<p class="sm:col-span-2 text-sm font-bold text-red-700">{editError}</p>
					{/if}
					<div class="sm:col-span-2 flex gap-2 mt-1">
						<button type="submit" disabled={saving}
							class="flex-1 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-amber-50 font-bold text-sm transition-colors disabled:opacity-60">
							{saving ? '⏳' : '💾'} {tFn('charter_idx_edit_save')}
						</button>
						<button type="button" onclick={() => (editing = null)} disabled={saving}
							class="px-4 py-2 rounded-lg border border-amber-700/40 text-amber-900 font-bold text-sm hover:bg-amber-100/60 transition-colors disabled:opacity-60">
							{tFn('charter_idx_edit_cancel')}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

</section>
