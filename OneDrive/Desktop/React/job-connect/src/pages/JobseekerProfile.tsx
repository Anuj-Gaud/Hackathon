import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'documents'>('personal');
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });
  const [professionalInfo, setProfessionalInfo] = useState({
    title: '',
    experience: '',
    skills: [] as string[],
    education: [] as Array<{
      degree: string;
      institution: string;
      year: string;
      field: string;
    }>,
    summary: ''
  });
  const [documents, setDocuments] = useState({
    resume: null as File | null,
    coverLetter: null as File | null,
    certificates: [] as File[]
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleProfessionalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfessionalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setProfessionalInfo(prev => ({ ...prev, skills }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...professionalInfo.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setProfessionalInfo(prev => ({ ...prev, education: newEducation }));
  };

  const addEducation = () => {
    setProfessionalInfo(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', institution: '', year: '', field: '' }
      ]
    }));
  };

  const removeEducation = (index: number) => {
    setProfessionalInfo(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleDocumentChange = (type: 'resume' | 'coverLetter' | 'certificates', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'certificates') {
        setDocuments(prev => ({
          ...prev,
          certificates: [...prev.certificates, e.target.files![0]]
        }));
      } else {
        setDocuments(prev => ({
          ...prev,
          [type]: e.target.files![0]
        }));
      }
    }
  };

  const removeCertificate = (index: number) => {
    setDocuments(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Profile update:', { personalInfo, professionalInfo, documents });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your personal and professional information</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('personal')}
              className={`${
                activeTab === 'personal'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`${
                activeTab === 'professional'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Professional Information
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`${
                activeTab === 'documents'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Documents
            </button>
          </nav>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === 'personal' ? (
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={personalInfo.location}
                onChange={handlePersonalInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                LinkedIn Profile
              </label>
              <input
                type="url"
                name="linkedin"
                id="linkedin"
                value={personalInfo.linkedin}
                onChange={handlePersonalInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            {/* GitHub */}
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                GitHub Profile
              </label>
              <input
                type="url"
                name="github"
                id="github"
                value={personalInfo.github}
                onChange={handlePersonalInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            {/* Portfolio */}
            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                Portfolio Website
              </label>
              <input
                type="url"
                name="portfolio"
                id="portfolio"
                value={personalInfo.portfolio}
                onChange={handlePersonalInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>
          </div>
        ) : activeTab === 'professional' ? (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Professional Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={professionalInfo.title}
                onChange={handleProfessionalInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                type="text"
                name="experience"
                id="experience"
                value={professionalInfo.experience}
                onChange={handleProfessionalInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                name="skills"
                id="skills"
                value={professionalInfo.skills.join(', ')}
                onChange={handleSkillsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            {/* Education */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <button
                  type="button"
                  onClick={addEducation}
                  className="text-sm text-black hover:text-gray-700"
                >
                  + Add Education
                </button>
              </div>
              {professionalInfo.education.map((edu, index) => (
                <div key={index} className="space-y-4 mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Education #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Year</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Professional Summary */}
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                Professional Summary
              </label>
              <textarea
                name="summary"
                id="summary"
                rows={4}
                value={professionalInfo.summary}
                onChange={handleProfessionalInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resume */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Resume</label>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleDocumentChange('resume', e)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
                {documents.resume && (
                  <p className="mt-2 text-sm text-gray-500">{documents.resume.name}</p>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleDocumentChange('coverLetter', e)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
                {documents.coverLetter && (
                  <p className="mt-2 text-sm text-gray-500">{documents.coverLetter.name}</p>
                )}
              </div>
            </div>

            {/* Certificates */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Certificates</label>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleDocumentChange('certificates', e)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
                {documents.certificates.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {documents.certificates.map((cert, index) => (
                      <li key={index} className="flex items-center justify-between text-sm text-gray-500">
                        <span>{cert.name}</span>
                        <button
                          type="button"
                          onClick={() => removeCertificate(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile; 