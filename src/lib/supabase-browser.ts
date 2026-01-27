import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Singleton pattern to prevent multiple GoTrueClient instances
let supabaseInstance: SupabaseClient | null = null

// Client-side Supabase client (for use in components)
export function createBrowserClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  supabaseInstance = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabaseInstance
}
