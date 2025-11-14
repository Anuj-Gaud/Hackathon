'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FileUpload from '@/components/FileUpload';

type JobType = 'job' | 'internship';

interface FormData {
  title: string;
  company: string;
  location: string;
  type: JobType;
  description: string;
  requirements: string[];
  salary?: string;
  duration?: string;
  stipend?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [jobType, setJobType] = useState<JobType>('job');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    company: '',
    location: '',
    type: 'job',
    description: '',
    requirements: [''],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (jobType === 'job' && !formData.salary) newErrors.salary = 'Salary is required';
    if (jobType === 'internship') {
      if (!formData.duration) newErrors.duration = 'Duration is required';
      if (!formData.stipend) newErrors.stipend = 'Stipend is required';
    }
    if (!formData.description) newErrors.description = 'Description is required';
    if (formData.requirements.some(req => !req)) {
      newErrors.requirements = 'All requirements must be filled';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Dummy logic: simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/posted');
    } catch (error) {
      console.error('Error posting job:', error);
      setErrors({ ...errors, submit: 'Failed to post job. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData((prev) => ({
      ...prev,
      requirements: newRequirements,
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ''],
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (file: File) => {
    // Dummy logic: simulate file upload
    console.log('Uploading file:', file);
    // In a real app, upload to Supabase storage here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h1 className="text-2xl font-bold text-black mb-6">Post a {jobType === 'job' ? 'Job' : 'Internship'}</h1>

          <div className="mb-6">
            <div className="flex space-x-4">
              <Button
                variant={jobType === 'job' ? 'primary' : 'outline'}
                onClick={() => setJobType('job')}
              >
                Job
              </Button>
              <Button
                variant={jobType === 'internship' ? 'primary' : 'outline'}
                onClick={() => setJobType('internship')}
              >
                Internship
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />

            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
              required
            />

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              required
            />

            {jobType === 'job' ? (
              <Input
                label="Salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                error={errors.salary}
                required
                placeholder="e.g., $50,000 - $70,000"
              />
            ) : (
              <>
                <Input
                  label="Duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  error={errors.duration}
                  required
                  placeholder="e.g., 3 months"
                />
                <Input
                  label="Stipend"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  error={errors.stipend}
                  required
                  placeholder="e.g., $3,000/month"
                />
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={req}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    required
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="mt-2 text-sm text-black hover:text-gray-800"
              >
                + Add Requirement
              </button>
            </div>

            <FileUpload onUpload={handleFileUpload} isLoading={isLoading} />

            {errors.submit && (
              <p className="text-sm text-red-600">{errors.submit}</p>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isLoading}
              >
                Post {jobType === 'job' ? 'Job' : 'Internship'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 