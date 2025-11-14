import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Location {
  city: string;
  area: string;
}

interface Stipend {
  type: string;
  amount: string;
  currency: string;
}

interface InternshipFormData {
  title: string;
  description: string;
  type: string;
  location: Location;
  duration: string;
  stipend: Stipend;
  requirements: string[];
  responsibilities: string[];
  application_deadline: string;
  start_date: string;
  end_date: string;
}

interface InternshipSubmission extends InternshipFormData {
  company_id: string;
  status: string;
}

interface FormData {
  title: string;
  description: string;
  type: string;
  location: string;
  duration: string;
  stipend: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  perks: string[];
  application_deadline: string;
  start_date: string;
  end_date: string;
}

const PostInternship = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: '',
    location: '',
    duration: '',
    stipend: '',
    requirements: [''],
    responsibilities: [''],
    skills: [''],
    perks: [''],
    application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
    start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 60 days from now
    end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default to 90 days from now
  });

  // Add useEffect to handle page reload
  useEffect(() => {
    const checkUserRole = async () => {
      // Check if user is logged in
      if (!user) {
        toast.error('Please sign in to post an internship');
        navigate('/login');
        return;
      }

      // Get user data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        // Create user record if it doesn't exist
        const { error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email,
              role: 'employer',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);

        if (createError) {
          console.error('Error creating user record:', createError);
          toast.error('Failed to create user account');
          navigate('/login');
          return;
        }
      } else if (userData.role !== 'employer') {
        // Update user role if needed
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'employer' })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating user role:', updateError);
          toast.error('Failed to update user role');
          navigate('/');
          return;
        }
      }

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { role: 'employer' }
      });

      if (authError) {
        console.error('Error updating auth metadata:', authError);
        toast.error('Failed to update user role');
        navigate('/');
        return;
      }
    };

    checkUserRole();
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (index: number, value: string, field: 'requirements' | 'responsibilities' | 'skills' | 'perks') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'requirements' | 'responsibilities' | 'skills' | 'perks') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index: number, field: 'requirements' | 'responsibilities' | 'skills' | 'perks') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Get the current user from Supabase auth
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        console.error('Auth error:', userError);
        toast.error('Please sign in to post an internship');
        return;
      }

      console.log('Current authenticated user:', currentUser);

      // First verify the user exists in the users table
      let { data: userData, error: userCheckError } = await supabase
        .from('users')
        .select('*')  // Select all fields for debugging
        .eq('id', currentUser.id)
        .single();

      console.log('Initial user check result:', { userData, userCheckError });

      // If user doesn't exist in users table, create them
      if (userCheckError || !userData) {
        console.log('User not found in users table, creating new user record...');
        console.log('Creating user with ID:', currentUser.id);
        
        // Create user record
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: currentUser.id,
              email: currentUser.email,
              role: 'employer',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        console.log('User creation result:', { newUser, createError });

        if (createError) {
          console.error('Error creating user:', createError);
          toast.error('Failed to create user account. Please try again.');
          return;
        }

        // Verify the user was created
        const { data: verifyUser, error: verifyError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        console.log('User verification after creation:', { verifyUser, verifyError });

        if (verifyError || !verifyUser) {
          console.error('Error verifying created user:', verifyError);
          toast.error('Failed to verify user account. Please try again.');
          return;
        }

        userData = verifyUser;
      }

      if (!userData) {
        console.error('No user data available after verification');
        toast.error('User account not found. Please sign in again.');
        return;
      }

      console.log('Final user data to be used:', userData);

      if (userData.role !== 'employer') {
        toast.error('Only employers can post internships');
        return;
      }

      // Get the company data for this user
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('auth_id', currentUser.id)
        .single();

      console.log('Company data:', companyData);

      if (companyError || !companyData) {
        console.error('Error fetching company data:', companyError);
        toast.error('Please complete your company profile before posting an internship');
        return;
      }

      // Validate required fields
      if (!formData.title?.trim() || 
          !formData.description?.trim() || 
          !formData.type?.trim() || 
          !formData.location?.trim() || 
          !formData.duration?.trim() || 
          !formData.stipend?.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate date order if dates are provided
      if (formData.start_date && formData.end_date) {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);

        if (endDate <= startDate) {
          toast.error('End date must be after start date');
          return;
        }
      }

      if (formData.application_deadline && formData.start_date) {
        const appDeadline = new Date(formData.application_deadline);
        const startDate = new Date(formData.start_date);
        
        if (startDate < appDeadline) {
          toast.error('Start date must be after application deadline');
          return;
        }
      }

      // Filter out empty strings and format arrays as JSON strings
      const requirementsArray = formData.requirements.filter(req => req.trim() !== '');
      const responsibilitiesArray = formData.responsibilities.filter(resp => resp.trim() !== '');
      const skillsArray = formData.skills.filter(skill => skill.trim() !== '');
      const perksArray = formData.perks.filter(perk => perk.trim() !== '');

      // Format data for submission
      const formattedData = {
        company_id: companyData.id, // Use the company ID from the companies table
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type.trim(),
        location: formData.location.trim(),
        duration: formData.duration.trim(),
        stipend: formData.stipend.trim(),
        requirements: requirementsArray.length > 0 ? JSON.stringify(requirementsArray) : null,
        responsibilities: responsibilitiesArray.length > 0 ? JSON.stringify(responsibilitiesArray) : null,
        skills: skillsArray.length > 0 ? JSON.stringify(skillsArray) : null,
        perks: perksArray.length > 0 ? JSON.stringify(perksArray) : null,
        application_deadline: formData.application_deadline ? new Date(formData.application_deadline).toISOString() : null,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        status: 'active'
      };

      // Log the formatted data for debugging
      console.log('Formatted data being sent:', JSON.stringify(formattedData, null, 2));

      // Now insert the data
      const { data, error } = await supabase
        .from('internships')
        .insert([formattedData])
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        throw error;
      }

      console.log('Successfully created internship:', data);
      toast.success('Internship posted successfully!');
      
      // Force reload the page after successful submission
      window.location.href = '/employer/dashboard';
    } catch (error: any) {
      console.error('Error creating internship:', error);
      if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('Failed to post internship. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add console log to debug form data
  useEffect(() => {
    console.log('Current form data:', formData);
  }, [formData]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Post a New Internship</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Internship Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Software Development Intern"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the internship role and responsibilities..."
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Bangalore, India"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select type</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration *
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="e.g., 3 months"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Stipend */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stipend *
          </label>
          <input
            type="text"
            name="stipend"
            value={formData.stipend}
            onChange={handleInputChange}
            placeholder="e.g., ₹25,000/month"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requirements *
          </label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'requirements')}
                placeholder="List the requirements and qualifications..."
                className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'requirements')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('requirements')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Requirement
          </button>
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Responsibilities
          </label>
          {formData.responsibilities.map((resp, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={resp}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'responsibilities')}
                placeholder="List the key responsibilities..."
                className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'responsibilities')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('responsibilities')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Responsibility
          </button>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Required Skills
          </label>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'skills')}
                placeholder="e.g., React, Node.js, Python..."
                className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'skills')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('skills')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Skill
          </button>
        </div>

        {/* Perks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Perks & Benefits
          </label>
          {formData.perks.map((perk, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={perk}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'perks')}
                placeholder="e.g., Flexible hours, Work from home, Health insurance..."
                className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'perks')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('perks')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Perk
          </button>
        </div>

        {/* Application Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Application Deadline *
          </label>
          <input
            type="date"
            name="application_deadline"
            value={formData.application_deadline}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Internship Start Date *
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            min={formData.application_deadline}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Internship End Date *
          </label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            min={formData.start_date}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Internship'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostInternship; 