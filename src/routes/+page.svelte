<script lang="ts">
	import { onMount } from 'svelte';
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

	const heichalim = [
		{
			href: '/heichal-hamishpat',
			icon: '⚖️',
			title: 'היכל המשפט',
			desc: 'פסקי דין, הכרעות ובוררות על פי דין תורה',
			material: 'iron',
			bg: 'bg-gradient-to-br from-slate-600 via-slate-800 to-slate-900',
			border: 'border-slate-300',
			shadow: 'shadow-[0_8px_24px_-4px_rgba(15,23,42,0.6),inset_0_2px_0_rgba(255,255,255,0.18)]',
			titleColor: '#ffffff',
			descColor: '#e2e8f0',
			hover: 'hover:from-slate-500 hover:via-slate-700 hover:to-slate-800 hover:border-slate-100'
		},
		{
			href: '/articles',
			icon: '🕮',
			title: 'היכל הרוח',
			desc: 'מאמרים, תשובות ולימוד תורה ומוסר',
			material: 'silver',
			bg: 'bg-gradient-to-br from-gray-200 via-slate-300 to-gray-400',
			border: 'border-white',
			shadow: 'shadow-[0_8px_24px_-4px_rgba(100,116,139,0.55),inset_0_2px_0_rgba(255,255,255,0.9)]',
			titleColor: '#0f172a',
			descColor: '#1e293b',
			hover: 'hover:from-gray-100 hover:via-slate-200 hover:to-gray-300 hover:border-slate-100'
		},
		{
			href: '/request-hearing',
			icon: '🕊️',
			title: 'היכל השלום',
			desc: 'גישור ופישור — השכנת שלום בין אדם לחברו',
			material: 'glass',
			bg: 'bg-gradient-to-br from-sky-200/60 via-cyan-100/50 to-blue-200/60 backdrop-blur-md',
			border: 'border-sky-200',
			shadow: 'shadow-[0_8px_24px_-4px_rgba(56,189,248,0.45),inset_0_2px_0_rgba(255,255,255,0.85)]',
			titleColor: '#082f49',
			descColor: '#0c4a6e',
			hover: 'hover:from-sky-300/70 hover:via-cyan-200/60 hover:to-blue-300/70 hover:border-white'
		},
		{
			href: '/activity',
			icon: '🛠️',
			title: 'היכל המעשה',
			desc: 'פעילות, פרויקטים וקריאות לתיקון עולם',
			material: 'wood',
			bg: 'bg-gradient-to-br from-amber-700 via-amber-800 to-yellow-900',
			border: 'border-amber-300',
			shadow: 'shadow-[0_8px_24px_-4px_rgba(120,53,15,0.55),inset_0_2px_0_rgba(255,237,178,0.25)]',
			titleColor: '#ffffff',
			descColor: '#fef3c7',
			hover: 'hover:from-amber-600 hover:via-amber-700 hover:to-yellow-800 hover:border-amber-100'
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
		<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
			🏛️ ארבעת ההיכלות
		</h3>
		<p class="mt-2 text-gray-700 text-sm md:text-base font-bold">משפט · שלום · רוח · מעשה</p>
	</header>
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
		{#each heichalim as h}
			<a
				href={h.href}
				class="block rounded-2xl border-4 {h.border} {h.bg} {h.hover} {h.shadow} transition-all p-4 md:p-6 text-center hover:scale-[1.04] hover:-translate-y-1 ring-1 ring-black/20"
			>
				<div class="text-4xl md:text-5xl mb-2 md:mb-3 drop-shadow-lg">{h.icon}</div>
				<h4 class="text-base md:text-xl font-black mb-1 md:mb-2 drop-shadow-sm" style="color: {h.titleColor} !important">{h.title}</h4>
				<p class="text-xs md:text-sm leading-snug font-bold" style="color: {h.descColor} !important">{h.desc}</p>
			</a>
		{/each}
	</div>
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

<section class="mb-10">
	<header class="text-center mb-5">
		<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
			🕮 תשובות חכמי העדה
		</h3>
		<p class="mt-2 text-gray-700 text-sm md:text-base font-bold">חכמי העדה עונים לשאלותך</p>
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
		<div class="mt-5 text-center">
			<a
				href="/qa"
				class="inline-block text-sm font-bold text-indigo-700 hover:text-indigo-900 transition-colors"
			>
				לכל השאלות והתשובות →
			</a>
		</div>

		<a
			href="/ask"
			class="mt-5 block rounded-xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-blue-500/15 p-4 md:p-5 hover:from-indigo-500/25 hover:to-blue-500/25 hover:border-indigo-400/70 hover:scale-[1.01] transition-all group"
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
	</article>
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
