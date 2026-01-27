import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const supabase = createServerSupabaseClient()

    // Exchange the code for a session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/auth/error?message=Could not authenticate', request.url))
    }

    if (session?.user) {
      // Create or update user profile
      const admin = createAdminClient()

      const { data: existingProfile } = await admin
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single()

      if (!existingProfile) {
        // Create new profile for first-time users
        await admin
          .from('profiles')
          .insert({
            id: session.user.id,
            email: session.user.email,
            plan: 'free',
            stripe_customer_id: null,
            stripe_subscription_id: null,
          })
      }
    }

    // Redirect to the intended destination
    return NextResponse.redirect(new URL(next, request.url))
  }

  // No code provided, redirect to home
  return NextResponse.redirect(new URL('/', request.url))
}
