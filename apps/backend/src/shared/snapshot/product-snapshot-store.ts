import { ProductSnapshot } from "../../modules/product/snapshot/product-snapshot";

/**
 * ProductSnapshotStore
 * ====================================================
 * Snapshot 的「讀模型儲存區」
 *
 * 【設計定位】
 * - 專職保存「已生成的 Snapshot」
 * - 不負責生成、不負責驗證、不負責一致性判斷
 *
 * 【重要原則】
 * - Snapshot 是 immutable（只新增、不修改）
 * - 以 productId 為查詢主鍵
 *
 * Phase 2.5：
 * - 使用 in-memory Map
 * - 介面設計需可直接替換為 DB / Redis
 */
export class ProductSnapshotStore {
  /**
   * 內部儲存結構
   * --------------------------------------------------
   * key   : productId
   * value : 該產品所有 Snapshot（依 snapshotSeq 遞增）
   */
  private readonly store = new Map<string, ProductSnapshot[]>();

  /**
   * 儲存一筆 Snapshot
   * --------------------------------------------------
   * @param snapshot - 已生成完成的 ProductSnapshot
   *
   * 行為說明：
   * - 不檢查重複（假設呼叫端已保證）
   * - Snapshot 永遠 append
   */
  save(snapshot: ProductSnapshot): void {
    const productId = snapshot.product.id;

    const existing = this.store.get(productId) ?? [];
    existing.push(snapshot);

    this.store.set(productId, existing);
  }

  /**
   * 取得最新 Snapshot
   * --------------------------------------------------
   * @param productId - 產品 ID
   * @returns ProductSnapshot | null
   *
   * 查詢策略：
   * - 若不存在任何 Snapshot → null
   * - 回傳 snapshotSeq 最大的一筆
   */
  getLatest(productId: string): ProductSnapshot | null {
    const snapshots = this.store.get(productId);

    if (!snapshots || snapshots.length === 0) {
      return null;
    }

    // Snapshot 保證依序新增，直接取最後一筆
    return snapshots[snapshots.length - 1];
  }

  /**
   * （輔助）清空 Store
   * --------------------------------------------------
   * 僅用於測試 / 開發階段
   */
  clear(): void {
    this.store.clear();
  }
}

/**
 * Phase 2.5 暫時採用 singleton
 * --------------------------------------------------
 * 後續可替換為：
 * - DI container
 * - Request scope
 * - Infrastructure layer
 */
export const productSnapshotStore = new ProductSnapshotStore();
