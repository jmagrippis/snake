import { Piece } from './types'

export const generateBoard = ({ width = 32, height = 16 } = {}) => {
  const size = width * height
  return [...Array(size).keys()].map(() => Piece.Empty)
}
