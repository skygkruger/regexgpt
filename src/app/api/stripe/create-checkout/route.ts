import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    // Get the access token from Authorization header
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'You must be logged in to upgrade' },
        { status: 401 }
      )
    }

    // Create Supabase client and verify the token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'You must be logged in to upgrade' },
        { status: 401 }
      )
    }

    // Check if price ID is configured
    const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY
    if (!priceId) {
      console.error('STRIPE_PRICE_PRO_MONTHLY not configured')
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 500 }
      )
    }

    // Get the user's profile using admin client
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data: profile } = await adminClient
      .from('profiles')
      .select('stripe_customer_id, plan')
      .eq('id', user.id)
      .single()

    // Don't allow upgrade if already on Pro
    if (profile?.plan === 'pro') {
      return NextResponse.json(
        { error: 'You are already on the Pro plan' },
        { status: 400 }
      )
    }

    // Create checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://regexgpt.io'

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/?upgrade=success`,
      cancel_url: `${appUrl}/?upgrade=cancelled`,
      metadata: {
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
    }

    // If customer already exists, use their ID
    if (profile?.stripe_customer_id) {
      sessionParams.customer = profile.stripe_customer_id
    } else {
      sessionParams.customer_creation = 'always'
      sessionParams.customer_email = user.email
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
