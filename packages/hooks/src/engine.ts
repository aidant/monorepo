import { Context } from './context'
import { Events, EventEmitter } from '../event-emitter/event-emitter'

type Renderer<Props extends unknown[], UI> = (...props: Props) => UI

interface RenderCycleEvents<Props extends unknown[], UI> extends Events {
  'request-render': Props
  'render-complete': UI
  'destroy-render-cycle': null
}

export const useRenderCycle = <Props extends unknown[], UI> (
  renderer: Renderer<Props, UI>
): EventEmitter<RenderCycleEvents<Props, UI>> => {
  const context = new Context()
  const events = context.getEvents<RenderCycleEvents<Props, UI>>()

  const onRequestRender = (props: Props) => {
    Context.setProps<Props>(context, ...props)

    Context.setIndex(context, 0)
    Context.setCurrent(context)
    const ui = renderer(...props)
    Context.setCurrent(null)
    events.emit('render-complete', ui)
  }

  const onDestroyRenderCycleFirst = () => {
    events.off('request-render', onRequestRender)
    events.off('destroy-render-cycle', onDestroyRenderCycleFirst)
  }

  events.on('request-render', onRequestRender)
  events.on('destroy-render-cycle', onDestroyRenderCycleFirst)

  return events
}

export const useCurrentContext = () => Context.getCurrent()
