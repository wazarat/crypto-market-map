import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Sector {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  sector_id: string
  name: string
  slug: string
  logo_url?: string
  short_summary: string
  website?: string
  created_at: string
  updated_at: string
}

export interface CompanyResearch {
  id: string
  company_id: string
  title: string
  content: string
  source_url?: string
  created_at: string
  updated_at: string
}

export interface UserNote {
  id: string
  user_id: string
  company_id: string
  note_text: string
  created_at: string
  updated_at: string
}
