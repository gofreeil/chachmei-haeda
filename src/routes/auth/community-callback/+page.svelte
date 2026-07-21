<script lang="ts">
	import { onMount } from 'svelte';
	import { setJwt, getCurrentUser } from '$lib/strapi';

	let { data } = $props();

	// working = מזהה ומכניס; not_registered = לא ברשימה; error = תקלה
	let phase = $state<'working' | 'not_registered' | 'error'>('working');

	onMount(async () => {
		if (data.status === 'ok' && data.jwt) {
			// שומרים את ה-JWT המשותף כטוקן של חכמי העדה → getCurrentUser יזהה מיד
			setJwt(data.jwt);
			// השרת כבר אימת את הטוקן מול Strapi (status='ok'), אז ממשיכים בכל מקרה.
			// getCurrentUser רק "מחמם" את המשתמש; אם הקריאה בצד-לקוח נכשלת זמנית
			// (רשת/CORS) — לא חוסמים את ההתחברות, כי הטוקן כבר אומת בצד-שרת.
			try { await getCurrentUser(); } catch {}
			// פעם ראשונה בדפדפן הזה → welcome=new מפעיל את מסך "ברוכים המצטרפים";
			// משתמש חוזר לא מקבל שום פרמטר ולא רואה מסך.
			let target = data.returnTo;
			try {
				if (!localStorage.getItem('gofreeil-welcomed')) {
					const u = new URL(data.returnTo, location.origin);
					u.searchParams.set('welcome', 'new');
					target = u.pathname + u.search + u.hash;
				}
			} catch {
				/* localStorage חסום — ממשיכים בלי הברכה */
			}
			// טעינת-עמוד מלאה (ולא goto/SPA): ה-WelcomeScreen יושב ב-layout וכבר מונטה כאן,
			// אז רק ניווט מלא ממנטֵ אותו מחדש ומפעיל את onMount שקורא את welcome=new מה-URL.
			window.location.href = target;
			return;
		}
		phase = data.status === 'not_registered' ? 'not_registered' : 'error';
	});
</script>

<svelte:head>
	<title>התחברות דרך יוצאים לחירות - חכמי העדה</title>
</svelte:head>

<section class="py-12 max-w-md mx-auto px-4">
	<div class="rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-900/25 to-teal-900/25 p-8 shadow-xl text-center">
		{#if phase === 'working'}
			<div class="text-5xl mb-4 animate-pulse">🕊️</div>
			<h1 class="text-2xl font-black text-emerald-200 mb-2">מזהה אותך...</h1>
			<p class="text-gray-300 text-sm">
				{data.name ? `ברוך הבא, ${data.name}!` : 'רק רגע, מתחברים דרך יוצאים לחירות'}
			</p>
		{:else if phase === 'not_registered'}
			<div class="text-5xl mb-4">🔒</div>
			<h1 class="text-2xl font-black text-yellow-200 mb-2">עדיין אינך ברשימה</h1>
			<p class="text-gray-300 text-sm mb-6 leading-relaxed">
				לא מצאנו אותך במערכת של יוצאים לחירות. אפשר להירשם כאן ישירות, או להצטרף דרך אתר הקהילה.
			</p>
			<div class="flex flex-col gap-2.5">
				<a
					href="/signup?returnTo={encodeURIComponent(data.returnTo)}"
					class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black hover:opacity-90 transition-opacity"
				>
					✨ הרשמה לחכמי העדה
				</a>
				<a
					href="https://community.gofreeil.com/"
					class="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-200 font-bold border border-emerald-500/30 transition-colors"
				>
					🕊️ הרשמה בקהילת יוצאים לחירות
				</a>
				<a href="/login" class="mt-1 text-sm text-gray-400 hover:text-gray-200 underline">
					חזרה להתחברות
				</a>
			</div>
		{:else}
			<div class="text-5xl mb-4">⚠️</div>
			<h1 class="text-2xl font-black text-red-200 mb-2">משהו השתבש</h1>
			<p class="text-gray-300 text-sm mb-6">לא הצלחנו להשלים את ההתחברות. נסה שוב.</p>
			<a
				href="/login?returnTo={encodeURIComponent(data.returnTo)}"
				class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black hover:opacity-90 transition-opacity"
			>
				חזרה להתחברות
			</a>
		{/if}
	</div>
</section>
