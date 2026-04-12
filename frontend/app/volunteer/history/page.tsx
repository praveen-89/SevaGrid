'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { VOLUNTEER_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  Search, 
  History, 
  MapPin, 
  CheckCircle2, 
  Filter,
  Users,
  Calendar,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import { mockService } from '@/lib/mock-service';
import { Case } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function VolunteerHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Case[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const all = await mockService.getCases();
        setHistory(all.filter(c => c.assignedVolunteerId === user.id && ['COMPLETED', 'FAILED'].includes(c.status)));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  return (
    <DashboardShell navItems={NAV_ITEMS} title="My Contribution History" allowedRoles={['VOLUNTEER']}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Past <span className="text-gradient">Impact</span></h2>
              <p className="text-slate-500 text-sm">A record of all your completed community tasks.</p>
           </div>
           <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <Award className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-emerald-800 text-sm">{history.length} Tasks Finalized</span>
           </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
           <div className="flex items-center gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <Input 
                   placeholder="Search history..." 
                   className="pl-10 rounded-full glass-input"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
              </div>
              <Button variant="outline" className="gap-2 rounded-full glass-card border-white/30 hover:glass-card-hover transition-all"><Filter className="w-4 h-4" /> Filters</Button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {history.map((c) => (
              <div key={c.id} className="glass-card rounded-2xl overflow-hidden group hover:glass-card-hover transition-all duration-500 border-l-4 border-l-emerald-500 flex flex-col">
                 <div className="p-6 pb-2">
                    <div className="flex justify-between items-start mb-3">
                       <StatusBadge status={c.status} className="text-[10px]" />
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Completed {new Date(c.updatedAt).toLocaleDateString()}
                       </p>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{c.title}</h3>
                    <p className="flex items-center gap-1 mt-1 font-medium text-sm text-slate-500">
                       <MapPin className="w-3 h-3 text-rose-500" /> {c.location.area}
                    </p>
                 </div>
                 <div className="px-6 pb-4 flex-1">
                    <div className="p-3 glass-card rounded-xl text-xs italic text-slate-600 line-clamp-2">
                       "{c.proofOfCompletion?.notes || 'No notes provided.'}"
                    </div>
                 </div>
                 <div className="px-6 pb-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <Users className="w-4 h-4 text-indigo-400" />
                       <span className="text-[11px] font-bold text-slate-500">{c.peopleAffected} People Impacted</span>
                    </div>
                    <Link href={`/volunteer/tasks/${c.id}`}>
                       <Button variant="ghost" size="sm" className="text-indigo-600 font-bold text-xs h-8 rounded-full">Review Details</Button>
                    </Link>
                 </div>
              </div>
           ))}
           
           {history.length === 0 && !isLoading && (
             <div className="md:col-span-2 py-24 text-center space-y-4 glass-card rounded-3xl border-2 border-dashed border-white/30">
                <History className="w-12 h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 italic">No historical tasks found.</p>
                <Link href="/volunteer">
                   <Button variant="link" className="text-indigo-600 font-bold">Check Active Tasks</Button>
                </Link>
             </div>
           )}
        </div>
      </div>
    </DashboardShell>
  );
}
