import { Direction } from './types'

export const calculateHeadingToIndex = ({
  direction,
  snake,
  rowLength
}: {
  direction: Direction
  snake: number[]
  rowLength: number
}) => {
  const [head] = snake
  switch (direction) {
    case Direction.Up:
      return head - rowLength
    case Direction.Down:
      return head + rowLength
    case Direction.Right:
      return head + 1
    case Direction.Left:
    default:
      return head - 1
  }
}
