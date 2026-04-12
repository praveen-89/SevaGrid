'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LifeBuoy, ArrowLeft, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Reset link sent to your email!');
  };

  return (
    <div className="min-h-screen gradient-bg gradient-mesh flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-10 left-20 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />

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
            Reset Access
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle>Recover Password</CardTitle>
            <CardDescription>Enter your email and we'll send you a link to reset your password.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-6">
               <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input id="email" type="email" placeholder="name@organization.org" className="pl-10 h-11 rounded-xl glass-input" required />
                  </div>
               </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4 px-6 pb-6">
               <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 h-11 font-bold shadow-lg shadow-indigo-500/20 rounded-full">Send Reset Link</Button>
               <Link href="/auth/login" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 justify-center transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Back to Login
               </Link>
            </CardFooter>
          </form>
        </div>
      </div>
    </div>
  );
}
