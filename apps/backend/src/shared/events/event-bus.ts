// shared/events/event-bus.ts
import { DomainEvent } from "./domain-event";

type EventHandler = (event: DomainEvent) => void;

export class EventBus {
  private handlers: EventHandler[] = [];

  subscribe(handler: EventHandler) {
    this.handlers.push(handler);
  }

  publish(event: DomainEvent) {
    for (const handler of this.handlers) {
      handler(event);
    }
  }
}

// 全系統共用一個 instance（暫時）
export const eventBus = new EventBus();
