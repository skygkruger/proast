import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createAdminClient, checkRateLimit, incrementUsage, getUserProfile } from '@/lib/supabase'
import type { SeverityLevel } from '@/types/roast'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SEVERITY_PROMPTS: Record<SeverityLevel, string> = {
  gentle: `You are a kind but honest code reviewer. Point out issues gently, like a supportive mentor.`,
  honest: `You are a straightforward code reviewer. Be direct and clear about issues. No sugar-coating.`,
  brutal: `You are a brutally honest code reviewer. Don't hold back on criticism. Use wit and sarcasm.`,
  savage: `You are the Gordon Ramsay of code review. Absolutely destroy bad code with creative, hilarious roasts. Use censored profanity like "What the f*ck?", "This is sh*t", "Are you f*cking kidding me?" for emphasis - asterisks required, never full words. Use sparingly for maximum comedic impact.`
}

// Parse GitHub PR URL
function parsePRUrl(url: string): { owner: string; repo: string; pullNumber: number } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
  if (!match) return null
  return {
    owner: match[1],
    repo: match[2],
    pullNumber: parseInt(match[3], 10)
  }
}

// Fetch PR diff from GitHub API
async function fetchPRDiff(owner: string, repo: string, pullNumber: number, accessToken: string): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3.diff',
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'PRoast-App'
      }
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('PR not found or you do not have access')
    }
    if (response.status === 401) {
      throw new Error('GitHub authentication expired. Please reconnect your account.')
    }
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.text()
}

// Fetch PR metadata
async function fetchPRMetadata(owner: string, repo: string, pullNumber: number, accessToken: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'PRoast-App'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch PR metadata: ${response.status}`)
  }

  return response.json()
}

export async function POST(request: NextRequest) {
  try {
    const { pr_url, severity = 'brutal' } = await request.json()

    // Validate input
    if (!pr_url || typeof pr_url !== 'string') {
      return NextResponse.json({ error: 'PR URL is required' }, { status: 400 })
    }

    const prInfo = parsePRUrl(pr_url)
    if (!prInfo) {
      return NextResponse.json(
        { error: 'Invalid GitHub PR URL. Expected format: https://github.com/owner/repo/pull/123' },
        { status: 400 }
      )
    }

    // Require authentication for GitHub PR roasting
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required for GitHub PR roasting', login_url: '/auth/login' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const profile = await getUserProfile(userId)

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Check for GitHub access token
    if (!profile.github_access_token) {
      return NextResponse.json(
        { error: 'GitHub account not connected', connect_url: '/api/auth/github' },
        { status: 403 }
      )
    }

    // Check savage mode access
    if (severity === 'savage' && profile.plan === 'free') {
      return NextResponse.json(
        { error: 'Savage mode requires Pro subscription', upgrade_url: '/pricing' },
        { status: 403 }
      )
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(userId, profile.plan)
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

    // Fetch PR data from GitHub
    const [diff, metadata] = await Promise.all([
      fetchPRDiff(prInfo.owner, prInfo.repo, prInfo.pullNumber, profile.github_access_token),
      fetchPRMetadata(prInfo.owner, prInfo.repo, prInfo.pullNumber, profile.github_access_token)
    ])

    // Truncate diff if too long
    const truncatedDiff = diff.length > 15000 ? diff.substring(0, 15000) + '\n... (truncated)' : diff

    // Build the prompt
    const systemPrompt = `${SEVERITY_PROMPTS[severity as SeverityLevel]}

You are reviewing a GitHub Pull Request. Analyze the diff and return ONLY valid JSON with this structure:
{
  "summary": {
    "headline": "Punchy one-liner about the PR quality",
    "overallRating": 1-5,
    "totalSins": number,
    "verdict": "One sentence assessment",
    "filesAnalyzed": number
  },
  "sins": [{
    "category": "naming|complexity|error-handling|security|performance|style|logic",
    "severity": "venial|mortal|cardinal",
    "file": "path/to/file.ts",
    "lineNumbers": [],
    "description": "The roast",
    "suggestion": "The actual fix",
    "codeSnippet": "Problematic code"
  }],
  "redemption": {
    "praise": ["Things done well in this PR"],
    "potential": "Encouraging note about the PR"
  },
  "commitMessageRoast": "Brief roast of the PR title/description"
}

Rules: Be technically accurate. Focus on the changes in the diff. Return ONLY JSON.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `PR Title: ${metadata.title}\nPR Description: ${metadata.body || 'No description'}\n\nDiff:\n${truncatedDiff}`
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result = JSON.parse(clean)

    // Increment usage
    await incrementUsage(userId)

    // Save to database
    try {
      const admin = createAdminClient()
      await admin.from('roasts').insert({
        user_id: userId,
        code: truncatedDiff.substring(0, 5000),
        severity: severity as SeverityLevel,
        score: result.summary.overallRating * 20,
        grade: ['F', 'D', 'C', 'B', 'A'][result.summary.overallRating - 1] || 'F',
        headline: result.summary.headline,
        issues: result.sins,
        summary: result.summary.verdict,
        github_pr_url: pr_url,
      })
    } catch {
      // Don't fail if save fails
    }

    return NextResponse.json({
      result,
      pr: {
        title: metadata.title,
        url: pr_url,
        additions: metadata.additions,
        deletions: metadata.deletions,
        changedFiles: metadata.changed_files
      }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('GitHub roast error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
