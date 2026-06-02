<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultRabbis, RABBIS_STORAGE_KEY, type Rabbi } from '$lib/data/rabbis';

	let rabbis = $state<Rabbi[]>(defaultRabbis);

	onMount(() => {
		try {
			const raw = localStorage.getItem(RABBIS_STORAGE_KEY);
			if (raw) {
				const saved = JSON.parse(raw);
				if (Array.isArray(saved) && saved.every((r) => typeof r?.name === 'string')) {
					rabbis = saved as Rabbi[];
				}
			}
		} catch {}
	});
</script>

<svelte:head>
	<title>אודותנו — חכמי העדה</title>
	<meta name="description" content="חובת החברה לסייע לכל אדם נצרך — בגופו, בנפשו ובממונו" />
</svelte:head>

<section class="py-10 md:py-14 px-4 max-w-3xl mx-auto" dir="rtl" style="text-align: justify; text-justify: inter-word;">
	<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl md:text-5xl font-black text-transparent text-center" style="text-align: center;">
		אודותנו
	</h1>

	<div class="mt-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10">
		<p class="text-xl md:text-2xl font-bold text-white leading-relaxed" style="text-align: center;">
			חובת החברה לסייע לכל אדם נצרך, בגופו, בנפשו ובממונו
		</p>

		<blockquote class="mt-6 py-2" style="text-align: center;">
			<p class="text-lg md:text-xl text-amber-200 leading-loose font-semibold" style="font-family: 'Frank Ruhl Libre', 'David Libre', serif; text-align: center;">
				שנאמר: "פָּתֹחַ תִּפְתַּח אֶת יָדְךָ לוֹ וְהַעֲבֵט תַּעֲבִיטֶנּוּ דֵּי מַחְסֹרוֹ אֲשֶׁר יֶחְסַר לוֹ"
			</p>
			<footer class="mt-2 text-sm text-gray-400" style="text-align: center;">(דברים ט"ו, ח)</footer>
		</blockquote>

		<p class="mt-8 text-base md:text-lg text-gray-200 leading-loose">
			בפלטפורמה זו אנו דואגים לסייע לכל אדם שנקלע לסכסוך —
			לעמוד על הצדק, למתן ולהשקיט את הצד התוקפני,
			לשקף את הסכסוך מנקודת מבט חיצונית אובייקטיבית, ללא התערבות רגשית, לשני הצדדים,
			ולהנגיש פתרון לסיום הסכסוך בדרך הכי צודקת ומתאימה לצדדים —
		</p>
		<p class="mt-4 text-lg md:text-xl font-bold text-white" style="text-align: center;">
			בכפוף לחכמת התורה!
		</p>
	</div>

	<!-- הדיינים -->
	<div class="mt-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10" style="text-align: center;">
		<h2 class="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-2xl md:text-3xl font-black text-transparent">
			הדיינים העומדים בבתי הפיוס
		</h2>

		<ul class="mt-6 grid grid-cols-2 gap-4 text-center list-none max-w-2xl mx-auto">
			{#each rabbis as r (r.id)}
				<li class="flex flex-col items-center gap-2 rounded-xl bg-white/5 border border-amber-400/20 p-3 transition-colors hover:bg-white/10">
					<div class="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gradient-to-br from-amber-200/20 to-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center flex-shrink-0">
						{#if r.photo}
							<img src={r.photo} alt={r.name} class="w-full h-full object-cover" loading="lazy" />
						{:else}
							<svg viewBox="0 0 64 64" class="w-full h-full text-amber-300/70" fill="currentColor" aria-hidden="true">
								<circle cx="32" cy="24" r="12" />
								<path d="M12 60c0-11 9-20 20-20s20 9 20 20v4H12v-4z" />
							</svg>
						{/if}
					</div>
					<span class="text-sm md:text-base text-white font-semibold leading-tight">{r.name}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>
