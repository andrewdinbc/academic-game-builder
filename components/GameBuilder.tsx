'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface GameForm {
  title: string
  subject: string
  gradeLevel: string
  complexity: 'easy' | 'medium' | 'hard'
  description: string
  learningOutcomes: string
  curriculumOutcomes: string
}

export default function GameBuilder() {
  const router = useRouter()
  const [form, setForm] = useState<GameForm>({
    title: '',
    subject: '',
    gradeLevel: '',
    complexity: 'medium',
    description: '',
    learningOutcomes: '',
    curriculumOutcomes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate inputs
      if (
        !form.title ||
        !form.subject ||
        !form.gradeLevel ||
        !form.description
      ) {
        throw new Error('Please fill in all required fields')
      }

      const response = await fetch('/api/games/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          subject: form.subject,
          gradeLevel: form.gradeLevel,
          complexity: form.complexity,
          description: form.description,
          learningOutcomes: form.learningOutcomes
            .split('\n')
            .filter((line) => line.trim()),
          curriculumOutcomes: form.curriculumOutcomes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create game')
      }

      const data = await response.json()
      setSuccess(true)

      // Reset form
      setForm({
        title: '',
        subject: '',
        gradeLevel: '',
        complexity: 'medium',
        description: '',
        learningOutcomes: '',
        curriculumOutcomes: '',
      })

      // Redirect to new game
      setTimeout(() => {
        router.push(`/games/${data.game.id}`)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1 style={{ color: '#667eea', marginBottom: '24px' }}>Create New Game</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && (
        <div className="alert alert-success">
          Game created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="input-group">
            <label htmlFor="title">Game Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Fraction Quest"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="subject">Subject *</label>
            <select
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English Language Arts">English Language Arts</option>
              <option value="Science">Science</option>
              <option value="Social Studies">Social Studies</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Physical Education">Physical Education</option>
              <option value="Arts">Arts</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label htmlFor="gradeLevel">Grade Level *</label>
            <select
              id="gradeLevel"
              name="gradeLevel"
              value={form.gradeLevel}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Grade</option>
              <option value="K">Kindergarten</option>
              <option value="1">Grade 1</option>
              <option value="2">Grade 2</option>
              <option value="3">Grade 3</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="complexity">Complexity Level *</label>
            <select
              id="complexity"
              name="complexity"
              value={form.complexity}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="description">Game Description *</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the game concept, mechanics, and educational purpose..."
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="learningOutcomes">
            Learning Outcomes (one per line)
          </label>
          <textarea
            id="learningOutcomes"
            name="learningOutcomes"
            value={form.learningOutcomes}
            onChange={handleChange}
            placeholder="Students will be able to...&#10;- Outcome 1&#10;- Outcome 2&#10;- Outcome 3"
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="curriculumOutcomes">
            Curriculum Outcomes / Standards
          </label>
          <textarea
            id="curriculumOutcomes"
            name="curriculumOutcomes"
            value={form.curriculumOutcomes}
            onChange={handleChange}
            placeholder="e.g., BC Curriculum Outcome: Number and Operations"
            disabled={loading}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <>
                <span className="loading"></span> Creating...
              </>
            ) : (
              'Create Game'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
