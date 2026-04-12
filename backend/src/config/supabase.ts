import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Supabase backend service implementation capable of processing authenticated requests
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
