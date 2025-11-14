import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobsContext';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

const MainLayout: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, logout, updateUserRole } = useAuth();
  const { fetchJobs, fetchInternships } = useJobs();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch initial data
    const loadData = async () => {
      try {
        await Promise.all([fetchJobs(), fetchInternships()]);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load jobs and internships');
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePostJobsClick = async () => {
    if (!user) {
      toast.error('Please sign in to post jobs');
      navigate('/login');
      return;
    }

    try {
      // If user is already an employer, navigate to employer dashboard
      if (user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        // Update user role to employer
        await updateUserRole('employer');
        navigate('/employer/dashboard');
      }
    } catch (error) {
      console.error('Error in handlePostJobsClick:', error);
      toast.error('An error occurred while switching to employer view');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-3xl font-bold text-emerald-500 tracking-tight">
                  VibeZ
                </Link>
              </div>
              {/* Desktop navigation */}
              <div className="hidden md:flex md:items-center md:space-x-4 ml-6">
                <Link
                  to="/"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out ${
                    isActive('/') 
                      ? 'text-emerald-500 bg-emerald-50' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/jobs"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out ${
                    isActive('/jobs') 
                      ? 'text-emerald-500 bg-emerald-50' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  to="/internships"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out ${
                    isActive('/internships') 
                      ? 'text-emerald-500 bg-emerald-50' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  Internships
                </Link>
                <button
                  onClick={handlePostJobsClick}
                  className="text-gray-600 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-emerald-50 active:bg-emerald-100 rounded-md hover:shadow-sm"
                >
                  Post Jobs
                </button>
              </div>
            </div>

            {/* Right side navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {user ? (
                <div className="relative">
                  <div>
                    <button
                      type="button"
                      className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 ease-in-out hover:bg-emerald-50 active:bg-emerald-100"
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-500 font-medium">
                          {user.fullName?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </button>
                  </div>
                  {isSettingsOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/about" className="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/help" className="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="https://twitter.com" className="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com" className="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} VibeZ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;