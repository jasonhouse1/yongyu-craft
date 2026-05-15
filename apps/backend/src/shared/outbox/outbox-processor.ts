// apps/backend/src/shared/outbox/outbox-processor.ts
import { prisma } from "../db/prisma";

type EventHandler = (event: {
  eventId: string;
  topic: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: unknown;
}) => Promise<void>;

export class OutboxProcessor {
  private handlers: Map<string, EventHandler[]> = new Map();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly pollIntervalMs: number;
  private readonly maxRetries: number;

  constructor(options?: { pollIntervalMs?: number; maxRetries?: number }) {
    this.pollIntervalMs = options?.pollIntervalMs ?? 3000;
    this.maxRetries = options?.maxRetries ?? 3;
  }

  subscribe(eventType: string, handler: EventHandler): void {
    const existing = this.handlers.get(eventType) ?? [];
    existing.push(handler);
    this.handlers.set(eventType, existing);
  }

  start(): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.processPending().catch((err) =>
        console.error("[OutboxProcessor] poll error:", err)
      );
    }, this.pollIntervalMs);
    console.log("[OutboxProcessor] started");
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[OutboxProcessor] stopped");
    }
  }

  async publish(event: {
    topic?: string;
    aggregateType: string;
    aggregateId: string;
    eventType: string;
    payload: unknown;
    correlationId?: string;
    causationId?: string;
  }): Promise<void> {
    await prisma.outboxEvent.create({
      data: {
        topic: event.topic ?? "default",
        aggregateType: event.aggregateType,
        aggregateId: event.aggregateId,
        eventType: event.eventType,
        payload: event.payload as object,
        correlationId: event.correlationId ?? crypto.randomUUID(),
        causationId: event.causationId ?? null,
        status: "pending",
      },
    });
  }

  private async processPending(): Promise<void> {
    const events = await prisma.outboxEvent.findMany({
      where: {
        status: "pending",
        retryCount: { lt: this.maxRetries },
      },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    for (const event of events) {
      const handlers = this.handlers.get(event.eventType) ?? [];
      try {
        for (const handler of handlers) {
          await handler({
            eventId: event.eventId,
            topic: event.topic,
            aggregateType: event.aggregateType,
            aggregateId: event.aggregateId,
            eventType: event.eventType,
            payload: event.payload,
          });
        }
        await prisma.outboxEvent.update({
          where: { eventId: event.eventId },
          data: { status: "processed", processedAt: new Date() },
        });
      } catch (err) {
        await prisma.outboxEvent.update({
          where: { eventId: event.eventId },
          data: {
            retryCount: { increment: 1 },
            lastRetryAt: new Date(),
            errorMessage: err instanceof Error ? err.message : String(err),
            status:
              event.retryCount + 1 >= this.maxRetries ? "failed" : "pending",
          },
        });
      }
    }
  }
}

export const outboxProcessor = new OutboxProcessor();
