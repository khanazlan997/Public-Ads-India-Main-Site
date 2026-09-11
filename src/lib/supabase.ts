import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wsnatuiyqjcfmikpheld.supabase.co';
const supabaseKey = 'sb_publishable_k3HVXorzAd-DO9Q-oxzilw_0aEjDSgu';

export const supabase = createClient(supabaseUrl, supabaseKey);
