<script lang="ts">
	import { onMount } from 'svelte';
	import { locale } from 'svelte-i18n';
	import Seo from '$lib/components/Seo.svelte';
	import { legalDocFor, TAB_IDS, TAB_ICONS, type TabId } from '$lib/legalDocs';

	// ============================================================
	// /about/legal — תנאי שימוש, מדיניות פרטיות, תקנון הבוררות והצהרת נגישות.
	// התוכן והתרגומים (he / en / ru) ב-$lib/legalDocs — מקור אחד, והעמוד רק מרנדר אותו.
	// ============================================================

	// כיוון הטקסט לפי השפה: עברית ופשטו מימין לשמאל, שאר השפות משמאל לימין
	const dir = $derived($locale && !['he', 'ps'].includes($locale.slice(0, 2)) ? 'ltr' : 'rtl');
	const doc = $derived(legalDocFor($locale));

	let activeTab = $state<TabId>('terms');
	const tab = $derived(doc.tabs[activeTab]);

	onMount(() => {
		const hash = window.location.hash.slice(1);
		if ((TAB_IDS as readonly string[]).includes(hash)) activeTab = hash as TabId;
	});

	function setTab(id: TabId) {
		activeTab = id;
		history.replaceState(null, '', '#' + id);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<Seo title={doc.title} description={doc.subtitle} path="/about/legal" />

<div class="min-h-screen py-10 px-4" {dir}>
	<div class="max-w-4xl mx-auto">

		<!-- כותרת -->
		<div class="text-center mb-8">
			<h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
				{doc.title}
			</h1>
			<p class="page-sub">{doc.subtitle}</p>
			{#if doc.note}<p class="page-note">{doc.note}</p>{/if}
		</div>

		<!-- טאבים -->
		<div class="sticky z-30 tabs-bar pt-2 pb-3 mb-8 border-b border-white/10" style="top: var(--header-height, 90px)">
			<div class="flex flex-wrap gap-2 justify-center">
				{#each TAB_IDS as id}
					<button
						onclick={() => setTab(id)}
						class="tab-btn {activeTab === id ? 'tab-active' : 'tab-inactive'}"
						aria-pressed={activeTab === id}
					>
						<span aria-hidden="true">{TAB_ICONS[id]}</span>
						<span>{doc.tabs[id].label}</span>
					</button>
				{/each}
			</div>
		</div>

		<div class="doc-card">
			<div class="doc-header">
				<h2 class="doc-title">{TAB_ICONS[activeTab]} {tab.title}</h2>
				<p class="doc-date">{doc.ui.updated} {doc.ui.date}</p>
			</div>

			<div class="toc">
				<p class="toc-title">{doc.ui.toc}</p>
				<ol class="toc-list">
					{#each tab.sections as s}
						<li>{s.title}</li>
					{/each}
				</ol>
			</div>

			{#each tab.sections as s, i}
				<section class="sec" class:contact-sec={s.contact}>
					<h3 class="sec-title">{i + 1}. {s.title}</h3>

					{#each s.blocks as b}
						{#if b.sub}<h4 class="sub-title">{b.sub}</h4>{/if}
						{#each b.p ?? [] as para}
							<p>{para}</p>
						{/each}
						{#if b.li}
							<ul class="bullet-list">
								{#each b.li as it}
									<li>{#if typeof it === 'string'}{it}{:else}<strong>{it.b}</strong> - {it.t}{/if}</li>
								{/each}
							</ul>
						{/if}
					{/each}

					{#if s.link}
						{@const target = s.link.tab}
						<p><button onclick={() => setTab(target)} class="inline-link">{s.link.label}</button></p>
					{/if}

					{#if s.contact}
						<div class="contact-grid">
							<a href="mailto:freedomhasbegun@gmail.com" class="contact-item">
								<span class="contact-icon" aria-hidden="true">✉️</span>
								<span>freedomhasbegun@gmail.com</span>
							</a>
							<a href="tel:0508750632" class="contact-item">
								<span class="contact-icon" aria-hidden="true">📞</span>
								<span dir="ltr">050‑8750632</span>
							</a>
						</div>
						{#if tab.replyNote}<p class="reply-note">{tab.replyNote}</p>{/if}
					{/if}
				</section>
			{/each}
		</div>

		<!-- חזרה לדף הבית + עלה לראש -->
		<div class="flex items-center justify-center gap-3 mt-10 flex-wrap">
			<a href="/" class="btn btn-home">{doc.ui.backHome}</a>
			<button onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} class="btn btn-top">
				{doc.ui.backTop}
			</button>
		</div>
	</div>
</div>

<style>
	.page-sub {
		color: var(--text-muted, #6b7280);
		font-size: 1rem;
	}

	.page-note {
		color: var(--text-muted, #6b7280);
		font-size: 0.85rem;
		margin-top: 0.35rem;
		font-style: italic;
	}

	.reply-note {
		margin-top: 0.75rem;
		font-size: 0.9rem !important;
	}

	.tabs-bar {
		background: rgba(240, 227, 184, 0.94);
		backdrop-filter: blur(10px);
	}

	.tab-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.55rem 1.1rem;
		border-radius: 9999px;
		font-weight: 800;
		font-size: 0.88rem;
		transition: all 0.2s;
		border: 2px solid transparent;
		cursor: pointer;
	}
	.tab-active {
		background: linear-gradient(135deg, #b45309, #92400e);
		color: #fff;
		border-color: #78350f;
		box-shadow: 0 2px 10px rgba(146, 64, 14, 0.35);
	}
	.tab-inactive {
		background: rgba(255, 255, 255, 0.55);
		color: #78350f;
		border-color: rgba(120, 53, 15, 0.25);
	}
	.tab-inactive:hover {
		background: rgba(180, 83, 9, 0.14);
		border-color: rgba(120, 53, 15, 0.5);
	}

	.doc-card {
		background: var(--bg-cream-card, #f8eecb);
		border: 1px solid var(--border-soft, #d4be7f);
		border-radius: 1.25rem;
		padding: 2rem;
		box-shadow: 0 4px 18px rgba(120, 80, 20, 0.12);
	}
	@media (max-width: 640px) {
		.doc-card { padding: 1.25rem; }
	}

	.doc-header {
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		padding-bottom: 1.25rem;
		margin-bottom: 1.75rem;
	}
	.doc-title {
		font-size: 1.85rem;
		font-weight: 900;
		color: #78350f;
		margin-bottom: 0.4rem;
	}
	.doc-date {
		color: var(--text-muted, #6b7280);
		font-size: 0.95rem;
	}

	.toc {
		background: rgba(180, 83, 9, 0.07);
		border: 1px solid rgba(180, 83, 9, 0.22);
		border-radius: 0.75rem;
		padding: 1rem 1.25rem;
		margin-bottom: 1.75rem;
	}
	.toc-title {
		font-weight: 800;
		color: #78350f;
		margin-bottom: 0.6rem;
		font-size: 1rem;
	}
	.toc-list {
		list-style: decimal;
		padding-inline-start: 1.2rem;
		color: var(--text-secondary, #374151);
		font-size: 0.95rem;
		line-height: 1.8;
	}

	.sec {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	}
	.sec:last-child {
		border-bottom: none;
		margin-bottom: 0;
	}

	.sec-title {
		font-size: 1.2rem;
		font-weight: 800;
		color: #1f2937;
		margin-bottom: 0.75rem;
		padding-inline-start: 0.75rem;
		border-inline-start: 3px solid #b45309;
	}

	.sub-title {
		font-size: 1.05rem;
		font-weight: 700;
		color: #92400e;
		margin: 0.9rem 0 0.45rem;
	}

	.sec p {
		color: var(--text-secondary, #374151);
		font-size: 1rem;
		line-height: 1.9;
		margin-bottom: 0.5rem;
	}

	.bullet-list {
		list-style: none;
		padding: 0;
		margin: 0.5rem 0;
	}
	.bullet-list li {
		color: var(--text-secondary, #374151);
		font-size: 1rem;
		line-height: 1.85;
		padding-inline-start: 1.1rem;
		position: relative;
	}
	.bullet-list li::before {
		content: '•';
		position: absolute;
		inset-inline-start: 0;
		color: #b45309;
		font-weight: 900;
	}

	.code-chip {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.9em;
		background: rgba(0, 0, 0, 0.06);
		color: #1f2937;
		border-radius: 0.3rem;
		padding: 0.05rem 0.35rem;
	}

	.contact-sec { background: rgba(180, 83, 9, 0.07); border-radius: 0.75rem; padding: 1.25rem; }

	.contact-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.75rem;
	}
	.contact-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.6);
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 0.6rem;
		padding: 0.6rem 1rem;
		color: #1f2937;
		font-size: 1rem;
		font-weight: 600;
		text-decoration: none;
		transition: background 0.2s;
	}
	.contact-item:hover { background: rgba(180, 83, 9, 0.16); }
	.contact-icon { font-size: 1.1rem; }

	.inline-link {
		background: none;
		border: none;
		color: #92400e;
		cursor: pointer;
		font-size: 0.95rem;
		padding: 0;
		text-decoration: underline;
		margin-inline-start: 0.25rem;
	}
	.inline-link:hover { color: #78350f; }

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 700;
		transition: all 0.2s;
		cursor: pointer;
		text-decoration: none;
	}
	.btn-home {
		background: rgba(255, 255, 255, 0.6);
		color: #1f2937;
		border: 1px solid rgba(0, 0, 0, 0.18);
	}
	.btn-home:hover { background: rgba(255, 255, 255, 0.9); }
	.btn-top {
		background: linear-gradient(135deg, #b45309, #92400e);
		color: #fff;
		border: 1px solid #78350f;
		box-shadow: 0 2px 10px rgba(146, 64, 14, 0.3);
	}
	.btn-top:hover { filter: brightness(1.1); }
</style>
