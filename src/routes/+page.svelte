<script lang="ts">
	import LiveCalendar from '$lib/components/LiveCalendar.svelte';

	const sections = [
		{
			href: '/request-hearing',
			icon: '⚖️',
			title: 'בקשת דיון',
			desc: 'פתיחת תיק חדש לבוררות ושלום על פי דין תורה'
		},
		{
			href: '/ethical-code',
			icon: '📜',
			title: 'הקוד האתי UECC',
			desc: 'האמנה המוסרית הכלל-עולמית — שבע מצוות בני נח'
		},
		{
			href: '/signatories',
			icon: '✍️',
			title: 'חתומים על הקוד',
			desc: 'רבנים, אנשי עסקים ופרטיים שקיבלו על עצמם את האמנה'
		},
		{
			href: '/articles',
			icon: '📚',
			title: 'מאמרי רבנים',
			desc: 'מאמרים שאושרו על ידי שלושה רבנים לפחות'
		},
		{
			href: '/hearings',
			icon: '🎥',
			title: 'דיוני זום',
			desc: 'דיונים מתוכננים ושהתקיימו — קישורי השתתפות'
		},
		{
			href: '/rulings',
			icon: '📋',
			title: 'פסקי דין',
			desc: 'סיכומי דיון והכרעות פסוקות בכתב'
		}
	];

	const benefits = [
		'אמינות עסקית: שותפים יודעים שדבריך נשמרים בנאמנות',
		'גישה לקהילת בעלי ברית מוסרית — שידוכים עסקיים ותעסוקתיים',
		'הגנה משפטית פנים-קהילתית: פתרון מחלוקות מהיר וצודק לפני ערכאות',
		'התחייבות הדדית: עובדים, מעסיקים ולקוחות מקבלים על עצמם את אותה אמנה',
		'ברכת הבורא והשגחה מיוחדת על העוסקים ביושר ובאמת'
	];
</script>

<svelte:head>
	<title>חכמי העדה — בית דין לבוררות ושלום על פי דין תורה</title>
</svelte:head>

<section class="py-10 text-center">
	<h2 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl md:text-5xl font-black text-transparent">
		ברוכים הבאים לחכמי העדה
	</h2>
	<p class="mt-4 text-gray-300 text-lg md:text-xl">בית דין לבוררות ושלום על פי דין תורה</p>
	<p class="mt-2 text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
		פלטפורמה לפתרון מחלוקות בין אדם לחברו, מאמרי רבנים מאושרים, ודיוני זום עם סיכומי הכרעה כתובים — הכל
		תחת הקוד האתי הכלל-עולמי <span class="text-blue-300 font-bold">UECC</span>.
	</p>
</section>

<section class="mb-10">
	<header class="text-center mb-5">
		<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
			📅 לוח דיונים — בדוק אם התאריך פנוי
		</h3>
		<p class="mt-2 text-gray-400 text-sm">לחץ על תאריך פנוי בירוק כדי לפתוח בקשה לאותו יום</p>
	</header>
	<LiveCalendar />
</section>

<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0 pb-10">
	{#each sections as s}
		<a
			href={s.href}
			class="block rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/50 transition-all p-5 text-right group"
		>
			<div class="text-4xl mb-3">{s.icon}</div>
			<h3 class="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{s.title}</h3>
			<p class="mt-2 text-sm text-gray-400 leading-relaxed">{s.desc}</p>
		</a>
	{/each}
</section>

<section class="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 md:p-8 mb-10">
	<h3 class="text-2xl font-bold text-yellow-300 mb-4">יתרונות הקיום של הקוד המוסרי</h3>
	<ul class="space-y-3 text-gray-200">
		{#each benefits as b}
			<li class="flex items-start gap-3">
				<span class="text-yellow-400 mt-1">✓</span>
				<span>{b}</span>
			</li>
		{/each}
	</ul>
	<a
		href="/ethical-code"
		class="inline-block mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold hover:scale-105 transition-transform"
	>
		קרא את הקוד המלא →
	</a>
</section>
