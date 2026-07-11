// lib/game-storage.ts
// Fix for a pre-existing bug: app/api/games/route.ts, create/route.ts, and
// [id]/route.ts each declared their own separate `let games: any[] = []`,
// so a game created via POST /api/games/create was invisible to GET
// /api/games and GET /api/games/[id] (they read different in-memory
// arrays entirely - looked like every created game vanished immediately).
// This centralizes storage into one globalThis-backed singleton, which at
// least makes create/list/fetch/delete internally consistent within a
// single serverless instance. Still ephemeral across cold starts/instances
// per the README's own note ("Storage: In-memory, expandable to database")
// - that's a separate, larger fix (real DB) not attempted here.

export interface StoredGame {
  id: string
  title: string
  subject: string
  gradeLevel: string
  complexity: 'easy' | 'medium' | 'hard'
  description: string
  learningOutcomes: string[]
  curriculumOutcomes: string
  gameLogic: string
  gameRules: string[]
  topicPack: {
    questions: Array<{
      display: string
      answer: string
      wrongs: string[]
      hint?: string
      emoji?: string
    }>
  }
  createdAt: string
}

function getStore(): StoredGame[] {
  const g = globalThis as any
  if (!g.__gameStorage) g.__gameStorage = []
  return g.__gameStorage
}

export function listGames(): StoredGame[] {
  return getStore()
}

export function addGame(game: StoredGame): void {
  getStore().push(game)
}

export function findGame(id: string): StoredGame | undefined {
  return getStore().find((g) => g.id === id)
}

export function deleteGame(id: string): boolean {
  const store = getStore()
  const initialLength = store.length
  const filtered = store.filter((g) => g.id !== id)
  ;(globalThis as any).__gameStorage = filtered
  return filtered.length !== initialLength
}
