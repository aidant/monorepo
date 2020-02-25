import { useCurrentContext } from '../engine'

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

type Cleanup = () => void
type Effect = () => void | Cleanup

interface State<D> {
  dependencies: D | null
  cleanup: null | Cleanup
  registered: boolean
}

export const useEffect = <D extends unknown[]> (effect: Effect, deps: D): void => {
  const context = useCurrentContext()
  const events = context.getEvents()
  const state = context.getState<State<D>>({
    dependencies: null,
    cleanup: null,
    registered: false
  })

  if (!state.registered) {
    state.registered = true

    const onDestroyRenderCycle = () => {
      events.off('destroy-render-cycle', onDestroyRenderCycle)
      if (state.cleanup) state.cleanup()
    }

    events.on('destroy-render-cycle', onDestroyRenderCycle)
  }

  if (dependenciesChanged(state.dependencies, deps)) {
    queueMicrotask(() => {
      if (state.cleanup) state.cleanup()
      state.cleanup = effect() || null
    })
  }

  state.dependencies = deps
}
