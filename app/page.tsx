'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="hero">
        <h1>Academic Game Builder</h1>
        <p>Create curriculum-aligned educational games in minutes</p>
        <div>
          <Link href="/games" className="btn btn-primary">
            Browse Games
          </Link>
          <Link href="/create" className="btn btn-secondary">
            Create Game
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Game Creation</h3>
            <p>Build interactive games with AI assistance, tailored to curriculum outcomes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Curriculum Aligned</h3>
            <p>Games are designed to meet specific learning objectives and standards</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Complexity Scaling</h3>
            <p>Automatically adjust game difficulty from beginner to advanced levels</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>AI Powered</h3>
            <p>Leverage Claude AI to generate game logic, rules, and educational content</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Play Instantly</h3>
            <p>Games are playable immediately in your browser—no installation needed</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor student engagement and learning outcomes with built-in analytics</p>
          </div>
        </div>
      </div>
    </>
  )
}
