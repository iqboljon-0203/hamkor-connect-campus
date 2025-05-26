import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { UserRole } from "../types";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
  signUp: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => Promise<void>;
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading, setUser, setLoading, logout } =
    useAuthStore();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        // TODO: Once Supabase is integrated, replace this with an actual session check
        const savedUser = localStorage.getItem("hamkor_user");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setUser(user);
          // Redirect based on role if on auth pages
          if (window.location.pathname.includes("auth")) {
            navigate(
              user.role === "teacher"
                ? "/teacher-dashboard"
                : "/student-dashboard"
            );
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    checkSession();
  }, [setUser, setLoading, navigate]);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    setLoading(true);
    try {
      // Supabase Auth orqali user yaratish
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      const user = data.user;
      if (user) {
        // profiles jadvaliga yozish
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            full_name: name,
            role,
          },
        ]);
        if (profileError) throw profileError;
        setUser({ id: user.id, email, name, role });
        navigate(
          role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Supabase Auth orqali login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const user = data.user;
      if (user) {
        // profiles jadvalidan rol va ismni olish
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, full_name, avatar")
          .eq("id", user.id)
          .single();
        if (profileError) throw profileError;
        setUser({
          id: user.id,
          email,
          name: profile.full_name,
          role: profile.role,
          profileUrl: profile.avatar || null,
        });
        navigate(
          profile.role === "teacher"
            ? "/teacher-dashboard"
            : "/student-dashboard"
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      navigate("/auth/login");
    } catch (error) {
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
