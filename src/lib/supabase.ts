import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Types for our database
export interface Profile {
  id: string
  email: string
  plan: 'free' | 'pro'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface Usage {
  id: string
  user_id: string
  date: string
  generation_count: number
  explanation_count: number
}

export interface Pattern {
  id: string
  user_id: string
  input: string
  pattern: string
  mode: 'generate' | 'explain'
  created_at: string
}

// Server-side Supabase client (for use in API routes and server components)
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}

// Admin client with service role key (for server-side operations that bypass RLS)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Rate limiting constants
export const RATE_LIMITS = {
  free: {
    daily_generations: 10,
    daily_explanations: 20
  },
  pro: {
    daily_generations: 1000,
    daily_explanations: 2000
  }
}

// Check if user has reached their rate limit
export async function checkRateLimit(
  userId: string | null,
  mode: 'generate' | 'explain'
): Promise<{ allowed: boolean; remaining: number; plan: 'free' | 'pro'; requiresAuth?: boolean }> {
  const admin = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  // Anonymous users must sign in to use the API
  if (!userId) {
    return {
      allowed: false,
      remaining: 0,
      plan: 'free',
      requiresAuth: true
    }
  }

  // Get user's plan
  const { data: profile } = await admin
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single()

  const plan = profile?.plan || 'free'
  const limits = RATE_LIMITS[plan as 'free' | 'pro']
  const limitField = mode === 'generate' ? 'daily_generations' : 'daily_explanations'
  const countField = mode === 'generate' ? 'generation_count' : 'explanation_count'

  // Get or create today's usage record
  const { data: usage, error } = await admin
    .from('usage')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (error && error.code !== 'PGRST116') {
    // Real error, not just "not found"
    console.error('Error checking rate limit:', error)
    return { allowed: true, remaining: 0, plan: plan as 'free' | 'pro' }
  }

  const currentCount = usage ? usage[countField] : 0
  const limit = limits[limitField]

  if (currentCount >= limit) {
    return { allowed: false, remaining: 0, plan: plan as 'free' | 'pro' }
  }

  return {
    allowed: true,
    remaining: limit - currentCount - 1,
    plan: plan as 'free' | 'pro'
  }
}

// Increment usage count
export async function incrementUsage(
  userId: string | null,
  mode: 'generate' | 'explain'
): Promise<void> {
  if (!userId) return

  const admin = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  // Try to update existing record
  const { data: existing } = await admin
    .from('usage')
    .select('id, generation_count, explanation_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (existing) {
    // Increment the appropriate count
    const updateData = mode === 'generate'
      ? { generation_count: (existing.generation_count || 0) + 1 }
      : { explanation_count: (existing.explanation_count || 0) + 1 }

    await admin
      .from('usage')
      .update(updateData)
      .eq('id', existing.id)
  } else {
    // Create new record for today
    await admin
      .from('usage')
      .insert({
        user_id: userId,
        date: today,
        generation_count: mode === 'generate' ? 1 : 0,
        explanation_count: mode === 'explain' ? 1 : 0
      })
  }
}
