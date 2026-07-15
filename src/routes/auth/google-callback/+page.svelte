<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { strapiGoogleExchange, getCurrentUser, claimRegistrationOrigin } from '$lib/strapi';

	let status = $state<'working' | 'error'>('working');
	let errorMsg = $state('');

	onMount(async () => {
		try {
			const params = new URLSearchParams(window.location.search);
			// returnTo נשמר ב-sessionStorage ע"י googleOAuthStartUrl (Strapi v5 דורש callback מדויק)
			let returnTo = '/profile';
			try {
				const stored = sessionStorage.getItem('chachmei-oauth-returnTo');
				if (stored) returnTo = stored;
				sessionStorage.removeItem('chachmei-oauth-returnTo');
			} catch {}

			// Strapi/Grant מחזיר את ה-Google access_token בשורת הכתובת.
			// צריך לעשות עוד קריאה ל-/api/auth/google/callback כדי לקבל JWT של Strapi.
			if (!params.get('access_token')) throw new Error('לא התקבל token מ-Google');
			await strapiGoogleExchange(params);

			const me = await getCurrentUser();
			if (!me) throw new Error('ההזדהות נכשלה - אין משתמש');
			// מסמן אתר-הרשמה למשתמש חדש (הבקאנד מתעלם אם החשבון אינו חדש)
			await claimRegistrationOrigin();
			goto(returnTo);
		} catch (e: any) {
			errorMsg = e?.message ?? 'שגיאה בהזדהות עם Google';
			status = 'error';
		}
	});
</script>

<svelte:head>
	<title>מתחבר עם Google...</title>
</svelte:head>

<section class="py-20 max-w-md mx-auto px-4 text-center">
	{#if status === 'working'}
		<div class="text-5xl mb-3">⏳</div>
		<p class="text-gray-700 font-bold">מסיים את ההתחברות עם Google...</p>
	{:else}
		<div class="rounded-2xl border-2 border-red-400/40 bg-red-500/10 p-6">
			<div class="text-4xl mb-3">⚠️</div>
			<p class="text-red-200 font-bold mb-2">לא הצלחנו לסיים את ההתחברות</p>
			<p class="text-sm text-gray-300">{errorMsg}</p>
			<div class="mt-4 flex gap-2 justify-center">
				<a href="/login" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-sm">חזרה ל-התחברות</a>
				<a href="/" class="px-4 py-2 rounded-lg bg-white/70 text-gray-900 font-bold text-sm">דף הבית</a>
			</div>
		</div>
	{/if}
</section>
