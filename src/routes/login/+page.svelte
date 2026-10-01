<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { strapiLogin, getCurrentUser, isChachmeiAdmin, isNetworkError } from '$lib/strapi';
	import GoogleSignInButton from '$lib/components/GoogleSignInButton.svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	let { data } = $props();

	let identifier = $state('');
	let password = $state('');
	let submitting = $state(false);
	let errorMsg = $state('');
	let returnTo = $state('/profile');
	let ssoLoading = $state(false);
	let badCreds = $state(false);

	// האימייל שהוקלד נשלח לדף השחזור - לא צריך להקליד אותו פעמיים.
	const forgotHref = $derived(
		identifier.includes('@') ? `/forgot-password?email=${encodeURIComponent(identifier.trim())}` : '/forgot-password'
	);

	onMount(async () => {
		try {
			const params = new URLSearchParams(window.location.search);
			const ret = params.get('returnTo');
			if (ret) returnTo = ret;
		} catch {}
		const user = await getCurrentUser();
		if (user) goto(returnTo);
	});

	// מוסיף welcome=back ליעד — מפעיל את מסך "ברוכים השבים" אחרי ההתחברות.
	// חובה ניווט מלא (window.location.href) ולא goto: ה-WelcomeScreen יושב ב-layout
	// וקורא את welcome מה-URL רק ב-onMount, שרץ מחדש רק בטעינת-עמוד מלאה.
	function withWelcome(dest: string): string {
		try {
			const u = new URL(dest, window.location.origin);
			u.searchParams.set('welcome', 'back');
			return `${u.pathname}${u.search}${u.hash}`;
		} catch {
			return '/?welcome=back';
		}
	}

	// SSO: מפנים לקהילת "יוצאים לחירות", היא קובעת את העוגייה המשותפת gofreeil-auth
	// על .gofreeil.com ומחזירה ל-callback. אותו JWT תקף כאן (אותו Strapi המשותף).
	// מי שאין לו חשבון בקהילה לא מוחזר לכאן עם שגיאה: אתר הקהילה מציע לו שם
	// כניסה בלחיצה (Google) ומחזיר אותו לכאן כבר מחובר.
	function loginWithCommunity() {
		ssoLoading = true;
		const origin = window.location.origin;
		const callback = `${origin}/auth/community-callback?returnTo=${encodeURIComponent(returnTo)}`;
		window.location.href = `https://community.gofreeil.com/sso?callback=${encodeURIComponent(callback)}`;
	}

	// זוהה מראש לפי העוגייה המשותפת (data.ssoName): אין צורך לעבור דרך אתר
	// הקהילה, ה-callback המקומי קורא את העוגייה ומקים סשן ישירות.
	function continueAsCommunityUser() {
		ssoLoading = true;
		window.location.href = `/auth/community-callback?returnTo=${encodeURIComponent(returnTo)}`;
	}

	async function handleLogin(e: Event) {
		e.preventDefault();
		if (submitting) return;
		submitting = true;
		errorMsg = '';
		badCreds = false;
		try {
			await strapiLogin(identifier.trim(), password);
			const me = await getCurrentUser();
			if (returnTo.startsWith('/admin') && !isChachmeiAdmin(me)) {
				errorMsg = tFn('auth_err_no_admin');
				setTimeout(() => goto('/profile'), 1500);
				return;
			}
			window.location.href = withWelcome(returnTo);
		} catch (e: any) {
			const msg = e?.message ?? tFn('auth_err_login_failed');
			if (isNetworkError(e)) {
				errorMsg = tFn('auth_err_network');
			} else {
				badCreds = msg.toLowerCase().includes('invalid');
				errorMsg = badCreds ? tFn('auth_err_invalid_credentials') : msg;
			}
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>{tFn('auth_login_page_title')}</title>
</svelte:head>

<section class="py-12 max-w-md mx-auto px-4">
	<div class="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 shadow-xl">
		<header class="text-center mb-6">
			<div class="text-5xl mb-3">👤</div>
			<h1 class="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-3xl font-black text-transparent">
				{tFn('auth_login_heading')}
			</h1>
			<p class="mt-2 text-gray-300 text-sm">{tFn('auth_login_subtitle')}</p>
		</header>

		{#if data.ssoName}
			<!-- זוהה מראש דרך יוצאים לחירות (עוגייה משותפת חיה) -->
			<button
				type="button"
				onclick={continueAsCommunityUser}
				disabled={ssoLoading}
				class="w-full mb-2 flex items-center justify-center gap-2.5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black hover:opacity-90 transition-opacity shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
			>
				{#if ssoLoading}
					<span class="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin flex-shrink-0"></span>
				{:else}
					<span class="text-xl" aria-hidden="true">🕊️</span>
				{/if}
				<span>{tFn('auth_sso_continue_as')}{data.ssoName}</span>
			</button>
			<p class="text-center text-xs text-gray-400 mb-5">
				{tFn('auth_sso_identified_note')}
			</p>

			<div class="relative mb-5">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-white/15"></div>
				</div>
				<div class="relative flex justify-center text-xs">
					<span class="px-3 bg-blue-900/30 text-gray-400 font-bold">{tFn('or')}</span>
				</div>
			</div>
		{:else}
			<!-- הודעה למשתמש חדש: הכניסה עם Google היא גם ההרשמה -->
			<p class="mb-5 text-center text-amber-200 text-[13px] sm:text-sm font-bold leading-relaxed">
				{tFn('auth_first_time_note')}
			</p>
		{/if}

		<div class="mb-3">
			<GoogleSignInButton {returnTo} label={tFn('continue_google')} />
		</div>

		{#if !data.ssoName}
			<!-- יוצאים לחירות (SSO) - אפשרות משנית למי שכבר יש לו חשבון באתר הקהילה.
			     חברי קבוצות הווצאפ בלי חשבון: הכפתור לא נכשל, אתר הקהילה מציע להם
			     כניסה עם Google ומחזיר אותם לכאן מחוברים. -->
			<button
				type="button"
				onclick={loginWithCommunity}
				disabled={ssoLoading}
				class="w-full mb-2 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-purple-400/40 bg-purple-500/10 text-purple-100 text-sm font-bold hover:bg-purple-500/20 hover:border-purple-400/60 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
			>
				{#if ssoLoading}
					<span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin flex-shrink-0"></span>
				{:else}
					<span class="text-lg" aria-hidden="true">🕊️</span>
				{/if}
				<span>{tFn('auth_sso_community_btn')}</span>
			</button>
			<p class="text-center text-xs text-gray-400 mb-5 leading-relaxed">
				{tFn('auth_whatsapp_note')}
			</p>
		{/if}

		<div class="relative mb-5">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-white/15"></div>
			</div>
			<div class="relative flex justify-center text-xs">
				<span class="px-3 bg-blue-900/30 text-gray-400 font-bold">{tFn('auth_or_email')}</span>
			</div>
		</div>

		<form onsubmit={handleLogin} class="space-y-4">
			<div>
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="li-ident">{tFn('auth_identifier_label')}</label>
				<input
					id="li-ident"
					type="text"
					bind:value={identifier}
					required
					autocomplete="username"
					placeholder="you@example.com"
					class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
					dir="ltr"
				/>
			</div>

			<div>
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="li-pw">{tFn('password_label')}</label>
				<input
					id="li-pw"
					type="password"
					bind:value={password}
					required
					autocomplete="current-password"
					placeholder="••••••••"
					class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
				/>
				<div class="mt-1.5 text-left">
					<a href={forgotHref} class="text-sm text-blue-300 hover:text-blue-200 underline">שכחתי סיסמה</a>
				</div>
			</div>

			{#if errorMsg}
				<div>
					<p class="text-red-300 text-sm font-bold">{errorMsg}</p>
					{#if badCreds}
						<ul class="mt-2 list-disc space-y-1 pr-5 text-xs leading-relaxed text-gray-300">
							<li>נרשמתם בעבר עם <strong>Google</strong>? אז אין לכם סיסמה — היכנסו עם כפתור Google שלמעלה.</li>
							<li>שכחתם את הסיסמה? <a href={forgotHref} class="font-bold text-blue-300 underline">שלחו לי קישור לבחירת סיסמה חדשה</a></li>
						</ul>
					{/if}
				</div>
			{/if}

			<button
				type="submit"
				disabled={submitting}
				class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black text-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
			>
				{submitting ? tFn('auth_logging_in') : tFn('login_register')}
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-gray-400">
			{tFn('auth_no_account_yet')}
			<a href="/signup" class="text-blue-300 hover:text-blue-200 underline font-bold">{tFn('register_here')}</a>
		</p>
		<p class="mt-3 text-center text-xs text-gray-500">
			{tFn('auth_same_account_prefix')}<a href="https://community-il.gofreeil.com" class="text-blue-300/80 underline">{tFn('profile_site_community')}</a>
		</p>
	</div>
</section>
