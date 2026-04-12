import { supabaseAdmin } from '../config/supabase';
import { Profile } from '../types';
import { AssignmentStatus, CaseStatus } from '../constants';

export class AssignmentService {
  /**
   * Orchestrates the linking of a volunteer to a case and updates overarching state limits.
   */
  static async assignVolunteer(caseId: string, volunteerId: string, admin: Profile, note?: string) {
    if (admin.role !== 'ADMIN') throw new Error('Forbidden: Assignment logic is restricted to Admins.');

    // 1. Audit Table Registration
    const { data: assignment, error: assignError } = await supabaseAdmin.from('assignments').insert({
      case_id: caseId,
      volunteer_id: volunteerId,
      assigned_by: admin.id,
      status: AssignmentStatus.ASSIGNED,
      note
    }).select().single();

    if (assignError) throw new Error(`Assignment registry corrupted: ${assignError.message}`);

    // 2. Cascade Mutate global case table
    const { error: caseError } = await supabaseAdmin.from('cases').update({
       assigned_volunteer_id: volunteerId,
       status: CaseStatus.ASSIGNED
    }).eq('id', caseId);

    if (caseError) throw new Error(`Case metadata sync failed: ${caseError.message}`);

    // 3. Document into Timeline Matrix
    await supabaseAdmin.from('case_history').insert({
      case_id: caseId,
      status: CaseStatus.ASSIGNED,
      actor_id: admin.id,
      actor_name_snapshot: admin.name,
      note: `Task forcibly assigned to Volunteer ${volunteerId} by Admin override.`
    });

    return assignment;
  }
}
