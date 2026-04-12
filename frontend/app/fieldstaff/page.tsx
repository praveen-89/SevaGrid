'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { FIELD_STAFF_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  PlusCircle, 
  ClipboardList, 
  FileText, 
  Clock, 
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  FileEdit,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import { mockService } from '@/lib/mock-service';
import { Case, User } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function FieldStaffDashboard() {
  const { user } = useAuth();
  const [myCases, setMyCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const allCases = await mockService.getCases();
        // Filter for cases submitted by this field staff
        setMyCases(allCases.filter(c => c.fieldStaffId === user.id));
      } catch (error) {
        console.error('Failed to load cases', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const stats = [
    { title: 'My Submitted Cases', value: myCases.length, icon: FileText, gradient: 'from-indigo-500 to-violet-500', glow: 'shadow-indigo-500/15' },
    { title: 'Pending Review', value: myCases.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length, icon: Clock, gradient: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/15' },
    { title: 'Drafts', value: 3, icon: FileEdit, gradient: 'from-slate-500 to-gray-500', glow: 'shadow-slate-500/15' },
    { title: 'Completed Tasks', value: myCases.filter(c => c.status === 'COMPLETED').length, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/15' },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Field Staff Portal" allowedRoles={['FIELD_STAFF']}>
      <div className="space-y-8">
        {/* Header & Quick Action */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200/50 mb-10">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -ml-16 -mb-16" />
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                 <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name}!</h2>
                 <p className="text-indigo-100 max-w-lg">Ready to report new community needs? Your data helps us prioritize and deliver aid faster.</p>
              </div>
              <Link href="/fieldstaff/create-case">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-50 font-bold h-14 rounded-full px-8 shadow-xl">
                  <PlusCircle className="mr-2 w-5 h-5" />
                  Report New Case
                </Button>
              </Link>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden hover:glass-card-hover transition-all duration-500 group">
               <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg ${stat.glow} group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Submissions */}
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
            <div className="flex flex-row items-center justify-between p-6 pb-0">
              <div>
                <h3 className="text-lg font-semibold">My Recent Submissions</h3>
                <p className="text-sm text-slate-500">Status tracking for your reported cases</p>
              </div>
              <Link href="/fieldstaff/my-cases">
                <Button variant="link" className="text-indigo-600 p-0 h-auto font-bold">View All History</Button>
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                 {myCases.slice(0, 4).map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-4 glass-card rounded-xl hover:glass-card-hover transition-all group">
                       <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg glass-card group-hover:bg-indigo-50/50 transition-colors">
                             <FileText className="w-5 h-5 text-indigo-500" />
                          </div>
                          <div>
                             <p className="font-bold text-slate-900">{c.title}</p>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-500">{c.category}</span>
                                <span className="text-[10px] text-slate-400">• Requested {new Date(c.createdAt).toLocaleDateString()}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <StatusBadge status={c.status} className="text-[10px]" />
                          <Link href={`/fieldstaff/my-cases/${c.id}`}>
                             <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-indigo-600 rounded-full">Details</Button>
                          </Link>
                       </div>
                    </div>
                 ))}
                 {myCases.length === 0 && !isLoading && (
                   <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-4">
                      <ClipboardList className="w-12 h-12 opacity-10" />
                      <p className="italic">No cases submitted yet.</p>
                      <Link href="/fieldstaff/create-case">
                        <Button variant="outline" size="sm" className="rounded-full">Report your first case</Button>
                      </Link>
                   </div>
                 )}
              </div>
            </div>
          </div>

          {/* Drafts & Activity */}
          <div className="space-y-8">
             <div className="glass-dark rounded-2xl text-white overflow-hidden">
                <div className="p-6 pb-0">
                  <h3 className="text-lg flex items-center gap-2 font-semibold">
                    <FileEdit className="w-5 h-5" /> Saved Drafts
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                   {[
                     { title: "Sewerage issue - Sector 7", date: "2 hours ago" },
                     { title: "Street light repair needed", date: "Yesterday" }
                   ].map((draft, i) => (
                      <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer backdrop-blur-sm">
                         <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{draft.title}</p>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                         <p className="text-[10px] text-slate-400 mt-1">Last edited {draft.date}</p>
                      </div>
                   ))}
                </div>
                <div className="px-6 pb-6">
                  <Link href="/fieldstaff/drafts" className="w-full">
                    <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-white/5 text-xs rounded-full">View all drafts</Button>
                  </Link>
                </div>
             </div>

             <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 pb-0">
                  <h3 className="text-base font-semibold">Field Notifications</h3>
                </div>
                <div className="p-6 space-y-4">
                   <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-pulse" />
                      <p className="text-xs text-slate-600">Admin requested more details on "Case #102: Sector 4 Shortage".</p>
                   </div>
                   <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-slate-600">Your case in "West Side" has been marked as completed.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
