import { NextRequest, NextResponse } from 'next/server'
import { listGames } from '@/lib/game-storage'

export async function GET(request: NextRequest) {
  try {
    const games = listGames()
    return NextResponse.json({
      success: true,
      games: [...games].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 })
  }
}
