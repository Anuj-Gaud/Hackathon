import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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