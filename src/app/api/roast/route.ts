import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { SeverityLevel, RoastResult } from '@/types/roast'
import { createAdminClient, checkRateLimit, incrementUsage, getUserProfile } from '@/lib/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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

// In-memory rate limiting for anonymous users (fallback)
const anonymousRateLimits = new Map<string, { count: number; resetTime: number }>()

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return ip
}

function checkAnonymousRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const limit = 3
  const windowMs = 24 * 60 * 60 * 1000 // 24 hours

  const record = anonymousRateLimits.get(ip)

  if (!record || now > record.resetTime) {
    anonymousRateLimits.set(ip, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: limit - record.count }
}

export async function POST(request: NextRequest) {
  try {
    const { code, severity = 'brutal' } = await request.json()

    // Validate input
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    if (code.length > 10000) {
      return NextResponse.json({ error: 'Code too long (max 10,000 chars)' }, { status: 400 })
    }

    const validSeverities: SeverityLevel[] = ['gentle', 'honest', 'brutal', 'savage']
    if (!validSeverities.includes(severity)) {
      return NextResponse.json({ error: 'Invalid severity level' }, { status: 400 })
    }

    // Try to get authenticated user
    let userId: string | null = null
    let userPlan: 'free' | 'pro' | 'team' = 'free'

    try {
      const supabase = createServerComponentClient({ cookies })
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        userId = session.user.id
        const profile = await getUserProfile(userId)
        if (profile) {
          userPlan = profile.plan
        }
      }
    } catch {
      // Auth failed, continue as anonymous
    }

    // Check savage mode access
    if (severity === 'savage' && userPlan === 'free') {
      return NextResponse.json(
        {
          error: 'Savage mode requires Pro subscription',
          upgrade_url: '/pricing'
        },
        { status: 403 }
      )
    }

    // Rate limiting
    if (userId) {
      // Authenticated user - use database rate limiting
      const rateLimit = await checkRateLimit(userId, userPlan)
      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: `Daily limit reached (${rateLimit.limit} roasts/day). Upgrade for more.`,
            limit: rateLimit.limit,
            remaining: 0,
            upgrade_url: '/pricing'
          },
          { status: 429 }
        )
      }
    } else {
      // Anonymous user - use IP-based rate limiting
      const ip = getClientIP(request)
      const rateLimit = checkAnonymousRateLimit(ip)
      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: 'Daily limit reached (3 roasts/day). Sign up for more.',
            limit: 3,
            remaining: 0,
            signup_url: '/auth/signup'
          },
          { status: 429 }
        )
      }
    }

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT(severity as SeverityLevel),
      messages: [{ role: 'user', content: `Roast this code:\n\n${code}` }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result: RoastResult = JSON.parse(clean)

    // Increment usage counter
    if (userId) {
      await incrementUsage(userId)
    }

    // Save roast to database if authenticated
    if (userId) {
      try {
        const admin = createAdminClient()
        await admin.from('roasts').insert({
          user_id: userId,
          code: code.substring(0, 5000), // Truncate for storage
          severity: severity as SeverityLevel,
          score: result.summary.overallRating * 20,
          grade: ['F', 'D', 'C', 'B', 'A'][result.summary.overallRating - 1] || 'F',
          headline: result.summary.headline,
          issues: result.sins,
          summary: result.summary.verdict,
        })
      } catch {
        // Don't fail the request if save fails
      }
    }

    return NextResponse.json({ result })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Roast error:', errorMessage)
    return NextResponse.json({ error: 'Failed to roast. Try again.' }, { status: 500 })
  }
}
