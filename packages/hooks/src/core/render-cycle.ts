import { Context } from './context'

type Renderer<Props extends object, UI> = (props: Readonly<Props>) => UI
type RenderCallback<UI> = (ui: UI) => void

export const useRenderCycle = <Props extends object, UI> (
  renderer: Renderer<Props, UI>,
  callback?: RenderCallback<UI>
) => {
  const context = new Context<Props, UI>()
  const events = context.events
  let renderRequested = true

  if (callback) events.on('rendered', callback)

  const methods = {
    events,
    render (props: Props) {
      context.properties = props
      context.hooksIndex = 0
      renderRequested = false

      Context.appendCurrent(context)
      const ui = renderer(props)
      Context.removeCurrent(context)

      context.isFirstRender = false

      events.emit('rendered', ui)
    },
    destroy () {
      events.off('request-render', onRequestRender)
      events.off('request-destroy', methods.destroy)

      delete this.render
      delete this.destroy
      delete this.events

      events.emit('destroyed')
    }
  }

  const onRequestRender = (props: Props) => {
    if (renderRequested) return
    renderRequested = true
    queueMicrotask(() => methods.render(props))
  }

  events.on('request-render', onRequestRender)
  events.on('request-destroy', methods.destroy)

  return methods
}
