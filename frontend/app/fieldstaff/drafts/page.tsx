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
    { id: 'd1', title: 'Sewerage issue - Sector 7', date: '2 hours ago', progress: 40 },
    { id: 'd2', title: 'Street light repair needed - North Hill', date: 'Yesterday', progress: 80 },
    { id: 'd3', title: 'Medical request - East Slums', date: '3 days ago', progress: 20 },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Saved Drafts" allowedRoles={['FIELD_STAFF']}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Work in Progress</h2>
              <p className="text-slate-500 text-sm">Resume your incomplete case reports.</p>
           </div>
           <Link href="/fieldstaff/create-case">
             <Button className="bg-indigo-600 font-bold">Start New Case</Button>
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {drafts.map((draft) => (
              <Card key={draft.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden border-t-4 border-t-slate-400">
                 <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Edited {draft.date}
                       </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">{draft.title}</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                          <span>Completion</span>
                          <span>{draft.progress}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${draft.progress}%` }} />
                       </div>
                    </div>
                 </CardContent>
                 <CardFooter className="pt-0 flex gap-2">
                    <Link href="/fieldstaff/create-case" className="flex-1">
                       <Button variant="outline" size="sm" className="w-full gap-2 hover:bg-indigo-50 hover:text-indigo-600">
                          <FileEdit className="w-3.5 h-3.5" /> Resume
                       </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-50 px-2" onClick={() => toast.success('Draft deleted')}>
                       <Trash2 className="w-4 h-4" />
                    </Button>
                 </CardFooter>
              </Card>
           ))}
        </div>

        {drafts.length === 0 && (
           <div className="py-24 text-center space-y-4">
              <ClipboardList className="w-12 h-12 text-slate-100 mx-auto" />
              <p className="text-slate-400 italic">No saved drafts found.</p>
           </div>
        )}

        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-900">
           <AlertCircle className="w-5 h-5 shrink-0" />
           <p className="text-sm italic">Drafts are saved locally in this browser. Clearing your cache will remove incomplete drafts.</p>
        </div>
      </div>
    </DashboardShell>
  );
}
