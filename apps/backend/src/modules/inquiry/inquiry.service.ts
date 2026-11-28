import { InquiryRepository, CreateInquiryInput } from "./inquiry.repository";
import { outboxProcessor } from "../../shared/outbox/outbox-processor";

export class InquiryService {
  constructor(private readonly repo: InquiryRepository) {}

  async createInquiry(input: CreateInquiryInput) {
    const inquiry = await this.repo.create(input);

    // Publish the event with everything the notification/confirmation emails
    // need. The inquiry subscriber (registered at startup) sends them through
    // the outbox, so a transient email failure is retried instead of silently
    // lost — which previously meant a missed inquiry.
    await outboxProcessor.publish({
      aggregateType: "inquiry",
      aggregateId: inquiry.id,
      eventType: "INQUIRY_SUBMITTED",
      payload: {
        inquiryId: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone ?? undefined,
        inquiryType: inquiry.inquiryType,
        message: inquiry.message,
        workId: inquiry.workId ?? undefined,
        budgetRange: inquiry.budgetRange ?? undefined,
      },
    });

    return {
      inquiryId: inquiry.id,
      createdAt: inquiry.createdAt.toISOString(),
    };
  }

  async getInquiry(id: string) {
    return this.repo.findById(id);
  }
}
