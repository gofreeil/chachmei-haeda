<script lang="ts">
	import { onMount } from 'svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import type { CaseView } from '$lib/services/hearings-service';
	import { formatDual } from '$lib/hebrewDate';

	// שיתוף קישור התיק ע"י התובע בכל הערוצים המקובלים — הנתבע נכנס מהקישור,
	// מתחבר ומאשר את המועד בעצמו (רק הוא יכול, ראה hearingCases.ts).
	let { view, url }: { view: CaseView; url: string } = $props();

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};

	let canNativeShare = $state(false);
	let copied = $state(false);
	onMount(() => {
		canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
	});

	const body = $derived(
		[
			tFn('req_hearing_share_invite'),
			`${tFn('req_hearing_case_label')} #${view.caseRef}${view.nickname ? ` — ${view.nickname}` : ''}`,
			`${tFn('req_hearing_share_subject')} ${view.subject}`,
			`${tFn('req_hearing_share_date')} ${formatDual(view.proposedDate)}`,
			tFn('req_hearing_share_cta')
		].join('\n')
	);
	const fullText = $derived(`${body}\n${url}`);
	const enc = encodeURIComponent;

	// מספר הנתבע (אם התובע הקליד) — כך וואטסאפ/SMS נפתחים ישר לשיחה איתו
	const phoneDigits = $derived(view.defendantPhone.replace(/\D/g, ''));
	const waNumber = $derived(phoneDigits.startsWith('0') ? `972${phoneDigits.slice(1)}` : phoneDigits);

	const links = $derived([
		{ label: 'WhatsApp', cls: 'bg-green-600 text-white', href: `https://wa.me/${waNumber}?text=${enc(fullText)}` },
		{ label: 'Telegram', cls: 'bg-sky-500 text-white', href: `https://t.me/share/url?url=${enc(url)}&text=${enc(body)}` },
		{ label: 'SMS', cls: 'bg-gray-700 text-white', href: `sms:${phoneDigits}?&body=${enc(fullText)}` },
		{
			label: tFn('req_hearing_share_email'),
			cls: 'bg-amber-500 text-gray-900',
			href: `mailto:?subject=${enc(tFn('req_hearing_share_invite'))}&body=${enc(fullText)}`
		}
	]);

	async function copy() {
		try {
			await navigator.clipboard.writeText(fullText);
		} catch {
			const ta = document.createElement('textarea');
			ta.value = fullText;
			document.body.appendChild(ta);
			ta.select();
			document.execCommand('copy');
			ta.remove();
		}
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	async function nativeShare() {
		try {
			await navigator.share({ title: tFn('req_hearing_share_invite'), text: body, url });
		} catch {}
	}
</script>

<div class="mt-4 flex flex-wrap items-center gap-1.5">
	<span class="text-sm font-bold text-gray-900 me-1">{tFn('req_hearing_share_label')}</span>
	{#each links as l}
		<a
			href={l.href}
			target={l.href.startsWith('http') ? '_blank' : undefined}
			rel="noopener noreferrer"
			class="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 {l.cls}">{l.label}</a
		>
	{/each}
	<button
		type="button"
		onclick={copy}
		class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/80 border border-amber-400/50 text-gray-900 hover:bg-white"
	>
		{copied ? tFn('req_hearing_share_copied') : tFn('req_hearing_share_copy')}
	</button>
	{#if canNativeShare}
		<button
			type="button"
			onclick={nativeShare}
			class="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:opacity-90"
		>
			{tFn('req_hearing_share_more')}
		</button>
	{/if}
</div>
