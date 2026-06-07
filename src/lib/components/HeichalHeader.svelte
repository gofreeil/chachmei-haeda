<script lang="ts">
	import FancyHeading from './FancyHeading.svelte';
	import HeichalNav from './HeichalNav.svelte';
	import { t, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let { subtitle }: { subtitle: string } = $props();

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};
</script>

<header class="text-center mb-8">
	<FancyHeading>
		<h1 class="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-3xl md:text-4xl font-black text-transparent whitespace-nowrap">
			{tFn('heichal_hdr_title')}
		</h1>
	</FancyHeading>
	<p class="mt-3 text-gray-300 max-w-2xl mx-auto text-center">
		{subtitle}
	</p>
</header>

<HeichalNav />
