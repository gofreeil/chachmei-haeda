<script lang="ts">
	import { hearings } from '$lib/data/hearings';
	import { getEvent, shabbatEntryTime, type CalEvent } from '$lib/data/jewish-calendar';
	import { getParsha } from '$lib/data/parshiyot';

	const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

	const hebDayFmt = new Intl.DateTimeFormat('en-US-u-ca-hebrew', { day: 'numeric' });
	const hebMonthFmt = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { month: 'long' });
	const hebYearNumericFmt = new Intl.DateTimeFormat('en-US-u-ca-hebrew', { year: 'numeric' });
	const gregMonthFmt = new Intl.DateTimeFormat('he-IL', { month: 'long' });

	function hebDay(d: Date): number {
		return parseInt(hebDayFmt.format(d), 10);
	}
	function hebMonthName(d: Date): string {
		return hebMonthFmt.format(d);
	}
	// 786 → "תשפ״ו". מיועד ל-3 ספרות אחרונות של שנה עברית.
	function numToGematria(n: number): string {
		const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
		const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
		const hundreds = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
		let str = hundreds[Math.floor(n / 100)] ?? '';
		const r = n % 100;
		if (r === 15) str += 'טו';
		else if (r === 16) str += 'טז';
		else {
			str += tens[Math.floor(r / 10)] ?? '';
			str += ones[r % 10] ?? '';
		}
		if (str.length === 1) return str + '׳'; // geresh
		return str.slice(0, -1) + '״' + str.slice(-1); // gershayim
	}
	function hebYearGematria(d: Date): string {
		const y = parseInt(hebYearNumericFmt.format(d), 10);
		return numToGematria(y % 1000); // 5786 → 786 → "תשפ״ו"
	}
	function gregMonth(d: Date): string {
		return gregMonthFmt.format(d);
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
		day: string;
		gregLabel: string;
		isToday: boolean;
		isPast: boolean;
		isShabbat: boolean;
		isFriday: boolean;
		isBooked: boolean;
		isEmpty: boolean;
		event: CalEvent | undefined;
		shabbatEntry: string | undefined;
		parsha: string | undefined;
	};

	function emptyCell(): Cell {
		return {
			date: '',
			day: '',
			gregLabel: '',
			isToday: false,
			isPast: false,
			isShabbat: false,
			isFriday: false,
			isBooked: false,
			isEmpty: true,
			event: undefined,
			shabbatEntry: undefined,
			parsha: undefined
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
				day: numToGematria(hebDay(d)),
				gregLabel: `${d.getDate()}.${d.getMonth() + 1}`,
				isToday: ds === todayStr,
				isPast: ds < todayStr,
				isShabbat: dow === 6,
				isFriday: dow === 5,
				isBooked: bookedSet.has(ds),
				isEmpty: false,
				event: getEvent(ds),
				shabbatEntry: dow === 5 ? shabbatEntryTime(d) : undefined,
				parsha: dow === 6 ? getParsha(ds) : undefined
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

	const monthLabel = $derived(`${hebMonthName(monthStart)} ${hebYearGematria(monthStart)}`);
	const gregRangeLabel = $derived.by(() => {
		const startD = monthStart;
		const endD = new Date(nextHebMonthStart(monthStart).getTime() - 86400000);
		const sm = gregMonth(startD);
		const em = gregMonth(endD);
		const sy = startD.getFullYear();
		const ey = endD.getFullYear();
		if (sm === em && sy === ey) return `${sm} ${sy}`;
		if (sy === ey) return `${sm} – ${em} ${ey}`;
		return `${sm} ${sy} – ${em} ${ey}`;
	});
	const availableCount = $derived(grid.filter((c) => isAvailable(c)).length);

	let hoveredCell = $state<Cell | null>(null);
	let mouseX = $state(0);
	let mouseY = $state(0);

	function onCellEnter(c: Cell, e: MouseEvent) {
		hoveredCell = c;
		mouseX = e.clientX;
		mouseY = e.clientY;
	}
	function onCellMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}
	function onCellLeave() {
		hoveredCell = null;
	}

	function eventColorClass(kind: CalEvent['kind']): string {
		switch (kind) {
			case 'יום-טוב':
				return 'border-purple-300 bg-purple-500/55 text-white';
			case 'חוה"מ':
				return 'border-purple-300/80 bg-purple-500/35 text-purple-50';
			case 'צום':
				return 'border-gray-300 bg-gray-500/50 text-white';
			case 'לאומי':
				return 'border-blue-300 bg-blue-500/55 text-white';
			case 'מועד':
				return 'border-orange-300 bg-orange-500/50 text-white';
		}
	}

	function cellTooltip(c: Cell): string {
		if (c.isEmpty) return '';
		const parts: string[] = [c.date];
		if (c.event) parts.push(c.event.name);
		if (c.parsha) parts.push(`פרשת ${c.parsha}`);
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
			<h3 class="text-xl md:text-2xl font-black text-white leading-tight">{monthLabel}</h3>
			<p class="text-[11px] md:text-xs text-blue-200/90 mt-0.5 font-semibold tracking-wide">{gregRangeLabel}</p>
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
					onmouseenter={(e) => onCellEnter(c, e)}
					onmousemove={onCellMove}
					onmouseleave={onCellLeave}
					class="cal-cell available aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-bold border border-green-300 bg-green-500/45 text-white hover:bg-green-500/65 hover:border-green-200 hover:scale-105 transition-all relative
						{c.event ? 'ring-1 ring-' + (c.event.kind === 'לאומי' ? 'blue' : c.event.kind === 'מועד' ? 'orange' : 'gray') + '-400/60' : ''}
						{c.isToday ? 'ring-2 ring-blue-300' : ''}"
				>
					<span class="leading-none">{c.day}</span>
					<span class="text-[10px] font-normal opacity-60 mt-0.5">{c.gregLabel}</span>
					{#if c.event}
						<span class="text-[9px] font-bold text-orange-100 mt-0.5 truncate w-full px-1 text-center">{c.event.name}</span>
					{:else if c.parsha}
						<span class="text-[9px] font-bold text-cyan-100 mt-0.5 truncate w-full px-1 text-center">{c.parsha}</span>
					{:else if c.shabbatEntry}
						<span class="text-[9px] font-bold text-yellow-100 mt-0.5">🕯 {c.shabbatEntry}</span>
					{/if}
				</a>
			{:else}
				<div
					onmouseenter={(e) => onCellEnter(c, e)}
					onmousemove={onCellMove}
					onmouseleave={onCellLeave}
					class="aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-bold cursor-not-allowed border
						{c.isBooked
							? 'border-red-300 bg-red-500/55 text-white'
							: c.event?.blocking
								? eventColorClass(c.event.kind)
								: c.isShabbat
									? 'border-yellow-300 bg-yellow-500/45 text-white'
									: c.isPast
										? 'border-white/10 bg-white/8 text-gray-500'
										: 'border-white/20 bg-white/10 text-gray-200'}
						{c.isToday ? 'ring-2 ring-blue-200' : ''}"
				>
					<span class="leading-none">{c.day}</span>
					<span class="text-[10px] font-normal opacity-60 mt-0.5">{c.gregLabel}</span>
					{#if c.event}
						<span class="text-[9px] font-bold mt-0.5 truncate w-full px-1 text-center">{c.event.name}</span>
					{:else if c.parsha}
						<span class="text-[9px] font-bold text-yellow-50 mt-0.5 truncate w-full px-1 text-center">{c.parsha}</span>
					{:else if c.shabbatEntry}
						<span class="text-[9px] font-bold text-yellow-100 mt-0.5">🕯 {c.shabbatEntry}</span>
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

</div>

{#if hoveredCell && !hoveredCell.isEmpty}
	<div
		dir="rtl"
		class="pointer-events-none fixed z-50 px-3 py-2 rounded-lg bg-black/90 backdrop-blur-sm border border-white/20 shadow-2xl text-sm whitespace-nowrap max-w-xs"
		style="left: {Math.min(mouseX + 14, (typeof window !== 'undefined' ? window.innerWidth : 9999) - 280)}px; top: {mouseY + 18}px;"
	>
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
				{#if hoveredCell.shabbatEntry}<span class="text-yellow-200"> · כניסת שבת {hoveredCell.shabbatEntry}</span>{/if}
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
				<span class="font-bold">{hoveredCell.date}</span> — שבת קודש{#if hoveredCell.parsha}, פרשת {hoveredCell.parsha}{/if}
			</p>
		{:else if hoveredCell.isPast}
			<p class="text-gray-400">
				<span class="font-bold">{hoveredCell.date}</span> — תאריך עבר
			</p>
		{/if}
	</div>
{/if}

<style>
	.cal-cell.available:hover {
		box-shadow: 0 0 12px rgba(74, 222, 128, 0.5);
	}
</style>
