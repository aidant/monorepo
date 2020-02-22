import { Context } from './context.js'
import { useHookState } from './utilities.js'

const dependenciesChanged = (previousDependencies: unknown[] | null, currentDependencies: unknown[]): boolean => {
  if (!previousDependencies) return true

  if (previousDependencies.length !== currentDependencies.length) {
    throw new Error('Invalid call to useEffect, dependencies length changed since last render.')
  }

  for (let index = 0; index < currentDependencies.length; index++) {
    if (!Object.is(previousDependencies[index], currentDependencies[index])) {
      return true
    }
  }

  return false
}

export const useState = <T> (initial: T): [T, (updated: T) => void] => {
  const context = Context.getCurrent()
  const events = context.getEvents()
  const [state, setHookState] = useHookState(initial)
  const setState = (updater: T) => {
    setHookState(updater)
    events.emit('request-render', context.getProps())
  }
  return [state, setState]
}

export const useEffect = <D extends unknown[]> (effect: () => void, deps: D): void => {
  const [prevDeps, setDeps] = useHookState<D | null>(null)

  if (dependenciesChanged(prevDeps, deps)) queueMicrotask(() => effect())

  setDeps(deps)
}
