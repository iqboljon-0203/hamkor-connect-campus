
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';

interface AuthContextType {
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
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
        // TODO: Once Supabase is integrated, replace this with an actual session check
        const savedUser = localStorage.getItem('hamkor_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setUser(user);
          // Redirect based on role if on auth pages
          if (window.location.pathname.includes('auth')) {
            navigate(user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
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

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true);
    try {
      // TODO: Replace with Supabase auth.signUp
      // Mock signup for now
      const userId = `user_${Math.random().toString(36).substring(2, 11)}`;
      const user = { id: userId, email, name, role };
      
      // Save to localStorage for demo purposes
      localStorage.setItem('hamkor_user', JSON.stringify(user));
      localStorage.setItem('hamkor_password', password); // INSECURE! Only for demo
      
      setUser(user);
      navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
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
      // TODO: Replace with Supabase auth.signInWithPassword
      // Mock login for now
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
      // TODO: Replace with Supabase auth.signOut
      // Mock logout for now
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
