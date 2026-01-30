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

          // Try multiple strategies to find and update the user
          const customerEmail = session.customer_details?.email
          const clientReferenceId = session.client_reference_id // user_id if set during checkout
          const subscriptionMetadata = subscription.metadata?.user_id

          let updated = false

          // Strategy 1: Update by customer ID (if they've purchased before)
          const { data: existingCustomer, error: customerError } = await admin
            .from('profiles')
            .update({
              plan,
              stripe_customer_id: customerId,
              updated_at: new Date().toISOString()
            })
            .eq('stripe_customer_id', customerId)
            .select()
            .single()

          if (existingCustomer && !customerError) {
            updated = true
          }

          // Strategy 2: Update by user_id from metadata
          if (!updated && subscriptionMetadata) {
            const { error } = await admin
              .from('profiles')
              .update({
                plan,
                stripe_customer_id: customerId,
                updated_at: new Date().toISOString()
              })
              .eq('id', subscriptionMetadata)

            if (!error) {
              updated = true
            }
          }

          // Strategy 3: Update by email (fallback)
          if (!updated && customerEmail) {
            const { error } = await admin
              .from('profiles')
              .update({
                plan,
                stripe_customer_id: customerId,
                updated_at: new Date().toISOString()
              })
              .eq('email', customerEmail)

            if (!error) {
              updated = true
            }
          }

          if (!updated) {
            console.error('Failed to update profile after checkout - no matching user found', {
              customerId,
              customerEmail,
              subscriptionMetadata
            })
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

        // Check subscription status - allow grace period for past_due
        // past_due users keep access while Stripe retries payment
        // invoice.payment_failed will downgrade after 3 failed attempts
        const activeStatuses = ['active', 'trialing', 'past_due']
        if (!activeStatuses.includes(subscription.status)) {
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
        const attemptCount = invoice.attempt_count || 0

        console.warn(`Payment failed for customer: ${customerId}, attempt: ${attemptCount}`)

        // After 3 failed attempts, downgrade user to free
        // This prevents continued access with perpetually failing payments
        if (attemptCount >= 3) {
          const { error } = await admin
            .from('profiles')
            .update({
              plan: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_customer_id', customerId)

          if (error) {
            console.error('Failed to downgrade profile after payment failures:', error)
          } else {
            console.log(`Downgraded customer ${customerId} to free after ${attemptCount} failed payment attempts`)
          }
        }
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

