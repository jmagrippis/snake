import React, { useState } from 'react'
import styled from 'styled-components'

import { generateBoard } from './generateBoard'
import { Piece } from './types'
import { useInterval } from './useInterval'

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

  useInterval(() => {
    setSnake((snake) => [snake[0] - 1, ...snake.slice(0, snake.length - 1)])
  }, 300)

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
