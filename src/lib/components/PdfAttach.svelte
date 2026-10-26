<script lang="ts">
	// העלאת PDF בטופס אדמין: (1) הקובץ עולה לשרת ומצורף לתוכן, (2) הטקסט שבו מחולץ
	// בדפדפן ומוצע להטמעה בשדה הטקסט של הטופס. שני הצעדים בלתי-תלויים — כשחילוץ הטקסט
	// נכשל (PDF סרוק) הקובץ עדיין מצורף.
	import { uploadPdf, formatPdfSize, MAX_PDF_MB, type PdfRef } from '$lib/pdfAttachment';
	import { extractPdfText } from '$lib/pdfText';

	let {
		pdf = $bindable(null),
		onText,
		textLabel = 'טקסט המאמר',
		buttonLabel = '📄 העלאת קובץ PDF',
		hint = 'הטקסט והשדות מולאים אוטומטית'
	}: {
		pdf?: PdfRef | null;
		/**
		 * מקבל את הטקסט שחולץ; ההורה מחליט איפה ואיך להטמיע (ומתייחס לטקסט קיים), ויכול גם לנתח אותו.
		 * מחרוזת מוחזרת מחליפה את הודעת ההצלחה הרגילה (למשל: "מולאו כותרת, מחבר, תאריך…").
		 */
		onText?: (text: string, fileName: string) => string | void | Promise<string | void>;
		/** שם השדה שאליו הטקסט מוטמע — להודעות */
		textLabel?: string;
		buttonLabel?: string;
		hint?: string;
	} = $props();

	let busy = $state(false);
	let notice = $state('');
	let noticeKind = $state<'ok' | 'warn'>('ok');
	let dragging = $state(false);

	async function handle(file: File | undefined | null) {
		if (!file || busy) return;
		if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') {
			notice = '⚠️ ניתן להעלות קובצי PDF בלבד';
			noticeKind = 'warn';
			return;
		}
		busy = true;
		notice = '';
		const msgs: string[] = [];
		let kind: 'ok' | 'warn' = 'ok';
		try {
			pdf = await uploadPdf(file);
			msgs.push('✅ הקובץ הועלה וצורף');
		} catch (e) {
			pdf = null;
			msgs.push('⚠️ ' + (e instanceof Error ? e.message : 'העלאת הקובץ נכשלה'));
			kind = 'warn';
		}
		if (onText) {
			try {
				const r = await extractPdfText(file);
				if (r.hasText) {
					try {
						const custom = await onText(r.text, file.name);
						msgs.push(custom || `הטקסט חולץ (${r.pages} עמ׳) והוטמע ב${textLabel} — בדקו ותקנו לפני הפרסום`);
					} catch (e) {
						console.warn('[pdf] onText failed', e);
						msgs.push('⚠️ הטמעת הטקסט בטופס נכשלה — ניתן להדביק אותו ידנית');
						kind = 'warn';
					}
				} else {
					msgs.push('לא נמצא טקסט בקובץ (כנראה PDF סרוק/תמונה) — הקובץ מצורף להורדה, אך את הטקסט יש להקליד או להדביק ידנית');
					kind = 'warn';
				}
			} catch (e) {
				console.warn('[pdf] text extraction failed', e);
				msgs.push('חילוץ הטקסט מהקובץ נכשל — ניתן להדביק את הטקסט ידנית');
				kind = 'warn';
			}
		}
		notice = msgs.join(' · ');
		noticeKind = kind;
		busy = false;
	}

	function onPick(e: Event) {
		const input = e.target as HTMLInputElement;
		void handle(input.files?.[0]);
		input.value = ''; // מאפשר לבחור שוב את אותו קובץ
	}
	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		void handle(e.dataTransfer?.files?.[0]);
	}
	function remove() {
		pdf = null;
		notice = '';
	}
</script>

<div
	role="group"
	aria-label="קובץ PDF"
	class="rounded-xl border-2 border-dashed p-3 transition-colors {dragging ? 'border-blue-400 bg-blue-500/10' : 'border-white/20 bg-black/10'}"
	ondragover={(e) => {
		e.preventDefault();
		dragging = true;
	}}
	ondragleave={() => (dragging = false)}
	ondrop={onDrop}
>
	<div class="flex items-center gap-3 flex-wrap">
		<label class="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-bold cursor-pointer hover:opacity-90 {busy ? 'opacity-50 pointer-events-none' : ''}">
			{busy ? '⏳ מעלה ומנתח…' : buttonLabel}
			<input type="file" accept="application/pdf,.pdf" class="hidden" onchange={onPick} disabled={busy} />
		</label>
		<span class="text-xs text-gray-400">או גררו לכאן · עד {MAX_PDF_MB}MB · {hint}</span>
	</div>

	{#if pdf}
		<div class="mt-2 flex items-center gap-2 text-sm flex-wrap">
			<a href={pdf.url} target="_blank" rel="noopener" class="font-bold text-blue-300 hover:underline break-all">📎 {pdf.name}</a>
			{#if pdf.size}<span class="text-xs text-gray-400">({formatPdfSize(pdf.size)})</span>{/if}
			<button type="button" onclick={remove} class="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold">הסר</button>
		</div>
	{/if}

	{#if notice}
		<p class="mt-2 text-xs font-bold {noticeKind === 'ok' ? 'text-green-300' : 'text-yellow-300'}">{notice}</p>
	{/if}
</div>
