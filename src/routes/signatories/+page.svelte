<script lang="ts">
	import { signatories } from '$lib/data/signatories';
</script>

<svelte:head>
	<title>חתומים על הקוד האתי — חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-8">
		<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			חתומים על הקוד האתי
		</h1>
		<p class="mt-3 text-gray-300">רבנים, אנשי עסקים ופרטיים שקיבלו על עצמם את אמנת UECC</p>
		<p class="mt-1 text-sm text-gray-500">סה"כ {signatories.length} חתומים</p>
	</header>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
		{#each signatories as s}
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
