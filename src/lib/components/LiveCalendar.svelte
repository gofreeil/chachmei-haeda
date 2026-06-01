<script lang="ts">
	import { hearings } from '$lib/data/hearings';

	const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
	const monthNames = [
		'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
		'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
	];

	const now = new Date();
	const todayStr = toDateStr(now);

	let viewYear = $state(now.getFullYear());
	let viewMonth = $state(now.getMonth());

	const bookedSet = new Set(
		hearings.filter((h) => h.status === 'מתוכנן').map((h) => h.date)
	);
	const bookedMap = new Map(
		hearings.filter((h) => h.status === 'מתוכנן').map((h) => [h.date, h])
	);

	function toDateStr(d: Date): string {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}

	type Cell = {
		date: string;
		day: number;
		isToday: boolean;
		isPast: boolean;
		isShabbat: boolean;
		isBooked: boolean;
		isOtherMonth: boolean;
	};

	const grid = $derived.by(() => {
		const first = new Date(viewYear, viewMonth, 1);
		const firstDow = first.getDay();
		const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
		const prevDays = new Date(viewYear, viewMonth, 0).getDate();
		const cells: Cell[] = [];

		for (let i = firstDow - 1; i >= 0; i--) {
			const d = new Date(viewYear, viewMonth - 1, prevDays - i);
			cells.push(buildCell(d, true));
		}
		for (let day = 1; day <= daysInMonth; day++) {
			const d = new Date(viewYear, viewMonth, day);
			cells.push(buildCell(d, false));
		}
		while (cells.length % 7 !== 0 || cells.length < 42) {
			const last = cells[cells.length - 1];
			const lastDate = new Date(last.date);
			lastDate.setDate(lastDate.getDate() + 1);
			cells.push(buildCell(lastDate, true));
			if (cells.length >= 42) break;
		}
		return cells;
	});

	function buildCell(d: Date, isOtherMonth: boolean): Cell {
		const dateStr = toDateStr(d);
		const isShabbat = d.getDay() === 6;
		const isPast = dateStr < todayStr;
		return {
			date: dateStr,
			day: d.getDate(),
			isToday: dateStr === todayStr,
			isPast,
			isShabbat,
			isBooked: bookedSet.has(dateStr),
			isOtherMonth
		};
	}

	function isAvailable(c: Cell): boolean {
		return !c.isPast && !c.isShabbat && !c.isBooked && !c.isOtherMonth;
	}

	function prevMonth() {
		if (viewMonth === 0) {
			viewMonth = 11;
			viewYear--;
		} else {
			viewMonth--;
		}
	}

	function nextMonth() {
		if (viewMonth === 11) {
			viewMonth = 0;
			viewYear++;
		} else {
			viewMonth++;
		}
	}

	function canGoPrev(): boolean {
		const cur = now.getFullYear() * 12 + now.getMonth();
		const view = viewYear * 12 + viewMonth;
		return view > cur;
	}

	let hoveredCell = $state<Cell | null>(null);

	function cellTooltip(c: Cell): string {
		if (c.isOtherMonth) return '';
		if (c.isPast) return 'תאריך עבר';
		if (c.isShabbat) return 'שבת — אין דיונים';
		if (c.isBooked) {
			const h = bookedMap.get(c.date);
			return h ? `תפוס — ${h.caseName} ${h.time}` : 'תפוס';
		}
		return 'פנוי — לחץ לקביעת דיון';
	}

	const availableCount = $derived(grid.filter((c) => isAvailable(c)).length);
</script>

<div class="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-purple-900/10 p-5 md:p-6">
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
			<h3 class="text-xl md:text-2xl font-black text-white">
				{monthNames[viewMonth]} {viewYear}
			</h3>
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
			{#if c.isOtherMonth}
				<div class="aspect-square rounded-lg bg-transparent"></div>
			{:else if isAvailable(c)}
				<a
					href={`/request-hearing?date=${c.date}`}
					title={cellTooltip(c)}
					onmouseenter={() => (hoveredCell = c)}
					onmouseleave={() => (hoveredCell = null)}
					class="cal-cell available aspect-square rounded-lg flex items-center justify-center text-sm font-bold border border-green-500/30 bg-green-500/10 text-green-200 hover:bg-green-500/30 hover:border-green-400 hover:scale-105 transition-all"
				>
					{c.day}
				</a>
			{:else}
				<div
					title={cellTooltip(c)}
					onmouseenter={() => (hoveredCell = c)}
					onmouseleave={() => (hoveredCell = null)}
					class="aspect-square rounded-lg flex items-center justify-center text-sm font-bold cursor-not-allowed
						{c.isBooked ? 'border border-red-500/40 bg-red-500/15 text-red-200' : ''}
						{c.isShabbat && !c.isBooked ? 'border border-yellow-500/30 bg-yellow-500/10 text-yellow-300/70' : ''}
						{c.isPast && !c.isBooked && !c.isShabbat ? 'border border-white/5 bg-white/5 text-gray-600' : ''}
						{c.isToday ? 'ring-2 ring-blue-400' : ''}"
				>
					{c.day}
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

	{#if hoveredCell && !hoveredCell.isOtherMonth}
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
