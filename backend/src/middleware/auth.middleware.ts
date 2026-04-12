import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../utils/APIResponse';
import { supabaseAdmin } from '../config/supabase';
import { Profile } from '../types';

/**
 * Validates incoming Authorization header bearing a Supabase issued JWT.
 * Asserts authenticity and retrieves the mapped Profiles database entity.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return APIResponse.error(res, 'Unauthorized - Missing or Invalid Token Header', null, 401);
    }

    const token = authHeader.split(' ')[1];

    // Process JWT auth against Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return APIResponse.error(res, 'Unauthorized - Invalid or Expired Token', null, 401);
    }

    // Capture the correlated Profile data
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return APIResponse.error(res, 'Profile context missing for this user', null, 404);
    }

    // Attach to context for downstream execution
    req.user = profile as Profile;
    next();
  } catch (err) {
    console.error('[Auth Error]', err);
    return APIResponse.error(res, 'Authorization Framework Error', null, 500);
  }
};
