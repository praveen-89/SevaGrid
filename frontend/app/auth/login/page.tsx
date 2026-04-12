'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy, Mail, Lock, Loader2, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen gradient-bg gradient-mesh flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 text-slate-900 font-bold text-3xl tracking-tight mb-4 group">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-xl text-white shadow-xl shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <LifeBuoy className="w-7 h-7" />
            </div>
            <span className="text-gradient">SevaGrid</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-indigo-700 text-xs font-bold uppercase tracking-wider mt-4 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Secure Portal
          </div>
          <p className="text-slate-500 mt-2 text-sm">Coordination platform for NGO staff and volunteers.</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-6">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@organization.org" 
                    className="pl-10 h-11 rounded-xl glass-input" 
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
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-11 rounded-xl glass-input" required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4 px-6 pb-6">
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 font-bold shadow-lg shadow-indigo-500/20 rounded-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Access Dashboard
              </Button>
              <div className="text-center">
                 <p className="text-sm text-slate-500">Don't have an account? <Link href="/auth/signup" className="text-indigo-600 font-bold hover:underline">Request access</Link></p>
              </div>
            </CardFooter>
          </form>
        </div>
        
        <div className="glass-card p-5 rounded-2xl">
           <p className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <LifeBuoy className="w-3.5 h-3.5" /> Demo Shortcuts
           </p>
           <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="ghost" 
                className="justify-between h-10 glass-input rounded-full text-[11px] font-bold hover:bg-white/60 transition-all"
                onClick={() => { setEmail('admin@sevagrid.org'); }}
              >
                Log in as Admin <ArrowRight className="w-3 h-3 text-indigo-400" />
              </Button>
              <Button 
                variant="ghost" 
                className="justify-between h-10 glass-input rounded-full text-[11px] font-bold hover:bg-white/60 transition-all"
                onClick={() => { setEmail('field@sevagrid.org'); }}
              >
                Log in as Field Staff <ArrowRight className="w-3 h-3 text-indigo-400" />
              </Button>
              <Button 
                variant="ghost" 
                className="justify-between h-10 glass-input rounded-full text-[11px] font-bold hover:bg-white/60 transition-all"
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
