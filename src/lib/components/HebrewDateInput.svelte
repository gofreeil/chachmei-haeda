<script lang="ts">
	// בורר תאריך עברי: מחליף <input type="date">. הערך (bind:value) הוא תמיד ISO לועזי
	// (YYYY-MM-DD) — כך השרת והנתונים הקיימים לא משתנים — ומתחתיו מוצג התאריך הלועזי המתורגם.
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import {
		parseISO,
		toISO,
		hebDayNum,
		hebMonthName,
		hebYearNum,
		numToGematria,
		startOfHebMonth,
		nextHebMonthStart,
		prevHebMonthStart,
		hebMonthLength,
		gregRangeLabel,
		formatHebrewDate,
		formatGregorianLong
	} from '$lib/hebrewDate';

	let {
		value = $bindable(''),
		min = '',
		required = false,
		id = undefined,
		class: klass = '',
		placeholder = '',
		yearsBack = 3,
		yearsForward = 6
	}: {
		value?: string;
		min?: string;
		required?: boolean;
		id?: string;
		class?: string;
		placeholder?: string;
		/** כמה שנים עבריות אחורה/קדימה מהשנה הנוכחית מוצעות בבורר */
		yearsBack?: number;
		yearsForward?: number;
	} = $props();

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};

	const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayISO = toISO(today);
	const thisHebYear = hebYearNum(today);

	let open = $state(false);
	let monthStart = $state(startOfHebMonth(today));
	let root: HTMLDivElement | undefined = $state();

	const selected = $derived(parseISO(value));
	const hebLabel = $derived(formatHebrewDate(value));
	const gregLong = $derived(formatGregorianLong(value, _loc));

	function openPanel() {
		const base = selected ?? clampToMin(today);
		monthStart = startOfHebMonth(base);
		open = true;
	}
	function clampToMin(d: Date): Date {
		const m = parseISO(min);
		return m && m > d ? m : d;
	}
	function toggle() {
		if (open) open = false;
		else openPanel();
	}

	function monthsOfYear(ms: Date): Date[] {
		const y = hebYearNum(ms);
		let first = ms;
		for (let i = 0; i < 14; i++) {
			const p = prevHebMonthStart(first);
			if (hebYearNum(p) !== y) break;
			first = p;
		}
		const out = [first];
		let cur = first;
		for (let i = 0; i < 14; i++) {
			const n = nextHebMonthStart(cur);
			if (hebYearNum(n) !== y) break;
			out.push(n);
			cur = n;
		}
		return out;
	}

	const viewYear = $derived(hebYearNum(monthStart));
	const monthList = $derived(monthsOfYear(monthStart));
	const yearList = $derived.by(() => {
		const from = Math.min(thisHebYear - yearsBack, viewYear);
		const to = Math.max(thisHebYear + yearsForward, viewYear);
		const ys: number[] = [];
		for (let y = from; y <= to; y++) ys.push(y);
		return ys;
	});

	function pickMonth(e: Event) {
		const idx = Number((e.target as HTMLSelectElement).value);
		if (monthList[idx]) monthStart = monthList[idx];
	}
	function pickYear(e: Event) {
		const y = Number((e.target as HTMLSelectElement).value);
		const curName = hebMonthName(monthStart);
		let probe = new Date(monthStart);
		probe.setDate(probe.getDate() + (y - viewYear) * 365);
		for (let i = 0; i < 20 && hebYearNum(probe) !== y; i++) {
			probe.setDate(probe.getDate() + (hebYearNum(probe) < y ? 30 : -30));
		}
		if (hebYearNum(probe) !== y) return;
		const months = monthsOfYear(startOfHebMonth(probe));
		monthStart = months.find((m) => hebMonthName(m) === curName) ?? months[0];
	}

	const minDate = $derived(parseISO(min));
	function canGoPrev(): boolean {
		if (!minDate) return true;
		return new Date(monthStart.getTime() - 86400000) >= minDate;
	}
	function prevMonth() {
		if (canGoPrev()) monthStart = prevHebMonthStart(monthStart);
	}
	function nextMonth() {
		monthStart = nextHebMonthStart(monthStart);
	}

	type Cell = {
		iso: string;
		day: string;
		greg: string;
		isToday: boolean;
		isSelected: boolean;
		isShabbat: boolean;
		disabled: boolean;
		empty: boolean;
	};
	const grid = $derived.by(() => {
		const len = hebMonthLength(monthStart);
		const cells: Cell[] = [];
		const empty: Cell = { iso: '', day: '', greg: '', isToday: false, isSelected: false, isShabbat: false, disabled: true, empty: true };
		for (let i = 0; i < monthStart.getDay(); i++) cells.push(empty);
		for (let i = 0; i < len; i++) {
			const d = new Date(monthStart);
			d.setDate(d.getDate() + i);
			const iso = toISO(d);
			cells.push({
				iso,
				day: numToGematria(hebDayNum(d)),
				greg: `${d.getDate()}.${d.getMonth() + 1}`,
				isToday: iso === todayISO,
				isSelected: iso === value,
				isShabbat: d.getDay() === 6,
				disabled: !!minDate && d < minDate,
				empty: false
			});
		}
		while (cells.length % 7 !== 0) cells.push(empty);
		return cells;
	});

	function choose(c: Cell) {
		if (c.disabled || c.empty) return;
		value = c.iso;
		open = false;
	}
	function goToday() {
		const t0 = clampToMin(today);
		monthStart = startOfHebMonth(t0);
		if (!minDate || today >= minDate) {
			value = todayISO;
			open = false;
		}
	}
	function clear() {
		value = '';
		open = false;
	}

	function onWindowClick(e: MouseEvent) {
		if (open && root && !root.contains(e.target as Node)) open = false;
	}
	function onWindowKey(e: KeyboardEvent) {
		if (open && e.key === 'Escape') open = false;
	}
</script>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKey} />

<div class="hdi" bind:this={root} dir="rtl">
	<button
		{id}
		type="button"
		onclick={toggle}
		aria-haspopup="dialog"
		aria-expanded={open}
		class="flex items-center justify-between gap-2 text-right w-full {klass}"
	>
		<span class={hebLabel ? 'font-bold' : 'hdi-placeholder'}>
			{hebLabel || placeholder || tFn('hdi_placeholder')}
		</span>
		<span aria-hidden="true">📅</span>
	</button>
	{#if required}
		<!-- ולידציית required מובנית של הטופס: הכפתור עצמו אינו שדה טופס -->
		<input class="hdi-native" tabindex="-1" aria-hidden="true" required {value} />
	{/if}

	{#if gregLong}
		<p class="hdi-greg">{tFn('hdi_gregorian_prefix')} <strong>{gregLong}</strong></p>
	{/if}

	{#if open}
		<div class="hdi-panel" role="dialog" aria-label={tFn('hdi_placeholder')}>
			<div class="hdi-head">
				<button type="button" class="hdi-nav" onclick={prevMonth} disabled={!canGoPrev()} aria-label={tFn('hdi_prev_month')}>→</button>
				<div class="hdi-selects">
					<select class="hdi-select" aria-label={tFn('hdi_month_aria')} onchange={pickMonth}>
						{#each monthList as m, i}
							<option value={i} selected={m.getTime() === monthStart.getTime()}>{hebMonthName(m)}</option>
						{/each}
					</select>
					<select class="hdi-select" aria-label={tFn('hdi_year_aria')} onchange={pickYear}>
						{#each yearList as y}
							<option value={y} selected={y === viewYear}>{numToGematria(y % 1000)}</option>
						{/each}
					</select>
				</div>
				<button type="button" class="hdi-nav" onclick={nextMonth} aria-label={tFn('hdi_next_month')}>←</button>
			</div>
			<p class="hdi-range">{gregRangeLabel(monthStart)}</p>

			<div class="hdi-grid hdi-dow">
				{#each dayNames as dn}<span>{dn}</span>{/each}
			</div>
			<div class="hdi-grid">
				{#each grid as c}
					{#if c.empty}
						<span></span>
					{:else}
						<button
							type="button"
							class="hdi-cell"
							class:sel={c.isSelected}
							class:today={c.isToday}
							class:shabbat={c.isShabbat}
							disabled={c.disabled}
							onclick={() => choose(c)}
							title={c.iso}
						>
							<span class="hdi-d">{c.day}</span>
							<span class="hdi-g">{c.greg}</span>
						</button>
					{/if}
				{/each}
			</div>

			<div class="hdi-foot">
				<button type="button" class="hdi-link" onclick={goToday}>{tFn('hdi_today')}</button>
				{#if !required && value}
					<button type="button" class="hdi-link" onclick={clear}>{tFn('hdi_clear')}</button>
				{/if}
				<button type="button" class="hdi-link" onclick={() => (open = false)}>{tFn('hdi_close')}</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.hdi {
		position: relative;
		width: 100%;
	}
	.hdi-placeholder {
		opacity: 0.55;
	}
	.hdi-native {
		position: absolute;
		inset-inline-start: 0;
		bottom: 0;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
		border: 0;
		padding: 0;
	}
	.hdi-greg {
		margin: 0.25rem 0 0;
		font-size: 0.8rem;
		color: var(--text-secondary, #374151);
	}
	.hdi-panel {
		margin-top: 0.4rem;
		padding: 0.6rem;
		max-width: 21rem;
		border-radius: 0.75rem;
		border: 1px solid var(--border-soft, #d4be7f);
		background: var(--bg-cream-card, #f8eecb);
		color: var(--text-primary, #1a1a1a);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
	}
	.hdi-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
	}
	.hdi-selects {
		display: flex;
		gap: 0.3rem;
		flex: 1;
		justify-content: center;
	}
	.hdi-select {
		padding: 0.2rem 0.3rem;
		border-radius: 0.4rem;
		border: 1px solid var(--border-soft, #d4be7f);
		background: var(--bg-cream, #f0e3b8);
		color: var(--text-primary, #1a1a1a);
		font-weight: 700;
		font-size: 0.9rem;
		max-width: 6.5rem;
	}
	.hdi-nav {
		width: 2rem;
		height: 2rem;
		border-radius: 0.5rem;
		border: 1px solid var(--border-soft, #d4be7f);
		background: var(--bg-cream, #f0e3b8);
		font-weight: 800;
		cursor: pointer;
	}
	.hdi-nav:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
	.hdi-range {
		margin: 0.2rem 0 0.35rem;
		text-align: center;
		font-size: 0.72rem;
		color: var(--text-muted, #6b7280);
	}
	.hdi-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.2rem;
	}
	.hdi-dow {
		margin-bottom: 0.2rem;
		text-align: center;
		font-size: 0.72rem;
		font-weight: 800;
		color: var(--text-muted, #6b7280);
	}
	.hdi-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0.2rem 0;
		border-radius: 0.4rem;
		border: 1px solid transparent;
		background: rgba(255, 255, 255, 0.45);
		cursor: pointer;
		line-height: 1.1;
	}
	.hdi-cell:hover:not(:disabled) {
		border-color: #b45309;
		background: rgba(255, 255, 255, 0.85);
	}
	.hdi-cell:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
	.hdi-cell.shabbat {
		background: rgba(250, 204, 21, 0.3);
	}
	.hdi-cell.today {
		border-color: #2563eb;
	}
	.hdi-cell.sel {
		background: #b45309;
		color: #fff;
		border-color: #b45309;
	}
	.hdi-d {
		font-size: 0.9rem;
		font-weight: 800;
	}
	.hdi-g {
		font-size: 0.6rem;
		opacity: 0.65;
	}
	.hdi-foot {
		margin-top: 0.45rem;
		display: flex;
		gap: 0.9rem;
		justify-content: center;
	}
	.hdi-link {
		font-size: 0.8rem;
		font-weight: 700;
		color: #1d4ed8;
		text-decoration: underline;
		cursor: pointer;
		background: none;
		border: 0;
	}
</style>
