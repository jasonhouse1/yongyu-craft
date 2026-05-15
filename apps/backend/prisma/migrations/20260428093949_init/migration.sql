-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('fixed', 'inquiry', 'hidden');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('pending', 'replied', 'closed');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'paid', 'cancelled', 'refunded');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2),
    "priceType" "PriceType" NOT NULL DEFAULT 'inquiry',
    "currency" TEXT NOT NULL DEFAULT 'TWD',
    "category" TEXT NOT NULL,
    "material" TEXT,
    "technique" TEXT,
    "dimensions" TEXT,
    "images" JSONB NOT NULL DEFAULT '[]',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "products" JSONB NOT NULL DEFAULT '[]',
    "status" "InquiryStatus" NOT NULL DEFAULT 'pending',
    "repliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TWD',
    "paymentMethod" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshot_sequences" (
    "scope" TEXT NOT NULL,
    "currentSeq" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "snapshot_sequences_pkey" PRIMARY KEY ("scope")
);

-- CreateTable
CREATE TABLE "snapshot_metadata" (
    "snapshotSeq" BIGINT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "priceVersion" INTEGER NOT NULL,
    "inventoryVersion" INTEGER NOT NULL,
    "storyVersion" INTEGER NOT NULL,
    "taxVersion" INTEGER NOT NULL,
    "causalHash" TEXT NOT NULL,
    "eventId" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3),
    "signature" TEXT,
    "signedBy" TEXT,

    CONSTRAINT "snapshot_metadata_pkey" PRIMARY KEY ("snapshotSeq")
);

-- CreateTable
CREATE TABLE "product_public_views" (
    "productId" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "snapshotSeq" BIGINT NOT NULL,
    "priceAmount" DECIMAL(12,2) NOT NULL,
    "priceCurrency" TEXT NOT NULL,
    "priceBreakdown" JSONB NOT NULL,
    "availableQty" INTEGER NOT NULL,
    "reservedQty" INTEGER NOT NULL,
    "storyTitle" JSONB NOT NULL,
    "storySummary" JSONB,
    "storyChapterCnt" INTEGER NOT NULL,
    "consistencyStatus" TEXT NOT NULL DEFAULT 'consistent',
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_public_views_pkey" PRIMARY KEY ("productId","market","snapshotSeq")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "eventId" TEXT NOT NULL,
    "topic" TEXT NOT NULL DEFAULT 'default',
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "causationId" TEXT,
    "correlationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastRetryAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_isPublished_sortOrder_idx" ON "products"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "inquiries_status_createdAt_idx" ON "inquiries"("status", "createdAt");

-- CreateIndex
CREATE INDEX "snapshot_metadata_aggregateType_market_generatedAt_idx" ON "snapshot_metadata"("aggregateType", "market", "generatedAt" DESC);

-- CreateIndex
CREATE INDEX "product_public_views_productId_market_snapshotSeq_idx" ON "product_public_views"("productId", "market", "snapshotSeq" DESC);

-- CreateIndex
CREATE INDEX "outbox_events_status_processedAt_idx" ON "outbox_events"("status", "processedAt");

-- CreateIndex
CREATE INDEX "outbox_events_aggregateType_aggregateId_createdAt_idx" ON "outbox_events"("aggregateType", "aggregateId", "createdAt");

-- CreateIndex
CREATE INDEX "outbox_events_correlationId_idx" ON "outbox_events"("correlationId");

-- AddForeignKey
ALTER TABLE "product_public_views" ADD CONSTRAINT "product_public_views_snapshotSeq_fkey" FOREIGN KEY ("snapshotSeq") REFERENCES "snapshot_metadata"("snapshotSeq") ON DELETE RESTRICT ON UPDATE CASCADE;
