<script lang="ts">
	import { onMount } from 'svelte';
	import { articles as staticArticles, type Article } from '$lib/data/articles';
	import { activity as staticActivity, type ActivityItem } from '$lib/data/activity';

	// 🔑 סיסמת אדמין — לשנות כאן ידנית. מי שיודע את הסיסמה יכול להיכנס.
	const ADMIN_PASSWORD = 'chachmei2026';

	const SESSION_KEY = 'chachmei-admin-session';
	const ARTICLES_KEY = 'chachmei-custom-articles';
	const ACTIVITY_KEY = 'chachmei-custom-activity';
	const CASES_KEY = 'chachmei-cases';

	let isLoggedIn = $state(false);
	let passwordInput = $state('');
	let loginError = $state('');
	let activeTab = $state<'articles' | 'videos' | 'dates'>('articles');

	let customArticles = $state<Article[]>([]);
	let customActivity = $state<ActivityItem[]>([]);
	let pendingCases = $state<any[]>([]);

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

	// ───────────── טופס סרטון/הודעה ─────────────
	let vidKind = $state<'סרטון' | 'הודעה'>('סרטון');
	let vidTitle = $state('');
	let vidAuthor = $state('');
	let vidDate = $state('');
	let vidExcerpt = $state('');
	let vidBody = $state('');
	let vidUrl = $state('');
	let vidNotice = $state('');

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
			const c = JSON.parse(localStorage.getItem(CASES_KEY) || '[]');
			if (Array.isArray(c)) pendingCases = c;
		} catch {}
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
		artNotice = '✅ המאמר נוסף בהצלחה — מופיע מיד בדף הבית';
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
		const newItem: ActivityItem = {
			slug: slugify(vidTitle) + '-' + Math.floor(Math.random() * 1000),
			kind: vidKind,
			title: vidTitle.trim(),
			author: vidAuthor.trim(),
			date: vidDate || new Date().toISOString().slice(0, 10),
			excerpt: vidExcerpt.trim(),
			...(vidBody.trim() ? { body: vidBody.trim() } : {}),
			...(vidUrl.trim() ? { videoUrl: vidUrl.trim() } : {})
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
	<title>פאנל ניהול — חכמי העדה</title>
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
				הסיסמה ניתנת על ידי בעל האתר. אם אינך מזכיר בית דין —
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
				<p class="mt-1 text-gray-400 text-sm">מזכיר בתי הדין — חכמי העדה</p>
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
				🎬 סרטונים והודעות
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
					<h2 class="text-base font-bold text-gray-300 mb-3">📦 מאמרי מערכת ({staticArticles.length}) — לקריאה בלבד</h2>
					<div class="space-y-1.5">
						{#each staticArticles as a}
							<div class="text-xs text-gray-400 border-b border-white/5 pb-1.5">
								{a.title} <span class="text-gray-600">— {a.author}, {a.date}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else if activeTab === 'videos'}
			<div class="space-y-6">
				<!-- טופס הוספה -->
				<div class="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-5 md:p-6">
					<h2 class="text-xl font-black text-teal-200 mb-4">➕ הוספת סרטון או הודעה</h2>
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
						{#if vidKind === 'סרטון'}
							<div class="md:col-span-2">
								<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-url">
									קישור להטמעה (YouTube embed) *
								</label>
								<input
									id="vid-url"
									type="url"
									bind:value={vidUrl}
									dir="ltr"
									placeholder="https://www.youtube.com/embed/XXXXXXXXXXX"
									class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-teal-400 focus:outline-none text-right"
								/>
								<p class="text-xs text-gray-500 mt-1">להחליף watch?v= ב-embed/ בקישור היוטיוב</p>
							</div>
						{/if}
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
							<label class="block text-sm font-bold text-gray-300 mb-1.5" for="vid-body">תוכן נוסף (אופציונלי)</label>
							<textarea
								id="vid-body"
								bind:value={vidBody}
								rows="4"
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
					<h2 class="text-base font-bold text-gray-300 mb-3">📦 פעילות מערכת ({staticActivity.length}) — לקריאה בלבד</h2>
					<div class="space-y-1.5">
						{#each staticActivity as v}
							<div class="text-xs text-gray-400 border-b border-white/5 pb-1.5">
								<span class="text-gray-500">[{v.kind}]</span>
								{v.title}
								<span class="text-gray-600">— {v.author}, {v.date}</span>
							</div>
						{/each}
					</div>
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
												<span class="text-sm text-gray-300">— {c.nickname}</span>
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
										<div class="text-white font-bold">{c.plaintiffName || '—'}</div>
										{#if c.plaintiffPhone}
											<div class="text-xs text-gray-400" dir="ltr">{c.plaintiffPhone}</div>
										{/if}
									</div>
									<div class="rounded-lg bg-black/20 p-3">
										<div class="text-xs text-gray-500 mb-0.5">נתבע</div>
										<div class="text-white font-bold">{c.defendantName || '—'}</div>
										{#if c.defendantPhone}
											<div class="text-xs text-gray-400" dir="ltr">{c.defendantPhone}</div>
										{/if}
									</div>
								</div>

								<div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
									<div class="rounded-lg bg-black/20 p-2 text-center">
										<div class="text-gray-500">תאריך מוצע</div>
										<div class="text-yellow-200 font-bold mt-0.5">{c.proposedDate || '—'}</div>
									</div>
									<div class="rounded-lg bg-black/20 p-2 text-center">
										<div class="text-gray-500">תובע</div>
										<div class="font-bold mt-0.5 {c.approvals?.plaintiff ? 'text-green-300' : 'text-gray-500'}">
											{c.approvals?.plaintiff ? '✓' : '—'}
										</div>
									</div>
									<div class="rounded-lg bg-black/20 p-2 text-center">
										<div class="text-gray-500">נתבע</div>
										<div class="font-bold mt-0.5 {c.approvals?.defendant ? 'text-green-300' : 'text-gray-500'}">
											{c.approvals?.defendant ? '✓' : '—'}
										</div>
									</div>
									<div class="rounded-lg bg-black/20 p-2 text-center">
										<div class="text-gray-500">בית הדין</div>
										<div class="font-bold mt-0.5 {c.approvals?.beitDin ? 'text-green-300' : 'text-gray-500'}">
											{c.approvals?.beitDin ? '✓' : '—'}
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
