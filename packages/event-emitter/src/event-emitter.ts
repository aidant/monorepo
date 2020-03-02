export type Events = Record<string, unknown[]>

type Listener<E extends Events, C extends keyof E> = (...data: E[C]) => void

export class EventEmitter <E extends Events> {
  private events = new Map<keyof E, Function[]>()

  on <C extends keyof E> (channel: C, listener: Listener<E, C>): () => void {
    let listeners = this.events.get(channel)
    if (!listeners) this.events.set(channel, listeners = [])
    if (!listeners.includes(listener)) listeners.push(listener)
    return () => this.off(channel, listener)
  }

  off <C extends keyof E> (channel: C, listener: Listener<E, C>) {
    const listeners = this.events.get(channel)
    const index = listeners?.indexOf(listener) ?? -1
    if (index !== -1) listeners?.splice(index, 1)
  }

  emit <C extends keyof E> (channel: C, ...data: E[C]) {
    const listeners = this.events.get(channel)
    if (!listeners) return
    for (const listener of [...listeners]) listener(data)
  }
}
