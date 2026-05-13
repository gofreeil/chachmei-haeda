<script lang="ts">
	let name = $state('');
	let phone = $state('');
	let email = $state('');
	let opposing = $state('');
	let subject = $state('');
	let details = $state('');
	let agreeArbitration = $state(false);
	let agreeUECC = $state(false);
	let submitted = $state(false);

	function submit(e: Event) {
		e.preventDefault();
		if (!agreeArbitration || !agreeUECC) return;
		// MVP: רק הצגת הצלחה. בעתיד — שליחה ל-Strapi.
		submitted = true;
	}
</script>

<svelte:head>
	<title>בקשת דיון — חכמי העדה</title>
</svelte:head>

<section class="py-8 max-w-3xl mx-auto">
	<header class="text-center mb-8">
		<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent">
			בקשת דיון
		</h1>
		<p class="mt-3 text-gray-300">פתיחת תיק חדש לבוררות ושלום על פי דין תורה</p>
	</header>

	{#if submitted}
		<div class="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
			<div class="text-6xl mb-4">✓</div>
			<h2 class="text-2xl font-bold text-green-300">הבקשה נשלחה בהצלחה</h2>
			<p class="mt-3 text-gray-200">
				בית הדין יבחן את הבקשה ויחזור אליך תוך 7 ימי עבודה לתיאום מועד.
			</p>
			<a href="/" class="mt-6 inline-block px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">
				חזרה לדף הבית
			</a>
		</div>
	{:else}
		<form onsubmit={submit} class="space-y-5">
			<div class="grid md:grid-cols-2 gap-4">
				<label class="block">
					<span class="text-sm font-bold text-gray-300">שם מלא של המבקש *</span>
					<input
						type="text"
						bind:value={name}
						required
						class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
					/>
				</label>
				<label class="block">
					<span class="text-sm font-bold text-gray-300">טלפון *</span>
					<input
						type="tel"
						bind:value={phone}
						required
						class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
					/>
				</label>
			</div>

			<label class="block">
				<span class="text-sm font-bold text-gray-300">אימייל</span>
				<input
					type="email"
					bind:value={email}
					class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
				/>
			</label>

			<label class="block">
				<span class="text-sm font-bold text-gray-300">שם הצד שכנגד *</span>
				<input
					type="text"
					bind:value={opposing}
					required
					class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
				/>
			</label>

			<label class="block">
				<span class="text-sm font-bold text-gray-300">נושא הסכסוך (בקצרה) *</span>
				<input
					type="text"
					bind:value={subject}
					required
					placeholder="למשל: הלנת שכר, סכסוך שותפים, ערבות הלוואה..."
					class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
				/>
			</label>

			<label class="block">
				<span class="text-sm font-bold text-gray-300">פירוט הטענות *</span>
				<textarea
					bind:value={details}
					required
					rows="6"
					class="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-blue-400 focus:outline-none resize-y"
				></textarea>
			</label>

			<div class="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 space-y-3">
				<label class="flex items-start gap-3 cursor-pointer">
					<input type="checkbox" bind:checked={agreeArbitration} class="mt-1" />
					<span class="text-gray-200 text-sm">
						אני מסכים שהמחלוקת תוכרע בבית הדין של חכמי העדה על פי דין תורה, ומקבל על עצמי לציית לפסק
						הדין.
					</span>
				</label>
				<label class="flex items-start gap-3 cursor-pointer">
					<input type="checkbox" bind:checked={agreeUECC} class="mt-1" />
					<span class="text-gray-200 text-sm">
						אני מקבל על עצמי את <a href="/ethical-code" class="text-blue-300 underline">הקוד האתי UECC</a>
						ושבע מצוות בני נח כתנאי לעריכת הדיון.
					</span>
				</label>
			</div>

			<button
				type="submit"
				disabled={!agreeArbitration || !agreeUECC}
				class="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
			>
				שלח בקשה
			</button>
		</form>
	{/if}
</section>
