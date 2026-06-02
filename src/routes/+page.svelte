<script lang="ts">
	import { onMount } from 'svelte';
	import { articles as staticArticles, type Article } from '$lib/data/articles';
	import { latestAnswer } from '$lib/data/qa';
	import NewsTicker from '$lib/components/NewsTicker.svelte';

	const recentQa = latestAnswer();

	let allArticles = $state<Article[]>(staticArticles);
	const DEFAULT_HOME_VIDEO = 'https://youtu.be/9ioV_PeaqWE?si=WN00o8ByG65ZOvQ4';
	let homeVideoUrl = $state<string>(DEFAULT_HOME_VIDEO);

	function toEmbedUrl(url: string): string {
		if (!url) return '';
		const t = url.trim();
		// youtu.be/ID
		let m = t.match(/youtu\.be\/([\w-]{6,})/);
		if (m) return `https://www.youtube.com/embed/${m[1]}`;
		// youtube.com/watch?v=ID
		m = t.match(/[?&]v=([\w-]{6,})/);
		if (m) return `https://www.youtube.com/embed/${m[1]}`;
		// already embed
		m = t.match(/youtube\.com\/embed\/([\w-]{6,})/);
		if (m) return `https://www.youtube.com/embed/${m[1]}`;
		// shorts/ID
		m = t.match(/youtube\.com\/shorts\/([\w-]{6,})/);
		if (m) return `https://www.youtube.com/embed/${m[1]}`;
		return t;
	}

	let embedVideoUrl = $derived(toEmbedUrl(homeVideoUrl));

	onMount(() => {
		try {
			const customArt = JSON.parse(localStorage.getItem('chachmei-custom-articles') || '[]');
			if (Array.isArray(customArt)) allArticles = [...customArt, ...staticArticles];
			const savedVid = localStorage.getItem('chachmei-home-video-url');
			if (savedVid !== null) homeVideoUrl = savedVid;
		} catch {}
	});

	let latestArticle = $derived(
		[...allArticles].sort((a, b) => b.date.localeCompare(a.date))[0]
	);

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
			bg: '',
			bgStyle:
				"background-image:" +
				/* fine vertical wood grain lines */
				"repeating-linear-gradient(90deg, rgba(48,20,8,0.18) 0px, rgba(48,20,8,0.18) 1px, transparent 1px, transparent 4px)," +
				/* irregular wider rings */
				"linear-gradient(90deg, rgba(60,30,10,0.35) 0%, transparent 7%, rgba(60,30,10,0.25) 14%, transparent 22%, rgba(80,40,15,0.3) 32%, transparent 42%, rgba(60,30,10,0.2) 55%, transparent 65%, rgba(80,40,15,0.32) 78%, transparent 88%, rgba(60,30,10,0.25) 100%)," +
				/* subtle horizontal lightening */
				"linear-gradient(180deg, rgba(255,237,178,0.22) 0%, transparent 40%, rgba(0,0,0,0.18) 100%)," +
				/* base warm wood color */
				"linear-gradient(135deg, #92400e 0%, #78350f 50%, #713f12 100%);",
			border: 'border-amber-300',
			shadow: 'shadow-[0_8px_24px_-4px_rgba(120,53,15,0.65),inset_0_2px_0_rgba(255,237,178,0.3)]',
			titleColor: '#ffffff',
			descColor: '#fef3c7',
			hover: 'hover:border-amber-100 hover:brightness-110'
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
		}
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
	<a href="/about/revenue" class="block group hover:opacity-90 transition-opacity" aria-label="קרא עוד אודותנו">
		<p class="mt-4 text-gray-900 text-xl md:text-2xl font-extrabold group-hover:text-blue-700 transition-colors">בית דין לבוררות ושלום על פי תורת ישראל</p>
		<p class="mt-3 text-gray-800 text-base md:text-lg font-bold max-w-2xl mx-auto group-hover:underline decoration-blue-400/60 underline-offset-4">
			פלטפורמה לפתרון מחלוקות בין אדם לחברו בצדק ובאחווה, פרסום מאמרים מחכמי ישראל, קידום חברה מתוקנת על ידי התנהלות תחת הקוד האתי העולמי <span class="text-blue-700 font-black">UECC</span>.
		</p>
		<p class="mt-2 text-sm text-blue-700 font-bold opacity-80 group-hover:opacity-100">קרא עוד אודותנו ←</p>
	</a>
</section>

<section class="mb-10">
	<header class="text-center mb-6">
		<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
			🏛️ ארבעת ההיכלות
		</h3>
		<p class="mt-2 text-gray-700 text-sm md:text-base font-bold">משפט וצדק · שלום ואחווה · הרוח · המעשה</p>
	</header>
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
		{#each heichalim as h}
			<a
				href={h.href}
				class="block rounded-2xl border-4 {h.border} {h.bg} {h.hover} {h.shadow} transition-all p-4 md:p-6 text-center hover:scale-[1.04] hover:-translate-y-1 ring-1 ring-black/20"
				style={h.bgStyle ?? ''}
			>
				<div class="text-4xl md:text-5xl mb-2 md:mb-3 drop-shadow-lg">{h.icon}</div>
				<h4 class="text-base md:text-xl font-black mb-1 md:mb-2 drop-shadow-sm" style="color: {h.titleColor} !important">{h.title}</h4>
				<p class="text-xs md:text-sm leading-snug font-bold" style="color: {h.descColor} !important">{h.desc}</p>
			</a>
		{/each}
	</div>
</section>


<section class="mb-10">
	<div class="mb-4 flex items-center gap-3" aria-hidden="true">
		<div
			class="h-2.5 flex-1 bg-gradient-to-l from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
			style="clip-path: polygon(0% 38%, 0% 62%, 75% 62%, 100% 100%, 100% 0%, 75% 38%);"
		></div>
		<span class="text-xl md:text-2xl text-amber-700 drop-shadow-[0_1px_1px_rgba(120,53,15,0.4)]">❦</span>
		<div
			class="h-2.5 flex-1 bg-gradient-to-r from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
			style="clip-path: polygon(0% 0%, 0% 100%, 25% 62%, 100% 62%, 100% 38%, 25% 38%);"
		></div>
	</div>
	<header class="text-center mb-4">
		<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
			חדשות מהיכל המעשה
		</h3>
		<p class="mt-1 text-xs md:text-sm font-bold text-gray-700">
			הפעילות של חכמי העדה לקידום שלום בארץ ושאר חדשות
		</p>
	</header>

	<NewsTicker />

	{#if embedVideoUrl}
		<div class="mt-6 mx-auto max-w-xl md:max-w-2xl rounded-2xl overflow-hidden border-2 border-teal-400/30 bg-black shadow-[0_0_30px_rgba(20,184,166,0.18)]">
			<div class="relative w-full" style="padding-top: 56.25%">
				<iframe
					src={embedVideoUrl}
					title="סרטון בית הדין"
					class="absolute inset-0 w-full h-full"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
				></iframe>
			</div>
		</div>
	{/if}

	<div class="mt-8 flex justify-end">
		<a
			href="/activity"
			class="text-sm md:text-base font-bold text-amber-700 hover:text-amber-900 transition-colors underline decoration-amber-400/60 underline-offset-4"
		>
			אל כלל הפעולות של חכמי העדה ←
		</a>
	</div>
	<div class="mt-2 flex items-center gap-3" aria-hidden="true">
		<div
			class="h-2.5 flex-1 bg-gradient-to-l from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
			style="clip-path: polygon(0% 38%, 0% 62%, 75% 62%, 100% 100%, 100% 0%, 75% 38%);"
		></div>
		<span class="text-xl md:text-2xl text-amber-700 drop-shadow-[0_1px_1px_rgba(120,53,15,0.4)]">❦</span>
		<div
			class="h-2.5 flex-1 bg-gradient-to-r from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
			style="clip-path: polygon(0% 0%, 0% 100%, 25% 62%, 100% 62%, 100% 38%, 25% 38%);"
		></div>
	</div>
</section>

{#if latestArticle}
	<section class="mb-10">
		<header class="text-center mb-5">
			<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
				כותרת מהיכל הרוח
			</h3>
		</header>
		<article
			class="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 md:p-8 shadow-[0_0_30px_rgba(59,130,246,0.10)]"
		>
			<div class="flex items-center justify-between gap-3 flex-wrap mb-3">
				<div class="text-right">
					<div class="flex items-center gap-2 flex-wrap">
						<span class="text-xs font-bold px-3 py-1 rounded-full border border-blue-400/40 bg-blue-500/15 text-blue-200">
							🆕 חדש
						</span>
						<span class="text-xs text-gray-400">הועלה ב-{latestArticle.date} · מאת {latestArticle.author}</span>
					</div>
				</div>
				<a href="/articles" class="text-sm font-bold text-blue-300 hover:text-blue-200 transition-colors">
					לכלל המאמרים ←
				</a>
			</div>
			<h2 class="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
				{latestArticle.title}
			</h2>
			<p class="text-sm text-blue-300 mb-2">מאת: {latestArticle.author}</p>
			<p class="text-gray-200 leading-snug text-base md:text-lg">{latestArticle.excerpt}</p>
		</article>
	</section>
{/if}

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
			<a
				href="/qa"
				class="text-sm font-bold text-indigo-700 hover:text-indigo-900 transition-colors"
			>
				לכל השאלות והתשובות →
			</a>
		</div>
		<div class="flex items-baseline gap-3 flex-wrap mb-2">
			<h4 class="text-lg md:text-xl font-extrabold text-gray-900">שאלה — {recentQa.asker}</h4>
			<span class="text-xs font-bold text-gray-600">· פורסם {recentQa.answerDate.split('-').reverse().join('.')}</span>
		</div>
		<p class="text-gray-800 leading-relaxed mb-4 line-clamp-3">{recentQa.question}</p>
		<div class="border-t border-indigo-300/40 pt-4">
			<h5 class="text-sm font-black text-indigo-700 mb-2">
				תשובת {recentQa.answeredBy}
			</h5>
			<p class="text-gray-900 leading-relaxed font-medium line-clamp-4">{recentQa.answer}</p>
		</div>

		<a
			href="/ask"
			class="mt-4 flex items-center justify-center gap-3 rounded-xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-blue-500/15 p-3 hover:from-indigo-500/25 hover:to-blue-500/25 hover:border-indigo-400/70 hover:scale-[1.01] transition-all group"
		>
			<div class="text-2xl md:text-3xl flex-shrink-0">🕮</div>
			<div class="text-center min-w-0">
				<h3 class="text-base md:text-lg font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent leading-tight">
					שאל את חכמי העדה
				</h3>
				<p class="text-gray-800 text-xs md:text-sm font-bold leading-snug">
					יש לך שאלה בהלכה, במוסר, בהבנת התורה, בחינוך, בשלום בית וכולי — פנה אל החכמים ותענה בהקדם האפשרי
				</p>
			</div>
		</a>
	</article>
</section>

