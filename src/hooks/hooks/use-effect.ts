import { useRef } from './use-ref'

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

export const useEffect = <D extends unknown[]> (effect: () => void, deps: D): void => {
  const ref = useRef<D | null>(null)

  if (dependenciesChanged(ref.current, deps)) queueMicrotask(() => effect())

  ref.current = deps
}
