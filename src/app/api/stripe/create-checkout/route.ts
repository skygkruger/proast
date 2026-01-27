import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createAdminClient, getUserProfile } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { priceId, plan } = await request.json()

    // Determine price ID from plan if not provided
    let selectedPriceId = priceId
    if (!selectedPriceId && plan) {
      if (plan === 'pro') {
        selectedPriceId = process.env.STRIPE_PRICE_PRO_MONTHLY
      } else if (plan === 'team') {
        selectedPriceId = process.env.STRIPE_PRICE_TEAM_MONTHLY
      }
    }

    if (!selectedPriceId) {
      return NextResponse.json({ error: 'Price ID or plan is required' }, { status: 400 })
    }

    // Get authenticated user
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', login_url: '/auth/login' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const userEmail = session.user.email
    const profile = await getUserProfile(userId)

    // Check if user already has an active subscription
    if (profile?.plan !== 'free') {
      return NextResponse.json(
        { error: 'You already have an active subscription', portal_url: '/api/stripe/create-portal' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Check if customer already exists
    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      // Create new customer
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          user_id: userId
        }
      })
      customerId = customer.id

      // Save customer ID to profile
      const admin = createAdminClient()
      await admin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}?checkout=cancelled`,
      subscription_data: {
        metadata: {
          user_id: userId
        }
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Create checkout error:', errorMessage)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
