import { NextRequest, NextResponse } from 'next/server'

// In-memory storage (replace with database in production)
let games: any[] = []

// Note: This is a simplified version. In production, this should be persisted
// We'll use a module-level cache that persists across requests in the same process

let gameStorage: any[] = []

// Override the games array to use persistent storage
if (typeof globalThis !== 'undefined') {
  if (!(globalThis as any).__gameStorage) {
    (globalThis as any).__gameStorage = []
  }
  gameStorage = (globalThis as any).__gameStorage
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id

    // Try to find in global storage first
    let game = gameStorage.find((g) => g.id === gameId)

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      game,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id

    const initialLength = gameStorage.length
    gameStorage = gameStorage.filter((g) => g.id !== gameId)

    if (gameStorage.length === initialLength) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Update global storage
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).__gameStorage = gameStorage
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    )
  }
}
