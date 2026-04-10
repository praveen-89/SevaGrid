'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { ADMIN_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  Search, 
  MapPin, 
  Star, 
  Mail, 
  Phone, 
  MoreHorizontal,
  CheckCircle2,
  Filter,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { mockService } from '@/lib/mock-service';
import { Volunteer } from '@/lib/types';

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const v = await mockService.getVolunteers();
        setVolunteers(v);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = volunteers.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Volunteer Directory" allowedRoles={['ADMIN']}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Contributor Fleet</h2>
              <p className="text-slate-500 text-sm">Monitor performance and availability of your local volunteer network.</p>
           </div>
           <Button className="bg-indigo-600 font-bold shadow-lg shadow-indigo-100">Invite New Volunteer</Button>
        </div>

        <Card className="border-none shadow-sm">
           <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search volunteers by name, skill, or area..." 
                      className="pl-10"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                 </div>
                 <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" /> Filters</Button>
              </div>
           </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filtered.map((v) => (
              <Card key={v.id} className="border-none shadow-sm hover:shadow-md transition-shadow group">
                 <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                       <Avatar className="w-16 h-16 border-4 border-white shadow-md">
                          <AvatarImage src={v.avatar} />
                          <AvatarFallback>{v.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div className="flex gap-1.5 h-6">
                          <Badge variant={v.status === 'AVAILABLE' ? 'default' : 'outline'} className={v.status === 'AVAILABLE' ? 'bg-emerald-500' : ''}>
                             {v.status}
                          </Badge>
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="w-4 h-4" /></Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Assign Task</DropdownMenuItem>
                                <DropdownMenuItem>Performance Review</DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                    </div>
                    <div className="pt-2">
                       <CardTitle className="text-xl font-bold">{v.name}</CardTitle>
                       <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {v.location}
                       </CardDescription>
                    </div>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-2 rounded-lg text-center">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed</p>
                          <p className="text-lg font-black text-slate-900">{v.completedTasks}</p>
                       </div>
                       <div className="bg-slate-50 p-2 rounded-lg text-center">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rating</p>
                          <p className="text-lg font-black text-emerald-600 flex items-center justify-center gap-1">
                             {v.rating} <Star className="w-4 h-4 fill-emerald-600" />
                          </p>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Specialties</p>
                       <div className="flex flex-wrap gap-1.5">
                          {v.specialties.map(s => (
                             <span key={s} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                                {s}
                             </span>
                          ))}
                       </div>
                    </div>
                 </CardContent>
                 <CardFooter className="pt-0 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2"><Mail className="w-3.5 h-3.5" /> Email</Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2"><Phone className="w-3.5 h-3.5" /> Call</Button>
                 </CardFooter>
              </Card>
           ))}
        </div>
      </div>
    </DashboardShell>
  );
}
