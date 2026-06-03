<script lang="ts">
	import { onMount } from 'svelte';
	import LiveCalendar from '$lib/components/LiveCalendar.svelte';

	let isRegistered = $state(false);
	let userName = $state('');

	type CaseFile = {
		id: string;
		caseName: string;
		role: string;
		status: 'פעיל' | 'הסתיים' | 'ממתין לדיון';
		hearingDate: string;
		summary: string;
		videoUrl: string | null;
		rulingUrl: string | null;
	};

	const myCases: CaseFile[] = [
		{
			id: 'TIK-2026-014',
			caseName: 'בוררות עסקית - שותפות מסעדה',
			role: 'תובע',
			status: 'הסתיים',
			hearingDate: '2026-05-12',
			summary:
				'מחלוקת על חלוקת רווחים בשנה השלישית להפעלת המסעדה. נקבעה חלוקה 60/40 לטובת המייסד שהביא את ההון העצמי, וצוות משכין שלום ילווה את ההפרדה ב-90 ימים הקרובים.',
			videoUrl: '#video-tik-014',
			rulingUrl: '#ruling-tik-014'
		},
		{
			id: 'TIK-2026-022',
			caseName: 'שלום בית - תיווך משפחתי',
			role: 'מבקש',
			status: 'ממתין לדיון',
			hearingDate: '2026-06-18',
			summary:
				'בקשה לתיווך בסכסוך עם אחי על ניהול עיזבון. הצדדים הסכימו לפנות לבית הדין במקום לערכאות. תאריך נקבע. ממתינים לחתימה סופית של האח השני על אמנת המוסר.',
			videoUrl: null,
			rulingUrl: null
		}
	];

	onMount(() => {
		try {
			const user = JSON.parse(localStorage.getItem('chachmei-user') || 'null');
			if (user) {
				isRegistered = true;
				userName = user.name || user.nickname || 'המשתמש';
			}
		} catch {
			/* ignore */
		}
	});

	function statusColor(s: CaseFile['status']): string {
		if (s === 'פעיל') return 'bg-blue-500/80 text-white';
		if (s === 'הסתיים') return 'bg-green-600/80 text-white';
		return 'bg-amber-500/80 text-white';
	}

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
			icon: '⚖️',
			title: 'אישור בית הדין ופתיחת הדיון',
			desc: 'בית הדין מאשר את הבקשה ומתחילים את ההליך במפגש וירטואלי מוקלט'
		},
		{
			num: 4,
			icon: '🕊️',
			title: 'פסק דין חתום וצוות משכין שלום',
			desc: 'הצדדים מקבלים פסק דין חתום, ולאחריו צוות משכין שלום מלווה ביישום ההכרעה ובחזרת האחווה'
		}
	];
</script>

<svelte:head>
	<title>היכל המשפט - חכמי העדה</title>
	<meta name="description" content="היכל המשפט בחכמי העדה - פסקי דין, הכרעות ובוררות על פי דין תורה. לוח דיונים, פתיחת תיק וארכיון פסקי דין חתומים." />

	<!-- Open Graph / WhatsApp / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="היכל המשפט - חכמי העדה" />
	<meta property="og:description" content="פסקי דין, הכרעות ובוררות על פי דין תורה - בית הדין לבוררות ושלום של חכמי העדה. לוח דיונים, פתיחת תיק וארכיון פסקי דין חתומים." />
	<meta property="og:image" content="https://chachmim.vercel.app/og-image.jpg?v=2" />
	<meta property="og:image:secure_url" content="https://chachmim.vercel.app/og-image.jpg?v=2" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="600" />
	<meta property="og:image:height" content="600" />
	<meta property="og:image:alt" content="לוגו חכמי העדה - היכל המשפט" />
	<meta property="og:url" content="https://chachmim.vercel.app/heichal-hamishpat" />
	<meta property="og:site_name" content="חכמי העדה" />
	<meta property="og:locale" content="he_IL" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="היכל המשפט - חכמי העדה" />
	<meta name="twitter:description" content="פסקי דין, הכרעות ובוררות על פי דין תורה - בית הדין לבוררות ושלום של חכמי העדה." />
	<meta name="twitter:image" content="https://chachmim.vercel.app/og-image.jpg?v=2" />
</svelte:head>

<section class="py-8">
	<header class="text-center mb-6">
		<div class="text-5xl mb-3">🏛️</div>
		<h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
			היכל המשפט
		</h1>
		<p class="mt-3 text-gray-700 text-base md:text-lg font-bold max-w-2xl mx-auto">
			כך נראה הליך בוררות אצלנו - ארבעה שלבים פשוטים מהחתימה ועד החזרת האחווה
		</p>
	</header>

	<section class="mb-8">
		<header class="text-center mb-5">
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
				⚖️ כיצד קובעים דין
			</h2>
			<p class="mt-2 text-gray-600 text-sm md:text-base font-bold">ארבעה שלבים פשוטים לפתיחת תיק בוררות והכרעה</p>
		</header>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
			{#each rulingSteps as step}
				<div class="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 text-right">
					<div class="absolute top-4 right-4 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
						{step.num}
					</div>
					<div class="text-4xl mb-3 mr-14">{step.icon}</div>
					<h3 class="text-lg md:text-xl font-bold text-white mb-2">{step.title}</h3>
					<p class="text-sm text-gray-300 leading-relaxed">{step.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="mb-8">
		<header class="text-center mb-5">
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-700 text-xs font-black mb-3">
				🚧 הדגמה - מוקאפ
			</div>
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
				🎥 חדר הדיון הוירטואלי
			</h2>
			<p class="mt-2 text-gray-700 text-sm md:text-base font-bold">כאן יבוצעו המפגשים בזמן הדיון - מוקלט ושמור בארכיון</p>
		</header>

		<div class="relative rounded-2xl border-4 border-gray-800 bg-gradient-to-br from-gray-900 to-slate-900 p-3 md:p-5 shadow-2xl max-w-4xl mx-auto">
			<!-- חלון וידאו ראשי + סייד-בר -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
				<!-- משתתף ראשי -->
				<div class="md:col-span-3 relative aspect-video rounded-xl bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center overflow-hidden ring-2 ring-purple-400/40">
					<div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.3) 0%, transparent 50%);"></div>
					<div class="text-center relative z-10">
						<div class="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-5xl md:text-6xl mx-auto mb-2 shadow-2xl ring-4 ring-white/30">
							👨‍⚖️
						</div>
						<p class="text-white font-bold text-sm md:text-base">הרב יוסף כהן</p>
						<p class="text-purple-200 text-xs md:text-sm">אב בית הדין · מדבר</p>
					</div>
					<!-- אינדיקטור מדבר -->
					<div class="absolute top-3 right-3 flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/90 backdrop-blur-sm">
						<span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
						<span class="text-white text-xs font-bold">🎤 מדבר</span>
					</div>
					<!-- אינדיקטור הקלטה -->
					<div class="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-full bg-red-600/90 backdrop-blur-sm">
						<span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
						<span class="text-white text-xs font-bold">REC</span>
					</div>
				</div>

				<!-- 4 משתתפים בצד -->
				<div class="grid grid-cols-4 md:grid-cols-1 gap-2">
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-blue-900 to-cyan-900 flex items-center justify-center ring-1 ring-blue-400/30">
						<span class="text-3xl md:text-4xl">👨‍⚖️</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">הרב דוד א.</p>
						</div>
					</div>
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-emerald-900 to-teal-900 flex items-center justify-center ring-1 ring-emerald-400/30">
						<span class="text-3xl md:text-4xl">👨‍⚖️</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">הרב משה ל.</p>
						</div>
					</div>
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-amber-900 to-orange-900 flex items-center justify-center ring-1 ring-amber-400/30">
						<span class="text-3xl md:text-4xl">🧑</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">תובע</p>
						</div>
					</div>
					<div class="relative aspect-video rounded-lg bg-gradient-to-br from-rose-900 to-pink-900 flex items-center justify-center ring-1 ring-rose-400/30">
						<span class="text-3xl md:text-4xl">🧑</span>
						<div class="absolute bottom-1 right-1 left-1 text-center">
							<p class="text-white text-[10px] md:text-xs font-bold truncate">נתבע</p>
						</div>
					</div>
				</div>
			</div>

			<!-- בר בקרה -->
			<div class="flex items-center justify-between gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10">
				<div class="text-white text-xs md:text-sm font-bold">
					<span class="text-gray-400">תיק:</span> בוררות עסקית · יוסי כהן נ' שמואל לוי
				</div>
				<div class="flex items-center gap-2 md:gap-3">
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label="כיבוי מיקרופון">🎤</button>
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label="כיבוי מצלמה">📹</button>
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label="שיתוף מסך">🖥️</button>
					<button type="button" disabled class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-lg md:text-xl opacity-60 cursor-not-allowed" aria-label="סיים שיחה">📞</button>
				</div>
			</div>
		</div>

		<p class="mt-4 text-center text-gray-700 text-xs md:text-sm font-bold">
			🔒 הדיון מוקלט ושמור באופן מאובטח · רק בעלי הדין ובית הדין נחשפים לתוכן
		</p>
	</section>

	<div class="mb-8 rounded-2xl border-2 border-purple-400/40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-5 md:p-6 text-center">
		<p class="text-gray-800 text-base md:text-lg font-bold mb-3">
			מוכן לפתוח תיק? התחל בשלב 1 - חתימה על אמנת המוסר ובחירת תאריך
		</p>
		<a
			href="/request-hearing"
			class="inline-block px-7 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-black text-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all"
		>
			⚖️ פתח בקשת דיון →
		</a>
	</div>

	<section class="mb-8">
		<header class="text-center mb-5">
			<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
				📅 לוח דיונים - בחר תאריך פנוי
			</h2>
			<p class="mt-2 text-gray-600 text-sm md:text-base font-bold">לחץ על תאריך פנוי בירוק כדי לפתוח בקשה לאותו יום</p>
		</header>
		<LiveCalendar />
	</section>

	<!-- ───────────── התיקים שלי + ארכיון וידאו ───────────── -->
	<section class="mb-8">
		<div class="rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 shadow-[0_0_25px_rgba(99,102,241,0.12)] {isRegistered ? 'p-5 md:p-7' : 'p-4 md:p-5'}">
			{#if isRegistered}
				<header class="flex items-end justify-between gap-3 flex-wrap mb-5">
					<div class="text-right">
						<h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
							📁 התיקים שלי
						</h2>
						<p class="mt-1 text-gray-700 text-sm md:text-base font-bold">
							שלום {userName} · סיכומי הדיון וארכיון הוידאו של ההליכים שלך
						</p>
					</div>
					<a href="/profile" class="text-sm font-bold text-indigo-700 hover:text-indigo-900 transition-colors">
						לאזור האישי המלא ←
					</a>
				</header>

				<div class="space-y-4">
					{#each myCases as c}
						<article class="rounded-xl border border-indigo-400/30 bg-white/5 p-4 md:p-5">
							<div class="flex items-center justify-between gap-3 flex-wrap mb-3">
								<div class="flex items-center gap-2 flex-wrap">
									<span class="px-2.5 py-1 rounded-full text-xs font-black {statusColor(c.status)}">{c.status}</span>
									<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-700/70 text-white">{c.id}</span>
									<span class="text-xs font-bold text-gray-700">תפקידך: {c.role}</span>
								</div>
								<span class="text-xs font-bold text-gray-700">📅 {c.hearingDate}</span>
							</div>
							<h3 class="text-base md:text-lg font-extrabold text-gray-900 mb-2">{c.caseName}</h3>
							<p class="text-sm text-gray-800 leading-relaxed mb-4">{c.summary}</p>
							<div class="flex flex-wrap gap-2">
								{#if c.videoUrl}
									<a href={c.videoUrl} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold hover:scale-105 transition-transform shadow">
										🎥 צפה בהקלטת הדיון
									</a>
								{:else}
									<span class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm font-bold cursor-not-allowed">
										🎥 הקלטה - תהיה זמינה אחרי הדיון
									</span>
								{/if}
								{#if c.rulingUrl}
									<a href={c.rulingUrl} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold hover:scale-105 transition-transform shadow">
										📋 פסק דין חתום
									</a>
								{:else}
									<span class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm font-bold cursor-not-allowed">
										📋 פסק דין - ממתין
									</span>
								{/if}
							</div>
						</article>
					{/each}

					{#if myCases.length === 0}
						<p class="text-center text-gray-600 py-6">אין לך עדיין תיקים פעילים. <a href="/request-hearing" class="text-indigo-700 font-bold underline">פתח תיק חדש →</a></p>
					{/if}
				</div>
			{:else}
				<header class="flex items-center gap-3 mb-3">
					<div class="text-3xl flex-shrink-0">🔒</div>
					<div class="min-w-0">
						<h2 class="text-lg md:text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent leading-tight">
							התיקים שלי · ארכיון וידאו
						</h2>
						<p class="text-xs md:text-sm text-gray-700 font-bold leading-snug">
							סיכומי הליך, הקלטות ופסקי דין חתומים של התיקים שלך
						</p>
					</div>
				</header>

				<!-- תצוגה מקדימה מטושטשת - קומפקטית -->
				<div class="relative mb-3">
					<div class="space-y-2 pointer-events-none select-none blur-[5px] opacity-55" aria-hidden="true">
						{#each myCases.slice(0, 2) as c}
							<div class="rounded-lg border border-indigo-400/30 bg-white/10 p-2.5">
								<div class="flex items-center justify-between gap-2 mb-1">
									<span class="px-2 py-0.5 rounded-full text-[10px] font-black {statusColor(c.status)}">{c.status}</span>
									<span class="text-[10px] font-bold text-gray-700">{c.hearingDate}</span>
								</div>
								<h3 class="text-sm font-extrabold text-gray-900 line-clamp-1">{c.caseName}</h3>
								<p class="text-xs text-gray-800 line-clamp-1">{c.summary}</p>
							</div>
						{/each}
					</div>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/40 border border-yellow-500/70 text-yellow-900 text-xs md:text-sm font-black shadow">
							🔐 תוכן זמין רק לצדדים הנוגעים למשפט
						</div>
					</div>
				</div>

				<div class="flex flex-col sm:flex-row gap-2 justify-center">
					<a
						href="/profile"
						class="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-sm md:text-base hover:scale-105 transition-transform shadow text-center"
					>
						✍️ הירשם וצור חשבון
					</a>
					<a
						href="/request-hearing"
						class="inline-block px-5 py-2 rounded-xl bg-white/10 border border-indigo-400/40 text-gray-900 font-bold text-sm md:text-base hover:bg-white/20 transition-colors text-center"
					>
						פתח תיק חדש
					</a>
				</div>
			{/if}
		</div>
	</section>
</section>
