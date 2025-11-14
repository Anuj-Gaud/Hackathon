import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import EmployerLayout from './layouts/EmployerLayout';
import Home from './pages/Home';
import Jobs from './pages/jobseeker/Jobs';
import Internships from './pages/jobseeker/Internships';
import Login from './pages/auth/Login';
import JobDetails from './pages/jobseeker/JobDetails';
import InternshipDetails from './pages/jobseeker/InternshipDetails';
import JobseekerProfile from './pages/JobseekerProfile';
import EmployerProfile from './pages/employer/EmployerProfile';
import EmployerDashboard from './pages/employer/Dashboard';
import Applications from './pages/employer/Applications';
import Billing from './pages/employer/Billing';
import Analytics from './pages/employer/Analytics';
import EmployerSettings from './pages/employer/EmployerSettings';
import JobseekerSettings from './pages/JobseekerSettings';
import NotFound from './pages/NotFound';
import PostJob from './pages/employer/PostJob';
import PostInternship from './pages/employer/PostInternship';
import PostedJobs from './pages/employer/PostedJobs';
import PostedInternships from './pages/employer/PostedInternships';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { JobsProvider } from './contexts/JobsContext';
import { toast } from 'react-hot-toast';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Role-specific protected route
const RoleProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  allowedRole: 'employer' | 'jobseeker';
}> = ({ children, allowedRole }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If user's role doesn't match the required role
    if (user.role !== allowedRole) {
      // If trying to access employer routes but user is jobseeker
      if (allowedRole === 'employer' && user.role === 'jobseeker') {
        toast.error('Please switch to employer account to access this section');
        navigate('/');
        return;
      }
      // If trying to access jobseeker routes but user is employer
      if (allowedRole === 'jobseeker' && user.role === 'employer') {
        toast.error('Please switch to jobseeker account to access this section');
        navigate('/employer/dashboard');
        return;
      }
    }
  }, [user, allowedRole, navigate]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== allowedRole) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
};

// Root route component to handle initial routing
const RootRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect based on role
  if (user.role === 'employer') {
    return <Navigate to="/employer/dashboard" />;
  }

  // For jobseekers, show the home page
  return <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <JobsProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Root route */}
          <Route path="/" element={<RootRoute />} />

          {/* Main layout routes (for jobseekers) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="internships" element={<Internships />} />
            <Route path="jobs/:id" element={<JobDetails />} />
            <Route path="internships/:id" element={<InternshipDetails />} />
            <Route path="profile" element={
              <RoleProtectedRoute allowedRole="jobseeker">
                <JobseekerProfile />
              </RoleProtectedRoute>
            } />
            <Route path="settings" element={
              <RoleProtectedRoute allowedRole="jobseeker">
                <JobseekerSettings />
              </RoleProtectedRoute>
            } />
          </Route>

          {/* Employer routes */}
          <Route
            path="/employer"
            element={
              <RoleProtectedRoute allowedRole="employer">
                <EmployerLayout />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployerDashboard />} />
            <Route path="jobs" element={<PostedJobs />} />
            <Route path="internships" element={<PostedInternships />} />
            <Route path="applications" element={<Applications />} />
            <Route path="billing" element={<Billing />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<EmployerProfile />} />
            <Route path="settings" element={<EmployerSettings />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="post-internship" element={<PostInternship />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </JobsProvider>
    </AuthProvider>
  );
};

export default App; 