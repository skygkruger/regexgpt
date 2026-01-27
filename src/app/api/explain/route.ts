import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient, checkRateLimit, incrementUsage, createAdminClient } from '@/lib/supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are RegexGPT, an expert at explaining regular expressions in plain English.

When the user provides a regex pattern, explain it clearly and thoroughly:

1. Start with a one-sentence summary of what the regex matches
2. Break down each component of the regex
3. Give examples of strings that WOULD match
4. Give examples of strings that would NOT match
5. Note any potential issues or edge cases

Format your response clearly with sections. Be thorough but concise.

Example:
User: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$

Your response:
**Summary:** This regex matches email addresses.

**Breakdown:**
• \`^\` - Start of string
• \`[a-zA-Z0-9._%+-]+\` - One or more characters: letters, numbers, dots, underscores, percent signs, plus signs, or hyphens (the local part before @)
• \`@\` - Literal @ symbol
• \`[a-zA-Z0-9.-]+\` - One or more letters, numbers, dots, or hyphens (the domain name)
• \`\\.\` - Literal dot
• \`[a-zA-Z]{2,}\` - Two or more letters (the TLD like "com" or "org")
• \`$\` - End of string

**Would match:**
• user@example.com
• john.doe+tag@company.co.uk
• test123@sub.domain.org

**Would NOT match:**
• @missing-local.com
• no-at-sign.com
• user@.com (missing domain)

**Notes:** This is a basic email regex. It doesn't cover all valid email formats per RFC 5322, but works for most common cases.`

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json()

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      )
    }

    if (input.length > 1000) {
      return NextResponse.json(
        { error: 'Regex too long. Maximum 1000 characters.' },
        { status: 400 }
      )
    }

    // Get user if authenticated (optional auth)
    let userId: string | null = null
    try {
      const supabase = createServerSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id || null
    } catch {
      // User not authenticated, continue with anonymous rate limits
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(userId, 'explain')

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: rateLimit.plan === 'free'
            ? 'Daily limit reached (20 explanations). Upgrade to Pro for unlimited access.'
            : 'Daily limit reached. Please try again tomorrow.',
          upgrade: rateLimit.plan === 'free'
        },
        { status: 429 }
      )
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Explain this regex: ${input}`,
        },
      ],
    })

    const result = message.content[0].type === 'text'
      ? message.content[0].text.trim()
      : ''

    // Increment usage after successful explanation
    await incrementUsage(userId, 'explain')

    // Optionally save to history for Pro users
    if (userId && rateLimit.plan === 'pro') {
      try {
        const admin = createAdminClient()
        await admin.from('patterns').insert({
          user_id: userId,
          input,
          pattern: result,
          mode: 'explain',
        })
      } catch (historyError) {
        // Don't fail the request if history save fails
        console.error('Failed to save to history:', historyError)
      }
    }

    return NextResponse.json({
      result,
      remaining: rateLimit.remaining,
      plan: rateLimit.plan
    })
  } catch (error) {
    console.error('Explain error:', error)
    return NextResponse.json(
      { error: 'Failed to explain regex. Please try again.' },
      { status: 500 }
    )
  }
}
