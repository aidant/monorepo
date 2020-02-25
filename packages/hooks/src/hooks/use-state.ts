import { useCurrentContext } from '../engine'

interface State<T> {
  value: T
}

export const useState = <T> (initial: T): [T, (updated: T) => void] => {
  const context = useCurrentContext()
  const events = context.getEvents()
  const state = context.getState<State<T>>({ value: initial })

  const setState = (updater: T) => {
    state.value = updater
    queueMicrotask(() => events.emit('request-render', context.getProps()))
  }
  return [state.value, setState]
}
