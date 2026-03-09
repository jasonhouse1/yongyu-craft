// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  //  migrate dev 實際檢查的欄位
  datasourceUrl: process.env.DATABASE_URL,
});
