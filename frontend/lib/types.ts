export type UserRole = 'ADMIN' | 'FIELD_STAFF' | 'VOLUNTEER';

export type CaseStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'READY_FOR_ASSIGNMENT'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED_PENDING_VERIFICATION'
  | 'COMPLETED'
  | 'FAILED'
  | 'ESCALATED';

export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  severity: CasePriority;
  status: CaseStatus;
  peopleAffected: number;
  location: {
    address: string;
    area: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  fieldStaffId: string;
  assignedVolunteerId?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  notes?: string;
  history: CaseHistoryEvent[];
  proofOfCompletion?: ProofOfCompletion;
}

export interface CaseHistoryEvent {
  id: string;
  timestamp: string;
  status: CaseStatus;
  actorId: string;
  actorName: string;
  note?: string;
}

export interface ProofOfCompletion {
  timestamp: string;
  notes: string;
  attachments: string[];
  volunteerId: string;
}

export interface Volunteer extends User {
  role: 'VOLUNTEER';
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  completedTasks: number;
  activeTasks: number;
  rating: number;
  specialties: string[];
  location: string;
}

export interface AnalyticsData {
  totalCases: number;
  urgentCases: number;
  pendingAssignments: number;
  completedToday: number;
  casesByStatus: Record<CaseStatus, number>;
  casesByCategory: Record<string, number>;
  casesByPriority: Record<CasePriority, number>;
  weeklyTrend: { day: string; count: number }[];
}
