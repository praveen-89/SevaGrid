'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { FIELD_STAFF_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ClipboardList, 
  MapPin, 
  Users, 
  FileText, 
  Image as ImageIcon,
  Save,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { mockService } from '@/lib/mock-service';
import { useAuth } from '@/context/AuthContext';
import { CasePriority, CaseStatus } from '@/lib/types';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: FileText },
  { id: 2, title: 'Impact', icon: Users },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Extra Details', icon: ImageIcon },
  { id: 5, title: 'Review', icon: CheckCircle2 },
];

export default function CreateCasePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'MEDIUM' as CasePriority,
    peopleAffected: 0,
    address: '',
    area: '',
    notes: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await mockService.createCase({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        severity: formData.severity,
        status: 'SUBMITTED',
        peopleAffected: formData.peopleAffected,
        location: {
          address: formData.address,
          area: formData.area,
        },
        fieldStaffId: user.id,
        notes: formData.notes,
      });
      toast.success('Case submitted successfully!');
      router.push('/fieldstaff');
    } catch (error) {
      toast.error('Failed to submit case');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    toast.info('Draft saved successfully (simulated)');
    router.push('/fieldstaff/drafts');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <Label htmlFor="title">Case Title</Label>
              <Input 
                id="title" 
                placeholder="Brief summary of the need" 
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="rounded-xl glass-input h-11"
              />
              <p className="text-xs text-slate-400">Example: Urgent water shortage at Sector 4 Slums</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => updateField('category', v)}>
                <SelectTrigger className="rounded-xl glass-input">
                  <SelectValue placeholder="Select service area" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 shadow-2xl border-slate-200 rounded-xl z-50">
                  <SelectItem value="Food Security">Food Security</SelectItem>
                  <SelectItem value="Water & Sanitation">Water & Sanitation</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Emergency Shelter">Emergency Shelter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                placeholder="Explain the situation in detail..." 
                className="min-h-[120px] rounded-xl glass-input"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <Label>Severity Level</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={formData.severity === p ? 'default' : 'outline'}
                    className={`rounded-full transition-all ${formData.severity === p ? 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20' : 'glass-card border-white/30 hover:glass-card-hover'}`}
                    onClick={() => updateField('severity', p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="impact">Approx. People Affected</Label>
              <Input 
                id="impact" 
                type="number" 
                placeholder="Number of individuals" 
                value={formData.peopleAffected || ''}
                onChange={(e) => updateField('peopleAffected', parseInt(e.target.value))}
                className="rounded-xl glass-input h-11"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address / Landmark</Label>
              <Input 
                id="address" 
                placeholder="123 Help St, Near Main Gate" 
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="rounded-xl glass-input h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Service Area / Community Name</Label>
              <Select value={formData.area} onValueChange={(v) => updateField('area', v)}>
                <SelectTrigger className="rounded-xl glass-input">
                  <SelectValue placeholder="Select community" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 shadow-2xl border-slate-200 rounded-xl z-50">
                  <SelectItem value="Downtown">Downtown District</SelectItem>
                  <SelectItem value="West Side">West Side Residential</SelectItem>
                  <SelectItem value="East Side">East Side Industrial</SelectItem>
                  <SelectItem value="North Hill">North Hill Slums</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="aspect-video glass-card rounded-xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center text-slate-400 gap-2">
               <MapPin className="w-8 h-8 opacity-20" />
               <p className="text-xs italic">Automatic GPS detection active</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <Label>Attachments (Photos/Videos)</Label>
              <div className="border-2 border-dashed border-white/30 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400/50 hover:bg-white/20 transition-all cursor-pointer glass-card">
                 <div className="bg-white/60 p-3 rounded-full shadow-sm mb-4 backdrop-blur-sm">
                    <ImageIcon className="w-8 h-8 text-indigo-500" />
                 </div>
                 <p className="font-bold text-slate-600">Click to upload photos</p>
                 <p className="text-xs">Supports JPG, PNG up to 10MB</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Field Notes (Internal)</Label>
              <Textarea 
                id="notes" 
                placeholder="Any special instructions for the volunteer or admin..." 
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                className="rounded-xl glass-input"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="p-4 glass-card rounded-xl flex gap-3 text-indigo-800 border border-indigo-200/30">
               <AlertCircle className="w-5 h-5 shrink-0" />
               <p className="text-sm">Please review the details below before submitting to the NGO central queue.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] text-slate-400 uppercase tracking-widest">Case Title</Label>
                    <p className="font-bold text-lg text-slate-900">{formData.title || 'Untitled Case'}</p>
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-400 uppercase tracking-widest">Description</Label>
                    <p className="text-sm text-slate-600 line-clamp-3">{formData.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <Label className="text-[10px] text-slate-400 uppercase tracking-widest">Category</Label>
                      <p className="text-sm font-semibold">{formData.category}</p>
                    </div>
                    <div>
                      <Label className="text-[10px] text-slate-400 uppercase tracking-widest">Severity</Label>
                      <p className="text-sm font-bold text-rose-600">{formData.severity}</p>
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] text-slate-400 uppercase tracking-widest">Location</Label>
                    <p className="text-sm font-medium">{formData.address}</p>
                    <p className="text-xs text-slate-500">{formData.area}</p>
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-400 uppercase tracking-widest">Impact</Label>
                    <p className="text-sm font-semibold">{formData.peopleAffected} people affected</p>
                  </div>
                  {formData.notes && (
                    <div>
                      <Label className="text-[10px] text-slate-400 uppercase tracking-widest">Internal Notes</Label>
                      <p className="text-xs text-slate-500 italic">"{formData.notes}"</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Report New Case" allowedRoles={['FIELD_STAFF']}>
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        {/* Progress Header */}
        <div className="space-y-4">
           <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gradient">
                New Service Intake
              </h2>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest glass-card px-3 py-1 rounded-full">Step {currentStep} of 5</span>
           </div>
           <Progress value={(currentStep / 5) * 100} className="h-2 bg-slate-100/50" />
           <div className="flex justify-between mt-2 overflow-x-auto pb-2 overflow-y-hidden">
              {STEPS.map((step) => (
                <div 
                  key={step.id} 
                  className={`flex flex-col items-center gap-2 min-w-[80px] transition-colors ${
                    step.id === currentStep ? 'text-indigo-600' : 
                    step.id < currentStep ? 'text-emerald-500' : 'text-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all backdrop-blur-sm ${
                    step.id === currentStep ? 'border-indigo-600 bg-indigo-50/60' : 
                    step.id < currentStep ? 'border-emerald-500 bg-emerald-50/60' : 'border-slate-200 bg-white/30'
                  }`}>
                    {step.id < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tight">{step.title}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden shadow-glass">
           <div className="bg-white/40 border-b border-white/20 px-6 py-4">
              <h3 className="text-lg flex items-center gap-2 font-semibold">
                 {(() => {
                   const StepIcon = STEPS[currentStep-1].icon;
                   return <StepIcon className="w-5 h-5 text-indigo-500" />;
                 })()}
                 {STEPS[currentStep-1].title} Details
              </h3>
           </div>
           <div className="p-6 pt-8">
              {renderStep()}
           </div>
           <div className="flex justify-between border-t border-white/20 p-6">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 1 || isSubmitting}
                  className="gap-2 rounded-full glass-card border-white/30"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleSaveDraft} 
                  disabled={isSubmitting}
                  className="text-slate-500 hidden sm:flex rounded-full"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Draft
                </Button>
              </div>
              
              {currentStep < 5 ? (
                <Button onClick={nextStep} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 min-w-[120px] rounded-full shadow-lg shadow-indigo-500/20">
                  Continue <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 min-w-[140px] rounded-full shadow-lg shadow-emerald-500/20"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  Submit Case
                </Button>
              )}
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
