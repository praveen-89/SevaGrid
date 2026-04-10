'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { ADMIN_NAV_ITEMS as NAV_ITEMS } from '@/lib/navigation';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Mail,
  MoreHorizontal,
  ArrowUpDown,
  ExternalLink,
  MapPin,
  Clock,
  Users,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { mockService } from '@/lib/mock-service';
import { Case, CaseStatus, CasePriority } from '@/lib/types';
import Link from 'next/link';

export default function AdminCaseQueue() {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      try {
        const data = await mockService.getCases();
        setCases(data);
        setFilteredCases(data);
      } catch (error) {
        console.error('Failed to load cases', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCases();
  }, []);

  useEffect(() => {
    let result = [...cases];
    
    if (search) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.location.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter(c => c.severity === priorityFilter);
    }

    setFilteredCases(result);
  }, [search, statusFilter, priorityFilter, cases]);

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Case Queue" allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Incoming Needs Queue</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              <Plus className="w-4 h-4" />
              New Manual Intake
            </Button>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search by ID, title, or address..." 
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="READY_FOR_ASSIGNMENT">Ready for Assignment</SelectItem>
                  <SelectItem value="ASSIGNED">Assigned</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v || 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="border-none shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[300px]">Case Info</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
                    Urgency <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
                    Reported <Clock className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((c) => (
                <TableRow key={c.id} className="group hover:bg-slate-50/50">
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors underline-offset-4 decoration-indigo-600/30">
                        {c.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">#{c.id}</span>
                        <span className="text-[11px] font-medium text-slate-400 capitalize">• {c.category}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-1.5 max-w-[180px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <div className="text-sm">
                        <p className="text-slate-700 font-medium truncate">{c.location.address}</p>
                        <p className="text-xs text-slate-400 capitalize">{c.location.area}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={c.severity} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-slate-700">{new Date(c.createdAt).toLocaleDateString()}</p>
                      <p className="text-[11px] text-slate-400 italic">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/cases/${c.id}`} className="cursor-pointer flex items-center">
                            <ExternalLink className="w-4 h-4 mr-2" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                           <Users className="w-4 h-4 mr-2" /> Quick Assign
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-rose-600">
                           <AlertTriangle className="w-4 h-4 mr-2" /> Mark Escalated
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCases.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <FileText className="w-8 h-8 opacity-20" />
                       <p>No cases match your filters.</p>
                       <Button variant="link" onClick={() => { setSearch(''); setStatusFilter('all'); setPriorityFilter('all'); }}>Clear all filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardShell>
  );
}

function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
}
