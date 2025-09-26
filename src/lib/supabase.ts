import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lhrecr161kpxvcj9.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocmVjcjE2MWtweHZjajkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzAzNTAzNCwiZXhwIjoyMDUyNjExMDM0fQ.N1QP0YgBLFqgA9vLNV4e1T5rQKNADLuJQlPHXPJ8p6I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)