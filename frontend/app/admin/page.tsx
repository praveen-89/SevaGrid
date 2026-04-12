'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { ADMIN_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  Users, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
  Calendar,
  Clock, 
  ArrowRight,
  ChevronRight,
  LifeBuoy,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import { mockService } from '@/lib/mock-service';
import { Case, AnalyticsData } from '@/lib/types';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import Link from 'next/link';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [stats, cases] = await Promise.all([
          mockService.getAnalytics(),
          mockService.getCases()
        ]);
        setAnalytics(stats);
        setRecentCases(cases.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { title: 'Total Cases', value: analytics?.totalCases || 0, icon: ClipboardList, gradient: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/15', trend: '+12% from last month' },
    { title: 'Urgent Cases', value: analytics?.urgentCases || 0, icon: AlertTriangle, gradient: 'from-rose-500 to-pink-500', glow: 'shadow-rose-500/15', trend: 'Requires immediate action' },
    { title: 'Pending Assignments', value: analytics?.pendingAssignments || 0, icon: Users, gradient: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/15', trend: '5 volunteers available' },
    { title: 'Completed Today', value: analytics?.completedToday || 0, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/15', trend: '2 above daily average' },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Admin Dashboard" allowedRoles={['ADMIN']}>
      <div className="space-y-8">
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">General Overview</h2>
            <p className="text-slate-500 mt-1">Real-time status of NGO operations and community needs.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="gap-2 rounded-full glass-card border-white/30 hover:glass-card-hover transition-all">
               <Calendar className="w-4 h-4" />
               Last 30 Days
             </Button>
             <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-full shadow-lg shadow-indigo-500/20">Export Report</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden hover:glass-card-hover transition-all duration-500 group">
               <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient}`} />
               <div className="p-6 pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-br ${stat.gradient} p-2.5 rounded-xl shadow-lg ${stat.glow} group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 flex items-center glass-card px-2.5 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      14%
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                    <p className="text-xs text-slate-400 mt-2 flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {stat.trend}
                    </p>
                  </div>
               </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
            <div className="flex flex-row items-center justify-between p-6 pb-0">
              <div>
                <h3 className="text-lg font-semibold">Case Intake Trend</h3>
                <p className="text-sm text-slate-500">Number of reports received per day</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-4 h-4" /></Button>
            </div>
            <div className="p-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.weeklyTrend || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.8)'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-lg font-semibold">Cases by Category</h3>
              <p className="text-sm text-slate-500">Major service areas</p>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                {Object.entries(analytics?.casesByCategory || {}).slice(0, 5).map(([cat, count]) => (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100/80 rounded-full overflow-hidden backdrop-blur-sm">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" 
                        style={{ width: `${(count / 156) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full mt-6 rounded-full glass-card border-white/30 hover:glass-card-hover transition-all">View Detailed Analytics</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity / Case Queue Preview */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex flex-row items-center justify-between p-6 pb-0">
            <div>
              <h3 className="text-lg font-semibold">Recent Incoming Cases</h3>
              <p className="text-sm text-slate-500">Latest community reports awaiting review</p>
            </div>
            <Link href="/admin/cases">
              <Button variant="link" className="text-indigo-600 font-bold">View All Queue</Button>
            </Link>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100/50 text-slate-500 font-medium">
                    <th className="pb-3 pl-2">Case Details</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Urgency</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50">
                  {recentCases.map((c) => (
                    <tr key={c.id} className="group hover:bg-white/40 transition-colors rounded-lg">
                      <td className="py-4 pl-2">
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.title}</p>
                          <p className="text-xs text-slate-500 flex items-center mt-1">
                            <LifeBuoy className="w-3 h-3 mr-1" />
                            {c.location.area} • Created {new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-xs font-medium glass-card px-2.5 py-1 rounded-full text-slate-600">
                          {c.category}
                        </span>
                      </td>
                      <td className="py-4">
                        <PriorityBadge priority={c.severity} />
                      </td>
                      <td className="py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-4 text-right pr-2">
                        <Link href={`/admin/cases/${c.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 px-3 rounded-full hover:bg-indigo-50/50 text-indigo-600 font-bold">Assign</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {recentCases.length === 0 && !isLoading && (
              <div className="py-12 text-center text-slate-400">
                No recent cases found.
              </div>
            )}
            {isLoading && (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}
