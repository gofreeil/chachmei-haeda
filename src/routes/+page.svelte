<script lang="ts">
	import { onMount } from 'svelte';
	import { articles as staticArticles, type Article } from '$lib/data/articles';
	import { latestAnswer } from '$lib/data/qa';
	import NewsTicker from '$lib/components/NewsTicker.svelte';
	import HeichalotGrid from '$lib/components/HeichalotGrid.svelte';

	const recentQa = latestAnswer();

	let allArticles = $state<Article[]>(staticArticles);
	const DEFAULT_HOME_VIDEO = 'https://youtu.be/9ioV_PeaqWE?si=WN00o8ByG65ZOvQ4';
	const DEFAULT_HOME_VIDEO_TITLE = 'חכמי עדת ישראל פועלים להעלות שבטים אבודים לארץ';
	let homeVideoUrl = $state<string>(DEFAULT_HOME_VIDEO);
	let homeVideoTitle = $state<string>(DEFAULT_HOME_VIDEO_TITLE);

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
			const savedTitle = localStorage.getItem('chachmei-home-video-title');
			if (savedTitle !== null) homeVideoTitle = savedTitle;
		} catch {}
	});

	let latestArticle = $derived(
		[...allArticles].sort((a, b) => b.date.localeCompare(a.date))[0]
	);

</script>

<svelte:head>
	<title>חכמי העדה - בית דין לבוררות ושלום על פי דין תורה</title>
</svelte:head>

<section class="py-10 text-center">
	<h2 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl md:text-5xl font-black text-transparent">
		ברוכים הבאים לחכמי העדה
	</h2>
	<a href="/about/revenue" class="block group hover:opacity-90 transition-opacity" aria-label="קרא עוד אודותנו">
		<div class="mt-6 flex justify-center">
			<div class="h-40 w-40 md:h-56 md:w-56 rounded-full overflow-hidden flex-shrink-0 shadow-xl ring-2 ring-purple-500/30 group-hover:ring-blue-500/60 group-hover:scale-[1.02] transition-all">
				<img
					src="/images/chachmei-logo.png"
					alt="חכמי העדה"
					class="w-full h-full object-contain scale-[1.15]"
					style="image-rendering: -webkit-optimize-contrast;"
				/>
			</div>
		</div>
		<p class="mt-4 text-gray-900 text-xl md:text-2xl font-extrabold group-hover:text-blue-700 transition-colors">בית דין לבוררות ושלום על פי תורת ישראל</p>
		<p class="mt-3 text-gray-800 text-base md:text-lg font-bold max-w-2xl mx-auto group-hover:underline decoration-blue-400/60 underline-offset-4">
			פלטפורמה לפתרון מחלוקות בין אדם לחברו בצדק ובאחווה, פרסום מאמרים מחכמי ישראל, קידום חברה מתוקנת על ידי התנהלות תחת הקוד האתי העולמי <span class="text-blue-700 font-black">UECC</span>.
		</p>
		<p class="mt-2 text-sm text-blue-700 font-bold opacity-80 group-hover:opacity-100">קרא עוד אודותנו ←</p>
	</a>
</section>

<HeichalotGrid />


<section class="mb-10">
	<div class="mb-14 flex items-center gap-3" aria-hidden="true">
		<div
			class="h-2 flex-1 bg-gradient-to-l from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
			style="clip-path: polygon(0% 0%, 0% 100%, 100% 50%);"
		></div>
		<span class="text-xl md:text-2xl text-amber-700 drop-shadow-[0_1px_1px_rgba(120,53,15,0.4)]">❦</span>
		<div
			class="h-2 flex-1 bg-gradient-to-r from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
			style="clip-path: polygon(0% 50%, 100% 0%, 100% 100%);"
		></div>
	</div>
	<header class="text-center mb-4">
		<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
			חדשות מהיכל המעשה
		</h3>
		<p class="mt-2 text-base md:text-lg font-black text-amber-900 drop-shadow-[0_1px_1px_rgba(120,53,15,0.25)]">
			הפעילות של חכמי העדה לקידום שלום בארץ ושאר חדשות
		</p>
	</header>

	<NewsTicker />

	{#if embedVideoUrl}
		<div class="mt-10 mx-auto max-w-xl md:max-w-2xl">
			{#if homeVideoTitle.trim()}
				<h4 class="text-center text-lg md:text-xl font-black text-amber-800 mb-3 leading-snug">
					{homeVideoTitle}
				</h4>
			{/if}
			<div class="rounded-2xl overflow-hidden border-2 border-teal-400/30 bg-black shadow-[0_0_30px_rgba(20,184,166,0.18)]">
				<div class="relative w-full" style="padding-top: 56.25%">
					<iframe
						src={embedVideoUrl}
						title={homeVideoTitle || 'סרטון בית הדין'}
						class="absolute inset-0 w-full h-full"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
					></iframe>
				</div>
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
	<div class="mt-2 mb-14 flex items-center gap-3" aria-hidden="true">
		<div
			class="h-2 flex-1 bg-gradient-to-l from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
			style="clip-path: polygon(0% 0%, 0% 100%, 100% 50%);"
		></div>
		<span class="text-xl md:text-2xl text-amber-700 drop-shadow-[0_1px_1px_rgba(120,53,15,0.4)]">❦</span>
		<div
			class="h-2 flex-1 bg-gradient-to-r from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
			style="clip-path: polygon(0% 50%, 100% 0%, 100% 100%);"
		></div>
	</div>
</section>

{#if latestArticle}
	<section class="mb-10">
		<header class="mb-5">
			<div class="flex items-center gap-3">
				<div
					class="h-2 flex-1 bg-gradient-to-l from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
					style="clip-path: polygon(0% 0%, 0% 100%, 100% 50%);"
					aria-hidden="true"
				></div>
				<span class="text-xl md:text-2xl text-amber-700 drop-shadow-[0_1px_1px_rgba(120,53,15,0.4)]" aria-hidden="true">❦</span>
				<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
					מהיכל הרוח
				</h3>
				<span class="text-xl md:text-2xl text-amber-700 drop-shadow-[0_1px_1px_rgba(120,53,15,0.4)]" aria-hidden="true">❦</span>
				<div
					class="h-2 flex-1 bg-gradient-to-r from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
					style="clip-path: polygon(0% 50%, 100% 0%, 100% 100%);"
					aria-hidden="true"
				></div>
			</div>
			<h4 class="mt-2 text-right text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
				📜 מאמר מחכמי העדה
			</h4>
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
	<header class="text-right mb-5">
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
			<h4 class="text-lg md:text-xl font-extrabold text-gray-900">שאלה - {recentQa.asker}</h4>
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
					יש לך שאלה בהלכה, במוסר, בהבנת התורה, בחינוך, בשלום בית וכולי - פנה אל החכמים ותענה בהקדם האפשרי
				</p>
			</div>
		</a>
	</article>
</section>

<section class="mb-10">
	<div class="mt-6 mb-14 flex items-center gap-3" aria-hidden="true">
		<div
			class="h-2 flex-1 bg-gradient-to-l from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
			style="clip-path: polygon(0% 0%, 0% 100%, 100% 50%);"
		></div>
		<span class="text-xl md:text-2xl text-amber-700 drop-shadow-[0_1px_1px_rgba(120,53,15,0.4)]">❦</span>
		<div
			class="h-2 flex-1 bg-gradient-to-r from-transparent via-amber-500/70 to-amber-700 shadow-[0_1px_2px_rgba(120,53,15,0.35)]"
			style="clip-path: polygon(0% 50%, 100% 0%, 100% 100%);"
		></div>
	</div>
</section>

