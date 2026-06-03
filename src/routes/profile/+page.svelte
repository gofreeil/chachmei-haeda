<script lang="ts">
	import { onMount } from 'svelte';
	import { hearings, rulings } from '$lib/data/hearings';

	type UserData = {
		name: string;
		phone: string;
		email: string;
		city?: string;
		uecc?: boolean;
		arbitration?: boolean;
	};

	type CaseRecord = {
		id: string;
		nickname: string;
		plaintiffName: string;
		plaintiffPhone?: string;
		defendantName: string;
		defendantPhone?: string;
		subject: string;
		details?: string;
		proposedDate: string;
		approvals: { plaintiff: boolean; defendant: boolean; beitDin: boolean };
		createdAt: string;
	};

	type Message = {
		id: string;
		from: string;
		topic: string;
		body: string;
		date: string;
		read: boolean;
	};

	type Tab = 'overview' | 'messages' | 'cases' | 'rulings' | 'profile';

	// ───────────────── מצב משתמש ─────────────────
	let isLoaded = $state(false);
	let user = $state<UserData | null>(null);
	let cases = $state<CaseRecord[]>([]);
	let messages = $state<Message[]>([]);
	let activeTab = $state<Tab>('overview');

	// טופס עריכה
	let editName = $state('');
	let editPhone = $state('');
	let editEmail = $state('');
	let editCity = $state('');
	let savedNotice = $state(false);

	onMount(() => {
		try {
			const raw = localStorage.getItem('chachmei-user');
			if (raw) {
				user = JSON.parse(raw);
				editName = user?.name ?? '';
				editPhone = user?.phone ?? '';
				editEmail = user?.email ?? '';
				editCity = user?.city ?? '';
			}
			const casesRaw = localStorage.getItem('chachmei-cases');
			if (casesRaw) cases = JSON.parse(casesRaw);

			// MVP: דמו של הודעה ראשונה אם אין הודעות
			const msgsRaw = localStorage.getItem('chachmei-messages');
			if (msgsRaw) {
				messages = JSON.parse(msgsRaw);
			} else if (user) {
				messages = [
					{
						id: 'm-1',
						from: 'מערכת חכמי העדה',
						topic: 'ברוך הבא',
						body: 'אזור אישי זה הוא הבית שלך - כאן תקבל הודעות מבית הדין, סטטוס התיקים שלך ופסקי דין רלוונטיים.',
						date: new Date().toISOString(),
						read: false
					}
				];
			}
		} catch {}
		isLoaded = true;
	});

	const isLoggedIn = $derived(!!user?.name);
	const initial = $derived((user?.name || '?').charAt(0));
	const unreadCount = $derived(messages.filter((m) => !m.read).length);

	// סינון פסקי דין/דיונים ששייכים למשתמש (לפי שם)
	const myRulings = $derived(
		isLoggedIn
			? rulings.filter((r) => r.caseName.includes(user!.name) || cases.some((c) => r.caseName.includes(c.nickname)))
			: []
	);
	const myHearings = $derived(
		isLoggedIn
			? hearings.filter((h) => h.caseName.includes(user!.name) || cases.some((c) => h.caseName.includes(c.nickname)))
			: []
	);

	const tabs = $derived([
		{ key: 'overview' as Tab, label: 'סקירה', icon: '🏠' },
		{ key: 'messages' as Tab, label: `הודעות${unreadCount ? ` (${unreadCount})` : ''}`, icon: '✉️' },
		{ key: 'cases' as Tab, label: 'התיקים שלי', icon: '📂' },
		{ key: 'rulings' as Tab, label: 'פסקי הדין שלי', icon: '📋' },
		{ key: 'profile' as Tab, label: 'פרטים אישיים', icon: '👤' }
	]);

	// סטטוס תיק לתצוגה
	function caseStatus(c: CaseRecord): { label: string; color: string } {
		const { plaintiff, defendant, beitDin } = c.approvals;
		if (plaintiff && defendant && beitDin) return { label: '✓ נקבע ביומן', color: 'green' };
		const approved = [plaintiff, defendant, beitDin].filter(Boolean).length;
		return { label: `⏳ ${approved}/3 אישרו`, color: 'yellow' };
	}

	function markAllRead() {
		messages = messages.map((m) => ({ ...m, read: true }));
		try {
			localStorage.setItem('chachmei-messages', JSON.stringify(messages));
		} catch {}
	}

	function saveProfile() {
		const updated: UserData = {
			name: editName.trim(),
			phone: editPhone.trim(),
			email: editEmail.trim(),
			city: editCity.trim(),
			uecc: user?.uecc ?? false,
			arbitration: user?.arbitration ?? false
		};
		try {
			localStorage.setItem('chachmei-user', JSON.stringify(updated));
		} catch {}
		user = updated;
		savedNotice = true;
		setTimeout(() => (savedNotice = false), 2500);
	}

	function logout() {
		try {
			localStorage.removeItem('chachmei-user');
		} catch {}
		user = null;
		cases = [];
		messages = [];
	}

	function formatDate(iso: string): string {
		try {
			const d = new Date(iso);
			return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
		} catch {
			return iso;
		}
	}
</script>

<svelte:head>
	<title>האזור האישי - חכמי העדה</title>
</svelte:head>

<section class="py-6 md:py-8 max-w-4xl mx-auto px-3">
	{#if !isLoaded}
		<div class="text-center py-16 text-gray-400">טוען...</div>
	{:else if !isLoggedIn}
		<!-- ───────────── לא רשום ───────────── -->
		<div class="rounded-2xl border-2 border-yellow-400/40 bg-yellow-500/5 p-8 text-center">
			<div class="text-5xl mb-3">🔒</div>
			<h1 class="text-2xl font-bold text-yellow-200 mb-2">נדרשת הרשמה</h1>
			<p class="text-gray-300 mb-5 leading-relaxed">
				כדי לגשת לאזור האישי שלך, עליך להירשם ולקבל על עצמך את הקוד האתי UECC.
			</p>
			<a
				href="/request-hearing"
				class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 font-black hover:scale-105 transition-transform"
			>
				✍️ להרשמה
			</a>
			<p class="text-xs text-gray-500 mt-6">
				💡 אחרי הרשמה במקום אחד, אתה מזוהה אוטומטית גם באתרי <a href="https://community-il.vercel.app/" class="text-blue-300 underline">קהילה בשכונה</a>,
				<a href="https://criticism.vercel.app/" class="text-blue-300 underline">מבקר רשויות המדינה</a> ו-
				<a href="https://purchasing-groups.vercel.app/" class="text-blue-300 underline">רכישות קבוצתיות</a>.
			</p>
		</div>
	{:else}
		<!-- ───────────── Hero - תמונה+שם+סטטוס ───────────── -->
		<div class="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 p-5 md:p-6 mb-5">
			<div class="flex items-center gap-4 md:gap-5">
				<div class="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-black text-white text-3xl md:text-4xl shadow-lg ring-2 ring-purple-400/40">
					{initial}
				</div>
				<div class="flex-1 min-w-0">
					<h1 class="text-xl md:text-2xl font-black text-white truncate">{user?.name}</h1>
					<div class="flex flex-wrap gap-2 mt-2 text-xs">
						{#if user?.uecc}
							<span class="px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-300">✓ חתום על UECC</span>
						{/if}
						{#if user?.arbitration}
							<span class="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300">⚖️ הסכמת בוררות</span>
						{/if}
						<span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-gray-300">📂 {cases.length} תיקים</span>
					</div>
				</div>
			</div>
		</div>

		<!-- ───────────── טאבים ───────────── -->
		<div class="flex gap-1 md:gap-2 mb-4 overflow-x-auto pb-1" role="tablist">
			{#each tabs as tab}
				<button
					role="tab"
					aria-selected={activeTab === tab.key}
					onclick={() => (activeTab = tab.key)}
					class="px-3 md:px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 {activeTab ===
					tab.key
						? 'bg-blue-500/20 border border-blue-500/40 text-blue-200'
						: 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'}"
				>
					<span aria-hidden="true">{tab.icon}</span>
					<span>{tab.label}</span>
				</button>
			{/each}
		</div>

		<!-- ───────────── טאב: סקירה ───────────── -->
		{#if activeTab === 'overview'}
			<div class="grid md:grid-cols-2 gap-4">
				<button
					onclick={() => (activeTab = 'messages')}
					class="text-right rounded-2xl border border-purple-500/20 bg-purple-900/10 hover:bg-purple-900/20 transition-colors p-5"
				>
					<div class="text-3xl mb-2">✉️</div>
					<div class="font-bold text-white text-lg">הודעות</div>
					<div class="text-sm text-gray-400 mt-1">
						{messages.length} בסך הכל{unreadCount ? ` · ${unreadCount} לא נקראו` : ''}
					</div>
				</button>
				<button
					onclick={() => (activeTab = 'cases')}
					class="text-right rounded-2xl border border-blue-500/20 bg-blue-900/10 hover:bg-blue-900/20 transition-colors p-5"
				>
					<div class="text-3xl mb-2">📂</div>
					<div class="font-bold text-white text-lg">התיקים שלי</div>
					<div class="text-sm text-gray-400 mt-1">{cases.length} תיקים פתוחים</div>
				</button>
				<button
					onclick={() => (activeTab = 'rulings')}
					class="text-right rounded-2xl border border-green-500/20 bg-green-900/10 hover:bg-green-900/20 transition-colors p-5"
				>
					<div class="text-3xl mb-2">📋</div>
					<div class="font-bold text-white text-lg">פסקי הדין שלי</div>
					<div class="text-sm text-gray-400 mt-1">{myRulings.length} פסקים · {myHearings.length} דיונים</div>
				</button>
				<button
					onclick={() => (activeTab = 'profile')}
					class="text-right rounded-2xl border border-amber-500/20 bg-amber-900/10 hover:bg-amber-900/20 transition-colors p-5"
				>
					<div class="text-3xl mb-2">👤</div>
					<div class="font-bold text-white text-lg">פרטים אישיים</div>
					<div class="text-sm text-gray-400 mt-1 truncate">{user?.phone || 'ללא טלפון'}</div>
				</button>
			</div>

			<div class="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 mt-5 text-sm text-gray-300">
				🔗 <strong class="text-blue-300">סנכרון בין-אתרים:</strong> אזור אישי זה משותף לאתרי
				<a href="https://community-il.vercel.app/" class="text-blue-300 underline hover:text-blue-200">קהילה בשכונה</a>,
				<a href="https://criticism.vercel.app/" class="text-blue-300 underline hover:text-blue-200">מבקר רשויות המדינה</a> ו-
				<a href="https://purchasing-groups.vercel.app/" class="text-blue-300 underline hover:text-blue-200">רכישות קבוצתיות</a>.
				הפרופיל, ההודעות והתיקים מסונכרנים אוטומטית.
			</div>
		{/if}

		<!-- ───────────── טאב: הודעות ───────────── -->
		{#if activeTab === 'messages'}
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-bold text-white">✉️ הודעות אישיות</h2>
					{#if unreadCount > 0}
						<button onclick={markAllRead} class="text-sm text-blue-300 hover:text-blue-200">סמן הכל כנקרא</button>
					{/if}
				</div>
				{#if messages.length === 0}
					<div class="text-center py-12">
						<div class="text-5xl mb-3">📭</div>
						<p class="text-gray-400">אין הודעות עדיין</p>
					</div>
				{:else}
					{#each messages as msg}
						<div
							class="rounded-2xl border p-4 transition-colors {msg.read
								? 'border-white/10 bg-white/5'
								: 'border-purple-500/30 bg-purple-900/10'}"
						>
							<div class="flex items-start justify-between gap-2 mb-2">
								<div class="flex items-center gap-2">
									<div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
										{msg.from.charAt(0)}
									</div>
									<div>
										<p class="text-white font-bold text-sm leading-tight">{msg.from}</p>
										<p class="text-gray-500 text-xs">{msg.topic}</p>
									</div>
								</div>
								<span class="text-gray-500 text-xs flex-shrink-0">{formatDate(msg.date)}</span>
							</div>
							<p class="text-gray-300 text-sm leading-relaxed bg-white/5 rounded-xl px-4 py-3">{msg.body}</p>
							{#if !msg.read}
								<span class="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200">חדש</span>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		{/if}

		<!-- ───────────── טאב: התיקים שלי ───────────── -->
		{#if activeTab === 'cases'}
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-bold text-white">📂 התיקים שלי</h2>
					<a href="/request-hearing" class="text-sm px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 font-bold">+ תיק חדש</a>
				</div>
				{#if cases.length === 0}
					<div class="text-center py-12">
						<div class="text-5xl mb-3">📭</div>
						<p class="text-gray-400">עוד לא פתחת תיקים</p>
						<a href="/request-hearing" class="inline-block mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:scale-105 transition-transform">⚖️ פתח תיק ראשון</a>
					</div>
				{:else}
					{#each cases as c}
						{@const status = caseStatus(c)}
						<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
							<div class="flex items-start justify-between gap-2 flex-wrap mb-2">
								<div class="flex-1 min-w-0">
									<h3 class="font-bold text-white">{c.nickname || c.subject}</h3>
									<p class="text-sm text-gray-400">תיק #{c.id} · {c.subject}</p>
								</div>
								<span
									class="text-xs px-2.5 py-1 rounded-full whitespace-nowrap {status.color === 'green'
										? 'bg-green-500/15 border border-green-500/30 text-green-300'
										: 'bg-yellow-500/15 border border-yellow-500/30 text-yellow-300'}"
								>
									{status.label}
								</span>
							</div>
							<div class="grid grid-cols-2 gap-2 text-sm text-gray-300 mt-3">
								<div><span class="text-gray-500">תובע:</span> {c.plaintiffName}</div>
								<div><span class="text-gray-500">נתבע:</span> {c.defendantName}</div>
								<div><span class="text-gray-500">תאריך מוצע:</span> {c.proposedDate}</div>
								<div><span class="text-gray-500">נפתח:</span> {formatDate(c.createdAt)}</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		{/if}

		<!-- ───────────── טאב: פסקי דין ─────────────  -->
		{#if activeTab === 'rulings'}
			<div class="space-y-3">
				<h2 class="text-lg font-bold text-white mb-2">📋 פסקי הדין והדיונים שלי</h2>

				{#if myHearings.length > 0}
					<h3 class="text-sm font-bold text-blue-300 mt-3">🎥 דיונים מתוכננים</h3>
					{#each myHearings as h}
						<div class="rounded-xl border border-white/10 bg-white/5 p-4">
							<div class="flex items-start justify-between gap-2 flex-wrap">
								<div>
									<p class="font-bold text-white">{h.caseName}</p>
									<p class="text-sm text-gray-400">{h.date} · {h.time}</p>
								</div>
								<a href={h.zoomLink} target="_blank" rel="noopener" class="text-sm px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-200 font-bold hover:bg-blue-500/30">🎥 להצטרפות</a>
							</div>
						</div>
					{/each}
				{/if}

				{#if myRulings.length > 0}
					<h3 class="text-sm font-bold text-green-300 mt-4">📋 פסקי דין סופיים</h3>
					{#each myRulings as r}
						<div class="rounded-xl border border-white/10 bg-white/5 p-4">
							<p class="font-bold text-white">{r.caseName}</p>
							<p class="text-sm text-gray-400 mt-1">{r.date} · סטטוס: {r.status}</p>
						</div>
					{/each}
				{/if}

				{#if myHearings.length === 0 && myRulings.length === 0}
					<div class="text-center py-12">
						<div class="text-5xl mb-3">⚖️</div>
						<p class="text-gray-400">אין דיונים או פסקי דין שלך עדיין</p>
					</div>
				{/if}
			</div>
		{/if}

		<!-- ───────────── טאב: פרטים אישיים ───────────── -->
		{#if activeTab === 'profile'}
			<div class="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
				<h2 class="text-lg font-bold text-white mb-4">👤 פרטים אישיים</h2>
				<div class="grid md:grid-cols-2 gap-4">
					<label class="block">
						<span class="text-sm font-bold text-gray-300">שם מלא</span>
						<input
							type="text"
							bind:value={editName}
							class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
						/>
					</label>
					<label class="block">
						<span class="text-sm font-bold text-gray-300">טלפון</span>
						<input
							type="tel"
							bind:value={editPhone}
							class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
						/>
					</label>
					<label class="block">
						<span class="text-sm font-bold text-gray-300">אימייל</span>
						<input
							type="email"
							bind:value={editEmail}
							class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
						/>
					</label>
					<label class="block">
						<span class="text-sm font-bold text-gray-300">עיר</span>
						<input
							type="text"
							bind:value={editCity}
							class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
						/>
					</label>
				</div>

				<div class="flex flex-col sm:flex-row gap-3 mt-5">
					<button
						onclick={saveProfile}
						class="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black hover:scale-[1.01] transition-transform"
					>
						💾 שמור שינויים
					</button>
					<button
						onclick={logout}
						class="px-5 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold border border-red-500/30 transition-colors"
					>
						🚪 התנתקות
					</button>
				</div>

				{#if savedNotice}
					<div class="mt-3 text-sm text-green-300 text-center">✓ הפרטים נשמרו</div>
				{/if}

				<div class="mt-6 pt-5 border-t border-white/10 text-sm text-gray-400">
					<p class="mb-2"><strong class="text-gray-200">סטטוס הצהרות:</strong></p>
					<ul class="space-y-1">
						<li>{user?.uecc ? '✓' : '✗'} קוד אתי UECC ושבע מצוות בני נח</li>
						<li>{user?.arbitration ? '✓' : '✗'} הסכמה לבוררות בית הדין</li>
					</ul>
				</div>
			</div>
		{/if}
	{/if}
</section>
