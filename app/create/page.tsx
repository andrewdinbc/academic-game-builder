'use client'

import Navigation from '@/components/Navigation'
import GameBuilder from '@/components/GameBuilder'

export default function CreatePage() {
  return (
    <>
      <Navigation />
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <GameBuilder />
      </div>
    </>
  )
}
