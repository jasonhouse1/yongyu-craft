const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export interface WorkSnapshot {
  id: string;
  slug: string;
  titleZh: string;
  titleEn?: string;
  subtitleZh?: string;
  descriptionZh: string;
  descriptionEn?: string;
  storyZh?: string;
  categoryId: string;
  materials: string[];
  techniques: string[];
  dimensions?: string;
  priceType: "fixed" | "range" | "inquiry";
  price?: number;
  priceMin?: number;
  priceMax?: number;
  currency: string;
  isAvailable: boolean;
  isCustomizable: boolean;
  isFeatured: boolean;
  coverImage: string;
  images: { id: string; url: string; altZh?: string; sortOrder: number }[];
  videoUrl?: string;
  aiSummaryZh?: string;
  aiKnowledgeZh?: string;
  careInstructionsZh?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkListResponse {
  items: WorkSnapshot[];
  total: number;
  page: number;
  limit: number;
}

export async function getWorks(params?: {
  categoryId?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}): Promise<WorkListResponse> {
  const url = new URL(`${API_URL}/api/works`);
  if (params?.categoryId) url.searchParams.set("categoryId", params.categoryId);
  if (params?.isFeatured) url.searchParams.set("isFeatured", "true");
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch works: ${res.status}`);
  return res.json();
}

export async function getWork(id: string): Promise<WorkSnapshot | null> {
  const res = await fetch(`${API_URL}/api/works/${id}`, {
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch work: ${res.status}`);
  return res.json();
}

export async function getFeaturedWorks(): Promise<WorkSnapshot[]> {
  const res = await fetch(`${API_URL}/api/works/featured`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

export async function submitInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  lineId?: string;
  whatsapp?: string;
  country?: string;
  inquiryType?: string;
  workId?: string;
  budgetRange?: string;
  message: string;
  needsShipping?: boolean;
  contactPreference?: string;
}): Promise<{ inquiryId: string; createdAt: string }> {
  const res = await fetch(`${API_URL}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to submit inquiry: ${res.status}`);
  return res.json();
}