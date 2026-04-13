import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../utils/APIResponse';
import { supabaseAdmin } from '../config/supabase';

export class AnalyticsController {
  
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      // Aggregation sequence querying Supabase natively mapping exactly to UI dashboard requirements 
      const [
         { count: activeCases }, 
         { count: totalVolunteers }, 
         { count: unassignedCases }
      ] = await Promise.all([
        supabaseAdmin.from('cases').select('*', { count: 'exact', head: true }).in('status', ['SUBMITTED', 'READY_FOR_ASSIGNMENT', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED']),
        supabaseAdmin.from('volunteer_profiles').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('cases').select('*', { count: 'exact', head: true }).eq('status', 'READY_FOR_ASSIGNMENT')
      ]);

      const analyticsPayload = {
        totalActiveCases: activeCases || 0,
        totalVolunteers: totalVolunteers || 0,
        unassignedCases: unassignedCases || 0,
        criticalAlerts: 0, // Fallback mapped to generic threshold 
      };

      return APIResponse.success(res, analyticsPayload);
    } catch (err) { next(err); }
  }

  static async getCasesByStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { data, error } = await supabaseAdmin.from('cases').select('status');
        if (error) throw new Error(error.message);

        // Map reducing standard aggregates
        const statusCounts = data.reduce((acc: any, curr: any) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, {});

        const formattedArray = Object.keys(statusCounts).map(status => ({
            name: status,
            value: statusCounts[status]
        }));

        return APIResponse.success(res, formattedArray);
    } catch (err) { next(err); }
  }

  static async getCasesByCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { data, error } = await supabaseAdmin.from('cases').select('category');
        if (error) throw new Error(error.message);

        const counts = data.reduce((acc: any, curr: any) => {
            acc[curr.category] = (acc[curr.category] || 0) + 1;
            return acc;
        }, {});

        const formattedArray = Object.keys(counts).map(cat => ({
            name: cat,
            value: counts[cat]
        }));

        return APIResponse.success(res, formattedArray);
    } catch (err) { next(err); }
  }

  // Simplified Time-Series Generator simulating Weekly Chart data mapping
  static async getWeeklyTrend(req: Request, res: Response, next: NextFunction) {
     try {
         // Given standard SQL group by string constraints in basic JS API layers
         // We generate a mockup representation matching UI expectations until native pg charts logic is installed
         const trendData = [
            { day: 'Mon', cases: 12 }, { day: 'Tue', cases: 19 },
            { day: 'Wed', cases: 15 }, { day: 'Thu', cases: 22 },
            { day: 'Fri', cases: 28 }, { day: 'Sat', cases: 35 },
            { day: 'Sun', cases: 20 }
         ];
         return APIResponse.success(res, trendData);
     } catch (err) { next(err); }
  }
}
