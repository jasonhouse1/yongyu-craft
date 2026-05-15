export interface WorkImage {
  id: string;
  url: string;
  altZh?: string;
  altEn?: string;
  captionZh?: string;
  captionEn?: string;
  sortOrder: number;
}

export interface WorkSnapshot {
  id: string;
  slug: string;
  titleZh: string;
  titleEn?: string;
  subtitleZh?: string;
  subtitleEn?: string;
  descriptionZh: string;
  descriptionEn?: string;
  storyZh?: string;
  storyEn?: string;
  categoryId: string;
  materials: string[];
  techniques: string[];
  dimensions?: string;
  weight?: string;
  year?: string;
  priceType: "fixed" | "range" | "inquiry";
  price?: number;
  priceMin?: number;
  priceMax?: number;
  currency: string;
  isAvailable: boolean;
  isCustomizable: boolean;
  isFeatured: boolean;
  status: "draft" | "published" | "archived";
  coverImage: string;
  images: WorkImage[];
  videoUrl?: string;
  sortOrder: number;
  seoTitleZh?: string;
  seoTitleEn?: string;
  seoDescriptionZh?: string;
  seoDescriptionEn?: string;
  aiSummaryZh?: string;
  aiSummaryEn?: string;
  aiKnowledgeZh?: string;
  aiKnowledgeEn?: string;
  careInstructionsZh?: string;
  careInstructionsEn?: string;
  inquiryNotesZh?: string;
  inquiryNotesEn?: string;
  createdAt: string;
  updatedAt: string;
}
