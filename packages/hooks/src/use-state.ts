import { useEvents, useMutable, useProps } from './core'

export const useState = <T> (initial: T): [T, (updated: T) => void] => {
  const events = useEvents()
  const state = useMutable('use-state', { value: initial })
  const props = useProps()

  const setState = (updater: T) => {
    state.value = updater
    events.emit('request-render', props)
  }
  return [state.value, setState]
}
