'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy, ShieldCheck, Users, HeartHandshake, ArrowRight } from 'lucide-react';
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
      color: 'bg-indigo-600',
      features: ['Case Queue Management', 'Volunteer Assignment', 'Impact Analytics']
    },
    {
      title: 'Field Staff',
      role: 'FIELD_STAFF',
      email: 'field@sevagrid.org',
      description: 'Report community needs and track status of submitted cases.',
      icon: Users,
      color: 'bg-emerald-600',
      features: ['Multi-step Intake Form', 'Draft Management', 'Submission History']
    },
    {
      title: 'Volunteer',
      role: 'VOLUNTEER',
      email: 'volunteer@sevagrid.org',
      description: 'Accept tasks, update progress, and submit proof of completion.',
      icon: HeartHandshake,
      color: 'bg-amber-600',
      features: ['Task Workflow', 'Proof Submission', 'Contribution History']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
       <header className="px-6 lg:px-12 h-20 flex items-center border-b border-slate-200 bg-white">
        <Link href="/" className="flex items-center gap-2 text-slate-900 font-bold text-2xl tracking-tight">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <LifeBuoy className="w-6 h-6" />
          </div>
          SevaGrid
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
        <div className="max-w-5xl w-full text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Select a Demo Experience</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore SevaGrid from different perspectives. Each role has a dedicated portal and specific workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
          {roles.map((role) => (
            <Card key={role.role} className="border-2 border-transparent hover:border-indigo-500 transition-all hover:shadow-xl group overflow-hidden">
              <CardHeader className="pb-4">
                <div className={`${role.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <role.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold">{role.title}</CardTitle>
                <CardDescription className="text-slate-500 min-h-[40px] leading-relaxed">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <ul className="space-y-3">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full h-12 text-base font-bold ${role.color} hover:opacity-90`}
                  onClick={() => login(role.email, role.role as any)}
                >
                  Enter as {role.title} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <p className="mt-12 text-slate-400 text-sm">
          No real account required for this demo. State is persisted locally in your browser.
        </p>
      </main>
    </div>
  );
}
