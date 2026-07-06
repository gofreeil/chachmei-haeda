<script lang="ts">
	import { onMount } from 'svelte';
	import { articles as staticArticles, type Article } from '$lib/data/articles';
	import { latestAnswer, type QaItem } from '$lib/data/qa';
	import { latestActivity, pickLang } from '$lib/data/activity';
	import { loadArticles } from '$lib/services/articles-service';
	import { latestActivityAsync } from '$lib/services/activity-service';
	import { loadQa } from '$lib/services/qa-service';
	import { loadHomeConfig } from '$lib/services/home-config-service';
	import NewsTicker from '$lib/components/NewsTicker.svelte';
	import HeichalotGrid from '$lib/components/HeichalotGrid.svelte';
	import FancyHeading from '$lib/components/FancyHeading.svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};

	let recentQa = $state<QaItem>(latestAnswer());
	let recentActivity = $state(latestActivity());

	let allArticles = $state<Article[]>(staticArticles);
	const DEFAULT_HOME_VIDEO = 'https://youtu.be/9ioV_PeaqWE?si=WN00o8ByG65ZOvQ4';
	let homeVideoUrl = $state<string>(DEFAULT_HOME_VIDEO);
	let homeVideoTitle = $state<string>('');

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

	onMount(async () => {
		try {
			const savedVid = localStorage.getItem('chachmei-home-video-url');
			if (savedVid !== null) homeVideoUrl = savedVid;
			const savedTitle = localStorage.getItem('chachmei-home-video-title');
			if (savedTitle !== null) homeVideoTitle = savedTitle;
		} catch {}
		try {
			const [arts, act, qa, cfg] = await Promise.all([
				loadArticles(),
				latestActivityAsync(),
				loadQa(),
				loadHomeConfig()
			]);
			if (arts.length) allArticles = arts;
			if (act) recentActivity = act;
			// השאלה-תשובה האחרונה עם מענה מהבאקאנד
			const answered = qa.filter((q) => q.answerDate && q.answer?.he);
			if (answered.length) {
				recentQa = [...answered].sort((a, b) => b.answerDate.localeCompare(a.answerDate))[0];
			}
			if (cfg.homeVideoUrl) homeVideoUrl = cfg.homeVideoUrl;
			if (cfg.homeVideoTitle) homeVideoTitle = cfg.homeVideoTitle;
		} catch {}
	});

	let latestArticle = $derived(
		[...allArticles].sort((a, b) => b.date.localeCompare(a.date))[0]
	);

</script>

<svelte:head>
	<title>{tFn('home_page_title')}</title>
</svelte:head>

<section class="pt-4 pb-10 text-center">
	<h2 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl sm:text-4xl md:text-5xl font-black text-transparent inline-block pb-1">
		{tFn('home_welcome_title')}
	</h2>
	<a href="/about/revenue" class="block group hover:opacity-90 transition-opacity" aria-label={tFn('home_read_more_about_us_aria')}>
		<div class="mt-2 md:mt-6 flex justify-center">
			<div class="h-40 w-40 md:h-56 md:w-56 rounded-full overflow-hidden flex-shrink-0 shadow-xl ring-2 ring-purple-500/30 group-hover:ring-blue-500/60 group-hover:scale-[1.02] transition-all">
				<img
					src="/images/chachmei-logo.png"
					alt={tFn('home_logo_alt')}
					class="w-full h-full object-contain scale-[1.15]"
					style="image-rendering: -webkit-optimize-contrast;"
				/>
			</div>
		</div>
		<p class="mt-3 text-gray-800 text-base md:text-lg font-bold max-w-2xl mx-auto group-hover:underline decoration-blue-400/60 underline-offset-4">
			{tFn('home_welcome_desc_prefix')}<span class="text-blue-700 font-black">{tFn('home_welcome_desc_emphasis')}</span>{tFn('home_welcome_desc_suffix')}
		</p>
		<p class="mt-2 text-sm text-blue-700 font-bold opacity-80 group-hover:opacity-100">{tFn('home_read_more_about_us_link')}</p>
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
	<header class="text-center mb-8">
		<FancyHeading noLine>
			<h3 class="text-xl sm:text-2xl md:text-4xl font-black bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent whitespace-nowrap inline-block pb-1">
				{tFn('home_news_section_title')}
			</h3>
		</FancyHeading>
		<p class="mt-2 text-base md:text-lg font-black text-amber-900 drop-shadow-[0_1px_1px_rgba(120,53,15,0.25)]">
			{tFn('home_news_section_subtitle')}
		</p>
		<div class="mt-2 mx-auto h-0.5 w-80 md:w-[28rem] bg-gradient-to-r from-transparent via-amber-700 to-transparent" aria-hidden="true"></div>
	</header>

	<div class="mt-10">
		<NewsTicker />
	</div>

	{#if recentActivity}
		<article
			class="mt-8 rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/10 p-3 md:p-8 shadow-[0_0_30px_rgba(217,119,6,0.12)]"
		>
			<div class="flex items-center justify-between gap-3 flex-wrap mb-3">
				<div class="text-right">
					<div class="flex items-center gap-2 flex-wrap">
						<span class="text-xs text-gray-400">{tFn('home_uploaded_on')} {recentActivity.date} · {tFn('home_by_author')} {pickLang(recentActivity.author, _loc)}</span>
					</div>
				</div>
			</div>
			<h2 class="text-2xl md:text-3xl font-black text-amber-900 leading-tight mb-3 drop-shadow-[0_1px_1px_rgba(120,53,15,0.2)] text-center">
				{pickLang(recentActivity.title, _loc)}
			</h2>
			{#if recentActivity.videoUrl || recentActivity.imageUrl}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-start mb-3">
					<div class="md:order-1">
						<p class="text-gray-800 leading-snug text-base md:text-lg font-medium">{pickLang(recentActivity.excerpt, _loc)}</p>
					</div>
					<div class="md:order-2">
						{#if recentActivity.imageUrl}
							<div class="rounded-xl overflow-hidden border border-amber-300/40 bg-black/20">
								<img src={recentActivity.imageUrl} alt={pickLang(recentActivity.title, _loc)} class="w-full h-auto max-h-[320px] object-contain mx-auto" />
							</div>
						{/if}
						{#if recentActivity.videoUrl}
							<div class="rounded-xl overflow-hidden border border-amber-300/40 aspect-video bg-black">
								<iframe
									src={recentActivity.videoUrl}
									title={pickLang(recentActivity.title, _loc)}
									class="w-full h-full"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowfullscreen
								></iframe>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<p class="text-gray-800 leading-snug text-base md:text-lg font-medium">{pickLang(recentActivity.excerpt, _loc)}</p>
			{/if}
			{#if recentActivity.tags && recentActivity.tags.length > 0}
				<div class="mt-4 pt-3 border-t border-amber-300/30 flex flex-wrap gap-1.5">
					{#each recentActivity.tags as tag}
						<a
							href="/heichal-hamaaseh/activity?q={encodeURIComponent(pickLang(tag, _loc))}"
							class="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-900 text-[11px] font-medium hover:bg-amber-500/25 hover:border-amber-400/50 transition-colors"
						>
							#{pickLang(tag, _loc)}
						</a>
					{/each}
				</div>
			{/if}
		</article>
		<div class="mt-4 text-left">
			<a
				href="/heichal-hamaaseh/activity"
				class="text-sm font-bold text-amber-700 hover:text-amber-900 transition-colors"
			>
				{tFn('home_all_activities_link')}
			</a>
		</div>
	{/if}
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
			<FancyHeading>
				<a href="/articles" class="inline-block transition-transform hover:scale-105">
					<h3 class="text-2xl sm:text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap inline-block pb-1">
						{tFn('home_heichal_haruach_title')}
					</h3>
				</a>
			</FancyHeading>
			<h4 class="mt-6 text-right text-lg md:text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent pr-3 md:pr-0">
				{tFn('home_article_from_sages')}
			</h4>
		</header>
		<article
			class="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 md:p-8 shadow-[0_0_30px_rgba(59,130,246,0.10)]"
		>
			<div class="flex items-center justify-between gap-3 flex-wrap mb-3">
				<div class="text-right">
					<div class="flex items-center gap-2 flex-wrap">
						<span class="text-xs text-gray-400">{tFn('home_uploaded_on')} {latestArticle.date} · {tFn('home_by_author')} {pickLang(latestArticle.author, _loc)}</span>
					</div>
				</div>
			</div>
			<h2 class="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
				{pickLang(latestArticle.title, _loc)}
			</h2>
			<p class="text-sm text-blue-300 mb-2">{tFn('home_by_author_colon')} {pickLang(latestArticle.author, _loc)}</p>
			<p class="text-gray-200 leading-snug text-base md:text-lg">{pickLang(latestArticle.excerpt, _loc)}</p>
		</article>
	</section>
{/if}

<section class="mb-10">
	<header class="text-right mb-5">
		<h3 class="text-lg md:text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent pr-3 md:pr-0">
			{tFn('home_qa_section_title')}
		</h3>
		<p class="mt-2 text-gray-700 text-xs md:text-base font-bold pr-3 md:pr-0">{tFn('home_qa_section_subtitle')}</p>
	</header>
	<article class="rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 p-5 md:p-7 shadow-[0_0_25px_rgba(99,102,241,0.12)]">
		<div class="flex items-baseline gap-3 flex-wrap mb-2">
			<h4 class="text-lg md:text-xl font-extrabold text-gray-900">{tFn('home_question_label')} - {pickLang(recentQa.asker, _loc)}</h4>
			<span class="text-xs font-bold text-gray-600">· {tFn('home_published_on')} {recentQa.answerDate.split('-').reverse().join('.')}</span>
		</div>
		<p class="text-gray-800 leading-relaxed mb-4 line-clamp-3">{pickLang(recentQa.question, _loc)}</p>
		<div class="border-t border-indigo-300/40 pt-4">
			<h5 class="text-sm font-black text-indigo-700 mb-2">
				{tFn('home_answer_by')} {pickLang(recentQa.answeredBy, _loc)}
			</h5>
			<p class="text-gray-900 leading-relaxed font-medium line-clamp-4">{pickLang(recentQa.answer, _loc)}</p>
		</div>
	</article>
	<div class="mt-4 text-left">
		<a
			href="/qa"
			class="text-sm font-bold text-indigo-700 hover:text-indigo-900 transition-colors"
		>
			{tFn('home_all_qa_link')}
		</a>
	</div>
</section>

<section class="mb-10">
	<a
		href="/ask"
		class="ask-cta flex items-center justify-center gap-3 rounded-2xl border-2 p-4 md:p-5 transition-all group"
	>
		<img
			src="/images/1124a5ea-412c-4c49-8d76-e4366711384d.jfif"
			alt={tFn('home_logo_alt')}
			class="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 object-cover rounded-full ring-2 ring-white/80 shadow-lg"
		/>
		<div class="text-center min-w-0">
			<h3 class="ask-cta-title text-base md:text-lg font-black leading-tight">
				{tFn('home_ask_cta_title')}
			</h3>
			<p class="ask-cta-text text-xs md:text-sm font-bold leading-snug">
				{tFn('home_ask_cta_text')}
			</p>
		</div>
	</a>
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

<style>
	:global(.ask-cta) {
		background-image: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%) !important;
		border-color: #c7d2fe !important;
		box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.45), 0 4px 10px -4px rgba(79, 70, 229, 0.35) !important;
	}
	:global(.ask-cta:hover) {
		background-image: linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #1d4ed8 100%) !important;
		box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.6), 0 6px 12px -4px rgba(79, 70, 229, 0.5) !important;
		transform: scale(1.02);
	}
	:global(.ask-cta .ask-cta-title),
	:global(.ask-cta .ask-cta-text) {
		color: #ffffff !important;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
		-webkit-text-fill-color: #ffffff !important;
		background: none !important;
	}
	:global(.ask-cta .ask-cta-emoji) {
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
	}
</style>

