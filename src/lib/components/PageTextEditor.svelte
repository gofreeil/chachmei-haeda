<script lang="ts">
	import { onMount } from 'svelte';
	import { t, locale, dictionary } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import { getCurrentUser, isSuperAdmin } from '$lib/strapi';
	import { saveTextOverride } from '$lib/services/text-overrides-service';

	// עריכת טקסטים בתוך התצוגה (סופר-אדמין): העיפרון מפעיל מצב עריכה שבו כל
	// טקסט של הדף נערך במקומו בדף עצמו. המיפוי טקסט→מפתח נעשה בזמן-ריצה:
	// כל text-node שתוכנו שווה לערך של מפתח i18n (לפי הקידומות) נעטף ב-span
	// contenteditable. שמירה כותבת דריסה ל-ch-text-overrides — בלי דיפלוי.
	let { prefixes }: { prefixes: string[] } = $props();

	let canEdit = $state(false);
	let editing = $state(false);
	let saving = $state(false);
	let savedOk = $state(false);
	let error = $state('');
	let changedCount = $state(0);

	// המפתח -> הערך המפורמט שהוצג בכניסה למצב עריכה
	let originals = new Map<string, string>();

	onMount(async () => {
		try {
			canEdit = isSuperAdmin(await getCurrentUser());
		} catch {
			/* אורח — בלי עיפרון */
		}
	});

	const KEY_ATTR = 'data-pte-key';

	function editableSpans(): HTMLElement[] {
		return Array.from(document.querySelectorAll<HTMLElement>(`[${KEY_ATTR}]`));
	}

	function updateChangedCount() {
		changedCount = editableSpans().filter(
			(el) => (el.innerText ?? '').trim() !== (originals.get(el.getAttribute(KEY_ATTR)!) ?? '')
		).length;
	}

	function enterEditMode() {
		const dictAll = get(dictionary) as Record<string, Record<string, string>> | undefined;
		const keys = Object.keys(dictAll?.he ?? {}).filter((k) => prefixes.some((p) => k.startsWith(p)));
		const tf = get(t);

		// ערך-מפורמט -> תור מפתחות; ערכים שמופיעים בכמה מפתחות משויכים לפי סדר ההופעה בדף
		const byValue = new Map<string, string[]>();
		originals = new Map();
		for (const key of keys) {
			const val = String(tf(key) ?? '').trim();
			if (!val) continue;
			originals.set(key, val);
			const q = byValue.get(val);
			if (q) q.push(key);
			else byValue.set(val, [key]);
		}

		// כל interpolation של Svelte הוא text-node נפרד, ולכן השוואת-תוכן מדויקת
		const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
		const toWrap: { node: Text; key: string }[] = [];
		let n: Node | null;
		while ((n = walker.nextNode())) {
			const node = n as Text;
			const parent = node.parentElement;
			if (!parent) continue;
			if (parent.closest('[data-pte-ui],script,style,textarea,button,a,nav,select,option')) continue;
			const trimmed = (node.textContent ?? '').trim();
			if (!trimmed) continue;
			const q = byValue.get(trimmed);
			if (q && q.length) toWrap.push({ node, key: q.shift()! });
		}

		for (const { node, key } of toWrap) {
			const span = document.createElement('span');
			span.setAttribute(KEY_ATTR, key);
			span.setAttribute('contenteditable', 'true');
			span.setAttribute('spellcheck', 'false');
			span.textContent = (node.textContent ?? '').trim();
			node.replaceWith(span);
			span.addEventListener('input', updateChangedCount);
		}

		changedCount = 0;
		error = '';
		savedOk = false;
		editing = true;
	}

	function exitEditMode(restoreOriginals: boolean) {
		for (const el of editableSpans()) {
			const key = el.getAttribute(KEY_ATTR)!;
			const text = restoreOriginals ? (originals.get(key) ?? el.innerText) : el.innerText;
			el.replaceWith(document.createTextNode(text));
		}
		editing = false;
		changedCount = 0;
	}

	// ICU: סוגריים מסולסלים בטקסט חופשי חייבים escaping כדי שלא ייקראו כמשתני-תבנית
	const toIcu = (text: string) => text.replace(/[{}]/g, (m) => `'${m}'`);

	async function saveAll() {
		if (saving) return;
		const changed = editableSpans()
			.map((el) => ({ key: el.getAttribute(KEY_ATTR)!, value: (el.innerText ?? '').trim() }))
			.filter((c) => c.value !== (originals.get(c.key) ?? '') && c.value);
		if (changed.length === 0) {
			exitEditMode(false);
			return;
		}
		saving = true;
		error = '';
		const loc = (get(locale) as string) || 'he';
		try {
			for (const c of changed) {
				await saveTextOverride(c.key, loc, toIcu(c.value));
			}
			savedOk = true;
			// הדף קורא את התרגומים בזמן-רינדור — רענון מציג את הנוסח החדש בכל מקום
			setTimeout(() => location.reload(), 700);
		} catch (e) {
			error = 'השמירה נכשלה. ' + (e instanceof Error ? e.message : '');
			saving = false;
		}
	}
</script>

{#if canEdit && !editing}
	<div class="mt-6" data-pte-ui>
		<button
			type="button"
			onclick={enterEditMode}
			title="עריכת טקסטי הדף"
			aria-label="עריכת טקסטי הדף"
			class="text-lg opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
		>✏️</button>
	</div>
{/if}

{#if editing}
	<div
		data-pte-ui
		class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-amber-700/50 bg-white/95 shadow-xl px-4 py-2"
	>
		{#if savedOk}
			<span class="text-sm font-bold text-green-700">✅ נשמר! מרענן…</span>
		{:else}
			<span class="text-xs text-gray-600 whitespace-nowrap">
				✏️ לחצו על טקסט וערכו אותו במקומו{changedCount ? ` · ${changedCount} שונו` : ''}
			</span>
			{#if error}
				<span class="text-xs font-bold text-red-700 max-w-52 truncate" title={error}>{error}</span>
			{/if}
			<button
				type="button"
				onclick={() => exitEditMode(true)}
				disabled={saving}
				class="px-3 py-1.5 rounded-full border border-gray-400 text-gray-800 text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-60"
			>ביטול</button>
			<button
				type="button"
				onclick={saveAll}
				disabled={saving || changedCount === 0}
				class="px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors disabled:opacity-60"
			>{saving ? 'שומר…' : 'שמירה'}</button>
		{/if}
	</div>
{/if}

<style>
	:global([data-pte-key]) {
		outline: 1px dashed rgba(180, 83, 9, 0.5);
		outline-offset: 2px;
		border-radius: 2px;
		cursor: text;
		min-width: 1ch;
		display: inline;
	}
	:global([data-pte-key]:hover) {
		outline-color: #b45309;
		background: rgba(253, 224, 71, 0.18);
	}
	:global([data-pte-key]:focus) {
		outline: 2px solid #2563eb;
		background: rgba(59, 130, 246, 0.07);
	}
</style>
