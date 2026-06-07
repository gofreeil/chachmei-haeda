?<script lang="ts">
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	let _loc = $state(get(locale));
	$effect(() => locale.subscribe(l => (_loc = l)));
	const tFn = (k: string) => { void _loc; return get(t)(k) as string; };

	let askName = $state('');
	let askEmail = $state('');
	let askTopic = $state('ask_topic_halacha');
	let askQuestion = $state('');

	const askTopics = [
		'ask_topic_halacha',
		'ask_topic_business_ethics',
		'ask_topic_choshen_mishpat',
		'ask_topic_shalom_bayit',
		'ask_topic_seven_noahide',
		'ask_topic_other'
	];

	function handleAskSubmit(e: Event) {
		e.preventDefault();
		const topicLabel = tFn(askTopic);
		const subject = `${tFn('ask_email_subject_prefix')} - ${topicLabel}`;
		const body = `${tFn('ask_email_field_name')}: ${askName}\n${tFn('ask_email_field_email')}: ${askEmail}\n${tFn('ask_email_field_topic')}: ${topicLabel}\n\n${tFn('ask_email_field_question')}:\n${askQuestion}`;
		window.location.href = `mailto:freedomhasbegun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
					class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all whitespace-nowrap"
				>
					📚 {tFn('ask_btn_submit')}
				</button>
			</div>
		</form>
		<div class="mt-6 text-center">
			<a href="/qa" class="text-sm font-bold text-indigo-700 hover:text-indigo-900 underline">
				{tFn('ask_link_previous_answers')}
			</a>
		</div>
	</div>
</section>
