import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        if (!supabase) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Supabase client not configured',
                    timestamp: new Date().toISOString(),
                },
                { status: 500 }
            );
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: `Supabase connection failed: ${error.message}`,
                    timestamp: new Date().toISOString(),
                },
                { status: 502 }
            );
        }

        return NextResponse.json({
            status: 'ok',
            message: 'Supabase connection successful',
            authenticated: !!data.session,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('Health check error:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: `Health check failed: ${error.message || 'Unknown error'}`,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
