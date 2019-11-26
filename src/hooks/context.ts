import { EventEmitter } from '../event-emitter/event-emitter.js'

export interface ContextEvents {
  'request-re-render': null
  rendered: unknown
}

export class Context<
  T extends { [channel: string]: unknown } = { [channel: string]: unknown }
> extends EventEmitter<ContextEvents & T> {
  internalHooksIndex = 0
  internalHooksState: unknown[] = []
}
