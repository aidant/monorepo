import { Context, ContextManager, Hooks } from './hooks/entrypoint.js'

class CustomContext extends Context<{
  rendered: boolean
  'my-custom-event': string
}> {

}

const manager = new ContextManager<CustomContext>()
const { useEffect, useState } = new Hooks(manager)

const renderer = () => {
  const [boolean, setBoolean] = useState(false)
  
  useEffect(() => {
    setTimeout(() => {
      setBoolean(!boolean)
    }, 1000)
  }, [boolean])

  return boolean
}

const context = new CustomContext()
manager.createRenderCycleForContext(renderer, context)
context.on('rendered', console.log)
