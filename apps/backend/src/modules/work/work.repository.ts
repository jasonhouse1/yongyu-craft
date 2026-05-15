import { prisma } from "../../shared/db/prisma";
import { WorkSnapshot } from "./work-snapshot";

export type WorkStatusValue = "draft" | "published" | "archived";
export type WorkPriceTypeValue = "fixed" | "range" | "inquiry";

export interface FindWorksOptions {
  categoryId?: string;
  isFeatured?: boolean;
  status?: WorkStatusValue;
  page?: number;
  limit?: number;
}

type WorkRecord = NonNullable<Awaited<ReturnType<typeof prisma.work.findFirst>>>;

export class WorkRepository {
  async findById(id: string): Promise<WorkRecord | null> {
    return prisma.work.findFirst({
      where: { id, status: "published" },
    });
  }

  async findBySlug(slug: string): Promise<WorkRecord | null> {
    return prisma.work.findFirst({
      where: { slug, status: "published" },
    });
  }

  async findAll(options?: FindWorksOptions): Promise<{
    items: WorkRecord[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;
    const status = options?.status ?? "published";

    const where = {
      status,
      ...(options?.categoryId ? { categoryId: options.categoryId } : {}),
      ...(options?.isFeatured !== undefined
        ? { isFeatured: options.isFeatured }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.work.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.work.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  toSnapshot(work: WorkRecord): WorkSnapshot {
    return {
      id: work.id,
      slug: work.slug,
      titleZh: work.titleZh,
      titleEn: work.titleEn ?? undefined,
      subtitleZh: work.subtitleZh ?? undefined,
      subtitleEn: work.subtitleEn ?? undefined,
      descriptionZh: work.descriptionZh,
      descriptionEn: work.descriptionEn ?? undefined,
      storyZh: work.storyZh ?? undefined,
      storyEn: work.storyEn ?? undefined,
      categoryId: work.categoryId,
      materials: work.materials,
      techniques: work.techniques,
      dimensions: work.dimensions ?? undefined,
      weight: work.weight ?? undefined,
      year: work.year ?? undefined,
      priceType: work.priceType as WorkPriceTypeValue,
      price: work.price ? Number(work.price) : undefined,
      priceMin: work.priceMin ? Number(work.priceMin) : undefined,
      priceMax: work.priceMax ? Number(work.priceMax) : undefined,
      currency: work.currency,
      isAvailable: work.isAvailable,
      isCustomizable: work.isCustomizable,
      isFeatured: work.isFeatured,
      status: work.status as WorkStatusValue,
      coverImage: work.coverImage,
      images: Array.isArray(work.images)
        ? ((work.images as unknown) as WorkSnapshot["images"])
        : [],
      videoUrl: work.videoUrl ?? undefined,
      sortOrder: work.sortOrder,
      seoTitleZh: work.seoTitleZh ?? undefined,
      seoTitleEn: work.seoTitleEn ?? undefined,
      seoDescriptionZh: work.seoDescriptionZh ?? undefined,
      seoDescriptionEn: work.seoDescriptionEn ?? undefined,
      aiSummaryZh: work.aiSummaryZh ?? undefined,
      aiSummaryEn: work.aiSummaryEn ?? undefined,
      aiKnowledgeZh: work.aiKnowledgeZh ?? undefined,
      aiKnowledgeEn: work.aiKnowledgeEn ?? undefined,
      careInstructionsZh: work.careInstructionsZh ?? undefined,
      careInstructionsEn: work.careInstructionsEn ?? undefined,
      inquiryNotesZh: work.inquiryNotesZh ?? undefined,
      inquiryNotesEn: work.inquiryNotesEn ?? undefined,
      createdAt: work.createdAt.toISOString(),
      updatedAt: work.updatedAt.toISOString(),
    };
  }
}

