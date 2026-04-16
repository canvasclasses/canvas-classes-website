import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/app/utils/supabase/server'
import { sanitizeRedirect } from '@/lib/redirectValidation'
import { trackServer, peopleSetOnceServer } from '@/lib/analytics/mixpanel'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // Sanitize redirect target to prevent open-redirect attacks
    const next = sanitizeRedirect(searchParams.get('next'))

    if (code) {
        const supabase = await createClient()
        if (!supabase) {
            return NextResponse.redirect(`${origin}/auth/auth-code-error`)
        }
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const createdAt = new Date(user.created_at).getTime();
                const isNewSignup = Date.now() - createdAt < 10 * 60 * 1000;
                if (isNewSignup) {
                    await trackServer(user.id, 'user_signed_up', {
                        signup_method: user.app_metadata?.provider ?? 'email',
                        email_domain: user.email?.split('@')[1],
                    });
                    await peopleSetOnceServer(user.id, {
                        signup_date: user.created_at,
                        email_domain: user.email?.split('@')[1],
                    });
                }
            }
            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
