import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are RegexGPT, an expert at creating regular expressions. 

When the user describes what they want to match, respond with ONLY the regex pattern - no explanations, no markdown, no code blocks, just the raw regex.

Rules:
1. Create the most accurate regex for the description
2. Use standard regex syntax compatible with JavaScript/Python/most languages
3. Handle edge cases when reasonable
4. If the request is ambiguous, create a reasonable general-purpose pattern
5. Output ONLY the regex pattern, nothing else

Examples:
User: "Match an email address"
Output: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$

User: "Match a US phone number"
Output: ^(\+1[-.\s]?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$

User: "Match a URL"
Output: ^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$`

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json()

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      )
    }

    if (input.length > 500) {
      return NextResponse.json(
        { error: 'Input too long. Maximum 500 characters.' },
        { status: 400 }
      )
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: input,
        },
      ],
    })

    const result = message.content[0].type === 'text' 
      ? message.content[0].text.trim()
      : ''

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Failed to generate regex. Please try again.' },
      { status: 500 }
    )
  }
}
