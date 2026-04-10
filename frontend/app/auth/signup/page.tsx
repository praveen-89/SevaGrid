'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LifeBuoy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
           <Link href="/" className="inline-flex items-center gap-2 text-slate-900 font-bold text-3xl tracking-tight mb-4">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
              <LifeBuoy className="w-8 h-8" />
            </div>
            SevaGrid
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Join the Network</h1>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200">
          <CardHeader>
            <CardTitle>Request for Onboarding</CardTitle>
            <CardDescription>Our team will verify your organization before granting access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="John Doe" />
             </div>
             <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input placeholder="Hope Charity Foundation" />
             </div>
             <div className="space-y-2">
                <Label>Work Email</Label>
                <Input type="email" placeholder="john@hopecharity.org" />
             </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             <Button className="w-full bg-indigo-600 h-11 font-bold">Submit Request</Button>
             <Link href="/auth/login" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 justify-center">
                <ArrowLeft className="w-3 h-3" /> Already have an account? Sign in
             </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Note: I'm putting both in one thinking step but I'll write them to separate files
