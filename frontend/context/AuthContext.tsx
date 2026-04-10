'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import { mockService } from '@/lib/mock-service';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await mockService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const loggedUser = await mockService.login(email, role);
      if (loggedUser) {
        setUser(loggedUser);
        // Redirect based on role
        if (loggedUser.role === 'ADMIN') router.push('/admin');
        else if (loggedUser.role === 'FIELD_STAFF') router.push('/fieldstaff');
        else if (loggedUser.role === 'VOLUNTEER') router.push('/volunteer');
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    mockService.logout();
    setUser(null);
    router.push('/');
  };

  const isAuthorized = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
