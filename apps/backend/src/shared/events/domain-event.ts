// shared/events/domain-event.ts

export interface DomainEvent<T = any> {
  eventId: string;          // UUID
  eventType: string;        // e.g. PRODUCT_CREATED
  aggregateType: string;    // product / order / inventory
  aggregateId: string;      // productId
  occurredAt: Date;

  payload: unknown;
}
