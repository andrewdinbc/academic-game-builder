import { NextRequest, NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'

// In-memory storage (replace with database in production)
let games: any[] = []

const client = new Anthropic()

async function generateGameLogic(formData: any): Promise<string> {
  const prompt = `
You are an educational game designer. Create a brief game logic description for a ${formData.complexity} complexity game.

Game Details:
- Title: ${formData.title}
- Subject: ${formData.subject}
- Grade Level: ${formData.gradeLevel}
- Description: ${formData.description}
- Complexity: ${formData.complexity}

Generate a concise game logic (2-3 sentences) that explains how the game works, what the player does, and how they progress. Make it educational and engaging.
`

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const responseText = message.content[0]
  if (responseText.type === 'text') {
    return responseText.text
  }
  return 'Game logic generated.'
}

async function generateGameRules(formData: any): Promise<string[]> {
  const prompt = `
You are an educational game designer. Create 5 clear, concise game rules for a ${formData.complexity} complexity game.

Game Details:
- Title: ${formData.title}
- Subject: ${formData.subject}
- Description: ${formData.description}
- Complexity: ${formData.complexity}

Generate exactly 5 numbered rules that are:
1. Clear and easy to understand
2. Educational in nature
3. Appropriate for ${formData.gradeLevel} grade level
4. Enforcing good learning practices

Format as a numbered list, one rule per line.
`

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 400,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const responseText = message.content[0]
  if (responseText.type === 'text') {
    const rules = responseText.text
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, ''))
      .filter((line) => line.trim())
    return rules.slice(0, 5)
  }
  return []
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      title,
      subject,
      gradeLevel,
      complexity,
      description,
      learningOutcomes = [],
      curriculumOutcomes = '',
    } = body

    // Validate required fields
    if (!title || !subject || !gradeLevel || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate game logic and rules
    const gameLogic = await generateGameLogic({
      title,
      subject,
      gradeLevel,
      complexity,
      description,
    })

    const gameRules = await generateGameRules({
      title,
      subject,
      gradeLevel,
      complexity,
      description,
    })

    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newGame = {
      id: gameId,
      title,
      subject,
      gradeLevel,
      complexity,
      description,
      learningOutcomes: learningOutcomes || [],
      curriculumOutcomes,
      gameLogic,
      gameRules,
      createdAt: new Date().toISOString(),
    }

    games.push(newGame)

    return NextResponse.json(
      {
        success: true,
        game: newGame,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }
}
