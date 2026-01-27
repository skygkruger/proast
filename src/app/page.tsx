'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { SeverityLevel, RoastResult } from '@/types/roast'
import type { User } from '@supabase/supabase-js'

// ═══════════════════════════════════════════════════════════════
//  PROAST - PASTEL RETRO TERMINAL REDESIGN
//  Primary Accent: Soft Coral (#eb6f92)
// ═══════════════════════════════════════════════════════════════

const severityLevels = [
  { level: 'gentle' as SeverityLevel, label: 'GENTLE', icon: ':)', bar: '░░░░', color: '#a8d8b9', desc: 'kind mentor', pro: false },
  { level: 'honest' as SeverityLevel, label: 'HONEST', icon: ':|', bar: '▒▒░░', color: '#ffe9b0', desc: 'straight shooter', pro: false },
  { level: 'brutal' as SeverityLevel, label: 'BRUTAL', icon: '>:(', bar: '▓▓▒░', color: '#f5a97f', desc: 'no sugar coating', pro: false },
  { level: 'savage' as SeverityLevel, label: 'SAVAGE', icon: 'X_X', bar: '████', color: '#eb6f92', desc: 'gordon ramsay mode', pro: true },
]

// Animated loading component
function LoadingAnimation({ color }: { color: string }) {
  const [frame, setFrame] = useState(0)
  const spinnerFrames = ['◐', '◓', '◑', '◒']

  const loadingSteps = [
    { text: 'Analyzing your code', delay: 0 },
    { text: 'Finding all the sins', delay: 1 },
    { text: 'Preparing brutal honesty', delay: 2 },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % spinnerFrames.length)
    }, 150)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="py-8 space-y-4">
      {loadingSteps.map((step, i) => (
        <div key={i} className="flex items-center gap-4">
          <span
            className="text-lg font-mono transition-all"
            style={{
              color,
              display: 'inline-block',
              animation: 'spin 0.6s linear infinite',
              animationDelay: `${i * 0.2}s`
            }}
          >
            {spinnerFrames[(frame + i) % spinnerFrames.length]}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span style={{ color }}>{step.text}...</span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: `${color}20` }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: color,
                  animation: `loadingBar 2s ease-in-out infinite`,
                  animationDelay: `${step.delay * 0.5}s`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes loadingBar {
          0% { width: 0%; opacity: 0.5; }
          50% { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

export default function PRoastRetro() {
  const [codeInput, setCodeInput] = useState('')
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null)
  const [severityIndex, setSeverityIndex] = useState(0) // Default to GENTLE
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const supabase = createClientComponentClient()

  // Check auth state
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Check URL params for checkout status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') === 'success') {
      setShowSuccessMessage('Welcome to PRO! Savage mode and unlimited roasts are now unlocked.')
      setTimeout(() => setShowSuccessMessage(null), 8000)
      window.history.replaceState({}, '', '/')
    }
    if (params.get('github_connected') === 'true') {
      setShowSuccessMessage('GitHub connected successfully! You can now roast PRs.')
      setTimeout(() => setShowSuccessMessage(null), 5000)
      window.history.replaceState({}, '', '/')
    }
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileMenuOpen])

  const handleSeveritySelect = (index: number) => {
    const selected = severityLevels[index]
    if (selected.pro) {
      // Show upgrade prompt for savage mode
      setShowUpgradeModal(true)
      return
    }
    setSeverityIndex(index)
  }

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

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 403 && data.upgrade_url) {
          setShowUpgradeModal(true)
          throw new Error('Savage mode requires Pro subscription')
        }
        if (response.status === 429) {
          throw new Error(data.error || 'Rate limit reached. Try again tomorrow or upgrade.')
        }
        throw new Error(data.error || 'Failed to roast')
      }
      setRoastResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const copyRoast = async () => {
    if (!roastResult) return
    try {
      await navigator.clipboard.writeText(
        `PRoast: ${roastResult.summary.headline}\n\nRating: ${roastResult.summary.overallRating}/5\nSins: ${roastResult.summary.totalSins}\n\nGet roasted at proast.dev`
      )
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      setError('Failed to copy to clipboard')
    }
  }

  const handleUpgrade = async (plan: 'pro' | 'team' = 'pro') => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/auth/login')
      return
    }

    setCheckoutLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated - redirect to login
          router.push('/auth/login')
          return
        }
        throw new Error(data.error || 'Failed to create checkout')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError('Failed to start checkout. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const generateShareCard = async () => {
    if (!roastResult) return
    setShareLoading(true)

    try {
      const response = await fetch('/api/card/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: roastResult.summary.headline,
          score: roastResult.summary.overallRating * 20,
          grade: ['F', 'D', 'C', 'B', 'A'][roastResult.summary.overallRating - 1] || 'F',
          topSin: roastResult.sins[0]?.description || '',
          severity: severityLevels[severityIndex].level,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate card')
      }

      // Convert the response to a blob and create a download link
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `proast-roast-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to generate share card. This feature requires Pro.')
    } finally {
      setShareLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen font-mono text-sm leading-relaxed"
      style={{
        backgroundColor: '#1a1a2e',
        color: '#a8b2c3'
      }}
    >
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 animate-pulse">
          <div
            className="px-4 sm:px-6 py-3 sm:py-4 border-2 shadow-lg"
            style={{ backgroundColor: '#1a1a2e', borderColor: '#a8d8b9', color: '#a8d8b9' }}
          >
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <span className="text-lg sm:text-xl">✓</span>
              <span className="flex-1">{showSuccessMessage}</span>
              <button
                onClick={() => setShowSuccessMessage(null)}
                className="ml-2 sm:ml-4 hover:opacity-70 text-lg"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className="max-w-md w-full p-6 sm:p-8 border-2"
            style={{ backgroundColor: '#1a1a2e', borderColor: '#eb6f92' }}
          >
            <div className="text-center mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl">X_X</span>
              <h2 className="text-lg sm:text-xl font-bold mt-3 sm:mt-4" style={{ color: '#eb6f92' }}>
                SAVAGE MODE REQUIRES PRO
              </h2>
            </div>
            <p className="text-center mb-4 sm:mb-6 text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>
              Unlock Gordon Ramsay-level roasts, unlimited daily roasts, shareable cards, and roast history.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => handleUpgrade('pro')}
                disabled={checkoutLoading}
                className="block w-full text-center py-2.5 sm:py-3 border-2 font-bold hover:bg-[#eb6f92] hover:text-[#1a1a2e] transition-all disabled:opacity-50 text-sm"
                style={{ borderColor: '#eb6f92', color: '#eb6f92' }}
              >
                {checkoutLoading ? '[~] LOADING...' : '[>] UPGRADE TO PRO - $12/mo'}
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="block w-full text-center py-2.5 sm:py-3 border transition-all text-sm"
                style={{ borderColor: '#6e6a86', color: '#6e6a86' }}
              >
                [x] MAYBE LATER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*                            HEADER                               */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <header className="border-b" style={{ borderColor: '#6e6a86' }}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <span className="tracking-wider font-bold" style={{ color: '#eb6f92' }}>PROAST</span>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-6 text-xs" style={{ color: '#6e6a86' }}>
            <Link href="/docs" className="hover:text-[#eb6f92] transition-colors">[DOCS]</Link>
            <a href="#pricing" className="hover:text-[#eb6f92] transition-colors">[PRICING]</a>
            <a href="https://github.com/skygkruger" target="_blank" rel="noopener noreferrer" className="hover:text-[#eb6f92] transition-colors">[GITHUB]</a>
            <a href="https://x.com/run_veridian" target="_blank" rel="noopener noreferrer" className="hover:text-[#eb6f92] transition-colors">[@]</a>
            {user ? (
              <button onClick={handleLogout} className="hover:text-[#eb6f92] transition-colors">[LOGOUT]</button>
            ) : (
              <Link href="/auth/login" className="hover:text-[#eb6f92] transition-colors">[LOGIN]</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-xs p-2"
            style={{ color: '#6e6a86' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '[X]' : '[=]'}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="sm:hidden border-t px-4 py-4 space-y-3 text-xs"
            style={{ borderColor: '#6e6a86', backgroundColor: '#1a1a2e', color: '#6e6a86' }}
          >
            <Link href="/docs" className="block hover:text-[#eb6f92] transition-colors" onClick={() => setMobileMenuOpen(false)}>[DOCS]</Link>
            <a href="#pricing" className="block hover:text-[#eb6f92] transition-colors" onClick={() => setMobileMenuOpen(false)}>[PRICING]</a>
            <a href="https://github.com/skygkruger" target="_blank" rel="noopener noreferrer" className="block hover:text-[#eb6f92] transition-colors">[GITHUB]</a>
            <a href="https://x.com/run_veridian" target="_blank" rel="noopener noreferrer" className="block hover:text-[#eb6f92] transition-colors">[@]</a>
            {user ? (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block hover:text-[#eb6f92] transition-colors">[LOGOUT]</button>
            ) : (
              <Link href="/auth/login" className="block hover:text-[#eb6f92] transition-colors" onClick={() => setMobileMenuOpen(false)}>[LOGIN]</Link>
            )}
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                          ASCII LOGO                             */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="text-center mb-6 sm:mb-8" style={{ color: '#eb6f92' }}>
          {/* Desktop ASCII Logo */}
          <pre
            className="hidden sm:inline-block"
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
          {/* Mobile Compact Logo */}
          <div className="sm:hidden">
            <div className="text-3xl font-bold tracking-widest mb-1">PROAST</div>
            <div className="text-xs" style={{ color: '#6e6a86' }}>:) · :| · {'>'}:( · X_X</div>
          </div>
          <p className="text-xs tracking-widest mt-2" style={{ color: '#f2cdcd' }}>
            ·:·:· CODE REVIEWER WITH ATTITUDE v1.0 ·:·:·
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                           TAGLINE                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="text-center mb-8 sm:mb-12">
          <p className="text-sm sm:text-base mb-2" style={{ color: '#e8e3e3' }}>
            Get your code roasted. Learn something. Share the shame.
          </p>
          <p className="text-xs" style={{ color: '#6e6a86' }}>
            // brutally honest feedback with adjustable savagery
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                      SEVERITY SELECTOR                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="mb-8 sm:mb-10" style={{ color: '#e8e3e3' }}>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs whitespace-nowrap" style={{ color: '#6e6a86' }}>// SELECT ROAST INTENSITY</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4">
            {severityLevels.map((sev, i) => (
              <button
                key={sev.label}
                onClick={() => handleSeveritySelect(i)}
                className="text-left p-3 sm:p-4 transition-all border relative"
                style={{
                  borderColor: severityIndex === i ? sev.color : '#6e6a86',
                  backgroundColor: severityIndex === i ? `${sev.color}15` : 'transparent',
                  color: severityIndex === i ? sev.color : '#6e6a86'
                }}
              >
                {sev.pro && (
                  <span
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 font-bold"
                    style={{ backgroundColor: '#c4a7e7', color: '#1a1a2e' }}
                  >
                    PRO
                  </span>
                )}
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <span className="hidden sm:inline">{severityIndex === i ? '(*)' : '( )'}</span>
                  <span className="font-bold text-xs sm:text-sm">{sev.label}</span>
                  <span className="hidden sm:inline" style={{ color: sev.color }}>{sev.bar}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-base sm:text-lg">{sev.icon}</span>
                  <span className="text-[10px] sm:text-xs hidden sm:inline" style={{ color: '#6e6a86' }}>// {sev.desc}</span>
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

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4 mb-4">
            <span className="text-xs whitespace-nowrap" style={{ color: '#eb6f92' }}>// PASTE YOUR CODE</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#eb6f92' }}></div>
            <span className="text-xs" style={{ color: '#6e6a86' }}>
              {codeInput.length}/10000
            </span>
          </div>

          <div
            className="p-4 sm:p-6 border transition-colors duration-300"
            style={{ borderColor: severityLevels[severityIndex].color, backgroundColor: '#16161a' }}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="hidden sm:inline" style={{ color: severityLevels[severityIndex].color }}>{'>'}</span>
              <textarea
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.slice(0, 10000))}
                placeholder="paste your code here..."
                rows={8}
                className="flex-1 bg-transparent outline-none resize-none text-xs sm:text-sm"
                style={{
                  color: '#e8e3e3',
                  caretColor: severityLevels[severityIndex].color,
                }}
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                           BUTTONS                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 justify-center mb-8 sm:mb-12">
          <button
            onClick={handleRoast}
            disabled={isLoading || !codeInput.trim()}
            className="px-6 sm:px-8 py-3 sm:py-4 border-2 transition-all hover:translate-y-px disabled:opacity-50 text-sm sm:text-base"
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
            className="px-6 sm:px-8 py-3 sm:py-4 border transition-all hover:translate-y-px text-sm sm:text-base"
            style={{ borderColor: '#6e6a86', color: '#6e6a86' }}
          >
            [x] CLEAR
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 border text-sm" style={{ borderColor: '#eb6f92', color: '#eb6f92' }}>
            <span className="font-bold">[!] ERROR:</span> {error}
            {error.includes('Rate limit') && (
              <a
                href="#pricing"
                className="ml-2 underline hover:no-underline"
              >
                Upgrade to Pro
              </a>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                        ROAST RESULT                             */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        {(roastResult || isLoading) && (
          <div className="mb-8 sm:mb-12 border-2 p-4 sm:p-8" style={{ borderColor: severityLevels[severityIndex].color }}>
            <div className="text-center mb-4 sm:mb-6" style={{ color: severityLevels[severityIndex].color }}>
              <span className="text-base sm:text-lg font-bold">// ROAST RESULTS</span>
            </div>

            {isLoading ? (
              <LoadingAnimation color={severityLevels[severityIndex].color} />
            ) : roastResult && (
              <div className="space-y-6 sm:space-y-8">
                <div className="text-center">
                  <p className="text-base sm:text-xl font-bold mb-2" style={{ color: severityLevels[severityIndex].color }}>
                    {roastResult.summary.headline}
                  </p>
                  <p className="text-xs sm:text-sm mb-4" style={{ color: '#a8b2c3' }}>
                    {roastResult.summary.verdict}
                  </p>
                  <p className="text-xs" style={{ color: '#6e6a86' }}>
                    RATING: {roastResult.summary.overallRating}/5 | SINS: {roastResult.summary.totalSins}
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {roastResult.sins.map((sin, i) => (
                    <div
                      key={i}
                      className="p-3 sm:p-4 border-l-4"
                      style={{
                        borderColor: sin.severity === 'cardinal' ? '#eb6f92' : sin.severity === 'mortal' ? '#f5a97f' : '#ffe9b0',
                        backgroundColor: '#16161a'
                      }}
                    >
                      <p className="font-bold mb-2 text-sm" style={{ color: sin.severity === 'cardinal' ? '#eb6f92' : sin.severity === 'mortal' ? '#f5a97f' : '#ffe9b0' }}>
                        [!] {sin.category.toUpperCase()}
                      </p>
                      <p className="mb-3 text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>{sin.description}</p>
                      {sin.codeSnippet && (
                        <pre className="p-2 sm:p-3 mb-3 text-[10px] sm:text-xs overflow-x-auto" style={{ backgroundColor: '#1a1a2e', color: '#a8b2c3' }}>
                          {sin.codeSnippet}
                        </pre>
                      )}
                      <p className="text-xs sm:text-sm" style={{ color: '#a8d8b9' }}>[/] FIX: {sin.suggestion}</p>
                    </div>
                  ))}
                </div>

                {roastResult.redemption.praise.length > 0 && (
                  <div className="p-3 sm:p-4 border" style={{ borderColor: '#a8d8b9' }}>
                    <p className="font-bold mb-3 text-sm" style={{ color: '#a8d8b9' }}>[/] REDEMPTION</p>
                    {roastResult.redemption.praise.map((p, i) => (
                      <p key={i} className="mb-1 text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>- {p}</p>
                    ))}
                    <p className="mt-3 italic text-xs" style={{ color: '#6e6a86' }}>{roastResult.redemption.potential}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={copyRoast}
                    className="text-xs hover:underline transition-all"
                    style={{ color: copySuccess ? '#a8d8b9' : '#f2cdcd' }}
                  >
                    {copySuccess ? '[✓] COPIED!' : '[:] COPY ROAST'}
                  </button>
                  <button
                    onClick={generateShareCard}
                    disabled={shareLoading}
                    className="text-xs hover:underline transition-all disabled:opacity-50"
                    style={{ color: '#7eb8da' }}
                  >
                    {shareLoading ? '[~] GENERATING...' : '[^] SHARE CARD'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                      SEVERITY EXAMPLES                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4 mb-4 sm:mb-6">
            <span className="text-xs whitespace-nowrap" style={{ color: '#6e6a86' }}>// SEVERITY EXAMPLES</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              { level: ':) GENTLE', text: '"This variable name could be more descriptive for better readability."', color: '#a8d8b9' },
              { level: ':| HONEST', text: '"Naming a variable x in a 200-line function is a code smell."', color: '#ffe9b0' },
              { level: '>:( BRUTAL', text: '"Your variable naming suggests you\'re trying to hide evidence."', color: '#f5a97f' },
              { level: 'X_X SAVAGE', text: '"I\'ve seen better naming conventions in minified JavaScript."', color: '#eb6f92', pro: true },
            ].map((example, i) => (
              <div
                key={i}
                className="p-4 sm:p-6 border relative"
                style={{ borderColor: example.color, color: example.color }}
              >
                {example.pro && (
                  <span
                    className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 font-bold"
                    style={{ backgroundColor: '#c4a7e7', color: '#1a1a2e' }}
                  >
                    PRO
                  </span>
                )}
                <p className="font-bold mb-2 sm:mb-3 text-sm sm:text-base">{example.level}</p>
                <p className="text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>{example.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                          FEATURES                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4 mb-4 sm:mb-6">
            <span className="text-xs" style={{ color: '#6e6a86' }}>// FEATURES</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 border relative" style={{ borderColor: '#eb6f92' }}>
              <span
                className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 font-bold"
                style={{ backgroundColor: '#c4a7e7', color: '#1a1a2e' }}
              >
                PRO
              </span>
              <p className="font-bold mb-2 sm:mb-3 text-sm sm:text-base" style={{ color: '#eb6f92' }}>X_X SAVAGE MODE</p>
              <p className="text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>
                Gordon Ramsay-level feedback for devs who can handle the truth.
              </p>
            </div>

            <div className="p-4 sm:p-6 border" style={{ borderColor: '#a8d8b9' }}>
              <p className="font-bold mb-2 sm:mb-3 text-sm sm:text-base" style={{ color: '#a8d8b9' }}>[/] REAL FIXES</p>
              <p className="text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>
                Every roast includes actionable suggestions to actually fix it.
              </p>
            </div>

            <div className="p-4 sm:p-6 border relative" style={{ borderColor: '#7eb8da' }}>
              <span
                className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 font-bold"
                style={{ backgroundColor: '#c4a7e7', color: '#1a1a2e' }}
              >
                PRO
              </span>
              <p className="font-bold mb-2 sm:mb-3 text-sm sm:text-base" style={{ color: '#7eb8da' }}>[^] SHARE CARDS</p>
              <p className="text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>
                Generate shareable roast cards. Bond with devs through shame.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                          PRICING                                */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div id="pricing" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4 mb-4 sm:mb-6">
            <span className="text-xs" style={{ color: '#6e6a86' }}>// PRICING</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="p-4 sm:p-6 border" style={{ borderColor: '#6e6a86', color: '#a8b2c3' }}>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="px-2 py-1 border text-xs" style={{ borderColor: '#6e6a86' }}>F</span>
                <span className="font-bold">FREE</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">$0<span className="text-sm font-normal">/forever</span></p>
              <div className="space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                <p>[/] 3 roasts/day</p>
                <p>[/] Gentle → Brutal</p>
                <p>[/] Basic feedback</p>
                <p style={{ color: '#6e6a86' }}>[x] Savage mode</p>
                <p style={{ color: '#6e6a86' }}>[x] Share cards</p>
              </div>
              <div className="text-center py-2 border text-xs sm:text-sm" style={{ borderColor: '#6e6a86' }}>
                CURRENT PLAN
              </div>
            </div>

            {/* Pro Tier */}
            <div className="p-4 sm:p-6 border-2" style={{ borderColor: '#eb6f92', color: '#eb6f92' }}>
              <p className="text-xs text-center mb-3 sm:mb-4">* * * NO MERCY MODE * * *</p>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="px-2 py-1 border-2 text-xs font-bold" style={{ borderColor: '#eb6f92' }}>X_X</span>
                <span className="font-bold">PRO</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">$12<span className="text-sm font-normal">/month</span></p>
              <div className="space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>
                <p>[/] 100 roasts/day</p>
                <p>[/] All severity levels</p>
                <p>[/] SAVAGE mode unlocked</p>
                <p>[/] Shareable roast cards</p>
                <p>[/] Roast history</p>
              </div>
              <button
                onClick={() => handleUpgrade('pro')}
                disabled={checkoutLoading}
                className="w-full text-center py-2 sm:py-3 border-2 font-bold hover:bg-[#eb6f92] hover:text-[#1a1a2e] transition-all disabled:opacity-50 text-sm"
                style={{ borderColor: '#eb6f92' }}
              >
                {checkoutLoading ? '[~] LOADING...' : '[>] GET ROASTED'}
              </button>
            </div>

            {/* Team Tier */}
            <div className="p-4 sm:p-6 border-2" style={{ borderColor: '#c4a7e7', color: '#c4a7e7' }}>
              <p className="text-xs text-center mb-3 sm:mb-4">* * * TEAM DESTRUCTION * * *</p>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="px-2 py-1 border-2 text-xs font-bold" style={{ borderColor: '#c4a7e7' }}>{'{}'}</span>
                <span className="font-bold">TEAM</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">$49<span className="text-sm font-normal">/month</span></p>
              <div className="space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>
                <p>[/] Unlimited roasts</p>
                <p>[/] All PRO features</p>
                <p>[/] Up to 10 team members</p>
                <p>[/] Team roast leaderboard</p>
                <p>[/] Priority support</p>
              </div>
              <button
                onClick={() => handleUpgrade('team')}
                disabled={checkoutLoading}
                className="w-full text-center py-2 sm:py-3 border-2 font-bold hover:bg-[#c4a7e7] hover:text-[#1a1a2e] transition-all disabled:opacity-50 text-sm"
                style={{ borderColor: '#c4a7e7' }}
              >
                {checkoutLoading ? '[~] LOADING...' : '[>] TEAM UP'}
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*                       SOCIAL PROOF                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4 mb-4 sm:mb-6">
            <span className="text-xs whitespace-nowrap" style={{ color: '#6e6a86' }}>// OVERHEARD IN THE TERMINAL</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
          </div>

          <div className="space-y-3 sm:space-y-4" style={{ color: '#a8b2c3' }}>
            <div className="p-4 sm:p-6 border" style={{ borderColor: '#6e6a86' }}>
              <p className="text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>
                "My error handling strategy was described as 'hope for the best'."
              </p>
            </div>

            <div className="p-4 sm:p-6 border" style={{ borderColor: '#6e6a86' }}>
              <p className="text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>
                "We now compete for the worst scores in Slack."
              </p>
            </div>

            <div className="p-4 sm:p-6 border" style={{ borderColor: '#6e6a86' }}>
              <p className="text-xs sm:text-sm" style={{ color: '#e8e3e3' }}>
                "Brutal, but the fixes actually worked. 10/10 would get destroyed again."
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*                           FOOTER                                */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <footer className="border-t py-8 sm:py-12" style={{ borderColor: '#6e6a86' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm" style={{ color: '#6e6a86' }}>
          <p className="mb-2">ROASTED WITH {'<3'} IN THE TERMINAL</p>
          <p className="mb-4">(c) 2025 PROAST</p>
          <a href="#pricing" className="text-xs hover:text-[#eb6f92] transition-colors">[PRICING]</a>
        </div>
      </footer>
    </div>
  )
}
