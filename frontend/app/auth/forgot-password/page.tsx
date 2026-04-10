'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LifeBuoy, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Reset link sent to your email!');
  };

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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Reset Access</h1>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200">
          <CardHeader>
            <CardTitle>Recover Password</CardTitle>
            <CardDescription>Enter your email and we'll send you a link to reset your password.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input id="email" type="email" placeholder="name@organization.org" className="pl-10 h-11" required />
                  </div>
               </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4">
               <Button type="submit" className="w-full bg-indigo-600 h-11 font-bold shadow-lg shadow-indigo-100">Send Reset Link</Button>
               <Link href="/auth/login" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 justify-center">
                  <ArrowLeft className="w-3 h-3" /> Back to Login
               </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
