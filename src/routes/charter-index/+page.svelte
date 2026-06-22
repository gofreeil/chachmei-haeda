<script lang="ts">
	import { onMount } from 'svelte';
	import { loadEntries, filterByStatus } from '$lib/services/charter-service';
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

	onMount(async () => {
		try {
			entries = await loadEntries();
		} finally {
			loading = false;
		}
	});

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
					<span class="text-xl flex-shrink-0" title={tab === 'signed' ? tFn('charter_idx_status_signed') : tFn('charter_idx_status_disqualified')}>
						{tab === 'signed' ? '✅' : '⛔'}
					</span>
				</div>
			{/each}
		</div>
	{/if}

</section>
