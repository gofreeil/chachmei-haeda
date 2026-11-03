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

	<!-- הסנהדרין — רקע, ועדת פיוס, מה נדרש מכל יהודי והערות (עברית בלבד, כמו בלוק בתי הפיוס) -->
	<section class="mt-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl p-5 md:p-8" dir="rtl" aria-labelledby="sanhedrin-title">
		<h2 id="sanhedrin-title" class="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-2xl md:text-3xl font-black text-transparent text-center mb-5">
			הסנהדרין
		</h2>

		<div class="flex flex-col gap-3">
			<details class="group rounded-xl bg-white/5 border border-amber-400/20 open:border-amber-400/50 transition-colors" open>
				<summary class="cursor-pointer list-none flex items-start gap-3 p-4 text-base md:text-lg font-bold text-white hover:bg-white/5 rounded-xl">
					<span class="flex-shrink-0 text-amber-400 transition-transform group-open:rotate-90" aria-hidden="true">▸</span>
					<span>רקע — הקמת הסנהדרין</span>
				</summary>
				<div class="px-4 pb-4 ps-10 flex flex-col gap-3 text-sm md:text-base text-gray-200 leading-loose">
					<p>
						הסנהדרין של היום נוסדה בחודש תשרי שנת התשס"ה. תהליך ההקמה התחיל בכך ששלחו לכל הרבנים בישראל את ההצעה
						שהרב משה הלברשטאם יהיה הסמוך הראשון של הסנהדרין. כל הרבנים, ללא יוצא מן הכלל, הסכימו.
					</p>
					<p>
						הרב משה הלברשטאם היה ראש אב בתי הדין של העדה החרדית בירושלים, חסיד סאטמר, אוהב ישראל ממש כל יהודי,
						הפוסק של מכון פועה, והרב הקים את זק"א.
					</p>
					<p>
						באו עם התשובות לרב עובדיה יוסף. שאלו: האם הרב הלברשטאם ראוי להיות סמוך? הרב ענה: בוודאי שראוי.
						באו עם התשובות לרב שלום אלישיב. שאלו: האם הרב משה הלברשטאם ראוי להיות סמוך? האם הוא ראוי להסמיך אחרים?
						הרב ענה: ראוי וראוי.
					</p>
					<p>
						הרב משה הלברשטאם הסמיך שלושה רבנים, והם הסמיכו 71 רבנים בטבריה בשנת התשס"ה.
					</p>
					<p>
						נשיא הסנהדרין שנבחר היה כבוד הרב עדין שטיינזלץ זצ"ל, אב בית הדין היה כבוד הרב יואל שוורץ זצ"ל.
						כיום הסנהדרין מונה מעל 1,000 רבנים, ואב בית הדין הוא כבוד הרב אליהו אברגי'ל שליט"א.
					</p>
					<p>
						על תהליך ההקמה ופרטים נוספים אפשר לקבל באתר הסנהדרין:
						<a href="https://www.TheSanhedrin.org" target="_blank" rel="noopener" class="text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4 transition-colors" dir="ltr">www.TheSanhedrin.org</a>
					</p>
					<p>
						כיום יש סנהדרין גדולה, סנהדראות קטנות ובתי דין ייעודיים. בית הדין מתכנס בכל שבוע.
					</p>
				</div>
			</details>

			<details class="group rounded-xl bg-white/5 border border-amber-400/20 open:border-amber-400/50 transition-colors">
				<summary class="cursor-pointer list-none flex items-start gap-3 p-4 text-base md:text-lg font-bold text-white hover:bg-white/5 rounded-xl">
					<span class="flex-shrink-0 text-amber-400 transition-transform group-open:rotate-90" aria-hidden="true">▸</span>
					<span>ועדת פיוס</span>
				</summary>
				<div class="px-4 pb-4 ps-10 flex flex-col gap-3 text-sm md:text-base text-gray-200 leading-loose">
					<p>
						שלמה המלך אמר במשלי פרק י"ז, פסוק י"ד: "לפני התגלע הריב נטוש". לפעמים צדדים בסכסוכי ממון מתדיינים
						בבתי משפט 20 שנה. ועדת פיוס נועדה למנוע את המציאות של דיונים של שנים, כאשר רק עוכרי הדין "מרוויחים"
						את כספם על חשבון הצדדים. לכן בית הדין מפעיל את ועדת הפיוס.
					</p>
					<p>
						החלק החשוב של ועדת פיוס הוא לשקף לצדדים את מפות האינטרסים ומפות הרגישויות של שני הצדדים, ומתוך רצון טוב
						בדרך כלל הצדדים מוצאים את הנוסחה לפתרון הבעיה.
					</p>
					<p>
						אם זה לא עובד, אזי ועדת הפיוס משקפת לצדדים את רצון הבורא ברוך הוא על פי תורה.
					</p>
					<p>
						ברוך השם יתברך, עד היום ועדת הפיוס לא הצטרכה להגיע לחיתוך הדין.
					</p>
				</div>
			</details>

			<details class="group rounded-xl bg-white/5 border border-amber-400/20 open:border-amber-400/50 transition-colors">
				<summary class="cursor-pointer list-none flex items-start gap-3 p-4 text-base md:text-lg font-bold text-white hover:bg-white/5 rounded-xl">
					<span class="flex-shrink-0 text-amber-400 transition-transform group-open:rotate-90" aria-hidden="true">▸</span>
					<span>מה נדרש מכל יהודי?</span>
				</summary>
				<ol class="px-4 pb-4 ps-10 list-decimal marker:text-amber-400 marker:font-bold flex flex-col gap-3 text-sm md:text-base text-gray-200 leading-loose">
					<li>
						לפנות לרב שלו ולרבנים שהוא מכיר ולהגיד להם להצטרף לסנהדרין. כדי להקים את דברי התורה הזו,
						"השיבה שופטנו כבראשונה ויועצנו כבתחילה והסר ממנו יגון ואנחה".
					</li>
					<li>
						ללמוד לדעת להקים ולעשות את הלכות סנהדרין והלכות מלכים ברמב"ם, ועל ידי זאת להיות מבורך מהקדוש ברוך הוא:
						"ברוך אשר יקים את דברי התורה הזאת לעשות אותם". וכן את חושן משפט.
					</li>
					<li>
						להצטרף לסנהדרין, בין לסנהדרין הגדולה, או לסנהדראות קטנות, או לבתי דין ייעודיים.
					</li>
					<li>
						לקבל סמיכה של שלושה רבנים סמוכים — להיות סמוך בסנהדרין, ועל ידי כך מקבלים אור רוחני נוסף,
						וסימן האות סמך במצח, וכן מוקדשים לקדוש ברוך הוא ביתר שאת. כל "לי" בתורה הוא לנצח ולעולמים.
						ובסמוכים נאמר: "אספה לי שבעים איש מזקני ישראל".
					</li>
				</ol>
			</details>

			<details class="group rounded-xl bg-white/5 border border-amber-400/20 open:border-amber-400/50 transition-colors">
				<summary class="cursor-pointer list-none flex items-start gap-3 p-4 text-base md:text-lg font-bold text-white hover:bg-white/5 rounded-xl">
					<span class="flex-shrink-0 text-amber-400 transition-transform group-open:rotate-90" aria-hidden="true">▸</span>
					<span>הארות והערות</span>
				</summary>
				<ul class="px-4 pb-4 ps-10 list-disc marker:text-amber-400 flex flex-col gap-2 text-sm md:text-base text-gray-200 leading-loose">
					<li>ממליכים רק את הקדוש ברוך הוא.</li>
					<li>לא ממליכים אדם או אדמו"ר, או רב, אלא רק את הקדוש ברוך הוא.</li>
					<li>לא מקבלים כסף מכל גורם כזה או אחר של המדינה, או כסף של גויים.</li>
					<li>לא מקבלים משכורות.</li>
					<li>כל סמוך מתחייב לפנות את מקומו אם יגיע גדול ממנו בתורה, בחכמה ובמידות.</li>
					<li>כל סמוך חייב להיות הוגה בתורה יומם ולילה.</li>
					<li>לקבל עיקרון הלכתי: "אחרי רבים להטות", ולא להיות דן יחידי במסגרת הסנהדרין.</li>
					<li>להגיד את התורה והדעה של הסמוך בבירור ובצורה משכנעת.</li>
					<li>ישנו איסור לכבוש את התורה ואת החכמה, אלא יש חובה לשתף בבית הדין את התורה והדעה של הסמוך.</li>
					<li>
						תמיד בעם ישראל היו 12 שבטים. מה שאיחד את כולם זה סנהדרין. עם ישראל הוא חי וחולה. המחלה היא גלות.
						הסימפטומים של המחלה הם חצרות, עדות ופירוד. התרופה למחלה היא סנהדרין.
					</li>
					<li>
						2000 שנה למדנו לבד, פסקנו לבד, היינו דן יחידי. כאן בסנהדרין עושים סיעור מוחות על כל נושא,
						ומקבלים דעת הרוב. על פי רבים להטות.
					</li>
				</ul>
			</details>
		</div>
	</section>

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
