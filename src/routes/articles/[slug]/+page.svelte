<script lang="ts">
	import { onMount } from 'svelte';
	import { pickLang, type Article } from '$lib/data/articles';
	import { loadArticles } from '$lib/services/articles-service';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	let { data } = $props();
	let a = $state<Article | null>(data.article);
	let notFound = $state(false);

	onMount(async () => {
		if (a) return;
		try {
			const all = await loadArticles();
			const found = all.find((x) => x.slug === data.slug);
			if (found) a = found;
			else notFound = true;
		} catch {
			notFound = true;
		}
	});
</script>

<svelte:head>
	<title>{a ? pickLang(a.title, _loc as string) : tFn('article_view_page_title_fallback')} - {tFn('article_view_site_name')}</title>
</svelte:head>

<article class="py-8 max-w-3xl mx-auto">
	<a href="/articles" class="text-blue-300 hover:text-blue-200 text-sm">← {tFn('article_view_back_to_archive')}</a>

	{#if a}
		<header class="mt-4 mb-8">
			<h1 class="text-3xl md:text-4xl font-black text-white leading-tight">{pickLang(a.title, _loc as string)}</h1>
			<div class="mt-3 text-sm text-gray-400">
				{tFn('article_view_by_author')} <span class="text-blue-300">{pickLang(a.author, _loc as string)}</span> • {a.date}
			</div>
			{#if a.tags && a.tags.length > 0}
				<div class="mt-3 flex flex-wrap gap-1.5">
					{#each a.tags as tag}
						{@const tagText = pickLang(tag, _loc as string)}
						<a
							href="/articles?q=%23{encodeURIComponent(tagText)}"
							class="px-2 py-0.5 rounded-full bg-blue-500/25 border border-blue-400/40 text-blue-100 text-xs font-bold hover:bg-blue-500/40 transition-colors"
						>
							#{tagText}
						</a>
					{/each}
				</div>
			{/if}
		</header>

		<div class="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg whitespace-pre-line">
			{pickLang(a.body, _loc as string)}
		</div>

	{:else if notFound}
		<div class="mt-8 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6 text-center">
			<div class="text-4xl mb-2">📭</div>
			<p class="text-yellow-200 font-bold">{tFn('article_view_not_found_title')}</p>
			<p class="text-sm text-gray-400 mt-2">{tFn('article_view_not_found_desc')}</p>
		</div>
	{:else}
		<div class="mt-8 text-center text-gray-400 text-sm">{tFn('article_view_loading')}</div>
	{/if}
</article>
