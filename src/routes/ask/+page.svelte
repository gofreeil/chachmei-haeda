<script lang="ts">
	let askName = $state('');
	let askEmail = $state('');
	let askTopic = $state('הלכה');
	let askQuestion = $state('');

	const askTopics = [
		'הלכה',
		'מוסר עסקי',
		'חושן משפט / ממונות',
		'שלום בית ומשפחה',
		'שבע מצוות בני נח',
		'אחר'
	];

	function handleAskSubmit(e: Event) {
		e.preventDefault();
		const subject = `שאלה לבית הדין - ${askTopic}`;
		const body = `שם: ${askName}\nדוא"ל למענה: ${askEmail}\nנושא: ${askTopic}\n\nשאלה:\n${askQuestion}`;
		window.location.href = `mailto:freedomhasbegun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	}
</script>

<svelte:head>
	<title>שאל את חכמי העדה - חכמי העדה</title>
</svelte:head>

<section class="py-8">
	<div class="rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-blue-500/15 p-6 md:p-8 shadow-[0_0_30px_rgba(99,102,241,0.15)] max-w-3xl mx-auto">
		<header class="text-center mb-6">
			<div class="text-5xl mb-3">📚</div>
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
				שאל את חכמי העדה
			</h2>
			<p class="mt-3 text-gray-800 text-sm md:text-base font-bold max-w-2xl mx-auto">
				יש לך שאלה בהלכה, במוסר עסקי, או בעניין שלום בית? כתוב לרבני בית הדין - התשובה תינתן בכתב לדוא״ל שתציין ותתפרסם כאן באתר ללא פרטים אישיים
			</p>
		</header>
		<form onsubmit={handleAskSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-bold text-indigo-700 mb-1.5" for="ask-name">שם</label>
				<input
					id="ask-name"
					type="text"
					bind:value={askName}
					required
					placeholder="שמך המלא"
					class="w-full px-3 py-2.5 rounded-lg bg-white/40 border border-indigo-300/40 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
				/>
			</div>
			<div>
				<label class="block text-sm font-bold text-indigo-700 mb-1.5" for="ask-email">דוא״ל למענה</label>
				<input
					id="ask-email"
					type="email"
					bind:value={askEmail}
					required
					placeholder="name@example.com"
					dir="ltr"
					class="w-full px-3 py-2.5 rounded-lg bg-white/40 border border-indigo-300/40 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors text-right"
				/>
			</div>
			<div class="md:col-span-2">
				<label class="block text-sm font-bold text-indigo-700 mb-1.5" for="ask-topic">נושא השאלה</label>
				<select
					id="ask-topic"
					bind:value={askTopic}
					class="w-full px-3 py-2.5 rounded-lg bg-white/40 border border-indigo-300/40 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
				>
					{#each askTopics as topic}
						<option value={topic}>{topic}</option>
					{/each}
				</select>
			</div>
			<div class="md:col-span-2">
				<label class="block text-sm font-bold text-indigo-700 mb-1.5" for="ask-question">השאלה</label>
				<textarea
					id="ask-question"
					bind:value={askQuestion}
					required
					rows="6"
					placeholder="פרט את השאלה ככל האפשר - הקשר, רקע, מה כבר ניסית..."
					class="w-full px-3 py-2.5 rounded-lg bg-white/40 border border-indigo-300/40 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-y"
				></textarea>
			</div>
			<div class="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3">
				<p class="text-xs text-gray-700 max-w-md font-medium">השאלה תישלח לרבני בית הדין במייל. שאלות בעלות עניין ציבורי עשויות להופיע בעמוד השאלות והתשובות (בלי פרטים מזהים).</p>
				<button
					type="submit"
					class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all whitespace-nowrap"
				>
					📚 שלח את השאלה
				</button>
			</div>
		</form>
		<div class="mt-6 text-center">
			<a href="/qa" class="text-sm font-bold text-indigo-700 hover:text-indigo-900 underline">
				רוצה לראות תשובות קודמות? לחץ כאן ←
			</a>
		</div>
	</div>
</section>
