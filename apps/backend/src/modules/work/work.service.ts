import { WorkRepository, FindWorksOptions } from "./work.repository";
import { WorkSnapshot } from "./work-snapshot";
import { outboxProcessor } from "../../shared/outbox/outbox-processor";

export class WorkService {
  constructor(private readonly repo: WorkRepository) {}

  async getWork(id: string): Promise<WorkSnapshot | null> {
    const work = await this.repo.findById(id);
    if (!work) return null;

    await outboxProcessor.publish({
      aggregateType: "work",
      aggregateId: id,
      eventType: "WORK_VIEWED",
      payload: { workId: id },
    });

    return this.repo.toSnapshot(work);
  }

  async getWorkBySlug(slug: string): Promise<WorkSnapshot | null> {
    const work = await this.repo.findBySlug(slug);
    if (!work) return null;
    return this.repo.toSnapshot(work);
  }

  async getWorks(options?: FindWorksOptions): Promise<{
    items: WorkSnapshot[];
    total: number;
    page: number;
    limit: number;
  }> {
    const result = await this.repo.findAll(options);
    return {
      ...result,
      items: result.items.map((w) => this.repo.toSnapshot(w)),
    };
  }

  async getFeaturedWorks(limit = 3): Promise<WorkSnapshot[]> {
    const result = await this.repo.findAll({ isFeatured: true, limit });
    return result.items.map((w) => this.repo.toSnapshot(w));
  }
}
