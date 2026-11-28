// 作品分類的顯示名稱：後端存英文 id（ring、necklace…），前端統一顯示中文。
// 未收錄的分類會原樣退回該 id，確保不會因為新增分類而壞掉。
const CATEGORY_LABELS: Record<string, string> = {
  ring: "戒指",
  necklace: "項鍊",
  pendant: "墜飾",
  bracelet: "手鍊",
  bangle: "手環",
  earring: "耳環",
  brooch: "胸針",
  anklet: "腳鍊",
  cufflink: "袖扣",
  set: "套組",
  custom: "訂製",
  other: "其他",
};

export function categoryLabel(id: string): string {
  if (!id) return id;
  return CATEGORY_LABELS[id.toLowerCase()] ?? id;
}
