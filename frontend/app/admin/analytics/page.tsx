'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { ADMIN_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockService } from '@/lib/mock-service';
import { AnalyticsData } from '@/lib/types';
import { Download, Calendar, Filter } from 'lucide-react';

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    mockService.getAnalytics().then(setData);
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const pieData = Object.entries(data?.casesByCategory || {}).map(([name, value]) => ({ name, value }));

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Operational Analytics" allowedRoles={['ADMIN']}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Impact <span className="text-gradient">Metrics</span></h2>
              <p className="text-slate-500 text-sm">Deep-dive into community needs and response performance.</p>
           </div>
           <div className="flex gap-2">
             <Button variant="outline" className="gap-2 rounded-full glass-card border-white/30 hover:glass-card-hover transition-all"><Calendar className="w-4 h-4" /> Timeframe</Button>
             <Button variant="outline" className="gap-2 rounded-full glass-card border-white/30 hover:glass-card-hover transition-all"><Download className="w-4 h-4" /> Export CSV</Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-6 pb-0">
                 <h3 className="font-semibold text-lg">Case Categories</h3>
                 <p className="text-sm text-slate-500">Distribution across service areas</p>
              </div>
              <div className="p-6 h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {pieData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{borderRadius: '16px', border: 'none', backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.8)'}} />
                       <Legend />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-6 pb-0">
                 <h3 className="font-semibold text-lg">Priority Distribution</h3>
                 <p className="text-sm text-slate-500">Cases by urgency level</p>
              </div>
              <div className="p-6 h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(data?.casesByPriority || {}).map(([name, count]) => ({ name, count }))}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} />
                       <YAxis axisLine={false} tickLine={false} />
                       <Tooltip cursor={{fill: 'rgba(248,250,252,0.5)'}} contentStyle={{borderRadius: '16px', border: 'none', backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.8)'}} />
                       <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                       <defs>
                         <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#6366f1" />
                           <stop offset="100%" stopColor="#8b5cf6" />
                         </linearGradient>
                       </defs>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
           <div className="p-6 pb-0">
              <h3 className="font-semibold text-lg">Weekly Response Trends</h3>
              <p className="text-sm text-slate-500">Historical caseload tracking</p>
           </div>
           <div className="p-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data?.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(248,250,252,0.5)'}} contentStyle={{borderRadius: '16px', border: 'none', backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.8)'}} />
                    <Bar dataKey="count" fill="url(#trendGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
