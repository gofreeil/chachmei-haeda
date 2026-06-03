<script lang="ts">
	import { onMount } from 'svelte';
	import { loadEntries, filterByStatus } from '$lib/services/charter-service';
	import type { CharterEntry } from '$lib/data/charter';

	let entries = $state<CharterEntry[]>([]);
	let tab = $state<'signed' | 'disqualified'>('signed');
	let search = $state('');

	onMount(() => {
		entries = loadEntries();
	});

	const signed = $derived(filterByStatus(entries, 'signed'));
	const disqualified = $derived(filterByStatus(entries, 'disqualified'));

	const current = $derived(tab === 'signed' ? signed : disqualified);
	const filtered = $derived(
		search.trim() === ''
			? current
			: current.filter(
					(e) =>
						e.name.includes(search.trim()) ||
						(e.role || '').includes(search.trim()) ||
						(e.city || '').includes(search.trim())
				)
	);
</script>

<svelte:head>
	<title>אינדקס האמנה - חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-6">
		<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			אינדקס האמנה
		</h1>
		<p class="mt-2 text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
			רשימה ציבורית של כל מי שחתם על האמנה המוסרית של חכמי העדה, ושל מי שפסקו חכמי העדה כי אינו עומד בכלליה.
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
			✅ חתומים ({signed.length})
		</button>
		<button
			type="button"
			onclick={() => (tab = 'disqualified')}
			class="px-5 py-2 rounded-full text-sm font-bold border transition-colors {tab === 'disqualified'
				? 'bg-red-500/40 border-red-300 text-white'
				: 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'}"
		>
			⛔ פסולים ({disqualified.length})
		</button>
	</div>

	<!-- חיפוש -->
	<div class="max-w-md mx-auto mb-6">
		<input
			type="text"
			bind:value={search}
			placeholder="חיפוש לפי שם, תפקיד או עיר…"
			class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none text-right"
		/>
	</div>

	<!-- רשימה -->
	{#if filtered.length === 0}
		<div class="rounded-xl border border-white/10 bg-white/5 p-8 text-center max-w-lg mx-auto">
			<div class="text-4xl mb-2">{tab === 'signed' ? '📭' : '🕊️'}</div>
			<p class="text-gray-300">
				{#if search.trim()}
					לא נמצאו תוצאות לחיפוש "{search}"
				{:else if tab === 'signed'}
					עדיין אין חתומים על האמנה. <a href="/charter-join" class="text-blue-300 underline">הצטרף ראשון</a>
				{:else}
					אין רשומות פסולים
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
						{e.name.charAt(0)}
					</div>
					<div class="flex-1 min-w-0">
						<p class="font-bold text-white text-sm">{e.name}</p>
						<p class="text-xs text-gray-400">
							{e.role || ''}{e.role && e.city ? ' • ' : ''}{e.city || ''}
						</p>
						{#if tab === 'signed'}
							<p class="text-[11px] text-emerald-300 mt-0.5">חתימה: {e.date}</p>
						{:else}
							<p class="text-[11px] text-red-300 mt-0.5">
								נפסל: {e.disqualifiedDate || e.date}
							</p>
							{#if e.disqualifiedReason}
								<p class="text-[11px] text-gray-400 mt-0.5 italic">"{e.disqualifiedReason}"</p>
							{/if}
						{/if}
					</div>
					<span class="text-xl flex-shrink-0" title={tab === 'signed' ? 'חתום' : 'פסול'}>
						{tab === 'signed' ? '✅' : '⛔'}
					</span>
				</div>
			{/each}
		</div>
	{/if}

	<div class="text-center mt-10 flex gap-3 justify-center flex-wrap">
		<a
			href="/charter-join"
			class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold transition-colors hover:opacity-90"
		>
			✍️ הצטרף לאמנה
		</a>
		<a
			href="/ethical-code"
			class="inline-block px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
		>
			📜 קרא את האמנה
		</a>
	</div>

	<p class="text-center text-xs text-gray-500 mt-6">
		רשימה זו תחובר בעתיד ל-CMS מרכזי לעדכון בזמן אמת
	</p>
</section>
