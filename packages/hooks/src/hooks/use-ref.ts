import { useCurrentContext } from '../engine'

interface State<T> {
  current: T
}

export const useRef = <T> (initial: T): State<T>  => {
  const context = useCurrentContext()
  return context.getState<State<T>>({ current: initial })
}
