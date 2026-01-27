import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'
import { createCheckoutSession, PRICES } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to upgrade' },
        { status: 401 }
      )
    }

    // Get the user's profile to check if they already have a Stripe customer ID
    const admin = createAdminClient()
    const { data: profile } = await admin
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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await createCheckoutSession({
      customerId: profile?.stripe_customer_id || undefined,
      priceId: PRICES.PRO_MONTHLY,
      userId: user.id,
      successUrl: `${appUrl}/?upgrade=success`,
      cancelUrl: `${appUrl}/?upgrade=cancelled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
