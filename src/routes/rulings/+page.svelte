<script lang="ts">
	import { rulings } from '$lib/data/hearings';
</script>

<svelte:head>
	<title>פסקי דין - חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-8">
		<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			פסקי דין
		</h1>
		<p class="mt-3 text-gray-300">סיכומי דיון והכרעות פסוקות בכתב</p>
	</header>

	<div class="space-y-5">
		{#each rulings as r}
			<article class="rounded-2xl border border-white/10 bg-white/5 p-6">
				<div class="flex items-start justify-between gap-3 flex-wrap mb-3">
					<h2 class="text-xl md:text-2xl font-bold text-white">{r.caseName}</h2>
					<span class="text-sm text-gray-500">{r.date}</span>
				</div>
				<p class="text-sm text-blue-300 mb-4">הרכב דיינים: {r.dayanim.join(' • ')}</p>

				<div class="space-y-4">
					<div>
						<h3 class="font-bold text-yellow-300 mb-1">סיכום הדיון:</h3>
						<p class="text-gray-200 leading-relaxed">{r.summary}</p>
					</div>
					<div class="rounded-xl border border-green-500/30 bg-green-900/10 p-4">
						<h3 class="font-bold text-green-300 mb-1">הכרעה:</h3>
						<p class="text-gray-100 leading-relaxed">{r.decision}</p>
					</div>
				</div>
			</article>
		{/each}
	</div>

	<div class="text-center mt-10 text-sm text-gray-500">
		כל פסקי הדין ניתנים בהסכמת הצדדים מראש על פי דין תורה.
	</div>
</section>
