import { Context } from './context.js'
import { ContextManager } from './context-manager.js'

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

export class Hooks<C extends Context = Context> {
  private manager: ContextManager<C>

  constructor (manager: ContextManager<C>) {
    this.manager = manager

    this.useInternalHookState = this.useInternalHookState.bind(this)
    this.useState = this.useState.bind(this)
    this.useEffect = this.useEffect.bind(this)
  }

  useInternalHookState <T> (initial: T): [T, (updated: T) => void] {
    const context = this.manager.getCurrentContext()
  
    const index = context.internalHooksIndex++
    const internal: T = index in context.internalHooksState
      ? context.internalHooksState[index] as T
      : context.internalHooksState[index] = initial
  
    const setInternal = (updated: T) => {
      context.internalHooksState[index] = updated
    }
  
    return [internal, setInternal]
  }
  
  useState <T> (initial: T): [T, (updated: T) => void] {
    const context = this.manager.getCurrentContext()
    const [state, setInternalHookState] = this.useInternalHookState(initial)
    const setState = (updater: T) => {
      setInternalHookState(updater)
      context.emit('request-re-render', null)
    }
    return [state, setState]
  }
  
  useEffect <D extends unknown[]> (effect: () => void, deps: D): void {
    const [prevDeps, setDeps] = this.useInternalHookState<D | null>(null)
  
    if (dependenciesChanged(prevDeps, deps)) queueMicrotask(() => effect())
  
    setDeps(deps)
  }
}
