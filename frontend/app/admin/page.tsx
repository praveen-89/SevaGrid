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
  LifeBuoy
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
    { title: 'Total Cases', value: analytics?.totalCases || 0, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12% from last month' },
    { title: 'Urgent Cases', value: analytics?.urgentCases || 0, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Requires immediate action' },
    { title: 'Pending Assignments', value: analytics?.pendingAssignments || 0, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50', trend: '5 volunteers available' },
    { title: 'Completed Today', value: analytics?.completedToday || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '2 above daily average' },
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
             <Button variant="outline" className="gap-2">
               <Calendar className="w-4 h-4" />
               Last 30 Days
             </Button>
             <Button className="bg-indigo-600 hover:bg-indigo-700">Export Report</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
               <div className={`h-1 w-full ${stat.color.replace('text', 'bg')}`} />
               <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} p-2.5 rounded-xl`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-2 py-1 rounded-full">
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
               </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Case Intake Trend</CardTitle>
                <CardDescription>Number of reports received per day</CardDescription>
              </div>
              <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.weeklyTrend || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
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
                    contentStyle={{borderRadius: '12px', border: 'none'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Stats / Category Breakdown */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Cases by Category</CardTitle>
              <CardDescription>Major service areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {Object.entries(analytics?.casesByCategory || {}).slice(0, 5).map(([cat, count]) => (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${(count / 156) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full mt-6">View Detailed Analytics</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity / Case Queue Preview */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Incoming Cases</CardTitle>
              <CardDescription>Latest community reports awaiting review</CardDescription>
            </div>
            <Link href="/admin/cases">
              <Button variant="link" className="text-indigo-600">View All Queue</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-medium">
                    <th className="pb-3 pl-2">Case Details</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Urgency</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentCases.map((c) => (
                    <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
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
                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
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
                          <Button size="sm" variant="ghost" className="h-8 px-2">Assign</Button>
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
          </CardContent>
        </Card>
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
