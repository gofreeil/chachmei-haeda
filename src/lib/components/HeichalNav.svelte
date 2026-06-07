<script lang="ts">
	import { page } from '$app/state';

	const tabs = [
		{ href: '/heichal-hamaaseh/activity', label: 'פעולות חכמי העדה' },
		{ href: '/heichal-hamaaseh/ethical-code', label: 'הקוד האתי העולמי' },
		{ href: '/heichal-hamaaseh/signatories', label: 'רשימת החתומים' },
	];

	const activeFor: Record<string, string> = {
		'/heichal-hamaaseh/activity': '/heichal-hamaaseh/activity',
		'/heichal-hamaaseh/ethical-code': '/heichal-hamaaseh/ethical-code',
		'/heichal-hamaaseh/signatories': '/heichal-hamaaseh/signatories',
		'/heichal-hamaaseh/charter-join': '/heichal-hamaaseh/ethical-code',
	};

	let activeHref = $derived(activeFor[page.url.pathname] ?? '');
</script>

<nav aria-label="ניווט בהיכל המעשה" class="flex flex-wrap justify-center gap-2 mb-6">
	{#each tabs as t}
		{@const isActive = activeHref === t.href}
		{#if isActive}
			<a
				href={t.href}
				aria-current="page"
				class="px-4 py-2 rounded-full font-bold text-sm transition-colors bg-indigo-600 shadow-md"
				style="color: #ffffff;"
			>
				{t.label}
			</a>
		{:else}
			<a
				href={t.href}
				class="px-4 py-2 rounded-full font-bold text-sm transition-colors bg-white/70 text-indigo-900 border border-indigo-300 hover:bg-white"
			>
				{t.label}
			</a>
		{/if}
	{/each}
</nav>
