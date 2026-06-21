<script lang="ts">
    import { t, locale } from "svelte-i18n";
    import { get } from "svelte/store";
    let _loc = $state(get(locale));
    $effect(() => locale.subscribe(l => (_loc = l)));
    const tFn = (k: string) => { void _loc; return get(t)(k) as string; };
</script>

<footer class="site-footer bg-[#0d1117] border-t border-white/10 py-1 md:py-2 mt-3 md:mt-0">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
            class="flex flex-col md:flex-row items-center justify-between gap-1 md:gap-6"
        >
            <!-- Right: Brand image + text (ימין) -->
            <a
                href="https://gofreeil.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tFn("footer_brand_aria_label")}
                style="cursor: pointer;"
                class="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
                <div
                    class="flex-shrink-0 hover:scale-105 transition-transform border-2 border-amber-500/50 shadow-lg"
                    style="border-radius: 1rem; overflow: hidden;"
                >
                    <img
                        src="/images/yotzim-lecherut.png"
                        alt={tFn("footer_brand_image_alt")}
                        class="h-16 md:h-20 w-auto block"
                    />
                </div>

                <!-- Mobile: horizontal layout -->
                <div
                    class="flex md:hidden flex-col text-right leading-tight text-sm"
                >
                    <p class="text-yellow-400 font-black text-sm">
                        {tFn("footer_brand_title")}
                    </p>
                    <p class="text-gray-300 font-normal text-xs">
                        {tFn("footer_brand_subtitle")}
                    </p>
                </div>

                <!-- Desktop: original layout -->
                <div
                    class="hidden md:flex md:flex-col text-right leading-tight gap-1"
                >
                    <p
                        class="text-base md:text-lg text-gray-300 font-normal"
                    >
                        {tFn("footer_brand_subtitle")}
                    </p>
                    <p
                        class="text-lg md:text-xl font-black flex items-center gap-2 justify-end text-yellow-500"
                    >
                        <span>👉</span> {tFn("footer_brand_title")}
                    </p>
                </div>
            </a>

            <!-- Center: Links -->
            <nav
                aria-label={tFn("footer_nav_aria_label")}
                class="flex items-center gap-2 md:gap-4 text-xs md:text-lg text-gray-300 font-bold justify-center text-center"
            >
                <a href="/about/legal" class="hover:text-white transition-colors leading-tight">
                    <span class="md:hidden block">{tFn("footer_legal_mobile_line1")}<br />{tFn("footer_legal_mobile_line2")}</span>
                    <span class="hidden md:inline-block whitespace-nowrap">{tFn("footer_legal_desktop")}</span>
                </a>
                <span class="text-gray-600 font-black" aria-hidden="true">|</span>
                <a href="mailto:freedomhasbegun@gmail.com" class="hover:text-white transition-colors leading-tight" aria-label={tFn("footer_contact_aria_label")}>{tFn("contact_us")}</a>
                <span class="text-gray-600 font-black" aria-hidden="true">|</span>
                <a href="/about/advertise" class="hover:text-white transition-colors leading-tight">{tFn("footer_advertise")}</a>
            </nav>

            <!-- Left: Copyright -->
            <p class="text-gray-400 font-bold text-sm md:text-lg text-center md:text-right">
                &copy; {new Date().getFullYear()} {tFn("all_rights_reserved")}
            </p>
        </div>
    </div>
</footer>
