import { supabaseAdmin } from '../config/supabase';
import { Case, Profile } from '../types';
import { CaseStatus, AssignmentStatus } from '../constants';

export class CaseService {
  /**
   * Universal read method incorporating robust RLS-style role enforcement at the Node level.
   */
  static async getCases(user: Profile): Promise<Case[]> {
    let query = supabaseAdmin.from('cases').select('*').order('created_at', { ascending: false });

    if (user.role === 'FIELD_STAFF') {
      query = query.eq('field_staff_id', user.id);
    } else if (user.role === 'VOLUNTEER') {
      const { data: vProfile } = await supabaseAdmin.from('volunteer_profiles').select('id').eq('user_id', user.id).single();
      query = query.eq('assigned_volunteer_id', vProfile?.id || null);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Case[];
  }

  static async getCaseById(id: string, user: Profile): Promise<Case> {
    const { data, error } = await supabaseAdmin.from('cases').select('*').eq('id', id).single();
    if (error || !data) throw new Error('Case not found');

    if (user.role === 'FIELD_STAFF' && data.field_staff_id !== user.id) {
        throw new Error('Forbidden: Not authorized to view case');
    }
    if (user.role === 'VOLUNTEER') {
        const { data: vProfile } = await supabaseAdmin.from('volunteer_profiles').select('id').eq('user_id', user.id).single();
        if (data.assigned_volunteer_id !== vProfile?.id) {
           throw new Error('Forbidden: Case is not assigned to you');
        }
    }

    return data as Case;
  }

  static async createCase(caseData: Partial<Case>, fieldStaff: Profile): Promise<Case> {
    if (fieldStaff.role !== 'FIELD_STAFF') throw new Error('Only field staff can initiate cases.');

    const { data: insertedCase, error: caseError } = await supabaseAdmin.from('cases').insert({
      title: caseData.title,
      description: caseData.description,
      category: caseData.category,
      subcategory: caseData.subcategory,
      severity: caseData.severity,
      people_affected: caseData.people_affected,
      address: caseData.address,
      area: caseData.area,
      latitude: caseData.latitude,
      longitude: caseData.longitude,
      field_staff_id: fieldStaff.id,
      notes: caseData.notes,
      status: CaseStatus.SUBMITTED 
    }).select().single();

    if (caseError) throw new Error(`Database Error: ${caseError.message}`);

    await this.logHistory(insertedCase.id, CaseStatus.SUBMITTED, fieldStaff, 'Intake finalized by field operations.');

    return insertedCase as Case;
  }

  /**
   * Internal macro for writing audit logs safely
   */
  private static async logHistory(caseId: string, status: CaseStatus, actor: Profile, note: string) {
    await supabaseAdmin.from('case_history').insert({
      case_id: caseId,
      status,
      actor_id: actor.id,
      actor_name_snapshot: actor.name,
      note
    });
  }

  /**
   * Universal Status State Machine enforcing rigid rules
   */
  static async transitionStatus(caseId: string, targetStatus: CaseStatus, actor: Profile, note: string, expectedCurrentStatus?: CaseStatus | CaseStatus[]): Promise<Case> {
    const currentCase = await this.getCaseById(caseId, actor);
    
    if (expectedCurrentStatus) {
       const allowed = Array.isArray(expectedCurrentStatus) ? expectedCurrentStatus : [expectedCurrentStatus];
       if (!allowed.includes(currentCase.status)) {
          throw new Error(`State Transition Error: Cannot move from ${currentCase.status} to ${targetStatus}`);
       }
    }

    const { data, error } = await supabaseAdmin.from('cases').update({ status: targetStatus, updated_at: new Date() }).eq('id', caseId).select().single();
    if (error || !data) throw new Error(`Status update failure: ${error?.message || 'Unknown Db Error'}`);

    await this.logHistory(caseId, targetStatus, actor, note);
    return data as Case;
  }

  // ==== VOLUNTEER WORKFLOW METHODS ====
  
  static async acceptCase(caseId: string, volunteerUser: Profile): Promise<Case> {
    // Requires case to be ASSIGNED 
    const currentCase = await this.transitionStatus(caseId, CaseStatus.ACCEPTED, volunteerUser, 'Volunteer accepted the assignment', CaseStatus.ASSIGNED);
    
    // Mutate assignment status
    await supabaseAdmin.from('assignments')
       .update({ status: AssignmentStatus.ACCEPTED, responded_at: new Date() })
       .eq('case_id', caseId).eq('status', AssignmentStatus.ASSIGNED);
       
    return currentCase;
  }

  static async rejectCase(caseId: string, volunteerUser: Profile, reason: string): Promise<Case> {
    // Requires case to be ASSIGNED (they cant reject if already accepted/in progress without abort logic)
    const { data: volunteer } = await supabaseAdmin.from('volunteer_profiles').select('id').eq('user_id', volunteerUser.id).single();
    
    // Clear assignment mapping from case and revert state
    const { data: updatedCase, error } = await supabaseAdmin.from('cases')
       .update({ assigned_volunteer_id: null, status: CaseStatus.READY_FOR_ASSIGNMENT, updated_at: new Date() })
       .eq('id', caseId).select().single();
       
    if (error) throw new Error('Database Update Failed');

    await supabaseAdmin.from('assignments')
       .update({ status: AssignmentStatus.REJECTED, responded_at: new Date(), note: reason })
       .eq('case_id', caseId).eq('volunteer_id', volunteer?.id).eq('status', AssignmentStatus.ASSIGNED);

    await this.logHistory(caseId, CaseStatus.READY_FOR_ASSIGNMENT, volunteerUser, `Volunteer rejected assignment: ${reason}`);
    return updatedCase as Case;
  }

  static async startCase(caseId: string, volunteerUser: Profile): Promise<Case> {
    return await this.transitionStatus(caseId, CaseStatus.IN_PROGRESS, volunteerUser, 'Volunteer initiated field work', CaseStatus.ACCEPTED);
  }

  static async submitProof(caseId: string, volunteerUser: Profile, notes: string): Promise<Case> {
    const { data: volunteer } = await supabaseAdmin.from('volunteer_profiles').select('id').eq('user_id', volunteerUser.id).single();
    
    const currentCase = await this.transitionStatus(caseId, CaseStatus.COMPLETED_PENDING_VERIFICATION, volunteerUser, 'Volunteer submitted proof for review', CaseStatus.IN_PROGRESS);
    
    await supabaseAdmin.from('proof_submissions').insert({
       case_id: caseId,
       volunteer_id: volunteer?.id,
       notes
    });

    return currentCase;
  }

  // ==== ADMIN CONTROL METHODS ====

  static async adminAssign(caseId: string, volunteerId: string, admin: Profile): Promise<Case> {
    if (admin.role !== 'ADMIN') throw new Error('Forbidden');
    const currentCase = await this.getCaseById(caseId, admin);

    if (![CaseStatus.READY_FOR_ASSIGNMENT, CaseStatus.UNDER_REVIEW].includes(currentCase.status)) {
       throw new Error(`Cannot assign case in state: ${currentCase.status}`);
    }

    const { data: updatedCase, error } = await supabaseAdmin.from('cases')
      .update({ assigned_volunteer_id: volunteerId, status: CaseStatus.ASSIGNED, updated_at: new Date() })
      .eq('id', caseId).select().single();
      
    if (error) throw new Error(error.message);

    await supabaseAdmin.from('assignments').insert({
      case_id: caseId,
      volunteer_id: volunteerId,
      assigned_by: admin.id,
      status: AssignmentStatus.ASSIGNED
    });

    await this.logHistory(caseId, CaseStatus.ASSIGNED, admin, `Case assigned to volunteer ${volunteerId}`);
    return updatedCase as Case;
  }

  static async adminReassign(caseId: string, volunteerId: string, admin: Profile): Promise<Case> {
     // Admin overrides current assignment
     await supabaseAdmin.from('assignments')
       .update({ status: AssignmentStatus.CANCELLED })
       .eq('case_id', caseId).in('status', ['ASSIGNED', 'ACCEPTED']);
       
     return await this.adminAssign(caseId, volunteerId, admin);
  }

  static async verifyProof(caseId: string, admin: Profile, note: string): Promise<Case> {
      const updatedCase = await this.transitionStatus(caseId, CaseStatus.COMPLETED, admin, `Proof Verified: ${note}`, CaseStatus.COMPLETED_PENDING_VERIFICATION);
      
      const { data: volunteer } = await supabaseAdmin.from('cases').select('assigned_volunteer_id').eq('id', caseId).single();

      await supabaseAdmin.from('proof_submissions')
         .update({ verification_status: 'APPROVED', verified_by: admin.id, verified_at: new Date(), verification_note: note })
         .eq('case_id', caseId).eq('verification_status', 'PENDING');

      await supabaseAdmin.from('assignments')
         .update({ status: AssignmentStatus.COMPLETED, completed_at: new Date() })
         .eq('case_id', caseId).eq('volunteer_id', volunteer?.assigned_volunteer_id);

      return updatedCase;
  }

  static async rejectProof(caseId: string, admin: Profile, note: string): Promise<Case> {
      const updatedCase = await this.transitionStatus(caseId, CaseStatus.IN_PROGRESS, admin, `Proof Rejected: ${note}`, CaseStatus.COMPLETED_PENDING_VERIFICATION);
      
      await supabaseAdmin.from('proof_submissions')
         .update({ verification_status: 'REJECTED', verified_by: admin.id, verified_at: new Date(), verification_note: note })
         .eq('case_id', caseId).eq('verification_status', 'PENDING');

      return updatedCase;
  }

  static async escalateCase(caseId: string, admin: Profile, note: string): Promise<Case> {
      return await this.transitionStatus(caseId, CaseStatus.ESCALATED, admin, `Escalated: ${note}`);
  }

  static async failCase(caseId: string, admin: Profile, note: string): Promise<Case> {
      return await this.transitionStatus(caseId, CaseStatus.FAILED, admin, `Marked Failed: ${note}`);
  }
}
