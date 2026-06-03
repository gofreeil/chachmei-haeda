<script lang="ts">
	import { onMount } from 'svelte';
	import { activity as staticActivity, type ActivityKind, type ActivityItem } from '$lib/data/activity';
	import FancyHeading from '$lib/components/FancyHeading.svelte';

	const ACTIVITY_KEY = 'chachmei-custom-activity';

	let filter = $state<'הכל' | ActivityKind>('הכל');
	let customActivity = $state<ActivityItem[]>([]);

	// טופס "יש לך ידיעה?"
	let tipOpen = $state(false);
	let tipName = $state('');
	let tipTitle = $state('');
	let tipContent = $state('');
	let tipContact = $state('');

	function handleTipSubmit(e: Event) {
		e.preventDefault();
		const subject = `ידיעה לחכמי העדה - ${tipTitle}`;
		const body = `שם השולח: ${tipName}\nכותרת: ${tipTitle}\nפרטים לחזרה: ${tipContact}\n\nתוכן הידיעה:\n${tipContent}`;
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
	});

	const allItems = $derived([...customActivity, ...staticActivity]);

	const filtered = $derived(
		filter === 'הכל' ? allItems : allItems.filter((a) => a.kind === filter)
	);

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
</script>

<svelte:head>
	<title>היכל המעשה - חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<header class="text-center mb-8">
		<FancyHeading>
			<h1 class="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-3xl md:text-4xl font-black text-transparent whitespace-nowrap">
				היכל המעשה
			</h1>
		</FancyHeading>
		<p class="mt-3 text-gray-300 max-w-2xl mx-auto">
			סרטונים, מאמרים והודעות שחכמי בית הדין מפרסמים
		</p>
	</header>

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
					יש לך ידיעה עבור חכמי העדה? צור קשר
				</h3>
				<p class="tip-cta-text text-xs md:text-sm font-bold leading-snug mt-1">
					שלח לנו פרטים והחכמים יחזרו אליך בהקדם
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
						<label class="block text-sm font-bold text-amber-900 mb-1.5" for="tip-name">שם</label>
						<input
							id="tip-name"
							type="text"
							bind:value={tipName}
							required
							placeholder="שמך המלא"
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-amber-400/50 text-gray-900 placeholder-gray-500 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-colors"
						/>
					</div>
					<div>
						<label class="block text-sm font-bold text-amber-900 mb-1.5" for="tip-contact">פרטים לחזרה</label>
						<input
							id="tip-contact"
							type="text"
							bind:value={tipContact}
							required
							placeholder="טלפון או דוא״ל"
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-amber-400/50 text-gray-900 placeholder-gray-500 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-colors"
						/>
					</div>
					<div class="md:col-span-2">
						<label class="block text-sm font-bold text-amber-900 mb-1.5" for="tip-title">כותרת הידיעה</label>
						<input
							id="tip-title"
							type="text"
							bind:value={tipTitle}
							required
							placeholder="במשפט אחד - על מה הידיעה"
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-amber-400/50 text-gray-900 placeholder-gray-500 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-colors"
						/>
					</div>
					<div class="md:col-span-2">
						<label class="block text-sm font-bold text-amber-900 mb-1.5" for="tip-content">תוכן הידיעה</label>
						<textarea
							id="tip-content"
							bind:value={tipContent}
							required
							rows="5"
							placeholder="פרט את הידיעה - מה קרה, מתי, היכן, מי המעורבים..."
							class="w-full px-3 py-2.5 rounded-lg bg-white/70 border border-amber-400/50 text-gray-900 placeholder-gray-500 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-colors resize-y"
						></textarea>
					</div>
					<div class="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3">
						<p class="text-xs text-amber-900 max-w-md font-medium">
							הידיעה תישלח במייל לבית הדין. נחזור אליך לפי הפרטים שמסרת.
						</p>
						<button
							type="submit"
							class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(217,119,6,0.5)] transition-all whitespace-nowrap"
							style="color:#fff !important; -webkit-text-fill-color:#fff !important;"
						>
							📨 שלח את הידיעה
						</button>
					</div>
				</form>
			</div>
		{/if}
	</div>

	<div class="flex flex-wrap gap-2 justify-center mb-6">
		{#each ['הכל', 'סרטון', 'מאמר', 'הודעה', 'כתבה'] as f}
			<button
				type="button"
				onclick={() => (filter = f as typeof filter)}
				class="px-4 py-1.5 rounded-full text-sm font-bold border transition-colors {filter === f
					? 'bg-indigo-500/40 border-indigo-300 text-white'
					: 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'}"
			>
				{f}
			</button>
		{/each}
	</div>

	<div class="space-y-4">
		{#each filtered as a (a.slug)}
			{@const hasMedia = !!(a.videoUrl || a.imageUrl)}
			<article
				class="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4 md:p-5"
			>
				<!-- שורה עליונה: סוג ותאריך מימין, מחבר משמאל -->
				<div class="flex items-start justify-between gap-3 flex-wrap mb-3">
					<div class="flex items-center gap-2">
						<span
							class="text-[11px] font-bold px-2 py-0.5 rounded-full border {kindStyles[a.kind]}"
						>
							{kindIcons[a.kind]} {a.kind}
						</span>
						<span class="text-[11px] text-gray-500">{a.date}</span>
					</div>
					<span class="text-xs text-indigo-300">מאת: {a.author}</span>
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
							🔗 לכתבה המלאה
						</a>
					</div>
				{/if}
			</article>
		{/each}
	</div>

	{#if filtered.length === 0}
		<p class="text-center text-gray-400 py-12">אין פריטים בקטגוריה זו</p>
	{/if}
</section>

<style>
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
