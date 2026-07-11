'use client'

import { useState } from 'react'
import SchemaGamePlayer from './SchemaGamePlayer'

interface GameQuestion {
  display: string
  answer: string
  wrongs: string[]
  hint?: string
  emoji?: string
}

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
  topicPack?: { questions: GameQuestion[] }
  createdAt: string
}

export default function GamePlayer({ game }: { game: Game }) {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [finalScore, setFinalScore] = useState({ correct: 0, total: 0 })

  const questions = game.topicPack?.questions || []

  const handleStartGame = () => {
    setGameStarted(true)
    setGameOver(false)
  }

  const handleFinish = (correct: number, total: number) => {
    setFinalScore({ correct, total })
    setGameOver(true)
  }

  const handleReset = () => {
    setGameStarted(false)
    setGameOver(false)
  }

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h2 style={{ color: '#667eea', marginBottom: '24px' }}>Play Game</h2>

      {!gameStarted ? (
        <div style={{ textAlign: 'center' }}>
          {questions.length === 0 ? (
            <p style={{ color: '#e74c3c', marginBottom: '24px', fontSize: '14px' }}>
              This game's question content couldn't be generated. Try creating it again.
            </p>
          ) : (
            <p style={{ color: '#666', marginBottom: '24px', fontSize: '16px' }}>
              Ready to play {game.title}? {questions.length} questions loaded. Click below to begin.
            </p>
          )}
          <button
            onClick={handleStartGame}
            className="btn btn-primary"
            style={{ fontSize: '16px', padding: '12px 32px' }}
            disabled={questions.length === 0}
          >
            Start Game
          </button>
        </div>
      ) : gameOver ? (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#667eea', marginBottom: '16px' }}>Game Over!</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#764ba2', marginBottom: '8px' }}>
            {finalScore.correct} / {finalScore.total} correct
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
        <SchemaGamePlayer
          questions={questions}
          complexity={game.complexity}
          onFinish={handleFinish}
        />
      )}
    </div>
  )
}
