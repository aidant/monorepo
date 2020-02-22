import { EventEmitter, Events } from '../event-emitter/event-emitter.js'

interface State extends Record<string, unknown> {
  index: number
  hooks: unknown[]
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

  private state: State = { index: 0, hooks: [] }
  private events = new EventEmitter<Events>()
  private props: unknown[] = []

  getState <S extends State> (): S {
    return this.state as S
  }

  getEvents <E extends Events> (): EventEmitter<E> {
    return this.events as unknown as EventEmitter<E>
  }

  getProps <Props extends unknown[]> (): Props {
    return this.props as Props
  }

  setProps <Props extends unknown[]> (...props: Props) {
    this.props = props
  }
}
