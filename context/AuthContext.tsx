'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signup: (email: string, password?: string, fullName?: string) => Promise<User>;
  login: (email: string, password?: string) => Promise<User>;
  updateProfile: (data: { fullName: string; age: number; occupation: string; phone?: string; bloodGroup?: string }) => Promise<User>;
  logout: () => void;
  quickDemoLogin: (type: 'NEW_USER' | 'EXISTING_COMPLETE_USER') => void;
}

const AUTH_STORAGE_KEY = 'readycare_auth_user';

const DEMO_COMPLETE_USER: User = {
  id: 'usr-demo-1',
  email: 'alex.henderson@example.com',
  fullName: 'Alex Henderson',
  role: 'PATIENT',
  age: 34,
  occupation: 'Senior Systems Architect',
  phone: '+1 (555) 892-4112',
  bloodGroup: 'O+',
  isProfileComplete: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  createdAt: '2026-09-01T10:00:00Z',
};

const DEMO_NEW_USER: User = {
  id: 'usr-new-' + Date.now(),
  email: 'sarah.miller@example.com',
  fullName: 'Sarah Miller',
  role: 'PATIENT',
  isProfileComplete: false,
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading auth from localStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = async (email: string, password?: string, fullName?: string): Promise<User> => {
    setIsLoading(true);
    // Simulate brief network latency
    await new Promise((res) => setTimeout(res, 400));

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName: fullName?.trim() || email.split('@')[0],
      role: 'PATIENT',
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return newUser;
  };

  const login = async (email: string, password?: string): Promise<User> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    // If logging in as demo email, restore complete profile; otherwise create or keep existing
    let loggedUser: User;
    if (email.toLowerCase().includes('alex') || email.toLowerCase().includes('demo')) {
      loggedUser = DEMO_COMPLETE_USER;
    } else {
      // Check if user already had stored data with this email
      const existing = localStorage.getItem(AUTH_STORAGE_KEY);
      if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.email === email.toLowerCase()) {
          loggedUser = parsed;
        } else {
          loggedUser = {
            id: `usr-${Date.now()}`,
            email: email.trim().toLowerCase(),
            fullName: email.split('@')[0],
            role: 'PATIENT',
            isProfileComplete: false,
            createdAt: new Date().toISOString(),
          };
        }
      } else {
        loggedUser = {
          id: `usr-${Date.now()}`,
          email: email.trim().toLowerCase(),
          fullName: email.split('@')[0],
          role: 'PATIENT',
          isProfileComplete: false,
          createdAt: new Date().toISOString(),
        };
      }
    }

    setUser(loggedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
    setIsLoading(false);
    return loggedUser;
  };

  const updateProfile = async (data: {
    fullName: string;
    age: number;
    occupation: string;
    phone?: string;
    bloodGroup?: string;
  }): Promise<User> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    if (!user) {
      throw new Error('No authenticated user found to update profile.');
    }

    const updatedUser: User = {
      ...user,
      fullName: data.fullName.trim(),
      age: data.age,
      occupation: data.occupation.trim(),
      phone: data.phone?.trim() || user.phone,
      bloodGroup: data.bloodGroup || user.bloodGroup,
      isProfileComplete: true,
    };

    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    setIsLoading(false);
    return updatedUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const quickDemoLogin = (type: 'NEW_USER' | 'EXISTING_COMPLETE_USER') => {
    if (type === 'NEW_USER') {
      const newUser = { ...DEMO_NEW_USER, id: 'usr-new-' + Date.now() };
      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      setUser(DEMO_COMPLETE_USER);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_COMPLETE_USER));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signup,
        login,
        updateProfile,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
