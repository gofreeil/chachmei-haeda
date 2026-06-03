<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
		color?: 'blue' | 'indigo' | 'amber';
	}

	let { currentPage, totalPages, onPageChange, color = 'blue' }: Props = $props();

	const palette = {
		blue: {
			active: 'bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-300 shadow-[0_4px_12px_rgba(37,99,235,0.45)]',
			idle: 'bg-white/85 text-blue-900 border-blue-300/60 hover:bg-blue-50 hover:border-blue-400',
			arrow: 'bg-white/85 text-blue-900 border-blue-300/60 hover:bg-blue-50 hover:border-blue-400'
		},
		indigo: {
			active: 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-indigo-300 shadow-[0_4px_12px_rgba(79,70,229,0.45)]',
			idle: 'bg-white/85 text-indigo-900 border-indigo-300/60 hover:bg-indigo-50 hover:border-indigo-400',
			arrow: 'bg-white/85 text-indigo-900 border-indigo-300/60 hover:bg-indigo-50 hover:border-indigo-400'
		},
		amber: {
			active: 'bg-gradient-to-br from-amber-500 to-amber-700 text-white border-amber-300 shadow-[0_4px_12px_rgba(217,119,6,0.45)]',
			idle: 'bg-white/85 text-amber-900 border-amber-300/60 hover:bg-amber-50 hover:border-amber-400',
			arrow: 'bg-white/85 text-amber-900 border-amber-300/60 hover:bg-amber-50 hover:border-amber-400'
		}
	} as const;

	const styles = $derived(palette[color]);

	const pages = $derived.by(() => {
		const result: (number | 'ellipsis')[] = [];
		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) result.push(i);
			return result;
		}
		result.push(1);
		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);
		if (start > 2) result.push('ellipsis');
		for (let i = start; i <= end; i++) result.push(i);
		if (end < totalPages - 1) result.push('ellipsis');
		result.push(totalPages);
		return result;
	});

	function go(page: number) {
		if (page < 1 || page > totalPages || page === currentPage) return;
		onPageChange(page);
		try {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} catch {}
	}
</script>

{#if totalPages > 1}
	<nav class="mt-8 mb-2 flex justify-center" aria-label="ניווט בין עמודים">
		<ul class="flex flex-wrap items-center justify-center gap-1.5 md:gap-2" dir="rtl">
			<!-- הקודם (חץ ימינה ב-RTL = ימינה לעבר התחלה) -->
			<li>
				<button
					type="button"
					onclick={() => go(currentPage - 1)}
					disabled={currentPage === 1}
					aria-label="עמוד קודם"
					class="min-w-[40px] h-10 px-3 rounded-lg border-2 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/85 {styles.arrow}"
				>
					‹ הקודם
				</button>
			</li>

			{#each pages as p, i}
				{#if p === 'ellipsis'}
					<li aria-hidden="true">
						<span class="px-1 text-gray-500 font-bold select-none">…</span>
					</li>
				{:else}
					<li>
						<button
							type="button"
							onclick={() => go(p)}
							aria-label={`עמוד ${p}`}
							aria-current={p === currentPage ? 'page' : undefined}
							class="min-w-[40px] h-10 px-3 rounded-lg border-2 font-bold text-sm transition-all {p === currentPage ? styles.active : styles.idle}"
						>
							{p}
						</button>
					</li>
				{/if}
			{/each}

			<!-- הבא -->
			<li>
				<button
					type="button"
					onclick={() => go(currentPage + 1)}
					disabled={currentPage === totalPages}
					aria-label="עמוד הבא"
					class="min-w-[40px] h-10 px-3 rounded-lg border-2 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/85 {styles.arrow}"
				>
					הבא ›
				</button>
			</li>
		</ul>
	</nav>

	<p class="text-center text-xs text-gray-400 font-medium mt-1">
		עמוד {currentPage} מתוך {totalPages}
	</p>
{/if}
