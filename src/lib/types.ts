export type SeverityLevel = 'gentle' | 'honest' | 'brutal' | 'savage'
export type SinSeverity = 'venial' | 'mortal' | 'cardinal'
export type SinCategory = 
  | 'naming' | 'complexity' | 'error-handling' | 'security' 
  | 'performance' | 'duplication' | 'style' | 'logic' 
  | 'documentation' | 'architecture'

export interface CodeSin {
  category: SinCategory
  severity: SinSeverity
  lineNumbers: number[]
  description: string
  suggestion: string
  codeSnippet: string
}

export interface RoastResult {
  id: string
  summary: {
    headline: string
    overallRating: 1 | 2 | 3 | 4 | 5
    totalSins: number
    roastQuote: string
  }
  sins: CodeSin[]
  redemption: {
    praise: string[]
    potential: string
  }
  roastCard: {
    headline: string
    topSin: string
    ratingText: string
  }
  metadata: {
    language: string
    linesOfCode: number
    severityLevel: SeverityLevel
    createdAt: string
  }
}

export const SEVERITY_LABELS: Record<SeverityLevel, { label: string; emoji: string; description: string }> = {
  gentle: { label: 'Gentle', emoji: '🌸', description: 'Supportive mentor vibes' },
  honest: { label: 'Honest', emoji: '😐', description: 'Straight talk, no sugar' },
  brutal: { label: 'Brutal', emoji: '🔥', description: 'Cutting but educational' },
  savage: { label: 'Savage', emoji: '💀', description: 'Gordon Ramsay energy' }
}

export const RATING_LABELS: Record<number, { text: string; emoji: string }> = {
  1: { text: 'Dumpster Fire', emoji: '🗑️🔥' },
  2: { text: 'Needs CPR', emoji: '🏥' },
  3: { text: 'Mediocre', emoji: '😐' },
  4: { text: 'Not Bad', emoji: '👍' },
  5: { text: 'Actually Decent', emoji: '✨' },
}
