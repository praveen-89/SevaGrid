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
   * Deterministic recommendation solver prioritizing matching categories, current availability, and rating heuristics.
   */
  static async getRecommended(caseId: string) {
      // Fetch case to get the category
      const { data: caseData, error: caseErr } = await supabaseAdmin.from('cases').select('category').eq('id', caseId).single();
      if (caseErr || !caseData) throw new Error('Target Case missing for recommendation mapping');

      // Fetch active volunteers with their specialties
      const { data, error } = await supabaseAdmin
         .from('volunteer_profiles')
         .select('*, profiles(name, email, avatar_url, phone), volunteer_specialties(specialty)');

      if (error || !data) throw new Error(`Optimization engine misfired: ${error?.message || 'Unknown Db Error'}`);

      // Evaluate the heuristic formula natively inside node.js
      const scoredVolunteers = data.map((vol: any) => {
         let score = 0;
         
         // Base availability (+3 points)
         if (vol.status === 'AVAILABLE') score += 3;
         
         // Heavy load penalty (-2 points)
         if (vol.active_tasks_count > 3) score -= 2;

         // Direct rating projection scalar (+ Rating scaled)
         score += (vol.rating * 0.5);

         // Match specialty logic mapping against case Category context strings
         const hasSpecialtyMatch = vol.volunteer_specialties.some((vs: any) => 
            vs.specialty.toLowerCase().includes(caseData.category.toLowerCase()) || 
            caseData.category.toLowerCase().includes(vs.specialty.toLowerCase())
         );
         
         if (hasSpecialtyMatch) score += 2;

         return {
            ...vol,
            recommendation_score: score,
            matched_specialty: hasSpecialtyMatch
         };
      });

      // Sort descending and cap output
      scoredVolunteers.sort((a, b) => b.recommendation_score - a.recommendation_score);
      return scoredVolunteers.slice(0, 5); 
  }
}
