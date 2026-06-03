<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultRabbis, RABBIS_STORAGE_KEY, type Rabbi } from '$lib/data/rabbis';
	import HeichalotGrid from '$lib/components/HeichalotGrid.svelte';

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
	<title>אודותנו - חכמי העדה</title>
	<meta name="description" content="חובת החברה לסייע לכל אדם נצרך - בגופו, בנפשו ובממונו" />
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
			<p class="text-lg md:text-xl leading-loose font-semibold" style="font-family: 'Frank Ruhl Libre', 'David Libre', serif; text-align: center; color: #92400e;">
				שנאמר: "פָּתֹחַ תִּפְתַּח אֶת יָדְךָ לוֹ וְהַעֲבֵט תַּעֲבִיטֶנּוּ דֵּי מַחְסֹרוֹ אֲשֶׁר יֶחְסַר לוֹ"
			</p>
			<footer class="mt-2 text-sm text-gray-400" style="text-align: center;">(דברים ט"ו, ח)</footer>
		</blockquote>

		<p class="mt-8 text-base md:text-lg text-gray-200 leading-loose">
			בפלטפורמה זו אנו דואגים לסייע לכל אדם שנקלע לסכסוך -
			לעמוד על הצדק, למתן ולהשקיט את הצד התוקפני,
			לשקף את הסכסוך מנקודת מבט חיצונית אובייקטיבית, ללא התערבות רגשית, לשני הצדדים,
			ולהנגיש פתרון לסיום הסכסוך בדרך הכי צודקת ומתאימה לצדדים -
		</p>
		<p class="mt-4 text-lg md:text-xl font-bold text-white" style="text-align: center;">
			בכפוף לחכמת התורה!
		</p>
	</div>

	<div class="mt-10">
		<HeichalotGrid />
	</div>

	<!-- הדיינים -->
	<div class="mt-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10">
		<h2 class="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-2xl md:text-3xl font-black text-transparent text-center mb-6">
			הדיינים העומדים בבתי הפיוס
		</h2>

		<ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none">
			{#each rabbis as r (r.id)}
				<li class="flex items-center gap-3 rounded-xl bg-white/5 border border-amber-400/20 p-3 transition-colors hover:bg-white/10">
					<div class="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gradient-to-br from-amber-200/20 to-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center flex-shrink-0">
						{#if r.photo}
							<img src={r.photo} alt={r.name} class="w-full h-full object-cover" loading="lazy" />
						{:else}
							<svg viewBox="0 0 64 64" class="w-full h-full text-amber-300/70" fill="currentColor" aria-hidden="true">
								<circle cx="32" cy="24" r="12" />
								<path d="M12 60c0-11 9-20 20-20s20 9 20 20v4H12v-4z" />
							</svg>
						{/if}
					</div>
					<div class="min-w-0 flex-1 text-right">
						<div class="text-sm md:text-base text-white font-semibold leading-tight">{r.name}</div>
						{#if r.title}
							<div class="text-xs md:text-sm text-amber-200 font-bold leading-tight mt-0.5">{r.title}</div>
						{/if}
						{#if r.nickname}
							<div class="text-xs text-amber-300 italic leading-tight mt-0.5">"{r.nickname}"</div>
						{/if}
						{#if r.city}
							<div class="text-xs text-gray-300 leading-tight mt-0.5">📍 {r.city}</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>

		<div class="mt-8 pt-6 border-t border-amber-400/30 text-right space-y-4">
			<p class="text-base md:text-lg text-gray-100 leading-loose">
				אנו אוסף של דיינים ומורי הוראה בישראל מכלל הארץ, התאגדנו לקיים את מצוות התורה
			</p>
			<blockquote class="py-2 text-center">
				<p class="text-lg md:text-xl leading-loose font-semibold" style="font-family: 'Frank Ruhl Libre', 'David Libre', serif; color: #92400e;">
					"שׁוֹפְטִים וְשֹׁטְרִים תִּתֶּן־לְךָ בְּכָל־שְׁעָרֶיךָ אֲשֶׁר ה' אֱלֹהֶיךָ נֹתֵן לְךָ לִשְׁבָטֶיךָ"
				</p>
				<footer class="mt-1 text-sm text-gray-400">(דברים ט"ז, יח)</footer>
			</blockquote>
			<p class="text-base md:text-lg text-gray-100 leading-loose font-semibold text-center">
				מטרתנו לסייע ולקדם שלום בארץ.
			</p>
			<p class="text-base md:text-lg text-gray-100 leading-loose pt-2">
				בנוסף, אנו רואים חשיבות רבה להחזיר לישראל את מושג <strong class="text-orange-700">חכמי העדה</strong> - מקום אחד הכלול מכלל הפלגים והזרמים הכשרים בישראל, לדון ולברר את ההלכות, להוציא פסקים בקונצנזוס המחייבים את כלל ישראל כקהילה אחת, לתקן תקנות ישראל כדי שיהיו כצאן שיש להם רועה.
			</p>
		</div>
	</div>

	<!-- באנר קריאה להצטרפות -->
	<div class="mt-10 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-orange-500/15 backdrop-blur-sm shadow-xl p-6 md:p-10" style="text-align: center;">
		<h2 class="bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-xl md:text-2xl font-black text-transparent mb-4">
			🤝 קריאה להצטרפות
		</h2>
		<p class="text-base md:text-lg text-gray-100 leading-relaxed font-semibold" style="text-align: center;">
			חכמי העדה קוראים לכלל הפלגים בישראל להצטרף אלינו לדיונים, הכרעות הלכתיות,
			קידום חברה מתוקנת יותר על פי <span class="text-orange-700 font-black">"ואהבת לרעך כמוך"</span>,
			וקידום אחדות בין כל חכמי ישראל היראים והנאמנים לתורת משה ולעמו ישראל.
		</p>
		<div class="mt-6 flex justify-center">
			<a
				href="mailto:freedomhasbegun@gmail.com?subject=%D7%91%D7%A7%D7%A9%D7%94%20%D7%9C%D7%94%D7%A6%D7%98%D7%A8%D7%A3%20%D7%9C%D7%97%D7%9B%D7%9E%D7%99%20%D7%94%D7%A2%D7%93%D7%94&body=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%94%D7%A6%D7%98%D7%A8%D7%A3%20%D7%9C%D7%97%D7%9B%D7%9E%D7%99%20%D7%94%D7%A2%D7%93%D7%94.%0A%0A%D7%A9%D7%9D%20%D7%9E%D7%9C%D7%90%3A%20%0A%D7%AA%D7%A4%D7%A7%D7%99%D7%93%2F%D7%AA%D7%95%D7%90%D7%A8%3A%20%0A%D7%A4%D7%9C%D7%92%2F%D7%A7%D7%94%D7%99%D7%9C%D7%94%3A%20%0A%D7%A2%D7%99%D7%A8%3A%20%0A%D7%98%D7%9C%D7%A4%D7%95%D7%9F%3A%20%0A"
				class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 font-black text-base border-2 border-amber-700/40 shadow-md hover:scale-105 hover:shadow-[0_0_20px_rgba(234,88,12,0.5)] transition-all"
				style="color: #fff8e7; text-shadow: 0 1px 2px rgba(120, 53, 15, 0.6);"
			>
				<span>✉️</span>
				<span>צור קשר באימייל</span>
			</a>
		</div>
	</div>
</section>
