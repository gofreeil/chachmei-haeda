<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { strapiRegister, getCurrentUser } from '$lib/strapi';
	import GoogleSignInButton from '$lib/components/GoogleSignInButton.svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	let username = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let submitting = $state(false);
	let errorMsg = $state('');

	onMount(async () => {
		const user = await getCurrentUser();
		if (user) goto('/profile');
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (submitting) return;
		errorMsg = '';
		if (password.length < 6) {
			errorMsg = 'הסיסמה חייבת להכיל לפחות 6 תווים';
			return;
		}
		if (password !== confirmPassword) {
			errorMsg = 'הסיסמאות אינן תואמות';
			return;
		}
		submitting = true;
		try {
			await strapiRegister({
				username: username.trim(),
				email: email.trim().toLowerCase(),
				password
			});
			goto('/profile');
		} catch (e: any) {
			const msg = e?.message ?? 'שגיאה בהרשמה';
			if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('taken')) {
				errorMsg = 'האימייל כבר רשום במערכת. נסה להתחבר.';
			} else if (msg.toLowerCase().includes('username') && msg.toLowerCase().includes('taken')) {
				errorMsg = 'שם המשתמש תפוס. בחר אחר.';
			} else {
				errorMsg = msg;
			}
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>הרשמה - חכמי העדה</title>
</svelte:head>

<section class="py-12 max-w-md mx-auto px-4">
	<div class="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 shadow-xl">
		<header class="text-center mb-6">
			<div class="text-5xl mb-3">✨</div>
			<h1 class="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-3xl font-black text-transparent">
				הרשמה לאתר
			</h1>
			<p class="mt-2 text-gray-300 text-sm">פתיחת חשבון משתמש - לחתימה על האמנה, שליחת שאלות ומעקב אחר תיקים</p>
		</header>

		<div class="mb-5">
			<GoogleSignInButton label="הירשם עם Google" />
		</div>

		<div class="relative mb-5">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-white/15"></div>
			</div>
			<div class="relative flex justify-center text-xs">
				<span class="px-3 bg-blue-900/30 text-gray-400 font-bold">או עם דוא"ל וסיסמה</span>
			</div>
		</div>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="su-username">שם משתמש</label>
				<input
					id="su-username"
					type="text"
					bind:value={username}
					required
					minlength="3"
					autocomplete="username"
					placeholder="לדוגמה: yossi_cohen"
					class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
					dir="ltr"
				/>
			</div>

			<div>
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="su-email">אימייל</label>
				<input
					id="su-email"
					type="email"
					bind:value={email}
					required
					autocomplete="email"
					placeholder="you@example.com"
					class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
					dir="ltr"
				/>
			</div>

			<div>
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="su-password">סיסמה</label>
				<input
					id="su-password"
					type="password"
					bind:value={password}
					required
					minlength="6"
					autocomplete="new-password"
					placeholder="לפחות 6 תווים"
					class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
				/>
			</div>

			<div>
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="su-confirm">אימות סיסמה</label>
				<input
					id="su-confirm"
					type="password"
					bind:value={confirmPassword}
					required
					autocomplete="new-password"
					placeholder="הקלד שוב את הסיסמה"
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
				{submitting ? 'נרשם...' : 'הירשם'}
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-gray-400">
			כבר רשום?
			<a href="/login" class="text-blue-300 hover:text-blue-200 underline font-bold">התחבר כאן</a>
		</p>
		<p class="mt-3 text-center text-xs text-gray-500">
			🔗 אותו חשבון פועל גם באתר <a href="https://community-il.gofreeil.com" class="text-blue-300/80 underline">קהילה בשכונה</a>
		</p>
	</div>
</section>
