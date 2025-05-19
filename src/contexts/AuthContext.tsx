
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  signUp: (name: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading, setUser, setLoading, logout } = useAuthStore();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Get user data from local storage or create a placeholder
          const userData = JSON.parse(localStorage.getItem('hamkor_user') || '{}');
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: userData.name || 'User',
            role: userData.role || 'student',
          });
          
          // Redirect based on role if on auth pages
          if (window.location.pathname.includes('auth')) {
            navigate(userData.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setLoading(false);
      }
    };

    checkSession();
  }, [setUser, setLoading, navigate]);

  const signUp = async (name: string, role: UserRole) => {
    setLoading(true);
    try {
      // Generate a random email and password since we're not asking for them
      const randomId = Math.random().toString(36).substring(2, 11);
      const email = `${randomId}@hamkortalim.com`;
      const password = `${randomId}_Password1`;
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        const user = { id: data.user.id, email, name, role };
        
        // Save to localStorage for session persistence
        localStorage.setItem('hamkor_user', JSON.stringify(user));
        
        setUser(user);
        navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // For now, using the existing mock login
      const savedUser = localStorage.getItem('hamkor_user');
      const savedPassword = localStorage.getItem('hamkor_password');
      
      if (savedUser && savedPassword === password && JSON.parse(savedUser).email === email) {
        const user = JSON.parse(savedUser);
        setUser(user);
        navigate(user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
      } else {
        throw new Error('Invalid login credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    signUp,
    signIn,
    signOut,
    isLoading,
    isAuthenticated,
    role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
