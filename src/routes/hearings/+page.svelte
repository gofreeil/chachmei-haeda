<script lang="ts">
	import { hearings } from '$lib/data/hearings';
	const upcoming = hearings.filter((h) => h.status === 'מתוכנן');
	const past = hearings.filter((h) => h.status !== 'מתוכנן');
</script>

<svelte:head>
	<title>דיוני זום - חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-8">
		<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			דיוני זום
		</h1>
		<p class="mt-3 text-gray-300">דיונים מתוכננים ושהתקיימו - קישורי השתתפות</p>
	</header>

	<h2 class="text-xl font-bold text-yellow-300 mb-4 mt-6">📅 דיונים מתוכננים</h2>
	<div class="space-y-3 mb-10">
		{#each upcoming as h}
			<div class="rounded-2xl border border-blue-500/30 bg-blue-900/10 p-5">
				<div class="flex items-start justify-between gap-3 flex-wrap">
					<div class="flex-1 min-w-0">
						<h3 class="text-lg font-bold text-white">{h.caseName}</h3>
						<p class="mt-1 text-sm text-gray-400">
							הרכב דיינים: {h.dayanim.join(' • ')}
						</p>
						<p class="mt-2 text-sm">
							<span class="text-yellow-300">📆 {h.date}</span>
							<span class="text-yellow-300 mr-3">🕐 {h.time}</span>
						</p>
					</div>
					<a
						href={h.zoomLink}
						target="_blank"
						rel="noopener noreferrer"
						class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:scale-105 transition-transform whitespace-nowrap"
					>
						הצטרף לזום →
					</a>
				</div>
			</div>
		{/each}
	</div>

	<h2 class="text-xl font-bold text-gray-300 mb-4">📋 דיונים שהתקיימו</h2>
	<div class="space-y-3">
		{#each past as h}
			<div class="rounded-2xl border border-white/10 bg-white/5 p-5 opacity-80">
				<h3 class="text-lg font-bold text-white">{h.caseName}</h3>
				<p class="mt-1 text-sm text-gray-400">
					הרכב דיינים: {h.dayanim.join(' • ')}
				</p>
				<p class="mt-2 text-sm text-gray-500">{h.date} {h.time}</p>
				<a href="/rulings" class="inline-block mt-3 text-sm text-blue-300 hover:text-blue-200">
					ראה פסק דין →
				</a>
			</div>
		{/each}
	</div>
</section>
