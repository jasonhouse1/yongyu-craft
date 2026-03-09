import { Product } from "./product.types";

/**
 * ProductRepository
 * ====================================================
 * 【資料存取層（Repository）】
 *
 * 職責：
 * - 封裝「產品資料從哪裡來」
 * - 對上層（Service）隱藏資料來源細節
 *
 * 非職責（非常重要）：
 * -  不包含商業邏輯
 * -  不發送 Domain Event
 * -  不處理 HTTP
 *
 * Phase 說明：
 * ----------------------------------------------------
 * Phase 1：
 * - Repository 僅作為「責任邊界」
 * - 尚未實作實際資料存取
 *
 * Phase 2：
 * - 實作 Prisma / DB 查詢
 */
export class ProductRepository {
  /**
   * 依 productId 取得產品
   *
   * @param productId
   */
  findById(productId: string): Product | null {
    // Phase 1 intentionally left blank
    return null;
  }
}
