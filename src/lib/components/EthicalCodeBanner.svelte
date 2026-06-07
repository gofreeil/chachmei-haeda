<script lang="ts">
	const benefits = [
		'אמינות עסקית: שותפים יודעים שדבריך נשמרים בנאמנות',
		'גישה לקהילת בעלי ברית מוסרית - שידוכים עסקיים ותעסוקתיים',
		'הגנה משפטית פנים-קהילתית: פתרון מחלוקות מהיר וצודק לפני ערכאות',
		'התחייבות הדדית: עובדים, מעסיקים ולקוחות מקבלים על עצמם את אותה אמנה',
		'ברכת הבורא והשגחה מיוחדת על העוסקים ביושר ובאמת'
	];
</script>

<section class="rounded-2xl border border-amber-700/40 bg-amber-700/15 p-3 md:p-4 pb-3 md:pb-2 mb-4">
	<!-- מובייל: כותרת למעלה, תמונה משמאל מתחת + יתרונות מימין -->
	<div class="md:hidden">
		<a
			href="/heichal-hamaaseh/ethical-code"
			class="block"
			title="לדף הקוד האתי UECC"
		>
			<h3 class="text-sm font-bold text-amber-900 leading-tight mb-0.5">
				יתרונות הקיום של הקוד המוסרי
			</h3>
			<span class="block text-[11px] font-bold text-amber-800 mb-2">
				לקוד האתי העולמי ←
			</span>
			<div class="flex items-start gap-3">
				<ul class="flex-1 space-y-0.5 text-gray-900 text-[11px] leading-snug">
					{#each benefits as b}
						<li class="flex items-start gap-1">
							<span class="text-amber-700 flex-shrink-0">✓</span>
							<span>{b}</span>
						</li>
					{/each}
				</ul>
				<img
					src="/images/Copilot_20260602_125425.png"
					alt="הקוד האתי UECC"
					class="flex-shrink-0 w-24 h-24 rounded-xl object-contain border-2 border-amber-700/40 shadow"
					loading="lazy"
				/>
			</div>
		</a>

		<div class="mt-3 pt-3 border-t border-amber-700/40 text-center">
			<h4 class="text-xs font-black text-amber-900 mb-1 leading-tight">
				עוד לא הצטרפת? - הצטרף מיד לקבלת המוסר האלוקי
			</h4>
			<p class="text-gray-900 leading-snug text-[11px] mb-2">
				הצטרפותך מחזקת את מעגל היושר והאמון - קבל על עצמך את שבע מצוות בני נח והיה חלק מתיקון עולם.
			</p>
			<div class="flex gap-2">
				<a
					href="mailto:freedomhasbegun@gmail.com?subject=%D7%91%D7%A7%D7%A9%D7%94%20%D7%9C%D7%94%D7%99%D7%97%D7%AA%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A7%D7%95%D7%93%20%D7%94%D7%90%D7%AA%D7%99%20UECC&body=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%94%D7%99%D7%97%D7%AA%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A7%D7%95%D7%93%20%D7%94%D7%90%D7%AA%D7%99%20%D7%94%D7%9B%D7%9C%D7%9C-%D7%A2%D7%95%D7%9C%D7%9E%D7%99%20UECC.%0A%0A%D7%A9%D7%9D%20%D7%9E%D7%9C%D7%90%3A%20%0A%D7%AA%D7%A4%D7%A7%D7%99%D7%93%2F%D7%A2%D7%99%D7%A1%D7%95%D7%A7%3A%20%0A%D7%A2%D7%99%D7%A8%3A%20%0A%D7%98%D7%9C%D7%A4%D7%95%D7%9F%3A%20%0A"
					class="flex-1 text-center px-2 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-black text-xs active:scale-95 transition-transform"
				>
					✍️ חתום על הקוד
				</a>
				<a
					href="/heichal-hamaaseh/signatories"
					class="flex-1 text-center px-2 py-2 rounded-lg bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 font-black text-xs border-2 border-amber-800/50 shadow-md active:scale-95 transition-transform"
					style="color: #fff8e7 !important; text-shadow: 0 1px 2px rgba(120, 53, 15, 0.6);"
				>
					רשימת החתומים →
				</a>
			</div>
		</div>
	</div>

	<!-- דסקטופ: ללא שינוי -->
	<div class="hidden md:block">
		<a
			href="/heichal-hamaaseh/ethical-code"
			class="group block rounded-xl -m-1 p-1 hover:bg-amber-700/10 transition-colors"
			title="לדף הקוד האתי UECC"
		>
			<div class="flex items-start gap-5 md:gap-8">
				<img
					src="/images/Copilot_20260602_125425.png"
					alt="הקוד האתי UECC"
					class="flex-shrink-0 w-32 h-32 md:w-52 md:h-52 rounded-xl object-contain border-2 border-amber-700/40 shadow relative z-10 -mb-4 md:-mb-6"
					loading="lazy"
				/>
				<div class="flex-1 min-w-0">
					<div class="flex items-center justify-between gap-2 flex-wrap mb-1.5">
						<h3 class="text-base md:text-xl font-bold text-amber-900 group-hover:text-amber-800 transition-colors leading-tight">
							יתרונות הקיום של הקוד המוסרי
						</h3>
						<span class="text-xs md:text-sm font-bold text-amber-800 group-hover:text-amber-900 transition-colors">
							לקוד האתי העולמי ←
						</span>
					</div>
					<ul class="space-y-0.5 text-gray-900 text-xs md:text-sm leading-snug">
						{#each benefits as b}
							<li class="flex items-start gap-1.5">
								<span class="text-amber-700 flex-shrink-0">✓</span>
								<span>{b}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</a>

		<div class="mt-3 pt-3 text-center pr-40 md:pr-60 relative">
			<div class="absolute top-0 left-0 right-40 md:right-60 h-px bg-amber-700/40"></div>
			<h4 class="text-sm md:text-base font-black text-amber-900 mb-0.5">
				עוד לא הצטרפת? - הצטרף מיד לקבלת המוסר האלוקי
			</h4>
			<p class="text-gray-900 leading-snug text-xs max-w-2xl mx-auto mb-2">
				הצטרפותך מחזקת את מעגל היושר והאמון - קבל על עצמך את שבע מצוות בני נח והיה חלק מתיקון עולם.
			</p>
			<div class="flex flex-col sm:flex-row gap-2 justify-center items-center">
				<a
					href="mailto:freedomhasbegun@gmail.com?subject=%D7%91%D7%A7%D7%A9%D7%94%20%D7%9C%D7%94%D7%99%D7%97%D7%AA%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A7%D7%95%D7%93%20%D7%94%D7%90%D7%AA%D7%99%20UECC&body=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%94%D7%99%D7%97%D7%AA%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A7%D7%95%D7%93%20%D7%94%D7%90%D7%AA%D7%99%20%D7%94%D7%9B%D7%9C%D7%9C-%D7%A2%D7%95%D7%9C%D7%9E%D7%99%20UECC.%0A%0A%D7%A9%D7%9D%20%D7%9E%D7%9C%D7%90%3A%20%0A%D7%AA%D7%A4%D7%A7%D7%99%D7%93%2F%D7%A2%D7%99%D7%A1%D7%95%D7%A7%3A%20%0A%D7%A2%D7%99%D7%A8%3A%20%0A%D7%98%D7%9C%D7%A4%D7%95%D7%9F%3A%20%0A"
					class="inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-black text-sm hover:scale-105 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all"
				>
					✍️ חתום על הקוד
				</a>
				<a
					href="/heichal-hamaaseh/signatories"
					class="inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 font-black text-sm border-2 border-amber-800/50 shadow-md hover:scale-105 hover:shadow-[0_0_15px_rgba(234,88,12,0.5)] hover:from-amber-500 hover:to-red-400 transition-all"
					style="color: #fff8e7 !important; text-shadow: 0 1px 2px rgba(120, 53, 15, 0.6);"
				>
					רשימת החתומים →
				</a>
			</div>
		</div>
	</div>
</section>
