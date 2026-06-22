<script lang="ts">
	import "../app.css";
	import "flag-icons/css/flag-icons.min.css";
	import "$lib/i18n";
	import Header from "$lib/components/Header.svelte";
	import RightAdBanner from "$lib/components/RightAdBanner.svelte";
	import AdsSidebar from "$lib/components/AdsSidebar.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import EthicalCodeBanner from "$lib/components/EthicalCodeBanner.svelte";
	import CoinAnimation from "$lib/components/CoinAnimation.svelte";
	import MobileAdsDrawer from "$lib/components/MobileAdsDrawer.svelte";
	import MobileAdPopup from "$lib/components/MobileAdPopup.svelte";
	import { beforeNavigate, goto } from "$app/navigation";
	import { page } from "$app/state";
	import { closeAdPopup } from "$lib/adPopupStore";
	import { t, locale } from "svelte-i18n";
	import { get } from "svelte/store";
	import { onMount } from "svelte";
	import { getCurrentUser, strapiLogout, type StrapiUser } from "$lib/strapi";

	let { children } = $props();
	let currentUser = $state<StrapiUser | null>(null);

	const hideEthicalBanner = $derived(page.url.pathname.startsWith('/heichal-hamaaseh/ethical-code'));

	onMount(async () => {
		currentUser = await getCurrentUser();
	});

	function handleLogout() {
		strapiLogout();
		currentUser = null;
		goto('/');
	}

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k) as string;
	};

	beforeNavigate(() => {
		closeAdPopup();
	});
</script>

<svelte:head>
	<title>{tFn('layout_page_title')}</title>
	<link rel="icon" href="/favicon.png" type="image/png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<a href="#main-content" class="skip-link">{tFn('layout_skip_to_main')}</a>
<CoinAnimation />
<MobileAdsDrawer currentUser={undefined} layoutUser={undefined} />
<MobileAdPopup />
<div class="min-h-screen flex flex-col bg-[#f0e3b8]">
	<Header {currentUser} onLogout={handleLogout} />

	<div class="layout-container flex-grow">
		<RightAdBanner />
		<main id="main-content" tabindex="-1" class="main-content">
			{@render children()}
			{#if !hideEthicalBanner}
				<div class="mt-2">
					<EthicalCodeBanner />
				</div>
			{/if}
			<div class="flex justify-center mt-3 mb-4">
				<button
					type="button"
					onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
					class="inline-flex items-center gap-1 text-amber-900 font-bold text-sm hover:text-amber-700 transition-colors"
				>
					{tFn('home_back_to_top')}
				</button>
			</div>
		</main>
		<AdsSidebar approvedAds={[]} />
	</div>

	<Footer />
</div>

<style>
	.layout-container {
		max-width: 1440px;
		margin: 0 auto;
		display: flex;
		gap: 2rem;
		padding: 2rem 2rem 0 2rem;
		width: 100%;
	}

	.main-content {
		flex: 1;
		min-width: 0;
	}

	@media (max-width: 1024px) {
		.layout-container {
			padding: 0;
			gap: 0;
			flex-direction: column;
			max-width: 100vw;
			overflow-x: hidden;
		}
		.main-content {
			max-width: 100vw;
			overflow-x: hidden;
		}
	}
</style>
