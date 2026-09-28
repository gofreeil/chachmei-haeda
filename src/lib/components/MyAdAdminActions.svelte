<script lang="ts">
    // שורת הפעולות של פרסומת ב"הנכסים שלי" (/about/advertise/manage): קיצורי
    // הניהול לאדמין — הפעולות השכיחות ישר מכאן, בלי לעבור למסך הניהול.
    // המסלול = מה שנבחר בשליחה; שינוי מסלול, מקום בטור וקציבה — במסך
    // הניהול. באתר הזה אין form actions מאומתים: כל פעולה נשלחת ל-
    // /api/ads/admin עם Authorization Bearer, שם ההרשאה נבדקת בשרת.
    // "צפה" מוצג לכל מפרסם כשהפרסומת באוויר.
    import { getJwt } from '$lib/strapi';

    interface AdLike {
        id: string;
        status: string;
        paused: boolean;
        requestedDurationDays: number | null;
    }

    let {
        ad,
        isAdmin,
        live,
        onDone,
    }: {
        ad: AdLike;
        isAdmin: boolean;
        live: boolean;
        /** תוצאת הפעולה — הדף מציג את ההודעה ומרענן את הרשימה */
        onDone: (r: { message?: string; error?: string }) => void;
    } = $props();

    let busy = $state(false);

    // כפתורים קטנים זה לצד זה, נשברים לשורה בנייד (flex-wrap)
    const BTN = 'whitespace-nowrap rounded-lg border px-2 py-0.5 text-[11px] font-bold transition-colors disabled:opacity-50';
    const OK = `${BTN} border-emerald-600/45 bg-emerald-500/10 text-emerald-800 hover:bg-emerald-500/20`;
    const GHOST = `${BTN} border-[#d9c07a] bg-[#fffbe9] text-[#4a3a14] hover:bg-[#f3e6bd]`;
    const DANGER = `${BTN} border-rose-600/40 bg-rose-500/10 text-rose-800 hover:bg-rose-500/20`;

    async function run(action: string, extra: Record<string, unknown> = {}, confirmText = '') {
        if (confirmText && !confirm(confirmText)) return;
        busy = true;
        try {
            const res = await fetch('/api/ads/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getJwt() ?? ''}` },
                body: JSON.stringify({ action, id: ad.id, ...extra }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) onDone({ message: data.message || 'בוצע ✅' });
            else onDone({ error: data.message || data.error || 'הפעולה נכשלה — נסו שוב' });
        } catch {
            onDone({ error: 'הפעולה נכשלה — בדקו את החיבור ונסו שוב' });
        } finally {
            busy = false;
        }
    }

    function reject() {
        const reason = prompt('סיבת הדחייה (אפשר להשאיר ריק):', '');
        if (reason === null) return;
        void run('reject', { reason });
    }
</script>

{#if isAdmin || live}
    <div class="flex flex-wrap items-center gap-1.5">
        {#if isAdmin}
            {#if ad.status === 'pending'}
                <button type="button" class={OK} disabled={busy} title="אישור ופרסום"
                    onclick={() => run('approve', { durationDays: ad.requestedDurationDays })}>✅ אשר</button>
            {:else if ad.status === 'approved' && !live && !ad.paused}
                <!-- פג התוקף: אישור מחדש = תקופה חדשה מהיום, באותו מקום -->
                <button type="button" class={OK} disabled={busy} title="תקופה חדשה מהיום, באותו מקום בטור"
                    onclick={() => run('approve', { durationDays: ad.requestedDurationDays })}>🔄 חדש</button>
            {/if}
            {#if ad.status === 'approved'}
                {#if ad.paused}
                    <button type="button" class={OK} disabled={busy} title="הימים השמורים נספרים מהיום"
                        onclick={() => run('resume')}>▶ המשך</button>
                {:else if live}
                    <button type="button" class={GHOST} disabled={busy} title="יורדת מהאתר, הימים שנותרו נשמרים לה"
                        onclick={() => run('pause', {}, 'להשהות את הפרסומת? היא תרד מהאתר והימים שנותרו יישמרו לה.')}>⏸ השהה</button>
                {/if}
                <button type="button" class={GHOST} disabled={busy} title="חוזרת לממתינות בלי מחיקה"
                    onclick={() => run('unapprove', {}, 'להוריד את הפרסומת מהאתר ולהחזיר אותה לממתינות?')}>⬇ הורד</button>
            {/if}
            {#if ad.status !== 'rejected'}
                <button type="button" class={DANGER} disabled={busy} title="דחייה עם סיבה (לא חובה)" onclick={reject}>❌ דחה</button>
            {/if}
        {/if}
        {#if live}
            <a class={GHOST} href="/ads/{ad.id}" target="_blank" title="דף הנחיתה באתר">👁 צפה</a>
        {/if}
    </div>
{/if}
