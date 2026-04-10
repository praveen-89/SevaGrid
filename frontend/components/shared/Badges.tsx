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
    'DRAFT': 'bg-slate-100 text-slate-700 border-slate-200',
    'SUBMITTED': 'bg-blue-50 text-blue-700 border-blue-200',
    'UNDER_REVIEW': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'READY_FOR_ASSIGNMENT': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'ASSIGNED': 'bg-violet-50 text-violet-700 border-violet-200',
    'ACCEPTED': 'bg-purple-50 text-purple-700 border-purple-200',
    'IN_PROGRESS': 'bg-amber-50 text-amber-700 border-amber-200',
    'COMPLETED_PENDING_VERIFICATION': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'COMPLETED': 'bg-emerald-500 text-white border-emerald-600',
    'FAILED': 'bg-rose-50 text-rose-700 border-rose-200',
    'ESCALATED': 'bg-rose-600 text-white border-rose-700',
  };

  return (
    <Badge variant="outline" className={cn("font-semibold px-2.5 py-0.5 rounded-full capitalize text-[11px]", variants[status], className)}>
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
    'LOW': 'bg-slate-100 text-slate-700 border-slate-200',
    'MEDIUM': 'bg-blue-100 text-blue-800 border-blue-200',
    'HIGH': 'bg-orange-100 text-orange-800 border-orange-200',
    'URGENT': 'bg-rose-100 text-rose-800 border-rose-200 border-2',
  };

  return (
    <Badge variant="outline" className={cn("font-bold px-2 py-0 rounded text-[10px]", variants[priority], className)}>
      {priority}
    </Badge>
  );
}
