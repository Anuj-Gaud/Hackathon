import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Company {
  name: string;
  logo_url: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  company_id: string;
  location: string;
  type: string;
  salary_range: string;
  requirements: string;
  status: string;
  created_at: string;
  updated_at: string;
  company?: Company;
}

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*, companies(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setJob(data);
      } catch (err) {
        setError('Failed to load job details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            job_id: id,
            user_id: user.id,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error || 'Job not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{job.company?.name || 'Company Name'}</p>
            </div>
            <button
              onClick={handleApply}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Apply Now
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Location:</span> {job.location}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Type:</span> {job.type}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Salary:</span> {job.salary_range}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Posted:</span>{' '}
                {new Date(job.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Requirements</h2>
            <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 