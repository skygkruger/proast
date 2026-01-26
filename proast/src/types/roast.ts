export type SeverityLevel = 'gentle' | 'honest' | 'brutal' | 'savage'

export type SinSeverity = 'venial' | 'mortal' | 'cardinal'

export interface CodeSin {
  category: string
  severity: SinSeverity
  lineNumbers: number[]
  description: string  // The roast
  suggestion: string   // The actual fix
  codeSnippet: string
}

export interface RoastResult {
  summary: {
    headline: string
    overallRating: 1 | 2 | 3 | 4 | 5  // 1 = dumpster fire, 5 = actually decent
    totalSins: number
    verdict: string
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
}

export interface RoastRequest {
  code: string
  language?: string
  severity: SeverityLevel
}

export interface SavedRoast {
  id: string
  slug: string
  code: string
  language: string
  severity: SeverityLevel
  result: RoastResult
  isPublic: boolean
  views: number
  createdAt: string
}
