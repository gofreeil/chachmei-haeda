<script lang="ts">
	import { onMount } from 'svelte';
	import { activity as staticActivity, type ActivityKind, type ActivityItem } from '$lib/data/activity';
	import HeichalHeader from '$lib/components/HeichalHeader.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k);
	};

	const ACTIVITY_KEY = 'chachmei-custom-activity';
	const PAGE_SIZE = 8;

	let searchQuery = $state('');
	let customActivity = $state<ActivityItem[]>([]);
	let currentPage = $state(1);

	// טופס "פדיון קרקעות"
	let landOpen = $state(false);
	let landName = $state('');
	let landContact = $state('');
	let landAssetType = $state('קרקע');
	let landLocation = $state('');
	let landDetails = $state('');

	function handleLandSubmit(e: Event) {
		e.preventDefault();
		const subject = `${tFn('activity_email_land_subject_prefix')} - ${landAssetType} ${tFn('activity_email_land_subject_in')}${landLocation}`;
		const body = `${tFn('activity_email_label_name')}: ${landName}\n${tFn('activity_email_label_contact')}: ${landContact}\n${tFn('activity_email_label_asset_type')}: ${landAssetType}\n${tFn('activity_email_label_location')}: ${landLocation}\n\n${tFn('activity_email_label_more_details')}:\n${landDetails}`;
		window.location.href = `mailto:freedomhasbegun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	}

	// טופס "עזרה וליווי לגיור"
	let convOpen = $state(false);
	let convName = $state('');
	let convContact = $state('');
	let convStatus = $state('');
	let convDetails = $state('');

	function handleConvSubmit(e: Event) {
		e.preventDefault();
		const subject = `${tFn('activity_email_conv_subject_prefix')} - ${convName}`;
		const body = `${tFn('activity_email_label_sender_name')}: ${convName}\n${tFn('activity_email_label_contact')}: ${convContact}\n${tFn('activity_email_label_current_status')}: ${convStatus}\n\n${tFn('activity_email_label_how_to_help')}:\n${convDetails}`;
		window.location.href = `mailto:freedomhasbegun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	}

	// טופס "יש לך ידיעה?"
	let tipOpen = $state(false);
	let tipName = $state('');
	let tipTitle = $state('');
	let tipContent = $state('');
	let tipContact = $state('');

	function handleTipSubmit(e: Event) {
		e.preventDefault();
		const subject = `${tFn('activity_email_tip_subject_prefix')} - ${tipTitle}`;
		const body = `${tFn('activity_email_label_sender_name')}: ${tipName}\n${tFn('activity_email_label_title')}: ${tipTitle}\n${tFn('activity_email_label_contact')}: ${tipContact}\n\n${tFn('activity_email_label_tip_content')}:\n${tipContent}`;
		window.location.href = `mailto:freedomhasbegun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	}

	onMount(() => {
		try {
			const raw = localStorage.getItem(ACTIVITY_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) customActivity = parsed;
			}
		} catch {}
		// אם הגיעו עם ?q=... מקישור לתגית - אכלוס שדה החיפוש
		try {
			const params = new URLSearchParams(window.location.search);
			const q = params.get('q');
			if (q) searchQuery = q;
		} catch {}
	});

	const allItems = $derived([...customActivity, ...staticActivity]);

	const filtered = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return allItems;
		return allItems.filter((a) => {
			const tagsStr = (a.tags ?? []).join(' ');
			const hay = `${a.title} ${a.excerpt ?? ''} ${a.body ?? ''} ${a.author ?? ''} ${a.kind} ${tagsStr}`.toLowerCase();
			return hay.includes(q);
		});
	});

	// pagination
	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
	const currentPageSafe = $derived(Math.min(currentPage, totalPages));
	const pagedItems = $derived(
		filtered.slice((currentPageSafe - 1) * PAGE_SIZE, currentPageSafe * PAGE_SIZE)
	);

	// איפוס לעמוד 1 כשהחיפוש משתנה
	$effect(() => {
		searchQuery;
		currentPage = 1;
	});

	const kindStyles: Record<ActivityKind, string> = {
		'סרטון': 'bg-red-500/15 border-red-400/40 text-red-200',
		'מאמר': 'bg-blue-500/15 border-blue-400/40 text-blue-200',
		'הודעה': 'bg-amber-500/15 border-amber-400/40 text-amber-200',
		'כתבה': 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
	};
	const kindIcons: Record<ActivityKind, string> = {
		'סרטון': '🎬',
		'מאמר': '📝',
		'הודעה': '📣',
		'כתבה': '📰'
	};
	const kindLabelKeys: Record<ActivityKind, string> = {
		'סרטון': 'activity_kind_video',
		'מאמר': 'activity_kind_article',
		'הודעה': 'activity_kind_announcement',
		'כתבה': 'activity_kind_press'
	};
</script>

<svelte:head>
	<title>{tFn('activity_page_title')}</title>
</svelte:head>

<section class="py-8">
	<HeichalHeader subtitle={tFn('activity_header_subtitle')} />

	<div class="mb-6 max-w-2xl mx-auto">
		<div class="relative">
			<span class="absolute inset-y-0 right-3 flex items-center text-indigo-700 text-lg pointer-events-none" aria-hidden="true">🔍</span>
			<input
				type="search"
				bind:value={searchQuery}
				placeholder={tFn('activity_search_placeholder')}
				aria-label={tFn('activity_search_aria_label')}
				class="w-full pr-10 pl-10 py-2.5 rounded-full bg-white/80 border-2 border-indigo-300/60 text-gray-900 placeholder-gray-500 font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition-colors shadow-sm"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => (searchQuery = '')}
					aria-label={tFn('activity_search_clear_aria')}
					class="absolute inset-y-0 left-2 flex items-center justify-center w-7 h-full text-gray-600 hover:text-gray-900"
				>
					✕
				</button>
			{/if}
		</div>
		{#if searchQuery}
			<p class="mt-2 text-xs text-center text-gray-700 font-medium">
				{tFn('activity_search_results_found')} {filtered.length} {tFn('activity_search_results_for')} "{searchQuery}"
			</p>
		{/if}
	</div>

	<div class="space-y-4">
		{#each pagedItems as a (a.slug)}
			{@const hasMedia = !!(a.videoUrl || a.imageUrl)}
			<article
				class="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4 md:p-5"
			>
				<!-- שורה עליונה: סוג ותאריך מימין, מחבר משמאל -->
				<div class="flex items-start justify-between gap-3 flex-wrap mb-3">
					<div class="flex items-center gap-2">
						{#if a.kind !== 'כתבה'}
							<span
								class="text-[11px] font-bold px-2 py-0.5 rounded-full border {kindStyles[a.kind]}"
							>
								{kindIcons[a.kind]} {tFn(kindLabelKeys[a.kind])}
							</span>
						{/if}
						<span class="text-[11px] text-gray-500">{a.date}</span>
					</div>
					<span class="text-xs text-indigo-300">{tFn('activity_by_author')}: {a.author}</span>
				</div>

				<!-- כותרת ממורכזת -->
				<h2 class="text-base md:text-lg font-bold text-white text-center mb-6 md:mb-8">{a.title}</h2>

				<!-- תוכן: טקסט מימין, מדיה משמאל -->
				{#if hasMedia}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-start">
						<!-- ימין: טקסט -->
						<div class="space-y-3 md:order-1">
							<p class="text-sm text-gray-300 leading-relaxed">{a.excerpt}</p>
							{#if a.body}
								<p class="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{a.body}</p>
							{/if}
						</div>

						<!-- שמאל: מדיה -->
						<div class="space-y-3 md:order-2">
							{#if a.imageUrl}
								<div class="rounded-xl overflow-hidden border border-white/10 bg-black/30">
									<img src={a.imageUrl} alt={a.title} class="w-full h-auto max-h-[480px] object-contain mx-auto" />
								</div>
							{/if}
							{#if a.videoUrl}
								<div class="rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
									<iframe
										src={a.videoUrl}
										title={a.title}
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
					<!-- ללא מדיה: טקסט בלבד -->
					<p class="text-sm text-gray-300 leading-relaxed">{a.excerpt}</p>
					{#if a.body}
						<p class="mt-3 text-sm text-gray-200 leading-relaxed whitespace-pre-line">{a.body}</p>
					{/if}
				{/if}

				<!-- קישור למקור מתחת להכל -->
				{#if a.sourceUrl}
					<div class="mt-5 pt-4 border-t border-white/10 text-center">
						<a
							href={a.sourceUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-block text-xs text-indigo-300 hover:text-indigo-200 underline break-all"
						>
							🔗 {tFn('activity_full_article_link')}
						</a>
					</div>
				{/if}

				<!-- תגים -->
				{#if a.tags && a.tags.length > 0}
					<div class="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
						{#each a.tags as tag}
							<button
								type="button"
								onclick={() => (searchQuery = tag)}
								class="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-gray-300 text-[11px] font-medium hover:bg-white/15 hover:border-white/25 transition-colors"
							>
								#{tag}
							</button>
						{/each}
					</div>
				{/if}
			</article>
		{/each}
	</div>

	{#if filtered.length === 0}
		<p class="text-center text-gray-700 py-12 font-medium">
			{searchQuery ? `${tFn('activity_no_results_for')} "${searchQuery}"` : tFn('activity_no_items')}
		</p>
	{:else}
		<Pagination
			currentPage={currentPageSafe}
			totalPages={totalPages}
			color="indigo"
			onPageChange={(p) => (currentPage = p)}
		/>
	{/if}

	<!-- קו הפרדה מעל הבאנרים החדשים -->
	<div class="mt-10 mb-14 flex items-center gap-3 max-w-3xl mx-auto" aria-hidden="true">
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

	<!-- כותרת קבוצת הבאנרים -->
	<h2 class="text-center text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 bg-clip-text text-transparent mb-4 mt-4">
		{tFn('activity_contact_us')}
	</h2>

	<!-- באנר "יש לך ידיעה?" -->
	<div class="mb-8 max-w-3xl mx-auto">
		<button
			type="button"
			onclick={() => (tipOpen = !tipOpen)}
			class="tip-cta w-full flex items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all"
			aria-expanded={tipOpen}
			aria-controls="tip-form"
		>
			<div class="text-3xl md:text-4xl flex-shrink-0 tip-cta-emoji">📨</div>
			<div class="text-center min-w-0">
				<h3 class="tip-cta-title text-lg md:text-xl font-black leading-tight">
					{tFn('activity_tip_cta_title')}
				</h3>
				<p class="tip-cta-text text-xs md:text-sm font-bold leading-snug mt-1">
					{tFn('activity_tip_cta_text')}
				</p>
			</div>
			<div class="text-2xl flex-shrink-0 tip-cta-arrow" aria-hidden="true">
				{tipOpen ? '▲' : '▼'}
			</div>
		</button>

		{#if tipOpen}
			<div
				id="tip-form"
				class="mt-3 rounded-2xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-100/90 via-orange-100/85 to-amber-100/90 p-5 md:p-6 shadow-[0_8px_25px_rgba(180,83,9,0.25)]"
			>
				<form onsubmit={handleTipSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-bold text-amber-900 mb-1.5" for="tip-name">{tFn('activity_form_label_name')}</label>
						<input
							id="tip-name"
							type="text"
							bind:value={tipName}
							required
							placeholder={tFn('activity_form_placeholder_full_name')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-amber-400/50 text-gray-900 placeholder-gray-500 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-colors"
						/>
					</div>
					<div>
						<label class="block text-sm font-bold text-amber-900 mb-1.5" for="tip-contact">{tFn('activity_form_label_contact')}</label>
						<input
							id="tip-contact"
							type="text"
							bind:value={tipContact}
							required
							placeholder={tFn('activity_form_placeholder_phone_email')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-amber-400/50 text-gray-900 placeholder-gray-500 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-colors"
						/>
					</div>
					<div class="md:col-span-2">
						<label class="block text-sm font-bold text-amber-900 mb-1.5" for="tip-title">{tFn('activity_form_label_tip_title')}</label>
						<input
							id="tip-title"
							type="text"
							bind:value={tipTitle}
							required
							placeholder={tFn('activity_form_placeholder_tip_title')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-amber-400/50 text-gray-900 placeholder-gray-500 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-colors"
						/>
					</div>
					<div class="md:col-span-2">
						<label class="block text-sm font-bold text-amber-900 mb-1.5" for="tip-content">{tFn('activity_form_label_tip_content')}</label>
						<textarea
							id="tip-content"
							bind:value={tipContent}
							required
							rows="5"
							placeholder={tFn('activity_form_placeholder_tip_content')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-amber-400/50 text-gray-900 placeholder-gray-500 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-colors resize-y"
						></textarea>
					</div>
					<div class="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3">
						<p class="text-xs text-amber-900 max-w-md font-medium">
							{tFn('activity_tip_form_disclaimer')}
						</p>
						<button
							type="submit"
							class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(217,119,6,0.5)] transition-all whitespace-nowrap"
							style="color:#fff !important; -webkit-text-fill-color:#fff !important;"
						>
							📨 {tFn('activity_tip_submit_btn')}
						</button>
					</div>
				</form>
			</div>
		{/if}
	</div>

	<!-- באנר "עזרה וליווי לגיור" -->
	<div class="mb-4 max-w-3xl mx-auto">
		<button
			type="button"
			onclick={() => (convOpen = !convOpen)}
			class="conv-cta w-full flex items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all"
			aria-expanded={convOpen}
			aria-controls="conv-form"
		>
			<div class="text-3xl md:text-4xl flex-shrink-0 conv-cta-emoji">✡️</div>
			<div class="text-center min-w-0">
				<h3 class="conv-cta-title text-lg md:text-xl font-black leading-tight">
					{tFn('activity_conv_cta_title')}
				</h3>
				<p class="conv-cta-text text-xs md:text-sm font-bold leading-snug mt-1">
					{tFn('activity_conv_cta_text')}
				</p>
			</div>
			<div class="text-2xl flex-shrink-0 conv-cta-arrow" aria-hidden="true">
				{convOpen ? '▲' : '▼'}
			</div>
		</button>

		{#if convOpen}
			<div
				id="conv-form"
				class="mt-3 rounded-2xl border-2 border-sky-400/60 bg-gradient-to-br from-sky-100/90 via-blue-100/85 to-sky-100/90 p-5 md:p-6 shadow-[0_8px_25px_rgba(2,132,199,0.25)]"
			>
				<form onsubmit={handleConvSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-bold text-sky-900 mb-1.5" for="conv-name">{tFn('activity_form_label_name')}</label>
						<input
							id="conv-name"
							type="text"
							bind:value={convName}
							required
							placeholder={tFn('activity_form_placeholder_full_name')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-sky-400/50 text-gray-900 placeholder-gray-500 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600 transition-colors"
						/>
					</div>
					<div>
						<label class="block text-sm font-bold text-sky-900 mb-1.5" for="conv-contact">{tFn('activity_form_label_contact')}</label>
						<input
							id="conv-contact"
							type="text"
							bind:value={convContact}
							required
							placeholder={tFn('activity_form_placeholder_phone_email')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-sky-400/50 text-gray-900 placeholder-gray-500 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600 transition-colors"
						/>
					</div>
					<div class="md:col-span-2">
						<label class="block text-sm font-bold text-sky-900 mb-1.5" for="conv-status">{tFn('activity_form_label_conv_status')}</label>
						<input
							id="conv-status"
							type="text"
							bind:value={convStatus}
							placeholder={tFn('activity_form_placeholder_conv_status')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-sky-400/50 text-gray-900 placeholder-gray-500 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600 transition-colors"
						/>
					</div>
					<div class="md:col-span-2">
						<label class="block text-sm font-bold text-sky-900 mb-1.5" for="conv-details">{tFn('activity_form_label_conv_details')}</label>
						<textarea
							id="conv-details"
							bind:value={convDetails}
							required
							rows="5"
							placeholder={tFn('activity_form_placeholder_conv_details')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-sky-400/50 text-gray-900 placeholder-gray-500 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600 transition-colors resize-y"
						></textarea>
					</div>
					<div class="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3">
						<p class="text-xs text-sky-900 max-w-md font-medium">
							{tFn('activity_conv_form_disclaimer')}
						</p>
						<button
							type="submit"
							class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(2,132,199,0.5)] transition-all whitespace-nowrap"
							style="color:#fff !important; -webkit-text-fill-color:#fff !important;"
						>
							✡️ {tFn('activity_conv_submit_btn')}
						</button>
					</div>
				</form>
			</div>
		{/if}
	</div>

	<!-- באנר "פדיון קרקעות" -->
	<div class="mb-4 max-w-3xl mx-auto">
		<button
			type="button"
			onclick={() => (landOpen = !landOpen)}
			class="land-cta w-full flex items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all"
			aria-expanded={landOpen}
			aria-controls="land-form"
		>
			<div class="text-3xl md:text-4xl flex-shrink-0 land-cta-emoji">🌳</div>
			<div class="text-center min-w-0">
				<h3 class="land-cta-title text-lg md:text-xl font-black leading-tight">
					{tFn('activity_land_cta_title')}
				</h3>
				<p class="land-cta-text text-xs md:text-sm font-bold leading-snug mt-1">
					{tFn('activity_land_cta_text')}
				</p>
			</div>
			<div class="text-2xl flex-shrink-0 land-cta-arrow" aria-hidden="true">
				{landOpen ? '▲' : '▼'}
			</div>
		</button>

		{#if landOpen}
			<div
				id="land-form"
				class="mt-3 rounded-2xl border-2 border-emerald-400/60 bg-gradient-to-br from-emerald-100/90 via-green-100/85 to-emerald-100/90 p-5 md:p-6 shadow-[0_8px_25px_rgba(5,150,105,0.25)]"
			>
				<form onsubmit={handleLandSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-bold text-emerald-900 mb-1.5" for="land-name">{tFn('activity_form_label_name')}</label>
						<input
							id="land-name"
							type="text"
							bind:value={landName}
							required
							placeholder={tFn('activity_form_placeholder_full_name')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-emerald-400/50 text-gray-900 placeholder-gray-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors"
						/>
					</div>
					<div>
						<label class="block text-sm font-bold text-emerald-900 mb-1.5" for="land-contact">{tFn('activity_form_label_contact')}</label>
						<input
							id="land-contact"
							type="text"
							bind:value={landContact}
							required
							placeholder={tFn('activity_form_placeholder_phone_email')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-emerald-400/50 text-gray-900 placeholder-gray-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors"
						/>
					</div>
					<div>
						<label class="block text-sm font-bold text-emerald-900 mb-1.5" for="land-asset-type">{tFn('activity_form_label_asset_type')}</label>
						<select
							id="land-asset-type"
							bind:value={landAssetType}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-emerald-400/50 text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors"
						>
							<option value="קרקע">{tFn('activity_asset_type_land')}</option>
							<option value="דירה">{tFn('activity_asset_type_apartment')}</option>
							<option value="בית">{tFn('activity_asset_type_house')}</option>
							<option value="מסחרי">{tFn('activity_asset_type_commercial')}</option>
							<option value="אחר">{tFn('activity_asset_type_other')}</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-bold text-emerald-900 mb-1.5" for="land-location">{tFn('activity_form_label_land_location')}</label>
						<input
							id="land-location"
							type="text"
							bind:value={landLocation}
							required
							placeholder={tFn('activity_form_placeholder_land_location')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-emerald-400/50 text-gray-900 placeholder-gray-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors"
						/>
					</div>
					<div class="md:col-span-2">
						<label class="block text-sm font-bold text-emerald-900 mb-1.5" for="land-details">{tFn('activity_form_label_more_details')}</label>
						<textarea
							id="land-details"
							bind:value={landDetails}
							rows="4"
							placeholder={tFn('activity_form_placeholder_land_details')}
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-emerald-400/50 text-gray-900 placeholder-gray-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors resize-y"
						></textarea>
					</div>
					<div class="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3">
						<p class="text-xs text-emerald-900 max-w-md font-medium">
							{tFn('activity_land_form_disclaimer')}
						</p>
						<button
							type="submit"
							class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 text-white font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(5,150,105,0.5)] transition-all whitespace-nowrap"
							style="color:#fff !important; -webkit-text-fill-color:#fff !important;"
						>
							🌳 {tFn('activity_land_submit_btn')}
						</button>
					</div>
				</form>
			</div>
		{/if}
	</div>

	<!-- קו הפרדה מתחת לשלושת הבאנרים -->
	<div class="mt-6 mb-14 flex items-center gap-3 max-w-3xl mx-auto" aria-hidden="true">
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
	/* === באנר "פדיון קרקעות" - ירוק === */
	:global(.land-cta) {
		background-image: linear-gradient(135deg, #047857 0%, #059669 50%, #16a34a 100%) !important;
		border-color: #bbf7d0 !important;
		box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.5), 0 4px 10px -4px rgba(22, 163, 74, 0.4) !important;
	}
	:global(.land-cta:hover) {
		background-image: linear-gradient(135deg, #065f46 0%, #047857 50%, #15803d 100%) !important;
		box-shadow: 0 15px 30px -5px rgba(5, 150, 105, 0.65), 0 6px 12px -4px rgba(22, 163, 74, 0.55) !important;
		transform: scale(1.01);
	}
	:global(.land-cta .land-cta-title),
	:global(.land-cta .land-cta-text),
	:global(.land-cta .land-cta-arrow) {
		color: #ffffff !important;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
		-webkit-text-fill-color: #ffffff !important;
		background: none !important;
	}
	:global(.land-cta .land-cta-emoji) {
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
	}

	/* === באנר "עזרה וליווי לגיור" - תכלת === */
	:global(.conv-cta) {
		background-image: linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #1d4ed8 100%) !important;
		border-color: #bae6fd !important;
		box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.5), 0 4px 10px -4px rgba(29, 78, 216, 0.4) !important;
	}
	:global(.conv-cta:hover) {
		background-image: linear-gradient(135deg, #075985 0%, #0369a1 50%, #1e40af 100%) !important;
		box-shadow: 0 15px 30px -5px rgba(2, 132, 199, 0.65), 0 6px 12px -4px rgba(29, 78, 216, 0.55) !important;
		transform: scale(1.01);
	}
	:global(.conv-cta .conv-cta-title),
	:global(.conv-cta .conv-cta-text),
	:global(.conv-cta .conv-cta-arrow) {
		color: #ffffff !important;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
		-webkit-text-fill-color: #ffffff !important;
		background: none !important;
	}
	:global(.conv-cta .conv-cta-emoji) {
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
	}

	/* === באנר "יש לך ידיעה?" - ענבר === */
	:global(.tip-cta) {
		background-image: linear-gradient(135deg, #b45309 0%, #d97706 50%, #ea580c 100%) !important;
		border-color: #fde68a !important;
		box-shadow: 0 10px 25px -5px rgba(180, 83, 9, 0.5), 0 4px 10px -4px rgba(217, 119, 6, 0.4) !important;
	}
	:global(.tip-cta:hover) {
		background-image: linear-gradient(135deg, #92400e 0%, #b45309 50%, #c2410c 100%) !important;
		box-shadow: 0 15px 30px -5px rgba(180, 83, 9, 0.65), 0 6px 12px -4px rgba(217, 119, 6, 0.55) !important;
		transform: scale(1.01);
	}
	:global(.tip-cta .tip-cta-title),
	:global(.tip-cta .tip-cta-text),
	:global(.tip-cta .tip-cta-arrow) {
		color: #ffffff !important;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
		-webkit-text-fill-color: #ffffff !important;
		background: none !important;
	}
	:global(.tip-cta .tip-cta-emoji) {
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
	}
</style>
