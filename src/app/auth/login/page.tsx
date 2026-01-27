'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the login link!')
    }
    setLoading(false)
  }

  const handleGitHubLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen font-mono text-sm flex items-center justify-center px-4"
      style={{ backgroundColor: '#1a1a2e', color: '#a8b2c3' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-wider" style={{ color: '#eb6f92' }}>
            PROAST
          </Link>
          <p className="mt-2" style={{ color: '#6e6a86' }}>// AUTHENTICATION REQUIRED</p>
        </div>

        {/* Login Box */}
        <div className="border-2 p-8" style={{ borderColor: '#eb6f92' }}>
          <h1 className="text-xl font-bold mb-6 text-center" style={{ color: '#e8e3e3' }}>
            [&gt;] LOGIN
          </h1>

          {error && (
            <div className="mb-4 p-3 border text-sm" style={{ borderColor: '#eb6f92', color: '#eb6f92' }}>
              [!] {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 border text-sm" style={{ borderColor: '#a8d8b9', color: '#a8d8b9' }}>
              [/] {message}
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setMode('password')}
              className="flex-1 py-2 border text-xs transition-all"
              style={{
                borderColor: mode === 'password' ? '#eb6f92' : '#6e6a86',
                color: mode === 'password' ? '#eb6f92' : '#6e6a86',
                backgroundColor: mode === 'password' ? '#eb6f9215' : 'transparent',
              }}
            >
              PASSWORD
            </button>
            <button
              type="button"
              onClick={() => setMode('magic')}
              className="flex-1 py-2 border text-xs transition-all"
              style={{
                borderColor: mode === 'magic' ? '#eb6f92' : '#6e6a86',
                color: mode === 'magic' ? '#eb6f92' : '#6e6a86',
                backgroundColor: mode === 'magic' ? '#eb6f9215' : 'transparent',
              }}
            >
              MAGIC LINK
            </button>
          </div>

          <form onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink}>
            <div className="mb-4">
              <label className="block mb-2 text-xs" style={{ color: '#6e6a86' }}>
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border bg-transparent outline-none"
                style={{ borderColor: '#6e6a86', color: '#e8e3e3' }}
                placeholder="dev@example.com"
              />
            </div>

            {mode === 'password' && (
              <div className="mb-6">
                <label className="block mb-2 text-xs" style={{ color: '#6e6a86' }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border bg-transparent outline-none"
                  style={{ borderColor: '#6e6a86', color: '#e8e3e3' }}
                  placeholder="********"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border-2 font-bold transition-all hover:bg-[#eb6f92] hover:text-[#1a1a2e] disabled:opacity-50"
              style={{ borderColor: '#eb6f92', color: '#eb6f92' }}
            >
              {loading ? '[~] LOADING...' : mode === 'password' ? '[>] LOGIN' : '[>] SEND MAGIC LINK'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
            <span className="text-xs" style={{ color: '#6e6a86' }}>OR</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
          </div>

          {/* GitHub Login */}
          <button
            type="button"
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full py-3 border font-bold transition-all hover:bg-[#6e6a86] hover:text-[#1a1a2e] disabled:opacity-50"
            style={{ borderColor: '#6e6a86', color: '#6e6a86' }}
          >
            [*] CONTINUE WITH GITHUB
          </button>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-xs" style={{ color: '#6e6a86' }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" className="hover:underline" style={{ color: '#eb6f92' }}>
              Sign up
            </Link>
          </p>
        </div>

        {/* Back Link */}
        <p className="mt-6 text-center">
          <Link href="/" className="text-xs hover:underline" style={{ color: '#6e6a86' }}>
            [&lt;] BACK TO HOME
          </Link>
        </p>
      </div>
    </div>
  )
}
