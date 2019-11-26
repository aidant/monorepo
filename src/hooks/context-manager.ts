import { Context, ContextEvents } from './context.js'

type ExtractContextEvents<CE> = CE extends Context<infer CE> ? CE : never

export class ContextManager<
  C extends Context = Context,
  R = (ContextEvents & ExtractContextEvents<C>)['rendered']
> {
  private currentContext: C | null = null

  getCurrentContext (): C {
    if (this.currentContext === null) {
      throw new Error('Invalid call to get current context.')
    }

    return this.currentContext
  }

  setCurrentContext (context: C | null) {
    if (context && this.currentContext !== null) {
      throw new Error('Cannot overwrite current context.')
    }

    this.currentContext = context
  }

  createRenderCycleForContext (renderer: () => R, context: C) {
    context.on('request-re-render', () => {
      context.internalHooksIndex = 0
      this.setCurrentContext(context)
      const rendered = renderer()
      this.setCurrentContext(null)
      context.emit('rendered', rendered)
    })

    context.emit('request-re-render', null)
  }
}
