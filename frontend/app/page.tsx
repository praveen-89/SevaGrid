import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LifeBuoy, 
  ArrowRight, 
  Users, 
  Zap, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between glass-header sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5 text-slate-900 font-bold text-2xl tracking-tight group">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <span className="text-gradient">SevaGrid</span>
        </Link>
        <nav className="hidden md:flex gap-4 items-center text-sm font-medium text-slate-600">
          <Link href="#features" className="px-5 py-2 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md">Features</Link>
          <Link href="#how-it-works" className="px-5 py-2 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md">How it Works</Link>
          <Link href="#about" className="px-5 py-2 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md">About</Link>
          <div className="w-px h-6 bg-slate-300 mx-1" />
          <Link href="/auth/login">
            <Button variant="ghost" className="text-sm rounded-full px-6 hover:bg-indigo-50 hover:text-indigo-700 font-bold transition-all hover:-translate-y-0.5">Sign In</Button>
          </Link>
          <Link href="/demo-select">
            <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-sm rounded-full px-8 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5 hover:scale-105">Live Demo</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 lg:px-12 relative overflow-hidden">
          {/* Ambient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}} />
          <div className="absolute top-40 right-1/4 w-48 h-48 bg-pink-400/8 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}} />

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
                Modern NGO Coordination
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1]">
                Empowering Communities through <span className="text-gradient">Structured Response</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                SevaGrid simplifies the entire lifecycle of community service—from rapid intake of needs to verified task completion and automated reporting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/demo-select">
                  <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-base h-14 rounded-full px-8 w-full sm:w-auto shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all">
                    Explore the Demo <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="text-base h-14 rounded-full px-8 w-full sm:w-auto glass-card hover:glass-card-hover border-white/30 transition-all">
                    Get Started for Free
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" className="rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-bold text-slate-900">Active NGOs</p>
                  <p className="text-slate-500">Trusted by 240+ organizations</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500/15 to-violet-500/15 absolute -inset-4 rounded-3xl blur-2xl" />
              <div className="relative glass-card rounded-2xl p-4 hover:glass-card-hover transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80" 
                  alt="NGO operations" 
                  className="rounded-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 lg:px-12 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Everything you need for <span className="text-gradient">rapid response</span></h2>
              <p className="text-slate-600 max-w-2xl mx-auto">One platform, unified visibility across all your field staff and volunteers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Role-Based Portals",
                  desc: "Dedicated workspaces for Admins, Field Staff, and Volunteers with context-specific tools.",
                  icon: Users,
                  gradient: "from-blue-500 to-cyan-500",
                  glow: "shadow-blue-500/15"
                },
                {
                  title: "Real-time Prioritization",
                  desc: "Automated urgency scoring and status tracking to ensure critical cases get handled first.",
                  icon: Zap,
                  gradient: "from-amber-500 to-orange-500",
                  glow: "shadow-amber-500/15"
                },
                {
                  title: "Verified Completion",
                  desc: "Proof-of-work submission flow with image and notes verification to guarantee results.",
                  icon: ShieldCheck,
                  gradient: "from-emerald-500 to-teal-500",
                  glow: "shadow-emerald-500/15"
                }
              ].map((feature, idx) => (
                <div key={idx} className="glass-card p-8 rounded-2xl hover:glass-card-hover transition-all duration-500 group cursor-default">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg ${feature.glow}`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
             <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-12">
                 <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-[1.2]">The complete coordination lifecycle from <span className="text-gradient">start to finish</span>.</h2>
                 
                 <div className="space-y-8">
                   {[
                     { step: "01", title: "Intake", desc: "Field staff identifies and reports needs using a structured digital intake form." },
                     { step: "02", title: "Prioritize", desc: "Admin reviews case details, urgency level, and assigns the best-fit volunteer." },
                     { step: "03", title: "Action", desc: "Volunteer receives instructions, executes the task, and submits proof of completion." },
                     { step: "04", title: "Verify", desc: "Admin verifies the proof, updates the community impact reports, and closes the case." },
                   ].map((item, idx) => (
                     <div key={idx} className="flex gap-6 glass-card p-5 rounded-2xl hover:glass-card-hover transition-all duration-300 group">
                       <span className="text-3xl font-extrabold text-gradient">{item.step}</span>
                       <div>
                         <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                         <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
               
               <div className="glass-dark rounded-3xl p-8 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
                 <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/15 rounded-full blur-3xl -ml-20 -mb-20" />
                 <div className="relative z-10 space-y-8">
                   <div className="flex items-center gap-3 bg-white/8 w-fit px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                     <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                     <span className="text-xs font-bold uppercase tracking-widest">Platform Status: Active</span>
                   </div>
                   <div className="space-y-4">
                     <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm">
                        <span className="text-sm">Recent Activity</span>
                        <div className="flex -space-x-2">
                           <div className="w-6 h-6 rounded-full bg-slate-400 border border-slate-900" />
                           <div className="w-6 h-6 rounded-full bg-slate-500 border border-slate-900" />
                        </div>
                     </div>
                     <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-6 shadow-xl">
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-2">
                              <LifeBuoy className="w-5 h-5" />
                              <span className="font-bold text-sm">SevaGrid AI</span>
                           </div>
                           <Badge className="bg-white/15 text-white text-[10px] border-none rounded-full backdrop-blur-sm">Optimization Engine</Badge>
                        </div>
                        <p className="text-sm leading-relaxed text-indigo-50">
                          Suggested 3 volunteers for Case #451 based on proximity and specialty. Urgency score increased to 9.2 due to weather forecast.
                        </p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                           <p className="text-2xl font-bold">1,402</p>
                           <p className="text-xs text-slate-400">Claims Resolved</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                           <p className="text-2xl font-bold">12m</p>
                           <p className="text-xs text-slate-400">Response Time</p>
                        </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 lg:px-12 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 rounded-[3rem] mx-6 lg:mx-12 mb-24 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl" />
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Ready to streamline your community support?</h2>
            <p className="text-indigo-100 text-lg lg:text-xl max-w-2xl mx-auto opacity-90">
              Join hundreds of organizations using SevaGrid to deliver impact at scale. Fast, efficient, and transparent operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/demo-select">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 text-base font-bold h-14 rounded-full px-10 shadow-xl">
                  Try the Live Demo
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 text-base h-14 rounded-full px-10 backdrop-blur-sm">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-header py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <Link href="/" className="flex items-center gap-2.5 text-slate-900 font-bold text-xl tracking-tight">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-1.5 rounded-xl text-white shadow-lg shadow-indigo-500/15">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <span className="text-gradient">SevaGrid</span>
          </Link>
          <div className="text-sm text-slate-500">
            © 2026 SevaGrid. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
             <Link href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
             <Link href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
             <Link href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
