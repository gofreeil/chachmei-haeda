<script lang="ts">
	import LiveCalendar from '$lib/components/LiveCalendar.svelte';

	const rulingSteps = [
		{
			num: 1,
			icon: '✍️',
			title: 'חתימה על אמנת המוסר',
			desc: 'הצדדים חותמים על הקוד האתי הכלל-עולמי UECC ומקבלים על עצמם את כללי הבוררות'
		},
		{
			num: 2,
			icon: '📅',
			title: 'תיאום תאריך לשני הצדדים',
			desc: 'מתאמים תאריך דיון שמתאים לכל בעלי הדין דרך לוח הדיונים באתר'
		},
		{
			num: 3,
			icon: '⚖️',
			title: 'אישור בית הדין ופתיחת הדיון',
			desc: 'בית הדין מאשר את הבקשה ומתחילים את ההליך במפגש וירטואלי מוקלט'
		},
		{
			num: 4,
			icon: '🕊️',
			title: 'פסק דין חתום וצוות משכין שלום',
			desc: 'הצדדים מקבלים פסק דין חתום, ולאחריו צוות משכין שלום מלווה ביישום ההכרעה ובחזרת האחווה'
		}
	];
</script>

<svelte:head>
	<title>היכל המשפט — חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-6">
		<div class="text-5xl mb-3">🏛️</div>
		<h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
			היכל המשפט
		</h1>
		<p class="mt-3 text-gray-700 text-base md:text-lg font-bold max-w-2xl mx-auto">
			כך נראה הליך בוררות אצלנו — ארבעה שלבים פשוטים מהחתימה ועד החזרת האחווה
		</p>
	</header>

	<section class="mb-8">
		<header class="text-center mb-5">
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
				⚖️ כיצד קובעים דין
			</h2>
			<p class="mt-2 text-gray-600 text-sm md:text-base font-bold">ארבעה שלבים פשוטים לפתיחת תיק בוררות והכרעה</p>
		</header>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
			{#each rulingSteps as step}
				<div class="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 text-right">
					<div class="absolute top-4 right-4 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
						{step.num}
					</div>
					<div class="text-4xl mb-3 mr-14">{step.icon}</div>
					<h3 class="text-lg md:text-xl font-bold text-white mb-2">{step.title}</h3>
					<p class="text-sm text-gray-300 leading-relaxed">{step.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<div class="mb-8 rounded-2xl border-2 border-purple-400/40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-5 md:p-6 text-center">
		<p class="text-gray-800 text-base md:text-lg font-bold mb-3">
			מוכן לפתוח תיק? התחל בשלב 1 — חתימה על אמנת המוסר ובחירת תאריך
		</p>
		<a
			href="/request-hearing"
			class="inline-block px-7 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all"
		>
			⚖️ פתח בקשת דיון →
		</a>
	</div>

	<section class="mb-8">
		<header class="text-center mb-5">
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-700 text-xs font-black mb-3">
				🚧 הדגמה — מוקאפ
			</div>
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
				🎥 חדר הדיון הוירטואלי
			</h2>
			<p class="mt-2 text-gray-700 text-sm md:text-base font-bold">כאן יבוצעו המפגשים בזמן הדיון — מוקלט ושמור בארכיון</p>
		</header>

		<div class="relative rounded-2xl border-4 border-gray-800 bg-gradient-to-br from-gray-900 to-slate-900 p-3 md:p-5 shadow-2xl max-w-4xl mx-auto">
			<!-- חלון וידאו ראשי + סייד-בר -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
				<!-- משתתף ראשי -->
				<div class="md:col-span-3 relative aspect-video rounded-xl bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center overflow-hidden ring-2 ring-purple-400/40">
					<div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.3) 0%, transparent 50%);"></div>
					<div class="text-center relative z-10">
						<div class="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-5xl md:text-6xl mx-auto mb-2 shadow-2xl ring-4 ring-white/30">
							👨‍⚖️
						</div>
						<p class="text-white font-bold text-sm md:text-base">הרב יוסף כהן</p>
						<p class="text-purple-200 text-xs md:text-sm">אב בית הדין · מדבר</p>
					</div>
					<!-- אינדיקטור מדבר -->
					<div class="absolute top-3 right-3 flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/90 backdrop-blur-sm">
						<span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
						<span class="text-white text-xs font-bold">🎤 מדבר</span>
					</div>
					<!-- אינדיקטור הקלטה -->
					<div class="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-full bg-red-600/90 backdrop-blur-sm">
						<span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
						<span class="text-white text-xs font-bold">REC</span>
					</div>
				</div>

				<!-- 4 משתתפים בצד -->
				<div class="grid grid-cols-4 md:grid-cols-1 gap-2">
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-blue-900 to-cyan-900 flex items-center justify-center ring-1 ring-blue-400/30">
						<span class="text-3xl md:text-4xl">👨‍⚖️</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">הרב דוד א.</p>
						</div>
					</div>
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-emerald-900 to-teal-900 flex items-center justify-center ring-1 ring-emerald-400/30">
						<span class="text-3xl md:text-4xl">👨‍⚖️</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">הרב משה ל.</p>
						</div>
					</div>
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-amber-900 to-orange-900 flex items-center justify-center ring-1 ring-amber-400/30">
						<span class="text-3xl md:text-4xl">🧑</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">תובע</p>
						</div>
					</div>
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-rose-900 to-pink-900 flex items-center justify-center ring-1 ring-rose-400/30">
						<span class="text-3xl md:text-4xl">🧑</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">נתבע</p>
						</div>
					</div>
				</div>
			</div>

			<!-- בר בקרה -->
			<div class="flex items-center justify-between gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10">
				<div class="text-white text-xs md:text-sm font-bold">
					<span class="text-gray-400">תיק:</span> בוררות עסקית · יוסי כהן נ' שמואל לוי
				</div>
				<div class="flex items-center gap-2 md:gap-3">
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label="כיבוי מיקרופון">🎤</button>
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label="כיבוי מצלמה">📹</button>
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label="שיתוף מסך">🖥️</button>
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label="סיים שיחה">📞</button>
				</div>
			</div>
		</div>

		<p class="mt-4 text-center text-gray-700 text-xs md:text-sm font-bold">
			🔒 הדיון מוקלט ושמור באופן מאובטח · רק בעלי הדין ובית הדין נחשפים לתוכן
		</p>
	</section>

	<section class="mb-8">
		<header class="text-center mb-5">
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
				📅 לוח דיונים — בחר תאריך פנוי
			</h2>
			<p class="mt-2 text-gray-600 text-sm md:text-base font-bold">לחץ על תאריך פנוי בירוק כדי לפתוח בקשה לאותו יום</p>
		</header>
		<LiveCalendar />
	</section>
</section>
