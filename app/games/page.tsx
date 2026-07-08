'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import GameCard from '@/components/GameCard'

interface Game {
  id: string
  title: string
  subject: string
  gradeLevel: string
  complexity: 'easy' | 'medium' | 'hard'
  description: string
  learningOutcomes: string[]
  createdAt: string
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games')
      const data = await response.json()
      setGames(data.games || [])
    } catch (error) {
      console.error('Failed to fetch games:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGames = games.filter(
    game => filter === 'all' || game.complexity === filter
  )

  return (
    <>
      <Navigation />
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="card">
          <h1 style={{ marginBottom: '24px', color: '#667eea' }}>
            Available Games
          </h1>

          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
            {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`btn ${filter === level ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  textTransform: 'capitalize',
                  opacity: filter === level ? 1 : 0.7,
                }}
              >
                {level}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="loading"></div>
            </div>
          ) : filteredGames.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
              <p>No games found. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} onUpdate={fetchGames} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
