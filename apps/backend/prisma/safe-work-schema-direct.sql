DO $$ BEGIN
  CREATE TYPE "WorkPriceType" AS ENUM ('fixed', 'range', 'inquiry');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "WorkStatus" AS ENUM ('draft', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "InquiryType" AS ENUM ('artwork', 'custom', 'appointment', 'corporate', 'international');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('pending', 'paid', 'cancelled', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TYPE "InquiryStatus" ADD VALUE IF NOT EXISTS 'new';
ALTER TYPE "InquiryStatus" ADD VALUE IF NOT EXISTS 'contacted';
ALTER TYPE "InquiryStatus" ADD VALUE IF NOT EXISTS 'negotiating';
ALTER TYPE "InquiryStatus" ADD VALUE IF NOT EXISTS 'completed';
ALTER TYPE "InquiryStatus" ADD VALUE IF NOT EXISTS 'closed';

CREATE TABLE IF NOT EXISTS "works" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "titleZh" TEXT NOT NULL,
  "titleEn" TEXT,
  "subtitleZh" TEXT,
  "subtitleEn" TEXT,
  "descriptionZh" TEXT NOT NULL,
  "descriptionEn" TEXT,
  "storyZh" TEXT,
  "storyEn" TEXT,
  "categoryId" TEXT NOT NULL,
  "materials" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "techniques" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "dimensions" TEXT,
  "weight" TEXT,
  "year" TEXT,
  "priceType" "WorkPriceType" NOT NULL DEFAULT 'inquiry',
  "price" DECIMAL(12,2),
  "priceMin" DECIMAL(12,2),
  "priceMax" DECIMAL(12,2),
  "currency" TEXT NOT NULL DEFAULT 'TWD',
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "isCustomizable" BOOLEAN NOT NULL DEFAULT false,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "status" "WorkStatus" NOT NULL DEFAULT 'draft',
  "coverImage" TEXT NOT NULL DEFAULT '',
  "images" JSONB NOT NULL DEFAULT '[]',
  "videoUrl" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "seoTitleZh" TEXT,
  "seoTitleEn" TEXT,
  "seoDescriptionZh" TEXT,
  "seoDescriptionEn" TEXT,
  "aiSummaryZh" TEXT,
  "aiSummaryEn" TEXT,
  "aiKnowledgeZh" TEXT,
  "aiKnowledgeEn" TEXT,
  "careInstructionsZh" TEXT,
  "careInstructionsEn" TEXT,
  "inquiryNotesZh" TEXT,
  "inquiryNotesEn" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "work_images" (
  "id" TEXT PRIMARY KEY,
  "workId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "altZh" TEXT,
  "altEn" TEXT,
  "captionZh" TEXT,
  "captionEn" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "categories" (
  "id" TEXT PRIMARY KEY,
  "slugZh" TEXT NOT NULL UNIQUE,
  "slugEn" TEXT NOT NULL UNIQUE,
  "nameZh" TEXT NOT NULL,
  "nameEn" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" TEXT PRIMARY KEY,
  "inquiryId" TEXT,
  "status" "OrderStatus" NOT NULL DEFAULT 'pending',
  "totalAmount" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'TWD',
  "paymentMethod" TEXT,
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "snapshot_sequences" (
  "scope" TEXT PRIMARY KEY,
  "currentSeq" BIGINT NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "outbox_events" (
  "eventId" TEXT PRIMARY KEY,
  "topic" TEXT NOT NULL DEFAULT 'default',
  "aggregateType" TEXT NOT NULL,
  "aggregateId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "causationId" TEXT,
  "correlationId" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "lastRetryAt" TIMESTAMP(3),
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3)
);

ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "lineId" TEXT;
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "inquiryType" "InquiryType" NOT NULL DEFAULT 'artwork';
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "workId" TEXT;
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "budgetRange" TEXT;
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "purpose" TEXT;
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "needsShipping" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "contactPreference" TEXT;
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "adminNote" TEXT;

INSERT INTO "works" (
  "id",
  "slug",
  "titleZh",
  "descriptionZh",
  "categoryId",
  "priceType",
  "price",
  "priceMin",
  "priceMax",
  "currency",
  "isAvailable",
  "coverImage",
  "status",
  "createdAt",
  "updatedAt"
)
SELECT
  row_data->>'id',
  LOWER(REGEXP_REPLACE(COALESCE(row_data->>'name', row_data->>'id'), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || LEFT(row_data->>'id', 8),
  COALESCE(row_data->>'name', '未命名作品'),
  COALESCE(row_data->>'description', ''),
  COALESCE(row_data->>'category', 'uncategorized'),
  COALESCE(row_data->>'priceType', 'inquiry')::"WorkPriceType",
  NULLIF(row_data->>'price', '')::DECIMAL(12,2),
  NULLIF(row_data->>'priceMin', '')::DECIMAL(12,2),
  NULLIF(row_data->>'priceMax', '')::DECIMAL(12,2),
  COALESCE(row_data->>'currency', 'TWD'),
  COALESCE((row_data->>'isAvailable')::BOOLEAN, true),
  COALESCE(row_data->>'imageUrl', ''),
  'published'::"WorkStatus",
  COALESCE(NULLIF(row_data->>'createdAt', '')::TIMESTAMP, CURRENT_TIMESTAMP),
  COALESCE(NULLIF(row_data->>'updatedAt', '')::TIMESTAMP, CURRENT_TIMESTAMP)
FROM (
  SELECT to_jsonb(p) AS row_data
  FROM "products" p
) source
WHERE NOT EXISTS (
  SELECT 1
  FROM "works" w
  WHERE w."id" = row_data->>'id'
);

CREATE INDEX IF NOT EXISTS "works_categoryId_idx" ON "works"("categoryId");
CREATE INDEX IF NOT EXISTS "works_status_sortOrder_idx" ON "works"("status", "sortOrder");
CREATE INDEX IF NOT EXISTS "works_isFeatured_idx" ON "works"("isFeatured");
CREATE INDEX IF NOT EXISTS "work_images_workId_sortOrder_idx" ON "work_images"("workId", "sortOrder");
CREATE INDEX IF NOT EXISTS "inquiries_status_createdAt_idx" ON "inquiries"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "inquiries_inquiryType_idx" ON "inquiries"("inquiryType");
CREATE INDEX IF NOT EXISTS "outbox_events_status_processedAt_idx" ON "outbox_events"("status", "processedAt");
CREATE INDEX IF NOT EXISTS "outbox_events_aggregateType_aggregateId_createdAt_idx" ON "outbox_events"("aggregateType", "aggregateId", "createdAt");
CREATE INDEX IF NOT EXISTS "outbox_events_correlationId_idx" ON "outbox_events"("correlationId");