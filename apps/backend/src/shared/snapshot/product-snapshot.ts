/**
 * ProductSnapshot
 * ====================================================
 * Snapshot 是「對外穩定輸出的讀模型」
 *
 * 原則：
 * - 不等於 Product（Domain）
 * - 不包含業務邏輯
 * - 可自由演進，不影響 Domain
 */

export interface ProductSnapshot {
  productId: string;

  // 基本展示資訊
  name: string;
  description?: string;

  // Snapshot metadata（未來會擴充）
  snapshotVersion: number;
  generatedAt: Date;
}
