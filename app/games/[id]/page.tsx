'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import GamePlayer from '@/components/GamePlayer'

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

export default function GamePage() {
  const params = useParams()
  const gameId = params.id as string
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGame()
  }, [gameId])

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`)
      if (!response.ok) throw new Error('Game not found')
      const data = await response.json()
      setGame(data.game)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="container" style={{ paddingTop: '60px', textAlign: 'center' }}>
          <div className="loading"></div>
        </div>
      </>
    )
  }

  if (error || !game) {
    return (
      <>
        <Navigation />
        <div className="container" style={{ paddingTop: '40px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#e74c3c' }}>{error || 'Game not found'}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="card">
          <h1 style={{ color: '#667eea', marginBottom: '8px' }}>{game.title}</h1>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', fontSize: '14px', color: '#999' }}>
            <span>{game.subject}</span>
            <span>Grade {game.gradeLevel}</span>
            <span className={`complexity-badge ${game.complexity}`}>
              {game.complexity}
            </span>
          </div>

          <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
            {game.description}
          </p>

          {game.learningOutcomes && game.learningOutcomes.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '12px' }}>
                Learning Outcomes
              </h3>
              <ul style={{ color: '#666', paddingLeft: '20px' }}>
                {game.learningOutcomes.map((outcome, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {game.gameRules && game.gameRules.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '12px' }}>Game Rules</h3>
              <ol style={{ color: '#666', paddingLeft: '20px' }}>
                {game.gameRules.map((rule, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    {rule}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <GamePlayer game={game} />
      </div>
    </>
  )
}

