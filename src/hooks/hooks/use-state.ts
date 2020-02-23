import { Context } from '../context'
import { useRef } from './use-ref'

export const useState = <T> (initial: T): [T, (updated: T) => void] => {
  const context = Context.getCurrent()
  const events = context.getEvents()
  const ref = useRef(initial)

  const setState = (updater: T) => {
    ref.current = updater
    events.emit('request-render', context.getProps())
  }
  return [ref.current, setState]
}
