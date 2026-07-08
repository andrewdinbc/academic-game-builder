import { NextRequest, NextResponse } from 'next/server'

// In-memory storage (replace with database in production)
let games: any[] = []

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      games: games.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}
