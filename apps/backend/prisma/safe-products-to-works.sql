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