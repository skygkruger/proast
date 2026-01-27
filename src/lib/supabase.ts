import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          plan: 'free' | 'pro' | 'team'
          stripe_customer_id: string | null
          github_access_token: string | null
          team_id: string | null
          roasts_today: number
          last_roast_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          plan?: 'free' | 'pro' | 'team'
          stripe_customer_id?: string | null
          github_access_token?: string | null
          team_id?: string | null
          roasts_today?: number
          last_roast_date?: string | null
        }
        Update: {
          plan?: 'free' | 'pro' | 'team'
          stripe_customer_id?: string | null
          github_access_token?: string | null
          team_id?: string | null
          roasts_today?: number
          last_roast_date?: string | null
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          owner_id: string
          stripe_subscription_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          stripe_subscription_id?: string | null
        }
        Update: {
          name?: string
          stripe_subscription_id?: string | null
        }
      }
      roasts: {
        Row: {
          id: string
          user_id: string
          code: string
          language: string
          severity: 'gentle' | 'honest' | 'brutal' | 'savage'
          score: number
          grade: string
          headline: string
          issues: unknown
          summary: string
          card_url: string | null
          github_pr_url: string | null
          is_public: boolean
          views: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          language?: string
          severity: 'gentle' | 'honest' | 'brutal' | 'savage'
          score: number
          grade: string
          headline: string
          issues: unknown
          summary: string
          card_url?: string | null
          github_pr_url?: string | null
          is_public?: boolean
        }
        Update: {
          card_url?: string | null
          is_public?: boolean
          views?: number
        }
      }
      usage: {
        Row: {
          id: string
          user_id: string
          date: string
          roast_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          roast_count?: number
        }
        Update: {
          roast_count?: number
        }
      }
    }
  }
}

// Server-side admin client (for API routes with service role)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAdminClient(): ReturnType<typeof createClient<any>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Server component client (uses cookies for auth)
export function createServerClient() {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Browser client (for client components)
export function createBrowserClient() {
  return createClientComponentClient<Database>()
}

// Rate limit checker
export async function checkRateLimit(userId: string, plan: 'free' | 'pro' | 'team'): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const limits = {
    free: 3,
    pro: 100,
    team: Infinity
  }

  const limit = limits[plan]

  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, limit: Infinity }
  }

  const admin = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  // Get or create today's usage record
  const { data: usage, error } = await admin
    .from('usage')
    .select('roast_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned, which is fine
    throw error
  }

  const currentCount = usage?.roast_count || 0
  const remaining = Math.max(0, limit - currentCount)

  return {
    allowed: currentCount < limit,
    remaining,
    limit
  }
}

// Increment usage counter
export async function incrementUsage(userId: string): Promise<void> {
  const admin = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  // Upsert usage record
  const { error } = await admin
    .from('usage')
    .upsert(
      {
        user_id: userId,
        date: today,
        roast_count: 1
      },
      {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      }
    )

  if (error) {
    // If upsert failed, try to increment existing
    await admin.rpc('increment_usage', { p_user_id: userId, p_date: today })
  }
}

// Get user profile with plan info
export async function getUserProfile(userId: string) {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return null
  }

  return data
}
