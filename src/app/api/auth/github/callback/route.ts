import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(`${appUrl}?error=github_oauth_${error}`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}?error=missing_oauth_params`)
  }

  // Validate state
  const cookieStore = cookies()
  const storedState = cookieStore.get('github_oauth_state')?.value

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${appUrl}?error=invalid_oauth_state`)
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${appUrl}/api/auth/github/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error('GitHub token error:', tokenData.error_description)
      return NextResponse.redirect(`${appUrl}?error=github_token_error`)
    }

    const accessToken = tokenData.access_token

    // Get authenticated user
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      // User not logged in - store token temporarily and redirect to login
      const response = NextResponse.redirect(`${appUrl}/auth/login?github_connect=true`)
      response.cookies.set('pending_github_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10, // 10 minutes
        path: '/'
      })
      return response
    }

    // Save GitHub access token to user profile
    const admin = createAdminClient()
    const { error: updateError } = await admin
      .from('profiles')
      .update({
        github_access_token: accessToken,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id)

    if (updateError) {
      console.error('Failed to save GitHub token:', updateError)
      return NextResponse.redirect(`${appUrl}?error=failed_to_save_token`)
    }

    // Clear the state cookie and redirect to success
    const response = NextResponse.redirect(`${appUrl}?github_connected=true`)
    response.cookies.delete('github_oauth_state')

    return response
  } catch (err) {
    console.error('GitHub OAuth callback error:', err)
    return NextResponse.redirect(`${appUrl}?error=oauth_callback_failed`)
  }
}
