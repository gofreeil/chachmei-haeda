<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { strapiLogin, getCurrentUser, isChachmeiAdmin, isNetworkError, NETWORK_ERROR_MESSAGE_HE } from '$lib/strapi';
	import GoogleSignInButton from '$lib/components/GoogleSignInButton.svelte';

	let identifier = $state('');
	let password = $state('');
	let submitting = $state(false);
	let errorMsg = $state('');
	let returnTo = $state('/profile');

	onMount(async () => {
		try {
			const params = new URLSearchParams(window.location.search);
			const ret = params.get('returnTo');
			if (ret) returnTo = ret;
		} catch {}
		const user = await getCurrentUser();
		if (user) goto(returnTo);
	});

	// SSO: מפנים לקהילת "יוצאים לחירות", היא קובעת את העוגייה המשותפת gofreeil-auth
	// על .gofreeil.com ומחזירה ל-callback. אותו JWT תקף כאן (אותו Strapi המשותף).
	function loginWithCommunity() {
		const origin = window.location.origin;
		const callback = `${origin}/auth/community-callback?returnTo=${encodeURIComponent(returnTo)}`;
		window.location.href = `https://community.gofreeil.com/sso?callback=${encodeURIComponent(callback)}`;
	}

	async function handleLogin(e: Event) {
		e.preventDefault();
		if (submitting) return;
		submitting = true;
		errorMsg = '';
		try {
			await strapiLogin(identifier.trim(), password);
			const me = await getCurrentUser();
			if (returnTo.startsWith('/admin') && !isChachmeiAdmin(me)) {
				errorMsg = 'אין לך הרשאת ניהול. פונה לפרופיל...';
				setTimeout(() => goto('/profile'), 1500);
				return;
			}
			goto(returnTo);
		} catch (e: any) {
			const msg = e?.message ?? 'שגיאת התחברות';
			if (isNetworkError(e)) {
				errorMsg = NETWORK_ERROR_MESSAGE_HE;
			} else {
				errorMsg = msg.toLowerCase().includes('invalid') ? 'שם משתמש או סיסמה לא תקפים' : msg;
			}
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>התחברות - חכמי העדה</title>
</svelte:head>

<section class="py-12 max-w-md mx-auto px-4">
	<div class="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 shadow-xl">
		<header class="text-center mb-6">
			<div class="text-5xl mb-3">👤</div>
			<h1 class="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-3xl font-black text-transparent">
				התחברות
			</h1>
			<p class="mt-2 text-gray-300 text-sm">היכנס לחשבון שלך</p>
		</header>

		<div class="mb-3">
			<GoogleSignInButton {returnTo} />
		</div>

		<button
			type="button"
			onclick={loginWithCommunity}
			class="w-full mb-2 flex items-center justify-center gap-2.5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black hover:opacity-90 transition-opacity shadow-lg"
		>
			<span class="text-xl" aria-hidden="true">🕊️</span>
			<span>התחבר דרך "יוצאים לחירות"</span>
		</button>
		<p class="text-center text-xs text-gray-400 mb-5">
			רשום כבר בקהילה, בשכונה או באתר אחר של יוצאים לחירות? המערכת תזהה אותך אוטומטית.
		</p>

		<div class="relative mb-5">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-white/15"></div>
			</div>
			<div class="relative flex justify-center text-xs">
				<span class="px-3 bg-blue-900/30 text-gray-400 font-bold">או עם דוא"ל וסיסמה</span>
			</div>
		</div>

		<form onsubmit={handleLogin} class="space-y-4">
			<div>
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="li-ident">דוא"ל או שם משתמש</label>
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
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="li-pw">סיסמה</label>
				<input
					id="li-pw"
					type="password"
					bind:value={password}
					required
					autocomplete="current-password"
					placeholder="••••••••"
					class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
				/>
			</div>

			{#if errorMsg}
				<p class="text-red-300 text-sm font-bold">{errorMsg}</p>
			{/if}

			<button
				type="submit"
				disabled={submitting}
				class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black text-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
			>
				{submitting ? 'מתחבר...' : 'התחבר'}
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-gray-400">
			עוד אין לך חשבון?
			<a href="/signup" class="text-blue-300 hover:text-blue-200 underline font-bold">הירשם כאן</a>
		</p>
		<p class="mt-3 text-center text-xs text-gray-500">
			🔗 אותו חשבון פועל גם באתר <a href="https://community-il.gofreeil.com" class="text-blue-300/80 underline">קהילה בשכונה</a>
		</p>
	</div>
</section>
