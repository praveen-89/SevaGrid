import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LifeBuoy, 
  ArrowRight, 
  Users, 
  Zap, 
  ShieldCheck,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2 text-slate-900 font-bold text-2xl tracking-tight">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <LifeBuoy className="w-6 h-6" />
          </div>
          SevaGrid
        </Link>
        <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</Link>
          <Link href="#about" className="hover:text-indigo-600 transition-colors">About</Link>
          <div className="w-px h-6 bg-slate-200" />
          <Link href="/auth/login">
            <Button variant="ghost" className="text-sm">Sign In</Button>
          </Link>
          <Link href="/demo-select">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-sm">Live Demo</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 lg:px-12 bg-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
                Modern NGO Coordination
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1]">
                Empowering Communities through <span className="text-indigo-600">Structured Response</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                SevaGrid simplifies the entire lifecycle of community service—from rapid intake of needs to verified task completion and automated reporting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/demo-select">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-base h-14 px-8 w-full sm:w-auto">
                    Explore the Demo <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="text-base h-14 px-8 w-full sm:w-auto">
                    Get Started for Free
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200">
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
              <div className="bg-indigo-600/10 absolute -inset-4 rounded-2xl blur-2xl" />
              <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl p-4">
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
        <section id="features" className="py-24 bg-slate-50 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 italic">Everything you need for rapid response</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">One platform, unified visibility across all your field staff and volunteers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Role-Based Portals",
                  desc: "Dedicated workspaces for Admins, Field Staff, and Volunteers with context-specific tools.",
                  icon: Users,
                  color: "text-blue-600",
                  bg: "bg-blue-100"
                },
                {
                  title: "Real-time Prioritization",
                  desc: "Automated urgency scoring and status tracking to ensure critical cases get handled first.",
                  icon: Zap,
                  color: "text-amber-600",
                  bg: "bg-amber-100"
                },
                {
                  title: "Verified Completion",
                  desc: "Proof-of-work submission flow with image and notes verification to guarantee results.",
                  icon: ShieldCheck,
                  color: "text-emerald-600",
                  bg: "bg-emerald-100"
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-shadow group">
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
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
                 <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-[1.2]">The complete coordination lifecycle from start to finish.</h2>
                 
                 <div className="space-y-10">
                   {[
                     { step: "01", title: "Intake", desc: "Field staff identifies and reports needs using a structured digital intake form." },
                     { step: "02", title: "Prioritize", desc: "Admin reviews case details, urgency level, and assigns the best-fit volunteer." },
                     { step: "03", title: "Action", desc: "Volunteer receives instructions, executes the task, and submits proof of completion." },
                     { step: "04", title: "Verify", desc: "Admin verifies the proof, updates the community impact reports, and closes the case." },
                   ].map((item, idx) => (
                     <div key={idx} className="flex gap-6">
                       <span className="text-3xl font-extrabold text-indigo-200">{item.step}</span>
                       <div>
                         <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                         <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
               
               <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
                 <div className="relative z-10 space-y-8">
                   <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                     <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                     <span className="text-xs font-bold uppercase tracking-widest">Platform Status: Active</span>
                   </div>
                   <div className="space-y-4">
                     <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-sm">Recent Activity</span>
                        <div className="flex -space-x-2">
                           <div className="w-6 h-6 rounded-full bg-slate-400 border border-slate-900" />
                           <div className="w-6 h-6 rounded-full bg-slate-500 border border-slate-900" />
                        </div>
                     </div>
                     <div className="bg-indigo-600 rounded-xl p-6 shadow-xl">
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-2">
                              <LifeBuoy className="w-5 h-5" />
                              <span className="font-bold text-sm">SevaGrid AI</span>
                           </div>
                           <Badge className="bg-indigo-400/30 text-white text-[10px] border-none">Optimization Engine</Badge>
                        </div>
                        <p className="text-sm leading-relaxed text-indigo-50">
                          Suggested 3 volunteers for Case #451 based on proximity and specialty. Urgency score increased to 9.2 due to weather forecast.
                        </p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                           <p className="text-2xl font-bold">1,402</p>
                           <p className="text-xs text-slate-400">Claims Resolved</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
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
        <section className="py-24 px-6 lg:px-12 bg-indigo-600 rounded-[3rem] mx-6 lg:mx-12 mb-24 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 to-transparent opacity-60" />
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Ready to streamline your community support?</h2>
            <p className="text-indigo-100 text-lg lg:text-xl max-w-2xl mx-auto opacity-90">
              Join hundreds of organizations using SevaGrid to deliver impact at scale. Fast, efficient, and transparent operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/demo-select">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 text-base font-bold h-14 px-10">
                  Try the Live Demo
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-base h-14 px-10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 px-6 lg:px-12 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <Link href="/" className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <LifeBuoy className="w-5 h-5" />
            </div>
            SevaGrid
          </Link>
          <div className="text-sm text-slate-500">
            © 2026 SevaGrid. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
             <Link href="#" className="hover:text-indigo-600">Privacy Policy</Link>
             <Link href="#" className="hover:text-indigo-600">Terms of Service</Link>
             <Link href="#" className="hover:text-indigo-600">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
