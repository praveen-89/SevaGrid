'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy, ShieldCheck, Users, HeartHandshake, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DemoSelectPage() {
  const { login } = useAuth();

  const roles = [
    {
      title: 'NGO Admin',
      role: 'ADMIN',
      email: 'admin@sevagrid.org',
      description: 'Review cases, assign volunteers, and monitor platform analytics.',
      icon: ShieldCheck,
      gradient: 'from-indigo-600 to-violet-600',
      glow: 'shadow-indigo-500/20',
      hoverBorder: 'hover:border-indigo-400/50',
      features: ['Case Queue Management', 'Volunteer Assignment', 'Impact Analytics']
    },
    {
      title: 'Field Staff',
      role: 'FIELD_STAFF',
      email: 'field@sevagrid.org',
      description: 'Report community needs and track status of submitted cases.',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/20',
      hoverBorder: 'hover:border-emerald-400/50',
      features: ['Multi-step Intake Form', 'Draft Management', 'Submission History']
    },
    {
      title: 'Volunteer',
      role: 'VOLUNTEER',
      email: 'volunteer@sevagrid.org',
      description: 'Accept tasks, update progress, and submit proof of completion.',
      icon: HeartHandshake,
      gradient: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/20',
      hoverBorder: 'hover:border-amber-400/50',
      features: ['Task Workflow', 'Proof Submission', 'Contribution History']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col gradient-bg gradient-mesh">
       <header className="px-6 lg:px-12 h-20 flex items-center glass-header sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5 text-slate-900 font-bold text-2xl tracking-tight group">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <span className="text-gradient">SevaGrid</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Ambient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-400/8 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />

        <div className="max-w-5xl w-full text-center mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Interactive Demo
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Select a <span className="text-gradient">Demo Experience</span></h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore SevaGrid from different perspectives. Each role has a dedicated portal and specific workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full relative z-10">
          {roles.map((role) => (
            <div key={role.role} className={`glass-card rounded-2xl overflow-hidden border border-white/30 ${role.hoverBorder} hover:glass-card-hover transition-all duration-500 group flex flex-col`}>
              <div className="p-8 pb-4">
                <div className={`bg-gradient-to-br ${role.gradient} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg ${role.glow} group-hover:scale-110 transition-transform`}>
                  <role.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{role.title}</h3>
                <p className="text-slate-500 text-sm min-h-[40px] leading-relaxed">
                  {role.description}
                </p>
              </div>
              <div className="px-8 pb-6 flex-1">
                <ul className="space-y-3">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-2">
                <Button 
                  className={`w-full h-12 text-base font-bold bg-gradient-to-r ${role.gradient} hover:opacity-90 rounded-full shadow-lg ${role.glow} transition-all`}
                  onClick={() => login(role.email, role.role as any)}
                >
                  Enter as {role.title} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <p className="mt-12 text-slate-400 text-sm relative z-10 glass-card px-6 py-2 rounded-full">
          No real account required for this demo. State is persisted locally in your browser.
        </p>
      </main>
    </div>
  );
}
