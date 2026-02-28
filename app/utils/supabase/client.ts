import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // Safety check for environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return null if Supabase is not configured
        return null;
    }

    // Use proxy URLs to bypass ISP DNS blocking
    // Point the client to our proxy endpoints instead of direct Supabase URLs
    const proxyUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : 'http://localhost:3000';

    // Create a custom fetch function that routes through our proxy
    const customFetch: typeof fetch = async (input, init?) => {
        let url =
            typeof input === 'string'
                ? input
                : input instanceof URL
                    ? input.toString()
                    : input.url;
        const originalUrl = url;
        
        // If this is a Supabase URL, route it through our proxy
        if (url.includes(new URL(supabaseUrl).hostname)) {
            const urlObj = new URL(url);
            const path = urlObj.pathname + urlObj.search;
            
            // Route auth requests through auth proxy
            if (path.startsWith('/auth/v1/')) {
                const proxyPath = path.replace('/auth/v1/', '/api/supabase-proxy/auth/');
                url = `${proxyUrl}${proxyPath}`;
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🔀 [Client] Routing auth request through proxy:`);
                    console.log(`   From: ${originalUrl}`);
                    console.log(`   To: ${url}`);
                }
            }
            // Route REST API requests through rest proxy
            else if (path.startsWith('/rest/v1/')) {
                const proxyPath = path.replace('/rest/v1/', '/api/supabase-proxy/rest/');
                url = `${proxyUrl}${proxyPath}`;
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🔀 [Client] Routing REST request through proxy:`);
                    console.log(`   From: ${originalUrl}`);
                    console.log(`   To: ${url}`);
                }
            }
        }
        
        // Call the original fetch with the potentially modified URL
        if (input instanceof Request) {
            return fetch(new Request(url, input), init);
        }

        return fetch(url, init);
    };

    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            global: {
                headers: {
                    'x-client-info': 'supabase-js-web',
                },
                fetch: customFetch,
            },
            auth: {
                flowType: 'pkce',
            },
        }
    )
}
