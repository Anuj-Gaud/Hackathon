import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

// Inline interfaces
interface Location {
  id: string;
  city: string;
  area: string;
}

interface Company {
  id: string;
  name: string;
  logo_url: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  company_id: string;
  location: Location;
  job_type: string;
  pay_type: string;
  min_amount: number;
  max_amount: number;
  amount: number;
  pay_rate: string;
  requirements: string[];
  responsibilities: string[];
  status: string;
  created_at: string;
  updated_at: string;
  company?: Company;
}

interface Internship {
  id: string;
  title: string;
  description: string;
  company_id: string;
  location: Location;
  internship_type: string;
  stipend_type: string;
  min_amount: number;
  max_amount: number;
  amount: number;
  pay_rate: string;
  requirements: string[];
  responsibilities: string[];
  duration: string;
  status: string;
  created_at: string;
  updated_at: string;
  company?: Company;
}

interface JobsContextType {
  jobs: Job[];
  internships: Internship[];
  loading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  fetchInternships: () => Promise<void>;
  searchJobs: (query: string, filters: any) => Promise<Job[]>;
  searchInternships: (query: string, filters: any) => Promise<Internship[]>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies (
            id,
            name,
            logo_url
          ),
          location:locations (
            id,
            city,
            area
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('internships')
        .select(`
          *,
          company:companies (
            id,
            name,
            logo_url
          ),
          location:locations (
            id,
            city,
            area
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInternships(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = async (query: string, filters: any): Promise<Job[]> => {
    try {
      setLoading(true);
      setError(null);

      let supabaseQuery = supabase
        .from('jobs')
        .select(`
          *,
          company:companies (
            id,
            name,
            logo_url
          ),
          location:locations (
            id,
            city,
            area
          )
        `);

      // Apply search query
      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,company.name.ilike.%${query}%`);
      }

      // Apply filters
      if (filters.jobType) {
        supabaseQuery = supabaseQuery.eq('job_type', filters.jobType);
      }
      if (filters.location) {
        supabaseQuery = supabaseQuery.eq('location.city', filters.location);
      }
      if (filters.minSalary) {
        supabaseQuery = supabaseQuery.gte('min_amount', filters.minSalary);
      }
      if (filters.maxSalary) {
        supabaseQuery = supabaseQuery.lte('max_amount', filters.maxSalary);
      }

      const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      setError(err.message);
      console.error('Error searching jobs:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const searchInternships = async (query: string, filters: any): Promise<Internship[]> => {
    try {
      setLoading(true);
      setError(null);

      let supabaseQuery = supabase
        .from('internships')
        .select(`
          *,
          company:companies (
            id,
            name,
            logo_url
          ),
          location:locations (
            id,
            city,
            area
          )
        `);

      // Apply search query
      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,company.name.ilike.%${query}%`);
      }

      // Apply filters
      if (filters.internshipType) {
        supabaseQuery = supabaseQuery.eq('internship_type', filters.internshipType);
      }
      if (filters.duration) {
        supabaseQuery = supabaseQuery.eq('duration', filters.duration);
      }
      if (filters.minStipend) {
        supabaseQuery = supabaseQuery.gte('min_amount', filters.minStipend);
      }
      if (filters.maxStipend) {
        supabaseQuery = supabaseQuery.lte('max_amount', filters.maxStipend);
      }

      const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      setError(err.message);
      console.error('Error searching internships:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        internships,
        loading,
        error,
        fetchJobs,
        fetchInternships,
        searchJobs,
        searchInternships,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}; 