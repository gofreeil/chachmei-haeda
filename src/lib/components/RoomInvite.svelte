<script lang="ts">
	import { onMount } from 'svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import {
		fetchInviteDayanim,
		sendRoomInvite,
		type InviteDayan,
		type InviteSent,
		type RoomCase
	} from '$lib/services/hearings-service';

	// הזמנה חכמה להיכל משפט — בית הדין בוחר: תיק (בעלי הדין מסומנים אוטומטית),
	// דיינים (מי שאישר את התיק מסומן מראש) וטלפונים נוספים; כפתור אחד שולח לכולם.
	// הרכיב יושב בתוך המשטח הכהה (welcome-dark) של היכל המשפט.
	let {
		link,
		cases,
		fixedCaseId = '',
		onclose
	}: { link: string; cases: RoomCase[]; fixedCaseId?: string; onclose: () => void } = $props();

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};

	// תיק שמועדו היום — ברירת המחדל כשאין תיק קבוע (בלי יומן: רק תאריך מוצע לכל תיק)
	// הרכיב נטען מחדש ({#key}) כשהיעד משתנה, ולכן ערכי הפתיחה נקראים פעם אחת בכוונה
	const today = new Date().toLocaleDateString('en-CA');
	// svelte-ignore state_referenced_locally
	const todays = cases.filter((c) => c.proposedDate === today);

	// svelte-ignore state_referenced_locally
	let caseId = $state(fixedCaseId || (todays.length === 1 ? todays[0].id : ''));
	let plaintiff = $state(false);
	let defendant = $state(false);
	let dayanim = $state<InviteDayan[]>([]);
	let pickedDayan = $state<number[]>([]);
	let phones = $state<string[]>([]);
	let phoneInput = $state('');
	let sending = $state(false);
	let error = $state('');
	let results = $state<InviteSent[] | null>(null);
	let copied = $state(false);

	const theCase = $derived(cases.find((c) => c.id === caseId) ?? null);

	/** תיק נבחר: שני בעלי הדין מסומנים, והדיין שאישר אותו מסומן מראש */
	function applyCase() {
		plaintiff = defendant = !!theCase;
		const approver = theCase?.beitDinId ? Number(theCase.beitDinId) : 0;
		if (approver && dayanim.some((d) => d.id === approver) && !pickedDayan.includes(approver)) {
			pickedDayan = [...pickedDayan, approver];
		}
	}

	onMount(async () => {
		try {
			dayanim = await fetchInviteDayanim();
		} catch {
			dayanim = [];
		}
		applyCase();
	});

	const allDayanim = $derived(dayanim.length > 0 && pickedDayan.length === dayanim.length);
	function toggleDayan(id: number) {
		pickedDayan = pickedDayan.includes(id) ? pickedDayan.filter((x) => x !== id) : [...pickedDayan, id];
	}
	function toggleAllDayanim() {
		pickedDayan = allDayanim ? [] : dayanim.map((d) => d.id);
	}

	function addPhone() {
		const p = phoneInput.trim();
		if (p.replace(/\D/g, '').length >= 9 && !phones.includes(p)) phones = [...phones, p];
		phoneInput = '';
	}

	const nothingPicked = $derived(!plaintiff && !defendant && pickedDayan.length === 0 && phones.length === 0);

	async function send() {
		addPhone();
		if (nothingPicked) {
			error = tFn('mishpat_invite_pick_one');
			return;
		}
		sending = true;
		error = '';
		results = null;
		try {
			const parties: Array<'plaintiff' | 'defendant'> = [];
			if (plaintiff) parties.push('plaintiff');
			if (defendant) parties.push('defendant');
			results = await sendRoomInvite({
				link,
				caseId: caseId || undefined,
				parties: caseId ? parties : [],
				dayanIds: pickedDayan,
				phones
			});
		} catch (e) {
			error = (e as { serverMessage?: string })?.serverMessage || tFn('case_meet_error');
		} finally {
			sending = false;
		}
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(link);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			window.prompt('', link);
		}
	}

	const viaLabel = (v: InviteSent['via']) => tFn(`mishpat_invite_via_${v}`);

	const chip = (on: boolean) =>
		`px-2.5 py-1 rounded-full text-xs font-bold ${on ? 'bg-indigo-600 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-200'}`;
</script>

<div class="mt-3 rounded-xl border border-white/20 bg-black/40 p-2.5 md:p-3 space-y-2" id="room-invite">
	<div class="flex items-center justify-between gap-2">
		<h3 class="font-black text-indigo-200 text-sm md:text-base">{tFn('mishpat_invite_title')}</h3>
		<button type="button" onclick={onclose} class="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold" aria-label="✕">✕</button>
	</div>

	{#if !fixedCaseId}
		<label class="block text-xs text-gray-300">
			{tFn('mishpat_invite_case')}
			<select
				value={caseId}
				onchange={(e) => {
					caseId = e.currentTarget.value;
					applyCase();
				}}
				class="mt-1 w-full rounded-lg bg-black/50 border border-white/20 text-white text-sm px-2 py-1.5"
			>
				<option value="">{tFn('mishpat_invite_no_case')}</option>
				{#each cases as c (c.id)}
					<option value={c.id}>#{c.caseRef} · {c.nickname} · {c.proposedDate}</option>
				{/each}
			</select>
		</label>
	{/if}

	{#if theCase}
		<div class="flex items-center gap-1.5 flex-wrap">
			<span class="text-xs font-bold text-gray-300">{tFn('mishpat_invite_parties')}:</span>
			<button type="button" class={chip(plaintiff)} onclick={() => (plaintiff = !plaintiff)} aria-pressed={plaintiff}>
				{plaintiff ? '✓' : '+'} {tFn('mishpat_party_plaintiff')} · {theCase.plaintiffName}
			</button>
			<button type="button" class={chip(defendant)} onclick={() => (defendant = !defendant)} aria-pressed={defendant}>
				{defendant ? '✓' : '+'} {tFn('mishpat_party_defendant')} · {theCase.defendantName}
			</button>
		</div>
	{/if}

	{#if dayanim.length > 0}
		<div class="flex items-center gap-1.5 flex-wrap">
			<span class="text-xs font-bold text-gray-300">{tFn('mishpat_invite_dayanim')}:</span>
			{#each dayanim as d (d.id)}
				<button
					type="button"
					class={chip(pickedDayan.includes(d.id))}
					onclick={() => toggleDayan(d.id)}
					aria-pressed={pickedDayan.includes(d.id)}
					title={theCase?.beitDinId === String(d.id) ? tFn('mishpat_invite_approved_tag') : ''}
				>
					{pickedDayan.includes(d.id) ? '✓' : '+'} {d.name}{theCase?.beitDinId === String(d.id) ? ' ⚖️' : ''}
				</button>
			{/each}
			{#if dayanim.length > 1}
				<button type="button" class={chip(allDayanim)} onclick={toggleAllDayanim} aria-pressed={allDayanim}>{tFn('mishpat_invite_all')}</button>
			{/if}
		</div>
	{/if}

	<div class="flex items-center gap-1.5 flex-wrap">
		<input
			type="tel"
			inputmode="tel"
			dir="ltr"
			bind:value={phoneInput}
			onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addPhone())}
			placeholder={tFn('mishpat_invite_phone_ph')}
			class="flex-1 min-w-[10rem] rounded-lg bg-black/50 border border-white/20 text-white text-sm px-2 py-1.5"
		/>
		<button type="button" onclick={addPhone} class="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold">{tFn('mishpat_invite_add')}</button>
		{#each phones as p (p)}
			<button type="button" class={chip(true)} onclick={() => (phones = phones.filter((x) => x !== p))} title="✕">
				<span dir="ltr">{p}</span> ✕
			</button>
		{/each}
	</div>

	<div class="flex items-center gap-2 flex-wrap">
		<button
			type="button"
			onclick={send}
			disabled={sending}
			class="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-50"
		>
			{sending ? '…' : tFn('mishpat_invite_send')}
		</button>
		<button type="button" onclick={copyLink} class="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-300 text-xs font-bold">
			{copied ? tFn('mishpat_room_invite_copied') : tFn('mishpat_room_invite_copy')}
		</button>
		{#if error}<span class="text-xs font-bold text-red-300">{error}</span>{/if}
	</div>

	{#if results}
		<ul class="text-xs space-y-0.5">
			{#each results as r}
				<li class="flex items-center gap-2 flex-wrap">
					<span class="font-bold text-white">{r.name}</span>
					<span class={r.via === 'none' ? 'text-amber-300' : 'text-green-300'}>
						{r.via === 'none' ? '⚠️' : '✓'} {viaLabel(r.via)}
					</span>
					{#if r.wa}
						<a href={r.wa} target="_blank" rel="noopener" class="font-bold text-green-300 hover:underline">{tFn('mishpat_invite_wa')}</a>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
