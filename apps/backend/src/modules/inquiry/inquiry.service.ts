import { InquiryRepository, CreateInquiryInput } from "./inquiry.repository";
import { outboxProcessor } from "../../shared/outbox/outbox-processor";
import { emailService } from "../../shared/email/email.service";

export class InquiryService {
  constructor(private readonly repo: InquiryRepository) {}

  async createInquiry(input: CreateInquiryInput) {
    const inquiry = await this.repo.create(input);

    await outboxProcessor.publish({
      aggregateType: "inquiry",
      aggregateId: inquiry.id,
      eventType: "INQUIRY_SUBMITTED",
      payload: {
        inquiryId: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        inquiryType: inquiry.inquiryType,
      },
    });

    emailService
      .sendInquiryNotification({
        inquiryId: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone ?? undefined,
        inquiryType: inquiry.inquiryType,
        message: inquiry.message,
        workId: inquiry.workId ?? undefined,
        budgetRange: inquiry.budgetRange ?? undefined,
      })
      .catch((err) =>
        console.error("[InquiryService] notification email failed:", err)
      );

    emailService
      .sendInquiryConfirmation({
        name: inquiry.name,
        email: inquiry.email,
        inquiryId: inquiry.id,
      })
      .catch((err) =>
        console.error("[InquiryService] confirmation email failed:", err)
      );

    return {
      inquiryId: inquiry.id,
      createdAt: inquiry.createdAt.toISOString(),
    };
  }

  async getInquiry(id: string) {
    return this.repo.findById(id);
  }
}
