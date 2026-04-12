'use client';

import React from 'react';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { FIELD_STAFF_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  FileEdit, 
  Trash2, 
  Clock, 
  ArrowRight,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function FieldStaffDrafts() {
  const drafts = [
    { id: 'd1', title: 'Sewerage issue - Sector 7, HSR', date: '2 hours ago', progress: 40 },
    { id: 'd2', title: 'Street light repair needed - Malabar Hill', date: 'Yesterday', progress: 80 },
    { id: 'd3', title: 'Medical request - Dharavi Slums', date: '3 days ago', progress: 20 },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Saved Drafts" allowedRoles={['FIELD_STAFF']}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Work in <span className="text-gradient">Progress</span></h2>
              <p className="text-slate-500 text-sm">Resume your incomplete case reports.</p>
           </div>
           <Link href="/fieldstaff/create-case">
             <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 font-bold rounded-full shadow-lg shadow-indigo-500/20">Start New Case</Button>
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {drafts.map((draft) => (
              <div key={draft.id} className="glass-card rounded-2xl overflow-hidden hover:glass-card-hover transition-all duration-500 group flex flex-col">
                 <div className={`h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500`} />
                 <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Edited {draft.date}
                       </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{draft.title}</h3>
                 </div>
                 <div className="px-6 pb-4 flex-1">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                          <span>Completion</span>
                          <span>{draft.progress}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100/50 rounded-full overflow-hidden backdrop-blur-sm">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${draft.progress}%` }} />
                       </div>
                    </div>
                 </div>
                 <div className="px-6 pb-6 flex gap-2">
                    <Link href="/fieldstaff/create-case" className="flex-1">
                       <Button variant="outline" size="sm" className="w-full gap-2 rounded-full glass-card border-white/30 hover:glass-card-hover transition-all">
                          <FileEdit className="w-3.5 h-3.5" /> Resume
                       </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-50/50 px-2 rounded-full" onClick={() => toast.success('Draft deleted')}>
                       <Trash2 className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
           ))}
        </div>

        {drafts.length === 0 && (
           <div className="py-24 text-center space-y-4">
              <ClipboardList className="w-12 h-12 text-slate-100 mx-auto" />
              <p className="text-slate-400 italic">No saved drafts found.</p>
           </div>
        )}

        <div className="p-6 glass-card rounded-2xl flex gap-3 text-amber-900 border border-amber-200/30">
           <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
           <p className="text-sm italic">Drafts are saved locally in this browser. Clearing your cache will remove incomplete drafts.</p>
        </div>
      </div>
    </DashboardShell>
  );
}
