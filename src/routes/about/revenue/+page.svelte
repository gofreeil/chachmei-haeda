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

		<ul class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-right list-none">
			{#each [
				'הרב דניאל סטבסקי',
				'הרב רועי זאגא',
				'הרב אריה ליפו',
				'הרב בועז מלט',
				'הרב יעקב יוסף וונדר',
				'הרב שמואל מורנו',
				'הרב נדב סופי',
				'הרב מאיר הלוי'
			] as rabbi}
				<li class="flex items-center gap-3 rounded-lg bg-white/5 border border-amber-400/20 px-4 py-3 transition-colors hover:bg-white/10">
					<span class="text-amber-300 text-lg" aria-hidden="true">✦</span>
					<span class="text-base md:text-lg text-white font-semibold">{rabbi}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>
