<script lang="ts">
	const heichalim = [
		{
			href: '/heichal-hamishpat',
			icon: '⚖️',
			title: 'היכל המשפט',
			desc: 'פסקי דין, הכרעות ובוררות על פי דין תורה',
			bg: 'bg-gradient-to-br from-slate-600 via-slate-800 to-slate-900',
			border: 'border-slate-300',
			shadow: 'shadow-[0_8px_24px_-4px_rgba(15,23,42,0.6),inset_0_2px_0_rgba(255,255,255,0.18)]',
			titleColor: '#ffffff',
			descColor: '#e2e8f0',
			hover: 'hover:from-slate-500 hover:via-slate-700 hover:to-slate-800 hover:border-slate-100',
			bgStyle: ''
		},
		{
			href: '/request-hearing',
			icon: '🕊️',
			title: 'היכל השלום',
			desc: 'גישור ופישור - השכנת שלום בין אדם לחברו ובין איש לאשתו',
			bg: 'bg-gradient-to-br from-sky-200/60 via-cyan-100/50 to-blue-200/60 backdrop-blur-md',
			border: 'border-sky-200',
			shadow: 'shadow-[0_8px_24px_-4px_rgba(56,189,248,0.45),inset_0_2px_0_rgba(255,255,255,0.85)]',
			titleColor: '#082f49',
			descColor: '#0c4a6e',
			hover: 'hover:from-sky-300/70 hover:via-cyan-200/60 hover:to-blue-300/70 hover:border-white',
			bgStyle: ''
		},
		{
			href: '/heichal-hamaaseh/activity',
			icon: '🛠️',
			title: 'היכל המעשה',
			desc: 'פעילות, פרויקטים וקריאות לתיקון עולם',
			bg: '',
			bgStyle:
				"background-image:" +
				"repeating-linear-gradient(90deg, rgba(48,20,8,0.18) 0px, rgba(48,20,8,0.18) 1px, transparent 1px, transparent 4px)," +
				"linear-gradient(90deg, rgba(60,30,10,0.35) 0%, transparent 7%, rgba(60,30,10,0.25) 14%, transparent 22%, rgba(80,40,15,0.3) 32%, transparent 42%, rgba(60,30,10,0.2) 55%, transparent 65%, rgba(80,40,15,0.32) 78%, transparent 88%, rgba(60,30,10,0.25) 100%)," +
				"linear-gradient(180deg, rgba(255,237,178,0.22) 0%, transparent 40%, rgba(0,0,0,0.18) 100%)," +
				"linear-gradient(135deg, #92400e 0%, #78350f 50%, #713f12 100%);",
			border: 'border-amber-300',
			shadow: 'shadow-[0_8px_24px_-4px_rgba(120,53,15,0.65),inset_0_2px_0_rgba(255,237,178,0.3)]',
			titleColor: '#ffffff',
			descColor: '#fef3c7',
			hover: 'hover:border-amber-100 hover:brightness-110'
		},
		{
			href: '/articles',
			icon: '',
			image: '/images/1124a5ea-412c-4c49-8d76-e4366711384d.jfif',
			title: 'היכל הרוח',
			desc: 'מאמרים, תשובות, מוסר אלוקי והעלאת הרוח',
			bg: 'bg-gradient-to-br from-gray-200 via-slate-300 to-gray-400',
			border: 'border-white',
			shadow: 'shadow-[0_8px_24px_-4px_rgba(100,116,139,0.55),inset_0_2px_0_rgba(255,255,255,0.9)]',
			titleColor: '#0f172a',
			descColor: '#1e293b',
			hover: 'hover:from-gray-100 hover:via-slate-200 hover:to-gray-300 hover:border-slate-100',
			bgStyle: ''
		}
	];
</script>

<section class="mb-10">
	<header class="text-center mb-6">
		<h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
			🏛️ ארבעת ההיכלות
		</h3>
		<p class="mt-2 text-gray-700 text-sm md:text-base font-bold">משפט וצדק <span class="text-[10px] align-middle mx-0.5 bg-gradient-to-br from-sky-300 via-blue-500 to-indigo-700 bg-clip-text text-transparent">◆</span> שלום ואחווה <span class="text-[10px] align-middle mx-0.5 bg-gradient-to-br from-sky-300 via-blue-500 to-indigo-700 bg-clip-text text-transparent">◆</span> הרוח <span class="text-[10px] align-middle mx-0.5 bg-gradient-to-br from-sky-300 via-blue-500 to-indigo-700 bg-clip-text text-transparent">◆</span> המעשה</p>
	</header>
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
		{#each heichalim as h}
			<a
				href={h.href}
				class="block rounded-2xl border-4 {h.border} {h.bg} {h.hover} {h.shadow} transition-all p-4 md:p-6 text-center hover:scale-[1.04] hover:-translate-y-1 ring-1 ring-black/20"
				style={h.bgStyle}
			>
				{#if h.image}
					<div class="mb-2 md:mb-3 flex justify-center">
						<img src={h.image} alt={h.title} class="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full ring-2 ring-white/80 drop-shadow-lg" />
					</div>
				{:else}
					<div class="text-4xl md:text-5xl mb-2 md:mb-3 drop-shadow-lg">{h.icon}</div>
				{/if}
				<h4 class="text-base md:text-xl font-black mb-1 md:mb-2 drop-shadow-sm" style="color: {h.titleColor} !important">{h.title}</h4>
				<p class="text-xs md:text-sm leading-snug font-bold" style="color: {h.descColor} !important">{h.desc}</p>
			</a>
		{/each}
	</div>
</section>
