import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'jobseeker' | 'employer';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, fullName: string, role: 'jobseeker' | 'employer') => Promise<void>;
  login: (email: string, password: string, role?: 'jobseeker' | 'employer') => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUserRole: (role: 'jobseeker' | 'employer') => Promise<void>;
  navigateWithRole: (targetRole: 'jobseeker' | 'employer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test user for development
const TEST_USER: User = {
  id: '1',
  email: 'test@example.com',
  fullName: 'Test User',
  role: 'jobseeker'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for active session
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }

        if (session?.user) {
          console.log('Found existing session:', session);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || '',
            role: session.user.user_metadata?.role || 'jobseeker'
          });
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || '',
          role: session.user.user_metadata?.role || 'jobseeker'
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string, fullName: string, role: 'jobseeker' | 'employer') => {
    try {
      setError(null);
      console.log('Starting signup process...', { email, fullName, role });
      
      // First, check if we can connect to Supabase
      const { data: testData, error: testError } = await supabase.auth.getSession();
      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error('Unable to connect to authentication service. Please try again later.');
      }

      // Proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes('fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        if (error.message.includes('email')) {
          throw new Error('Invalid email address. Please check and try again.');
        }
        if (error.message.includes('password')) {
          throw new Error('Password must be at least 6 characters long.');
        }
        throw error;
      }

      if (data.user) {
        console.log('User created successfully:', data.user);
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          fullName: data.user.user_metadata?.full_name || '',
          role: data.user.user_metadata?.role || 'jobseeker'
        });
      } else {
        console.error('No user data returned from signup');
        throw new Error('No user data returned from signup');
      }
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      throw err;
    }
  };

  const login = async (email: string, password: string, role?: 'jobseeker' | 'employer') => {
    try {
      setError(null);
      console.log('Starting login process...', { email, role });

      // First sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned from login');
      }

      // Try to get user data from users table
      let userData = null;
      let userError = null;

      try {
        const result = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        userData = result.data;
        userError = result.error;
      } catch (err) {
        console.error('Error fetching user data:', err);
        userError = err;
      }

      if (userError) {
        console.log('User not found in users table, creating new record...');
        
        // If no role is provided, default to jobseeker
        const userRole = role || 'jobseeker';
        
        // Create new user record
        const newUser = {
          id: data.user.id,
          email: data.user.email,
          role: userRole,
          full_name: data.user.user_metadata?.full_name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        try {
          // First, ensure we have the latest session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;

          // Then try to insert the user record
          const { error: createError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();

          if (createError) {
            console.error('Error creating user record:', createError);
            
            // If the error is because the user already exists, try to fetch again
            if (createError.code === '23505') { // Unique violation error code
              const { data: retryData, error: retryError } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();

              if (retryError) {
                throw new Error('Failed to fetch user data after creation attempt');
              }

              // Set the user in context with existing role
              setUser({
                id: data.user.id,
                email: data.user.email!,
                role: retryData.role,
                fullName: retryData.full_name || data.user.user_metadata?.full_name || '',
              });
            } else {
              throw new Error('Failed to create user record. Please try again later.');
            }
          } else {
            // Set the user in context with the new role
            setUser({
              id: data.user.id,
              email: data.user.email!,
              role: userRole,
              fullName: data.user.user_metadata?.full_name || '',
            });
          }
        } catch (createErr) {
          console.error('Error in user creation:', createErr);
          throw new Error('Failed to create user record. Please try again later.');
        }
      } else {
        // If role is provided and different from stored role, update it
        if (role && userData.role !== role) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ role: role })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('Error updating user role:', updateError);
          } else {
            userData.role = role;
          }
        }

        // Set the user in context with the role
        setUser({
          id: data.user.id,
          email: data.user.email!,
          role: userData.role,
          fullName: userData.full_name || data.user.user_metadata?.full_name || '',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during login');
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      setUser(null);
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to log out';
      setError(errorMessage);
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const updateUserRole = async (newRole: 'jobseeker' | 'employer') => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update the user context
      setUser({
        ...user,
        role: newRole
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      setError(error instanceof Error ? error.message : 'Failed to update role');
      throw error;
    }
  };

  // Add a new function to handle role-based navigation
  const navigateWithRole = async (targetRole: 'jobseeker' | 'employer') => {
    try {
      if (!user) {
        // If not logged in, store the target role and redirect to login
        localStorage.setItem('targetRole', targetRole);
        navigate('/login');
        return;
      }

      if (user.role !== targetRole) {
        // Update the user's role
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: targetRole })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating user role:', updateError);
          throw new Error('Failed to update user role');
        }

        // Update the user context
        setUser({
          ...user,
          role: targetRole
        });
      }

      // Navigate to the appropriate dashboard
      navigate(`/${targetRole}/dashboard`);
    } catch (error) {
      console.error('Navigation error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during navigation');
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    clearError,
    updateUserRole,
    navigateWithRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 