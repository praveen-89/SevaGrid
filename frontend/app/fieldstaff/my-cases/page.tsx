'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { FIELD_STAFF_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  Search, 
  Filter, 
  ArrowLeft,
  FileText,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import { mockService } from '@/lib/mock-service';
import { Case } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function FieldStaffMyCases() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const all = await mockService.getCases();
        setCases(all.filter(c => c.fieldStaffId === user.id));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const filtered = cases.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.location.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell navItems={NAV_ITEMS} title="My Submissions" allowedRoles={['FIELD_STAFF']}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Submission <span className="text-gradient">History</span></h2>
              <p className="text-slate-500 text-sm">Review status and responses for your reported community needs.</p>
           </div>
           <Link href="/fieldstaff/create-case">
             <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 font-bold shadow-lg shadow-indigo-500/20 rounded-full">Report New Need</Button>
           </Link>
        </div>

        <div className="glass-card rounded-2xl p-6">
           <div className="flex items-center gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <Input 
                   placeholder="Search my cases..." 
                   className="pl-10 rounded-full glass-input"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
              </div>
              <Button variant="outline" className="gap-2 rounded-full glass-card border-white/30 hover:glass-card-hover transition-all"><Filter className="w-4 h-4" /> Filters</Button>
           </div>
        </div>

        <div className="space-y-4">
           {filtered.map((c) => (
              <div key={c.id} className="glass-card rounded-2xl overflow-hidden group hover:glass-card-hover transition-all duration-500">
                 <div className="flex flex-col md:flex-row items-center">
                    <div className="p-6 flex-1 space-y-4 border-b md:border-b-0 md:border-r border-white/20">
                       <div className="flex items-center gap-2">
                          <StatusBadge status={c.status} />
                          <PriorityBadge priority={c.severity} />
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{c.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-1 italic">"{c.description}"</p>
                       </div>
                       <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
                          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {c.location.area}</div>
                          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Submitted {new Date(c.createdAt).toLocaleDateString()}</div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-600 glass-card px-2 py-0.5 rounded-full">#{c.id.split('-').pop()}</div>
                       </div>
                    </div>
                    <div className="p-6 bg-white/20 w-full md:w-48 flex md:flex-col justify-between items-center gap-4 backdrop-blur-sm">
                        <div className="text-center md:w-full">
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Impact</p>
                           <p className="text-lg font-black text-slate-900">{c.peopleAffected} People</p>
                        </div>
                        <Link href={`/fieldstaff/my-cases/${c.id}`} className="w-full">
                           <Button variant="outline" className="w-full glass-card border-white/30 group-hover:border-indigo-400/50 group-hover:text-indigo-600 transition-all font-bold rounded-full">
                              Details <ChevronRight className="ml-2 w-4 h-4" />
                           </Button>
                        </Link>
                    </div>
                 </div>
              </div>
           ))}

           {filtered.length === 0 && !isLoading && (
             <div className="py-24 text-center space-y-4">
                <FileText className="w-12 h-12 text-slate-100 mx-auto" />
                <p className="text-slate-400 italic">No submissions found matching your search.</p>
             </div>
           )}
        </div>
      </div>
    </DashboardShell>
  );
}
