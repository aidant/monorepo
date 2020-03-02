import { EventEmitter } from '@lazy/event-emitter'

interface Hook {
  type: string
  data: unknown
}

export class Context<Props extends object = object, UI = unknown> {
  private static current: Context[] = []

  static getCurrent (): Context {
    if (!this.current.length) throw new Error('No Context is currently in use.')
    return this.current[this.current.length - 1]
  }

  static appendCurrent (context: Context) {
    if (this.current.includes(context)) throw new Error('Context is already in use.')
    this.current.push(context)
  }

  static removeCurrent (context: Context) {
    const index = this.current.indexOf(context)
    if (index === -1) throw new Error('Context is not in use.')
    this.current.splice(index, 1)
  }

  events = new EventEmitter<{
    'request-render': [Props]
    'rendered': [UI]
    'request-destroy': []
    'destroyed': []
  }>()
  hooksIndex = 0
  hooksState: Hook[] = []
  isFirstRender = true
  properties: object = Object.freeze(Object.create(null))

  getData <D> (type: string, data: D): D {
    const index = this.hooksIndex++

    if (this.isFirstRender) {
      this.hooksState[index] = { type, data }
    } else if (this.hooksState[index].type !== type) {
      throw new Error('Call order has changed.')
    }

    return this.hooksState[index].data as D
  }
}
