import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const EmployerLayout: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in and is an employer
    if (!user) {
      toast.error('Please sign in to access employer features');
      navigate('/login');
      return;
    }

    if (user.role !== 'employer') {
      toast.error('Only employers can access this section');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div>
                <Link to="/employer" className="text-3xl font-bold text-mint-500 tracking-tight">
                  VibeZ
                </Link>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-sm text-[#000000] hover:text-[#1d1d1f] transition-colors duration-200"
              >
                ← Switch to Jobseeker
              </button>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  type="button"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000] transition-all duration-300 ease-in-out hover:bg-gray-100 active:bg-gray-200 shadow-sm"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-[#000000]/10 flex items-center justify-center">
                    <span className="text-[#000000] font-medium">
                      {user?.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                {isSettingsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white/80 backdrop-blur-md ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link
                      to="/employer/profile"
                      className="block px-4 py-2 text-sm text-[#1d1d1f] hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/employer/settings"
                      className="block px-4 py-2 text-sm text-[#1d1d1f] hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-[#1d1d1f] hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar and Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 backdrop-blur-md shadow-sm h-screen fixed">
          <div className="p-4">
            <nav className="space-y-1">
              <Link
                to="/employer/dashboard"
                className={`flex items-center px-4 py-3 text-[#1d1d1f] hover:bg-[#000000]/5 hover:text-[#000000] rounded-xl transition-colors duration-200 ${
                  isActive('/employer/dashboard') ? 'bg-[#000000]/5 text-[#000000]' : ''
                }`}
              >
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <Link
                to="/employer/jobs"
                className={`flex items-center px-4 py-3 text-[#1d1d1f] hover:bg-[#000000]/5 hover:text-[#000000] rounded-xl transition-colors duration-200 ${
                  isActive('/employer/jobs') ? 'bg-[#000000]/5 text-[#000000]' : ''
                }`}
              >
                <span className="text-sm font-medium">Posted Jobs</span>
              </Link>
              <Link
                to="/employer/internships"
                className={`flex items-center px-4 py-3 text-[#1d1d1f] hover:bg-[#000000]/5 hover:text-[#000000] rounded-xl transition-colors duration-200 ${
                  isActive('/employer/internships') ? 'bg-[#000000]/5 text-[#000000]' : ''
                }`}
              >
                <span className="text-sm font-medium">Posted Internships</span>
              </Link>
              <Link
                to="/employer/applications"
                className={`flex items-center px-4 py-3 text-[#1d1d1f] hover:bg-[#000000]/5 hover:text-[#000000] rounded-xl transition-colors duration-200 ${
                  isActive('/employer/applications') ? 'bg-[#000000]/5 text-[#000000]' : ''
                }`}
              >
                <span className="text-sm font-medium">Applications</span>
              </Link>
              <Link
                to="/employer/billing"
                className="flex items-center px-4 py-3 text-[#1d1d1f] hover:bg-[#000000]/5 hover:text-[#000000] rounded-xl transition-colors duration-200"
              >
                <span className="text-sm font-medium">Billing</span>
              </Link>
              <Link
                to="/employer/analytics"
                className="flex items-center px-4 py-3 text-[#1d1d1f] hover:bg-[#000000]/5 hover:text-[#000000] rounded-xl transition-colors duration-200"
              >
                <span className="text-sm font-medium">Analytics</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerLayout; 