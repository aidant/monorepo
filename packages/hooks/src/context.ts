import { EventEmitter, Events } from '../event-emitter/event-emitter'

interface Hooks extends Record<string, unknown> {
  index: number
  state: unknown[]
}

export class Context {
  private static current: Context | null = null

  static getCurrent (): Context {
    if (this.current === null) throw new Error('No Context is currently in use.')
    return this.current
  }

  static setCurrent (context: Context | null) {
    if (context && this.current !== null) throw new Error('Cannot overwrite current Context.')
    this.current = context
  }

  static setIndex (context: Context, index: number) {
    context.hooks.index = index
  }

  static setProps <Props extends unknown[]> (context: Context, ...props: Props) {
    context.props = props
  }

  private hooks: Hooks = { index: 0, state: [] }
  private events = new EventEmitter<Events>()
  private props: unknown[] = []

  getState <S extends object> (initial: S): S {
    const index = this.hooks.index++
    const state: S = index in this.hooks.state
      ? this.hooks.state[index] as S
      : this.hooks.state[index] = initial

    return state
  }

  getEvents <E extends Events> (): EventEmitter<E> {
    return this.events as unknown as EventEmitter<E>
  }

  getProps <Props extends unknown[]> (): Props {
    return this.props as Props
  }
}
