<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import { fetchCaseMeetEntry, type CaseMeetEntry } from '$lib/services/hearings-service';

	// חדר המפגש של התיק (איתניום) מוטמע בתוך האתר; רק "מסך מלא" יוצא לאיתניום.
	// הקישור האישי מגיע מהשרת לפי ה-JWT: בית הדין נכנס כמנחה, הצדדים כמשתתפים —
	// ואף אחד אחר לא מקבל קישור.
	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};

	const caseId = $derived(page.params.id ?? '');
	let entry = $state<CaseMeetEntry | null>(null);
	let failMsg = $state('');
	let needLogin = $state(false);

	onMount(async () => {
		try {
			entry = await fetchCaseMeetEntry(caseId);
		} catch (e) {
			const err = e as { status?: number; serverMessage?: string };
			needLogin = err.status === 401;
			failMsg = err.serverMessage || tFn('case_meet_error');
		}
	});
</script>

<svelte:head>
	<title>{tFn('case_meet_title')} · חכמי העדה</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="max-w-6xl mx-auto px-2 md:px-4 py-2">
	<div class="flex items-center justify-between gap-2 mb-2 text-sm">
		<h1 class="font-bold text-indigo-800 truncate">
			🎥 {tFn('case_meet_title')}{#if entry}<span class="font-normal text-gray-600"> · #{entry.caseRef} · {entry.nickname}</span>{/if}
		</h1>
		<div class="flex items-center gap-3 shrink-0">
			{#if entry}
				<!-- באותה לשונית: החדר המוטמע נסגר ונכנסים לאיתניום פעם אחת, בלי משתתף כפול -->
				<a href={entry.url} class="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold">⛶ {tFn('case_meet_fullscreen')}</a>
			{/if}
			<a href="/case/{caseId}" class="text-gray-700 font-bold hover:underline">{tFn('case_meet_back')}</a>
		</div>
	</div>

	{#if entry}
		<iframe
			src={entry.url}
			title={tFn('case_meet_title')}
			allow="camera; microphone; display-capture; fullscreen; autoplay; clipboard-write; screen-wake-lock"
			allowfullscreen
			class="block w-full rounded-xl border border-indigo-400/40 bg-black meet-frame"
		></iframe>
		<p class="text-xs text-gray-600 mt-1">{tFn('case_meet_hint')}</p>
	{:else if failMsg}
		<div class="rounded-xl border border-red-400/40 bg-red-500/5 p-4 text-center">
			<p class="text-red-700 mb-2">{failMsg}</p>
			{#if needLogin}
				<a
					href="/login?returnTo={encodeURIComponent(`/case/${caseId}/meet`)}"
					class="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:opacity-90"
				>
					{tFn('case_meet_login')}
				</a>
			{/if}
		</div>
	{:else}
		<p class="text-center text-gray-600 py-10">{tFn('case_meet_loading')}</p>
	{/if}
</section>

<style>
	.meet-frame {
		height: calc(100vh - 150px);
		height: calc(100dvh - 150px);
		min-height: 420px;
	}
</style>
