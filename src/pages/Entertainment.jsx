import { useState, useEffect } from 'react'
import { Tv, Gamepad2, RefreshCw } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

// Tic Tac Toe Component
const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [difficulty, setDifficulty] = useState('beginner') // beginner, medium, advanced

  const calculateWinner = (squares) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a]
    }
    return null
  }

  const winner = calculateWinner(board)
  const isDraw = !winner && board.every(Boolean)

  useEffect(() => {
    if (!xIsNext && !winner && !isDraw) {
      // Computer's turn
      const timer = setTimeout(() => {
        const newBoard = [...board]
        const empty = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null)
        
        const findWinningMove = (player) => {
          const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
          for (let [a,b,c] of lines) {
            if (newBoard[a] === player && newBoard[b] === player && newBoard[c] === null) return c;
            if (newBoard[a] === player && newBoard[c] === player && newBoard[b] === null) return b;
            if (newBoard[b] === player && newBoard[c] === player && newBoard[a] === null) return a;
          }
          return -1;
        }

        let move = -1
        
        if (difficulty === 'beginner') {
          move = empty[Math.floor(Math.random() * empty.length)]
        } else {
          // Medium or Advanced
          if (difficulty === 'medium' && Math.random() < 0.3) {
            move = empty[Math.floor(Math.random() * empty.length)] // 30% chance for random mistake
          } else {
            move = findWinningMove('O') // Try to win
            if (move === -1) move = findWinningMove('X') // Block X
            if (move === -1 && difficulty === 'advanced') {
              if (newBoard[4] === null) move = 4 // Center
              else {
                const corners = [0, 2, 6, 8].filter(i => newBoard[i] === null)
                if (corners.length > 0) move = corners[Math.floor(Math.random() * corners.length)]
                else {
                  const edges = [1, 3, 5, 7].filter(i => newBoard[i] === null)
                  if (edges.length > 0) move = edges[Math.floor(Math.random() * edges.length)]
                }
              }
            }
            if (move === -1) move = empty[Math.floor(Math.random() * empty.length)]
          }
        }
        
        newBoard[move] = 'O'
        setBoard(newBoard)
        setXIsNext(true)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [xIsNext, board, winner, isDraw, difficulty])

  const handleClick = (i) => {
    if (board[i] || winner || !xIsNext) return // Prevent clicking if not X's turn
    const newBoard = [...board]
    newBoard[i] = 'X'
    setBoard(newBoard)
    setXIsNext(false)
  }

  const reset = () => {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 mb-4">
        {['beginner', 'medium', 'advanced'].map((lvl) => (
          <button key={lvl} onClick={() => { setDifficulty(lvl); reset() }}
            className={`px-3 py-1 text-xs font-semibold rounded-full capitalize transition-colors ${difficulty === lvl ? 'bg-[var(--primary)] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
            {lvl}
          </button>
        ))}
      </div>
      <div className="mb-4 text-center h-6">
        {winner ? (
          <p className="font-bold text-lg" style={{ color: winner === 'X' ? 'var(--primary)' : 'var(--error)' }}>
            {winner === 'X' ? 'You Win!' : 'Computer Wins!'}
          </p>
        ) : isDraw ? (
          <p className="font-bold text-lg" style={{ color: 'var(--on-surface-variant)' }}>It's a Draw!</p>
        ) : (
          <p className="font-medium text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {xIsNext ? 'Your Turn (X)' : 'Computer is thinking...'}
          </p>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-200 p-2 rounded-xl">
        {board.map((square, i) => (
          <button key={i} onClick={() => handleClick(i)} disabled={!xIsNext || winner}
            className="w-16 h-16 bg-white rounded-lg text-2xl font-bold flex items-center justify-center transition-colors hover:bg-gray-50 disabled:opacity-90"
            style={{ color: square === 'X' ? 'var(--primary)' : 'var(--error)' }}>
            {square}
          </button>
        ))}
      </div>
      <Button size="sm" variant="outline" onClick={reset} icon={RefreshCw}>Restart Game</Button>
    </div>
  )
}

// Simple Minesweeper-lite (Find the gems, avoid the bomb)
const GemFinder = () => {
  const [board, setBoard] = useState(Array(16).fill({ revealed: false, isBomb: false }))
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [score, setScore] = useState(0)

  const initGame = () => {
    const newBoard = Array(16).fill({ revealed: false, isBomb: false })
    // Place 3 bombs
    let bombsPlaced = 0
    while(bombsPlaced < 3) {
      const idx = Math.floor(Math.random() * 16)
      if (!newBoard[idx].isBomb) {
        newBoard[idx] = { ...newBoard[idx], isBomb: true }
        bombsPlaced++
      }
    }
    setBoard(newBoard)
    setGameOver(false)
    setWon(false)
    setScore(0)
  }

  // init on first render
  useEffect(() => {
    initGame()
  }, [])

  const handleCellClick = (idx) => {
    if (gameOver || board[idx].revealed) return

    const newBoard = [...board]
    newBoard[idx] = { ...newBoard[idx], revealed: true }
    setBoard(newBoard)

    if (newBoard[idx].isBomb) {
      setGameOver(true)
      // reveal all
      setBoard(newBoard.map(c => ({ ...c, revealed: true })))
    } else {
      const newScore = score + 1
      setScore(newScore)
      if (newScore === 13) { // 16 - 3 bombs
        setWon(true)
        setGameOver(true)
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center h-8">
        {gameOver && won ? <p className="font-bold text-green-600">You Won! Flawless.</p> :
         gameOver ? <p className="font-bold text-red-500">Boom! Game Over.</p> :
         <p className="font-medium" style={{ color: 'var(--on-surface)' }}>Score: {score}/13 (Avoid 3 bombs)</p>}
      </div>
      <div className="grid grid-cols-4 gap-2 mb-6 bg-gray-200 p-2 rounded-xl">
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleCellClick(i)} disabled={gameOver}
            className={`w-12 h-12 rounded-lg text-xl flex items-center justify-center transition-all ${cell.revealed ? (cell.isBomb ? 'bg-red-100' : 'bg-green-50') : 'bg-white hover:bg-gray-50'}`}>
            {cell.revealed ? (cell.isBomb ? '💣' : '💎') : ''}
          </button>
        ))}
      </div>
      <Button size="sm" variant="outline" onClick={initGame} icon={RefreshCw}>Restart Game</Button>
    </div>
  )
}

const Entertainment = () => {
  return (
    <div className="max-w-6xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
          <Gamepad2 size={36} style={{ color: 'var(--primary)' }} />
          Cartoons & Games
        </h1>
        <p className="text-lg" style={{ color: 'var(--on-surface-variant)' }}>Take a break. Watch a comforting show or play a relaxing mini-game.</p>
      </div>

      {/* Cartoons Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
          <Tv size={24} style={{ color: 'var(--secondary)' }} />
          Featured Cartoons
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card padding="none" className="overflow-hidden bg-black">
            <div className="h-56 relative w-full">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/t0Q2otsqC4I" 
                title="Featured Cartoon 1" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4" style={{ backgroundColor: 'var(--surface-container-low)' }}>
              <h3 className="text-lg font-bold" style={{ color: 'var(--on-surface)' }}>Mr. Bean - Animated Series</h3>
            </div>
          </Card>
          
          <Card padding="none" className="overflow-hidden bg-black">
            <div className="h-56 relative w-full">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/LSQsNeH2WLc" 
                title="Featured Cartoon 2" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4" style={{ backgroundColor: 'var(--surface-container-low)' }}>
              <h3 className="text-lg font-bold" style={{ color: 'var(--on-surface)' }}>Tom & Jerry - Classic</h3>
            </div>
          </Card>
        </div>
      </section>

      {/* Games Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
          <Gamepad2 size={24} style={{ color: 'var(--primary)' }} />
          Mini Games
        </h2>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game 1: Tic Tac Toe */}
          <Card padding="lg">
            <h3 className="text-lg font-bold mb-6 text-center" style={{ color: 'var(--on-surface)' }}>Tic Tac Toe</h3>
            <TicTacToe />
          </Card>

          {/* Game 2: Gem Finder (Minesweeper Lite) */}
          <Card padding="lg">
            <h3 className="text-lg font-bold mb-6 text-center" style={{ color: 'var(--on-surface)' }}>Gem Finder</h3>
            <GemFinder />
          </Card>

          {/* Game 3: Placeholder for Checkers/Ludo */}
          <Card padding="lg" className="flex flex-col items-center justify-center text-center min-h-[300px]" style={{ backgroundColor: 'var(--surface-container-low)' }}>
            <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--tertiary) 15%, transparent)' }}>
              <Gamepad2 size={32} style={{ color: 'var(--tertiary)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--on-surface)' }}>More Games Coming</h3>
            <p className="text-sm px-4" style={{ color: 'var(--on-surface-variant)' }}>Checkers and Ludo are currently in development for a future update!</p>
          </Card>
        </div>
      </section>

    </div>
  )
}

export default Entertainment
