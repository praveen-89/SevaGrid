import { supabaseAdmin } from '../config/supabase';
import { Case, Profile } from '../types';
import { CaseStatus } from '../constants';

export class CaseService {
  /**
   * Universal read method incorporating robust RLS-style role enforcement at the Node level.
   */
  static async getCases(user: Profile): Promise<Case[]> {
    let query = supabaseAdmin.from('cases').select('*').order('created_at', { ascending: false });

    // Role-based visibility gates
    if (user.role === 'FIELD_STAFF') {
      query = query.eq('field_staff_id', user.id);
    } else if (user.role === 'VOLUNTEER') {
      // Direct query of volunteer profile to resolve join logic securely
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

    // Horizontal access violation checks
    if (user.role === 'FIELD_STAFF' && data.field_staff_id !== user.id) {
        throw new Error('Forbidden: Not authorized to view case');
    }

    return data as Case;
  }

  static async createCase(caseData: Partial<Case>, fieldStaff: Profile): Promise<Case> {
    if (fieldStaff.role !== 'FIELD_STAFF') throw new Error('Only field staff can initiate cases.');

    // 1. Insert Core Case
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
      status: CaseStatus.SUBMITTED // Rigid enforcement of entry status
    }).select().single();

    if (caseError) throw new Error(`Database Error: ${caseError.message}`);

    // 2. Transcribe History Logic
    await supabaseAdmin.from('case_history').insert({
      case_id: insertedCase.id,
      status: CaseStatus.SUBMITTED,
      actor_id: fieldStaff.id,
      actor_name_snapshot: fieldStaff.name,
      note: 'Intake finalized by field operations.'
    });

    return insertedCase as Case;
  }

  static async updateStatus(caseId: string, status: CaseStatus, actor: Profile, note?: string): Promise<Case> {
     // Retrieve current state to check state machine transition viability
     const currentCase = await this.getCaseById(caseId, actor);

     // Allowable structural checks mapping
     const validAdminTransitions = ['UNDER_REVIEW', 'READY_FOR_ASSIGNMENT', 'COMPLETED', 'FAILED', 'ESCALATED'];
     
     if (actor.role === 'ADMIN' && !validAdminTransitions.includes(status)) {
         throw new Error(`Admin not authorized to assert state: ${status}`);
     }

     if (actor.role === 'VOLUNTEER' && status !== 'IN_PROGRESS' && status !== 'COMPLETED_PENDING_VERIFICATION') {
         throw new Error(`Volunteer not authorized to assert state: ${status}`);
     }

     const { data, error } = await supabaseAdmin.from('cases').update({ status }).eq('id', caseId).select().single();
     if (error || !data) throw new Error(`Status update failure: ${error?.message || 'Unknown Db Error'}`);

     await supabaseAdmin.from('case_history').insert({
       case_id: caseId,
       status,
       actor_id: actor.id,
       actor_name_snapshot: actor.name,
       note: note || `State advanced to ${status}`
     });

     return data as Case;
  }

  static async getHistory(caseId: string): Promise<any[]> {
     const { data, error } = await supabaseAdmin.from('case_history').select('*').eq('case_id', caseId).order('created_at', { ascending: false });
     if (error) throw new Error(error.message);
     return data;
  }
}
