import { useMutable } from './core'

export const useRef = <T> (initial: T): { current: T }  => {
  return useMutable('use-ref', { current: initial })
}
