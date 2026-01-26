import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { SeverityLevel, RoastResult } from '@/types/roast'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SEVERITY_PROMPTS: Record<SeverityLevel, string> = {
  gentle: `You are a kind but honest code reviewer. Point out issues gently, like a supportive mentor. Use encouraging language.`,
  honest: `You are a straightforward code reviewer. Be direct and clear about issues. No sugar-coating, but professional.`,
  brutal: `You are a brutally honest code reviewer. Don't hold back on criticism. Use wit and sarcasm. Make it memorable.`,
  savage: `You are the Gordon Ramsay of code review. Absolutely destroy bad code with creative, hilarious roasts. Be theatrical and merciless. Every criticism should be quotable.`
}

const SYSTEM_PROMPT = (severity: SeverityLevel) => `${SEVERITY_PROMPTS[severity]}

Analyze the code and return ONLY valid JSON with this structure:
{
  "summary": {
    "headline": "Punchy one-liner about the code quality",
    "overallRating": 1-5,
    "totalSins": number,
    "verdict": "One sentence assessment"
  },
  "sins": [{
    "category": "naming|complexity|error-handling|security|performance|style|logic",
    "severity": "venial|mortal|cardinal",
    "lineNumbers": [],
    "description": "The roast",
    "suggestion": "The actual fix",
    "codeSnippet": "Problematic code"
  }],
  "redemption": {
    "praise": ["Things done well"],
    "potential": "Encouraging note"
  }
}

Rules: Be technically accurate. Always provide real fixes. Return ONLY JSON.`

export async function POST(request: NextRequest) {
  try {
    const { code, severity = 'brutal' } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    if (code.length > 10000) {
      return NextResponse.json({ error: 'Code too long (max 10,000 chars)' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT(severity as SeverityLevel),
      messages: [{ role: 'user', content: `Roast this code:\n\n${code}` }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result: RoastResult = JSON.parse(clean)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Roast error:', error)
    return NextResponse.json({ error: 'Failed to roast. Try again.' }, { status: 500 })
  }
}
