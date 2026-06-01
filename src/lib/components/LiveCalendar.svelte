<script lang="ts">
	import { hearings } from '$lib/data/hearings';

	const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

	const hebDayFmt = new Intl.DateTimeFormat('en-US-u-ca-hebrew', { day: 'numeric' });
	const hebMonthFmt = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { month: 'long' });
	const hebYearFmt = new Intl.DateTimeFormat('en-US-u-ca-hebrew', { year: 'numeric' });

	function hebDay(d: Date): number {
		return parseInt(hebDayFmt.format(d), 10);
	}
	function hebMonthName(d: Date): string {
		return hebMonthFmt.format(d);
	}
	function hebYear(d: Date): string {
		return hebYearFmt.format(d);
	}

	function startOfHebMonth(d: Date): Date {
		const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		while (hebDay(x) !== 1) x.setDate(x.getDate() - 1);
		return x;
	}
	function nextHebMonthStart(monthStart: Date): Date {
		const x = new Date(monthStart);
		x.setDate(x.getDate() + 1);
		while (hebDay(x) !== 1) x.setDate(x.getDate() + 1);
		return x;
	}
	function prevHebMonthStart(monthStart: Date): Date {
		const x = new Date(monthStart);
		x.setDate(x.getDate() - 1);
		return startOfHebMonth(x);
	}

	function toDateStr(d: Date): string {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}

	const now = new Date();
	const todayStr = toDateStr(now);
	const todayMonthStartMs = startOfHebMonth(now).getTime();

	let monthStart = $state(startOfHebMonth(now));

	const bookedSet = new Set(
		hearings.filter((h) => h.status === 'מתוכנן').map((h) => h.date)
	);
	const bookedMap = new Map(
		hearings.filter((h) => h.status === 'מתוכנן').map((h) => [h.date, h])
	);

	type Cell = {
		date: string;
		day: number;
		gregLabel: string;
		isToday: boolean;
		isPast: boolean;
		isShabbat: boolean;
		isBooked: boolean;
		isEmpty: boolean;
	};

	function emptyCell(): Cell {
		return {
			date: '',
			day: 0,
			gregLabel: '',
			isToday: false,
			isPast: false,
			isShabbat: false,
			isBooked: false,
			isEmpty: true
		};
	}

	const grid = $derived.by(() => {
		const nextStart = nextHebMonthStart(monthStart);
		const daysInMonth = Math.round(
			(nextStart.getTime() - monthStart.getTime()) / 86400000
		);
		const firstDow = monthStart.getDay();
		const cells: Cell[] = [];

		for (let i = 0; i < firstDow; i++) cells.push(emptyCell());

		for (let i = 0; i < daysInMonth; i++) {
			const d = new Date(monthStart);
			d.setDate(d.getDate() + i);
			const ds = toDateStr(d);
			cells.push({
				date: ds,
				day: hebDay(d),
				gregLabel: `${d.getDate()}.${d.getMonth() + 1}`,
				isToday: ds === todayStr,
				isPast: ds < todayStr,
				isShabbat: d.getDay() === 6,
				isBooked: bookedSet.has(ds),
				isEmpty: false
			});
		}

		while (cells.length < 42) cells.push(emptyCell());
		return cells;
	});

	function isAvailable(c: Cell): boolean {
		return !c.isEmpty && !c.isPast && !c.isShabbat && !c.isBooked;
	}

	function prevMonth() {
		monthStart = prevHebMonthStart(monthStart);
	}
	function nextMonth() {
		monthStart = nextHebMonthStart(monthStart);
	}
	function canGoPrev(): boolean {
		return monthStart.getTime() > todayMonthStartMs;
	}

	const monthLabel = $derived(`${hebMonthName(monthStart)} ${hebYear(monthStart)}`);
	const availableCount = $derived(grid.filter((c) => isAvailable(c)).length);

	let hoveredCell = $state<Cell | null>(null);

	function cellTooltip(c: Cell): string {
		if (c.isEmpty) return '';
		if (c.isPast) return 'תאריך עבר';
		if (c.isShabbat) return 'שבת — אין דיונים';
		if (c.isBooked) {
			const h = bookedMap.get(c.date);
			return h ? `תפוס — ${h.caseName} ${h.time}` : 'תפוס';
		}
		return 'פנוי — לחץ לקביעת דיון';
	}
</script>

<div
	dir="rtl"
	class="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-purple-900/10 p-5 md:p-6"
>
	<header class="flex items-center justify-between gap-3 mb-4">
		<button
			type="button"
			onclick={prevMonth}
			disabled={!canGoPrev()}
			class="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-lg font-bold"
			aria-label="חודש קודם"
		>
			→
		</button>
		<div class="text-center">
			<h3 class="text-xl md:text-2xl font-black text-white">{monthLabel}</h3>
			<p class="text-xs text-blue-300 mt-1">
				{availableCount} תאריכים פנויים החודש
			</p>
		</div>
		<button
			type="button"
			onclick={nextMonth}
			class="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-lg font-bold"
			aria-label="חודש הבא"
		>
			←
		</button>
	</header>

	<div class="grid grid-cols-7 gap-1 mb-2">
		{#each dayNames as dn}
			<div class="text-center text-xs font-bold text-gray-400 py-1">{dn}</div>
		{/each}
	</div>

	<div class="grid grid-cols-7 gap-1">
		{#each grid as c}
			{#if c.isEmpty}
				<div class="aspect-square rounded-lg bg-transparent"></div>
			{:else if isAvailable(c)}
				<a
					href={`/request-hearing?date=${c.date}`}
					title={cellTooltip(c)}
					onmouseenter={() => (hoveredCell = c)}
					onmouseleave={() => (hoveredCell = null)}
					class="cal-cell available aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-bold border border-green-500/30 bg-green-500/10 text-green-200 hover:bg-green-500/30 hover:border-green-400 hover:scale-105 transition-all"
				>
					<span>{c.day}</span>
					<span class="text-[10px] font-normal opacity-60">{c.gregLabel}</span>
				</a>
			{:else}
				<div
					title={cellTooltip(c)}
					onmouseenter={() => (hoveredCell = c)}
					onmouseleave={() => (hoveredCell = null)}
					class="aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-bold cursor-not-allowed
						{c.isBooked ? 'border border-red-500/40 bg-red-500/15 text-red-200' : ''}
						{c.isShabbat && !c.isBooked ? 'border border-yellow-500/30 bg-yellow-500/10 text-yellow-300/70' : ''}
						{c.isPast && !c.isBooked && !c.isShabbat ? 'border border-white/5 bg-white/5 text-gray-600' : ''}
						{c.isToday ? 'ring-2 ring-blue-400' : ''}"
				>
					<span>{c.day}</span>
					<span class="text-[10px] font-normal opacity-50">{c.gregLabel}</span>
				</div>
			{/if}
		{/each}
	</div>

	<div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-300 justify-center">
		<span class="flex items-center gap-1.5">
			<span class="w-3 h-3 rounded border border-green-500/40 bg-green-500/20"></span>
			פנוי
		</span>
		<span class="flex items-center gap-1.5">
			<span class="w-3 h-3 rounded border border-red-500/40 bg-red-500/20"></span>
			תפוס
		</span>
		<span class="flex items-center gap-1.5">
			<span class="w-3 h-3 rounded border border-yellow-500/30 bg-yellow-500/20"></span>
			שבת
		</span>
		<span class="flex items-center gap-1.5">
			<span class="w-3 h-3 rounded ring-2 ring-blue-400 bg-transparent"></span>
			היום
		</span>
	</div>

	{#if hoveredCell && !hoveredCell.isEmpty}
		<div class="mt-3 text-center text-sm">
			{#if hoveredCell.isBooked}
				{@const h = bookedMap.get(hoveredCell.date)}
				<p class="text-red-300">
					<span class="font-bold">{hoveredCell.date}</span> —
					{#if h}{h.caseName} בשעה {h.time}{:else}תפוס{/if}
				</p>
			{:else if isAvailable(hoveredCell)}
				<p class="text-green-300">
					<span class="font-bold">{hoveredCell.date}</span> — פנוי, לחץ לקביעת דיון
				</p>
			{:else if hoveredCell.isShabbat}
				<p class="text-yellow-300">
					<span class="font-bold">{hoveredCell.date}</span> — שבת קודש
				</p>
			{:else if hoveredCell.isPast}
				<p class="text-gray-500">
					<span class="font-bold">{hoveredCell.date}</span> — תאריך עבר
				</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.cal-cell.available:hover {
		box-shadow: 0 0 12px rgba(74, 222, 128, 0.4);
	}
</style>
