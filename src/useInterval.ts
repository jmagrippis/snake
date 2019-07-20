import { useRef, useEffect } from 'react'

type Callback = () => void

export const useInterval = (callback: Callback, timeout: number) => {
  const savedCallback = useRef<Callback>()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current()
    }

    let id = setInterval(tick, timeout)
    return () => clearInterval(id)
  }, [timeout])
}
