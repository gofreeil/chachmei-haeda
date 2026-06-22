<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { strapiLogin, getCurrentUser, isChachmeiAdmin } from '$lib/strapi';
	import GoogleSignInButton from '$lib/components/GoogleSignInButton.svelte';

	let identifier = $state('');
	let password = $state('');
	let submitting = $state(false);
	let errorMsg = $state('');

	onMount(async () => {
		const user = await getCurrentUser();
		if (user && isChachmeiAdmin(user)) {
			goto('/admin');
		}
	});

	async function handleLogin(e: Event) {
		e.preventDefault();
		if (submitting) return;
		submitting = true;
		errorMsg = '';
		try {
			const { user } = await strapiLogin(identifier.trim(), password);
			if (!isChachmeiAdmin(user)) {
				// אם ה-/users/me לא מחזיר role בלי populate - ננסה לטעון מחדש עם populate
				const me = await getCurrentUser();
				if (!isChachmeiAdmin(me)) {
					errorMsg = 'אין לך הרשאת ניהול לאתר. פנה למנהל המערכת.';
					submitting = false;
					return;
				}
			}
			goto('/admin');
		} catch (e: any) {
			errorMsg = e?.message?.includes('Invalid') ? 'שם משתמש או סיסמה לא תקפים' : (e?.message || 'שגיאת התחברות');
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>כניסת מנהל - חכמי העדה</title>
</svelte:head>

<section class="py-16 max-w-md mx-auto px-4">
	<div class="rounded-2xl border-2 border-purple-500/40 bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
		<header class="text-center mb-6">
			<div class="text-5xl mb-3">🔐</div>
			<h1 class="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-2xl md:text-3xl font-black text-transparent">
				כניסה לפאנל הניהול
			</h1>
			<p class="mt-2 text-gray-300 text-sm">למורשים בלבד · אתר חכמי העדה</p>
		</header>

		<div class="mb-5">
			<GoogleSignInButton returnTo="/admin" />
		</div>

		<div class="relative mb-5">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-white/15"></div>
			</div>
			<div class="relative flex justify-center text-xs">
				<span class="px-3 bg-purple-900/30 text-gray-400 font-bold">או עם דוא"ל וסיסמה</span>
			</div>
		</div>

		<form onsubmit={handleLogin} class="space-y-4">
			<div>
				<label class="block text-sm font-bold text-purple-200 mb-1.5" for="ident">דוא"ל / שם משתמש</label>
				<input
					id="ident"
					type="text"
					bind:value={identifier}
					required
					autocomplete="username"
					placeholder="admin@example.com"
					class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
					dir="ltr"
				/>
			</div>

			<div>
				<label class="block text-sm font-bold text-purple-200 mb-1.5" for="pw">סיסמה</label>
				<input
					id="pw"
					type="password"
					bind:value={password}
					required
					autocomplete="current-password"
					placeholder="••••••••"
					class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
				/>
			</div>

			{#if errorMsg}
				<p class="text-red-300 text-sm font-bold">{errorMsg}</p>
			{/if}

			<button
				type="submit"
				disabled={submitting}
				class="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-black text-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
			>
				{submitting ? 'מתחבר...' : 'כניסה'}
			</button>
		</form>

		<p class="mt-6 text-center text-xs text-gray-500">
			אין לך חשבון? <a href="/signup" class="text-blue-300 hover:text-blue-200 underline font-bold">הירשם כאן</a>
			<br />הרשאות ניהול מוקצות על ידי מנהל המערכת.
			<br />אם איבדת גישה - <a href="/" class="text-blue-300 underline">חזרה לדף הבית</a>
		</p>
	</div>
</section>
