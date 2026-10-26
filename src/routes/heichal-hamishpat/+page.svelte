<script lang="ts">
	import PageTextEditor from '$lib/components/PageTextEditor.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import LiveCalendar from '$lib/components/LiveCalendar.svelte';
	import FancyHeading from '$lib/components/FancyHeading.svelte';
	import RequestHearingForm from '$lib/components/RequestHearingForm.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { serviceSchema, breadcrumbSchema } from '$lib/seo';
	import { getJwt } from '$lib/strapi';
	import {
		fetchRoomBoard,
		fetchCaseMeetEntry,
		setCaseMeet,
		openGeneralRoom,
		enterGeneralRoom,
		joinInviteRoom,
		meetPagePath,
		type RoomBoard,
		type CaseMeetEntry
	} from '$lib/services/hearings-service';

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

	// ───────────── חדר הדיון הוירטואלי (איתניום) ─────────────
	// בית הדין: לוח כל התיקים — פתיחת חדר נכנסת אליו מיד, כאן. צד בתיק: מצב
	// התיקים שלו וכניסה כשהחדר פתוח. מי שלא מחובר / בלי תיקים: ההדגמה.
	// ?room=<תיק> (מדף התיק, מהפרופיל, מההודעה) נכנס ישר לחדר של אותו תיק.
	const ROOMS_PREVIEW = 6;
	let board = $state<RoomBoard | null>(null);
	let boardLoading = $state(false);
	let showAllRooms = $state(false);
	let rowBusy = $state('');
	let boardError = $state('');
	const shownRooms = $derived(board ? (showAllRooms ? board.cases : board.cases.slice(0, ROOMS_PREVIEW)) : []);
	let room = $state<CaseMeetEntry | null>(null);
	let roomCaseId = $state('');
	let roomBusy = $state(false);
	let roomError = $state('');
	let roomNeedLogin = $state(false);

	function scrollToRoom() {
		requestAnimationFrame(() => {
			const el = document.getElementById('virtual-room');
			if (!el) return;
			const header = document.querySelector('.site-header') as HTMLElement | null;
			const headerH = header?.getBoundingClientRect().height ?? 0;
			window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerH - 8, behavior: 'smooth' });
		});
	}

	async function enterRoom(load: () => Promise<CaseMeetEntry>, caseId = '') {
		roomCaseId = caseId;
		roomBusy = true;
		roomError = '';
		roomNeedLogin = false;
		try {
			room = await load();
		} catch (e) {
			const err = e as { status?: number; serverMessage?: string };
			roomNeedLogin = err.status === 401;
			roomError = err.serverMessage || tFn('case_meet_error');
		} finally {
			roomBusy = false;
			scrollToRoom();
		}
	}

	const joinRoom = (caseId: string) => enterRoom(() => fetchCaseMeetEntry(caseId), caseId);

	// ───── "חדר כללי" (לא קשור לתיק) — בית הדין שומר בדפדפן את הכניסה ואת ההזמנה ─────
	const GENERAL_KEY = 'ch-general-room';
	const GENERAL_TTL_MS = 28 * 60 * 60 * 1000;
	type GeneralRoom = { hostToken: string; inviteUrl: string; openedAt: string };
	let general = $state<GeneralRoom | null>(null);
	let inviteCopied = $state(false);
	const generalSince = $derived(
		general ? new Date(general.openedAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : ''
	);
	const inviteWhatsapp = $derived(
		general ? `https://wa.me/?text=${encodeURIComponent(`${tFn('mishpat_room_invite_text')} ${general.inviteUrl}`)}` : ''
	);

	function saveGeneral(g: GeneralRoom | null) {
		general = g;
		try {
			if (g) localStorage.setItem(GENERAL_KEY, JSON.stringify(g));
			else localStorage.removeItem(GENERAL_KEY);
		} catch {
			/* מצב פרטי — החדר פשוט לא נזכר אחרי רענון */
		}
	}

	function restoreGeneral() {
		try {
			const g = JSON.parse(localStorage.getItem(GENERAL_KEY) || 'null') as GeneralRoom | null;
			if (g?.hostToken && Date.now() - Date.parse(g.openedAt) < GENERAL_TTL_MS) general = g;
			else localStorage.removeItem(GENERAL_KEY);
		} catch {
			/* ignore */
		}
	}

	async function openGeneral() {
		rowBusy = 'general';
		boardError = '';
		try {
			const r = await openGeneralRoom();
			saveGeneral({ hostToken: r.hostToken, inviteUrl: r.inviteUrl, openedAt: r.openedAt });
			roomCaseId = '';
			room = r.entry;
			scrollToRoom();
		} catch (e) {
			boardError = (e as { serverMessage?: string })?.serverMessage || tFn('case_meet_error');
		} finally {
			rowBusy = '';
		}
	}

	async function enterGeneral() {
		const g = general;
		if (!g) return;
		await enterRoom(() => enterGeneralRoom(g.hostToken));
		if (!room) saveGeneral(null); // פג / לא תקין — מסירים מהלוח
	}

	function closeGeneral() {
		saveGeneral(null);
		if (room && !room.caseRef) room = null;
	}

	async function copyInvite() {
		if (!general) return;
		try {
			await navigator.clipboard.writeText(general.inviteUrl);
			inviteCopied = true;
			setTimeout(() => (inviteCopied = false), 2000);
		} catch {
			window.prompt('', general.inviteUrl);
		}
	}

	async function loadBoard() {
		if (!getJwt()) return;
		boardLoading = true;
		try {
			board = await fetchRoomBoard();
		} catch {
			board = null;
		} finally {
			boardLoading = false;
		}
	}

	/** בית הדין: פותח את החדר ונכנס אליו מיד, באותו מקום */
	async function openAndEnter(caseId: string) {
		rowBusy = caseId;
		boardError = '';
		try {
			await setCaseMeet(caseId, 'open');
			await joinRoom(caseId);
			loadBoard();
		} catch (e) {
			boardError = (e as { serverMessage?: string })?.serverMessage || tFn('case_meet_error');
		} finally {
			rowBusy = '';
		}
	}

	async function closeRoom(caseId: string) {
		rowBusy = caseId;
		boardError = '';
		try {
			await setCaseMeet(caseId, 'close');
			if (roomCaseId === caseId) room = null;
			await loadBoard();
		} catch (e) {
			boardError = (e as { serverMessage?: string })?.serverMessage || tFn('case_meet_error');
		} finally {
			rowBusy = '';
		}
	}

	function leaveRoom() {
		room = null;
		loadBoard();
	}

	onMount(() => {
		const roomId = page.url.searchParams.get('room');
		const invite = page.url.searchParams.get('invite');
		if (roomId) joinRoom(roomId);
		else if (invite) enterRoom(() => joinInviteRoom(invite));
		restoreGeneral();
		loadBoard();
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

<!-- כל תגי ה-SEO (כולל canonical, OG ו-Twitter) יוצאים מרכיב <Seo> אחד,
     כדי שלא ייווצרו תגים כפולים ושהכתובת הקנונית תמיד תהיה נכונה. -->
<Seo
	title={tFn('mishpat_page_title')}
	description={tFn('mishpat_page_description')}
	path="/heichal-hamishpat"
	keywords="היכל המשפט, בוררות, דין תורה, פסקי דין, בקשה לדיון, פסק בורר, בית דין לממונות"
/>
<JsonLd data={[serviceSchema(), breadcrumbSchema([{ name: 'חכמי העדה', path: '/' }, { name: 'היכל המשפט', path: '/heichal-hamishpat' }])]} />

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
						href="/heichal-hamaaseh/ethical-code#join"
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

	<section id="virtual-room" class="mb-8">
		<header class="text-center mb-5">
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
				{tFn('mishpat_virtual_room_title')}
			</h2>
			<p class="mt-2 text-gray-700 text-sm md:text-base font-bold">{tFn('mishpat_virtual_room_subtitle')}</p>
		</header>

		{#if roomError}
			<div class="max-w-4xl mx-auto mb-3 rounded-xl border border-red-400/40 bg-red-500/5 p-3 text-center">
				<p class="text-red-700 text-sm">{roomError}</p>
				{#if roomNeedLogin}
					<a
						href="/login?returnTo={encodeURIComponent(meetPagePath(roomCaseId))}"
						class="inline-block mt-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:opacity-90"
					>
						{tFn('case_meet_login')}
					</a>
				{/if}
			</div>
		{/if}

		<!-- המסגרת של החדר קבועה: ריקה כשאין דיון פעיל, והמשתתפים האמיתיים בתוכה כשיש.
		     welcome-dark — מחזיר טקסט בהיר על המשטח הכהה מול המרת הקרם הגלובלית -->
		<div class="welcome-dark relative rounded-2xl border-4 border-gray-800 bg-gradient-to-br from-gray-900 to-slate-900 p-3 md:p-5 shadow-2xl max-w-4xl mx-auto">
			{#if room}
				<iframe
					src={room.url}
					title={tFn('mishpat_virtual_room_title')}
					allow="camera; microphone; display-capture; fullscreen; autoplay; clipboard-write; screen-wake-lock"
					allowfullscreen
					class="block w-full aspect-video min-h-[420px] rounded-xl bg-black ring-2 ring-purple-400/40 mb-3 md:mb-4"
				></iframe>
			{:else}
				<!-- חלון וידאו ראשי + סייד-בר — מקומות פנויים עד שהדיון נפתח -->
				<div class="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
					<div class="md:col-span-3 relative aspect-video rounded-xl bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center overflow-hidden ring-2 ring-purple-400/40">
						<div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.3) 0%, transparent 50%);"></div>
						<div class="text-center relative z-10 px-4">
							<div class="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/5 flex items-center justify-center text-5xl md:text-6xl mx-auto mb-2 ring-4 ring-white/10 opacity-60">
								🎥
							</div>
							<p class="text-white font-bold text-sm md:text-base">{roomBusy ? tFn('case_meet_loading') : tFn('mishpat_room_empty')}</p>
							<p class="text-purple-200 text-xs md:text-sm">{tFn('mishpat_room_empty_sub')}</p>
						</div>
					</div>
					<div class="grid grid-cols-4 md:grid-cols-1 gap-2">
						{#each [
							{ label: 'mishpat_room_seat_beit_din', icon: '👨‍⚖️', cls: 'from-blue-900 to-cyan-900 ring-blue-400/30' },
							{ label: 'mishpat_room_seat_beit_din', icon: '👨‍⚖️', cls: 'from-emerald-900 to-teal-900 ring-emerald-400/30' },
							{ label: 'mishpat_party_plaintiff', icon: '🧑', cls: 'from-amber-900 to-orange-900 ring-amber-400/30' },
							{ label: 'mishpat_party_defendant', icon: '🧑', cls: 'from-rose-900 to-pink-900 ring-rose-400/30' }
						] as seat}
							<div class="relative aspect-video rounded-lg bg-gradient-to-br {seat.cls} flex items-center justify-center ring-1">
								<span class="text-3xl md:text-4xl opacity-25 grayscale">{seat.icon}</span>
								<div class="absolute bottom-1 right-1 left-1 text-center">
									<p class="text-gray-200 text-[10px] md:text-xs font-bold truncate">{tFn(seat.label)}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- בר בקרה — בחדר פעיל: מסך מלא (יציאה לאיתניום באותה לשונית) ויציאה -->
			<div class="flex items-center justify-between gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10">
				<div class="text-white text-xs md:text-sm font-bold truncate min-w-0">
					<span class="text-gray-200">{tFn('mishpat_case_label')}</span>
					{room ? (room.caseRef ? `#${room.caseRef} · ${room.nickname}` : tFn('mishpat_room_general')) : '—'}
				</div>
				<div class="flex items-center gap-2 md:gap-3 shrink-0">
					{#if room}
						{#if !room.caseRef && room.role === 'host' && general}
							<button type="button" onclick={copyInvite} title={tFn('mishpat_room_invite_copy')} aria-label={tFn('mishpat_room_invite_copy')} class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center text-lg md:text-xl">
								{inviteCopied ? '✓' : '🔗'}
							</button>
						{/if}
						<!-- באותה לשונית: החדר המוטמע נסגר ונכנסים לאיתניום פעם אחת, בלי משתתף כפול -->
						<a href={room.url} title={tFn('case_meet_fullscreen')} aria-label={tFn('case_meet_fullscreen')} class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center text-lg md:text-xl">⛶</a>
						<button type="button" onclick={leaveRoom} title={tFn('case_meet_leave')} aria-label={tFn('case_meet_leave')} class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-lg md:text-xl">📞</button>
					{:else}
						<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label={tFn('mishpat_aria_mute_mic')}>🎤</button>
						<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label={tFn('mishpat_aria_disable_camera')}>📹</button>
						<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label={tFn('mishpat_aria_share_screen')}>🖥️</button>
						<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label={tFn('mishpat_aria_end_call')}>📞</button>
					{/if}
				</div>
			</div>
{#if !room && board && (board.host || board.cases.length > 0)}
			<!-- לוח החדרים — בתוך המסגרת, מתחת לבר הבקרה: בית הדין פותח/נכנס/סוגר, צד רואה את התיקים שלו -->
			<div class="mt-3 md:mt-4 rounded-xl border border-white/10 bg-black/30 p-2 md:p-3">
				<div class="flex items-center justify-between gap-2 mb-2 flex-wrap">
					<h3 class="font-black text-indigo-200">{board.host ? tFn('mishpat_rooms_admin_title') : tFn('mishpat_rooms_my_title')}</h3>
					{#if board.host && board.configured === false}
						<span class="text-xs font-bold text-red-300">{tFn('case_meet_not_configured')}</span>
					{:else if board.host && !general}
						<button
							type="button"
							onclick={openGeneral}
							disabled={rowBusy !== '' || roomBusy}
							title={tFn('mishpat_room_general_hint')}
							class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-50"
						>
							{rowBusy === 'general' ? '…' : tFn('mishpat_room_general_open')}
						</button>
					{/if}
				</div>
				{#if board.host && general}
					<div class="mb-1.5 rounded-xl border border-green-500/60 bg-green-500/10 p-2.5 flex items-center justify-between gap-2 flex-wrap">
						<div class="min-w-0">
							<p class="font-bold text-white truncate">{tFn('mishpat_room_general')}</p>
							<p class="text-xs font-bold text-green-300">🟢 {tFn('case_meet_open_since').replace('{time}', generalSince)}</p>
						</div>
						<div class="flex items-center gap-2 shrink-0 flex-wrap">
							<button
								type="button"
								onclick={enterGeneral}
								disabled={roomBusy}
								class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-50"
							>
								{tFn('case_meet_enter_host')}
							</button>
							<button type="button" onclick={copyInvite} class="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-300 text-xs font-bold">
								{inviteCopied ? tFn('mishpat_room_invite_copied') : tFn('mishpat_room_invite_copy')}
							</button>
							<button type="button" onclick={closeGeneral} class="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold">
								{tFn('case_meet_close_btn')}
							</button>
						</div>
					</div>
				{/if}
				{#if board.cases.length === 0}
					<p class="text-sm text-gray-300 text-center py-1">{tFn('mishpat_rooms_none_admin')}</p>
				{/if}
				<div class="space-y-1.5">
					{#each shownRooms as c (c.id)}
						<div class="rounded-xl border p-2.5 flex items-center justify-between gap-2 flex-wrap {c.open ? 'border-green-500/60 bg-green-500/10' : 'border-amber-400/40 bg-white/5'}">
							<div class="min-w-0">
								<p class="font-bold text-white truncate">#{c.caseRef} · {c.nickname}</p>
								<p class="text-xs text-gray-300 truncate">
									{c.plaintiffName} ⚖️ {c.defendantName} · 📅 {c.proposedDate} ·
									<span class="font-bold {c.open ? 'text-green-300' : c.approved ? 'text-indigo-300' : 'text-amber-300'}">
										{c.open ? `🟢 ${tFn('mishpat_room_live_now')}` : c.approved ? tFn('mishpat_room_status_approved') : tFn('mishpat_room_status_pending')}
									</span>
								</p>
							</div>
							<div class="flex items-center gap-2 shrink-0">
								{#if c.open}
									<button
										type="button"
										onclick={() => joinRoom(c.id)}
										disabled={roomBusy || rowBusy !== ''}
										class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-50"
									>
										{board.host ? tFn('case_meet_enter_host') : tFn('case_meet_join')}
									</button>
									{#if board.host}
										<button
											type="button"
											onclick={() => closeRoom(c.id)}
											disabled={rowBusy !== ''}
											class="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold disabled:opacity-50"
										>
											{rowBusy === c.id ? '…' : tFn('case_meet_close_btn')}
										</button>
									{/if}
								{:else if board.host}
									<button
										type="button"
										onclick={() => openAndEnter(c.id)}
										disabled={rowBusy !== '' || roomBusy || board.configured === false}
										class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-50"
									>
										{rowBusy === c.id ? '…' : tFn('case_meet_open_btn')}
									</button>
								{:else}
									<span class="text-xs text-gray-300">{tFn('mishpat_room_party_wait')}</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
				{#if board.cases.length > ROOMS_PREVIEW && !showAllRooms}
					<button type="button" onclick={() => (showAllRooms = true)} class="mt-2 text-sm font-bold text-indigo-300 hover:underline">
						{tFn('mishpat_rooms_show_all').replace('{n}', String(board.cases.length))}
					</button>
				{/if}
				{#if boardError}
					<p class="mt-2 text-sm text-red-300 text-center">{boardError}</p>
				{/if}
			</div>
{:else if !room && boardLoading}
			<p class="text-center text-gray-300 text-sm mt-3">{tFn('mishpat_rooms_loading')}</p>
{/if}
		</div>

		{#if room}
			<p class="text-xs text-gray-600 mt-1 text-center">{tFn('case_meet_hint')}</p>
			{#if !room.caseRef && room.role === 'host' && general}
				<p class="mt-1 text-xs text-center">
					<span class="text-gray-700">{tFn('mishpat_room_general_hint')}</span>
					<a href={inviteWhatsapp} target="_blank" rel="noopener" class="font-bold text-green-700 hover:underline">{tFn('mishpat_room_invite_whatsapp')}</a>
				</p>
			{/if}
{/if}

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

<PageTextEditor prefixes={['mishpat_']} />