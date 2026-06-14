<script lang="ts">
	import { page } from '$app/state';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	const tabs = [
		{ href: '/heichal-hamaaseh/activity', labelKey: 'heichal_nav_tab_activity' },
		{ href: '/heichal-hamaaseh/ethical-code', labelKey: 'heichal_nav_tab_ethical_code' },
		{ href: '/charter-index', labelKey: 'heichal_nav_tab_signatories' },
	];

	const activeFor: Record<string, string> = {
		'/heichal-hamaaseh/activity': '/heichal-hamaaseh/activity',
		'/heichal-hamaaseh/ethical-code': '/heichal-hamaaseh/ethical-code',
		'/charter-index': '/charter-index',
	};

	let activeHref = $derived(activeFor[page.url.pathname] ?? '');
</script>

<nav aria-label={tFn('heichal_nav_aria_label')} class="flex flex-wrap justify-center gap-2 mb-6">
	{#each tabs as t}
		{@const isActive = activeHref === t.href}
		{#if isActive}
			<a
				href={t.href}
				aria-current="page"
				class="px-4 py-2 rounded-full font-bold text-sm transition-colors bg-indigo-600 shadow-md"
				style="color: #ffffff;"
			>
				{tFn(t.labelKey)}
			</a>
		{:else}
			<a
				href={t.href}
				class="px-4 py-2 rounded-full font-bold text-sm transition-colors bg-white/70 text-indigo-900 border border-indigo-300 hover:bg-white"
			>
				{tFn(t.labelKey)}
			</a>
		{/if}
	{/each}
</nav>
