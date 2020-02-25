import { useState, useEffect, useRenderCycle } from './src/hooks'

const render = (message: string) => {
  const [state, setState] = useState('hello')

  useEffect(() => {
    console.log('called')
    let timeout: NodeJS.Timeout
    if (state === 'hello') timeout = setTimeout(() => setState('world'), 5000)
    if (state === 'world') timeout = setTimeout(() => setState('hello'), 5000)
    return () => {
      clearTimeout(timeout)
      console.log('cleanup')
    }
  }, [])

  console.log('render')
  return `${message} ${state}`
}

const events = useRenderCycle(render)
events.on('render-complete', console.log)

events.emit('request-render', ['hello'])
setTimeout(() => {
  events.emit('destroy-render-cycle', null)
}, 15000)
