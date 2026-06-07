<script lang="ts">
	import { addSignatory } from '$lib/services/charter-service';
	import HeichalNav from '$lib/components/HeichalNav.svelte';

	let name = $state('');
	let role = $state('');
	let city = $state('');
	let email = $state('');
	let phone = $state('');
	let accepted = $state(false);
	let notice = $state('');
	let submitted = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		notice = '';
		if (!name.trim()) {
			notice = '⚠️ יש להזין שם מלא';
			return;
		}
		if (!accepted) {
			notice = '⚠️ יש לאשר את האמנה לפני החתימה';
			return;
		}
		addSignatory({
			name,
			role,
			city,
			email,
			phone,
			acceptedTerms: true
		});
		submitted = true;
		notice = '✅ חתימתך נקלטה! שמך מופיע כעת באינדקס החתומים.';
		// איפוס שדות
		name = '';
		role = '';
		city = '';
		email = '';
		phone = '';
		accepted = false;
	}
</script>

<svelte:head>
	<title>הצטרפות לאמנה - חכמי העדה</title>
</svelte:head>

<section class="py-8 max-w-3xl mx-auto px-3">
	<header class="text-center mb-6">
		<div class="text-5xl mb-3">✍️</div>
		<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			הצטרפות לאמנה
		</h1>
		<p class="mt-3 text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
			אני מקבל/ת על עצמי את האמנה המוסרית של חכמי העדה ומבקש/ת להצטרף לחתומים עליה.
		</p>
	</header>

	<HeichalNav />

	<!-- מלל האמנה (יעודכן בהמשך) -->
	<div class="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 p-5 md:p-7 mb-6">
		<h2 class="text-xl font-black text-amber-200 mb-3">📜 מלל האמנה</h2>
		<div class="text-sm md:text-base text-gray-200 leading-relaxed space-y-3 text-right" dir="rtl">
			<p class="italic text-gray-400">
				[המלל המלא של האמנה ימולא כאן. עד אז – ניתן לקרוא את הקוד האתי המוסרי העולמי
				<a href="/heichal-hamaaseh/ethical-code" class="text-amber-300 underline">בעמוד הקוד האתי</a>
				ולחתום עליו כאמנת UECC.]
			</p>
		</div>
	</div>

	<!-- טופס חתימה -->
	<form onsubmit={handleSubmit} class="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 md:p-7 space-y-4">
		<h2 class="text-xl font-black text-blue-200 mb-3">📝 פרטי החתימה</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-name">שם מלא *</label>
				<input
					id="join-name"
					type="text"
					bind:value={name}
					required
					placeholder="ישראל ישראלי"
					class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
				/>
			</div>
			<div>
				<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-role">תפקיד / עיסוק</label>
				<input
					id="join-role"
					type="text"
					bind:value={role}
					placeholder="איש עסקים, רב, יזם…"
					class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
				/>
			</div>
			<div>
				<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-city">עיר מגורים</label>
				<input
					id="join-city"
					type="text"
					bind:value={city}
					placeholder="ירושלים, בני ברק…"
					class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none"
				/>
			</div>
			<div>
				<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-phone">טלפון</label>
				<input
					id="join-phone"
					type="tel"
					bind:value={phone}
					dir="ltr"
					placeholder="050-0000000"
					class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none text-right"
				/>
			</div>
			<div class="md:col-span-2">
				<label class="block text-sm font-bold text-gray-300 mb-1.5" for="join-email">דוא"ל</label>
				<input
					id="join-email"
					type="email"
					bind:value={email}
					dir="ltr"
					placeholder="name@example.com"
					class="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-white focus:border-blue-400 focus:outline-none text-right"
				/>
			</div>
		</div>

		<!-- אישור האמנה -->
		<label class="flex items-start gap-3 rounded-xl border-2 border-amber-500/40 bg-amber-500/5 p-4 cursor-pointer hover:bg-amber-500/10 transition-colors">
			<input
				type="checkbox"
				bind:checked={accepted}
				class="mt-1 w-5 h-5 accent-amber-500 flex-shrink-0"
			/>
			<span class="text-sm md:text-base text-amber-100">
				<strong>הריני מצהיר/ה ומאשר/ת</strong> כי קראתי את האמנה במלואה,
				מקבל/ת על עצמי את עקרונותיה,
				ומתחייב/ת לפעול לפיה ביושר ובאמונה.
			</span>
		</label>

		{#if notice}
			<p class="text-sm font-bold {notice.startsWith('✅') ? 'text-green-300' : 'text-yellow-300'}">
				{notice}
			</p>
		{/if}

		<div class="flex gap-3 flex-wrap pt-2">
			<button
				type="submit"
				class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black text-lg hover:opacity-90 transition-opacity"
			>
				✍️ חתום ואשר
			</button>
			{#if submitted}
				<a
					href="/charter-index"
					class="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
				>
					← צפה באינדקס החתומים
				</a>
			{/if}
		</div>

		<p class="text-xs text-gray-500 mt-2">
			פרטיך נשמרים מקומית כעת ויסונכרנו ל-CMS המרכזי בהמשך. שמך יופיע ברשימה הציבורית.
		</p>
	</form>
</section>
