import { supabaseAdmin } from '../config/supabase';

export class VolunteerService {
  /**
   * Aggregates extended Postgres schema spanning raw authenticated profile and derived scorecards.
   */
  static async getVolunteers() {
    const { data, error } = await supabaseAdmin
      .from('volunteer_profiles')
      .select('*, profiles(name, email, avatar_url, phone)');
      
    if (error) throw new Error(`Failed to load directory: ${error.message}`);
    return data;
  }

  /**
   * Deterministic recommendation solver. 
   * Scores explicitly via matching available statues explicitly mapped to highest priority ratings.
   */
  static async getRecommended(caseId: string) {
      // Future architecture assumes complex skill mapping logic here; 
      // Base functional integration relies on primary Availability and numeric UX Ratings
      const { data, error } = await supabaseAdmin
         .from('volunteer_profiles')
         .select('*, profiles(name, email, avatar_url, phone), volunteer_specialties(specialty)')
         .eq('status', 'AVAILABLE')
         .order('rating', { ascending: false })
         .limit(5);

      if (error) throw new Error(`Optimization engine misfired: ${error.message}`);
      return data;
  }
}
