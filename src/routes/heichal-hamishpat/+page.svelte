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
			icon: '🎥',
			title: 'אישור בית הדין ופתיחת הדיון',
			desc: 'בית הדין מאשר את הבקשה ומתחילים את ההליך במפגש וירטואלי בזום'
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
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
				📅 לוח דיונים — בחר תאריך פנוי
			</h2>
			<p class="mt-2 text-gray-600 text-sm md:text-base font-bold">לחץ על תאריך פנוי בירוק כדי לפתוח בקשה לאותו יום</p>
		</header>
		<LiveCalendar />
	</section>

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

	<div class="mt-8 rounded-2xl border-2 border-purple-400/40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-5 md:p-6 text-center">
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
</section>
