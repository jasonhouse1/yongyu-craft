SELECT COUNT(*) AS works_count FROM "works";
SELECT "id", "titleZh", "categoryId", "priceType", "status" FROM "works" ORDER BY "createdAt" DESC LIMIT 10;