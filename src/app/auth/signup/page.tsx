'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMessage('Check your email to confirm your account!')
    }
  }

  const handleGitHubSignUp = async () => {
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
      className="min-h-screen font-mono text-sm flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: '#1a1a2e', color: '#a8b2c3' }}
    >
      <div className="w-full max-w-md sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-wider" style={{ color: '#eb6f92' }}>
            PROAST
          </Link>
          <p className="mt-2 text-xs sm:text-sm" style={{ color: '#6e6a86' }}>// CREATE YOUR ACCOUNT</p>
        </div>

        {/* Sign Up Box */}
        <div className="border-2 p-5 sm:p-8" style={{ borderColor: '#a8d8b9' }}>
          <h1 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6 text-center" style={{ color: '#e8e3e3' }}>
            [+] SIGN UP
          </h1>

          {error && (
            <div className="mb-4 p-3 border text-sm" style={{ borderColor: '#eb6f92', color: '#eb6f92' }}>
              [!] {error}
            </div>
          )}

          {message ? (
            <div className="text-center">
              <div className="mb-4 p-4 border" style={{ borderColor: '#a8d8b9', color: '#a8d8b9' }}>
                [/] {message}
              </div>
              <p className="text-xs" style={{ color: '#6e6a86' }}>
                Click the link in your email to activate your account.
              </p>
              <Link
                href="/auth/login"
                className="inline-block mt-4 text-sm hover:underline"
                style={{ color: '#eb6f92' }}
              >
                [&gt;] Go to Login
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSignUp}>
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

                <div className="mb-4">
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

                <div className="mb-6">
                  <label className="block mb-2 text-xs" style={{ color: '#6e6a86' }}>
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-3 border bg-transparent outline-none"
                    style={{ borderColor: '#6e6a86', color: '#e8e3e3' }}
                    placeholder="********"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 border-2 font-bold transition-all hover:bg-[#a8d8b9] hover:text-[#1a1a2e] disabled:opacity-50"
                  style={{ borderColor: '#a8d8b9', color: '#a8d8b9' }}
                >
                  {loading ? '[~] CREATING...' : '[+] CREATE ACCOUNT'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
                <span className="text-xs" style={{ color: '#6e6a86' }}>OR</span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#6e6a86' }}></div>
              </div>

              {/* GitHub Sign Up */}
              <button
                type="button"
                onClick={handleGitHubSignUp}
                disabled={loading}
                className="w-full py-3 border font-bold transition-all hover:bg-[#6e6a86] hover:text-[#1a1a2e] disabled:opacity-50"
                style={{ borderColor: '#6e6a86', color: '#6e6a86' }}
              >
                [*] CONTINUE WITH GITHUB
              </button>

              {/* Benefits */}
              <div className="mt-6 p-4 border" style={{ borderColor: '#6e6a86' }}>
                <p className="text-xs mb-2" style={{ color: '#6e6a86' }}>FREE ACCOUNT INCLUDES:</p>
                <ul className="text-xs space-y-1" style={{ color: '#a8b2c3' }}>
                  <li>[/] 3 roasts per day</li>
                  <li>[/] Gentle to Brutal modes</li>
                  <li>[/] Save roast history</li>
                </ul>
              </div>

              {/* Login Link */}
              <p className="mt-6 text-center text-xs" style={{ color: '#6e6a86' }}>
                Already have an account?{' '}
                <Link href="/auth/login" className="hover:underline" style={{ color: '#eb6f92' }}>
                  Login
                </Link>
              </p>
            </>
          )}
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
