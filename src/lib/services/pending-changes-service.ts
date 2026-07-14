// ─────────────────────────────────────────────────────────────
// pending-changes-service — מנגנון אישור צד ב' לאדמינים מוגבלים
//
// אדמין מוגבל לא כותב תוכן ישירות: כל שינוי שלו נרשם כ"בקשת שינוי"
// (ch-pending-change) וממתין שאדמין *אחר* יאשר. ההחלה בפועל נעשית
// בצד השרת בעת האישור — כולל אכיפת "מאשר ≠ מבקש" (עיקרון ארבע עיניים).
// ─────────────────────────────────────────────────────────────

import { strapiGet, strapiPost } from '$lib/strapi';

const COLLECTION = 'ch-pending-changes';

export type PendingAction = 'create' | 'update' | 'delete';
export type PendingStatus = 'pending' | 'approved' | 'rejected';

export interface PendingChange {
	documentId: string;
	kind: string;
	action: PendingAction;
	targetUid: string;
	targetId?: string | null;
	payload?: Record<string, unknown> | null;
	summary: string;
	requestedBy: string;
	requestedByName?: string;
	status: PendingStatus;
	decidedBy?: string;
	decidedAt?: string;
	rejectReason?: string;
	createdAt?: string;
}

/** ה-UIDs של תכני ההיכלות בבקאנד — חייבים להתאים ל-allowlist בצד השרת */
export const TARGET_UIDS = {
	article: 'api::ch-article.ch-article',
	activity: 'api::ch-activity-item.ch-activity-item',
	news: 'api::ch-news-item.ch-news-item',
	qaItem: 'api::ch-qa-item.ch-qa-item',
	qaSubmission: 'api::ch-question-submission.ch-question-submission',
	hearing: 'api::ch-hearing.ch-hearing',
	ruling: 'api::ch-ruling.ch-ruling',
	hearingRequest: 'api::ch-hearing-request.ch-hearing-request',
	rabbi: 'api::ch-rabbi.ch-rabbi',
	homeConfig: 'api::ch-home-config.ch-home-config'
} as const;

export async function loadPendingChanges(status?: PendingStatus): Promise<PendingChange[]> {
	const params: Record<string, string> = {};
	if (status) params.status = status;
	const resp = await strapiGet<{ data: PendingChange[] }>(COLLECTION, params, { needAuth: true });
	return resp?.data ?? [];
}

export async function createPendingChange(input: {
	kind: string;
	action: PendingAction;
	targetUid: string;
	targetId?: string;
	payload?: Record<string, unknown>;
	summary: string;
}): Promise<PendingChange | null> {
	const resp = await strapiPost<{ data: PendingChange }>(COLLECTION, {
		kind: input.kind,
		action: input.action,
		targetUid: input.targetUid,
		targetId: input.targetId,
		payload: input.payload,
		summary: input.summary
	}, { needAuth: true });
	return resp?.data ?? null;
}

/** אישור צד ב' — השרת מחיל את השינוי בפועל ודוחה אישור-עצמי */
export async function approvePendingChange(documentId: string): Promise<void> {
	await strapiPost(`${COLLECTION}/${documentId}/approve`, {}, { needAuth: true, raw: true });
}

export async function rejectPendingChange(documentId: string, reason: string): Promise<void> {
	await strapiPost(`${COLLECTION}/${documentId}/reject`, { reason }, { needAuth: true, raw: true });
}

/** ביטול בקשה שלי שעוד ממתינה */
export async function cancelPendingChange(documentId: string): Promise<void> {
	await strapiPost(`${COLLECTION}/${documentId}/cancel`, {}, { needAuth: true, raw: true });
}
