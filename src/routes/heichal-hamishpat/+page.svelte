<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import LiveCalendar from '$lib/components/LiveCalendar.svelte';
	import FancyHeading from '$lib/components/FancyHeading.svelte';
	import RequestHearingForm from '$lib/components/RequestHearingForm.svelte';

	// tFn: reactive translation helper - $t forbidden in Svelte 5
	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	let isRegistered = $state(false);
	let userName = $state('');

	// ───────────── Modal: בקשת דיון ─────────────
	let showRequestModal = $state(false);
	function openRequestModal() {
		showRequestModal = true;
		if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
	}
	function closeRequestModal() {
		showRequestModal = false;
		if (typeof document !== 'undefined') document.body.style.overflow = '';
	}
	$effect(() => {
		if (page.url.searchParams.get('open') === 'request-hearing') {
			openRequestModal();
		}
	});

	type CaseStatus = 'active' | 'completed' | 'pending';
	type CaseFile = {
		id: string;
		caseNameKey: string;
		roleKey: string;
		status: CaseStatus;
		hearingDate: string;
		summaryKey: string;
		videoUrl: string | null;
		rulingUrl: string | null;
	};

	const myCases: CaseFile[] = [
		{
			id: 'TIK-2026-014',
			caseNameKey: 'mishpat_case1_name',
			roleKey: 'mishpat_role_plaintiff',
			status: 'completed',
			hearingDate: '2026-05-12',
			summaryKey: 'mishpat_case1_summary',
			videoUrl: '#video-tik-014',
			rulingUrl: '#ruling-tik-014'
		},
		{
			id: 'TIK-2026-022',
			caseNameKey: 'mishpat_case2_name',
			roleKey: 'mishpat_role_petitioner',
			status: 'pending',
			hearingDate: '2026-06-18',
			summaryKey: 'mishpat_case2_summary',
			videoUrl: null,
			rulingUrl: null
		}
	];

	onMount(() => {
		try {
			const user = JSON.parse(localStorage.getItem('chachmei-user') || 'null');
			if (user) {
				isRegistered = true;
				userName = user.name || user.nickname || tFn('mishpat_default_username');
			}
		} catch {
			/* ignore */
		}
	});

	function statusColor(s: CaseStatus): string {
		if (s === 'active') return 'bg-blue-500/80 text-white';
		if (s === 'completed') return 'bg-green-600/80 text-white';
		return 'bg-amber-500/80 text-white';
	}

	function statusLabel(s: CaseStatus): string {
		if (s === 'active') return tFn('mishpat_status_active');
		if (s === 'completed') return tFn('mishpat_status_completed');
		return tFn('mishpat_status_pending');
	}

	function slowScrollTo(e: MouseEvent, targetId: string) {
		e.preventDefault();
		const target = document.getElementById(targetId);
		if (!target) return;
		const header = document.querySelector('.site-header') as HTMLElement | null;
		const headerH = header?.getBoundingClientRect().height ?? 0;
		const targetY = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
		const startY = window.scrollY;
		const distance = targetY - startY;
		const duration = 2400;
		const startTime = performance.now();
		function easeInOutCubic(t: number) {
			return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
		}
		function step(now: number) {
			const elapsed = now - startTime;
			const t = Math.min(elapsed / duration, 1);
			window.scrollTo(0, startY + distance * easeInOutCubic(t));
			if (t < 1) requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	}

	const rulingSteps = [
		{
			num: 1,
			icon: '✍️',
			titleKey: 'mishpat_step1_title',
			descKey: 'mishpat_step1_desc'
		},
		{
			num: 2,
			icon: '📅',
			titleKey: 'mishpat_step2_title',
			descKey: 'mishpat_step2_desc'
		},
		{
			num: 3,
			icon: '⚖️',
			titleKey: 'mishpat_step3_title',
			descKey: 'mishpat_step3_desc'
		},
		{
			num: 4,
			icon: '🕊️',
			titleKey: 'mishpat_step4_title',
			descKey: 'mishpat_step4_desc'
		}
	];
</script>

<svelte:head>
	<title>{tFn('mishpat_page_title')}</title>
	<meta name="description" content={tFn('mishpat_page_description')} />

	<!-- Open Graph / WhatsApp / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={tFn('mishpat_page_title')} />
	<meta property="og:description" content={tFn('mishpat_og_description')} />
	<meta property="og:image" content="https://chachmim.vercel.app/og-image.jpg?v=2" />
	<meta property="og:image:secure_url" content="https://chachmim.vercel.app/og-image.jpg?v=2" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="600" />
	<meta property="og:image:height" content="600" />
	<meta property="og:image:alt" content={tFn('mishpat_og_image_alt')} />
	<meta property="og:url" content="https://chachmim.vercel.app/heichal-hamishpat" />
	<meta property="og:site_name" content={tFn('mishpat_site_name')} />
	<meta property="og:locale" content="he_IL" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={tFn('mishpat_page_title')} />
	<meta name="twitter:description" content={tFn('mishpat_twitter_description')} />
	<meta name="twitter:image" content="https://chachmim.vercel.app/og-image.jpg?v=2" />
</svelte:head>

<section class="py-8">
	<header class="text-center mb-6">
		<div class="text-5xl mb-3">🏛️</div>
		<FancyHeading>
			<h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
				{tFn('mishpat_hero_title')}
			</h1>
		</FancyHeading>
		<p class="mt-3 text-gray-700 text-base md:text-lg font-bold max-w-2xl mx-auto">
			{tFn('mishpat_hero_subtitle')}
		</p>
	</header>

	<section class="mb-8">
		<header class="text-center mb-5">
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
				{tFn('mishpat_steps_section_title')}
			</h2>
			<p class="mt-2 text-gray-600 text-sm md:text-base font-bold">{tFn('mishpat_steps_section_subtitle')}</p>
		</header>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
			{#each rulingSteps as step}
				{#if step.num === 1}
					<a
						href="/heichal-hamaaseh/charter-join"
						class="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 text-right block hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all cursor-pointer"
					>
						<div class="absolute top-4 right-4 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
							{step.num}
						</div>
						<div class="text-4xl mb-3 mr-14">{step.icon}</div>
						<h3 class="text-lg md:text-xl font-bold text-white mb-2">{tFn(step.titleKey)}</h3>
						<p class="text-sm text-gray-300 leading-relaxed">{tFn(step.descKey)}</p>
					</a>
				{:else if step.num === 2}
					<a
						href="#calendar-section"
						onclick={(e) => slowScrollTo(e, 'calendar-section')}
						class="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 text-right block hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all cursor-pointer"
					>
						<div class="absolute top-4 right-4 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
							{step.num}
						</div>
						<div class="text-4xl mb-3 mr-14">{step.icon}</div>
						<h3 class="text-lg md:text-xl font-bold text-white mb-2">{tFn(step.titleKey)}</h3>
						<p class="text-sm text-gray-300 leading-relaxed">{tFn(step.descKey)}</p>
					</a>
				{:else if step.num === 4}
					<a
						href="#my-cases"
						onclick={(e) => slowScrollTo(e, 'my-cases')}
						class="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 text-right block hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all cursor-pointer"
					>
						<div class="absolute top-4 right-4 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
							{step.num}
						</div>
						<div class="text-4xl mb-3 mr-14">{step.icon}</div>
						<h3 class="text-lg md:text-xl font-bold text-white mb-2">{tFn(step.titleKey)}</h3>
						<p class="text-sm text-gray-300 leading-relaxed">{tFn(step.descKey)}</p>
					</a>
				{:else}
					<div class="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 text-right">
						<div class="absolute top-4 right-4 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
							{step.num}
						</div>
						<div class="text-4xl mb-3 mr-14">{step.icon}</div>
						<h3 class="text-lg md:text-xl font-bold text-white mb-2">{tFn(step.titleKey)}</h3>
						<p class="text-sm text-gray-300 leading-relaxed">{tFn(step.descKey)}</p>
					</div>
				{/if}
			{/each}
		</div>
	</section>

	<div class="my-8 flex items-center gap-3" aria-hidden="true">
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

	<section class="mb-8">
		<header class="text-center mb-5">
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
				{tFn('mishpat_virtual_room_title')}
			</h2>
			<p class="mt-2 text-gray-700 text-sm md:text-base font-bold">{tFn('mishpat_virtual_room_subtitle')}</p>
		</header>

		<div class="relative rounded-2xl border-4 border-gray-800 bg-gradient-to-br from-gray-900 to-slate-900 p-3 md:p-5 shadow-2xl max-w-4xl mx-auto">
			<!-- חלון וידאו ראשי + סייד-בר -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
				<!-- משתתף ראשי -->
				<div class="md:col-span-3 relative aspect-video rounded-xl bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center overflow-hidden ring-2 ring-purple-400/40">
					<div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.3) 0%, transparent 50%);"></div>
					<div class="text-center relative z-10">
						<div class="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-5xl md:text-6xl mx-auto mb-2 shadow-2xl ring-4 ring-white/30">
							👨‍⚖️
						</div>
						<p class="text-white font-bold text-sm md:text-base">{tFn('mishpat_judge_main_name')}</p>
						<p class="text-purple-200 text-xs md:text-sm">{tFn('mishpat_judge_main_role')}</p>
					</div>
					<!-- אינדיקטור מדבר -->
					<div class="absolute top-3 right-3 flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/90 backdrop-blur-sm">
						<span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
						<span class="text-white text-xs font-bold">{tFn('mishpat_speaking_indicator')}</span>
					</div>
					<!-- אינדיקטור הקלטה -->
					<div class="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-full bg-red-600/90 backdrop-blur-sm">
						<span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
						<span class="text-white text-xs font-bold">REC</span>
					</div>
				</div>

				<!-- 4 משתתפים בצד -->
				<div class="grid grid-cols-4 md:grid-cols-1 gap-2">
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-blue-900 to-cyan-900 flex items-center justify-center ring-1 ring-blue-400/30">
						<span class="text-3xl md:text-4xl">👨‍⚖️</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">{tFn('mishpat_judge2_name')}</p>
						</div>
					</div>
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-emerald-900 to-teal-900 flex items-center justify-center ring-1 ring-emerald-400/30">
						<span class="text-3xl md:text-4xl">👨‍⚖️</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">{tFn('mishpat_judge3_name')}</p>
						</div>
					</div>
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-amber-900 to-orange-900 flex items-center justify-center ring-1 ring-amber-400/30">
						<span class="text-3xl md:text-4xl">🧑</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">{tFn('mishpat_party_plaintiff')}</p>
						</div>
					</div>
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-rose-900 to-pink-900 flex items-center justify-center ring-1 ring-rose-400/30">
						<span class="text-3xl md:text-4xl">🧑</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">{tFn('mishpat_party_defendant')}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- בר בקרה -->
			<div class="flex items-center justify-between gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10">
				<div class="text-white text-xs md:text-sm font-bold">
					<span class="text-gray-400">{tFn('mishpat_case_label')}</span> {tFn('mishpat_case_title_demo')}
				</div>
				<div class="flex items-center gap-2 md:gap-3">
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label={tFn('mishpat_aria_mute_mic')}>🎤</button>
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label={tFn('mishpat_aria_disable_camera')}>📹</button>
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label={tFn('mishpat_aria_share_screen')}>🖥️</button>
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label={tFn('mishpat_aria_end_call')}>📞</button>
				</div>
			</div>
		</div>

		<p class="mt-4 text-center text-gray-700 text-xs md:text-sm font-bold">
			{tFn('mishpat_recording_notice')}
		</p>
	</section>

	<div class="mb-8 rounded-2xl border-2 border-purple-400/40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-5 md:p-6 text-center">
		<p class="text-gray-800 text-base md:text-lg font-bold mb-3">
			{tFn('mishpat_ready_to_open_text')}
		</p>
		<button
			type="button"
			onclick={openRequestModal}
			class="inline-block px-7 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all"
		>
			{tFn('mishpat_open_hearing_btn')}
		</button>
	</div>

	<div class="my-8 flex items-center gap-3" aria-hidden="true">
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

	<section id="calendar-section" class="mb-8">
		<header class="text-center mb-5">
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
				{tFn('mishpat_calendar_title')}
			</h2>
			<p class="mt-2 text-gray-600 text-sm md:text-base font-bold">{tFn('mishpat_calendar_subtitle')}</p>
		</header>
		<LiveCalendar />
	</section>

	<!-- ───────────── התיקים שלי + ארכיון וידאו ───────────── -->
	<section id="my-cases" class="mb-8">
		<div class="rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 shadow-[0_0_25px_rgba(99,102,241,0.12)] {isRegistered ? 'p-5 md:p-7' : 'p-4 md:p-5'}">
			{#if isRegistered}
				<header class="flex items-end justify-between gap-3 flex-wrap mb-5">
					<div class="text-right">
						<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
							{tFn('mishpat_my_cases_title')}
						</h2>
						<p class="mt-1 text-gray-700 text-sm md:text-base font-bold">
							{tFn('mishpat_greeting_prefix')} {userName} {tFn('mishpat_greeting_suffix')}
						</p>
					</div>
					<a href="/profile" class="text-sm font-bold text-indigo-700 hover:text-indigo-900 transition-colors">
						{tFn('mishpat_to_full_profile_area')}
					</a>
				</header>

				<div class="space-y-4">
					{#each myCases as c}
						<article class="rounded-xl border border-indigo-400/30 bg-white/5 p-4 md:p-5">
							<div class="flex items-center justify-between gap-3 flex-wrap mb-3">
								<div class="flex items-center gap-2 flex-wrap">
									<span class="px-2.5 py-1 rounded-full text-xs font-black {statusColor(c.status)}">{statusLabel(c.status)}</span>
									<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-700/70 text-white">{c.id}</span>
									<span class="text-xs font-bold text-gray-700">{tFn('mishpat_your_role_label')} {tFn(c.roleKey)}</span>
								</div>
								<span class="text-xs font-bold text-gray-700">📅 {c.hearingDate}</span>
							</div>
							<h3 class="text-base md:text-lg font-extrabold text-gray-900 mb-2">{tFn(c.caseNameKey)}</h3>
							<p class="text-sm text-gray-800 leading-relaxed mb-4">{tFn(c.summaryKey)}</p>
							<div class="flex flex-wrap gap-2">
								{#if c.videoUrl}
									<a href={c.videoUrl} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold hover:scale-105 transition-transform shadow">
										{tFn('mishpat_watch_recording_btn')}
									</a>
								{:else}
									<span class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm font-bold cursor-not-allowed">
										{tFn('mishpat_recording_pending_btn')}
									</span>
								{/if}
								{#if c.rulingUrl}
									<a href={c.rulingUrl} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold hover:scale-105 transition-transform shadow">
										{tFn('mishpat_signed_ruling_btn')}
									</a>
								{:else}
									<span class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm font-bold cursor-not-allowed">
										{tFn('mishpat_ruling_pending_btn')}
									</span>
								{/if}
							</div>
						</article>
					{/each}

					{#if myCases.length === 0}
						<p class="text-center text-gray-600 py-6">{tFn('mishpat_no_active_cases')} <button type="button" onclick={openRequestModal} class="text-indigo-700 font-bold underline">{tFn('mishpat_open_new_case_link')}</button></p>
					{/if}
				</div>
			{:else}
				<header class="flex items-center gap-3 mb-3">
					<div class="text-3xl flex-shrink-0">🔒</div>
					<div class="min-w-0">
						<h2 class="text-lg md:text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent leading-tight">
							{tFn('mishpat_locked_my_cases_title')}
						</h2>
						<p class="text-xs md:text-sm text-gray-700 font-bold leading-snug">
							{tFn('mishpat_locked_my_cases_subtitle')}
						</p>
					</div>
				</header>

				<!-- Blurred preview - compact -->
				<div class="relative mb-3">
					<div class="space-y-2 pointer-events-none select-none blur-[5px] opacity-55" aria-hidden="true">
						{#each myCases.slice(0, 2) as c}
							<div class="rounded-lg border border-indigo-400/30 bg-white/10 p-2.5">
								<div class="flex items-center justify-between gap-2 mb-1">
									<span class="px-2 py-0.5 rounded-full text-[10px] font-black {statusColor(c.status)}">{statusLabel(c.status)}</span>
									<span class="text-[10px] font-bold text-gray-700">{c.hearingDate}</span>
								</div>
								<h3 class="text-sm font-extrabold text-gray-900 line-clamp-1">{tFn(c.caseNameKey)}</h3>
								<p class="text-xs text-gray-800 line-clamp-1">{tFn(c.summaryKey)}</p>
							</div>
						{/each}
					</div>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/40 border border-yellow-500/70 text-yellow-900 text-xs md:text-sm font-black shadow">
							{tFn('mishpat_content_restricted_notice')}
						</div>
					</div>
				</div>

				<div class="flex flex-col sm:flex-row gap-2 justify-center">
					<a
						href="/profile"
						class="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-sm md:text-base hover:scale-105 transition-transform shadow text-center"
					>
						{tFn('mishpat_register_create_account_btn')}
					</a>
					<button
						type="button"
						onclick={openRequestModal}
						class="inline-block px-5 py-2 rounded-xl bg-white/10 border border-indigo-400/40 text-gray-900 font-bold text-sm md:text-base hover:bg-white/20 transition-colors text-center"
					>
						{tFn('mishpat_open_new_case_btn')}
					</button>
				</div>
			{/if}
		</div>
	</section>
</section>

<!-- ───────── Modal: בקשת דיון ───────── -->
{#if showRequestModal}
	<div
		class="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center p-3 md:p-6 overflow-y-auto"
		onclick={(e) => { if (e.target === e.currentTarget) closeRequestModal(); }}
		role="dialog"
		aria-modal="true"
	>
		<div class="w-full max-w-3xl rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-[#f8eecb] via-[#f0e3b8] to-[#e8d8a8] shadow-2xl p-4 md:p-6 my-4">
			<RequestHearingForm onClose={closeRequestModal} />
		</div>
	</div>
{/if}
