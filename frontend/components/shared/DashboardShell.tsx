'use client';

import React, { useEffect } from 'react';
import { Sidebar, NavItem } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
  allowedRoles: UserRole[];
}

export function DashboardShell({ 
  children, 
  navItems, 
  title, 
  allowedRoles 
}: DashboardShellProps) {
  const { user, isLoading, isAuthorized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else if (!isAuthorized(allowedRoles)) {
        // Redirect to authorized portal
        if (user.role === 'ADMIN') router.push('/admin');
        else if (user.role === 'FIELD_STAFF') router.push('/fieldstaff');
        else if (user.role === 'VOLUNTEER') router.push('/volunteer');
      }
    }
  }, [user, isLoading, isAuthorized, allowedRoles, router]);

  if (isLoading || !user || !isAuthorized(allowedRoles)) {
    return (
      <div className="flex items-center justify-center h-screen gradient-bg gradient-mesh">
        <div className="flex flex-col items-center gap-4 glass-card p-8 rounded-2xl">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden gradient-bg gradient-mesh">
      {/* Sidebar - desktop */}
      <Sidebar items={navItems} className="hidden lg:flex" />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-8 px-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
