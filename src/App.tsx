import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'

import { generateBoard } from './generateBoard'
import { Piece, Direction } from './types'
import { useInterval } from './useInterval'
import { calculateHeadingToIndex } from './calculateHeadingToIndex'

const Container = styled.div<{ width: number }>`
  display: grid;
  grid-template-columns: repeat(${({ width }) => width}, 1fr);
  grid-auto-rows: 1fr;
`

const typeToColor = {
  [Piece.Empty]: '#D0CD94',
  [Piece.Snake]: '#C7EF00',
  [Piece.Pellet]: '#D56F3E',
  [Piece.Obstacle]: '#241623'
}
const PieceBlock = styled.div<{ type: Piece }>`
  width: 100%;
  background-color: ${({ type }) => typeToColor[type]};

  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`

const getInitialSnakeState = ({
  width,
  height
}: {
  width: number
  height: number
}) => {
  const headPosition = Math.ceil((width * height) / 2 + width * 0.75)

  return [headPosition, headPosition + 1, headPosition + 2]
}

const App: React.FC = () => {
  const width = 32
  const height = 16
  const [board] = useState(generateBoard({ width, height }))
  const [snake, setSnake] = useState(getInitialSnakeState({ width, height }))
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

  useInterval(() => {
    const nextBlock = calculateHeadingToIndex({
      direction,
      snake,
      rowLength: width
    })
    setSnake((snake) => [nextBlock, ...snake.slice(0, snake.length - 1)])
    setLastDirection(direction)
  }, 200)

  return (
    <Container width={width}>
      {board.map((_, i) => (
        <PieceBlock
          key={i}
          type={snake.includes(i) ? Piece.Snake : Piece.Empty}
        />
      ))}
    </Container>
  )
}

export default App
