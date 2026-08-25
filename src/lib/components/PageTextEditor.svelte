<script lang="ts">
	import { onMount } from 'svelte';
	import { t, locale, dictionary } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import { getCurrentUser, isSuperAdmin } from '$lib/strapi';
	import { saveTextOverride } from '$lib/services/text-overrides-service';

	// עורך טקסטים לדפי תוכן קבועים: עיפרון (לסופר-אדמין) שפותח פאנל עם כל
	// מפתחות ה-i18n של הדף (לפי קידומות). שמירה יוצרת דריסה בסטראפי — בלי דיפלוי.
	let { prefixes }: { prefixes: string[] } = $props();

	let canEdit = $state(false);
	let open = $state(false);
	let items = $state<{ key: string; value: string; original: string }[]>([]);
	let saving = $state(false);
	let savedOk = $state(false);
	let error = $state('');

	onMount(async () => {
		try {
			canEdit = isSuperAdmin(await getCurrentUser());
		} catch {
			/* אורח — בלי עיפרון */
		}
	});

	function openEditor() {
		// המילון העברי הוא המאסטר לרשימת המפתחות; הערך המוצג הוא בשפת הממשק הנוכחית
		const dictAll = get(dictionary) as Record<string, Record<string, string>> | undefined;
		const keys = Object.keys(dictAll?.he ?? {}).filter((k) => prefixes.some((p) => k.startsWith(p)));
		const tf = get(t);
		items = keys.map((key) => {
			const value = String(tf(key) ?? '');
			return { key, value, original: value };
		});
		error = '';
		savedOk = false;
		open = true;
	}

	// ICU: סוגריים מסולסלים בטקסט חופשי חייבים escaping כדי שלא ייקראו כמשתני-תבנית
	const toIcu = (text: string) => text.replace(/[{}]/g, (m) => `'${m}'`);

	const changedCount = $derived(items.filter((i) => i.value !== i.original).length);

	async function saveAll() {
		if (saving) return;
		const changed = items.filter((i) => i.value !== i.original);
		if (changed.length === 0) {
			open = false;
			return;
		}
		saving = true;
		error = '';
		const loc = (get(locale) as string) || 'he';
		try {
			for (const item of changed) {
				await saveTextOverride(item.key, loc, toIcu(item.value));
			}
			savedOk = true;
			// הדפים קוראים את התרגום בזמן-רינדור — רענון מציג את הנוסח החדש בכל הדף
			setTimeout(() => location.reload(), 700);
		} catch (e) {
			error = 'השמירה נכשלה. ' + (e instanceof Error ? e.message : '');
			saving = false;
		}
	}
</script>

{#if canEdit}
	<div class="mt-6">
		<button
			type="button"
			onclick={openEditor}
			title="עריכת טקסטי הדף"
			aria-label="עריכת טקסטי הדף"
			class="text-lg opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
		>✏️</button>
	</div>
{/if}

{#if open}
	<div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true" aria-label="עריכת טקסטי הדף">
		<div class="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-blue-400/40 bg-gray-900 shadow-2xl">
			<header class="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
				<h2 class="text-base md:text-lg font-bold text-white">עריכת טקסטי הדף <span class="text-xs text-gray-400 font-normal">({get(locale) || 'he'})</span></h2>
				<button
					type="button"
					onclick={() => (open = false)}
					disabled={saving}
					aria-label="סגירה"
					class="text-gray-400 hover:text-white text-xl leading-none px-2"
				>×</button>
			</header>

			<div class="flex-1 overflow-y-auto px-4 py-3 space-y-4">
				{#each items as item (item.key)}
					<div>
						<label class="block text-xs text-gray-500 mb-1 font-mono" dir="ltr" for={'pte-' + item.key}>{item.key}</label>
						<textarea
							id={'pte-' + item.key}
							bind:value={item.value}
							rows={Math.min(10, Math.max(2, Math.ceil(item.value.length / 80)))}
							class="w-full px-3 py-2 rounded-lg bg-black/30 border {item.value !== item.original ? 'border-yellow-400/70' : 'border-white/15'} text-white text-sm focus:border-blue-400 focus:outline-none leading-relaxed"
						></textarea>
					</div>
				{/each}
			</div>

			<footer class="px-4 py-3 border-t border-white/10 space-y-2">
				{#if error}
					<p class="text-sm font-bold text-red-300">{error}</p>
				{/if}
				{#if savedOk}
					<p class="text-sm font-bold text-green-300">✅ נשמר! מרענן את הדף…</p>
				{:else}
					<div class="flex items-center justify-between gap-3">
						<span class="text-xs text-gray-400">{changedCount ? `${changedCount} טקסטים שונו` : 'אין שינויים'}</span>
						<div class="flex gap-2">
							<button
								type="button"
								onclick={() => (open = false)}
								disabled={saving}
								class="px-4 py-2 rounded-lg border border-white/20 text-gray-200 hover:bg-white/10 transition-colors disabled:opacity-60"
							>ביטול</button>
							<button
								type="button"
								onclick={saveAll}
								disabled={saving || changedCount === 0}
								class="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors disabled:opacity-60"
							>{saving ? 'שומר…' : 'שמירה'}</button>
						</div>
					</div>
				{/if}
			</footer>
		</div>
	</div>
{/if}
