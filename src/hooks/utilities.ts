import { Context } from './context.js'

export const useHookState = <T> (initial: T): [T, (updated: T) => void] => {
  const state = Context.getCurrent().getState()

  const index = state.index++
  const internal: T = index in state.hooks
    ? state.hooks[index] as T
    : state.hooks[index] = initial

  const setInternal = (updated: T) => {
    state.hooks![index] = updated
  }

  return [internal, setInternal]
}
