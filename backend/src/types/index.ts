import { 
  UserRole, 
  CaseStatus, 
  CaseSeverity, 
  AssignmentStatus, 
  VolunteerStatus, 
  AttachmentKind, 
  ProofVerificationStatus 
} from '../constants';

export interface Profile {
  id: string; // UUID from Auth
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface VolunteerProfile {
  id: string; // UUID
  user_id: string; // References Profile
  status: VolunteerStatus;
  rating: number;
  completed_tasks_count: number;
  active_tasks_count: number;
  location_label?: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  severity: CaseSeverity;
  status: CaseStatus;
  people_affected: number;
  address: string;
  area: string;
  latitude?: number;
  longitude?: number;
  field_staff_id: string;
  assigned_volunteer_id?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Ensure the Express Request globally recognized 'user' logic inside middleware
declare global {
  namespace Express {
    interface Request {
      user?: Profile;
    }
  }
}
