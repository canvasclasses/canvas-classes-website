import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return null;
    }

    // Admin app talks to Supabase directly (no proxy). The student-side
    // proxy exists to dodge Indian ISP DNS blocking — admin users are
    // pre-provisioned operators who can resolve that themselves.
    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            auth: {
                flowType: 'pkce',
            },
        }
    )
}
