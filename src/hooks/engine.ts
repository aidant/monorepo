import { Context } from './context.js'
import { Events, EventEmitter } from '../event-emitter/event-emitter.js'

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
    context.setProps(...props)

    context.getState().index = 0
    Context.setCurrent(context)
    const ui = renderer(...props)
    Context.setCurrent(null)
    events.emit('render-complete', ui)
  }

  const onDestroyRenderCycle = () => {
    events.off('request-render', onRequestRender)
    events.off('destroy-render-cycle', onDestroyRenderCycle)
  }

  events.on('request-render', onRequestRender)
  events.on('destroy-render-cycle', onDestroyRenderCycle)

  return events
}
