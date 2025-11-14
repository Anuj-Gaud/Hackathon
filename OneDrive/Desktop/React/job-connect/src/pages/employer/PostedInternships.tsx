import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Internship {
  id: string;
  title: string;
  description: string;
  company_id: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  requirements: string;
  status: string;
  created_at: string;
  updated_at: string;
  company?: {
    name: string;
    logo_url: string;
  };
  applications?: number;
}

// Sample data for testing
const sampleInternships: Internship[] = [
  {
    id: '1',
    title: 'Software Development Intern',
    description: 'Join our development team as an intern...',
    company_id: '1',
    location: 'New York, NY',
    type: 'Full-time',
    duration: '3 months',
    stipend: '$3,000/month',
    requirements: 'Currently pursuing a degree in Computer Science...',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company: {
      name: 'Tech Corp',
      logo_url: 'https://example.com/logo.png'
    },
    applications: 8
  },
  {
    id: '2',
    title: 'Marketing Intern',
    description: 'Help us grow our brand presence...',
    company_id: '1',
    location: 'Remote',
    type: 'Part-time',
    duration: '6 months',
    stipend: '$2,000/month',
    requirements: 'Currently pursuing a degree in Marketing...',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company: {
      name: 'Tech Corp',
      logo_url: 'https://example.com/logo.png'
    },
    applications: 5
  }
];

const PostedInternships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const fetchPostedInternships = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID found');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching company data for user:', user.id);
      
      // First get the company_id for the current user
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .or(`auth_id.eq.${user.id},user_id.eq.${user.id}`)
        .single();

      if (companyError) {
        console.error('Error fetching company:', companyError);
        // For testing, use sample data on error
        setInternships(sampleInternships);
        setLoading(false);
        return;
      }

      if (!companyData) {
        console.log('No company found for user');
        // For testing, use sample data
        setInternships(sampleInternships);
        setLoading(false);
        return;
      }

      console.log('Company found:', companyData);

      // Then fetch internships for this company
      const { data, error } = await supabase
        .from('internships')
        .select(`
          *,
          companies (
            name,
            logo_url
          ),
          applications (
            count
          )
        `)
        .eq('company_id', companyData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching internships:', error);
        // For testing, use sample data on error
        setInternships(sampleInternships);
        setLoading(false);
        return;
      }

      console.log('Internships fetched:', data);

      // Transform the data to include application count
      const transformedData = data?.map(internship => ({
        ...internship,
        applications: internship.applications?.[0]?.count || 0
      })) || [];

      setInternships(transformedData);
    } catch (err) {
      console.error('Error in fetchPostedInternships:', err);
      // For testing, use sample data on error
      setInternships(sampleInternships);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPostedInternships();
  }, [fetchPostedInternships]);

  const handleStatusChange = async (internshipId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('internships')
        .update({ status: newStatus })
        .eq('id', internshipId);

      if (error) throw error;
      
      // Update local state
      setInternships(prevInternships => prevInternships.map(internship => 
        internship.id === internshipId ? { ...internship, status: newStatus } : internship
      ));
    } catch (err) {
      console.error('Error updating internship status:', err);
    }
  };

  const handleDelete = async (internshipId: string) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) return;

    try {
      const { error } = await supabase
        .from('internships')
        .delete()
        .eq('id', internshipId);

      if (error) throw error;
      
      // Update local state
      setInternships(prevInternships => prevInternships.filter(internship => internship.id !== internshipId));
    } catch (err) {
      console.error('Error deleting internship:', err);
    }
  };

  const filteredInternships = internships.filter(internship => {
    const matchesFilter = filter === 'all' || internship.status === filter;
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: internships.length,
    active: internships.filter(internship => internship.status === 'active').length,
    paused: internships.filter(internship => internship.status === 'paused').length,
    closed: internships.filter(internship => internship.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-[#1d1d1f]">Posted Internships</h1>
        <Link
          to="/employer/post-internship"
          className="bg-[#000000] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#1d1d1f] transition-colors duration-200"
        >
          Post New Internship
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Internships</h3>
          <p className="mt-2 text-3xl font-semibold text-[#1d1d1f]">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Internships</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Paused Internships</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">{stats.paused}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Closed Internships</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats.closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search internships..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Internships List */}
      <div className="space-y-4">
        {filteredInternships.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-[#1d1d1f]">No internships found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredInternships.map((internship) => (
            <div key={internship.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-[#1d1d1f]">{internship.title}</h3>
                  <p className="text-gray-500">{internship.company?.name || 'Company Name'} • {internship.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    internship.status === 'active' ? 'bg-green-100 text-green-800' :
                    internship.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {internship.applications || 0} applications
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleStatusChange(internship.id, internship.status === 'active' ? 'paused' : 'active')}
                    className="text-sm text-gray-600 hover:text-[#1d1d1f]"
                  >
                    {internship.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                  <Link
                    to={`/employer/internships/${internship.id}/edit`}
                    className="text-sm text-gray-600 hover:text-[#1d1d1f]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(internship.id)}
                    className="text-sm text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Posted on {new Date(internship.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostedInternships; 