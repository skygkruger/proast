'use client'

import { useState } from 'react'
import type { SeverityLevel, RoastResult } from '@/types/roast'

// ═══════════════════════════════════════════════════════════════
//  PROAST - PASTEL RETRO TERMINAL REDESIGN
//  Primary Accent: Soft Coral (#eb6f92)
// ═══════════════════════════════════════════════════════════════

const severityLevels = [
  { level: 'gentle' as SeverityLevel, label: 'GENTLE', icon: ':)', bar: '░░░░', color: '#a8d8b9', desc: 'kind mentor' },
  { level: 'honest' as SeverityLevel, label: 'HONEST', icon: ':|', bar: '▒▒░░', color: '#ffe9b0', desc: 'straight shooter' },
  { level: 'brutal' as SeverityLevel, label: 'BRUTAL', icon: '>:(', bar: '▓▓▒░', color: '#f5a97f', desc: 'no sugar coating' },
  { level: 'savage' as SeverityLevel, label: 'SAVAGE', icon: 'X_X', bar: '████', color: '#eb6f92', desc: 'gordon ramsay mode' },
]

export default function PRoastRetro() {
  const [codeInput, setCodeInput] = useState('')
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null)
  const [severityIndex, setSeverityIndex] = useState(0) // Default to GENTLE
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRoast = async () => {
    if (!codeInput.trim()) return
    setIsLoading(true)
    setRoastResult(null)
    setError('')

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeInput.trim(),
          severity: severityLevels[severityIndex].level
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to roast')
      setRoastResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const copyRoast = async () => {
    if (!roastResult) return
    await navigator.clipboard.writeText(
      `PRoast: ${roastResult.summary.headline}\n\nRating: ${roastResult.summary.overallRating}/5\nSins: ${roastResult.summary.totalSins}\n\nGet roasted at proast.dev`
    )
  }

  return (
    <div
      className="min-h-screen font-mono text-sm leading-relaxed"
      style={{
        backgroundColor: '#1a1a2e',
        color: '#a8b2c3'
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*                            HEADER                               */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <header className="border-b" style={{ borderColor: '#6e6a86' }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between" style={{ color: '#eb6f92' }}>
            <span className="tracking-wider font-bold">PROAST</span>
            <div className="flex gap-6 text-xs" style={{ color: '#6e6a86' }}>
              <span>[DOCS]</span>
              <a href="#pricing" className="hover:text-[#eb6f92] transition-colors">[PRICING]</a>
              <span>[GITHUB]</span>
              <span>[@]</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                          ASCII LOGO                             */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="text-center mb-8" style={{ color: '#eb6f92' }}>
          <pre
            className="inline-block"
            style={{
              fontSize: '16px',
              lineHeight: 1.05,
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              textAlign: 'left'
            }}
          >
{`
██████╗ ██████╗  ██████╗  █████╗ ███████╗████████╗
██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝╚══██╔══╝
██████╔╝██████╔╝██║   ██║███████║███████╗   ██║
██╔═══╝ ██╔══██╗██║   ██║██╔══██║╚════██║   ██║
██║     ██║  ██║╚██████╔╝██║  ██║███████║   ██║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝
`}
          </pre>
          <p className="text-xs tracking-widest mt-2" style={{ color: '#f2cdcd' }}>
            ·:·:· CODE REVIEWER WITH ATTITUDE v1.0 ·:·:·
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                           TAGLINE                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="text-center mb-12">
          <p className="text-base mb-2" style={{ color: '#e8e3e3' }}>
            Get your code roasted. Learn something. Share the shame.
          </p>
          <p className="text-xs" style={{ color: '#6e6a86' }}>
            // brutally honest feedback with adjustable savagery
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                      SEVERITY SELECTOR                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="mb-10" style={{ color: '#e8e3e3' }}>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs" style={{ color: '#6e6a86' }}>// SELECT ROAST INTENSITY</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {severityLevels.map((sev, i) => (
              <button
                key={sev.label}
                onClick={() => setSeverityIndex(i)}
                className="text-left p-4 transition-all border"
                style={{
                  borderColor: severityIndex === i ? sev.color : '#6e6a86',
                  backgroundColor: severityIndex === i ? `${sev.color}15` : 'transparent',
                  color: severityIndex === i ? sev.color : '#6e6a86'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{severityIndex === i ? '(*)' : '( )'}</span>
                  <span className="font-bold">{sev.label}</span>
                  <span style={{ color: sev.color }}>{sev.bar}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{sev.icon}</span>
                  <span className="text-xs" style={{ color: '#6e6a86' }}>// {sev.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="text-xs" style={{ color: '#6e6a86' }}>
            CURRENT: <span style={{ color: severityLevels[severityIndex].color }}>
              {severityLevels[severityIndex].icon} {severityLevels[severityIndex].label}
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                         CODE INPUT                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs" style={{ color: '#eb6f92' }}>// PASTE YOUR CODE</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#eb6f92' }}></div>
            <span className="text-xs" style={{ color: '#6e6a86' }}>[-][x]</span>
          </div>

          <div
            className="p-6 border"
            style={{ borderColor: '#eb6f92', backgroundColor: '#16161a' }}
          >
            <div className="flex items-start gap-3">
              <span style={{ color: '#f2cdcd' }}>{'>'}</span>
              <textarea
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="paste your code here... we promise not to judge too harshly"
                rows={10}
                className="flex-1 bg-transparent outline-none resize-none text-sm"
                style={{
                  color: '#e8e3e3',
                  caretColor: '#f2cdcd',
                }}
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                           BUTTONS                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="flex flex-wrap gap-6 justify-center mb-12">
          <button
            onClick={handleRoast}
            disabled={isLoading || !codeInput.trim()}
            className="px-8 py-4 border-2 transition-all hover:translate-y-px disabled:opacity-50"
            style={{
              borderColor: severityLevels[severityIndex].color,
              color: severityLevels[severityIndex].color,
              backgroundColor: 'transparent'
            }}
          >
            {isLoading ? '[~] ROASTING...' : '[>] ROAST MY CODE'}
          </button>

          <button
            onClick={() => { setCodeInput(''); setRoastResult(null); setError(''); }}
            className="px-8 py-4 border transition-all hover:translate-y-px"
            style={{ borderColor: '#6e6a86', color: '#6e6a86' }}
          >
            [x] CLEAR
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 border" style={{ borderColor: '#eb6f92', color: '#eb6f92' }}>
            <span className="font-bold">[!] ERROR:</span> {error}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                        ROAST RESULT                             */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        {(roastResult || isLoading) && (
          <div className="mb-12 border-2 p-8" style={{ borderColor: severityLevels[severityIndex].color }}>
            <div className="text-center mb-6" style={{ color: severityLevels[severityIndex].color }}>
              <span className="text-lg font-bold">// ROAST RESULTS</span>
            </div>

            {isLoading ? (
              <div className="text-center py-8" style={{ color: severityLevels[severityIndex].color }}>
                <p>[~] Analyzing your code...</p>
                <p>[~] Finding all the sins...</p>
                <p>[~] Preparing brutal honesty...</p>
              </div>
            ) : roastResult && (
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-xl font-bold mb-2" style={{ color: severityLevels[severityIndex].color }}>
                    {roastResult.summary.headline}
                  </p>
                  <p className="text-sm mb-4" style={{ color: '#a8b2c3' }}>
                    {roastResult.summary.verdict}
                  </p>
                  <p className="text-xs" style={{ color: '#6e6a86' }}>
                    RATING: {roastResult.summary.overallRating}/5 | SINS: {roastResult.summary.totalSins}
                  </p>
                </div>

                <div className="space-y-4">
                  {roastResult.sins.map((sin, i) => (
                    <div
                      key={i}
                      className="p-4 border-l-4"
                      style={{
                        borderColor: sin.severity === 'cardinal' ? '#eb6f92' : sin.severity === 'mortal' ? '#f5a97f' : '#ffe9b0',
                        backgroundColor: '#16161a'
                      }}
                    >
                      <p className="font-bold mb-2" style={{ color: sin.severity === 'cardinal' ? '#eb6f92' : sin.severity === 'mortal' ? '#f5a97f' : '#ffe9b0' }}>
                        [!] {sin.category.toUpperCase()}
                      </p>
                      <p className="mb-3" style={{ color: '#e8e3e3' }}>{sin.description}</p>
                      {sin.codeSnippet && (
                        <pre className="p-3 mb-3 text-xs overflow-x-auto" style={{ backgroundColor: '#1a1a2e', color: '#a8b2c3' }}>
                          {sin.codeSnippet}
                        </pre>
                      )}
                      <p style={{ color: '#a8d8b9' }}>[/] FIX: {sin.suggestion}</p>
                    </div>
                  ))}
                </div>

                {roastResult.redemption.praise.length > 0 && (
                  <div className="p-4 border" style={{ borderColor: '#a8d8b9' }}>
                    <p className="font-bold mb-3" style={{ color: '#a8d8b9' }}>[/] REDEMPTION</p>
                    {roastResult.redemption.praise.map((p, i) => (
                      <p key={i} className="mb-1" style={{ color: '#e8e3e3' }}>- {p}</p>
                    ))}
                    <p className="mt-3 italic text-xs" style={{ color: '#6e6a86' }}>{roastResult.redemption.potential}</p>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <button onClick={copyRoast} className="text-xs hover:underline" style={{ color: '#f2cdcd' }}>
                    [:] COPY ROAST
                  </button>
                  <button className="text-xs hover:underline" style={{ color: '#7eb8da' }}>
                    [^] SHARE CARD
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                      SEVERITY EXAMPLES                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs" style={{ color: '#6e6a86' }}>// SEVERITY EXAMPLES</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { level: ':) GENTLE', text: '"This variable name could be more descriptive for better readability."', color: '#a8d8b9' },
              { level: ':| HONEST', text: '"Naming a variable x in a 200-line function is a code smell."', color: '#ffe9b0' },
              { level: '>:( BRUTAL', text: '"Your variable naming suggests you\'re trying to hide evidence."', color: '#f5a97f' },
              { level: 'X_X SAVAGE', text: '"I\'ve seen better naming conventions in minified JavaScript."', color: '#eb6f92' },
            ].map((example, i) => (
              <div
                key={i}
                className="p-6 border"
                style={{ borderColor: example.color, color: example.color }}
              >
                <p className="font-bold mb-3">{example.level}</p>
                <p className="text-sm" style={{ color: '#e8e3e3' }}>{example.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                          FEATURES                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs" style={{ color: '#6e6a86' }}>// FEATURES</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border" style={{ borderColor: '#eb6f92' }}>
              <p className="font-bold mb-3" style={{ color: '#eb6f92' }}>X_X SAVAGE MODE</p>
              <p className="text-sm" style={{ color: '#e8e3e3' }}>
                Gordon Ramsay-level feedback for devs who can handle the truth.
              </p>
            </div>

            <div className="p-6 border" style={{ borderColor: '#a8d8b9' }}>
              <p className="font-bold mb-3" style={{ color: '#a8d8b9' }}>[/] REAL FIXES</p>
              <p className="text-sm" style={{ color: '#e8e3e3' }}>
                Every roast includes actionable suggestions to actually fix it.
              </p>
            </div>

            <div className="p-6 border" style={{ borderColor: '#7eb8da' }}>
              <p className="font-bold mb-3" style={{ color: '#7eb8da' }}>[^] SHARE CARDS</p>
              <p className="text-sm" style={{ color: '#e8e3e3' }}>
                Generate shareable roast cards. Bond with devs through shame.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                          PRICING                                */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div id="pricing" className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs" style={{ color: '#6e6a86' }}>// PRICING</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 border" style={{ borderColor: '#6e6a86', color: '#a8b2c3' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 border text-xs" style={{ borderColor: '#6e6a86' }}>F</span>
                <span className="font-bold">FREE</span>
              </div>
              <p className="text-2xl font-bold mb-6">$0<span className="text-sm font-normal">/forever</span></p>
              <div className="space-y-2 mb-6 text-sm">
                <p>[/] 3 roasts/day</p>
                <p>[/] Gentle → Brutal</p>
                <p>[/] Basic feedback</p>
                <p style={{ color: '#6e6a86' }}>[x] Savage mode</p>
                <p style={{ color: '#6e6a86' }}>[x] Share cards</p>
              </div>
              <div className="text-center py-2 border" style={{ borderColor: '#6e6a86' }}>
                CURRENT PLAN
              </div>
            </div>

            {/* Pro Tier */}
            <div className="p-8 border-2" style={{ borderColor: '#eb6f92', color: '#eb6f92' }}>
              <p className="text-xs text-center mb-4">* * * NO MERCY MODE * * *</p>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 border-2 text-xs font-bold" style={{ borderColor: '#eb6f92' }}>X_X</span>
                <span className="font-bold">PRO</span>
              </div>
              <p className="text-2xl font-bold mb-6">$12<span className="text-sm font-normal">/month</span></p>
              <div className="space-y-2 mb-6 text-sm" style={{ color: '#e8e3e3' }}>
                <p>[/] Unlimited roasts</p>
                <p>[/] All severity levels</p>
                <p>[/] SAVAGE mode unlocked</p>
                <p>[/] Shareable roast cards</p>
                <p>[/] Roast history</p>
              </div>
              <a
                href="https://buy.stripe.com/8x2eVeaFX3tReimb061VK01"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 border-2 font-bold hover:bg-[#eb6f92] hover:text-[#1a1a2e] transition-all"
                style={{ borderColor: '#eb6f92' }}
              >
                [&gt;] GET ROASTED
              </a>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                       SOCIAL PROOF                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs" style={{ color: '#6e6a86' }}>// DEVELOPER TRAUMA</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
          </div>

          <div className="space-y-4" style={{ color: '#a8b2c3' }}>
            <div className="p-6 border" style={{ borderColor: '#6e6a86' }}>
              <p className="mb-2" style={{ color: '#e8e3e3' }}>
                "PRoast said my error handling strategy was 'hope for the best'. It wasn't wrong."
              </p>
              <p className="text-xs text-right" style={{ color: '#6e6a86' }}>- @dev_anon</p>
            </div>

            <div className="p-6 border" style={{ borderColor: '#6e6a86' }}>
              <p className="mb-2" style={{ color: '#e8e3e3' }}>
                "I showed my coworkers my Savage mode results. Now they're all trying to get worse scores than me."
              </p>
              <p className="text-xs text-right" style={{ color: '#6e6a86' }}>- reddit user</p>
            </div>

            <div className="p-6 border" style={{ borderColor: '#6e6a86' }}>
              <p className="mb-2" style={{ color: '#e8e3e3' }}>
                "The roast was brutal but the fixes were actually helpful. 10/10 would get destroyed again."
              </p>
              <p className="text-xs text-right" style={{ color: '#6e6a86' }}>- HN commenter</p>
            </div>
          </div>
        </div>

      </main>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*                           FOOTER                                */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <footer className="border-t py-12" style={{ borderColor: '#6e6a86' }}>
        <div className="max-w-5xl mx-auto px-6 text-center" style={{ color: '#6e6a86' }}>
          <p className="mb-2">ROASTED WITH {'<3'} IN THE TERMINAL</p>
          <p className="mb-4">(c) 2025 PROAST</p>
          <a href="#pricing" className="text-xs hover:text-[#eb6f92] transition-colors">[PRICING]</a>
        </div>
      </footer>
    </div>
  )
}
