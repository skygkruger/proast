'use client'

import { useState } from 'react'
import { Flame, Code, ArrowRight, Copy, Check, Share2 } from 'lucide-react'
import type { SeverityLevel, RoastResult } from '@/types/roast'

const SEVERITY_OPTIONS = [
  { level: 'gentle' as SeverityLevel, label: 'Gentle', emoji: '🌸', color: 'green' },
  { level: 'honest' as SeverityLevel, label: 'Honest', emoji: '😐', color: 'yellow' },
  { level: 'brutal' as SeverityLevel, label: 'Brutal', emoji: '🔥', color: 'orange' },
  { level: 'savage' as SeverityLevel, label: 'Savage', emoji: '💀', color: 'red' },
]

export default function Home() {
  const [code, setCode] = useState('')
  const [severity, setSeverity] = useState<SeverityLevel>('brutal')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RoastResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleRoast = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), severity }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to roast')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyResult = async () => {
    if (!result) return
    await navigator.clipboard.writeText(`🔥 PRoast: ${result.summary.headline}\n\nRating: ${'🔥'.repeat(result.summary.overallRating)}/5\nSins: ${result.summary.totalSins}\n\nGet roasted at proast.dev`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl">PRoast</span>
          </div>
          <a href="#pricing" className="text-sm text-gray-400 hover:text-white">Pricing</a>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 pt-16 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full text-sm mb-6">
          <Flame className="w-4 h-4" /> Brutally Honest Code Review
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Get Your Code <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Roasted</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Choose your pain level. Every roast comes with real fixes.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 mb-6">
        <div className="flex flex-wrap justify-center gap-3">
          {SEVERITY_OPTIONS.map((opt) => (
            <button
              key={opt.level}
              onClick={() => setSeverity(opt.level)}
              className={`px-5 py-2.5 rounded-lg font-medium transition border ${severity === opt.level
                ? opt.color === 'green' ? 'bg-green-500 text-black border-green-500' :
                  opt.color === 'yellow' ? 'bg-yellow-500 text-black border-yellow-500' :
                    opt.color === 'orange' ? 'bg-orange-500 text-black border-orange-500' :
                      'bg-red-500 text-white border-red-500'
                : opt.color === 'green' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                  opt.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                    opt.color === 'orange' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                      'bg-red-500/10 text-red-400 border-red-500/30'
                }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 mb-12">
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste your code here..."
            className="w-full h-64 bg-black/50 border border-[#262626] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 resize-none font-mono text-sm"
          />
          <button
            onClick={handleRoast}
            disabled={loading || !code.trim()}
            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 fire-glow"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Roasting...</>
            ) : (
              <><Flame className="w-5 h-5" /> Roast My Code <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
          {error && <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">{error}</div>}
        </div>
      </section>

      {result && (
        <section className="max-w-3xl mx-auto px-4 mb-20">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{result.summary.headline}</h2>
                <p className="text-gray-400">{result.summary.verdict}</p>
              </div>
              <button onClick={copyResult} className="p-2 hover:bg-white/10 rounded-lg">
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Rating</p>
                <div className="flex">{[1, 2, 3, 4, 5].map(i => (
                  <Flame key={i} className={`w-6 h-6 ${i <= result.summary.overallRating ? 'text-orange-400' : 'text-gray-700'}`} fill={i <= result.summary.overallRating ? 'currentColor' : 'none'} />
                ))}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Sins Found</p>
                <p className="text-3xl font-bold text-orange-400">{result.summary.totalSins}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {result.sins.map((sin, i) => (
              <div key={i} className={`sin-card ${sin.severity} rounded-xl p-5`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${sin.severity === 'cardinal' ? 'bg-red-500/20 text-red-400' :
                    sin.severity === 'mortal' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>{sin.severity.toUpperCase()}</span>
                  <span className="text-sm text-gray-500">{sin.category}</span>
                </div>
                <p className="text-white mb-4">{sin.description}</p>
                {sin.codeSnippet && <pre className="bg-black/50 rounded-lg p-3 mb-4 font-mono text-sm text-gray-300 overflow-x-auto">{sin.codeSnippet}</pre>}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-sm text-green-400"><span className="font-semibold">✨ Fix:</span> {sin.suggestion}</p>
                </div>
              </div>
            ))}
          </div>

          {result.redemption.praise.length > 0 && (
            <div className="mt-8 bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">✓ What You Did Right</h3>
              <ul className="space-y-2">{result.redemption.praise.map((p, i) => <li key={i} className="text-gray-300">• {p}</li>)}</ul>
              <p className="text-gray-400 italic mt-4">{result.redemption.potential}</p>
            </div>
          )}
        </section>
      )}

      <section id="pricing" className="max-w-4xl mx-auto px-4 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <div className="text-4xl font-bold mb-6">$0</div>
            <ul className="space-y-3 mb-8 text-gray-300">
              <li>✓ 3 roasts per day</li>
              <li>✓ Gentle & Honest modes</li>
            </ul>
            <button className="w-full py-3 border border-white/20 rounded-xl font-medium hover:bg-white/5">Get Started</button>
          </div>
          <div className="bg-gradient-to-b from-orange-500/10 to-transparent border border-orange-500/30 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">FULL HEAT</div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-6">$12<span className="text-lg text-gray-400 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8 text-gray-300">
              <li>✓ Unlimited roasts</li>
              <li>✓ All severity modes</li>
              <li>✓ 💀 SAVAGE mode</li>
              <li>✓ API access</li>
            </ul>
            <a
              href="https://buy.stripe.com/8x2eVeaFX3tReimb061VK01"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="font-bold">PRoast</span>
          </div>
          <p className="text-sm text-gray-500">© 2025 PRoast</p>
        </div>
      </footer>
    </main>
  )
}
