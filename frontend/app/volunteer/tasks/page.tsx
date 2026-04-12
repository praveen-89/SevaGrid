'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { VOLUNTEER_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  Search, 
  MapPin, 
  Clock, 
  ClipboardList, 
  PlayCircle,
  Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import { mockService } from '@/lib/mock-service';
import { Case } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function VolunteerTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const all = await mockService.getCases();
        setTasks(all.filter(c => c.assignedVolunteerId === user.id && !['COMPLETED', 'FAILED'].includes(c.status)));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  return (
    <DashboardShell navItems={NAV_ITEMS} title="My Active Tasks" allowedRoles={['VOLUNTEER']}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Active <span className="text-gradient">Assignments</span></h2>
              <p className="text-slate-500 text-sm">Review instructions and execute your currently assigned tasks.</p>
           </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
           <div className="flex items-center gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <Input placeholder="Search tasks..." className="pl-10 rounded-full glass-input" />
              </div>
              <Button variant="outline" className="gap-2 rounded-full glass-card border-white/30 hover:glass-card-hover transition-all"><Filter className="w-4 h-4" /> Filters</Button>
           </div>
        </div>

        <div className="space-y-4">
           {tasks.map((task) => (
              <div key={task.id} className="glass-card rounded-2xl overflow-hidden hover:glass-card-hover transition-all duration-500 group border-r-4 border-r-indigo-500">
                 <div className="flex flex-col md:flex-row items-center">
                    <div className="p-6 flex-1 space-y-4 border-b md:border-b-0 md:border-r border-white/20">
                       <div className="flex items-center gap-2">
                          <StatusBadge status={task.status} />
                          <PriorityBadge priority={task.severity} />
                       </div>
                       <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{task.title}</h3>
                       <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {task.location.area}</div>
                          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Assigned {new Date(task.updatedAt).toLocaleDateString()}</div>
                       </div>
                    </div>
                    <div className="p-6 bg-white/20 w-full md:w-48 flex items-center justify-center backdrop-blur-sm">
                        <Link href={`/volunteer/tasks/${task.id}`} className="w-full">
                           <Button className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-indigo-600 hover:to-violet-600 text-white gap-2 font-bold transition-all rounded-full shadow-lg">
                              Open Task <PlayCircle className="w-4 h-4" />
                           </Button>
                        </Link>
                    </div>
                 </div>
              </div>
           ))}

           {tasks.length === 0 && !isLoading && (
             <div className="py-24 text-center space-y-4 glass-card rounded-3xl border-2 border-dashed border-white/30">
                <ClipboardList className="w-12 h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 italic">No active tasks in your queue.</p>
             </div>
           )}
        </div>
      </div>
    </DashboardShell>
  );
}
