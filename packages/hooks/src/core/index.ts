import { Context } from './context'
export { useRenderCycle } from './render-cycle'

export const useMutable = <D> (type: string, data: D) => Context.getCurrent().getData<D>(type, data)
export const useProps = () => Context.getCurrent().properties as Readonly<object>
export const useEvents = () => Context.getCurrent().events
