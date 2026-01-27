import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', errorMessage)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription' && session.customer && session.subscription) {
          const customerId = session.customer as string
          const subscriptionId = session.subscription as string

          // Get subscription details to determine plan
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const priceId = subscription.items.data[0]?.price.id

          // Determine plan based on price ID
          let plan: 'pro' | 'team' = 'pro'
          if (priceId === process.env.STRIPE_PRICE_TEAM_MONTHLY) {
            plan = 'team'
          }

          // Find user by customer ID or email
          const customerEmail = session.customer_details?.email

          if (customerEmail) {
            // Update user profile
            const { error } = await admin
              .from('profiles')
              .update({
                plan,
                stripe_customer_id: customerId,
                updated_at: new Date().toISOString()
              })
              .eq('email', customerEmail)

            if (error) {
              console.error('Failed to update profile after checkout:', error)
            }
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const priceId = subscription.items.data[0]?.price.id

        // Determine plan based on price ID
        let plan: 'free' | 'pro' | 'team' = 'pro'
        if (priceId === process.env.STRIPE_PRICE_TEAM_MONTHLY) {
          plan = 'team'
        }

        // Check subscription status
        if (subscription.status !== 'active' && subscription.status !== 'trialing') {
          plan = 'free'
        }

        // Update user profile
        const { error } = await admin
          .from('profiles')
          .update({
            plan,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', customerId)

        if (error) {
          console.error('Failed to update profile on subscription update:', error)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Downgrade to free plan
        const { error } = await admin
          .from('profiles')
          .update({
            plan: 'free',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', customerId)

        if (error) {
          console.error('Failed to downgrade profile on subscription deletion:', error)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Optionally notify user or take action
        console.warn(`Payment failed for customer: ${customerId}`)
        break
      }

      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Webhook handler error:', errorMessage)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

