// apps/backend/src/modules/product/snapshot/product-snapshot.ts
export interface ProductSnapshot {
  snapshotSeq: number;
  generatedAt: string;
  product: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    price: number | null;
    priceType: "fixed" | "inquiry" | "hidden";
    currency: string;
    category: string;
    material?: string;
    technique?: string;
    dimensions?: string;
    images: string[];
  };
  consistency: {
    source: "mock" | "db" | "event";
    status: "consistent" | "stale";
  };
  causedBy: {
    eventId: string;
    eventType: string;
    occurredAt: string;
  } | null;
}
