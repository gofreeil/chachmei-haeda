<script lang="ts">
	// ============================================================
	// /about — דף "אודותינו": פסקת פתיחה + אגף שאלות ותשובות.
	// המטרה: שמנועי חיפוש ומנועי AI יזהו בקלות מה האתר, למי ומה עושים בו.
	// התצוגה וסכמת FAQPage (JSON-LD) נבנות מאותו מקור אמת — $lib/aboutFaq —
	// כך שהזחלן רואה בדיוק את הטקסט שהגולש רואה.
	// הרבנים, החזון ומודל ההתנהלות נשארים בדף /about/revenue (מקושר מכאן).
	// ============================================================
	import Seo from '$lib/components/Seo.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import HeichalotGrid from '$lib/components/HeichalotGrid.svelte';
	import { SITE_NAME, PARENT_SITE, faqSchema, breadcrumbSchema } from '$lib/seo';
	import { aboutContentFor } from '$lib/aboutFaq';
	import { locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	let _loc = $state(get(locale));
	$effect(() => locale.subscribe((l) => (_loc = l)));

	const content = $derived(aboutContentFor(_loc));
	const dir = $derived(_loc && !['he', 'ps'].includes(_loc.slice(0, 2)) ? 'ltr' : 'rtl');

	// בלוק "בתי הפיוס" עבר לכאן מדף הבית — מיועד לזחלנים לשאילתות כמו
	// "בית דין לבוררות", "דין תורה", "גישור בסכסוך שכנים", ולכן נכתב בעברית מפורשת.
	const houseFaqs = [
		{
			q: 'מה זה בית הפיוס של חכמי העדה?',
			a: 'בית הפיוס הוא מסגרת התנדבותית לבוררות, גישור ופיוס בין צדדים בסכסוך — לפי תורת ישראל ובהסכמת הצדדים. הדיון נערך בפני חכמי העדה, בלי עלויות של עורכי דין ובלי המתנה של שנים בבית המשפט.'
		},
		{
			q: 'איך פותחים תיק ומגישים בקשה לדיון?',
			a: 'נכנסים להיכל המשפט, לוחצים על "בקשה לדיון", ממלאים את פרטי הצדדים ותמצית הסכסוך ובוחרים מועד מלוח הדיונים. הצד השני מוזמן להסכים לדיון, ולאחר הסכמתו נקבע המועד.'
		},
		{
			q: 'האם הדיון בתשלום?',
			a: 'לא. הדיינים מתנדבים והשירות ניתן בחינם — אין אגרות ואין עלויות משפט.'
		},
		{
			q: 'באילו סוגי סכסוכים אפשר לפנות?',
			a: 'סכסוכי שכנים, סכסוכים כספיים ועסקיים, שכירות, שותפות, לשון הרע, שלום בית וסכסוכי משפחה, מחלוקות בוועדי בית ובארגונים — כל מחלוקת שהצדדים מוכנים להביא להכרעה בדרך של פיוס.'
		},
		{
			q: 'האם אפשר לשאול שאלה בהלכה בלי לפתוח תיק?',
			a: 'כן. בעמוד "שאל את חכמי העדה" אפשר לשלוח שאלה בהלכה או בענייני חיים, והתשובות מתפרסמות בארכיון השאלות והתשובות באתר.'
		}
	];

	const schemas = $derived([
		breadcrumbSchema([
			{ name: SITE_NAME, path: '/' },
			{ name: content.title, path: '/about' },
		]),
		faqSchema(content.faq),
		faqSchema(houseFaqs),
	]);
</script>

<Seo
	title="{content.title} | {SITE_NAME}"
	description={content.intro}
	path="/about"
	keywords="אודות חכמי העדה, בתי הפיוס, בית דין לבוררות, שאלות ותשובות, יוצאים לחירות"
/>
<JsonLd data={schemas} />

<section class="py-10 md:py-14 px-4 max-w-3xl mx-auto" {dir}>
	<h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl md:text-5xl font-black text-transparent text-center">
		{content.title}
	</h1>

	<div class="mt-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10">
		<p class="text-base md:text-lg text-gray-200 leading-loose">
			{content.intro}
		</p>
		{#if !_loc || _loc.startsWith('he')}
			<!-- שיוך גלוי לתנועה-האם עם קישור אמיתי (הפסקה למעלה מתורגמת ולכן טקסט בלבד) -->
			<p class="mt-4 text-base md:text-lg text-gray-200 leading-loose">
				חכמי העדה הוא מיזם של התנועה החברתית
				<a href={PARENT_SITE.url} target="_blank" rel="noopener" class="text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4 transition-colors">{PARENT_SITE.name}</a>
				ומופעל בהתנדבות.
			</p>
		{/if}
		<p class="mt-4 text-center">
			<a href="/about/revenue" class="text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4 transition-colors">
				{content.moreLink} ←
			</a>
		</p>
	</div>

	<div class="mt-8">
		<HeichalotGrid />
	</div>

	<!-- בתי הפיוס — בוררות וגישור: עבר לכאן מדף הבית -->
	<section class="mt-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10" aria-labelledby="houses-of-reconciliation-title">
		<h2 id="houses-of-reconciliation-title" class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl md:text-3xl font-black text-transparent text-center mb-6">
			בתי הפיוס — בוררות וגישור על פי תורת ישראל
		</h2>
		<p class="text-base md:text-lg text-gray-200 leading-loose mb-3">
			<strong>חכמי העדה</strong> מפעילים את <strong>בתי הפיוס</strong>: מסגרת התנדבותית
			ל<strong>בוררות</strong>, <strong>גישור</strong> ו<strong>פיוס</strong> בין צדדים בסכסוך,
			על פי תורת ישראל ובהסכמת הצדדים. סכסוכי שכנים, מחלוקות כספיות ועסקיות, שכירות ושותפות,
			לשון הרע, שלום בית וסכסוכי משפחה — הכול נדון בפני דיינים מתנדבים, בלי אגרות, בלי עורכי דין
			ובלי המתנה של שנים בבית המשפט.
		</p>
		<p class="text-base md:text-lg text-gray-200 leading-loose mb-6">
			באתר תמצאו את <a href="/heichal-hamishpat" class="text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4 transition-colors">היכל המשפט</a>
			(פתיחת תיק, לוח דיונים ופסקי דין), את
			<a href="/heichal-hashalom" class="text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4 transition-colors">היכל השלום</a>
			(שיעורים והמלצות לשלום בית ולפיוס), את
			<a href="/articles" class="text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4 transition-colors">היכל הרוח</a>
			(מאמרים מחכמי ישראל),
			<a href="/qa" class="text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4 transition-colors">שאלות ותשובות בהלכה</a>
			ואת
			<a href="/heichal-hamaaseh/ethical-code" class="text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4 transition-colors">הקוד האתי העולמי (UECC)</a>.
		</p>

		<h3 class="text-xl md:text-2xl font-black text-amber-300 mb-4 text-center">שאלות נפוצות</h3>
		<div class="flex flex-col gap-3">
			{#each houseFaqs as f (f.q)}
				<details class="group rounded-xl bg-white/5 border border-amber-400/20 open:border-amber-400/50 transition-colors">
					<summary class="cursor-pointer list-none flex items-start gap-3 p-4 text-base font-bold text-white hover:bg-white/5 rounded-xl">
						<span class="flex-shrink-0 text-amber-400 transition-transform group-open:rotate-90" aria-hidden="true">▸</span>
						<span>{f.q}</span>
					</summary>
					<p class="px-4 pb-4 ps-10 text-sm text-gray-200 leading-loose">{f.a}</p>
				</details>
			{/each}
		</div>
	</section>

	<!-- שאלות ותשובות — אותו מקור אמת כמו ה-JSON-LD למעלה -->
	<section id="faq" aria-labelledby="faq-title" class="mt-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-6 md:p-10">
		<h2 id="faq-title" class="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-2xl md:text-3xl font-black text-transparent text-center mb-6">
			{content.faqTitle}
		</h2>

		<div class="flex flex-col gap-3">
			{#each content.faq as item, i (item.q)}
				<details
					class="group rounded-xl bg-white/5 border border-amber-400/20 open:border-amber-400/50 transition-colors"
					open={i < 2}
				>
					<summary class="cursor-pointer list-none flex items-start gap-3 p-4 text-base md:text-lg font-bold text-white hover:bg-white/5 rounded-xl">
						<span class="flex-shrink-0 text-amber-400 transition-transform group-open:rotate-90" aria-hidden="true">▸</span>
						<span>{item.q}</span>
					</summary>
					<p class="px-4 pb-4 ps-10 text-sm md:text-base text-gray-200 leading-loose">
						{item.a}
					</p>
				</details>
			{/each}
		</div>
	</section>
</section>

<style>
	/* מסתיר את משולש ברירת המחדל של הדפדפן — יש לנו חץ משלנו */
	summary::-webkit-details-marker {
		display: none;
	}
</style>
