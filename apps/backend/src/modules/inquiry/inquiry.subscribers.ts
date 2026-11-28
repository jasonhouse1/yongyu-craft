// apps/backend/src/modules/inquiry/inquiry.subscribers.ts
//
// Wires inquiry domain events to their side effects through the outbox, so the
// processor's retry (up to maxRetries) covers them. Register once at startup.

import { outboxProcessor } from "../../shared/outbox/outbox-processor";
import { emailService, InquiryEmailData } from "../../shared/email/email.service";

export function registerInquirySubscribers(): void {
  outboxProcessor.subscribe("INQUIRY_SUBMITTED", async (event) => {
    const data = event.payload as InquiryEmailData;

    // Notify the studio and confirm to the customer. Throwing here lets the
    // outbox retry the whole event (at-least-once: a transient failure may
    // re-send, which is acceptable for an inquiry notification).
    await emailService.sendInquiryNotification(data);
    await emailService.sendInquiryConfirmation({
      name: data.name,
      email: data.email,
      inquiryId: data.inquiryId,
    });
  });
}
