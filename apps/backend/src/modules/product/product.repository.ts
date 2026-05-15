import { prisma } from "../../shared/db/prisma";

export type PriceType = "fixed" | "range" | "inquiry";

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  priceType: PriceType;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  currency: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSnapshot {
  product: Product;
}

export interface FindProductsOptions {
  category?: string;
  priceType?: PriceType;
  page?: number;
  limit?: number;
}

type WorkRecord = NonNullable<Awaited<ReturnType<typeof prisma.work.findFirst>>>;

function mapWorkToProduct(work: WorkRecord): Product {
  return {
    id: work.id,
    name: work.titleZh,
    category: work.categoryId,
    description: work.descriptionZh,
    priceType: work.priceType as PriceType,
    price: work.price ? Number(work.price) : undefined,
    priceMin: work.priceMin ? Number(work.priceMin) : undefined,
    priceMax: work.priceMax ? Number(work.priceMax) : undefined,
    currency: work.currency,
    imageUrl: work.coverImage || undefined,
    isAvailable: work.isAvailable,
    createdAt: work.createdAt,
    updatedAt: work.updatedAt,
  };
}

export class ProductRepository {
  async findById(id: string): Promise<Product | null> {
    const work = await prisma.work.findFirst({
      where: {
        id,
        status: "published",
      },
    });

    return work ? mapWorkToProduct(work) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const work = await prisma.work.findFirst({
      where: {
        slug,
        status: "published",
      },
    });

    return work ? mapWorkToProduct(work) : null;
  }

  async findAll(options?: FindProductsOptions): Promise<{
    items: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      status: "published" as const,
      ...(options?.category ? { categoryId: options.category } : {}),
      ...(options?.priceType ? { priceType: options.priceType } : {}),
    };

    const [works, total] = await Promise.all([
      prisma.work.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.work.count({ where }),
    ]);

    return {
      items: works.map(mapWorkToProduct),
      total,
      page,
      limit,
    };
  }

  toSnapshot(product: Product): ProductSnapshot {
    return { product };
  }
}
