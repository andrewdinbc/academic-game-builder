'use client'

import Link from 'next/link'
import { useState } from 'react'

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

export default function GameCard({
  game,
  onUpdate,
}: {
  game: Game
  onUpdate: () => void
}) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this game?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/games/${game.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onUpdate()
      } else {
        alert('Failed to delete game')
      }
    } catch (error) {
      alert('Error deleting game')
      console.error(error)
    } finally {
      setDeleting(false)
    }
  }

  const truncateDescription = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + '...' : text
  }

  return (
    <div className="game-card">
      <div className="game-card-header">
        <div className="complexity-badge" style={{ margin: 0 }}>
          {game.complexity}
        </div>
        <div className="game-card-title">{game.title}</div>
        <div className="game-card-subject">
          {game.subject} • Grade {game.gradeLevel}
        </div>
      </div>

      <div className="game-card-body">
        <div className="game-card-description">
          {truncateDescription(game.description, 100)}
        </div>

        <div className="game-card-meta">
          <span>
            {new Date(game.createdAt).toLocaleDateString()}
          </span>
          {game.learningOutcomes && (
            <span>{game.learningOutcomes.length} outcomes</span>
          )}
        </div>

        <div className="game-card-actions">
          <Link href={`/games/${game.id}`} className="btn btn-primary">
            Play
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={deleting}
            style={{
              opacity: deleting ? 0.6 : 1,
              cursor: deleting ? 'not-allowed' : 'pointer',
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
