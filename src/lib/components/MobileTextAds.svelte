<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { t, locale } from "svelte-i18n";
    import { get } from "svelte/store";

    let _loc = $state(get(locale));
    $effect(() => locale.subscribe((l) => (_loc = l)));
    const tFn = (k: string) => {
        void _loc;
        return get(t)(k);
    };

    const ads = [
        {
            key: "mobile_text_ads_ad_1",
            color: "from-blue-600 to-purple-600",
        },
        {
            key: "mobile_text_ads_ad_2",
            color: "from-green-600 to-emerald-600",
        },
        {
            key: "mobile_text_ads_ad_3",
            color: "from-orange-600 to-red-600",
        },
        {
            key: "mobile_text_ads_ad_4",
            color: "from-purple-600 to-pink-600",
        },
    ];

    let currentIndex = $state(0);

    onMount(() => {
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % ads.length;
        }, 6000);

        return () => clearInterval(interval);
    });
</script>

<div
    class="w-full bg-[#0f172a] border-b border-white/5 md:hidden overflow-hidden h-10 flex items-center"
>
    <div class="relative w-full h-full flex items-center justify-center px-4">
        {#key currentIndex}
            <div
                in:fade={{ duration: 500 }}
                out:fade={{ duration: 500 }}
                class="absolute inset-0 flex items-center justify-center text-center"
            >
                <p
                    class="text-[13px] font-bold bg-gradient-to-r {ads[
                        currentIndex
                    ].color} bg-clip-text text-transparent px-4 truncate"
                >
                    {tFn(ads[currentIndex].key)}
                </p>
            </div>
        {/key}
    </div>
</div>
