<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import CaseBoard from '$lib/components/CaseBoard.svelte';
	import { fetchCase, type CaseView } from '$lib/services/hearings-service';

	// דף התיק שהתובע משתף. ה-JWT יושב ב-localStorage, ולכן הטעינה בצד הלקוח —
	// השרת מחזיר לכל צופה מה מותר לו לאשר.
	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};

	let view = $state<CaseView | null>(null);
	let failed = $state(false);

	onMount(async () => {
		try {
			view = await fetchCase(page.params.id ?? '');
		} catch {
			failed = true;
		}
	});
</script>

<svelte:head>
	<title>{tFn('case_page_title')} · חכמי העדה</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="max-w-3xl mx-auto px-4 py-4">
	{#if view}
		<CaseBoard {view} onChange={(v) => (view = v)} />
	{:else if failed}
		<p class="text-center text-gray-700 py-10">{tFn('case_not_found')}</p>
	{:else}
		<p class="text-center text-gray-600 py-10">{tFn('case_loading')}</p>
	{/if}
</section>
