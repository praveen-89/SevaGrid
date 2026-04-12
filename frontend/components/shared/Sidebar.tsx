'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  BarChart3, 
  LifeBuoy, 
  Settings,
  PlusCircle,
  FileText,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  items: NavItem[];
  className?: string;
}

export function Sidebar({ items, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full glass-sidebar text-slate-300 w-64", className)}>
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2.5 text-white font-bold text-xl tracking-tight group">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">SevaGrid</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5",
                isActive 
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25" 
                  : "bg-white/5 hover:bg-indigo-500 hover:text-white border border-transparent hover:border-indigo-400 shadow-sm"
              )}
            >
              <item.icon className={cn("w-[18px] h-[18px] transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-white/8 hover:text-white transition-all duration-200"
        >
          <Settings className="w-[18px] h-[18px]" />
          Settings
        </Link>
      </div>
    </div>
  );
}
