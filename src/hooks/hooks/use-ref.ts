import { Context } from '../context'

interface Ref<T> {
  current: T
}

export const useRef = <T> (initial: T): Ref<T>  => {
  const state = Context.getCurrent().getState()

  const index = state.index++
  const ref: Ref<T> = index in state.hooks
    ? state.hooks[index] as Ref<T>
    : state.hooks[index] = { current: initial }

  return ref
}
