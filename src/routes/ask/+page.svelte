<script lang="ts">
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import { submitQuestion } from '$lib/services/qa-service';
	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	let askName = $state('');
	let askEmail = $state('');
	let askTopic = $state('ask_topic_halacha');
	let askQuestion = $state('');
	let submitting = $state(false);
	let submitted = $state(false);
	let errorMsg = $state('');

	const askTopics = [
		'ask_topic_halacha',
		'ask_topic_business_ethics',
		'ask_topic_choshen_mishpat',
		'ask_topic_shalom_bayit',
		'ask_topic_seven_noahide',
		'ask_topic_other'
	];

	async function handleAskSubmit(e: Event) {
		e.preventDefault();
		if (submitting) return;
		submitting = true;
		errorMsg = '';
		const topicLabel = tFn(askTopic);
		const result = await submitQuestion({
			askerName: askName,
			askerEmail: askEmail,
			topic: topicLabel,
			question: askQuestion
		});
		submitting = false;
		if (result.ok) {
			submitted = true;
			askName = '';
			askEmail = '';
			askQuestion = '';
		} else {
			// אם ה-API נכשל - נופלים על mailto כגיבוי
			const subject = `${tFn('ask_email_subject_prefix')} - ${topicLabel}`;
			const body = `${tFn('ask_email_field_name')}: ${askName}\n${tFn('ask_email_field_email')}: ${askEmail}\n${tFn('ask_email_field_topic')}: ${topicLabel}\n\n${tFn('ask_email_field_question')}:\n${askQuestion}`;
			window.location.href = `mailto:freedomhasbegun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		}
	}
</script>

<svelte:head>
	<title>{tFn('ask_page_title')}</title>
</svelte:head>

<section class="py-8">
	<div class="rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-blue-500/15 p-6 md:p-8 shadow-[0_0_30px_rgba(99,102,241,0.15)] max-w-3xl mx-auto">
		<header class="text-center mb-6">
			<div class="text-5xl mb-3">📚</div>
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
				{tFn('ask_heading')}
			</h2>
			<p class="mt-3 text-gray-800 text-sm md:text-base font-bold max-w-2xl mx-auto">
				{tFn('ask_intro')}
			</p>
		</header>
		{#if submitted}
			<div class="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
				<div class="text-4xl mb-2">✅</div>
				<p class="text-emerald-100 font-bold text-lg">{tFn('ask_submitted_title') || 'תודה! השאלה התקבלה.'}</p>
				<p class="text-sm text-gray-200 mt-2">{tFn('ask_submitted_body') || 'חכמי העדה יבחנו את השאלה ויחזרו אליך בהקדם.'}</p>
				<button
					type="button"
					onclick={() => { submitted = false; }}
					class="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
				>
					{tFn('ask_submit_another') || 'שאל שאלה נוספת'}
				</button>
			</div>
		{:else}
		<form onsubmit={handleAskSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-bold text-indigo-700 mb-1.5" for="ask-name">{tFn('ask_label_name')}</label>
				<input
					id="ask-name"
					type="text"
					bind:value={askName}
					required
					placeholder={tFn('ask_placeholder_name')}
					class="w-full px-3 py-2.5 rounded-lg bg-white/40 border border-indigo-300/40 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
				/>
			</div>
			<div>
				<label class="block text-sm font-bold text-indigo-700 mb-1.5" for="ask-email">{tFn('ask_label_email')}</label>
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
				<label class="block text-sm font-bold text-indigo-700 mb-1.5" for="ask-topic">{tFn('ask_label_topic')}</label>
				<select
					id="ask-topic"
					bind:value={askTopic}
					class="w-full px-3 py-2.5 rounded-lg bg-white/40 border border-indigo-300/40 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
				>
					{#each askTopics as topic}
						<option value={topic}>{tFn(topic)}</option>
					{/each}
				</select>
			</div>
			<div class="md:col-span-2">
				<label class="block text-sm font-bold text-indigo-700 mb-1.5" for="ask-question">{tFn('ask_label_question')}</label>
				<textarea
					id="ask-question"
					bind:value={askQuestion}
					required
					rows="6"
					placeholder={tFn('ask_placeholder_question')}
					class="w-full px-3 py-2.5 rounded-lg bg-white/40 border border-indigo-300/40 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-y"
				></textarea>
			</div>
			<div class="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3">
				<p class="text-xs text-gray-700 max-w-md font-medium">{tFn('ask_disclaimer')}</p>
				<button
					type="submit"
					disabled={submitting}
					class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
				>
					📚 {submitting ? (tFn('ask_btn_submitting') || 'שולח...') : tFn('ask_btn_submit')}
				</button>
			</div>
			{#if errorMsg}
				<p class="md:col-span-2 text-sm text-red-300 font-bold text-center">{errorMsg}</p>
			{/if}
		</form>
		{/if}
		<div class="mt-6 text-center">
			<a href="/qa" class="text-sm font-bold text-indigo-700 hover:text-indigo-900 underline">
				{tFn('ask_link_previous_answers')}
			</a>
		</div>
	</div>
</section>
