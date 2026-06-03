<script lang="ts">
	import { onMount } from 'svelte';
	import { articles as staticArticles, type Article } from '$lib/data/articles';
	import { activity as staticActivity, type ActivityItem } from '$lib/data/activity';
	import { defaultRabbis, RABBIS_STORAGE_KEY, type Rabbi } from '$lib/data/rabbis';

	// 🔑 סיסמת אדמין - לשנות כאן ידנית. מי שיודע את הסיסמה יכול להיכנס.
	const ADMIN_PASSWORD = 'chachmei2026';

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
	let passwordInput = $state('');
	let loginError = $state('');
	let activeTab = $state<'articles' | 'videos' | 'news' | 'dates' | 'rabbis'>('articles');

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
	let artNotice = $state('');

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

	function saveHomeVideo(e: Event) {
		e.preventDefault();
		const trimmed = homeVideoUrl.trim();
		const trimmedTitle = homeVideoTitle.trim();
		try {
			localStorage.setItem(HOME_VIDEO_KEY, trimmed);
			localStorage.setItem(HOME_VIDEO_TITLE_KEY, trimmedTitle);
		} catch {}
		homeVideoNotice = trimmed ? '✅ הסרטון והכותרת נשמרו ויופיעו בדף הבית' : '✅ הסרטון הוסר מדף הבית';
		setTimeout(() => (homeVideoNotice = ''), 4000);
	}

	function clearHomeVideo() {
		if (!confirm('להסיר את הסרטון מדף הבית?')) return;
		homeVideoUrl = '';
		try {
			localStorage.removeItem(HOME_VIDEO_KEY);
		} catch {}
		homeVideoNotice = '✅ הסרטון הוסר מדף הבית';
		setTimeout(() => (homeVideoNotice = ''), 4000);
	}

	onMount(() => {
		try {
			if (sessionStorage.getItem(SESSION_KEY) === 'ok') {
				isLoggedIn = true;
			}
		} catch {}
		loadAll();
	});

	function loadAll() {
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

	function submitRabbi(e: Event) {
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
		if (editingRabbiId) {
			rabbis = rabbis.map((x) => (x.id === editingRabbiId ? { ...x, name, photo, title, nickname, city } : x));
			rabbiNotice = '✅ הדיין עודכן';
		} else {
			rabbis = [...rabbis, { id: genRabbiId(), name, photo, title, nickname, city }];
			rabbiNotice = '✅ הדיין נוסף';
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

	function deleteRabbi(id: string) {
		if (!confirm('למחוק את הדיין?')) return;
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

	function resetRabbisToDefault() {
		if (!confirm('לאפס לרשימת ברירת המחדל? (תמונות שהעלית יימחקו)')) return;
		rabbis = [...defaultRabbis];
		persistRabbis();
		cancelEditRabbi();
	}

	function handleLogin(e: Event) {
		e.preventDefault();
		if (passwordInput === ADMIN_PASSWORD) {
			isLoggedIn = true;
			loginError = '';
			passwordInput = '';
			try {
				sessionStorage.setItem(SESSION_KEY, 'ok');
			} catch {}
			loadAll();
		} else {
			loginError = 'סיסמה שגויה';
		}
	}

	function handleLogout() {
		isLoggedIn = false;
		try {
			sessionStorage.removeItem(SESSION_KEY);
		} catch {}
	}

	// ───────────── ניהול מאמרים ─────────────
	function slugify(s: string): string {
		return s
			.trim()
			.replace(/[^֐-׿a-zA-Z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.toLowerCase()
			.slice(0, 60) || `art-${Date.now()}`;
	}

	function submitArticle(e: Event) {
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
		const newArt: Article = {
			slug: slugify(artTitle) + '-' + Math.floor(Math.random() * 1000),
			title: artTitle.trim(),
			author: artAuthor.trim(),
			date: artDate || new Date().toISOString().slice(0, 10),
			excerpt: artExcerpt.trim(),
			body: artBody.trim(),
			approvedBy
		};
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
		artNotice = '✅ המאמר נוסף בהצלחה - מופיע מיד בדף הבית';
		setTimeout(() => (artNotice = ''), 4000);
	}

	function deleteCustomArticle(slug: string) {
		if (!confirm('למחוק את המאמר?')) return;
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

	function submitActivity(e: Event) {
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
			title: vidTitle.trim(),
			author: vidAuthor.trim(),
			date: vidDate || new Date().toISOString().slice(0, 10),
			excerpt: vidExcerpt.trim(),
			...(vidBody.trim() ? { body: vidBody.trim() } : {}),
			...(embeddedVideo ? { videoUrl: embeddedVideo } : {}),
			...(vidImageUrl.trim() ? { imageUrl: vidImageUrl.trim() } : {}),
			...(vidSourceUrl.trim() ? { sourceUrl: vidSourceUrl.trim() } : {})
		};
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
		vidNotice = `✅ ה${vidKind} נוסף בהצלחה`;
		setTimeout(() => (vidNotice = ''), 4000);
	}

	function deleteCustomActivity(slug: string) {
		if (!confirm('למחוק את הפריט?')) return;
		customActivity = customActivity.filter((x) => x.slug !== slug);
		try {
			localStorage.setItem(ACTIVITY_KEY, JSON.stringify(customActivity));
		} catch {}
	}

	// ───────────── ניהול חדשות לוקאליות ─────────────
	function submitNews(e: Event) {
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
		customNews = [item, ...customNews];
		try {
			localStorage.setItem(NEWS_KEY, JSON.stringify(customNews));
		} catch {}
		newsTitle = '';
		newsSummary = '';
		newsSourceUrl = '';
		newsNotice = '✅ החדשה נוספה - תופיע בטיקר בדף הבית (לוקאלית בלבד, לא בקהילה בשכונה)';
		setTimeout(() => (newsNotice = ''), 5000);
	}

	function deleteCustomNews(id: string) {
		if (!confirm('למחוק את החדשה?')) return;
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

	function rejectCase(id: string) {
		if (!confirm('לדחות ולמחוק את הבקשה?')) return;
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

{#if !isLoggedIn}
	<!-- ────────────── מסך התחברות ────────────── -->
	<section class="py-16 max-w-md mx-auto px-4">
		<div class="rounded-2xl border-2 border-purple-500/40 bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
			<header class="text-center mb-6">
				<div class="text-5xl mb-3">🔐</div>
				<h1 class="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-2xl md:text-3xl font-black text-transparent">
					פאנל ניהול
				</h1>
				<p class="mt-2 text-gray-300 text-sm">כניסה למזכיר בתי הדין</p>
			</header>

			<form onsubmit={handleLogin} class="space-y-4">
				<div>
					<label class="block text-sm font-bold text-purple-200 mb-1.5" for="admin-pw">סיסמת ניהול</label>
					<input
						id="admin-pw"
						type="password"
						bind:value={passwordInput}
						required
						autofocus
						placeholder="••••••••"
						class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
					/>
				</div>

				{#if loginError}
					<p class="text-red-300 text-sm">{loginError}</p>
				{/if}

				<button
					type="submit"
					class="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-black text-lg hover:opacity-90 transition-opacity"
				>
					כניסה
				</button>
			</form>

			<p class="mt-6 text-center text-xs text-gray-500">
				הסיסמה ניתנת על ידי בעל האתר. אם אינך מזכיר בית דין -
				<a href="/" class="text-blue-300 underline">חזרה לדף הבית</a>
			</p>
		</div>
	</section>
{:else}
	<!-- ────────────── פאנל ניהול ────────────── -->
	<section class="py-8 max-w-5xl mx-auto px-3">
		<header class="flex items-center justify-between mb-6 gap-3 flex-wrap">
			<div>
				<h1 class="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
					🔧 פאנל ניהול
				</h1>
				<p class="mt-1 text-gray-400 text-sm">מזכיר בתי הדין - חכמי העדה</p>
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
		</div>

		<!-- ───────────── תוכן הלשוניות ───────────── -->
		{#if activeTab === 'articles'}
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
									<div class="min-w-0">
										<div class="font-bold text-white text-sm">{a.title}</div>
										<div class="text-xs text-gray-400">{a.author} • {a.date}</div>
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
								class="w-full text-sm text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-amber-500/30 file:text-amber-100 file:font-bold hover:file:bg-amber-500/40"
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
		{/if}
	</section>
{/if}
