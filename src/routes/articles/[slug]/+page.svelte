<script lang="ts">
	import { onMount } from 'svelte';
	import { pickLang, type Article, type LocalizedString } from '$lib/data/articles';
	import { loadArticles, saveArticleEdit, type ArticleWithId } from '$lib/services/articles-service';
	import { getCurrentUser, isSuperAdmin } from '$lib/strapi';
	import Seo from '$lib/components/Seo.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { articleSchema, breadcrumbSchema } from '$lib/seo';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	let { data } = $props();
	let a = $state<ArticleWithId | null>(data.article);
	let notFound = $state(false);

	// ═══ עריכה במקום — סופר-אדמין ═══
	let canEdit = $state(false);
	let editing = $state(false);
	let editTitle = $state('');
	let editBody = $state('');
	let saving = $state(false);
	let editError = $state('');

	onMount(async () => {
		// טוענים תמיד גם מהסטראפי: גרסת סטראפי דורסת את הסטטית (ומביאה documentId לעריכה)
		try {
			const all = await loadArticles();
			const found = all.find((x) => x.slug === data.slug);
			if (found) a = found;
			else if (!a) notFound = true;
		} catch {
			if (!a) notFound = true;
		}
		try {
			canEdit = isSuperAdmin(await getCurrentUser());
		} catch {
			/* אורח — בלי עיפרון */
		}
	});

	function startEdit() {
		if (!a) return;
		const loc = (_loc as string) || 'he';
		editTitle = pickLang(a.title, loc);
		editBody = pickLang(a.body, loc);
		editError = '';
		editing = true;
	}

	async function saveEdit() {
		if (!a || saving) return;
		saving = true;
		editError = '';
		const loc = (_loc as string) || 'he';
		try {
			const updated = await saveArticleEdit(a, {
				title: { ...a.title, [loc]: editTitle } as LocalizedString,
				body: { ...a.body, [loc]: editBody } as LocalizedString
			});
			a = updated;
			editing = false;
		} catch (e) {
			editError = 'השמירה נכשלה. ' + (e instanceof Error ? e.message : '');
		} finally {
			saving = false;
		}
	}

	/* ═══ SEO ═══
	   דף מאמר הוא הדף שנתפס בגוגל לשאילתות תוכן ("שלום בית בעידן המודרני").
	   התיאור נלקח מהתקציר, וה-Article schema מאפשר הצגה עשירה וציטוט ע"י AI.
	   מאמר שלא נמצא מקבל noindex — אין טעם לאנדקס דף "לא נמצא". */
	const heTitle = $derived(a ? pickLang(a.title, 'he') : '');
	const heExcerpt = $derived(a ? pickLang(a.excerpt, 'he') : '');
	const heAuthor = $derived(a ? pickLang(a.author, 'he') : '');
	const seoTitle = $derived(
		a ? `${heTitle} — מאמר מחכמי העדה | חכמי העדה` : tFn('article_view_page_title_fallback')
	);
	const seoDescription = $derived(
		(heExcerpt || `מאמר מחכמי העדה${heAuthor ? ` מאת ${heAuthor}` : ''} — היכל הרוח, חכמי העדה.`).slice(0, 300)
	);
</script>

<Seo
	title={seoTitle}
	description={seoDescription}
	path={`/articles/${data.slug}`}
	type="article"
	noindex={!a && notFound}
	keywords={a?.tags?.length
		? a.tags.map((tag) => pickLang(tag, 'he')).join(', ')
		: 'מאמרים תורניים, היכל הרוח, חכמי העדה'}
/>
{#if a}
	<JsonLd
		data={[
			articleSchema({
				title: heTitle,
				description: seoDescription,
				path: `/articles/${data.slug}`,
				author: heAuthor,
				datePublished: a.date,
				keywords: (a.tags ?? []).map((tag) => pickLang(tag, 'he')),
				body: pickLang(a.body, 'he')
			}),
			breadcrumbSchema([
				{ name: 'חכמי העדה', path: '/' },
				{ name: 'היכל הרוח — מאמרים', path: '/articles' },
				{ name: heTitle, path: `/articles/${data.slug}` }
			])
		]}
	/>
{/if}

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

		{#if !editing}
			<div class="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg whitespace-pre-line">
				{pickLang(a.body, _loc as string)}
			</div>

			{#if canEdit}
				<div class="mt-6">
					<button
						type="button"
						onclick={startEdit}
						title="עריכת המאמר"
						aria-label="עריכת המאמר"
						class="text-lg opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
					>✏️</button>
				</div>
			{/if}
		{:else}
			<div class="rounded-xl border border-blue-400/40 bg-blue-500/5 p-4 space-y-3">
				<div>
					<label class="block text-sm font-bold text-gray-300 mb-1.5" for="article-edit-title">כותרת</label>
					<input
						id="article-edit-title"
						type="text"
						bind:value={editTitle}
						class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
					/>
				</div>
				<div>
					<label class="block text-sm font-bold text-gray-300 mb-1.5" for="article-edit-body">תוכן המאמר</label>
					<textarea
						id="article-edit-body"
						rows="20"
						bind:value={editBody}
						class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none leading-relaxed"
					></textarea>
				</div>
				{#if editError}
					<p class="text-sm font-bold text-red-300">{editError}</p>
				{/if}
				<div class="flex gap-2 justify-end">
					<button
						type="button"
						onclick={() => (editing = false)}
						disabled={saving}
						class="px-4 py-2 rounded-lg border border-white/20 text-gray-200 hover:bg-white/10 transition-colors disabled:opacity-60"
					>ביטול</button>
					<button
						type="button"
						onclick={saveEdit}
						disabled={saving}
						class="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors disabled:opacity-60"
					>{saving ? 'שומר…' : 'שמירה'}</button>
				</div>
			</div>
		{/if}

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
