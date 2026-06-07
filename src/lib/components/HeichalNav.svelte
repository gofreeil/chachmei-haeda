<script lang="ts">
	import { page } from '$app/state';

	const tabs = [
		{ href: '/activity', label: 'פעולות חכמי העדה' },
		{ href: '/ethical-code', label: 'הקוד האתי העולמי' },
		{ href: '/signatories', label: 'רשימת החתומים' },
	];

	const activeFor: Record<string, string> = {
		'/activity': '/activity',
		'/ethical-code': '/ethical-code',
		'/signatories': '/signatories',
		'/charter-join': '/ethical-code',
	};

	let activeHref = $derived(activeFor[page.url.pathname] ?? '');
</script>

<nav aria-label="ניווט בהיכל המעשה" class="flex flex-wrap justify-center gap-2 mb-6">
	{#each tabs as t}
		{@const isActive = activeHref === t.href}
		<a
			href={t.href}
			aria-current={isActive ? 'page' : undefined}
			class="px-4 py-2 rounded-full font-bold text-sm transition-colors {isActive
				? 'bg-indigo-600 text-white shadow-md'
				: 'bg-white/70 text-indigo-900 border border-indigo-300 hover:bg-white'}"
		>
			{t.label}
		</a>
	{/each}
</nav>
