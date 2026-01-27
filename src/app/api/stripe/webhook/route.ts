import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Admin client to bypass RLS
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        console.log('Checkout completed:', { userId, customerId, subscriptionId })

        if (userId && customerId) {
          // Check if profile exists
          const { data: existingProfile } = await admin
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single()

          if (existingProfile) {
            // Update existing profile
            const { error: updateError } = await admin
              .from('profiles')
              .update({
                plan: 'pro',
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId || null,
                updated_at: new Date().toISOString(),
              })
              .eq('id', userId)

            if (updateError) {
              console.error('Error updating profile:', updateError)
            } else {
              console.log(`User ${userId} upgraded to Pro plan`)
            }
          } else {
            // Create new profile with Pro plan
            const { error: insertError } = await admin
              .from('profiles')
              .insert({
                id: userId,
                email: session.customer_email || null,
                plan: 'pro',
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId || null,
              })

            if (insertError) {
              console.error('Error creating profile:', insertError)
            } else {
              console.log(`Created Pro profile for user ${userId}`)
            }
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await admin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          const isActive = ['active', 'trialing'].includes(subscription.status)

          await admin
            .from('profiles')
            .update({
              plan: isActive ? 'pro' : 'free',
              stripe_subscription_id: subscription.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id)

          console.log(`User ${profile.id} subscription updated: ${subscription.status}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await admin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await admin
            .from('profiles')
            .update({
              plan: 'free',
              stripe_subscription_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id)

          console.log(`User ${profile.id} downgraded to free`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
