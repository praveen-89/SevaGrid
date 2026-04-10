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
              <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Active Assignments</h2>
              <p className="text-slate-500 text-sm">Review instructions and execute your currently assigned tasks.</p>
           </div>
        </div>

        <Card className="border-none shadow-sm">
           <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search tasks..." className="pl-10" />
                 </div>
                 <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" /> Filters</Button>
              </div>
           </CardContent>
        </Card>

        <div className="space-y-4">
           {tasks.map((task) => (
              <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden border-r-4 border-r-indigo-500">
                 <div className="flex flex-col md:flex-row items-center">
                    <div className="p-6 flex-1 space-y-4 border-b md:border-b-0 md:border-r border-slate-50">
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
                    <div className="p-6 bg-slate-50/50 w-full md:w-48 flex items-center justify-center">
                        <Link href={`/volunteer/tasks/${task.id}`} className="w-full">
                           <Button className="w-full bg-slate-900 hover:bg-indigo-600 text-white gap-2 font-bold transition-all">
                              Open Task <PlayCircle className="w-4 h-4" />
                           </Button>
                        </Link>
                    </div>
                 </div>
              </Card>
           ))}

           {tasks.length === 0 && !isLoading && (
             <div className="py-24 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                <ClipboardList className="w-12 h-12 text-slate-100 mx-auto" />
                <p className="text-slate-400 italic">No active tasks in your queue.</p>
             </div>
           )}
        </div>
      </div>
    </DashboardShell>
  );
}
