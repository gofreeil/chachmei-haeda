<script lang="ts">
	import { hearings } from '$lib/data/hearings';
	import { getEvent, shabbatEntryTime, type CalEvent } from '$lib/data/jewish-calendar';

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
		isFriday: boolean;
		isBooked: boolean;
		isEmpty: boolean;
		event: CalEvent | undefined;
		shabbatEntry: string | undefined;
	};

	function emptyCell(): Cell {
		return {
			date: '',
			day: 0,
			gregLabel: '',
			isToday: false,
			isPast: false,
			isShabbat: false,
			isFriday: false,
			isBooked: false,
			isEmpty: true,
			event: undefined,
			shabbatEntry: undefined
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
			const dow = d.getDay();
			cells.push({
				date: ds,
				day: hebDay(d),
				gregLabel: `${d.getDate()}.${d.getMonth() + 1}`,
				isToday: ds === todayStr,
				isPast: ds < todayStr,
				isShabbat: dow === 6,
				isFriday: dow === 5,
				isBooked: bookedSet.has(ds),
				isEmpty: false,
				event: getEvent(ds),
				shabbatEntry: dow === 5 ? shabbatEntryTime(d) : undefined
			});
		}

		while (cells.length < 42) cells.push(emptyCell());
		return cells;
	});

	function isAvailable(c: Cell): boolean {
		if (c.isEmpty || c.isPast || c.isShabbat || c.isBooked) return false;
		if (c.event?.blocking) return false;
		return true;
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

	function eventColorClass(kind: CalEvent['kind']): string {
		switch (kind) {
			case 'יום-טוב':
				return 'border-purple-400/70 bg-purple-500/30 text-purple-50';
			case 'חוה"מ':
				return 'border-purple-400/50 bg-purple-500/15 text-purple-100';
			case 'צום':
				return 'border-gray-400/60 bg-gray-500/25 text-gray-100';
			case 'לאומי':
				return 'border-blue-400/70 bg-blue-500/25 text-blue-50';
			case 'מועד':
				return 'border-orange-400/60 bg-orange-500/20 text-orange-100';
		}
	}

	function cellTooltip(c: Cell): string {
		if (c.isEmpty) return '';
		const parts: string[] = [c.date];
		if (c.event) parts.push(c.event.name);
		if (c.shabbatEntry) parts.push(`כניסת שבת ${c.shabbatEntry}`);
		if (c.isShabbat) parts.push('שבת — אין דיונים');
		if (c.isBooked) {
			const h = bookedMap.get(c.date);
			parts.push(h ? `תפוס — ${h.caseName} ${h.time}` : 'תפוס');
		} else if (c.isPast) parts.push('תאריך עבר');
		else if (isAvailable(c)) parts.push('פנוי — לחץ לקביעת דיון');
		return parts.join(' · ');
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
					class="cal-cell available aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-bold border border-green-500/40 bg-green-500/15 text-green-100 hover:bg-green-500/40 hover:border-green-300 hover:scale-105 transition-all relative
						{c.event ? 'ring-1 ring-' + (c.event.kind === 'לאומי' ? 'blue' : c.event.kind === 'מועד' ? 'orange' : 'gray') + '-400/60' : ''}
						{c.isToday ? 'ring-2 ring-blue-300' : ''}"
				>
					<span class="leading-none">{c.day}</span>
					<span class="text-[10px] font-normal opacity-60 mt-0.5">{c.gregLabel}</span>
					{#if c.event}
						<span class="text-[9px] font-bold text-orange-200 mt-0.5 truncate w-full px-1 text-center">{c.event.name}</span>
					{:else if c.shabbatEntry}
						<span class="text-[9px] font-normal text-yellow-200/80 mt-0.5">🕯 {c.shabbatEntry}</span>
					{/if}
				</a>
			{:else}
				<div
					title={cellTooltip(c)}
					onmouseenter={() => (hoveredCell = c)}
					onmouseleave={() => (hoveredCell = null)}
					class="aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-bold cursor-not-allowed border
						{c.isBooked
							? 'border-red-400/70 bg-red-500/25 text-red-50'
							: c.event?.blocking
								? eventColorClass(c.event.kind)
								: c.isShabbat
									? 'border-yellow-400/50 bg-yellow-500/15 text-yellow-100'
									: c.isPast
										? 'border-white/5 bg-white/5 text-gray-600'
										: 'border-white/10 bg-white/5 text-gray-300'}
						{c.isToday ? 'ring-2 ring-blue-300' : ''}"
				>
					<span class="leading-none">{c.day}</span>
					<span class="text-[10px] font-normal opacity-60 mt-0.5">{c.gregLabel}</span>
					{#if c.event}
						<span class="text-[9px] font-bold mt-0.5 truncate w-full px-1 text-center">{c.event.name}</span>
					{:else if c.shabbatEntry}
						<span class="text-[9px] font-normal text-yellow-200/80 mt-0.5">🕯 {c.shabbatEntry}</span>
					{/if}
				</div>
			{/if}
		{/each}
	</div>

	<div class="mt-5 rounded-xl border border-white/10 bg-black/20 p-3 md:p-4">
		<div class="flex flex-wrap gap-x-5 gap-y-3 text-sm md:text-base font-bold text-white justify-center">
			<span class="flex items-center gap-2">
				<span class="w-5 h-5 rounded-md border-2 border-green-300 bg-green-400/70 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
				פנוי
			</span>
			<span class="flex items-center gap-2">
				<span class="w-5 h-5 rounded-md border-2 border-red-300 bg-red-400/70 shadow-[0_0_8px_rgba(248,113,113,0.6)]"></span>
				תפוס
			</span>
			<span class="flex items-center gap-2">
				<span class="w-5 h-5 rounded-md border-2 border-yellow-300 bg-yellow-400/70 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span>
				שבת
			</span>
			<span class="flex items-center gap-2">
				<span class="w-5 h-5 rounded-md border-2 border-purple-300 bg-purple-400/70 shadow-[0_0_8px_rgba(192,132,252,0.6)]"></span>
				חג
			</span>
			<span class="flex items-center gap-2">
				<span class="w-5 h-5 rounded-md border-2 border-orange-300 bg-orange-400/70 shadow-[0_0_8px_rgba(251,146,60,0.6)]"></span>
				מועד
			</span>
			<span class="flex items-center gap-2">
				<span class="w-5 h-5 rounded-md border-2 border-blue-300 bg-blue-400/70 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></span>
				לאומי
			</span>
			<span class="flex items-center gap-2">
				<span class="w-5 h-5 rounded-md ring-2 ring-blue-300 bg-transparent"></span>
				היום
			</span>
		</div>
	</div>

	{#if hoveredCell && !hoveredCell.isEmpty}
		<div class="mt-3 text-center text-sm">
			{#if hoveredCell.isBooked}
				{@const h = bookedMap.get(hoveredCell.date)}
				<p class="text-red-300">
					<span class="font-bold">{hoveredCell.date}</span> —
					{#if h}{h.caseName} בשעה {h.time}{:else}תפוס{/if}
				</p>
			{:else if hoveredCell.event}
				<p class="text-orange-200">
					<span class="font-bold">{hoveredCell.date}</span> — {hoveredCell.event.name}
					{#if hoveredCell.event.blocking}<span class="text-red-300"> (אין דיונים)</span>{/if}
				</p>
			{:else if hoveredCell.shabbatEntry}
				<p class="text-yellow-200">
					<span class="font-bold">{hoveredCell.date}</span> — ערב שבת, כניסת שבת {hoveredCell.shabbatEntry}
				</p>
			{:else if isAvailable(hoveredCell)}
				<p class="text-green-300">
					<span class="font-bold">{hoveredCell.date}</span> — פנוי, לחץ לקביעת דיון
				</p>
			{:else if hoveredCell.isShabbat}
				<p class="text-yellow-200">
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
		box-shadow: 0 0 12px rgba(74, 222, 128, 0.5);
	}
</style>
