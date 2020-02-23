import { useRenderCycle } from './hooks/engine'
import { useState, useEffect } from './hooks/hooks'

const render = (message: string) => {
  const [state, setState] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (message === 'hello') setState('world')
  }, [message])

  return `${message} ${state}`
}

const events = useRenderCycle(render)
events.on('render-complete', console.log)

events.emit('request-render', ['goodbye'])
setTimeout(() => events.emit('request-render', ['hello']), 1000)
