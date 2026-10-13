<script lang="ts">
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import CaseShare from './CaseShare.svelte';
	import { approveCaseAs, type CaseParty, type CaseView } from '$lib/services/hearings-service';

	// לוח האישורים של תיק: כל צד מאשר רק בשם עצמו. מה מותר למי — מגיע מהשרת
	// (view.can / view.defendantBlock), כאן רק מציגים ושולחים.
	let { view, onChange }: { view: CaseView; onChange: (v: CaseView) => void } = $props();

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};

	let busy = $state<CaseParty | null>(null);
	let errorMsg = $state('');

	const allApproved = $derived(view.approvals.plaintiff && view.approvals.defendant && view.approvals.beitDin);
	const caseUrl = $derived(typeof window !== 'undefined' ? `${window.location.origin}/case/${view.id}` : `/case/${view.id}`);
	const loginHref = $derived(`/login?returnTo=${encodeURIComponent(`/case/${view.id}`)}`);

	const rows = $derived<Array<{ party: CaseParty; label: string; name: string }>>([
		{ party: 'plaintiff', label: tFn('req_hearing_plaintiff_label'), name: view.plaintiffName },
		{ party: 'defendant', label: tFn('req_hearing_defendant_label'), name: view.defendantName },
		{ party: 'beitDin', label: tFn('req_hearing_beit_din_label'), name: tFn('req_hearing_beit_din_rabbis') }
	]);

	// למה הצופה לא יכול לאשר בשם הנתבע — רק למי שאינו התובע (התובע יודע שזה לא תפקידו)
	const defendantHint = $derived(
		view.viewer?.role === 'plaintiff'
			? ''
			: view.defendantBlock === 'name'
				? tFn('case_block_name')
				: view.defendantBlock === 'phone'
					? tFn('case_block_phone')
					: ''
	);

	async function approve(party: CaseParty) {
		busy = party;
		errorMsg = '';
		try {
			onChange(await approveCaseAs(view.id, party));
		} catch (e) {
			errorMsg = (e as { serverMessage?: string })?.serverMessage || tFn('case_approve_error');
		} finally {
			busy = null;
		}
	}
</script>

<div class="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 md:p-6">
	<div class="flex items-center justify-between gap-3 mb-2">
		<h2 class="text-xl md:text-2xl font-bold text-blue-700">{tFn('req_hearing_case_label')} #{view.caseRef}</h2>
		<span class="text-sm text-gray-600 truncate">{view.nickname}</span>
	</div>

	<p class="text-sm text-gray-700 mb-1"><strong>{tFn('req_hearing_share_subject')}</strong> {view.subject}</p>
	{#if view.details}
		<p class="text-xs text-gray-600 whitespace-pre-line line-clamp-3 mb-1">{view.details}</p>
	{/if}
	<p class="text-gray-800 mb-3">
		{tFn('req_hearing_proposed_date_prefix')} <strong class="text-amber-700">{view.proposedDate}</strong>
		{tFn('req_hearing_proposed_date_suffix')}
	</p>

	<div class="space-y-2">
		{#each rows as r, i}
			<div class="rounded-xl border border-amber-400/40 bg-white/60 p-3">
				<div class="flex items-center justify-between gap-2">
					<div class="min-w-0">
						<div class="font-bold text-gray-900">{i + 1}. {r.label}</div>
						<div class="text-sm text-gray-600 truncate">{r.name}</div>
					</div>
					{#if view.approvals[r.party]}
						<span class="text-green-600 font-bold shrink-0">{tFn('req_hearing_approved_mark')}</span>
					{:else if view.can[r.party]}
						<button
							type="button"
							onclick={() => approve(r.party)}
							disabled={busy !== null}
							class="shrink-0 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold disabled:opacity-50"
						>
							{busy === r.party ? '…' : tFn('req_hearing_approve_date_btn')}
						</button>
					{:else if r.party === 'defendant' && view.defendantBlock === 'login'}
						<a href={loginHref} class="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:opacity-90">
							{tFn('case_login_to_approve')}
						</a>
					{:else}
						<span class="shrink-0 px-3 py-1.5 rounded-lg bg-white/80 text-gray-700 text-xs font-bold">
							{tFn('req_hearing_awaiting_approval_btn')}
						</span>
					{/if}
				</div>
				{#if r.party === 'defendant' && !view.approvals.defendant && defendantHint}
					<p class="mt-1.5 text-xs text-red-700">{defendantHint}</p>
				{/if}
			</div>
		{/each}
	</div>

	{#if errorMsg}
		<p class="mt-3 text-sm text-red-700 text-center">{errorMsg}</p>
	{/if}

	{#if allApproved}
		<div class="mt-4 rounded-xl border-2 border-green-500/40 bg-green-500/10 p-3 text-center">
			<p class="text-green-700 font-bold">🎉 {tFn('req_hearing_all_approved_msg')}</p>
		</div>
	{:else}
		<div class="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3 text-center text-sm text-yellow-800">
			{tFn('req_hearing_awaiting_others_msg')}
		</div>
	{/if}

	{#if view.viewer?.role === 'plaintiff' && !view.approvals.defendant}
		<CaseShare {view} url={caseUrl} />
	{/if}
</div>
