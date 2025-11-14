import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          company: string
          location: string
          type: string
          salary: string | null
          requirements: string[]
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          company: string
          location: string
          type: string
          salary?: string | null
          requirements: string[]
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          company?: string
          location?: string
          type?: string
          salary?: string | null
          requirements?: string[]
          user_id?: string
        }
      }
      internships: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          company: string
          location: string
          duration: string
          stipend: string | null
          requirements: string[]
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          company: string
          location: string
          duration: string
          stipend?: string | null
          requirements: string[]
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          company?: string
          location?: string
          duration?: string
          stipend?: string | null
          requirements?: string[]
          user_id?: string
        }
      }
      applications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          job_id: string | null
          internship_id: string | null
          status: string
          resume_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          job_id?: string | null
          internship_id?: string | null
          status: string
          resume_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          job_id?: string | null
          internship_id?: string | null
          status?: string
          resume_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'company' | 'admin';
  company_name: string | null;
  company_logo: string | null;
  company_description: string | null;
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  title: string;
  company_id: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary_range: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Internship = {
  id: string;
  title: string;
  company_id: string;
  description: string;
  requirements: string[];
  location: string;
  duration: string;
  stipend: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  user_id: string;
  job_id: string | null;
  internship_id: string | null;
  resume_url: string;
  video_url: string | null;
  video_thumbnail_url: string | null;
  cover_letter: string | null;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
};

export type Analytics = {
  id: string;
  user_id: string;
  job_id: string | null;
  internship_id: string | null;
  event_type: string;
  created_at: string;
}; 