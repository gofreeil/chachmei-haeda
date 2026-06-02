<script lang="ts">
	import { onMount } from 'svelte';
	import LiveCalendar from '$lib/components/LiveCalendar.svelte';
	import { activity, type ActivityItem } from '$lib/data/activity';
	import { articles as staticArticles, type Article } from '$lib/data/articles';
	import { latestAnswer } from '$lib/data/qa';

	const recentQa = latestAnswer();

	let allArticles = $state<Article[]>(staticArticles);
	let allActivity = $state<ActivityItem[]>(activity);

	onMount(() => {
		try {
			const customArt = JSON.parse(localStorage.getItem('chachmei-custom-articles') || '[]');
			if (Array.isArray(customArt)) allArticles = [...customArt, ...staticArticles];
			const customAct = JSON.parse(localStorage.getItem('chachmei-custom-activity') || '[]');
			if (Array.isArray(customAct)) allActivity = [...customAct, ...activity];
		} catch {}
	});

	let latestArticle = $derived(
		[...allArticles].sort((a, b) => b.date.localeCompare(a.date))[0]
	);
	let recentActivity = $derived(
		[...allActivity].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
	);
	const activityKindIcons: Record<string, string> = {
		'סרטון': '🎬',
		'מאמר': '📝',
		'הודעה': '📣'
	};

	const sections = [
		{
			href: '/request-hearing',
			icon: '⚖️',
			title: 'בקשת דיון',
			desc: 'פתיחת תיק חדש לבוררות ושלום על פי דין תורה'
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
			title: 'ארכיון פסקי הדין',
			desc: 'סיכומי דיון והכרעות פסוקות בכתב'
		}
	];

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
	<div class="mt-6 flex justify-center">
		<div class="h-48 w-48 md:h-64 md:w-64 rounded-full overflow-hidden flex-shrink-0 shadow-xl ring-2 ring-purple-500/30">
			<img
				src="/images/chachmei-logo.png"
				alt="חכמי העדה"
				class="w-full h-full object-contain scale-[1.15]"
				style="image-rendering: -webkit-optimize-contrast;"
			/>
		</div>
	</div>
	<p class="mt-4 text-gray-900 text-xl md:text-2xl font-extrabold">בית דין לבוררות ושלום על פי דין תורה</p>
	<p class="mt-3 text-gray-800 text-base md:text-lg font-bold max-w-2xl mx-auto">
		פלטפורמה לפתרון מחלוקות בין אדם לחברו, מאמרי רבנים מאושרים, ודיוני זום עם סיכומי הכרעה כתובים — הכל
		תחת הקוד האתי הכלל-עולמי <span class="text-blue-700 font-black">UECC</span>.
	</p>
</section>

<section class="mb-10">
	<header class="text-center mb-6">
		<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
			⚖️ כיצד קובעים דין
		</h3>
		<p class="mt-2 text-gray-400 text-sm md:text-base">ארבעה שלבים פשוטים לפתיחת תיק בוררות והכרעה</p>
	</header>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
		{#each rulingSteps as step}
			<div class="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 text-right">
				<div class="absolute top-4 right-4 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
					{step.num}
				</div>
				<div class="text-4xl mb-3 mr-14">{step.icon}</div>
				<h4 class="text-lg md:text-xl font-bold text-white mb-2">{step.title}</h4>
				<p class="text-sm text-gray-300 leading-relaxed">{step.desc}</p>
			</div>
		{/each}
	</div>
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

<section class="mb-10">
	<header class="text-center mb-5">
		<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
			🕮 התשובה האחרונה של בית הדין
		</h3>
		<p class="mt-2 text-gray-700 text-sm md:text-base font-bold">המענה הטרי ביותר שפרסמו רבני בית הדין</p>
	</header>
	<article class="rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 p-5 md:p-7 shadow-[0_0_25px_rgba(99,102,241,0.12)]">
		<div class="flex items-center justify-between gap-3 mb-3 flex-wrap">
			<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-600/80 text-white">
				{recentQa.topic}
			</span>
			<span class="text-xs font-bold text-gray-700">פורסם {recentQa.answerDate.split('-').reverse().join('.')}</span>
		</div>
		<h4 class="text-lg md:text-xl font-extrabold text-gray-900 mb-2">שאלה — {recentQa.asker}</h4>
		<p class="text-gray-800 leading-relaxed mb-4 line-clamp-3">{recentQa.question}</p>
		<div class="border-t border-indigo-300/40 pt-4">
			<h5 class="text-sm font-black text-indigo-700 mb-2">
				תשובת {recentQa.answeredBy}
			</h5>
			<p class="text-gray-900 leading-relaxed font-medium line-clamp-4">{recentQa.answer}</p>
		</div>
		<div class="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
			<a
				href="/qa"
				class="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm hover:scale-105 transition-transform shadow text-center"
			>
				לכל השאלות והתשובות →
			</a>
			<a
				href="/ask"
				class="inline-block px-5 py-2.5 rounded-xl bg-white/10 border border-indigo-400/40 text-gray-900 font-bold text-sm hover:bg-white/20 transition-colors text-center"
			>
				שאל שאלה חדשה
			</a>
		</div>
	</article>
</section>

<section class="mb-10">
	<a
		href="/ask"
		class="block rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-blue-500/15 p-5 md:p-6 shadow-[0_0_25px_rgba(99,102,241,0.15)] hover:from-indigo-500/25 hover:to-blue-500/25 hover:border-indigo-400/70 hover:scale-[1.01] transition-all group"
	>
		<div class="flex items-center justify-between gap-4 flex-wrap">
			<div class="flex items-center gap-4 flex-1 min-w-0">
				<div class="text-4xl md:text-5xl flex-shrink-0">🕮</div>
				<div class="text-right min-w-0">
					<h3 class="text-xl md:text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
						שאל את חכמי העדה
					</h3>
					<p class="mt-1 text-gray-800 text-sm md:text-base font-bold">
						יש לך שאלה בהלכה, במוסר עסקי או בעניין שלום בית? לחץ כאן לפתיחת טופס השאלה
					</p>
				</div>
			</div>
			<span class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-base group-hover:scale-105 transition-transform shadow flex-shrink-0">
				🕮 שאל עכשיו ←
			</span>
		</div>
	</a>
</section>

<section class="mb-10">
	<header class="flex items-end justify-between mb-5 gap-3 flex-wrap">
		<div class="text-right">
			<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
				📡 הפעילות שלנו
			</h3>
		</div>
		<a
			href="/activity"
			class="text-sm font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
		>
			כל הפעילות ←
		</a>
	</header>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
		{#each recentActivity as a}
			<a
				href="/activity#{a.slug}"
				class="block rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/8 to-cyan-500/8 hover:border-teal-400/50 hover:from-teal-500/15 hover:to-cyan-500/15 transition-all p-5 text-right group"
			>
				<div class="flex items-center justify-between gap-2 mb-3">
					<span class="text-xs font-bold px-2.5 py-1 rounded-full border border-teal-400/40 bg-teal-500/15 text-teal-200">
						{activityKindIcons[a.kind] ?? ''} {a.kind}
					</span>
					<span class="text-xs text-gray-500">{a.date}</span>
				</div>
				<h4 class="text-base md:text-lg font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
					{a.title}
				</h4>
				<p class="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-3">{a.excerpt}</p>
				<p class="mt-3 text-xs text-cyan-300">מאת: {a.author}</p>
			</a>
		{/each}
	</div>
</section>

{#if latestArticle}
	<section class="mb-10">
		<header class="flex items-end justify-between mb-5 gap-3 flex-wrap">
			<div class="text-right">
				<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
					📖 מאמר חכמי העדה
				</h3>
				<p class="mt-2 text-gray-400 text-sm md:text-base">
					הועלה ב-{latestArticle.date} · מאת {latestArticle.author}
				</p>
			</div>
			<a href="/articles" class="text-sm font-bold text-blue-300 hover:text-blue-200 transition-colors">
				ארכיון המאמרים ←
			</a>
		</header>
		<article
			class="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 md:p-8 shadow-[0_0_30px_rgba(59,130,246,0.10)]"
		>
			<div class="flex items-center justify-between gap-3 flex-wrap mb-3">
				<span class="text-xs font-bold px-3 py-1 rounded-full border border-blue-400/40 bg-blue-500/15 text-blue-200">
					🆕 חדש
				</span>
				<span class="text-xs text-gray-400">{latestArticle.date}</span>
			</div>
			<h2 class="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
				{latestArticle.title}
			</h2>
			<p class="text-sm text-blue-300 mb-2">מאת: {latestArticle.author}</p>
			<p class="text-gray-200 leading-snug text-base md:text-lg">{latestArticle.excerpt}</p>
			<div class="mt-3 pt-3 border-t border-blue-400/20 flex items-center justify-end gap-3 flex-wrap">
				<a
					href="/articles/{latestArticle.slug}"
					class="text-blue-300 font-bold text-sm hover:text-blue-200 transition-colors"
				>
					פתח במסך נפרד ←
				</a>
			</div>
		</article>
	</section>
{/if}

<section class="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 md:p-8 mb-10">
	<a
		href="/ethical-code"
		class="block group rounded-xl -m-2 p-2 hover:bg-yellow-500/5 transition-colors"
		title="לדף הקוד האתי UECC"
	>
		<div class="flex items-start gap-4 md:gap-5">
			<img
				src="/images/Copilot_20260602_125425.png"
				alt="הקוד האתי UECC"
				class="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-xl object-cover border border-yellow-500/30 shadow"
				loading="lazy"
			/>
			<div class="flex-1 min-w-0">
				<div class="flex items-center justify-between gap-3 flex-wrap mb-3">
					<h3 class="text-xl md:text-2xl font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors">
						יתרונות הקיום של הקוד המוסרי
					</h3>
					<span class="text-sm font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors">
						לדף הקוד האתי ←
					</span>
				</div>
				<ul class="space-y-2 md:space-y-3 text-gray-200">
					{#each benefits as b}
						<li class="flex items-start gap-3">
							<span class="text-yellow-400 mt-1">✓</span>
							<span>{b}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</a>

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
</section>
