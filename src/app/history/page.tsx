'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface RoastRecord {
  id: string
  severity: 'gentle' | 'honest' | 'brutal' | 'savage'
  score: number
  grade: string
  headline: string
  summary: string
  github_pr_url: string | null
  created_at: string
}

const severityColors: Record<string, string> = {
  gentle: '#a8d8b9',
  honest: '#ffe9b0',
  brutal: '#f5a97f',
  savage: '#eb6f92',
}

const severityIcons: Record<string, string> = {
  gentle: ':)',
  honest: ':|',
  brutal: '>:(',
  savage: 'X_X',
}

export default function HistoryPage() {
  const [roasts, setRoasts] = useState<RoastRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ total: 0, avgScore: 0, bestScore: 0 })

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchRoasts = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('roasts')
        .select('id, severity, score, grade, headline, summary, github_pr_url, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        setError('Failed to load roast history')
        console.error(error)
      } else if (data) {
        setRoasts(data)

        // Calculate stats
        if (data.length > 0) {
          const scores = data.map(r => r.score)
          setStats({
            total: data.length,
            avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            bestScore: Math.max(...scores),
          })
        }
      }

      setLoading(false)
    }

    fetchRoasts()
  }, [supabase, router])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  return (
    <div
      className="min-h-screen font-mono text-sm leading-relaxed"
      style={{ backgroundColor: '#1a1517', color: '#a8b2c3' }}
    >
      {/* Header */}
      <header className="border-b" style={{ borderColor: '#6e6a86' }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg tracking-tight" style={{ color: '#eb6f92' }}>PROAST</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-xs hover:underline" style={{ color: '#6e6a86' }}>[~] HOME</Link>
              <Link href="/docs" className="text-xs hover:underline" style={{ color: '#6e6a86' }}>[?] DOCS</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#eb6f92' }}>
            [/] ROAST HISTORY
          </h1>
          <p className="text-xs" style={{ color: '#6e6a86' }}>
            // your journey through code criticism
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12" style={{ color: '#6e6a86' }}>
            [~] Loading your roast history...
          </div>
        ) : error ? (
          <div className="p-4 border text-center" style={{ borderColor: '#eb6f92', color: '#eb6f92' }}>
            [!] {error}
          </div>
        ) : roasts.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: '#6e6a86' }}>No roasts yet. Time to get roasted!</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 border-2"
              style={{ borderColor: '#eb6f92', color: '#eb6f92' }}
            >
              [&gt;] GET YOUR FIRST ROAST
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 border text-center" style={{ borderColor: '#6e6a86' }}>
                <p className="text-2xl font-bold" style={{ color: '#eb6f92' }}>{stats.total}</p>
                <p className="text-xs" style={{ color: '#6e6a86' }}>TOTAL ROASTS</p>
              </div>
              <div className="p-4 border text-center" style={{ borderColor: '#6e6a86' }}>
                <p className="text-2xl font-bold" style={{ color: '#ffe9b0' }}>{stats.avgScore}</p>
                <p className="text-xs" style={{ color: '#6e6a86' }}>AVG SCORE</p>
              </div>
              <div className="p-4 border text-center" style={{ borderColor: '#6e6a86' }}>
                <p className="text-2xl font-bold" style={{ color: '#a8d8b9' }}>{stats.bestScore}</p>
                <p className="text-xs" style={{ color: '#6e6a86' }}>BEST SCORE</p>
              </div>
            </div>

            {/* Roast List */}
            <div className="space-y-4">
              {roasts.map((roast) => (
                <div
                  key={roast.id}
                  className="p-4 sm:p-6 border transition-all hover:border-opacity-100"
                  style={{
                    borderColor: severityColors[roast.severity],
                    borderLeftWidth: '4px',
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-lg"
                        style={{ color: severityColors[roast.severity] }}
                      >
                        {severityIcons[roast.severity]}
                      </span>
                      <span
                        className="text-xs px-2 py-1 border"
                        style={{
                          borderColor: severityColors[roast.severity],
                          color: severityColors[roast.severity],
                        }}
                      >
                        {roast.severity.toUpperCase()}
                      </span>
                      {roast.github_pr_url && (
                        <a
                          href={roast.github_pr_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs hover:underline"
                          style={{ color: '#6e6a86' }}
                        >
                          [PR]
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs" style={{ color: '#6e6a86' }}>
                        {formatDate(roast.created_at)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-lg font-bold"
                          style={{
                            color: roast.score >= 80 ? '#a8d8b9' :
                                   roast.score >= 60 ? '#ffe9b0' :
                                   roast.score >= 40 ? '#f5a97f' : '#eb6f92'
                          }}
                        >
                          {roast.score}
                        </span>
                        <span
                          className="text-sm font-bold px-2 py-0.5"
                          style={{
                            backgroundColor: roast.score >= 80 ? '#a8d8b9' :
                                            roast.score >= 60 ? '#ffe9b0' :
                                            roast.score >= 40 ? '#f5a97f' : '#eb6f92',
                            color: '#1a1517',
                          }}
                        >
                          {roast.grade}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="font-bold mb-2" style={{ color: '#e8e3e3' }}>
                    {roast.headline}
                  </p>
                  <p className="text-xs" style={{ color: '#6e6a86' }}>
                    {roast.summary}
                  </p>
                </div>
              ))}
            </div>

            {roasts.length >= 50 && (
              <p className="text-center mt-6 text-xs" style={{ color: '#6e6a86' }}>
                Showing last 50 roasts
              </p>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: '#6e6a86' }}>
        <div className="max-w-5xl mx-auto px-6 text-center text-xs" style={{ color: '#6e6a86' }}>
          <p>ROASTED WITH {'<3'} IN THE TERMINAL</p>
        </div>
      </footer>
    </div>
  )
}
