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

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const pieData = Object.entries(data?.casesByCategory || {}).map(([name, value]) => ({ name, value }));

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Operational Analytics" allowedRoles={['ADMIN']}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Impact Metrics</h2>
              <p className="text-slate-500 text-sm">Deep-dive into community needs and response performance.</p>
           </div>
           <div className="flex gap-2">
             <Button variant="outline" className="gap-2"><Calendar className="w-4 h-4" /> Timeframe</Button>
             <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <Card className="border-none shadow-sm">
              <CardHeader>
                 <CardTitle>Case Categories</CardTitle>
                 <CardDescription>Distribution across service areas</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
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
                       <Tooltip />
                       <Legend />
                    </PieChart>
                 </ResponsiveContainer>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm">
              <CardHeader>
                 <CardTitle>Priority Distribution</CardTitle>
                 <CardDescription>Cases by urgency level</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(data?.casesByPriority || {}).map(([name, count]) => ({ name, count }))}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} />
                       <YAxis axisLine={false} tickLine={false} />
                       <Tooltip cursor={{fill: '#f8fafc'}} />
                       <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </CardContent>
           </Card>
        </div>

        <Card className="border-none shadow-sm">
           <CardHeader>
              <CardTitle>Weekly Response Trends</CardTitle>
              <CardDescription>Historical caseload tracking</CardDescription>
           </CardHeader>
           <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data?.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
