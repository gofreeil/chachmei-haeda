<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { strapiRegister, getCurrentUser, claimRegistrationOrigin, isNetworkError } from '$lib/strapi';
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
			errorMsg = tFn('auth_err_password_short');
			return;
		}
		if (password !== confirmPassword) {
			errorMsg = tFn('auth_err_password_mismatch');
			return;
		}
		submitting = true;
		try {
			await strapiRegister({
				username: username.trim(),
				email: email.trim().toLowerCase(),
				password
			});
			await claimRegistrationOrigin();
			goto('/profile');
		} catch (e: any) {
			const msg = e?.message ?? tFn('auth_err_register_failed');
			if (isNetworkError(e)) {
				errorMsg = tFn('auth_err_network');
			} else if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('taken')) {
				errorMsg = tFn('auth_err_email_taken');
			} else if (msg.toLowerCase().includes('username') && msg.toLowerCase().includes('taken')) {
				errorMsg = tFn('auth_err_username_taken');
			} else {
				errorMsg = msg;
			}
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>{tFn('auth_signup_page_title')}</title>
</svelte:head>

<section class="py-12 max-w-md mx-auto px-4">
	<div class="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 shadow-xl">
		<header class="text-center mb-6">
			<div class="text-5xl mb-3">✨</div>
			<h1 class="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-3xl font-black text-transparent">
				{tFn('auth_signup_heading')}
			</h1>
			<p class="mt-2 text-gray-300 text-sm">{tFn('auth_signup_subtitle')}</p>
		</header>

		<div class="mb-5">
			<GoogleSignInButton label={tFn('auth_signup_google')} />
		</div>

		<div class="relative mb-5">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-white/15"></div>
			</div>
			<div class="relative flex justify-center text-xs">
				<span class="px-3 bg-blue-900/30 text-gray-400 font-bold">{tFn('auth_or_email')}</span>
			</div>
		</div>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="su-username">{tFn('username_label')}</label>
				<input
					id="su-username"
					type="text"
					bind:value={username}
					required
					minlength="3"
					autocomplete="username"
					placeholder={tFn('auth_username_placeholder')}
					class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
					dir="ltr"
				/>
			</div>

			<div>
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="su-email">{tFn('email')}</label>
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
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="su-password">{tFn('password_label')}</label>
				<input
					id="su-password"
					type="password"
					bind:value={password}
					required
					minlength="6"
					autocomplete="new-password"
					placeholder={tFn('password_min')}
					class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
				/>
			</div>

			<div>
				<label class="block text-sm font-bold text-blue-200 mb-1.5" for="su-confirm">{tFn('confirm_password_label')}</label>
				<input
					id="su-confirm"
					type="password"
					bind:value={confirmPassword}
					required
					autocomplete="new-password"
					placeholder={tFn('auth_confirm_placeholder')}
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
				{submitting ? tFn('registering') : tFn('register_btn')}
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-gray-400">
			{tFn('already_registered')}
			<a href="/login" class="text-blue-300 hover:text-blue-200 underline font-bold">{tFn('login_here')}</a>
		</p>
		<p class="mt-3 text-center text-xs text-gray-500">
			{tFn('auth_same_account_prefix')}<a href="https://community-il.gofreeil.com" class="text-blue-300/80 underline">{tFn('profile_site_community')}</a>
		</p>
	</div>
</section>
