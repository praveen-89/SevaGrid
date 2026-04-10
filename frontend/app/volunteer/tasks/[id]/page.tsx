'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { VOLUNTEER_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  FileText, 
  CheckCircle2, 
  XCircle,
  PlayCircle,
  Camera,
  MessageSquare,
  AlertTriangle,
  Loader2,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockService } from '@/lib/mock-service';
import { Case, User } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function VolunteerTaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [task, setTask] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [proofNotes, setProofNotes] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const t = await mockService.getCaseById(id as string);
        if (t) setTask(t);
        else router.push('/volunteer/tasks');
      } catch (error) {
        console.error('Error loading task', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, router]);

  const handleAction = async (newStatus: any, note?: string) => {
    if (!task || !user) return;
    setIsActionLoading(true);
    try {
      const updated = await mockService.updateCaseStatus(task.id, newStatus, user, note);
      setTask(updated);
      toast.success(`Task status updated to ${newStatus.replace(/_/g, ' ').toLowerCase()}`);
      if (newStatus === 'COMPLETED_PENDING_VERIFICATION') {
        router.push('/volunteer');
      }
    } catch (e) {
      toast.error('Action failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-medium">Loading task data...</div>;
  if (!task) return null;

  const isAssigned = task.status === 'ASSIGNED';
  const isAccepted = task.status === 'ACCEPTED';
  const isInProgress = task.status === 'IN_PROGRESS';

  return (
    <DashboardShell navItems={NAV_ITEMS} title={`Task #${task.id.split('-').pop()}`} allowedRoles={['VOLUNTEER']}>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div className="space-y-4">
              <Button variant="ghost" size="sm" className="pl-0 gap-1 text-slate-500 hover:text-indigo-600" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4" /> Back to My Tasks
              </Button>
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.severity} />
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">{task.title}</h2>
              </div>
           </div>
           
           <div className="flex gap-2">
             {isAssigned && (
               <>
                 <Button variant="outline" className="text-rose-600 border-rose-200" onClick={() => handleAction('READY_FOR_ASSIGNMENT', 'Rejected by volunteer')} disabled={isActionLoading}>
                    Decline Task
                 </Button>
                 <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction('ACCEPTED')} disabled={isActionLoading}>
                    Accept Assignment
                 </Button>
               </>
             )}
             {isAccepted && (
               <Button className="bg-indigo-600 w-full md:w-auto" onClick={() => handleAction('IN_PROGRESS')} disabled={isActionLoading}>
                 <PlayCircle className="w-4 h-4 mr-2" /> Mark as In Progress
               </Button>
             )}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Detailed Information */}
           <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-sm overflow-hidden">
                 <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-lg">Instructions & Context</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-6">
                    <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-900 italic text-sm">
                       "{task.description}"
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <Label className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Target Community</Label>
                          <p className="font-bold text-slate-900 mt-1">{task.location.area}</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <Label className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Scope</Label>
                          <p className="font-bold text-slate-900 mt-1">~{task.peopleAffected} People</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-sm font-bold text-slate-900">Task Site Location</h4>
                       <div className="flex items-start gap-3 p-4 bg-white rounded-xl border-2 border-slate-100">
                          <MapPin className="w-5 h-5 text-rose-500 mt-0.5" />
                          <div>
                             <p className="font-bold text-slate-900">{task.location.address}</p>
                             <p className="text-sm text-slate-500">{task.location.area}</p>
                             <Button variant="link" className="p-0 h-auto text-indigo-600 text-xs mt-2 font-bold uppercase tracking-tighter flex items-center gap-1">
                                Get Precise Directions <ArrowLeft className="w-3 h-3 rotate-180" />
                             </Button>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              {/* Progress and Logic */}
              {(isInProgress || task.status === 'COMPLETED_PENDING_VERIFICATION') && (
                <Card className="border-none shadow-xl border-t-4 border-t-indigo-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                       <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Completion Submission
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isInProgress ? (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                          <Label htmlFor="proof-notes" className="font-bold text-slate-700">Completion Notes</Label>
                          <Textarea 
                            id="proof-notes" 
                            placeholder="Describe how the task was completed and any results achieved..." 
                            className="min-h-[120px] bg-slate-50 border-slate-200"
                            value={proofNotes}
                            onChange={(e) => setProofNotes(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-bold text-slate-700">Photo Proof (Required)</Label>
                          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-white hover:border-indigo-400 transition-all cursor-pointer">
                             <div className="bg-white p-3 rounded-full shadow-md mb-3 border border-slate-100">
                                <Camera className="w-6 h-6 text-indigo-600" />
                             </div>
                             <p className="font-bold text-slate-700">Capture or Upload Photo</p>
                             <p className="text-xs">Ensures transparency for the verification team.</p>
                          </div>
                        </div>
                        <Button 
                          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100" 
                          onClick={() => handleAction('COMPLETED_PENDING_VERIFICATION', proofNotes)}
                          disabled={!proofNotes || isActionLoading}
                        >
                          {isActionLoading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                          Submit for Verification
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                         <div className="bg-emerald-500 text-white p-2 rounded-full">
                            <CheckCircle2 className="w-6 h-6" />
                         </div>
                         <div className="space-y-1">
                            <p className="font-bold text-emerald-900">Proof Submitted</p>
                            <p className="text-sm text-emerald-700">Waiting for NGO Admin to verify and close this case.</p>
                         </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
           </div>

           {/* Sidebar - Support & Timelines */}
           <div className="space-y-6">
              <Card className="border-none shadow-sm bg-slate-900 text-white">
                 <CardHeader>
                    <CardTitle className="text-base">Support Channels</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 justify-start h-12">
                       <MessageSquare className="w-4 h-4 mr-3 text-indigo-400" /> WhatsApp Support
                    </Button>
                    <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 justify-start h-12">
                       <Info className="w-4 h-4 mr-3 text-emerald-400" /> Help Documentation
                    </Button>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-sm overflow-hidden">
                 <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Timeline</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6">
                    <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
                       {task.history.slice().reverse().map((h, i) => (
                          <div key={h.id} className="relative pl-8">
                             <div className={`absolute left-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                                i === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                             }`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                             </div>
                             <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-900">{h.status.toLowerCase().replace(/_/g, ' ')}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{new Date(h.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>

              <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-rose-900">
                 <AlertTriangle className="w-5 h-5 shrink-0" />
                 <div className="space-y-1">
                    <p className="text-sm font-bold">Safety First</p>
                    <p className="text-xs leading-relaxed">Always maintain distance and follow emergency protocols while on the field.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
