import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  BarChart3, 
  PlusCircle,
  FileText,
  History,
  CheckCircle2,
  LifeBuoy
} from 'lucide-react';
import { NavItem } from '@/components/shared/Sidebar';

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Case Queue', href: '/admin/cases', icon: ClipboardList },
  { title: 'Volunteers', href: '/admin/volunteers', icon: Users },
  { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export const FIELD_STAFF_NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/fieldstaff', icon: LayoutDashboard },
  { title: 'Create Case', href: '/fieldstaff/create-case', icon: PlusCircle },
  { title: 'My Cases', href: '/fieldstaff/my-cases', icon: FileText },
  { title: 'Drafts', href: '/fieldstaff/drafts', icon: ClipboardList },
];

export const VOLUNTEER_NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/volunteer', icon: LayoutDashboard },
  { title: 'My Tasks', href: '/volunteer/tasks', icon: CheckCircle2 },
  { title: 'History', href: '/volunteer/history', icon: History },
];
