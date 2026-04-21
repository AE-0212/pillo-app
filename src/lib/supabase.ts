import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hqsepoftsvhlsocwdvyz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxc2Vwb2Z0c3ZobHNvY3dkdnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzE4NTUsImV4cCI6MjA5MjM0Nzg1NX0.iNbHcYoxCdrl-1rNw_aW6JRQ3I4pZ6FifbxzQG18TCI'

export const supabase = createClient(supabaseUrl, supabaseKey)
