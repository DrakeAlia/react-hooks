// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

// Then, in here, we're managing that current step, initializing it to zero. 
// For our history, that's initialized to an array of arrays.
function Game() {
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'tic-tac-toe:step',
    0,
  )
  const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [
    Array(9).fill(null),
  ])
  // console.log(history)

  // We're managing that and then we get the current squares from which we calculate all of our derive state 
  // and then when a square is selected, we make sure that there is not an element at that current index for our 
  // current squares and there is not already a winner, 
  // based on our current squares.
  const currentSquares = history[currentStep]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return
    }
    // We make a copy of the history from the first index all the way to the current step, 
    // and then we make a copy of our squares and update that next value 
    // and update the squares at that square index to the next value. 
    const newHistory = history.slice(0, currentStep + 1)
    const squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue
    
    // We set our history to a new copy of the history with this new squares copy as the end, 
    // and then set our current step to the last step here.
    setHistory([...newHistory, squaresCopy])
    setCurrentStep(newHistory.length)
  }

  // Then, on restart, we update our history to its initial value of an array with a single element that is an array 
  // of null, and our current step back to zero
  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentStep(0)
  }

  // we added the moves UI which takes the history maps over that.
  // If we are at the current step has some special logic in here for what it should render 
  // if we are the current step, and then if it's clicked, then we update that current step.
  const moves = history.map((stepSquares, step) => {
    // It takes each step, renders out a description for the button, 
    const desc = step === 0 ? 'Go to game start' : `Go to move #${step}`
    // determines whether or not where the current step, 
    const isCurrentStep = step === currentStep
    return (
      // and then renders out an LI with a button in it that's disabled. 
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {desc} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

// We made the board just the squares here and then put the game controls outside of that board.
  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
