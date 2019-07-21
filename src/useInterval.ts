import { useRef, useEffect } from 'react'

type Callback = () => void

export const useInterval = (callback: Callback, timeout: number) => {
  const savedCallback = useRef<Callback>(callback)

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }

    const id = setInterval(tick, timeout)
    return () => clearInterval(id)
  }, [timeout])
}
