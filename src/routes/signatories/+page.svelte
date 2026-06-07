<script lang="ts">
	import { signatories } from '$lib/data/signatories';
	import HeichalHeader from '$lib/components/HeichalHeader.svelte';

	let searchQuery = $state('');

	let filtered = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return signatories;
		return signatories.filter(s =>
			s.name.toLowerCase().includes(q) ||
			(s.role ?? '').toLowerCase().includes(q) ||
			(s.city ?? '').toLowerCase().includes(q)
		);
	});
</script>

<svelte:head>
	<title>חתומים על הקוד האתי - חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<HeichalHeader subtitle="רבנים, אנשי עסקים ופרטיים שקיבלו על עצמם את אמנת UECC ({signatories.length} חתומים)" />

	<div class="mb-6 max-w-2xl mx-auto">
		<div class="relative">
			<span class="absolute inset-y-0 right-3 flex items-center text-indigo-700 text-lg pointer-events-none" aria-hidden="true">🔍</span>
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="חיפוש בשם, תפקיד, עיר..."
				aria-label="חיפוש בחתומים"
				class="w-full pr-10 pl-10 py-2.5 rounded-full bg-white/80 border-2 border-indigo-300/60 text-gray-900 placeholder-gray-500 font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition-colors shadow-sm"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => (searchQuery = '')}
					aria-label="נקה חיפוש"
					class="absolute inset-y-0 left-2 flex items-center justify-center w-7 h-full text-gray-600 hover:text-gray-900"
				>
					✕
				</button>
			{/if}
		</div>
		{#if searchQuery}
			<p class="mt-2 text-xs text-center text-gray-700 font-medium">
				נמצאו {filtered.length} תוצאות עבור "{searchQuery}"
			</p>
		{/if}
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
		{#each filtered as s}
			<div class="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4 flex items-center gap-4">
				<div class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg">
					{s.name.charAt(0)}
				</div>
				<div class="flex-1 min-w-0">
					<p class="font-bold text-white">{s.name}</p>
					<p class="text-sm text-gray-400">
						{s.role || ''}{s.city ? ` • ${s.city}` : ''}
					</p>
					<p class="text-xs text-gray-500 mt-0.5">חתימה: {s.date}</p>
				</div>
				<span class="text-green-400 text-xl" title="חתום">✓</span>
			</div>
		{/each}
	</div>

	<div class="text-center mt-10">
		<a
			href="/ethical-code"
			class="inline-block px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
		>
			← קרא את הקוד האתי
		</a>
	</div>
</section>
