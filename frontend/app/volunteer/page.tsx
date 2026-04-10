'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { VOLUNTEER_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight,
  ClipboardList,
  Heart,
  TrendingUp,
  AlertCircle,
  PlayCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import { mockService } from '@/lib/mock-service';
import { Case, User } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [assignedTasks, setAssignedTasks] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const allCases = await mockService.getCases();
        // Filter for cases assigned to this volunteer
        setAssignedTasks(allCases.filter(c => c.assignedVolunteerId === user.id));
      } catch (error) {
        console.error('Failed to load tasks', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const activeTasks = assignedTasks.filter(t => ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(t.status));
  const completedTasks = assignedTasks.filter(t => t.status === 'COMPLETED');

  const stats = [
    { title: 'Active Tasks', value: activeTasks.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Completed', value: completedTasks.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'People Helped', value: completedTasks.reduce((acc, curr) => acc + curr.peopleAffected, 0), icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Impact Score', value: (completedTasks.length * 10) + 5, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Volunteer Portal" allowedRoles={['VOLUNTEER']}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Salam, {user?.name}! 👋</h2>
              <p className="text-slate-500 mt-1">Ready to make a difference today? You have {activeTasks.length} active assignments.</p>
           </div>
           <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
              <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-indigo-100 shadow-lg">
                Active Duty
              </div>
              <div className="px-4 py-2 text-slate-400 text-sm font-medium">
                Offline
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm transition-transform hover:-translate-y-1">
               <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.bg} p-3 rounded-xl shadow-sm`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                      <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">{stat.value}</h3>
                    </div>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Task List */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-slate-800">Assigned Tasks</h3>
                <Link href="/volunteer/tasks">
                   <Button variant="link" className="text-indigo-600 font-bold">View All Tasks</Button>
                </Link>
             </div>

             <div className="grid gap-4">
                {activeTasks.length > 0 ? activeTasks.map(task => (
                   <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-all group border-l-4 border-l-indigo-500">
                      <CardContent className="p-6">
                         <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-3">
                               <div className="flex items-center gap-2">
                                  <StatusBadge status={task.status} />
                                  <PriorityBadge priority={task.severity} />
                               </div>
                               <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{task.title}</h4>
                               <div className="flex items-center gap-4 text-sm text-slate-500">
                                  <div className="flex items-center gap-1.5 font-medium">
                                     <MapPin className="w-4 h-4 text-rose-500" />
                                     {task.location.area}
                                  </div>
                                  <div className="flex items-center gap-1.5 font-medium">
                                     <ClipboardList className="w-4 h-4 text-indigo-400" />
                                     {task.category}
                                  </div>
                               </div>
                            </div>
                            <div className="flex flex-col justify-between items-end gap-3 min-w-[120px]">
                               <Link href={`/volunteer/tasks/${task.id}`} className="w-full">
                                  <Button className="w-full bg-slate-900 hover:bg-indigo-600 text-white gap-2 font-bold shadow-lg shadow-slate-100">
                                     <PlayCircle className="w-4 h-4" /> Start Action
                                  </Button>
                               </Link>
                               <span className="text-[10px] text-slate-400 font-medium italic">Assigned {new Date(task.updatedAt).toLocaleDateString()}</span>
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                )) : (
                   <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center space-y-4">
                      <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                         <ClipboardList className="w-8 h-8 text-slate-200" />
                      </div>
                      <div className="space-y-1">
                         <p className="font-bold text-slate-900">No active tasks assigned.</p>
                         <p className="text-sm text-slate-500">You're all caught up! Take some rest or check historical tasks.</p>
                      </div>
                   </div>
                )}
             </div>
          </div>

          {/* Side Feedback / Activity */}
          <div className="space-y-8">
             <Card className="border-none shadow-sm bg-indigo-600 text-white overflow-hidden">
                <div className="p-6 space-y-6 relative z-10">
                   <CardTitle className="text-lg">Your Impact Pulse</CardTitle>
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Level 3 Contributor</span>
                         <span className="text-2xl font-black">450 XP</span>
                      </div>
                      <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                         <div className="h-full bg-white w-3/4 rounded-full" />
                      </div>
                      <p className="text-xs text-indigo-100 italic">50 XP more to unlock "Expert Distributor" badge.</p>
                   </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
             </Card>

             <Card className="border-none shadow-sm">
                <CardHeader>
                   <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" /> System Update
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-slate-600 leading-relaxed italic">
                   "New medical guidelines for slum areas have been updated in the resource portal. Please review before your next Health-category task."
                </CardContent>
                <CardFooter>
                   <Button variant="link" className="text-indigo-600 text-[10px] p-0 h-auto font-bold uppercase tracking-widest">Read Guidelines</Button>
                </CardFooter>
             </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
