<script lang="ts">
	import LiveCalendar from '$lib/components/LiveCalendar.svelte';
	import { activity } from '$lib/data/activity';

	const recentActivity = activity.slice(0, 3);
	const activityKindIcons: Record<string, string> = {
		'סרטון': '🎬',
		'מאמר': '📝',
		'הודעה': '📣'
	};

	let askName = $state('');
	let askEmail = $state('');
	let askTopic = $state('הלכה');
	let askQuestion = $state('');

	const askTopics = [
		'הלכה',
		'מוסר עסקי',
		'חושן משפט / ממונות',
		'שלום בית ומשפחה',
		'שבע מצוות בני נח',
		'אחר'
	];

	function handleAskSubmit(e: Event) {
		e.preventDefault();
		const subject = `שאלה לבית הדין — ${askTopic}`;
		const body = `שם: ${askName}\nדוא"ל למענה: ${askEmail}\nנושא: ${askTopic}\n\nשאלה:\n${askQuestion}`;
		window.location.href = `mailto:freedomhasbegun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	}

	const sections = [
		{
			href: '/request-hearing',
			icon: '⚖️',
			title: 'בקשת דיון',
			desc: 'פתיחת תיק חדש לבוררות ושלום על פי דין תורה'
		},
		{
			href: '/activity',
			icon: '📡',
			title: 'הפעילות שלנו',
			desc: 'סרטונים, מאמרים והודעות שחכמי בית הדין מפרסמים'
		},
		{
			href: '/articles',
			icon: '📚',
			title: 'מאמרי רבנים',
			desc: 'מאמרים שאושרו על ידי שלושה רבנים לפחות'
		},
		{
			href: '/hearings',
			icon: '🎥',
			title: 'דיוני זום',
			desc: 'דיונים מתוכננים ושהתקיימו — קישורי השתתפות'
		},
		{
			href: '/rulings',
			icon: '📋',
			title: 'פסקי דין',
			desc: 'סיכומי דיון והכרעות פסוקות בכתב'
		}
	];

	const rulingSteps = [
		{
			num: 1,
			icon: '✍️',
			title: 'חתימה על אמנת המוסר',
			desc: 'הצדדים חותמים על הקוד האתי הכלל-עולמי UECC ומקבלים על עצמם את כללי הבוררות'
		},
		{
			num: 2,
			icon: '📅',
			title: 'תיאום תאריך לשני הצדדים',
			desc: 'מתאמים תאריך דיון שמתאים לכל בעלי הדין דרך לוח הדיונים באתר'
		},
		{
			num: 3,
			icon: '🎥',
			title: 'אישור בית הדין ופתיחת הדיון',
			desc: 'בית הדין מאשר את הבקשה ומתחילים את ההליך במפגש וירטואלי בזום'
		},
		{
			num: 4,
			icon: '🕊️',
			title: 'פסק דין חתום וצוות משכין שלום',
			desc: 'הצדדים מקבלים פסק דין חתום, ולאחריו צוות משכין שלום מלווה ביישום ההכרעה ובחזרת האחווה'
		}
	];

	const benefits = [
		'אמינות עסקית: שותפים יודעים שדבריך נשמרים בנאמנות',
		'גישה לקהילת בעלי ברית מוסרית — שידוכים עסקיים ותעסוקתיים',
		'הגנה משפטית פנים-קהילתית: פתרון מחלוקות מהיר וצודק לפני ערכאות',
		'התחייבות הדדית: עובדים, מעסיקים ולקוחות מקבלים על עצמם את אותה אמנה',
		'ברכת הבורא והשגחה מיוחדת על העוסקים ביושר ובאמת'
	];
</script>

<svelte:head>
	<title>חכמי העדה — בית דין לבוררות ושלום על פי דין תורה</title>
</svelte:head>

<section class="py-10 text-center">
	<div class="flex flex-row items-center justify-center gap-4 md:gap-6 flex-wrap">
		<div class="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-purple-500/30">
			<img
				src="/images/chachmei-logo.png"
				alt="חכמי העדה"
				class="w-full h-full object-contain scale-[1.15]"
				style="image-rendering: -webkit-optimize-contrast;"
			/>
		</div>
		<h2 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl md:text-5xl font-black text-transparent">
			ברוכים הבאים לחכמי העדה
		</h2>
	</div>
	<p class="mt-4 text-gray-300 text-lg md:text-xl">בית דין לבוררות ושלום על פי דין תורה</p>
	<p class="mt-2 text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
		פלטפורמה לפתרון מחלוקות בין אדם לחברו, מאמרי רבנים מאושרים, ודיוני זום עם סיכומי הכרעה כתובים — הכל
		תחת הקוד האתי הכלל-עולמי <span class="text-blue-300 font-bold">UECC</span>.
	</p>
</section>

<section class="mb-10">
	<header class="text-center mb-5">
		<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
			📅 לוח דיונים — בחר תאריך פנוי
		</h3>
		<p class="mt-2 text-gray-400 text-sm">לחץ על תאריך פנוי בירוק כדי לפתוח בקשה לאותו יום</p>
	</header>
	<LiveCalendar />
</section>

<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0 pb-10">
	{#each sections as s}
		<a
			href={s.href}
			class="block rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/50 transition-all p-5 text-right group"
		>
			<div class="text-4xl mb-3">{s.icon}</div>
			<h3 class="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{s.title}</h3>
			<p class="mt-2 text-sm text-gray-400 leading-relaxed">{s.desc}</p>
		</a>
	{/each}
</section>

<section class="mb-10">
	<div class="rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-blue-500/15 p-6 md:p-8 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
		<header class="text-center mb-6">
			<div class="text-5xl mb-3">🕮</div>
			<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
				שאל את חכמי העדה
			</h3>
			<p class="mt-2 text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
				יש לך שאלה בהלכה, במוסר עסקי, או בעניין שלום בית? כתוב לרבני בית הדין — התשובה תינתן בכתב לדוא״ל שתציין
			</p>
		</header>
		<form onsubmit={handleAskSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
			<div>
				<label class="block text-sm font-bold text-indigo-200 mb-1.5" for="ask-name">שם</label>
				<input
					id="ask-name"
					type="text"
					bind:value={askName}
					required
					placeholder="שמך המלא"
					class="w-full px-3 py-2.5 rounded-lg bg-black/30 border border-white/15 text-white placeholder-gray-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-colors"
				/>
			</div>
			<div>
				<label class="block text-sm font-bold text-indigo-200 mb-1.5" for="ask-email">דוא״ל למענה</label>
				<input
					id="ask-email"
					type="email"
					bind:value={askEmail}
					required
					placeholder="name@example.com"
					dir="ltr"
					class="w-full px-3 py-2.5 rounded-lg bg-black/30 border border-white/15 text-white placeholder-gray-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-colors text-right"
				/>
			</div>
			<div class="md:col-span-2">
				<label class="block text-sm font-bold text-indigo-200 mb-1.5" for="ask-topic">נושא השאלה</label>
				<select
					id="ask-topic"
					bind:value={askTopic}
					class="w-full px-3 py-2.5 rounded-lg bg-black/30 border border-white/15 text-white focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-colors"
				>
					{#each askTopics as topic}
						<option class="bg-gray-900" value={topic}>{topic}</option>
					{/each}
				</select>
			</div>
			<div class="md:col-span-2">
				<label class="block text-sm font-bold text-indigo-200 mb-1.5" for="ask-question">השאלה</label>
				<textarea
					id="ask-question"
					bind:value={askQuestion}
					required
					rows="5"
					placeholder="פרט את השאלה ככל האפשר — הקשר, רקע, מה כבר ניסית..."
					class="w-full px-3 py-2.5 rounded-lg bg-black/30 border border-white/15 text-white placeholder-gray-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-colors resize-y"
				></textarea>
			</div>
			<div class="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3">
				<p class="text-xs text-gray-400 max-w-md">השאלה תישלח לרבני בית הדין במייל. שאלות בעלות עניין ציבורי עשויות להופיע בעמוד פסקי הדין (בלי פרטים מזהים).</p>
				<button
					type="submit"
					class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all whitespace-nowrap"
				>
					🕮 שלח שאלה לבית הדין
				</button>
			</div>
		</form>
	</div>
</section>

<section class="mb-10">
	<header class="flex items-end justify-between mb-5 gap-3 flex-wrap">
		<div class="text-right">
			<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
				📡 הפעילות שלנו
			</h3>
			<p class="mt-2 text-gray-400 text-sm md:text-base">סרטונים, מאמרים והודעות שחכמי בית הדין מפרסמים</p>
		</div>
		<a
			href="/activity"
			class="text-sm font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
		>
			כל הפעילות ←
		</a>
	</header>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
		{#each recentActivity as a}
			<a
				href="/activity#{a.slug}"
				class="block rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/8 to-cyan-500/8 hover:border-teal-400/50 hover:from-teal-500/15 hover:to-cyan-500/15 transition-all p-5 text-right group"
			>
				<div class="flex items-center justify-between gap-2 mb-3">
					<span class="text-xs font-bold px-2.5 py-1 rounded-full border border-teal-400/40 bg-teal-500/15 text-teal-200">
						{activityKindIcons[a.kind] ?? ''} {a.kind}
					</span>
					<span class="text-xs text-gray-500">{a.date}</span>
				</div>
				<h4 class="text-base md:text-lg font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
					{a.title}
				</h4>
				<p class="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-3">{a.excerpt}</p>
				<p class="mt-3 text-xs text-cyan-300">מאת: {a.author}</p>
			</a>
		{/each}
	</div>
</section>

<section class="mb-10">
	<header class="text-center mb-6">
		<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
			⚖️ כיצד קובעים דין
		</h3>
		<p class="mt-2 text-gray-400 text-sm md:text-base">ארבעה שלבים פשוטים לפתיחת תיק בוררות והכרעה</p>
	</header>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
		{#each rulingSteps as step}
			<div class="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 text-right">
				<div class="absolute top-4 left-4 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
					{step.num}
				</div>
				<div class="text-4xl mb-3">{step.icon}</div>
				<h4 class="text-lg md:text-xl font-bold text-white mb-2">{step.title}</h4>
				<p class="text-sm text-gray-300 leading-relaxed">{step.desc}</p>
			</div>
		{/each}
	</div>
</section>

<section class="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 md:p-8 mb-10">
	<h3 class="text-2xl font-bold text-yellow-300 mb-4">יתרונות הקיום של הקוד המוסרי</h3>
	<ul class="space-y-3 text-gray-200">
		{#each benefits as b}
			<li class="flex items-start gap-3">
				<span class="text-yellow-400 mt-1">✓</span>
				<span>{b}</span>
			</li>
		{/each}
	</ul>

	<div class="mt-8 rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-br from-yellow-500/15 via-amber-500/10 to-yellow-600/15 p-6 md:p-8 text-center shadow-[0_0_30px_rgba(234,179,8,0.15)]">
		<h4 class="text-xl md:text-2xl font-black text-yellow-200 mb-2">
			הצטרף עוד היום לחתומים על הקוד האתי
		</h4>
		<p class="text-gray-200 leading-relaxed max-w-2xl mx-auto mb-5">
			הצטרפותך מחזקת את מעגל היושר והאמון בעסקים, במשפחה ובחברה. רבנים, אנשי עסקים, מעסיקים ועובדים — כולם מוזמנים לקבל על עצמם את שבע מצוות בני נח ולהיות חלק מתיקון עולם.
		</p>
		<div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
			<a
				href="mailto:freedomhasbegun@gmail.com?subject=%D7%91%D7%A7%D7%A9%D7%94%20%D7%9C%D7%94%D7%99%D7%97%D7%AA%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A7%D7%95%D7%93%20%D7%94%D7%90%D7%AA%D7%99%20UECC&body=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%94%D7%99%D7%97%D7%AA%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A7%D7%95%D7%93%20%D7%94%D7%90%D7%AA%D7%99%20%D7%94%D7%9B%D7%9C%D7%9C-%D7%A2%D7%95%D7%9C%D7%9E%D7%99%20UECC.%0A%0A%D7%A9%D7%9D%20%D7%9E%D7%9C%D7%90%3A%20%0A%D7%AA%D7%A4%D7%A7%D7%99%D7%93%2F%D7%A2%D7%99%D7%A1%D7%95%D7%A7%3A%20%0A%D7%A2%D7%99%D7%A8%3A%20%0A%D7%98%D7%9C%D7%A4%D7%95%D7%9F%3A%20%0A"
				class="inline-block px-7 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-all"
			>
				✍️ חתום על הקוד
			</a>
			<a
				href="/signatories"
				class="inline-block px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
			>
				רשימת החתומים →
			</a>
		</div>
	</div>
</section>
