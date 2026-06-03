<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		noLine?: boolean;
	}

	let { children, noLine = false }: Props = $props();
</script>

<div class="text-center">
	<div class="flex items-center justify-center gap-1">
		<img
			src="/images/olive-branch.png"
			alt=""
			aria-hidden="true"
			class="olive-branch olive-branch-left h-7 md:h-9 w-auto select-none"
		/>
		<span class="text-xl md:text-2xl text-amber-700 drop-shadow-[0_1px_1px_rgba(120,53,15,0.4)]" aria-hidden="true">❦</span>
		{@render children?.()}
		<span class="text-xl md:text-2xl text-amber-700 drop-shadow-[0_1px_1px_rgba(120,53,15,0.4)]" aria-hidden="true">❦</span>
		<img
			src="/images/olive-branch.png"
			alt=""
			aria-hidden="true"
			class="olive-branch olive-branch-right h-7 md:h-9 w-auto select-none"
		/>
	</div>
	{#if !noLine}
		<div class="mt-1 mx-auto h-0.5 w-48 md:w-64 bg-gradient-to-r from-transparent via-amber-700 to-transparent" aria-hidden="true"></div>
	{/if}
</div>

<style>
	.olive-branch {
		object-fit: contain;
		object-position: center;
		--olive-flip: 1;
		transform: translateY(0.5rem) scaleX(var(--olive-flip)) scaleY(-1);
	}
	.olive-branch-right {
		--olive-flip: -1;
	}
</style>
