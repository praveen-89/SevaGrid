'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Determine role from email for demo simplicity
    let role: any = 'VOLUNTEER';
    if (email.includes('admin')) role = 'ADMIN';
    else if (email.includes('field')) role = 'FIELD_STAFF';
    
    await login(email, role);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-900 font-bold text-3xl tracking-tight mb-4">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
              <LifeBuoy className="w-8 h-8" />
            </div>
            SevaGrid
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Portal Access</h1>
          <p className="text-slate-500 mt-2 text-sm">Secure coordination platform for NGO staff and volunteers.</p>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@organization.org" 
                    className="pl-10 h-11" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-xs text-indigo-600 font-bold hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-11" required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4">
              <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Access Dashboard
              </Button>
              <div className="text-center">
                 <p className="text-sm text-slate-500">Don't have an account? <Link href="/auth/signup" className="text-indigo-600 font-bold hover:underline">Request access</Link></p>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
           <p className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <LifeBuoy className="w-3.5 h-3.5" /> Demo Shortcuts
           </p>
           <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="ghost" 
                className="justify-between h-9 bg-white border border-indigo-100 text-[11px] font-bold"
                onClick={() => { setEmail('admin@sevagrid.org'); }}
              >
                Log in as Admin <ArrowRight className="w-3 h-3 text-indigo-400" />
              </Button>
              <Button 
                variant="ghost" 
                className="justify-between h-9 bg-white border border-indigo-100 text-[11px] font-bold"
                onClick={() => { setEmail('field@sevagrid.org'); }}
              >
                Log in as Field Staff <ArrowRight className="w-3 h-3 text-indigo-400" />
              </Button>
              <Button 
                variant="ghost" 
                className="justify-between h-9 bg-white border border-indigo-100 text-[11px] font-bold"
                onClick={() => { setEmail('volunteer@sevagrid.org'); }}
              >
                Log in as Volunteer <ArrowRight className="w-3 h-3 text-indigo-400" />
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
