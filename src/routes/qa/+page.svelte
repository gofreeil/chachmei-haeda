<script lang="ts">
	import { qa, type QaItem, type QaTopic } from '$lib/data/qa';

	const topics: (QaTopic | 'הכל')[] = [
		'הכל',
		'הלכה',
		'מוסר עסקי',
		'חושן משפט / ממונות',
		'שלום בית ומשפחה',
		'שבע מצוות בני נח',
		'אחר'
	];

	let filter = $state<QaTopic | 'הכל'>('הכל');

	const sorted = $derived(
		[...qa].sort((a, b) => b.answerDate.localeCompare(a.answerDate))
	);
	const filtered = $derived(
		filter === 'הכל' ? sorted : sorted.filter((q) => q.topic === filter)
	);

	function fmtDate(d: string): string {
		const [y, m, day] = d.split('-');
		return `${day}.${m}.${y}`;
	}
</script>

<svelte:head>
	<title>שאלות ותשובות - חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-6">
		<div class="text-5xl mb-3">🕮</div>
		<h2 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
			שאלות ותשובות
		</h2>
		<p class="mt-3 text-gray-700 text-base md:text-lg font-bold max-w-2xl mx-auto">
			תשובות רבני בית הדין לשאלות בהלכה, מוסר עסקי, שלום בית ושבע מצוות בני נח
		</p>
	</header>

	<div class="flex flex-wrap gap-2 justify-center mb-6">
		{#each topics as t}
			<button
				type="button"
				onclick={() => (filter = t)}
				class="px-3 py-1.5 rounded-full text-sm font-bold border transition-colors
					{filter === t
						? 'bg-indigo-600 text-white border-indigo-600'
						: 'bg-white/10 text-gray-800 border-white/20 hover:bg-white/20'}"
			>
				{t}
			</button>
		{/each}
	</div>

	<div class="space-y-5 max-w-3xl mx-auto">
		{#each filtered as q (q.slug)}
			<article class="rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-5 md:p-6">
				<div class="flex items-center justify-between gap-3 mb-3 flex-wrap">
					<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-600/80 text-white">
						{q.topic}
					</span>
					<span class="text-xs font-bold text-gray-700">נשאל {fmtDate(q.askDate)}</span>
				</div>
				<h3 class="text-lg md:text-xl font-extrabold text-gray-900 mb-2">שאלה - {q.asker}</h3>
				<p class="text-gray-800 leading-relaxed mb-4">{q.question}</p>
				<div class="border-t border-indigo-300/40 pt-4">
					<h4 class="text-sm font-black text-indigo-700 mb-2">
						תשובת {q.answeredBy} · {fmtDate(q.answerDate)}
					</h4>
					<p class="text-gray-900 leading-relaxed font-medium">{q.answer}</p>
				</div>
			</article>
		{/each}
		{#if filtered.length === 0}
			<p class="text-center text-gray-600">אין שאלות בקטגוריה זו עדיין.</p>
		{/if}
	</div>

	<div class="mt-8 text-center">
		<a
			href="/ask"
			class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-base hover:scale-105 transition-transform shadow"
		>
			🕮 שאל את חכמי העדה →
		</a>
	</div>
</section>
