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
			📅 לוח דיונים — בחר תאריך פנוי
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

	<div class="mt-8 rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-br from-yellow-500/15 via-amber-500/10 to-yellow-600/15 p-6 md:p-8 text-center shadow-[0_0_30px_rgba(234,179,8,0.15)]">
		<h4 class="text-xl md:text-2xl font-black text-yellow-200 mb-2">
			הצטרף עוד היום לחתומים על הקוד האתי
		</h4>
		<p class="text-gray-200 leading-relaxed max-w-2xl mx-auto mb-5">
			הצטרפותך מחזקת את מעגל היושר והאמון בעסקים, במשפחה ובחברה. רבנים, אנשי עסקים, מעסיקים ועובדים — כולם מוזמנים לקבל על עצמם את שבע מצוות בני נח ולהיות חלק מתיקון עולם.
		</p>
		<div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
			<a
				href="mailto:freedomhasbegun@gmail.com?subject=%D7%91%D7%A7%D7%A9%D7%94%20%D7%9C%D7%94%D7%99%D7%97%D7%AA%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A7%D7%95%D7%93%20%D7%94%D7%90%D7%AA%D7%99%20UECC&body=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%94%D7%99%D7%97%D7%AA%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A7%D7%95%D7%93%20%D7%94%D7%90%D7%AA%D7%99%20%D7%94%D7%9B%D7%9C%D7%9C-%D7%A2%D7%95%D7%9C%D7%9E%D7%99%20UECC.%0A%0A%D7%A9%D7%9D%20%D7%9E%D7%9C%D7%90%3A%20%0A%D7%AA%D7%A4%D7%A7%D7%99%D7%93%2F%D7%A2%D7%99%D7%A1%D7%95%D7%A7%3A%20%0A%D7%A2%D7%99%D7%A8%3A%20%0A%D7%98%D7%9C%D7%A4%D7%95%D7%9F%3A%20%0A"
				class="inline-block px-7 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-all"
			>
				✍️ חתום על הקוד
			</a>
			<a
				href="/signatories"
				class="inline-block px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
			>
				רשימת החתומים →
			</a>
		</div>
	</div>

	<a
		href="/ethical-code"
		class="inline-block mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold hover:scale-105 transition-transform"
	>
		קרא את הקוד המלא →
	</a>
</section>
