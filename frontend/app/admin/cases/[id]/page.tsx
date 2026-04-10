'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { ADMIN_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Calendar, 
  Clock, 
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LifeBuoy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockService } from '@/lib/mock-service';
import { Case, Volunteer, User } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function CaseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
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
          toast.error('Case not found');
          router.push('/admin/cases');
        }
      } catch (error) {
        console.error('Error loading data', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, router]);

  const handleStatusUpdate = async (newStatus: any, note?: string) => {
    if (!caseData || !currentUser) return;
    try {
      const updated = await mockService.updateCaseStatus(caseData.id, newStatus, currentUser, note);
      setCaseData(updated);
      toast.success(`Case status updated to ${newStatus.replace(/_/g, ' ').toLowerCase()}`);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleAssign = async (volunteerId: string) => {
    if (!caseData || !currentUser) return;
    try {
      const updated = await mockService.assignVolunteer(caseData.id, volunteerId, currentUser);
      setCaseData(updated);
      toast.success(`Volunteer assigned successfully`);
    } catch (e) {
      toast.error('Assignment failed');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading case details...</div>;
  if (!caseData) return null;

  const assignedVolunteer = volunteers.find(v => v.id === caseData.assignedVolunteerId);

  return (
    <DashboardShell navItems={NAV_ITEMS} title={`Case #${caseData.id.split('-').pop()}`} allowedRoles={['ADMIN']}>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-4">
            <Button variant="ghost" size="sm" className="pl-0 gap-1 text-slate-500 hover:text-indigo-600" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" /> Back to Queue
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={caseData.status} className="text-sm px-3 py-1" />
                <PriorityBadge priority={caseData.severity} className="text-sm px-3 py-1" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{caseData.title}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {caseData.status === 'SUBMITTED' && (
              <Button className="bg-indigo-600" onClick={() => handleStatusUpdate('READY_FOR_ASSIGNMENT', 'Verified by Admin')}>
                Approve & Ready for Assignment
              </Button>
            )}
            {caseData.status === 'COMPLETED_PENDING_VERIFICATION' && (
              <>
                <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => handleStatusUpdate('IN_PROGRESS', 'Proof rejected, needs more work')}>
                  Reject Proof
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusUpdate('COMPLETED', 'Verified and closed')}>
                  Verify & Close Case
                </Button>
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Actions <ChevronRight className="w-4 h-4 ml-2 rotate-90" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusUpdate('ESCALATED', 'Urgent escalation requested')}>Escalate</DropdownMenuItem>
                <DropdownMenuItem className="text-rose-600" onClick={() => handleStatusUpdate('FAILED', 'Could not be completed')}>Mark as Failed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <CardTitle className="text-lg">Detailed Summary</CardTitle>
               </CardHeader>
               <CardContent className="pt-6 space-y-6">
                  <div>
                     <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                     <p className="text-slate-700 leading-relaxed italic">{caseData.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Category</h4>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-slate-100 rounded-md">
                           <LifeBuoy className="w-4 h-4 text-slate-600" />
                        </span>
                        <span className="font-semibold text-slate-800">{caseData.category}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">People Affected</h4>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-slate-100 rounded-md">
                           <Users className="w-4 h-4 text-slate-600" />
                        </span>
                        <span className="font-semibold text-slate-800">{caseData.peopleAffected}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-50" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Location & Mapping</h4>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="bg-white p-2 border border-slate-100 rounded-lg shadow-sm shrink-0">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{caseData.location.address}</p>
                        <p className="text-sm text-slate-500 capitalize">{caseData.location.area}</p>
                        <Button variant="link" className="p-0 h-auto text-indigo-600 text-xs mt-1">Open in Google Maps</Button>
                      </div>
                    </div>
                    <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                       <p className="text-slate-400 text-sm italic">Interactive Map Placeholder</p>
                    </div>
                  </div>
               </CardContent>
            </Card>

            {/* Proof of Completion Section */}
            {caseData.proofOfCompletion && (
              <Card className="border-none shadow-sm border-2 border-emerald-100 bg-emerald-50/20">
                <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
                  <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
                    <ShieldCheck className="w-5 h-5" /> Completion Proof
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">Volunteer Notes</p>
                    <p className="text-slate-700 italic">{caseData.proofOfCompletion.notes}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {caseData.proofOfCompletion.attachments.map((img, i) => (
                      <div key={i} className="aspect-square bg-slate-200 rounded-lg overflow-hidden border border-slate-100 relative group cursor-pointer">
                        <img src={img} alt="proof" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ImageIcon className="text-white w-6 h-6" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History Timeline */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-100">
                  {caseData.history.slice().reverse().map((event, i) => (
                    <div key={event.id} className="relative pl-10">
                      <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                        i === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                           <StatusBadge status={event.status} className="text-[10px]" />
                           <span className="text-[10px] text-slate-400 font-medium">{new Date(event.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800">{event.actorName}</p>
                        {event.note && <p className="text-xs text-slate-500 mt-1 italic">"{event.note}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Current Assignment / Assign Tool */}
            <Card className="border-none shadow-sm overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <CardTitle className="text-lg">Engagement</CardTitle>
               </CardHeader>
               <CardContent className="pt-6">
                  {caseData.assignedVolunteerId ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-indigo-100">
                          <AvatarImage src={assignedVolunteer?.avatar} />
                          <AvatarFallback>{assignedVolunteer?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900">{assignedVolunteer?.name}</p>
                          <p className="text-xs text-indigo-600 font-medium">Assigned Volunteer</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {assignedVolunteer?.specialties.map(s => (
                          <span key={s} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-medium text-slate-500">{s}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Contact</Button>
                        <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => handleAssign('')}>Reassign</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                         <UserPlus className="w-5 h-5 text-amber-600 shrink-0" />
                         <p className="text-sm text-amber-800 leading-tight">This case is awaiting a volunteer assignment.</p>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recommended</h4>
                        {volunteers.slice(0, 3).map(v => (
                           <div key={v.id} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 border border-slate-100">
                                  <AvatarImage src={v.avatar} />
                                  <AvatarFallback>{v.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{v.name}</p>
                                  <p className="text-[10px] text-emerald-600 font-bold">{v.rating} ⭐ • {v.location}</p>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleAssign(v.id)}
                              >
                                Assign
                              </Button>
                           </div>
                        ))}
                        <Button variant="link" className="text-indigo-600 text-xs p-0 h-auto w-full text-center">View More Volunteers</Button>
                      </div>
                    </div>
                  )}
               </CardContent>
            </Card>

            {/* Reported By */}
            <Card className="border-none shadow-sm">
               <CardHeader>
                  <CardTitle className="text-base">Field Intake</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                     <Avatar className="w-8 h-8 border border-slate-100">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" />
                        <AvatarFallback>MC</AvatarFallback>
                     </Avatar>
                     <div className="text-sm">
                        <p className="font-bold text-slate-900">Michael Chen</p>
                        <p className="text-xs text-slate-400 font-medium">Field Staff</p>
                     </div>
                  </div>
                  <div className="p-3 bg-indigo-50/50 rounded-lg text-xs italic text-indigo-700">
                    "This area has been without water for 48 hours. Community is distressed. Pipe repairs estimated at 3 days."
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

