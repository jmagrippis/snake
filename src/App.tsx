import React from 'react'

import { Controller } from './Controller'
import { Board } from './Board'

const App = () => {
  const width = 32
  const height = 16

  return (
    <Controller>
      {({ direction, registerMove }) => (
        <Board
          width={width}
          height={height}
          direction={direction}
          registerMove={registerMove}
        />
      )}
    </Controller>
  )
}

export default App
