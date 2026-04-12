'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LifeBuoy, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen gradient-bg gradient-mesh flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-violet-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
           <Link href="/" className="inline-flex items-center gap-2.5 text-slate-900 font-bold text-3xl tracking-tight mb-4 group">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-xl text-white shadow-xl shadow-indigo-500/20">
              <LifeBuoy className="w-7 h-7" />
            </div>
            <span className="text-gradient">SevaGrid</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-indigo-700 text-xs font-bold uppercase tracking-wider mt-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Join the Network
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle>Request for Onboarding</CardTitle>
            <CardDescription>Our team will verify your organization before granting access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
             <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="John Doe" className="h-11 rounded-xl glass-input" />
             </div>
             <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input placeholder="Hope Charity Foundation" className="h-11 rounded-xl glass-input" />
             </div>
             <div className="space-y-2">
                <Label>Work Email</Label>
                <Input type="email" placeholder="john@hopecharity.org" className="h-11 rounded-xl glass-input" />
             </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-6 pb-6">
             <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 h-11 font-bold rounded-full shadow-lg shadow-indigo-500/20">Submit Request</Button>
             <Link href="/auth/login" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 justify-center transition-colors">
                <ArrowLeft className="w-3 h-3" /> Already have an account? Sign in
             </Link>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}
