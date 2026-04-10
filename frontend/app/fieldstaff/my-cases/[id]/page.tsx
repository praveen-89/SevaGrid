'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { FIELD_STAFF_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  LifeBuoy,
  MessageSquare,
  ShieldCheck,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockService } from '@/lib/mock-service';
import { Case, Volunteer } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function FieldStaffCaseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [c, v] = await Promise.all([
          mockService.getCaseById(id as string),
          mockService.getVolunteers()
        ]);
        if (c) {
          setCaseData(c);
          setVolunteers(v);
        } else {
          router.push('/fieldstaff/my-cases');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, router]);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
  if (!caseData) return null;

  const assignedVolunteer = volunteers.find(v => v.id === caseData.assignedVolunteerId);

  return (
    <DashboardShell navItems={NAV_ITEMS} title={`Case Tracking #${caseData.id.split('-').pop()}`} allowedRoles={['FIELD_STAFF']}>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="space-y-4">
           <Button variant="ghost" size="sm" className="pl-0 gap-1 text-slate-500 hover:text-indigo-600" onClick={() => router.back()}>
             <ArrowLeft className="w-4 h-4" /> Back to History
           </Button>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <StatusBadge status={caseData.status} className="text-sm px-3 py-1" />
                    <PriorityBadge priority={caseData.severity} className="text-sm px-3 py-1" />
                 </div>
                 <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase italic">{caseData.title}</h2>
              </div>
              <Button variant="outline" className="gap-2">
                 <MessageSquare className="w-4 h-4" /> Message Admin
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-sm">
                 <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-lg">Case Intake Record</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-6">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-600">
                       "{caseData.description}"
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-sm">
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Impact Group</p>
                          <p className="font-bold flex items-center gap-2">
                             <Users className="w-4 h-4 text-slate-400" /> {caseData.peopleAffected} People Affected
                          </p>
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Service Category</p>
                          <p className="font-bold flex items-center gap-2">
                             <LifeBuoy className="w-4 h-4 text-slate-400" /> {caseData.category}
                          </p>
                       </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    <div className="space-y-3">
                       <h4 className="text-sm font-bold text-slate-900">Registered Location</h4>
                       <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <MapPin className="w-5 h-5 text-rose-500" />
                          <div>
                             <p className="font-bold text-slate-900">{caseData.location.address}</p>
                             <p className="text-xs text-slate-500">{caseData.location.area}</p>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              {/* Status Timeline */}
              <Card className="border-none shadow-sm">
                 <CardHeader>
                    <CardTitle className="text-lg">Response Timeline</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
                       {caseData.history.slice().reverse().map((h, i) => (
                          <div key={h.id} className="relative pl-10">
                             <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                                i === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                             }`}>
                                <Clock className="w-3.5 h-3.5" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                   <StatusBadge status={h.status} className="text-[10px]" />
                                   <span className="text-[10px] font-bold text-slate-400">{new Date(h.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-900">{h.actorName}</p>
                                {h.note && <p className="text-xs text-slate-500 mt-1">"{h.note}"</p>}
                             </div>
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>

           <div className="space-y-6">
              {/* Assigned Asset */}
              <Card className="border-none shadow-sm overflow-hidden">
                 <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Response Staff</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6">
                    {caseData.assignedVolunteerId ? (
                       <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 border-2 border-indigo-100">
                             <AvatarImage src={assignedVolunteer?.avatar} />
                             <AvatarFallback>{assignedVolunteer?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                             <p className="font-bold text-slate-900">{assignedVolunteer?.name}</p>
                             <p className="text-xs text-indigo-600 font-bold">Field Volunteer Assigned</p>
                          </div>
                       </div>
                    ) : (
                       <div className="text-center py-6 space-y-3">
                          <Users className="w-10 h-10 text-slate-200 mx-auto" />
                          <p className="text-sm text-slate-500 font-medium italic">Awaiting NGO assignment.</p>
                       </div>
                    )}
                 </CardContent>
              </Card>

              {/* Internal ID Info */}
              <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl">
                 <div className="flex items-center gap-2 text-indigo-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Tracking Number</span>
                 </div>
                 <p className="text-2xl font-black tracking-widest font-mono">{caseData.id.split('-').pop()?.toUpperCase()}</p>
                 <Separator className="bg-white/10" />
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50">Created on</span>
                    <span className="font-bold">{new Date(caseData.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
