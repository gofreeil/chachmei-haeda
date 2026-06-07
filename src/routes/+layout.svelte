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
	import { beforeNavigate } from "$app/navigation";
	import { closeAdPopup } from "$lib/adPopupStore";
	import { t, locale } from "svelte-i18n";
	import { get } from "svelte/store";

	let { children } = $props();

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));
	const tFn = (k: string) => {
		void _loc;
		return get(t)(k);
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
	<Header />

	<div class="layout-container flex-grow">
		<RightAdBanner />
		<main id="main-content" tabindex="-1" class="main-content">
			{@render children()}
			<div class="mt-2">
				<EthicalCodeBanner />
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
