'use client'

import { useEffect, useRef, useState } from 'react'
import { SchemaGameEngine, GameQuestion } from '@/lib/schema-engine'

interface SchemaGamePlayerProps {
  questions: GameQuestion[]
  complexity: 'easy' | 'medium' | 'hard'
  onFinish: (correct: number, total: number) => void
}

// Harder complexity = more questions per round, matching Academic Game
// Builder's existing complexity-scaling concept.
const ROUND_LENGTH: Record<string, number> = { easy: 6, medium: 10, hard: 14 }

export default function SchemaGamePlayer({ questions, complexity, onFinish }: SchemaGamePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<SchemaGameEngine | null>(null)
  const [choices, setChoices] = useState<string[]>([])
  const [progress, setProgress] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || questions.length === 0) return
    const canvas = canvasRef.current
    canvas.width = 640
    canvas.height = 380

    const engine = new SchemaGameEngine(canvas, questions, {
      questionsPerRound: ROUND_LENGTH[complexity] || 8,
      onProgress: (correct, total) => {
        setProgress({ correct, total })
        refreshChoices()
      },
      onRoundComplete: (correct, total) => {
        setFinished(true)
        onFinish(correct, total)
      },
    })
    engineRef.current = engine
    engine.start()

    function refreshChoices() {
      setTimeout(() => {
        setChoices(engine.state === 'question' ? engine.getChoiceButtons() : [])
      }, 600)
    }
    refreshChoices()

    return () => {
      engine.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, complexity])

  function handleChoice(choice: string) {
    engineRef.current?.choose(choice)
    setChoices([])
  }

  if (questions.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
        No question content was generated for this game.
      </div>
    )
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: 640, borderRadius: 12, border: '2px solid rgba(102,126,234,.3)', display: 'block', margin: '0 auto' }}
      />
      {!finished && (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          {choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice)}
              className="btn btn-secondary"
              style={{ fontSize: 15, fontWeight: 700, padding: '10px 20px' }}
            >
              {i + 1}. {choice}
            </button>
          ))}
        </div>
      )}
      <p style={{ textAlign: 'center', color: '#999', fontSize: 13, marginTop: 12 }}>
        {progress.correct} correct / {progress.total} answered
      </p>
    </div>
  )
}
