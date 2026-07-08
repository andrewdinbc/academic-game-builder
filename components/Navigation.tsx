'use client'

import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-content">
        <Link href="/" className="nav-brand">
          🎮 Academic Game Builder
        </Link>
        <ul className="nav-links">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/games">Games</Link>
          </li>
          <li>
            <Link href="/create">Create</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
