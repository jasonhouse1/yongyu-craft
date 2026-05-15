import { prisma } from "../../shared/db/prisma";

export type InquiryTypeValue =
  | "artwork"
  | "custom"
  | "appointment"
  | "corporate"
  | "international";

export type InquiryStatusValue =
  | "newInquiry"
  | "contacted"
  | "negotiating"
  | "completed"
  | "closed";

export interface CreateInquiryInput {
  name: string;
  email: string;
  phone?: string;
  lineId?: string;
  whatsapp?: string;
  country?: string;
  inquiryType: InquiryTypeValue;
  workId?: string;
  budgetRange?: string;
  purpose?: string;
  message: string;
  needsShipping?: boolean;
  contactPreference?: string;
}

export class InquiryRepository {
  async create(input: CreateInquiryInput) {
    return prisma.inquiry.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        lineId: input.lineId ?? null,
        whatsapp: input.whatsapp ?? null,
        country: input.country ?? null,
        inquiryType: input.inquiryType,
        workId: input.workId ?? null,
        budgetRange: input.budgetRange ?? null,
        purpose: input.purpose ?? null,
        message: input.message,
        needsShipping: input.needsShipping ?? false,
        contactPreference: input.contactPreference ?? null,
        status: "newInquiry",
      },
    });
  }

  async findById(id: string) {
    return prisma.inquiry.findUnique({ where: { id } });
  }

  async findAll(options?: {
    status?: InquiryStatusValue;
    page?: number;
    limit?: number;
  }) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = options?.status ? { status: options.status } : {};

    const [items, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async updateStatus(
    id: string,
    status: InquiryStatusValue,
    adminNote?: string
  ) {
    return prisma.inquiry.update({
      where: { id },
      data: {
        status,
        adminNote: adminNote ?? undefined,
        repliedAt: status === "contacted" ? new Date() : undefined,
      },
    });
  }
}
