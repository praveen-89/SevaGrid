import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CaseStatus, CasePriority } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<CaseStatus, string> = {
    'DRAFT': 'bg-slate-100/80 text-slate-700 border-slate-200/60 backdrop-blur-sm',
    'SUBMITTED': 'bg-blue-50/80 text-blue-700 border-blue-200/60 backdrop-blur-sm',
    'UNDER_REVIEW': 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60 backdrop-blur-sm',
    'READY_FOR_ASSIGNMENT': 'bg-cyan-50/80 text-cyan-700 border-cyan-200/60 backdrop-blur-sm',
    'ASSIGNED': 'bg-violet-50/80 text-violet-700 border-violet-200/60 backdrop-blur-sm',
    'ACCEPTED': 'bg-purple-50/80 text-purple-700 border-purple-200/60 backdrop-blur-sm',
    'IN_PROGRESS': 'bg-amber-50/80 text-amber-700 border-amber-200/60 backdrop-blur-sm',
    'COMPLETED_PENDING_VERIFICATION': 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60 backdrop-blur-sm',
    'COMPLETED': 'bg-emerald-500/90 text-white border-emerald-600/60 backdrop-blur-sm shadow-sm shadow-emerald-200',
    'FAILED': 'bg-rose-50/80 text-rose-700 border-rose-200/60 backdrop-blur-sm',
    'ESCALATED': 'bg-rose-600/90 text-white border-rose-700/60 backdrop-blur-sm shadow-sm shadow-rose-200',
  };

  return (
    <Badge variant="outline" className={cn("font-semibold px-3 py-0.5 rounded-full capitalize text-[11px] transition-all", variants[status], className)}>
      {status.toLowerCase().replace(/_/g, ' ')}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: CasePriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const variants: Record<CasePriority, string> = {
    'LOW': 'bg-slate-100/80 text-slate-700 border-slate-200/60 backdrop-blur-sm',
    'MEDIUM': 'bg-blue-100/80 text-blue-800 border-blue-200/60 backdrop-blur-sm',
    'HIGH': 'bg-orange-100/80 text-orange-800 border-orange-200/60 backdrop-blur-sm',
    'URGENT': 'bg-rose-100/80 text-rose-800 border-rose-300/60 backdrop-blur-sm border-2 animate-pulse',
  };

  return (
    <Badge variant="outline" className={cn("font-bold px-2.5 py-0 rounded-full text-[10px] transition-all", variants[priority], className)}>
      {priority}
    </Badge>
  );
}
