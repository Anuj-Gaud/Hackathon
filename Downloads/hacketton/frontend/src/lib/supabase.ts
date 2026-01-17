import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://textjheeqfwmrzjtfdyo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleHRqaGVlcWZ3bXJ6anRmZHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTY1MDgsImV4cCI6MjA4NDEzMjUwOH0.vt6ssfPvYQtSa1kX3lhzkz52T8ng2rRMA8TPywR0huQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
