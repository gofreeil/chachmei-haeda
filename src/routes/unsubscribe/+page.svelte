<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const status = $derived(form?.status ?? (data.valid ? 'ask' : 'invalid'));
</script>

<svelte:head>
	<title>הפסקת קבלת הודעות במייל</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-md px-4 py-8 text-center" dir="rtl">
	<h1 class="mb-3 text-xl font-bold">הפסקת קבלת הודעות במייל</h1>

	{#if status === 'ask'}
		<p class="mb-1">להפסיק לשלוח אליך עותקי הודעות במייל?</p>
		<p class="mb-4 text-sm opacity-70">הודעות באתר ו-SMS לא ישתנו.</p>
		<form method="POST" use:enhance>
			<input type="hidden" name="e" value={data.e} />
			<input type="hidden" name="t" value={data.t} />
			<button type="submit" class="rounded-xl bg-amber-600 px-5 py-2 font-bold text-white hover:bg-amber-500">
				כן, הפסק לשלוח
			</button>
		</form>
	{:else if status === 'done'}
		<p class="text-green-600" role="status">בוצע. לא נשלח אליך יותר עותקי הודעות במייל.</p>
	{:else if status === 'notFound'}
		<p role="status">לא נמצא משתמש עם כתובת המייל הזו, ולכן אין מה לבטל.</p>
	{:else}
		<p class="text-red-600" role="alert">הקישור אינו תקין או שפג תוקפו.</p>
	{/if}

	<a href="/" class="mt-5 inline-block text-sm underline">חזרה לאתר</a>
</div>
