<script lang="ts">
	import FancyHeading from './FancyHeading.svelte';
	import HeichalNav from './HeichalNav.svelte';

	let { subtitle }: { subtitle: string } = $props();
</script>

<header class="text-center mb-8">
	<FancyHeading>
		<h1 class="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-3xl md:text-4xl font-black text-transparent whitespace-nowrap">
			היכל המעשה
		</h1>
	</FancyHeading>
	<p class="mt-3 text-gray-300 max-w-2xl mx-auto">
		{subtitle}
	</p>
</header>

<HeichalNav />
