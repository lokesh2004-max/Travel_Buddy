import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create a mock client or real client based on environment
const createSupabaseClient = () => {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '') {
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  
  // Return mock client when no credentials
  return {
    auth: {
      signUp: (credentials: any) => Promise.resolve({ 
        data: { user: null }, 
        error: { message: 'Please connect Supabase first' } 
      }),
      signInWithPassword: (credentials: any) => Promise.resolve({ 
        data: { user: null }, 
        error: { message: 'Please connect Supabase first' } 
      }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  }
}

export const supabase = createSupabaseClient()