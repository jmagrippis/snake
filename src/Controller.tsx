import { useState, useEffect, useCallback, ReactElement } from 'react'

import { Direction } from './types'

type Props = {
  children: (args: {
    direction: Direction
    registerMove: (direction: Direction) => void
  }) => ReactElement
}

export const Controller = ({ children }: Props) => {
  const [direction, setDirection] = useState(Direction.Left)
  const [lastDirection, setLastDirection] = useState(Direction.Right)

  const handleKeydown = useCallback(
    ({ key }: KeyboardEvent) => {
      switch (key) {
        case 'ArrowUp':
        case 'w':
          if (lastDirection !== Direction.Down) {
            setDirection(Direction.Up)
          }
          break
        case 'ArrowDown':
        case 's':
          if (lastDirection !== Direction.Up) {
            setDirection(Direction.Down)
          }
          break
        case 'ArrowLeft':
        case 'a':
          if (lastDirection !== Direction.Right) {
            setDirection(Direction.Left)
          }
          break
        case 'ArrowRight':
        case 'd':
          if (lastDirection !== Direction.Left) {
            setDirection(Direction.Right)
          }
          break
      }
    },
    [lastDirection]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])

  return children({ direction, registerMove: setLastDirection })
}
