import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null
let isClientSide = false

// Check if we're on the client side
if (typeof window !== 'undefined') {
  isClientSide = true
}

function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if Supabase is properly configured
  const isConfigured = supabaseUrl && 
                      supabaseAnonKey && 
                      !supabaseUrl.includes('placeholder') &&
                      !supabaseAnonKey.includes('placeholder') &&
                      supabaseUrl.startsWith('https://') &&
                      supabaseUrl !== 'https://placeholder.supabase.co'

  if (!isConfigured) {
    // If not configured, create a client that will fail gracefully
    // Only create placeholder client during build time (SSR)
    if (!isClientSide) {
      supabaseClient = createClient(
        'https://placeholder.supabase.co',
        'placeholder-key-for-build'
      )
      return supabaseClient
    } else {
      // On client side, throw error to alert developer
      console.warn('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
      // Create a client with placeholder values, but it will fail on API calls
      supabaseClient = createClient(
        'https://placeholder.supabase.co',
        'placeholder-key-for-build'
      )
      return supabaseClient
    }
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// Helper to check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder') &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl !== 'https://placeholder.supabase.co'
  )
}

// Create a no-op auth object for when Supabase is not configured
function createNoOpAuth() {
  const noOpUnsubscribe = () => {}
  return {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (_callback: any) => ({ 
      data: { subscription: { unsubscribe: noOpUnsubscribe } } 
    }),
    signInWithPassword: () => Promise.resolve({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase not configured' } as any 
    }),
    signUp: () => Promise.resolve({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase not configured' } as any 
    }),
    signOut: () => Promise.resolve({ error: null }),
    // Add other commonly used auth methods as no-ops
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  }
}

// Lazy initialization: only create client when accessed
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    // If accessing auth and Supabase is not configured, return a no-op auth object
    // This prevents network requests that would fail with "Failed to fetch"
    if (prop === 'auth' && !isSupabaseConfigured()) {
      return createNoOpAuth()
    }
    
    const client = getSupabaseClient()
    const value = client[prop as keyof SupabaseClient]
    // Handle methods that need to be bound to the client
    return typeof value === 'function' ? value.bind(client) : value
  }
})
