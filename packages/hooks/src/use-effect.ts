import { useEvents, useMutable } from './core'

const dependenciesChanged = (previousDependencies: unknown[] | null, currentDependencies: unknown[] | undefined): boolean => {
  if (!previousDependencies || !currentDependencies) return true

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

export const useEffect = <D extends unknown[]> (effect: Effect, deps?: D): void => {
  const events = useEvents()
  const state = useMutable<State<D>>('use-effect', {
    dependencies: null,
    cleanup: null,
    registered: false
  })

  if (!state.registered) {
    state.registered = true

    const onDestroyRenderCycle = () => {
      events.off('destroyed', onDestroyRenderCycle)
      if (state.cleanup) state.cleanup()
    }

    events.on('destroyed', onDestroyRenderCycle)
  }

  if (dependenciesChanged(state.dependencies, deps)) {
    queueMicrotask(() => {
      if (state.cleanup) state.cleanup()
      state.cleanup = effect() || null
    })
  }

  state.dependencies = deps || null
}
