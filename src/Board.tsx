import React, { useState, useCallback } from 'react'
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
const PieceBlock = styled.div<{ dataType: Piece }>`
  width: 100%;
  background-color: ${({ dataType }) => typeToColor[dataType]};

  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`

const getInitialSnake = ({
  width,
  height
}: {
  width: number
  height: number
}) => {
  const headPosition = Math.ceil((width * height) / 2 + width * 0.75)

  return [headPosition, headPosition + 1, headPosition + 2]
}

const getInitialPellet = ({
  width,
  height
}: {
  width: number
  height: number
}) => Math.floor((width * height) / 2 + width * 0.25)

type Props = {
  width: number
  height: number
  direction: Direction
  registerMove: (direction: Direction) => void
}

const isHittingUpperOrLowerBoundary = ({
  nextBlock,
  width,
  height
}: {
  nextBlock: number
  width: number
  height: number
}) => nextBlock < 0 || nextBlock >= width * height

const isHittingLeftOrRightBoundary = ({
  nextBlock,
  width,
  snake: [head]
}: {
  nextBlock: number
  width: number
  snake: number[]
}) =>
  (!(nextBlock % width) && !((head + 1) % width)) ||
  (!((nextBlock + 1) % width) && !(head % width))

const isEatingItself = ({
  snake,
  nextBlock
}: {
  snake: number[]
  nextBlock: number
}) => snake.includes(nextBlock)

export const Board = ({ width, height, direction, registerMove }: Props) => {
  const [board] = useState(generateBoard({ width, height }))
  const [snake, setSnake] = useState(getInitialSnake({ width, height }))
  const [pellet, setPellet] = useState(getInitialPellet({ width, height }))

  const move = useCallback(() => {
    const nextBlock = calculateHeadingToIndex({
      direction,
      snake,
      rowLength: width
    })

    if (
      isHittingUpperOrLowerBoundary({ nextBlock, width, height }) ||
      isHittingLeftOrRightBoundary({ nextBlock, width, snake }) ||
      isEatingItself({ snake, nextBlock })
    ) {
      console.log('GAME OVER!')
      return
    }
    setSnake((snake) => [
      nextBlock,
      ...snake.slice(0, pellet === nextBlock ? snake.length : snake.length - 1)
    ])
    registerMove(direction)
    if (pellet === nextBlock) {
      const possibleNextPellets = [...Array(width * height).keys()].filter(
        (i) => i !== pellet && !snake.includes(i)
      )
      setPellet(
        possibleNextPellets[
          Math.floor(Math.random() * possibleNextPellets.length)
        ]
      )
    }
  }, [direction, snake, pellet, width, height, registerMove])

  useInterval(move, 100)

  return (
    <Container width={width}>
      {board.map((_, i) => (
        <PieceBlock
          key={i}
          dataType={
            i === pellet
              ? Piece.Pellet
              : snake.includes(i)
              ? Piece.Snake
              : Piece.Empty
          }
        />
      ))}
    </Container>
  )
}
