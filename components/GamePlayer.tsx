'use client'

import { useState } from 'react'

interface Game {
  id: string
  title: string
  subject: string
  gradeLevel: string
  complexity: 'easy' | 'medium' | 'hard'
  description: string
  learningOutcomes: string[]
  gameLogic: string
  gameRules: string[]
  createdAt: string
}

export default function GamePlayer({ game }: { game: Game }) {
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const handleStartGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
  }

  const handleAddPoints = (points: number) => {
    setScore((prev) => prev + points)
  }

  const handleEndGame = () => {
    setGameOver(true)
  }

  const handleReset = () => {
    setGameStarted(false)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h2 style={{ color: '#667eea', marginBottom: '24px' }}>Play Game</h2>

      {!gameStarted ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '24px', fontSize: '16px' }}>
            Ready to play {game.title}? Click below to begin.
          </p>
          <button
            onClick={handleStartGame}
            className="btn btn-primary"
            style={{ fontSize: '16px', padding: '12px 32px' }}
          >
            Start Game
          </button>
        </div>
      ) : gameOver ? (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#667eea', marginBottom: '16px' }}>Game Over!</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#764ba2', marginBottom: '24px' }}>
            Final Score: {score}
          </p>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Great job! You completed {game.title}.
          </p>
          <button
            onClick={handleReset}
            className="btn btn-primary"
            style={{ fontSize: '16px', padding: '12px 32px' }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <div>
          <div
            style={{
              background: '#f5f5f5',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <p style={{ fontSize: '12px', color: '#999' }}>Current Score</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>
                {score}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', color: '#999' }}>Level</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#764ba2' }}>
                {game.complexity.charAt(0).toUpperCase() + game.complexity.slice(1)}
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '40px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '24px',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p style={{ fontSize: '18px', marginBottom: '16px' }}>
              Game Content Area
            </p>
            <p style={{ opacity: 0.9, marginBottom: '24px' }}>
              Click buttons below to interact with the game
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleAddPoints(10)}
                className="btn btn-secondary"
              >
                +10 Points
              </button>
              <button
                onClick={() => handleAddPoints(50)}
                className="btn btn-secondary"
              >
                +50 Points
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={handleReset}
              className="btn btn-secondary"
              style={{ opacity: 0.7 }}
            >
              Reset
            </button>
            <button onClick={handleEndGame} className="btn btn-primary">
              Finish Game
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
