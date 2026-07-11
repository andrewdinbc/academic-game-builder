import { NextRequest, NextResponse } from 'next/server'
import { findGame, deleteGame } from '@/lib/game-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = findGame(params.id)
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, game })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deleteGame(params.id)
    if (!deleted) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 })
  }
}
