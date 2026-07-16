<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { articles as staticArticles, type Article } from '$lib/data/articles';
	import { activity as staticActivity, type ActivityItem } from '$lib/data/activity';
	import { defaultRabbis, RABBIS_STORAGE_KEY, type Rabbi } from '$lib/data/rabbis';
	import { addArticle } from '$lib/services/articles-service';
	import { addActivity } from '$lib/services/activity-service';
	import { addNewsItem } from '$lib/services/news-service';
	import { loadRabbis, addRabbi as addRabbiToBackend } from '$lib/services/rabbis-service';
	import { loadHomeConfig, saveHomeConfig } from '$lib/services/home-config-service';
	import {
		loadEntries as loadCharterEntries,
		disqualifyEntry,
		reinstateEntry,
		updateSignatory,
		deleteEntry as deleteCharterEntry
	} from '$lib/services/charter-service';
	import {
		loadAllSubmissions,
		publishAnswer,
		markSubmissionAnswered,
		rejectSubmission,
		deleteSubmission,
		deleteQa,
		loadQa as loadQaItems,
		type QaSubmission
	} from '$lib/services/qa-service';
	import {
		loadHearings,
		loadRulings,
		loadHearingRequests,
		setRequestStatus,
		deleteHearingRequest,
		createHearing,
		updateHearing,
		deleteHearing,
		createRuling,
		deleteRuling,
		type HearingRequest
	} from '$lib/services/hearings-service';
	import { getCurrentUser, isChachmeiAdmin, isSuperAdmin, isLimitedChachmeiAdmin, strapiLogout, type StrapiUser } from '$lib/strapi';
	import { listAdmins, listCommunityUsers, listOtherUsers, setAdminRole, type AdminUser, type RegisteredUser } from '$lib/services/admin-users-service';
	import type { CharterEntry } from '$lib/data/charter';
	import type { Hearing, Ruling, HearingStatus } from '$lib/data/hearings';
	import type { QaItem } from '$lib/data/qa';

	// Admin currently enters Hebrew only - mirror it to all 3 locales as a fallback
	// until proper translation UI is added. pickLang() will fall back to .he anyway.
	const toLoc = (s: string) => ({ he: s, en: s, ru: s });

	const SESSION_KEY = 'chachmei-admin-session';
	const ARTICLES_KEY = 'chachmei-custom-articles';
	const ACTIVITY_KEY = 'chachmei-custom-activity';
	const NEWS_KEY = 'chachmei-custom-news';
	const CASES_KEY = 'chachmei-cases';
	const HOME_VIDEO_KEY = 'chachmei-home-video-url';
	const HOME_VIDEO_TITLE_KEY = 'chachmei-home-video-title';
	const DEFAULT_HOME_VIDEO_TITLE = 'חכמי עדת ישראל פועלים להעלות שבטים אבודים לארץ';

	type NewsItem = {
		id: string;
		title: string;
		summary: string;
		sourceUrl?: string;
		date: string;
	};

	let isLoggedIn = $state(false);
	let authChecking = $state(true);
	let currentUser = $state<StrapiUser | null>(null);
	type AdminTab =
		| 'articles' | 'videos' | 'news' | 'dates' | 'rabbis'
		| 'charter' | 'qa' | 'qa-submissions' | 'hearings' | 'rulings' | 'hearing-requests'
		| 'admins' | 'users';
	let activeTab = $state<AdminTab>('qa-submissions');

	// ── תפקידים: סופר-אדמין מנהל אדמינים ואת האמנה; אדמין תוכן מפרסם ישירות ──
	let isSuper = $state(false);
	let isLimited = $state(false);

	// ── ניהול אדמינים (סופר-אדמין בלבד) ──
	let adminsList = $state<AdminUser[]>([]);
	let adminSearch = $state('');
	let adminSearchResults = $state<AdminUser[]>([]);
	let adminSearching = $state(false);
	let adminsNotice = $state('');

	// ── דיאלוג אישור מעוצב (מחליף את confirm() המובנה של הדפדפן) ──
	// שימוש: if (!(await askConfirm('...'))) return;
	let confirmDialog = $state<{ message: string; resolve: (ok: boolean) => void } | null>(null);
	function askConfirm(message: string): Promise<boolean> {
		return new Promise((resolve) => (confirmDialog = { message, resolve }));
	}
	function closeConfirm(ok: boolean) {
		confirmDialog?.resolve(ok);
		confirmDialog = null;
	}

	// ── רשימת הרשומים (סופר-אדמין בלבד) ──
	// קבוצה 1: משתמשי חכמי העדה (מי שביצע פעולה באתר). קבוצה 2: שאר הרשומים —
	// נטענים רק בלחיצה על הכפתור. השיוך מבוסס-פעילות כי אתר-ההרשמה אינו נשמר.
	let communityUsers = $state<RegisteredUser[]>([]);
	let othersCount = $state(0);
	let otherUsers = $state<RegisteredUser[]>([]);
	let usersLoaded = $state(false);
	let usersLoading = $state(false);
	let othersLoaded = $state(false);
	let othersLoading = $state(false);
	let usersFilter = $state('');
	function matchUser(u: RegisteredUser, q: string): boolean {
		return [u.nickname, u.username, u.email, u.city, u.phone]
			.some((f) => (f ?? '').toLowerCase().includes(q));
	}
	// שם לתצוגה — מתעלם מ-username שנוצר אוטומטית בהתחברות חברתית (google_<sub>, facebook_<id> וכו'),
	// שהוא מזהה ארוך ולא-קריא. מעדיף כינוי, ואם ה-username הוא מזהה-ספק — מחזיר ריק (ליפול חזרה למייל).
	function friendlyName(u?: { nickname?: string | null; username?: string | null } | null): string {
		const nick = u?.nickname?.trim();
		if (nick) return nick;
		const uname = u?.username?.trim();
		if (uname && !/^(google|facebook|apple|twitter|github|line|discord)[_-]/i.test(uname)) return uname;
		return '';
	}
	const headerName = $derived(friendlyName(currentUser));
	const filteredCommunity = $derived.by(() => {
		const q = usersFilter.trim().toLowerCase();
		return q ? communityUsers.filter((u) => matchUser(u, q)) : communityUsers;
	});
	const filteredOthers = $derived.by(() => {
		const q = usersFilter.trim().toLowerCase();
		return q ? otherUsers.filter((u) => matchUser(u, q)) : otherUsers;
	});

	// ── Data state ──
	let charterEntries = $state<CharterEntry[]>([]);
	let qaItems = $state<QaItem[]>([]);
	let qaSubmissions = $state<QaSubmission[]>([]);
	let hearings = $state<Hearing[]>([]);
	let rulings = $state<Ruling[]>([]);
	let hearingRequests = $state<HearingRequest[]>([]);

	// ── Charter admin form ──
	let charterFilter = $state<'all' | 'signed' | 'disqualified'>('all');
	// איזו שורה פתחה את תפריט "עוד" (ערוך/פסול/מחק)
	let openCharterMenu = $state<string | null>(null);
	let disqualifyingId = $state<string | null>(null);
	let disqualifyReason = $state('');
	let disqualifyBy = $state('');
	// עריכת פרטי חתימה
	let editingCharterId = $state<string | null>(null);
	let editCharterName = $state('');
	let editCharterBusiness = $state('');
	let editCharterRole = $state('');
	let editCharterCity = $state('');
	let editCharterEmail = $state('');
	let editCharterPhone = $state('');
	let editCharterDate = $state('');
	let savingCharter = $state(false);

	// ── QA Submissions answering form ──
	let answeringId = $state<string | null>(null);
	let answerText = $state('');
	let answerBy = $state('');
	let answerTopicOverride = $state('');

	// ── Hearings form ──
	let hearingEditingId = $state<string | null>(null);
	let hearingCaseName = $state('');
	let hearingDayan1 = $state('');
	let hearingDayan2 = $state('');
	let hearingDayan3 = $state('');
	let hearingZoom = $state('');
	let hearingDate = $state('');
	let hearingTime = $state('');
	let hearingStatus = $state<HearingStatus>('מתוכנן');
	let hearingNotice = $state('');

	// ── Rulings form ──
	let rulingCaseRef = $state('');
	let rulingCaseName = $state('');
	let rulingDayan1 = $state('');
	let rulingDayan2 = $state('');
	let rulingDayan3 = $state('');
	let rulingDate = $state('');
	let rulingSummary = $state('');
	let rulingDecision = $state('');
	let rulingNotice = $state('');

	function fmtAny(v: any): string {
		if (!v) return '';
		if (typeof v === 'string') return v;
		return v.he ?? v.en ?? '';
	}

	let customArticles = $state<Article[]>([]);
	let customActivity = $state<ActivityItem[]>([]);
	let customNews = $state<NewsItem[]>([]);
	let pendingCases = $state<any[]>([]);
	let rabbis = $state<Rabbi[]>([...defaultRabbis]);

	// ───────────── טופס דיינים ─────────────
	let rabbiName = $state('');
	let rabbiTitle = $state('');
	let rabbiNickname = $state('');
	let rabbiCity = $state('');
	let rabbiPhotoUrl = $state('');
	let rabbiNotice = $state('');
	let editingRabbiId = $state<string | null>(null);

	// ───────────── טופס חדשות ─────────────
	let newsTitle = $state('');
	let newsSummary = $state('');
	let newsSourceUrl = $state('');
	let newsNotice = $state('');

	// ───────────── טופס מאמר ─────────────
	let artTitle = $state('');
	let artAuthor = $state('');
	let artDate = $state('');
	let artExcerpt = $state('');
	let artBody = $state('');
	let artApprover1 = $state('');
	let artApprover2 = $state('');
	let artApprover3 = $state('');
	let artTags = $state('');
	let artNotice = $state('');

	// ניתוח שורת תגיות חופשית: "#שבטאפרים #גיור" / "שבטאפרים, גיור" / "שבטאפרים גיור"
	function parseTags(raw: string): string[] {
		return raw
			.split(/[\s,،;]+/)
			.map((t) => t.trim().replace(/^#+/, '').trim())
			.filter((t) => t.length > 0);
	}

	// ───────────── טופס סרטון/הודעה/כתבה ─────────────
	let vidKind = $state<'סרטון' | 'הודעה' | 'כתבה'>('סרטון');
	let vidTitle = $state('');
	let vidAuthor = $state('');
	let vidDate = $state('');
	let vidExcerpt = $state('');
	let vidBody = $state('');
	let vidUrl = $state('');
	let vidImageUrl = $state('');
	let vidSourceUrl = $state('');
	let vidNotice = $state('');

	// ───────────── סרטון דף הבית ─────────────
	let homeVideoUrl = $state('');
	let homeVideoTitle = $state(DEFAULT_HOME_VIDEO_TITLE);
	let homeVideoNotice = $state('');

	function toEmbedUrl(url: string): string {
		if (!url) return '';
		const t = url.trim();
		let m = t.match(/youtu\.be\/([\w-]{6,})/);
		if (m) return `https://www.youtube.com/embed/${m[1]}`;
		m = t.match(/[?&]v=([\w-]{6,})/);
		if (m) return `https://www.youtube.com/embed/${m[1]}`;
		m = t.match(/youtube\.com\/embed\/([\w-]{6,})/);
		if (m) return `https://www.youtube.com/embed/${m[1]}`;
		m = t.match(/youtube\.com\/shorts\/([\w-]{6,})/);
		if (m) return `https://www.youtube.com/embed/${m[1]}`;
		return t;
	}

	async function saveHomeVideo(e: Event) {
		e.preventDefault();
		const trimmed = homeVideoUrl.trim();
		const trimmedTitle = homeVideoTitle.trim();
		try {
			localStorage.setItem(HOME_VIDEO_KEY, trimmed);
			localStorage.setItem(HOME_VIDEO_TITLE_KEY, trimmedTitle);
		} catch {}
		try {
			await saveHomeConfig({ homeVideoUrl: trimmed, homeVideoTitle: trimmedTitle });
		} catch (err) {
			homeVideoNotice = '⚠️ נשמר מקומית בלבד (Strapi לא זמין)';
			setTimeout(() => (homeVideoNotice = ''), 4000);
			return;
		}
		homeVideoNotice = trimmed ? '✅ הסרטון והכותרת נשמרו ויופיעו בדף הבית' : '✅ הסרטון הוסר מדף הבית';
		setTimeout(() => (homeVideoNotice = ''), 4000);
	}

	async function clearHomeVideo() {
		if (!(await askConfirm('להסיר את הסרטון מדף הבית?'))) return;
		homeVideoUrl = '';
		try {
			localStorage.removeItem(HOME_VIDEO_KEY);
		} catch {}
		homeVideoNotice = '✅ הסרטון הוסר מדף הבית';
		setTimeout(() => (homeVideoNotice = ''), 4000);
	}

	onMount(async () => {
		const user = await getCurrentUser();
		if (!user || !isChachmeiAdmin(user)) {
			authChecking = false;
			goto('/admin/login');
			return;
		}
		currentUser = user;
		isSuper = isSuperAdmin(user);
		isLimited = isLimitedChachmeiAdmin(user);
		isLoggedIn = true;
		authChecking = false;
		await loadAll();
		await loadAdminContent();
		if (isSuper) reloadAdmins();
	});

	// ───────────── ניהול אדמינים (סופר-אדמין) ─────────────

	async function reloadAdmins() {
		try {
			adminsList = await listAdmins();
		} catch (e) {
			console.warn('listAdmins failed', e);
		}
	}

	async function reloadUsers() {
		usersLoading = true;
		try {
			const res = await listCommunityUsers();
			communityUsers = res.users;
			othersCount = res.othersCount;
			usersLoaded = true;
			// אם "שאר הרשומים" כבר נטענו פעם — מרעננים גם אותם
			if (othersLoaded) await loadOtherUsers(true);
		} catch (e: any) {
			adminsNotice = '⚠️ שגיאה בטעינת הרשומים: ' + (e?.message ?? e);
		} finally {
			usersLoading = false;
		}
	}

	async function loadOtherUsers(force = false) {
		if (othersLoading || (othersLoaded && !force)) return;
		othersLoading = true;
		try {
			otherUsers = await listOtherUsers();
			othersLoaded = true;
		} catch (e: any) {
			adminsNotice = '⚠️ שגיאה בטעינת שאר הרשומים: ' + (e?.message ?? e);
		} finally {
			othersLoading = false;
		}
	}

	function openUsersTab() {
		activeTab = 'users';
		if (!usersLoaded && !usersLoading) reloadUsers();
	}

	async function searchAdminUsers() {
		const q = adminSearch.trim();
		if (!q) {
			adminSearchResults = [];
			return;
		}
		adminSearching = true;
		try {
			adminSearchResults = await listAdmins(q);
		} catch (e: any) {
			adminsNotice = '⚠️ שגיאה בחיפוש: ' + (e?.message ?? e);
		} finally {
			adminSearching = false;
		}
	}

	async function doSetAdminRole(email: string, role: 'ch_admin' | 'user') {
		const verb = role === 'ch_admin' ? 'למנות את' : 'להסיר הרשאת אדמין מ-';
		if (!(await askConfirm(`${verb} ${email}?`))) return;
		try {
			await setAdminRole(email, role);
			adminsNotice = role === 'ch_admin'
				? `✅ ${email} מונה לאדמין תוכן — יכול להעלות תוכן בכל ההיכלות ולאשר תאריכי דיונים`
				: `✅ ההרשאה של ${email} הוסרה`;
			await reloadAdmins();
			await searchAdminUsers();
			if (usersLoaded) await reloadUsers();
			setTimeout(() => (adminsNotice = ''), 5000);
		} catch (e: any) {
			adminsNotice = '⚠️ שגיאה: ' + (e?.message ?? e);
		}
	}

	async function loadAdminContent() {
		try {
			const [c, q, s, h, r, hr] = await Promise.all([
				loadCharterEntries(),
				loadQaItems(),
				loadAllSubmissions(),
				loadHearings(),
				loadRulings(),
				loadHearingRequests()
			]);
			charterEntries = c;
			qaItems = q;
			qaSubmissions = s;
			hearings = h;
			rulings = r;
			hearingRequests = hr;
		} catch (e) {
			console.warn('admin loadAdminContent failed', e);
		}
	}

	async function loadAll() {
		try {
			const a = JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]');
			if (Array.isArray(a)) customArticles = a;
			const v = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
			if (Array.isArray(v)) customActivity = v;
			const n = JSON.parse(localStorage.getItem(NEWS_KEY) || '[]');
			if (Array.isArray(n)) customNews = n;
			const c = JSON.parse(localStorage.getItem(CASES_KEY) || '[]');
			if (Array.isArray(c)) pendingCases = c;
			const hv = localStorage.getItem(HOME_VIDEO_KEY);
			if (hv) homeVideoUrl = hv;
			const hvt = localStorage.getItem(HOME_VIDEO_TITLE_KEY);
			if (hvt !== null) homeVideoTitle = hvt;
			const r = localStorage.getItem(RABBIS_STORAGE_KEY);
			if (r) {
				const parsed = JSON.parse(r);
				if (Array.isArray(parsed) && parsed.every((x) => typeof x?.name === 'string')) {
					rabbis = parsed as Rabbi[];
				}
			}
		} catch {}
		// Strapi מנצח על localStorage לרבנים וקונפיג בית
		try {
			const backendRabbis = await loadRabbis();
			if (backendRabbis.length) rabbis = backendRabbis;
		} catch {}
		try {
			const cfg = await loadHomeConfig();
			if (cfg.homeVideoUrl) homeVideoUrl = cfg.homeVideoUrl;
			if (cfg.homeVideoTitle) homeVideoTitle = cfg.homeVideoTitle;
		} catch {}
	}

	function persistRabbis() {
		try {
			localStorage.setItem(RABBIS_STORAGE_KEY, JSON.stringify(rabbis));
		} catch {}
	}

	function genRabbiId(): string {
		return 'r-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000).toString(36);
	}

	async function fileToDataUrl(file: File, maxSize = 400): Promise<string> {
		const dataUrl: string = await new Promise((resolve, reject) => {
			const fr = new FileReader();
			fr.onload = () => resolve(String(fr.result));
			fr.onerror = () => reject(fr.error);
			fr.readAsDataURL(file);
		});
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
				const w = Math.round(img.width * scale);
				const h = Math.round(img.height * scale);
				const c = document.createElement('canvas');
				c.width = w;
				c.height = h;
				const ctx = c.getContext('2d');
				if (!ctx) return reject(new Error('no ctx'));
				ctx.drawImage(img, 0, 0, w, h);
				resolve(c.toDataURL('image/jpeg', 0.85));
			};
			img.onerror = () => reject(new Error('image load failed'));
			img.src = dataUrl;
		});
	}

	async function onRabbiPhotoFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		try {
			rabbiPhotoUrl = await fileToDataUrl(file);
		} catch {
			rabbiNotice = '⚠️ נכשלה טעינת התמונה';
		}
	}

	async function submitRabbi(e: Event) {
		e.preventDefault();
		const name = rabbiName.trim();
		if (!name) {
			rabbiNotice = '⚠️ יש למלא שם';
			return;
		}
		const photo = rabbiPhotoUrl.trim() || undefined;
		const title = rabbiTitle.trim() || undefined;
		const nickname = rabbiNickname.trim() || undefined;
		const city = rabbiCity.trim() || undefined;
		const newRabbi: Rabbi = { id: editingRabbiId ?? genRabbiId(), name, photo, title, nickname, city };
		let toBackend = true;
		if (!editingRabbiId) {
			try {
				await addRabbiToBackend(newRabbi);
			} catch {
				toBackend = false;
			}
		}
		if (editingRabbiId) {
			rabbis = rabbis.map((x) => (x.id === editingRabbiId ? newRabbi : x));
			rabbiNotice = '✅ הדיין עודכן (לעדכון בסטראפי - דרך פאנל האדמין של Strapi)';
		} else {
			rabbis = [...rabbis, newRabbi];
			rabbiNotice = toBackend ? '✅ הדיין נוסף לסטראפי' : '⚠️ נשמר מקומית בלבד';
		}
		persistRabbis();
		rabbiName = '';
		rabbiTitle = '';
		rabbiNickname = '';
		rabbiCity = '';
		rabbiPhotoUrl = '';
		editingRabbiId = null;
		setTimeout(() => (rabbiNotice = ''), 4000);
	}

	function editRabbi(r: Rabbi) {
		editingRabbiId = r.id;
		rabbiName = r.name;
		rabbiTitle = r.title || '';
		rabbiNickname = r.nickname || '';
		rabbiCity = r.city || '';
		rabbiPhotoUrl = r.photo || '';
		rabbiNotice = '';
	}

	function cancelEditRabbi() {
		editingRabbiId = null;
		rabbiName = '';
		rabbiTitle = '';
		rabbiNickname = '';
		rabbiCity = '';
		rabbiPhotoUrl = '';
		rabbiNotice = '';
	}

	async function deleteRabbi(id: string) {
		if (!(await askConfirm('למחוק את הדיין?'))) return;
		rabbis = rabbis.filter((x) => x.id !== id);
		persistRabbis();
		if (editingRabbiId === id) cancelEditRabbi();
	}

	function removeRabbiPhoto(id: string) {
		rabbis = rabbis.map((x) => (x.id === id ? { ...x, photo: undefined } : x));
		persistRabbis();
	}

	function moveRabbi(id: string, direction: -1 | 1) {
		const i = rabbis.findIndex((x) => x.id === id);
		const j = i + direction;
		if (i < 0 || j < 0 || j >= rabbis.length) return;
		const next = [...rabbis];
		[next[i], next[j]] = [next[j], next[i]];
		rabbis = next;
		persistRabbis();
	}

	async function resetRabbisToDefault() {
		if (!(await askConfirm('לאפס לרשימת ברירת המחדל? (תמונות שהעלית יימחקו)'))) return;
		rabbis = [...defaultRabbis];
		persistRabbis();
		cancelEditRabbi();
	}

	function handleLogout() {
		strapiLogout();
		isLoggedIn = false;
		currentUser = null;
		try { sessionStorage.removeItem(SESSION_KEY); } catch {}
		goto('/admin/login');
	}

	// ───────────── ניהול חתימות ─────────────
	const filteredCharter = $derived(
		charterFilter === 'all'
			? charterEntries
			: charterEntries.filter((e) => e.status === charterFilter)
	);

	function startDisqualify(e: CharterEntry) {
		disqualifyingId = e.id;
		disqualifyReason = '';
		disqualifyBy = fmtAny(currentUser?.username) || '';
	}

	function startEditCharter(e: CharterEntry) {
		editingCharterId = e.id;
		disqualifyingId = null;
		editCharterName = fmtAny(e.name);
		editCharterBusiness = fmtAny(e.businessName);
		editCharterRole = fmtAny(e.role);
		editCharterCity = fmtAny(e.city);
		editCharterEmail = e.email ?? '';
		editCharterPhone = e.phone ?? '';
		editCharterDate = e.date ?? '';
	}

	async function saveEditCharter(id: string) {
		if (!editCharterName.trim()) {
			alert('חובה להזין שם');
			return;
		}
		savingCharter = true;
		try {
			await updateSignatory(id, {
				name: editCharterName,
				businessName: editCharterBusiness,
				role: editCharterRole,
				city: editCharterCity,
				email: editCharterEmail,
				phone: editCharterPhone,
				signedDate: editCharterDate
			});
			editingCharterId = null;
			await loadAdminContent();
		} catch (e: any) {
			alert('שגיאה בשמירה: ' + (e?.message ?? e));
		} finally {
			savingCharter = false;
		}
	}

	async function confirmDisqualify(id: string) {
		if (!disqualifyReason.trim()) {
			alert('חובה להזין סיבת פסילה');
			return;
		}
		try {
			await disqualifyEntry(id, disqualifyReason.trim(), disqualifyBy.trim() || 'בית הדין');
			disqualifyingId = null;
			await loadAdminContent();
		} catch (e: any) {
			alert('שגיאה: ' + (e?.message ?? e));
		}
	}

	async function doReinstate(id: string) {
		if (!(await askConfirm('להחזיר את הרשומה לסטטוס "חתום"?'))) return;
		try {
			await reinstateEntry(id);
			await loadAdminContent();
		} catch (e: any) {
			alert('שגיאה: ' + (e?.message ?? e));
		}
	}

	async function doDeleteCharter(id: string) {
		if (!(await askConfirm('למחוק את הרשומה לצמיתות?'))) return;
		try {
			await deleteCharterEntry(id);
			await loadAdminContent();
		} catch (e: any) {
			alert('שגיאה: ' + (e?.message ?? e));
		}
	}

	// ───────────── תשובות לשאלות ─────────────
	const pendingSubmissions = $derived(qaSubmissions.filter((s) => s.status === 'pending'));

	function startAnswer(s: QaSubmission) {
		answeringId = s.documentId;
		answerText = '';
		answerBy = currentUser?.username ?? '';
		answerTopicOverride = s.topic ?? 'אחר';
	}

	async function doPublishAnswer(s: QaSubmission) {
		if (!answerText.trim()) { alert('יש להזין תשובה'); return; }
		const slug = 'q-' + Date.now().toString(36);
		try {
			await publishAnswer({
				slug,
				topic: answerTopicOverride || s.topic || 'אחר',
				question: s.question,
				asker: s.askerName,
				askDate: s.createdAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
				answer: answerText.trim(),
				answeredBy: answerBy.trim() || (currentUser?.username ?? 'חכמי העדה')
			});
			await markSubmissionAnswered(s.documentId, slug);
			answeringId = null;
			answerText = '';
			await loadAdminContent();
		} catch (e: any) {
			alert('שגיאה בפרסום: ' + (e?.message ?? e));
		}
	}

	async function doRejectSubmission(id: string) {
		if (!(await askConfirm('לדחות את השאלה? (לא תפורסם כתשובה)'))) return;
		try { await rejectSubmission(id); await loadAdminContent(); }
		catch (e: any) { alert('שגיאה: ' + (e?.message ?? e)); }
	}

	async function doDeleteSubmission(id: string) {
		if (!(await askConfirm('למחוק את השאלה לצמיתות?'))) return;
		try { await deleteSubmission(id); await loadAdminContent(); }
		catch (e: any) { alert('שגיאה: ' + (e?.message ?? e)); }
	}

	async function doDeleteQa(id: string) {
		if (!(await askConfirm('למחוק את ה-Q&A מהאתר?'))) return;
		try { await deleteQa(id); await loadAdminContent(); }
		catch (e: any) { alert('שגיאה: ' + (e?.message ?? e)); }
	}

	// ───────────── ניהול דיונים ─────────────
	function clearHearingForm() {
		hearingEditingId = null;
		hearingCaseName = '';
		hearingDayan1 = ''; hearingDayan2 = ''; hearingDayan3 = '';
		hearingZoom = '';
		hearingDate = '';
		hearingTime = '';
		hearingStatus = 'מתוכנן';
		hearingNotice = '';
	}

	function startEditHearing(h: Hearing & { documentId?: string }) {
		hearingEditingId = (h as any).documentId ?? h.id;
		hearingCaseName = fmtAny(h.caseName);
		hearingDayan1 = fmtAny(h.dayanim?.[0]);
		hearingDayan2 = fmtAny(h.dayanim?.[1]);
		hearingDayan3 = fmtAny(h.dayanim?.[2]);
		hearingZoom = h.zoomLink ?? '';
		hearingDate = h.date ?? '';
		hearingTime = h.time ?? '';
		hearingStatus = h.status;
	}

	async function submitHearing(e: Event) {
		e.preventDefault();
		if (!hearingCaseName.trim() || !hearingDate) {
			hearingNotice = '⚠️ חובה למלא שם תיק ותאריך';
			return;
		}
		const dayanim = [hearingDayan1, hearingDayan2, hearingDayan3].map(s => s.trim()).filter(Boolean);
		try {
			if (hearingEditingId) {
				await updateHearing(hearingEditingId, {
					caseName: hearingCaseName.trim(), dayanim,
					zoomLink: hearingZoom.trim(), date: hearingDate,
					time: hearingTime.trim(), status: hearingStatus
				});
				hearingNotice = '✅ הדיון עודכן';
			} else {
				await createHearing({
					caseName: hearingCaseName.trim(), dayanim,
					zoomLink: hearingZoom.trim(), date: hearingDate,
					time: hearingTime.trim(), status: hearingStatus
				});
				hearingNotice = '✅ הדיון נוסף';
			}
			clearHearingForm();
			await loadAdminContent();
			setTimeout(() => (hearingNotice = ''), 4000);
		} catch (e: any) {
			hearingNotice = '⚠️ שגיאה: ' + (e?.message ?? e);
		}
	}

	async function doDeleteHearing(id: string) {
		if (!(await askConfirm('למחוק את הדיון?'))) return;
		try { await deleteHearing(id); await loadAdminContent(); }
		catch (e: any) { alert('שגיאה: ' + (e?.message ?? e)); }
	}

	// ───────────── פסקי דין ─────────────
	function clearRulingForm() {
		rulingCaseRef = '';
		rulingCaseName = '';
		rulingDayan1 = ''; rulingDayan2 = ''; rulingDayan3 = '';
		rulingDate = '';
		rulingSummary = '';
		rulingDecision = '';
		rulingNotice = '';
	}

	async function submitRuling(e: Event) {
		e.preventDefault();
		if (!rulingCaseName.trim() || !rulingDate || !rulingSummary.trim() || !rulingDecision.trim()) {
			rulingNotice = '⚠️ חובה: שם תיק, תאריך, סיכום והחלטה';
			return;
		}
		const dayanim = [rulingDayan1, rulingDayan2, rulingDayan3].map(s => s.trim()).filter(Boolean);
		try {
			await createRuling({
				caseRef: rulingCaseRef.trim() || undefined,
				caseName: rulingCaseName.trim(),
				dayanim,
				date: rulingDate,
				summary: rulingSummary.trim(),
				decision: rulingDecision.trim()
			});
			rulingNotice = '✅ פסק הדין פורסם';
			clearRulingForm();
			await loadAdminContent();
			setTimeout(() => (rulingNotice = ''), 4000);
		} catch (e: any) {
			rulingNotice = '⚠️ שגיאה: ' + (e?.message ?? e);
		}
	}

	async function doDeleteRuling(id: string) {
		if (!(await askConfirm('למחוק את פסק הדין?'))) return;
		try { await deleteRuling(id); await loadAdminContent(); }
		catch (e: any) { alert('שגיאה: ' + (e?.message ?? e)); }
	}

	// ───────────── בקשות לדיון ─────────────
	async function doRequestStatus(id: string, status: 'accepted' | 'rejected' | 'scheduled') {
		try { await setRequestStatus(id, status); await loadAdminContent(); }
		catch (e: any) { alert('שגיאה: ' + (e?.message ?? e)); }
	}

	async function doDeleteRequest(id: string) {
		if (!(await askConfirm('למחוק את הבקשה?'))) return;
		try { await deleteHearingRequest(id); await loadAdminContent(); }
		catch (e: any) { alert('שגיאה: ' + (e?.message ?? e)); }
	}

	const pendingRequestsCount = $derived(hearingRequests.filter(r => r.status === 'pending').length);
	const pendingQaCount = $derived(pendingSubmissions.length);

	// ───────────── ניהול מאמרים ─────────────
	function slugify(s: string): string {
		return s
			.trim()
			.replace(/[^֐-׿a-zA-Z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.toLowerCase()
			.slice(0, 60) || `art-${Date.now()}`;
	}

	async function submitArticle(e: Event) {
		e.preventDefault();
		if (!artTitle.trim() || !artAuthor.trim() || !artExcerpt.trim() || !artBody.trim()) {
			artNotice = '⚠️ יש למלא את כל השדות החיוניים';
			return;
		}
		const approvedBy = [artApprover1, artApprover2, artApprover3].map((s) => s.trim()).filter(Boolean);
		if (approvedBy.length < 3) {
			artNotice = '⚠️ נדרשים לפחות 3 רבנים מאשרים';
			return;
		}
		const tags = parseTags(artTags);
		const newArt: Article = {
			slug: slugify(artTitle) + '-' + Math.floor(Math.random() * 1000),
			title: toLoc(artTitle.trim()),
			author: toLoc(artAuthor.trim()),
			date: artDate || new Date().toISOString().slice(0, 10),
			excerpt: toLoc(artExcerpt.trim()),
			body: toLoc(artBody.trim()),
			approvedBy: approvedBy.map(toLoc),
			...(tags.length > 0 ? { tags: tags.map(toLoc) } : {})
		};
		let toBackend = true;
		try {
			await addArticle(newArt);
		} catch {
			toBackend = false;
		}
		customArticles = [newArt, ...customArticles];
		try {
			localStorage.setItem(ARTICLES_KEY, JSON.stringify(customArticles));
		} catch {}
		artTitle = '';
		artAuthor = '';
		artDate = '';
		artExcerpt = '';
		artBody = '';
		artApprover1 = '';
		artApprover2 = '';
		artApprover3 = '';
		artTags = '';
		artNotice = toBackend
			? '✅ המאמר נוסף לסטראפי ומופיע באתר'
			: '⚠️ נשמר מקומית בלבד (Strapi לא זמין)';
		setTimeout(() => (artNotice = ''), 4000);
	}

	async function deleteCustomArticle(slug: string) {
		if (!(await askConfirm('למחוק את המאמר?'))) return;
		customArticles = customArticles.filter((x) => x.slug !== slug);
		try {
			localStorage.setItem(ARTICLES_KEY, JSON.stringify(customArticles));
		} catch {}
	}

	// ───────────── ניהול סרטונים/הודעות ─────────────
	async function onActivityImageFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		try {
			vidImageUrl = await fileToDataUrl(file, 1200);
		} catch {
			vidNotice = '⚠️ נכשלה טעינת התמונה';
		}
	}

	async function submitActivity(e: Event) {
		e.preventDefault();
		if (!vidTitle.trim() || !vidAuthor.trim() || !vidExcerpt.trim()) {
			vidNotice = '⚠️ יש למלא כותרת, מחבר ותקציר';
			return;
		}
		if (vidKind === 'סרטון' && !vidUrl.trim()) {
			vidNotice = '⚠️ חובה להזין קישור לסרטון';
			return;
		}
		const embeddedVideo = vidUrl.trim() ? toEmbedUrl(vidUrl.trim()) : '';
		const newItem: ActivityItem = {
			slug: slugify(vidTitle) + '-' + Math.floor(Math.random() * 1000),
			kind: vidKind,
			title: toLoc(vidTitle.trim()),
			author: toLoc(vidAuthor.trim()),
			date: vidDate || new Date().toISOString().slice(0, 10),
			excerpt: toLoc(vidExcerpt.trim()),
			...(vidBody.trim() ? { body: toLoc(vidBody.trim()) } : {}),
			...(embeddedVideo ? { videoUrl: embeddedVideo } : {}),
			...(vidImageUrl.trim() ? { imageUrl: vidImageUrl.trim() } : {}),
			...(vidSourceUrl.trim() ? { sourceUrl: vidSourceUrl.trim() } : {})
		};
		let toBackend = true;
		try {
			await addActivity(newItem);
		} catch {
			toBackend = false;
		}
		customActivity = [newItem, ...customActivity];
		try {
			localStorage.setItem(ACTIVITY_KEY, JSON.stringify(customActivity));
		} catch {}
		vidTitle = '';
		vidAuthor = '';
		vidDate = '';
		vidExcerpt = '';
		vidBody = '';
		vidUrl = '';
		vidImageUrl = '';
		vidSourceUrl = '';
		vidNotice = toBackend
			? `✅ ה${vidKind} נוסף לסטראפי ומופיע באתר`
			: `⚠️ נשמר מקומית בלבד (Strapi לא זמין)`;
		setTimeout(() => (vidNotice = ''), 4000);
	}

	async function deleteCustomActivity(slug: string) {
		if (!(await askConfirm('למחוק את הפריט?'))) return;
		customActivity = customActivity.filter((x) => x.slug !== slug);
		try {
			localStorage.setItem(ACTIVITY_KEY, JSON.stringify(customActivity));
		} catch {}
	}

	// ───────────── ניהול חדשות לוקאליות ─────────────
	async function submitNews(e: Event) {
		e.preventDefault();
		if (!newsTitle.trim()) {
			newsNotice = '⚠️ חובה למלא כותרת';
			return;
		}
		const item: NewsItem = {
			id: 'news-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
			title: newsTitle.trim(),
			summary: newsSummary.trim(),
			date: new Date().toISOString().slice(0, 10),
			...(newsSourceUrl.trim() ? { sourceUrl: newsSourceUrl.trim() } : {})
		};
		let toBackend = true;
		try {
			await addNewsItem({
				line1: item.title,
				line2: item.summary || undefined,
				sourceUrl: item.sourceUrl
			});
		} catch {
			toBackend = false;
		}
		customNews = [item, ...customNews];
		try {
			localStorage.setItem(NEWS_KEY, JSON.stringify(customNews));
		} catch {}
		newsTitle = '';
		newsSummary = '';
		newsSourceUrl = '';
		newsNotice = toBackend
			? '✅ החדשה נוספה לסטראפי - תופיע בטיקר'
			: '⚠️ נשמר מקומית בלבד (Strapi לא זמין)';
		setTimeout(() => (newsNotice = ''), 5000);
	}

	async function deleteCustomNews(id: string) {
		if (!(await askConfirm('למחוק את החדשה?'))) return;
		customNews = customNews.filter((x) => x.id !== id);
		try {
			localStorage.setItem(NEWS_KEY, JSON.stringify(customNews));
		} catch {}
	}

	// ───────────── אישור תאריכים ─────────────
	function approveCase(id: string) {
		pendingCases = pendingCases.map((c) =>
			c.id === id ? { ...c, approvals: { ...c.approvals, beitDin: true } } : c
		);
		try {
			localStorage.setItem(CASES_KEY, JSON.stringify(pendingCases));
		} catch {}
	}

	async function rejectCase(id: string) {
		if (!(await askConfirm('לדחות ולמחוק את הבקשה?'))) return;
		pendingCases = pendingCases.filter((c) => c.id !== id);
		try {
			localStorage.setItem(CASES_KEY, JSON.stringify(pendingCases));
		} catch {}
	}

	let pendingApprovalCount = $derived(
		pendingCases.filter((c) => c?.approvals && !c.approvals.beitDin).length
	);
</script>

<svelte:head>
	<title>פאנל ניהול - חכמי העדה</title>
</svelte:head>

<!-- Escape סוגר את דיאלוג האישור -->
<svelte:window onkeydown={(e) => { if (confirmDialog && e.key === 'Escape') closeConfirm(false); }} />

{#if authChecking}
	<section class="py-16 max-w-md mx-auto px-4 text-center">
		<div class="text-4xl mb-3">⏳</div>
		<p class="text-gray-300">בודק הרשאות...</p>
	</section>
{:else if !isLoggedIn}
	<section class="py-16 max-w-md mx-auto px-4 text-center">
		<div class="text-4xl mb-3">🔐</div>
		<p class="text-gray-300 mb-4">נדרשת התחברות</p>
		<a href="/admin/login" class="inline-block px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold">
			לדף ההתחברות
		</a>
	</section>
{:else}
	<!-- ────────────── פאנל ניהול ────────────── -->
	<section class="py-8 max-w-5xl mx-auto px-3">
		<header class="flex items-center justify-between mb-6 gap-3 flex-wrap">
			<div>
				<h1 class="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
					פאנל ניהול
				</h1>
				<p class="mt-1 text-gray-400 text-sm">
					{#if headerName}<span class="font-bold text-gray-300">{headerName}</span><span class="text-gray-500"> · </span>{/if}<span class="text-gray-500" dir="ltr">{currentUser?.email ?? ''}</span>
					{#if isSuper}
						<span class="mr-2 inline-block align-middle px-3 py-1 rounded-full bg-amber-400 border border-amber-500 text-amber-950 text-sm font-black whitespace-nowrap">👑 סופר-אדמין</span>
					{:else if isLimited}
						<span class="mr-2 inline-block align-middle px-3 py-1 rounded-full bg-blue-500 border border-blue-600 text-white text-sm font-black whitespace-nowrap">🛠️ אדמין תוכן</span>
					{/if}
				</p>
			</div>
			<button
				onclick={handleLogout}
				class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold"
			>
				יציאה
			</button>
		</header>

		<!-- לשוניות -->
		<div class="flex gap-2 mb-6 border-b border-white/10 flex-wrap">
			<button
				class="relative px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
				class:bg-purple-500={activeTab === 'qa-submissions'}
				class:text-white={activeTab === 'qa-submissions'}
				class:text-gray-400={activeTab !== 'qa-submissions'}
				class:hover:text-gray-200={activeTab !== 'qa-submissions'}
				onclick={() => (activeTab = 'qa-submissions')}
			>
				❓ שאלות חדשות
				{#if pendingQaCount > 0}
					<span class="absolute -top-1 -left-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">
						{pendingQaCount}
					</span>
				{/if}
			</button>
			<button
				class="px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
				class:bg-purple-500={activeTab === 'qa'}
				class:text-white={activeTab === 'qa'}
				class:text-gray-400={activeTab !== 'qa'}
				class:hover:text-gray-200={activeTab !== 'qa'}
				onclick={() => (activeTab = 'qa')}
			>
				💬 שו"ת ({qaItems.length})
			</button>
			{#if !isLimited}
				<!-- ניהול חתימות האמנה — לסופר-אדמין בלבד -->
				<button
					class="px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
					class:bg-purple-500={activeTab === 'charter'}
					class:text-white={activeTab === 'charter'}
					class:text-gray-400={activeTab !== 'charter'}
					class:hover:text-gray-200={activeTab !== 'charter'}
					onclick={() => (activeTab = 'charter')}
				>
					✍️ אמנה ({charterEntries.length})
				</button>
			{/if}
			<button
				class="relative px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
				class:bg-purple-500={activeTab === 'hearing-requests'}
				class:text-white={activeTab === 'hearing-requests'}
				class:text-gray-400={activeTab !== 'hearing-requests'}
				class:hover:text-gray-200={activeTab !== 'hearing-requests'}
				onclick={() => (activeTab = 'hearing-requests')}
			>
				📥 בקשות לדיון
				{#if pendingRequestsCount > 0}
					<span class="absolute -top-1 -left-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">
						{pendingRequestsCount}
					</span>
				{/if}
			</button>
			<button
				class="px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
				class:bg-purple-500={activeTab === 'hearings'}
				class:text-white={activeTab === 'hearings'}
				class:text-gray-400={activeTab !== 'hearings'}
				class:hover:text-gray-200={activeTab !== 'hearings'}
				onclick={() => (activeTab = 'hearings')}
			>
				⚖️ דיונים ({hearings.length})
			</button>
			<button
				class="px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
				class:bg-purple-500={activeTab === 'rulings'}
				class:text-white={activeTab === 'rulings'}
				class:text-gray-400={activeTab !== 'rulings'}
				class:hover:text-gray-200={activeTab !== 'rulings'}
				onclick={() => (activeTab = 'rulings')}
			>
				📜 פסקי דין ({rulings.length})
			</button>
			<button
				class="px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
				class:bg-purple-500={activeTab === 'articles'}
				class:text-white={activeTab === 'articles'}
				class:text-gray-400={activeTab !== 'articles'}
				class:hover:text-gray-200={activeTab !== 'articles'}
				onclick={() => (activeTab = 'articles')}
			>
				📚 מאמרים
			</button>
			<button
				class="px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
				class:bg-purple-500={activeTab === 'videos'}
				class:text-white={activeTab === 'videos'}
				class:text-gray-400={activeTab !== 'videos'}
				class:hover:text-gray-200={activeTab !== 'videos'}
				onclick={() => (activeTab = 'videos')}
			>
				🎬 סרטונים / כתבות / הודעות
			</button>
			<button
				class="px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
				class:bg-purple-500={activeTab === 'news'}
				class:text-white={activeTab === 'news'}
				class:text-gray-400={activeTab !== 'news'}
				class:hover:text-gray-200={activeTab !== 'news'}
				onclick={() => (activeTab = 'news')}
			>
				📰 חדשות
			</button>
			<button
				class="relative px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
				class:bg-purple-500={activeTab === 'dates'}
				class:text-white={activeTab === 'dates'}
				class:text-gray-400={activeTab !== 'dates'}
				class:hover:text-gray-200={activeTab !== 'dates'}
				onclick={() => (activeTab = 'dates')}
			>
				📅 אישור תאריכים
				{#if pendingApprovalCount > 0}
					<span class="absolute -top-1 -left-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">
						{pendingApprovalCount}
					</span>
				{/if}
			</button>
			<button
				class="px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
				class:bg-purple-500={activeTab === 'rabbis'}
				class:text-white={activeTab === 'rabbis'}
				class:text-gray-400={activeTab !== 'rabbis'}
				class:hover:text-gray-200={activeTab !== 'rabbis'}
				onclick={() => (activeTab = 'rabbis')}
			>
				👤 דיינים
			</button>
			{#if isSuper}
				<button
					class="px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
					class:bg-purple-500={activeTab === 'admins'}
					class:text-white={activeTab === 'admins'}
					class:text-gray-400={activeTab !== 'admins'}
					class:hover:text-gray-200={activeTab !== 'admins'}
					onclick={() => (activeTab = 'admins')}
				>
					🛡️ אדמינים
				</button>
				<button
					class="px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors"
					class:bg-purple-500={activeTab === 'users'}
					class:text-white={activeTab === 'users'}
					class:text-gray-400={activeTab !== 'users'}
					class:hover:text-gray-200={activeTab !== 'users'}
					onclick={openUsersTab}
				>
					👥 רשומים{usersLoaded ? ` (${communityUsers.length + othersCount})` : ''}
				</button>
			{/if}
		</div>

		<!-- ───────────── תוכן הלשוניות ───────────── -->
		{#if activeTab === 'qa-submissions'}
			<div class="space-y-4">
				<div class="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5">
					<h2 class="text-xl font-black text-indigo-200 mb-2">❓ שאלות שהגיעו מהאתר</h2>
					<p class="text-sm text-gray-300">
						שאלות אלו נשלחו דרך טופס /ask. תוכל לכתוב תשובה ולפרסם אותה כשו"ת, או לדחות שאלה לא רלוונטית.
					</p>
				</div>

				{#if pendingSubmissions.length === 0}
					<div class="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
						<div class="text-4xl mb-2">📭</div>
						<p class="text-gray-300">אין שאלות חדשות</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each pendingSubmissions as s (s.documentId)}
							<div class="rounded-xl border border-indigo-400/40 bg-indigo-500/5 p-4 md:p-5">
								<div class="flex items-start justify-between gap-3 flex-wrap mb-2">
									<div>
										<div class="font-bold text-white">{s.askerName}</div>
										{#if s.askerEmail}
											<div class="text-xs text-gray-400" dir="ltr">{s.askerEmail}</div>
										{/if}
										{#if s.askerPhone}
											<div class="text-xs text-gray-400" dir="ltr">{s.askerPhone}</div>
										{/if}
									</div>
									<div class="text-xs text-gray-500">
										{s.topic ?? 'ללא נושא'} · {s.createdAt?.slice(0, 10) ?? ''}
									</div>
								</div>
								<p class="text-gray-100 leading-relaxed mb-3 whitespace-pre-line">{s.question}</p>

								{#if answeringId === s.documentId}
									<div class="space-y-3 mt-3 pt-3 border-t border-white/10">
										<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
											<input
												type="text"
												bind:value={answerBy}
												placeholder="שם המשיב (רב/דיין)"
												class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white"
											/>
											<input
												type="text"
												bind:value={answerTopicOverride}
												placeholder="נושא"
												class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white"
											/>
										</div>
										<textarea
											bind:value={answerText}
											rows="5"
											placeholder="כתוב את התשובה הרבנית כאן..."
											class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white resize-y"
										></textarea>
										<div class="flex gap-2 flex-wrap">
											<button onclick={() => doPublishAnswer(s)} class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold">
												✅ פרסם תשובה
											</button>
											<button onclick={() => (answeringId = null)} class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold">
												ביטול
											</button>
										</div>
									</div>
								{:else}
									<div class="flex gap-2 flex-wrap">
										<button onclick={() => startAnswer(s)} class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold">
											✍️ ענה ופרסם
										</button>
										<button onclick={() => doRejectSubmission(s.documentId)} class="px-4 py-2 rounded-lg bg-yellow-600/40 hover:bg-yellow-600/60 text-yellow-100 text-sm font-bold">
											דחה
										</button>
										<button onclick={() => doDeleteSubmission(s.documentId)} class="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm font-bold">
											מחק
										</button>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				{#if qaSubmissions.filter(s => s.status !== 'pending').length > 0}
					<details class="rounded-xl border border-white/10 bg-white/5 p-4">
						<summary class="cursor-pointer text-sm font-bold text-gray-300">
							📦 ארכיון שאלות שטופלו ({qaSubmissions.filter(s => s.status !== 'pending').length})
						</summary>
						<div class="mt-3 space-y-2">
							{#each qaSubmissions.filter(s => s.status !== 'pending') as s (s.documentId)}
								<div class="text-xs text-gray-400 border-b border-white/5 pb-2 flex items-center justify-between gap-3">
									<div>
										<span class="font-bold">{s.askerName}</span> · {s.status} · {s.createdAt?.slice(0, 10)}
									</div>
									<button onclick={() => doDeleteSubmission(s.documentId)} class="text-red-300 hover:text-red-200 text-xs">מחק</button>
								</div>
							{/each}
						</div>
					</details>
				{/if}
			</div>

		{:else if activeTab === 'qa'}
			<div class="space-y-3">
				<div class="rounded-xl border border-white/10 bg-white/5 p-4">
					<h2 class="text-lg font-black text-white">💬 שו"ת שפורסם</h2>
					<p class="text-xs text-gray-400">מחיקה כאן מסירה את ה-Q&A מהאתר. לעריכה - דרך פאנל סטראפי.</p>
				</div>
				{#each qaItems as q (q.slug)}
					<div class="rounded-xl border border-indigo-400/30 bg-indigo-500/5 p-4">
						<div class="flex items-start justify-between gap-3 flex-wrap">
							<div class="min-w-0 flex-1">
								<p class="font-bold text-white">{fmtAny(q.asker)} · {q.topic}</p>
								<p class="text-sm text-gray-300 mt-1 line-clamp-2">{fmtAny(q.question)}</p>
								<p class="text-xs text-indigo-300 mt-2">{fmtAny(q.answeredBy)} · {q.answerDate}</p>
							</div>
							<button onclick={() => doDeleteQa((q as any).documentId ?? q.slug)} class="px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold">
								מחק
							</button>
						</div>
					</div>
				{/each}
			</div>

		{:else if activeTab === 'charter'}
			<div class="space-y-4">
				<div class="rounded-2xl border border-[#d4be7f] bg-[#f8eecb]/60 p-5">
					<h2 class="text-xl font-black text-emerald-800 mb-2">✍️ חתימות אמנת UECC</h2>
					<p class="text-sm text-gray-600">
						רשימת החתומים מתעדכנת אוטומטית מהטופס באתר. ניתן לפסול חתימה (תועבר ללשונית "פסולים" באתר), להחזיר חתימה פסולה או למחוק.
					</p>
				</div>

				<div class="flex gap-2 flex-wrap">
					<button onclick={() => (charterFilter = 'all')} class="px-3 py-1.5 rounded-full text-sm font-bold border transition-colors {charterFilter === 'all' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#d4be7f] text-gray-600 hover:bg-black/5'}">
						הכל ({charterEntries.length})
					</button>
					<button onclick={() => (charterFilter = 'signed')} class="px-3 py-1.5 rounded-full text-sm font-bold border transition-colors {charterFilter === 'signed' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#d4be7f] text-gray-600 hover:bg-black/5'}">
						חתומים ({charterEntries.filter(e => e.status === 'signed').length})
					</button>
					<button onclick={() => (charterFilter = 'disqualified')} class="px-3 py-1.5 rounded-full text-sm font-bold border transition-colors {charterFilter === 'disqualified' ? 'bg-red-600 border-red-600 text-white' : 'border-[#d4be7f] text-gray-600 hover:bg-black/5'}">
						פסולים ({charterEntries.filter(e => e.status === 'disqualified').length})
					</button>
				</div>

				{#if filteredCharter.length === 0}
					<div class="rounded-xl border border-[#d4be7f] bg-[#f8eecb]/40 p-8 text-center text-gray-500">
						אין רשומות
					</div>
				{:else}
					<!-- רקע-לחיצה לסגירת תפריט "עוד" -->
					{#if openCharterMenu !== null}
						<button type="button" aria-label="סגור תפריט" class="fixed inset-0 z-20 cursor-default" onclick={() => (openCharterMenu = null)}></button>
					{/if}
					<div class="rounded-xl border border-[#d4be7f] bg-[#f8eecb]/60 divide-y divide-[#e4d29a] overflow-visible">
						{#each filteredCharter as e (e.id)}
							<div class={e.status === 'signed' ? '' : 'bg-red-500/[0.04]'}>
								<div class="flex items-center gap-2.5 px-3 py-2">
									<span class="w-2 h-2 rounded-full flex-shrink-0 {e.status === 'signed' ? 'bg-emerald-500' : 'bg-red-500'}" title={e.status === 'signed' ? 'חתום' : 'פסול'}></span>
									<span class="font-bold text-gray-900 text-sm whitespace-nowrap">{fmtAny(e.name)}</span>
									{#if fmtAny(e.role) || fmtAny(e.city)}
										<span class="text-xs text-gray-500 truncate hidden sm:inline">{fmtAny(e.role)}{fmtAny(e.role) && fmtAny(e.city) ? ' · ' : ''}{fmtAny(e.city)}</span>
									{/if}
									<span class="text-xs text-gray-400 whitespace-nowrap hidden md:inline">· {e.date}</span>
									{#if e.status === 'disqualified' && e.disqualifiedReason}
										<span class="text-xs text-red-600/80 italic truncate hidden lg:inline">"{fmtAny(e.disqualifiedReason)}"</span>
									{/if}
									<span class="flex-1 min-w-0"></span>
									<div class="relative flex-shrink-0">
										<button type="button" onclick={() => (openCharterMenu = openCharterMenu === e.id ? null : e.id)} class="px-2.5 py-1 rounded-md text-xs font-bold text-gray-600 bg-black/5 hover:bg-black/10 border border-[#d4be7f] flex items-center gap-1 transition-colors">
											עוד <span class="text-[9px] opacity-60">▼</span>
										</button>
										{#if openCharterMenu === e.id}
											<div class="absolute z-30 top-full left-0 mt-1 w-36 rounded-lg border border-black/10 bg-white shadow-xl py-1 overflow-hidden">
												<button type="button" onclick={() => { openCharterMenu = null; startEditCharter(e); }} class="w-full flex items-center gap-2 text-right px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors">✏️ ערוך</button>
												{#if e.status === 'signed'}
													<button type="button" onclick={() => { openCharterMenu = null; startDisqualify(e); }} class="w-full flex items-center gap-2 text-right px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">⛔ פסול</button>
												{:else}
													<button type="button" onclick={() => { openCharterMenu = null; doReinstate(e.id); }} class="w-full flex items-center gap-2 text-right px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors">↩️ החזר</button>
												{/if}
												<button type="button" onclick={() => { openCharterMenu = null; doDeleteCharter(e.id); }} class="w-full flex items-center gap-2 text-right px-3 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">🗑️ מחק</button>
											</div>
										{/if}
									</div>
								</div>

								{#if editingCharterId === e.id}
									<div class="mx-3 mb-3 pt-3 border-t border-[#e4d29a] space-y-2">
										<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
											<label class="block">
												<span class="text-xs text-gray-600">שם מלא</span>
												<input type="text" bind:value={editCharterName} class="mt-0.5 w-full px-3 py-2 rounded-lg bg-white border border-blue-500/50 text-gray-900" />
											</label>
											<label class="block">
												<span class="text-xs text-gray-600">שם עסק / ארגון</span>
												<input type="text" bind:value={editCharterBusiness} class="mt-0.5 w-full px-3 py-2 rounded-lg bg-white border border-[#d4be7f] text-gray-900" />
											</label>
											<label class="block">
												<span class="text-xs text-gray-600">תפקיד</span>
												<input type="text" bind:value={editCharterRole} class="mt-0.5 w-full px-3 py-2 rounded-lg bg-white border border-[#d4be7f] text-gray-900" />
											</label>
											<label class="block">
												<span class="text-xs text-gray-600">עיר</span>
												<input type="text" bind:value={editCharterCity} class="mt-0.5 w-full px-3 py-2 rounded-lg bg-white border border-[#d4be7f] text-gray-900" />
											</label>
											<label class="block">
												<span class="text-xs text-gray-600">אימייל</span>
												<input type="email" dir="ltr" bind:value={editCharterEmail} class="mt-0.5 w-full px-3 py-2 rounded-lg bg-white border border-[#d4be7f] text-gray-900" />
											</label>
											<label class="block">
												<span class="text-xs text-gray-600">טלפון</span>
												<input type="tel" dir="ltr" bind:value={editCharterPhone} class="mt-0.5 w-full px-3 py-2 rounded-lg bg-white border border-[#d4be7f] text-gray-900" />
											</label>
											<label class="block">
												<span class="text-xs text-gray-600">תאריך חתימה</span>
												<input type="date" bind:value={editCharterDate} class="mt-0.5 w-full px-3 py-2 rounded-lg bg-white border border-[#d4be7f] text-gray-900" />
											</label>
										</div>
										<div class="flex gap-2">
											<button onclick={() => saveEditCharter(e.id)} disabled={savingCharter} class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold">
												{savingCharter ? 'שומר…' : '💾 שמור'}
											</button>
											<button onclick={() => (editingCharterId = null)} class="px-4 py-2 rounded bg-black/5 hover:bg-black/10 text-gray-700 border border-[#d4be7f] text-sm font-bold">ביטול</button>
										</div>
									</div>
								{/if}

								{#if disqualifyingId === e.id}
									<div class="mx-3 mb-3 pt-3 border-t border-[#e4d29a] space-y-2">
										<input
											type="text"
											bind:value={disqualifyReason}
											placeholder="סיבת פסילה (חובה)"
											class="w-full px-3 py-2 rounded-lg bg-white border border-red-500/50 text-gray-900"
										/>
										<input
											type="text"
											bind:value={disqualifyBy}
											placeholder="שם הפוסל"
											class="w-full px-3 py-2 rounded-lg bg-white border border-[#d4be7f] text-gray-900"
										/>
										<div class="flex gap-2">
											<button onclick={() => confirmDisqualify(e.id)} class="px-4 py-2 rounded bg-red-600 text-white text-sm font-bold">אשר פסילה</button>
											<button onclick={() => (disqualifyingId = null)} class="px-4 py-2 rounded bg-black/5 hover:bg-black/10 text-gray-700 border border-[#d4be7f] text-sm font-bold">ביטול</button>
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>

		{:else if activeTab === 'hearing-requests'}
			<div class="space-y-3">
				<div class="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5">
					<h2 class="text-xl font-black text-orange-200 mb-2">📥 בקשות לפתיחת דיון</h2>
					<p class="text-sm text-gray-300">
						בקשות שנשלחו דרך /request-hearing. אשר בקשה, דחה, או צור דיון בלשונית "דיונים" על בסיסה.
					</p>
				</div>
				{#if hearingRequests.length === 0}
					<div class="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-gray-400">
						אין בקשות
					</div>
				{:else}
					{#each hearingRequests as r (r.documentId)}
						<div class="rounded-xl border border-orange-400/30 bg-orange-500/5 p-4">
							<div class="flex items-start justify-between gap-3 flex-wrap mb-2">
								<div>
									<div class="font-bold text-white">{r.requesterName}</div>
									{#if r.requesterPhone}<div class="text-xs text-gray-400" dir="ltr">{r.requesterPhone}</div>{/if}
									{#if r.requesterEmail}<div class="text-xs text-gray-400" dir="ltr">{r.requesterEmail}</div>{/if}
								</div>
								<span class="text-xs px-2 py-1 rounded-full bg-orange-500/30 text-orange-100">{r.status}</span>
							</div>
							{#if r.oppositeParty}
								<p class="text-sm text-gray-300">נגד: <strong>{r.oppositeParty}</strong></p>
							{/if}
							<p class="text-sm text-gray-200 whitespace-pre-line my-2">{r.caseDescription}</p>
							{#if r.amount}<p class="text-xs text-orange-200">סכום: {r.amount}</p>{/if}
							<div class="flex gap-2 mt-3 flex-wrap">
								{#if r.status === 'pending'}
									<button onclick={() => doRequestStatus(r.documentId, 'accepted')} class="px-3 py-1.5 rounded bg-green-600 text-white text-xs font-bold">✓ אשר</button>
									<button onclick={() => doRequestStatus(r.documentId, 'rejected')} class="px-3 py-1.5 rounded bg-red-600 text-white text-xs font-bold">✗ דחה</button>
								{/if}
								<button onclick={() => doRequestStatus(r.documentId, 'scheduled')} class="px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-bold">📅 סמן כמתוכנן</button>
								<button onclick={() => doDeleteRequest(r.documentId)} class="px-3 py-1.5 rounded bg-white/5 hover:bg-white/15 text-gray-300 text-xs font-bold">מחק</button>
							</div>
						</div>
					{/each}
				{/if}
			</div>

		{:else if activeTab === 'hearings'}
			<div class="space-y-6">
				<div class="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 md:p-6">
					<h2 class="text-xl font-black text-blue-200 mb-4">
						{hearingEditingId ? '✏️ עריכת דיון' : '➕ דיון חדש'}
					</h2>
					<form onsubmit={submitHearing} class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5">שם תיק *</label>
							<input type="text" bind:value={hearingCaseName} placeholder="תיק 005/2026 - סכסוך שותפים" class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" />
						</div>
						<div><label class="block text-sm font-bold text-gray-300 mb-1.5">דיין 1</label>
							<input type="text" bind:value={hearingDayan1} class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" /></div>
						<div><label class="block text-sm font-bold text-gray-300 mb-1.5">דיין 2</label>
							<input type="text" bind:value={hearingDayan2} class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" /></div>
						<div><label class="block text-sm font-bold text-gray-300 mb-1.5">דיין 3</label>
							<input type="text" bind:value={hearingDayan3} class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" /></div>
						<div><label class="block text-sm font-bold text-gray-300 mb-1.5">קישור Zoom</label>
							<input type="url" bind:value={hearingZoom} dir="ltr" placeholder="https://zoom.us/j/..." class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white text-right" /></div>
						<div><label class="block text-sm font-bold text-gray-300 mb-1.5">תאריך *</label>
							<input type="date" bind:value={hearingDate} class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" /></div>
						<div><label class="block text-sm font-bold text-gray-300 mb-1.5">שעה</label>
							<input type="time" bind:value={hearingTime} class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" /></div>
						<div><label class="block text-sm font-bold text-gray-300 mb-1.5">סטטוס</label>
							<select bind:value={hearingStatus} class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white">
								<option class="bg-gray-900" value="מתוכנן">מתוכנן</option>
								<option class="bg-gray-900" value="התקיים">התקיים</option>
								<option class="bg-gray-900" value="בוטל">בוטל</option>
							</select></div>
						{#if hearingNotice}
							<p class="md:col-span-2 text-sm font-bold {hearingNotice.startsWith('✅') ? 'text-green-300' : 'text-yellow-300'}">{hearingNotice}</p>
						{/if}
						<div class="md:col-span-2 flex gap-2 flex-wrap">
							<button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black">
								{hearingEditingId ? 'שמור' : 'הוסף דיון'}
							</button>
							{#if hearingEditingId}
								<button type="button" onclick={clearHearingForm} class="px-4 py-2 rounded-xl bg-white/10 text-white font-bold">ביטול</button>
							{/if}
						</div>
					</form>
				</div>

				<div class="space-y-2">
					{#each hearings as h ((h as any).documentId ?? h.id)}
						<div class="rounded-xl border border-blue-400/30 bg-blue-500/5 p-4">
							<div class="flex items-start justify-between gap-3 flex-wrap">
								<div class="min-w-0 flex-1">
									<p class="font-bold text-white">{fmtAny(h.caseName)}</p>
									<p class="text-xs text-gray-300 mt-1">{h.date} · {h.time} · {h.status}</p>
									<p class="text-xs text-gray-400 mt-0.5">{h.dayanim?.map(fmtAny).filter(Boolean).join(' · ')}</p>
									{#if h.zoomLink}
										<a href={h.zoomLink} target="_blank" rel="noopener" class="text-xs text-blue-300 hover:text-blue-200 underline" dir="ltr">{h.zoomLink}</a>
									{/if}
								</div>
								<div class="flex gap-1 flex-shrink-0">
									<button onclick={() => startEditHearing(h as any)} class="px-3 py-1.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-xs font-bold">ערוך</button>
									<button onclick={() => doDeleteHearing((h as any).documentId ?? h.id)} class="px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold">מחק</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

		{:else if activeTab === 'rulings'}
			<div class="space-y-6">
				<div class="rounded-2xl border border-green-500/30 bg-green-500/5 p-5 md:p-6">
					<h2 class="text-xl font-black text-green-200 mb-4">📜 פרסם פסק דין חדש</h2>
					<form onsubmit={submitRuling} class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5">מזהה תיק (אופציונלי)</label>
							<input type="text" bind:value={rulingCaseRef} placeholder="h-2026-003" class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" />
						</div>
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5">שם תיק *</label>
							<input type="text" bind:value={rulingCaseName} class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" />
						</div>
						<div><label class="block text-sm font-bold text-gray-300 mb-1.5">דיין 1</label>
							<input type="text" bind:value={rulingDayan1} class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" /></div>
						<div><label class="block text-sm font-bold text-gray-300 mb-1.5">דיין 2</label>
							<input type="text" bind:value={rulingDayan2} class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" /></div>
						<div><label class="block text-sm font-bold text-gray-300 mb-1.5">דיין 3</label>
							<input type="text" bind:value={rulingDayan3} class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" /></div>
						<div><label class="block text-sm font-bold text-gray-300 mb-1.5">תאריך *</label>
							<input type="date" bind:value={rulingDate} class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white" /></div>
						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5">סיכום הדיון *</label>
							<textarea bind:value={rulingSummary} rows="3" class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white resize-y"></textarea>
						</div>
						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5">החלטה *</label>
							<textarea bind:value={rulingDecision} rows="3" class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white resize-y"></textarea>
						</div>
						{#if rulingNotice}
							<p class="md:col-span-2 text-sm font-bold {rulingNotice.startsWith('✅') ? 'text-green-300' : 'text-yellow-300'}">{rulingNotice}</p>
						{/if}
						<div class="md:col-span-2">
							<button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black">פרסם פסק דין</button>
						</div>
					</form>
				</div>

				<div class="space-y-2">
					{#each rulings as r ((r as any).documentId ?? r.id)}
						<div class="rounded-xl border border-green-400/30 bg-green-500/5 p-4">
							<div class="flex items-start justify-between gap-3 flex-wrap">
								<div class="min-w-0 flex-1">
									<p class="font-bold text-white">{fmtAny(r.caseName)}</p>
									<p class="text-xs text-gray-300 mt-1">{r.date} · {r.dayanim?.map(fmtAny).filter(Boolean).join(' · ')}</p>
									<p class="text-sm text-gray-200 mt-2 line-clamp-2">{fmtAny(r.summary)}</p>
								</div>
								<button onclick={() => doDeleteRuling((r as any).documentId ?? r.id)} class="px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold">מחק</button>
							</div>
						</div>
					{/each}
				</div>
			</div>

		{:else if activeTab === 'articles'}
			<div class="space-y-6">
				<!-- טופס הוספה -->
				<div class="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 md:p-6">
					<h2 class="text-xl font-black text-blue-200 mb-4">➕ הוספת מאמר חדש</h2>
					<form onsubmit={submitArticle} class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="art-title">כותרת *</label>
							<input
								id="art-title"
								type="text"
								bind:value={artTitle}
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="art-author">מחבר *</label>
							<input
								id="art-author"
								type="text"
								bind:value={artAuthor}
								placeholder="הרב פלוני אלמוני"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="art-date">תאריך</label>
							<input
								id="art-date"
								type="date"
								bind:value={artDate}
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
							/>
						</div>
						<div class="md:row-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5">אושר על ידי 3 רבנים *</label>
							<input
								type="text"
								bind:value={artApprover1}
								placeholder="רב מאשר 1"
								class="w-full px-3 py-2 mb-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
							/>
							<input
								type="text"
								bind:value={artApprover2}
								placeholder="רב מאשר 2"
								class="w-full px-3 py-2 mb-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
							/>
							<input
								type="text"
								bind:value={artApprover3}
								placeholder="רב מאשר 3"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
							/>
						</div>
						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="art-excerpt">תקציר *</label>
							<textarea
								id="art-excerpt"
								bind:value={artExcerpt}
								rows="2"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none resize-y"
							></textarea>
						</div>
						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="art-body">גוף המאמר *</label>
							<textarea
								id="art-body"
								bind:value={artBody}
								rows="8"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none resize-y"
							></textarea>
						</div>

						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="art-tags">
								🏷️ תגיות (לאיתור קל בחיפוש)
							</label>
							<input
								id="art-tags"
								type="text"
								bind:value={artTags}
								placeholder="#שבטאפרים #גיור #עשרתהשבטים #שבטיםאבודים"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
							/>
							<p class="mt-1 text-xs text-gray-500">הפרד תגיות ברווח, פסיק או #. סימן ה-# אינו חובה.</p>
							{#if artTags.trim()}
								<div class="mt-2 flex flex-wrap gap-1.5">
									{#each parseTags(artTags) as tag}
										<span class="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold">
											#{tag}
										</span>
									{/each}
								</div>
							{/if}
						</div>

						{#if artNotice}
							<p class="md:col-span-2 text-sm font-bold {artNotice.startsWith('✅') ? 'text-green-300' : 'text-yellow-300'}">
								{artNotice}
							</p>
						{/if}

						<div class="md:col-span-2">
							<button
								type="submit"
								class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black hover:opacity-90 transition-opacity"
							>
								פרסם מאמר
							</button>
						</div>
					</form>
				</div>

				<!-- רשימת מאמרים שנוספו -->
				<div class="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
					<h2 class="text-xl font-black text-white mb-4">📝 מאמרים שהוספת ({customArticles.length})</h2>
					{#if customArticles.length === 0}
						<p class="text-gray-400 text-sm">עוד לא הוספת מאמרים. הוסף מאמר חדש בטופס למעלה.</p>
					{:else}
						<div class="space-y-2">
							{#each customArticles as a}
								<div class="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
									<div class="min-w-0 flex-1">
										<div class="font-bold text-white text-sm">{a.title}</div>
										<div class="text-xs text-gray-400">{a.author} • {a.date}</div>
										{#if a.tags && a.tags.length > 0}
											<div class="mt-1.5 flex flex-wrap gap-1">
												{#each a.tags as tag}
													<span class="px-1.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-[10px] font-bold">
														#{tag}
													</span>
												{/each}
											</div>
										{/if}
									</div>
									<button
										onclick={() => deleteCustomArticle(a.slug)}
										class="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold flex-shrink-0"
									>
										מחק
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- מאמרי מערכת (לקריאה בלבד) -->
				<div class="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
					<h2 class="text-base font-bold text-gray-300 mb-3">📦 מאמרי מערכת ({staticArticles.length}) - לקריאה בלבד</h2>
					<div class="space-y-1.5">
						{#each staticArticles as a}
							<div class="text-xs text-gray-400 border-b border-white/5 pb-1.5">
								{a.title} <span class="text-gray-600">- {a.author}, {a.date}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else if activeTab === 'videos'}
			<div class="space-y-6">
				<!-- סרטון בדף הבית -->
				<div class="rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 p-5 md:p-6">
					<h2 class="text-xl font-black text-cyan-200 mb-2">🎥 סרטון יוטיוב בדף הבית</h2>
					<p class="text-sm text-gray-300 mb-4">
						הסרטון יוצג מתחת לכותרת "📡 הפעילות שלנו" בדף הבית. ניתן להזין קישור רגיל מיוטיוב - הוא יומר אוטומטית להטמעה.
					</p>
					<form onsubmit={saveHomeVideo} class="space-y-3">
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="home-vid-title">כותרת מעל הסרטון</label>
							<input
								id="home-vid-title"
								type="text"
								bind:value={homeVideoTitle}
								placeholder="לדוגמה: חכמי עדת ישראל פועלים להעלות שבטים אבודים לארץ"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-cyan-400 focus:outline-none text-right"
							/>
							<p class="text-xs text-gray-500 mt-1">
								הכותרת תוצג מעל הסרטון בדף הבית. השאר ריק כדי להסתיר.
							</p>
						</div>
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="home-vid-url">קישור ליוטיוב</label>
							<input
								id="home-vid-url"
								type="url"
								bind:value={homeVideoUrl}
								dir="ltr"
								placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-cyan-400 focus:outline-none text-right"
							/>
							<p class="text-xs text-gray-500 mt-1">
								תומך בפורמטים: youtube.com/watch?v=… , youtu.be/… , youtube.com/embed/… , youtube.com/shorts/…
							</p>
						</div>

						{#if homeVideoUrl.trim()}
							<div class="rounded-lg border border-white/10 bg-black/30 p-3">
								<p class="text-xs font-bold text-gray-400 mb-2">תצוגה מקדימה:</p>
								<div class="relative w-full max-w-md mx-auto" style="padding-top: 56.25%; max-width: 28rem;">
									<iframe
										src={toEmbedUrl(homeVideoUrl)}
										title="תצוגה מקדימה"
										class="absolute inset-0 w-full h-full rounded"
										frameborder="0"
										allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
										allowfullscreen
									></iframe>
								</div>
								<p class="text-xs text-gray-500 mt-2 break-all" dir="ltr">{toEmbedUrl(homeVideoUrl)}</p>
							</div>
						{/if}

						{#if homeVideoNotice}
							<p class="text-sm font-bold {homeVideoNotice.startsWith('✅') ? 'text-green-300' : 'text-yellow-300'}">
								{homeVideoNotice}
							</p>
						{/if}

						<div class="flex gap-2 flex-wrap">
							<button
								type="submit"
								class="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-black hover:opacity-90 transition-opacity"
							>
								שמור
							</button>
							{#if homeVideoUrl.trim()}
								<button
									type="button"
									onclick={clearHomeVideo}
									class="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 font-bold"
								>
									הסר סרטון
								</button>
							{/if}
						</div>
					</form>
				</div>

				<!-- טופס הוספה -->
				<div class="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-5 md:p-6">
					<h2 class="text-xl font-black text-teal-200 mb-4">➕ הוספת סרטון / הודעה / כתבה</h2>
					<form onsubmit={submitActivity} class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-kind">סוג *</label>
							<select
								id="vid-kind"
								bind:value={vidKind}
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-teal-400 focus:outline-none"
							>
								<option class="bg-gray-900" value="סרטון">🎬 סרטון</option>
								<option class="bg-gray-900" value="הודעה">📣 הודעה</option>
								<option class="bg-gray-900" value="כתבה">📰 כתבה</option>
							</select>
						</div>
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-date">תאריך</label>
							<input
								id="vid-date"
								type="date"
								bind:value={vidDate}
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-teal-400 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-title">כותרת *</label>
							<input
								id="vid-title"
								type="text"
								bind:value={vidTitle}
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-teal-400 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-author">מחבר *</label>
							<input
								id="vid-author"
								type="text"
								bind:value={vidAuthor}
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-teal-400 focus:outline-none"
							/>
						</div>

						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-url">
								קישור לסרטון יוטיוב {vidKind === 'סרטון' ? '*' : '(אופציונלי)'}
							</label>
							<input
								id="vid-url"
								type="url"
								bind:value={vidUrl}
								dir="ltr"
								placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-teal-400 focus:outline-none text-right"
							/>
							<p class="text-xs text-gray-500 mt-1">
								תומך בפורמטים: youtube.com/watch?v=… , youtu.be/… , youtube.com/embed/… , youtube.com/shorts/… - הקישור יומר אוטומטית להטמעה
							</p>
						</div>

						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-image-file">תמונה (העלאה)</label>
							<input
								id="vid-image-file"
								type="file"
								accept="image/*"
								onchange={onActivityImageFile}
								class="w-full text-sm text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-teal-500/30 file:text-teal-100 file:font-bold hover:file:bg-teal-500/40"
							/>
							<p class="text-xs text-gray-500 mt-1">התמונה תקטן ותישמר בדפדפן</p>
						</div>

						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-image-url">או הדבק קישור לתמונה</label>
							<input
								id="vid-image-url"
								type="text"
								bind:value={vidImageUrl}
								dir="ltr"
								placeholder="https://… או data:image/…"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-teal-400 focus:outline-none text-right"
							/>
						</div>

						{#if vidImageUrl}
							<div class="md:col-span-2 flex items-start gap-3">
								<div class="rounded-lg overflow-hidden border-2 border-teal-400/40 bg-black/30 max-w-[200px]">
									<img src={vidImageUrl} alt="תצוגה מקדימה" class="w-full h-auto object-contain" />
								</div>
								<button
									type="button"
									onclick={() => (vidImageUrl = '')}
									class="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold"
								>
									הסר תמונה
								</button>
							</div>
						{/if}

						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-source-url">קישור למקור / לכתבה המלאה (אופציונלי)</label>
							<input
								id="vid-source-url"
								type="url"
								bind:value={vidSourceUrl}
								dir="ltr"
								placeholder="https://..."
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-teal-400 focus:outline-none text-right"
							/>
						</div>

						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-excerpt">תקציר *</label>
							<textarea
								id="vid-excerpt"
								bind:value={vidExcerpt}
								rows="2"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-teal-400 focus:outline-none resize-y"
							></textarea>
						</div>
						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-body">תוכן הכתבה / תוכן נוסף (אופציונלי)</label>
							<textarea
								id="vid-body"
								bind:value={vidBody}
								rows="6"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-teal-400 focus:outline-none resize-y"
							></textarea>
						</div>

						{#if vidNotice}
							<p class="md:col-span-2 text-sm font-bold {vidNotice.startsWith('✅') ? 'text-green-300' : 'text-yellow-300'}">
								{vidNotice}
							</p>
						{/if}

						<div class="md:col-span-2">
							<button
								type="submit"
								class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-black hover:opacity-90 transition-opacity"
							>
								פרסם
							</button>
						</div>
					</form>
				</div>

				<!-- רשימה -->
				<div class="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
					<h2 class="text-xl font-black text-white mb-4">📋 פריטים שהוספת ({customActivity.length})</h2>
					{#if customActivity.length === 0}
						<p class="text-gray-400 text-sm">עוד לא הוספת סרטונים/הודעות.</p>
					{:else}
						<div class="space-y-2">
							{#each customActivity as v}
								<div class="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
									<div class="min-w-0">
										<div class="font-bold text-white text-sm">
											<span class="text-xs text-teal-300 ml-1">[{v.kind}]</span>
											{v.title}
										</div>
										<div class="text-xs text-gray-400">{v.author} • {v.date}</div>
									</div>
									<button
										onclick={() => deleteCustomActivity(v.slug)}
										class="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold flex-shrink-0"
									>
										מחק
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- פריטי מערכת -->
				<div class="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
					<h2 class="text-base font-bold text-gray-300 mb-3">📦 פעילות מערכת ({staticActivity.length}) - לקריאה בלבד</h2>
					<div class="space-y-1.5">
						{#each staticActivity as v}
							<div class="text-xs text-gray-400 border-b border-white/5 pb-1.5">
								<span class="text-gray-500">[{v.kind}]</span>
								{v.title}
								<span class="text-gray-600">- {v.author}, {v.date}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else if activeTab === 'news'}
			<div class="space-y-6">
				<!-- הסבר -->
				<div class="rounded-2xl border-2 border-blue-500/40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-5 md:p-6">
					<h2 class="text-xl font-black text-blue-200 mb-2">📰 ניהול טיקר החדשות</h2>
					<p class="text-sm text-gray-300 leading-relaxed">
						הטיקר בדף הבית מציג חדשות שמסונכרנות אוטומטית <strong class="text-blue-300">מהאתר "קהילה בשכונה"</strong> (סנכרון חד-כיווני).
					</p>
					<p class="text-sm text-gray-300 leading-relaxed mt-2">
						חדשות שתוסיף כאן יופיעו <strong class="text-amber-300">רק בחכמי העדה</strong>, יסומנו בתווית "חכמי העדה", ולא יסונכרנו חזרה לאתר קהילה בשכונה.
					</p>
				</div>

				<!-- טופס הוספה -->
				<div class="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 md:p-6">
					<h2 class="text-xl font-black text-blue-200 mb-4">➕ הוספת חדשה לוקאלית</h2>
					<form onsubmit={submitNews} class="grid grid-cols-1 gap-4">
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="news-title">כותרת *</label>
							<input
								id="news-title"
								type="text"
								bind:value={newsTitle}
								placeholder="למשל: בית הדין יישב ביום שלישי הקרוב"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="news-summary">שורת תיאור (אופציונלי)</label>
							<input
								id="news-summary"
								type="text"
								bind:value={newsSummary}
								placeholder="שורה משנית בטיקר"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="news-url">קישור (אופציונלי)</label>
							<input
								id="news-url"
								type="url"
								bind:value={newsSourceUrl}
								dir="ltr"
								placeholder="https://..."
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none text-right"
							/>
						</div>

						{#if newsNotice}
							<p class="text-sm font-bold {newsNotice.startsWith('✅') ? 'text-green-300' : 'text-yellow-300'}">
								{newsNotice}
							</p>
						{/if}

						<div>
							<button
								type="submit"
								class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black hover:opacity-90 transition-opacity"
							>
								הוסף לטיקר
							</button>
						</div>
					</form>
				</div>

				<!-- רשימת חדשות לוקאליות -->
				<div class="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
					<h2 class="text-xl font-black text-white mb-4">📋 חדשות לוקאליות ({customNews.length})</h2>
					{#if customNews.length === 0}
						<p class="text-gray-400 text-sm">עוד לא הוספת חדשות לוקאליות. הוסף חדשה בטופס למעלה.</p>
					{:else}
						<div class="space-y-2">
							{#each customNews as n}
								<div class="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
									<div class="min-w-0 flex-1">
										<div class="font-bold text-white text-sm">{n.title}</div>
										{#if n.summary}
											<div class="text-xs text-gray-300 mt-0.5">{n.summary}</div>
										{/if}
										<div class="text-xs text-gray-500 mt-1">{n.date}</div>
									</div>
									<button
										onclick={() => deleteCustomNews(n.id)}
										class="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold flex-shrink-0"
									>
										מחק
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{:else if activeTab === 'rabbis'}
			<div class="space-y-6">
				<!-- הסבר -->
				<div class="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 p-5 md:p-6">
					<h2 class="text-xl font-black text-amber-200 mb-2">👤 ניהול דיינים</h2>
					<p class="text-sm text-gray-300 leading-relaxed">
						הרשימה והתמונות מופיעות בדף <strong class="text-amber-300">"אודותנו"</strong>. אם לא מועלת תמונה לדיין, מוצגת דמות אנונימית כברירת מחדל.
					</p>
				</div>

				<!-- טופס הוספה/עריכה -->
				<div class="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 md:p-6">
					<h2 class="text-xl font-black text-amber-200 mb-4">
						{editingRabbiId ? '✏️ עריכת דיין' : '➕ הוספת דיין חדש'}
					</h2>
					<form onsubmit={submitRabbi} class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="rab-name">שם *</label>
							<input
								id="rab-name"
								type="text"
								bind:value={rabbiName}
								placeholder="הרב פלוני אלמוני"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-amber-400 focus:outline-none"
							/>
						</div>

						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="rab-title">תואר</label>
							<input
								id="rab-title"
								type="text"
								bind:value={rabbiTitle}
								placeholder="ראש ישיבה, אב בית דין…"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-amber-400 focus:outline-none"
							/>
						</div>

						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="rab-nickname">כינוי</label>
							<input
								id="rab-nickname"
								type="text"
								bind:value={rabbiNickname}
								placeholder="כינוי או שם מוכר"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-amber-400 focus:outline-none"
							/>
						</div>

						<div class="md:col-span-2">
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="rab-city">עיר מגורים</label>
							<input
								id="rab-city"
								type="text"
								bind:value={rabbiCity}
								placeholder="ירושלים, בני ברק…"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-amber-400 focus:outline-none"
							/>
						</div>

						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="rab-photo-file">תמונה (העלאה)</label>
							<input
								id="rab-photo-file"
								type="file"
								accept="image/*"
								onchange={onRabbiPhotoFile}
								class="w-full text-sm text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-amber-500/30 file:text-amber-900 file:font-bold hover:file:bg-amber-500/40"
							/>
							<p class="text-xs text-gray-500 mt-1">התמונה תקטן אוטומטית ותישמר בדפדפן</p>
						</div>

						<div>
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="rab-photo-url">או הדבק קישור</label>
							<input
								id="rab-photo-url"
								type="text"
								bind:value={rabbiPhotoUrl}
								dir="ltr"
								placeholder="https://… או data:image/…"
								class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-amber-400 focus:outline-none text-right"
							/>
						</div>

						{#if rabbiPhotoUrl}
							<div class="md:col-span-2 flex items-center gap-3">
								<div class="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400/40 bg-black/30">
									<img src={rabbiPhotoUrl} alt="תצוגה מקדימה" class="w-full h-full object-cover" />
								</div>
								<button
									type="button"
									onclick={() => (rabbiPhotoUrl = '')}
									class="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold"
								>
									הסר תמונה
								</button>
							</div>
						{/if}

						{#if rabbiNotice}
							<p class="md:col-span-2 text-sm font-bold {rabbiNotice.startsWith('✅') ? 'text-green-300' : 'text-yellow-300'}">
								{rabbiNotice}
							</p>
						{/if}

						<div class="md:col-span-2 flex gap-2 flex-wrap">
							<button
								type="submit"
								class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-black hover:opacity-90 transition-opacity"
							>
								{editingRabbiId ? 'שמור שינויים' : 'הוסף דיין'}
							</button>
							{#if editingRabbiId}
								<button
									type="button"
									onclick={cancelEditRabbi}
									class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
								>
									ביטול
								</button>
							{/if}
						</div>
					</form>
				</div>

				<!-- רשימת דיינים -->
				<div class="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
					<div class="flex items-center justify-between gap-3 flex-wrap mb-4">
						<h2 class="text-xl font-black text-white">📋 דיינים ({rabbis.length})</h2>
						<button
							type="button"
							onclick={resetRabbisToDefault}
							class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold"
						>
							אפס לברירת מחדל
						</button>
					</div>
					{#if rabbis.length === 0}
						<p class="text-gray-400 text-sm">אין דיינים. הוסף דיין חדש בטופס למעלה.</p>
					{:else}
						<div class="grid grid-cols-1 gap-2">
							{#each rabbis as r, i (r.id)}
								<div class="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
									<div class="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-amber-200/20 to-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center flex-shrink-0">
										{#if r.photo}
											<img src={r.photo} alt={r.name} class="w-full h-full object-cover" />
										{:else}
											<svg viewBox="0 0 64 64" class="w-full h-full text-amber-300/70" fill="currentColor" aria-hidden="true">
												<circle cx="32" cy="24" r="12" />
												<path d="M12 60c0-11 9-20 20-20s20 9 20 20v4H12v-4z" />
											</svg>
										{/if}
									</div>
									<div class="min-w-0 flex-1">
										<div class="font-bold text-white text-sm">{r.name}</div>
										{#if r.title || r.nickname || r.city}
											<div class="text-xs text-gray-300 mt-0.5 flex flex-wrap gap-x-2">
												{#if r.title}<span>{r.title}</span>{/if}
												{#if r.nickname}<span class="italic">"{r.nickname}"</span>{/if}
												{#if r.city}<span>📍 {r.city}</span>{/if}
											</div>
										{/if}
										<div class="text-xs text-gray-500 mt-0.5">{r.photo ? '🖼️ יש תמונה' : '○ דמות אנונימית'}</div>
									</div>
									<div class="flex items-center gap-1 flex-shrink-0">
										<button
											type="button"
											onclick={() => moveRabbi(r.id, -1)}
											disabled={i === 0}
											class="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-gray-200 text-xs font-bold disabled:opacity-30"
											title="הזז למעלה"
										>↑</button>
										<button
											type="button"
											onclick={() => moveRabbi(r.id, 1)}
											disabled={i === rabbis.length - 1}
											class="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-gray-200 text-xs font-bold disabled:opacity-30"
											title="הזז למטה"
										>↓</button>
										{#if r.photo}
											<button
												type="button"
												onclick={() => removeRabbiPhoto(r.id)}
												class="px-2 py-1 rounded bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-200 text-xs font-bold"
												title="הסר תמונה"
											>🖼️✕</button>
										{/if}
										<button
											type="button"
											onclick={() => editRabbi(r)}
											class="px-3 py-1.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-xs font-bold"
										>ערוך</button>
										<button
											type="button"
											onclick={() => deleteRabbi(r.id)}
											class="px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold"
										>מחק</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{:else if activeTab === 'dates'}
			<div class="space-y-4">
				<div class="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5">
					<h2 class="text-xl font-black text-yellow-200 mb-2">📅 בקשות תאריך הממתינות לאישור בית הדין</h2>
					<p class="text-sm text-gray-300">
						בכל בקשת דיון יש לאשר את התאריך מטעם בית הדין כדי שייקבע ביומן. כאן מופיעות כל הבקשות שעדיין לא אושרו על ידי בית הדין.
					</p>
				</div>

				{#if pendingCases.length === 0}
					<div class="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
						<div class="text-4xl mb-2">📭</div>
						<p class="text-gray-300">אין בקשות במערכת</p>
						<p class="text-xs text-gray-500 mt-1">בקשות חדשות שייפתחו דרך "בקשת דיון" יופיעו כאן</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each pendingCases as c}
							{@const isApproved = c?.approvals?.beitDin === true}
							<div
								class="rounded-xl border p-4 md:p-5 {isApproved
									? 'border-green-400/60 bg-green-500/5'
									: 'border-yellow-400/60 bg-yellow-500/5'}"
							>
								<div class="flex items-start justify-between gap-3 flex-wrap mb-3">
									<div class="min-w-0">
										<div class="flex items-center gap-2 flex-wrap">
											<span class="text-base font-black text-white">תיק #{c.id}</span>
											{#if c.nickname}
												<span class="text-sm text-gray-300">- {c.nickname}</span>
											{/if}
										</div>
										{#if c.subject}
											<div class="text-sm text-gray-400 mt-0.5">{c.subject}</div>
										{/if}
									</div>
									{#if isApproved}
										<span class="px-3 py-1 rounded-full bg-green-500/20 border border-green-400/40 text-green-200 text-xs font-bold flex-shrink-0">
											✓ בית הדין אישר
										</span>
									{:else}
										<span class="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/40 text-yellow-200 text-xs font-bold flex-shrink-0">
											⏳ ממתין לאישור
										</span>
									{/if}
								</div>

								<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
									<div class="rounded-lg bg-black/20 p-3">
										<div class="text-xs text-gray-500 mb-0.5">תובע</div>
										<div class="text-white font-bold">{c.plaintiffName || '-'}</div>
										{#if c.plaintiffPhone}
											<div class="text-xs text-gray-400" dir="ltr">{c.plaintiffPhone}</div>
										{/if}
									</div>
									<div class="rounded-lg bg-black/20 p-3">
										<div class="text-xs text-gray-500 mb-0.5">נתבע</div>
										<div class="text-white font-bold">{c.defendantName || '-'}</div>
										{#if c.defendantPhone}
											<div class="text-xs text-gray-400" dir="ltr">{c.defendantPhone}</div>
										{/if}
									</div>
								</div>

								<div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
									<div class="rounded-lg bg-black/20 p-2 text-center">
										<div class="text-gray-500">תאריך מוצע</div>
										<div class="text-yellow-200 font-bold mt-0.5">{c.proposedDate || '-'}</div>
									</div>
									<div class="rounded-lg bg-black/20 p-2 text-center">
										<div class="text-gray-500">תובע</div>
										<div class="font-bold mt-0.5 {c.approvals?.plaintiff ? 'text-green-300' : 'text-gray-500'}">
											{c.approvals?.plaintiff ? '✓' : '-'}
										</div>
									</div>
									<div class="rounded-lg bg-black/20 p-2 text-center">
										<div class="text-gray-500">נתבע</div>
										<div class="font-bold mt-0.5 {c.approvals?.defendant ? 'text-green-300' : 'text-gray-500'}">
											{c.approvals?.defendant ? '✓' : '-'}
										</div>
									</div>
									<div class="rounded-lg bg-black/20 p-2 text-center">
										<div class="text-gray-500">בית הדין</div>
										<div class="font-bold mt-0.5 {c.approvals?.beitDin ? 'text-green-300' : 'text-gray-500'}">
											{c.approvals?.beitDin ? '✓' : '-'}
										</div>
									</div>
								</div>

								{#if c.details}
									<details class="text-sm text-gray-300 mb-3">
										<summary class="cursor-pointer text-blue-300 hover:text-blue-200">פרטי הסכסוך</summary>
										<p class="mt-2 whitespace-pre-line">{c.details}</p>
									</details>
								{/if}

								{#if !isApproved}
									<div class="flex gap-2 flex-wrap">
										<button
											onclick={() => approveCase(c.id)}
											class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold"
										>
											✓ אשר תאריך
										</button>
										<button
											onclick={() => rejectCase(c.id)}
											class="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm font-bold"
										>
											דחה
										</button>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else if activeTab === 'admins'}
			<!-- ───────────── ניהול אדמינים (סופר-אדמין) ───────────── -->
			<div class="space-y-4">
				<div class="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
					<h2 class="text-xl font-black text-amber-200 mb-2">🛡️ ניהול אדמינים</h2>
					<p class="text-sm text-gray-300">
						אדמין תוכן יכול להעלות תוכן בכל ההיכלות ולאשר תאריכי דיונים — השינויים שלו נכנסים לאתר מיד.
						ניהול חתימות האמנה ומינוי אדמינים נשארים לסופר-אדמין בלבד.
					</p>
				</div>

				{#if adminsNotice}
					<div class="rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-gray-100">{adminsNotice}</div>
				{/if}

				<div class="rounded-xl border border-white/10 bg-white/5 p-4">
					<h3 class="font-bold text-white text-sm mb-2">מינוי אדמין חדש</h3>
					<p class="text-xs text-gray-500 mb-2">המשתמש חייב להיות רשום לאתר. חיפוש לפי אימייל או שם.</p>
					<form onsubmit={(e) => { e.preventDefault(); searchAdminUsers(); }} class="flex gap-2 flex-wrap">
						<input
							bind:value={adminSearch}
							placeholder="אימייל או שם משתמש…"
							class="flex-1 min-w-[220px] px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white text-sm placeholder:text-gray-500"
						/>
						<button
							type="submit"
							disabled={adminSearching}
							class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold disabled:opacity-50"
						>
							{adminSearching ? 'מחפש…' : 'חיפוש'}
						</button>
					</form>
					{#if adminSearchResults.length > 0}
						<div class="mt-3 space-y-2">
							{#each adminSearchResults as u (u.id)}
								<div class="flex items-center justify-between gap-3 rounded-lg bg-black/20 px-3 py-2">
									<div class="min-w-0 text-sm">
										<span class="text-white font-bold">{friendlyName(u) || u.email}</span>
										<span class="text-gray-400" dir="ltr"> · {u.email}</span>
										{#if u.app_role === 'super_admin'}
											<span class="text-amber-300 text-xs font-bold"> 👑 סופר-אדמין</span>
										{:else if u.app_role === 'ch_admin'}
											<span class="text-blue-300 text-xs font-bold"> 🛠️ אדמין תוכן</span>
										{/if}
									</div>
									{#if u.app_role === 'ch_admin'}
										<button
											onclick={() => doSetAdminRole(u.email, 'user')}
											class="px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold flex-shrink-0"
										>
											הסר הרשאה
										</button>
									{:else if u.app_role !== 'super_admin'}
										<button
											onclick={() => doSetAdminRole(u.email, 'ch_admin')}
											class="px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex-shrink-0"
										>
											מנה לאדמין תוכן
										</button>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<div class="rounded-xl border border-white/10 bg-white/5 p-4">
					<h3 class="font-bold text-white text-sm mb-2">אדמינים קיימים</h3>
					{#if adminsList.length === 0}
						<p class="text-sm text-gray-400">אין עדיין אדמינים נוספים — מנה אחד דרך החיפוש למעלה</p>
					{:else}
						<div class="space-y-2">
							{#each adminsList as u (u.id)}
								<div class="flex items-center justify-between gap-3 rounded-lg bg-black/20 px-3 py-2">
									<div class="min-w-0 text-sm">
										<span class="text-white font-bold">{friendlyName(u) || u.email}</span>
										<span class="text-gray-400" dir="ltr"> · {u.email}</span>
										{#if u.app_role === 'super_admin'}
											<span class="text-amber-300 text-xs font-bold"> 👑 סופר-אדמין</span>
										{:else}
											<span class="text-blue-300 text-xs font-bold"> 🛠️ אדמין תוכן</span>
										{/if}
									</div>
									{#if u.app_role !== 'super_admin'}
										<button
											onclick={() => doSetAdminRole(u.email, 'user')}
											class="px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold flex-shrink-0"
										>
											הסר הרשאה
										</button>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{:else if activeTab === 'users'}
			<!-- ───────────── רשימת הרשומים (סופר-אדמין) ───────────── -->
			<div class="space-y-3">
				{#if adminsNotice}
					<div class="rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-gray-100">{adminsNotice}</div>
				{/if}

				<input
					bind:value={usersFilter}
					placeholder="סינון לפי שם / אימייל / עיר / טלפון…"
					class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white text-sm placeholder:text-gray-500"
				/>

				<!-- שורת משתמש כטבלה: כל שדה בטור נפרד, מיושר בין השורות, עם מפריד אנכי עדין בגבול הימני של כל טור -->
				{#snippet userRow(u: RegisteredUser)}
					<div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_7.5rem] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,0.9fr)_7.5rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_7.5rem] text-xs hover:bg-white/5">
						<!-- שם -->
						<div class="flex items-center min-w-0 px-2.5 py-1.5">
							<span class="text-gray-100 font-bold truncate">{friendlyName(u) || '—'}</span>
						</div>
						<!-- אימייל -->
						<div class="flex items-center min-w-0 px-2.5 py-1.5 border-r border-white/10">
							<span class="text-gray-400 truncate" dir="ltr">{u.email}</span>
						</div>
						<!-- עיר -->
						<div class="hidden sm:flex items-center min-w-0 px-2.5 py-1.5 border-r border-white/10">
							<span class="text-gray-500 truncate">{u.city || '—'}</span>
						</div>
						<!-- טלפון -->
						<div class="hidden md:flex items-center min-w-0 px-2.5 py-1.5 border-r border-white/10">
							<span class="text-gray-500 truncate" dir="ltr">{u.phone || '—'}</span>
						</div>
						<!-- סטטוס + פעולה -->
						<div class="flex items-center gap-1.5 px-2.5 py-1.5 border-r border-white/10">
							{#if u.app_role === 'super_admin'}
								<span class="flex-shrink-0" title="סופר-אדמין">👑</span>
							{:else if u.app_role === 'ch_admin'}
								<span class="flex-shrink-0" title="אדמין תוכן">🛠️</span>
							{/if}
							{#if u.blocked}<span class="flex-shrink-0" title="חסום">🚫</span>{/if}
							{#if u.app_role === 'ch_admin'}
								<button
									onclick={() => doSetAdminRole(u.email, 'user')}
									class="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-[11px] font-bold flex-shrink-0"
								>הסר</button>
							{:else if u.app_role !== 'super_admin'}
								<button
									onclick={() => doSetAdminRole(u.email, 'ch_admin')}
									class="px-2 py-0.5 rounded bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold flex-shrink-0"
								>מנה</button>
							{/if}
						</div>
					</div>
				{/snippet}

				{#if usersLoading && !usersLoaded}
					<div class="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">⏳ טוען רשומים…</div>
				{:else if usersLoaded}
					<!-- קבוצה 1: משתמשי חכמי העדה (מי שביצע פעולה באתר) -->
					<div class="flex items-center gap-2 px-1">
						<h3 class="text-lg font-black text-emerald-200">משתמשי חכמי העדה</h3>
						<span class="text-xs text-gray-500">{filteredCommunity.length}{usersFilter.trim() ? ` / ${communityUsers.length}` : ''}</span>
					</div>
					{#if communityUsers.length === 0}
						<div class="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-xs text-gray-400">אין עדיין משתמשים עם פעילות באתר</div>
					{:else}
						<div class="rounded-xl border border-emerald-500/20 bg-white/5 divide-y divide-white/5 overflow-hidden">
							{#each filteredCommunity as u (u.id)}
								{@render userRow(u)}
							{/each}
						</div>
					{/if}

					<!-- קבוצה 2: שאר הרשומים (מאתרי gofreeil אחרים) — נטענים בלחיצה -->
					{#if !othersLoaded}
						<button
							onclick={() => loadOtherUsers()}
							disabled={othersLoading || othersCount === 0}
							class="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-bold text-gray-200 disabled:opacity-50 transition-colors"
						>
							{othersLoading ? '⏳ טוען…' : othersCount === 0 ? 'אין רשומים נוספים' : `לשאר הרשומים (${othersCount}) ⌄`}
						</button>
					{:else}
						<div class="flex items-center gap-2 px-1 pt-1">
							<h3 class="text-lg font-black text-gray-300">רשומים מאתרים אחרים</h3>
							<span class="text-xs text-gray-500">{filteredOthers.length}{usersFilter.trim() ? ` / ${otherUsers.length}` : ''}</span>
						</div>
						{#if otherUsers.length === 0}
							<div class="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-xs text-gray-400">אין רשומים נוספים</div>
						{:else}
							<div class="rounded-xl border border-white/10 bg-white/5 divide-y divide-white/5 overflow-hidden">
								{#each filteredOthers as u (u.id)}
									{@render userRow(u)}
								{/each}
							</div>
						{/if}
					{/if}
				{/if}
			</div>
		{/if}
	</section>

	<!-- ────────────── דיאלוג אישור מעוצב (במקום confirm() של הדפדפן) ────────────── -->
	{#if confirmDialog}
		<div class="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
			<!-- רקע כהה — לחיצה עליו = ביטול -->
			<button
				type="button"
				aria-label="ביטול"
				class="absolute inset-0 bg-black/60"
				onclick={() => closeConfirm(false)}
			></button>
			<div
				role="dialog"
				aria-modal="true"
				class="relative w-full max-w-sm rounded-2xl border border-white/10 bg-gray-900 p-6 text-center shadow-2xl"
			>
				<p class="text-base font-bold leading-relaxed text-gray-100 whitespace-pre-line">{confirmDialog.message}</p>
				<div class="mt-6 flex gap-3">
					<button
						type="button"
						onclick={() => closeConfirm(false)}
						class="flex-1 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-bold text-gray-200 transition-colors"
					>
						ביטול
					</button>
					<button
						type="button"
						onclick={() => closeConfirm(true)}
						class="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-bold text-white transition-colors"
					>
						אישור
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}
