import { NextRequest, NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'
import { addGame, StoredGame } from '@/lib/game-storage'

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
    messages: [{ role: 'user', content: prompt }],
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
    messages: [{ role: 'user', content: prompt }],
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

// Generates the actual playable content: a schema-driven "topic pack"
// (question/answer/wrongs/hint/emoji) tied to the requested subject, grade
// level, and curriculum outcomes. This is what previously-missing piece —
// gameLogic/gameRules were prose describing a game that never existed;
// this is the real content SchemaGamePlayer (ported from the KidTimer
// extension's engine) actually plays.
async function generateTopicPack(formData: any): Promise<StoredGame['topicPack']> {
  const questionCount = formData.complexity === 'hard' ? 16 : formData.complexity === 'medium' ? 12 : 8

  const prompt = `
You are an educational content designer creating quiz questions for a browser game.

Game Details:
- Subject: ${formData.subject}
- Grade Level: ${formData.gradeLevel}
- Description: ${formData.description}
- Complexity: ${formData.complexity}
- Learning Outcomes: ${(formData.learningOutcomes || []).join('; ') || 'none specified'}
- Curriculum Outcomes: ${formData.curriculumOutcomes || 'none specified'}

Generate exactly ${questionCount} multiple-choice questions testing this content, appropriate for ${formData.gradeLevel} grade level and ${formData.complexity} complexity.

Respond with ONLY a raw JSON array (no markdown fences, no prose before or after) where each item has this exact shape:
{"display": "the question text", "answer": "the correct answer as a short string", "wrongs": ["wrong1", "wrong2", "wrong3"], "hint": "a short kid-friendly hint", "emoji": "one relevant emoji"}

Rules:
- "answer" must never also appear inside "wrongs" (no duplicate options)
- "wrongs" must have exactly 3 plausible-but-incorrect options
- Keep "display" and each option short enough to fit on one line in a game UI
- Vary the questions across the stated learning/curriculum outcomes rather than repeating one idea
`

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const responseText = message.content[0]
  if (responseText.type !== 'text') return { questions: [] }

  try {
    // Strip markdown fences defensively in case the model wraps the JSON anyway.
    const cleaned = responseText.text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '')
    const parsed = JSON.parse(cleaned)
    if (!Array.isArray(parsed)) return { questions: [] }

    // Defensive pass: drop any question where the model still let the
    // answer leak into its own wrongs list, and coerce fields to strings.
    const questions = parsed
      .filter((q: any) => q && q.display && q.answer && Array.isArray(q.wrongs))
      .map((q: any) => ({
        display: String(q.display),
        answer: String(q.answer),
        wrongs: q.wrongs.map((w: any) => String(w)).filter((w: string) => w !== String(q.answer)),
        hint: q.hint ? String(q.hint) : undefined,
        emoji: q.emoji ? String(q.emoji) : undefined,
      }))
      .filter((q: any) => q.wrongs.length >= 2) // need at least 3 total options to be a fair MC question

    return { questions }
  } catch (e) {
    console.error('Failed to parse generated topic pack JSON:', e)
    return { questions: [] }
  }
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

    if (!title || !subject || !gradeLevel || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const formData = { title, subject, gradeLevel, complexity, description, learningOutcomes, curriculumOutcomes }

    // Run all three generations in parallel - they're independent.
    const [gameLogic, gameRules, topicPack] = await Promise.all([
      generateGameLogic(formData),
      generateGameRules(formData),
      generateTopicPack(formData),
    ])

    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newGame: StoredGame = {
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
      topicPack,
      createdAt: new Date().toISOString(),
    }

    addGame(newGame)

    return NextResponse.json({ success: true, game: newGame }, { status: 201 })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 })
  }
}
