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
  AlertCircle
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
    { title: 'My Submitted Cases', value: myCases.length, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Pending Review', value: myCases.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Drafts', value: 3, icon: FileEdit, color: 'text-slate-600', bg: 'bg-slate-50' },
    { title: 'Completed Tasks', value: myCases.filter(c => c.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Field Staff Portal" allowedRoles={['FIELD_STAFF']}>
      <div className="space-y-8">
        {/* Header & Quick Action */}
        <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100 mb-10">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                 <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name}!</h2>
                 <p className="text-indigo-100 max-w-lg">Ready to report new community needs? Your data helps us prioritize and deliver aid faster.</p>
              </div>
              <Link href="/fieldstaff/create-case">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-50 font-bold h-14 px-8 shadow-lg">
                  <PlusCircle className="mr-2 w-5 h-5" />
                  Report New Case
                </Button>
              </Link>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
               <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.bg} p-3 rounded-xl`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                    </div>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Submissions */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">My Recent Submissions</CardTitle>
                <CardDescription>Status tracking for your reported cases</CardDescription>
              </div>
              <Link href="/fieldstaff/my-cases">
                <Button variant="link" className="text-indigo-600 p-0 h-auto">View All History</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                 {myCases.slice(0, 4).map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                       <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg bg-white border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors`}>
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
                             <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-indigo-600">Details</Button>
                          </Link>
                       </div>
                    </div>
                 ))}
                 {myCases.length === 0 && !isLoading && (
                   <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-4">
                      <ClipboardList className="w-12 h-12 opacity-10" />
                      <p className="italic">No cases submitted yet.</p>
                      <Link href="/fieldstaff/create-case">
                        <Button variant="outline" size="sm">Report your first case</Button>
                      </Link>
                   </div>
                 )}
              </div>
            </CardContent>
          </Card>

          {/* Drafts & Activity */}
          <div className="space-y-8">
             <Card className="border-none shadow-sm bg-slate-900 text-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileEdit className="w-5 h-5" /> Saved Drafts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {[
                     { title: "Sewerage issue - Sector 7", date: "2 hours ago" },
                     { title: "Street light repair needed", date: "Yesterday" }
                   ].map((draft, i) => (
                      <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer">
                         <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{draft.title}</p>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                         <p className="text-[10px] text-slate-400 mt-1">Last edited {draft.date}</p>
                      </div>
                   ))}
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href="/fieldstaff/drafts" className="w-full">
                    <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-white/5 text-xs">View all drafts</Button>
                  </Link>
                </CardFooter>
             </Card>

             <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Field Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-slate-600">Admin requested more details on "Case #102: Sector 4 Shortage".</p>
                   </div>
                   <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-slate-600">Your case in "West Side" has been marked as completed.</p>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
