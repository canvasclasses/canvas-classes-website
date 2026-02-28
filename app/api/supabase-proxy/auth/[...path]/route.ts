import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxyRequest(request, path, 'GET');
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxyRequest(request, path, 'POST');
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxyRequest(request, path, 'PUT');
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxyRequest(request, path, 'PATCH');
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxyRequest(request, path, 'DELETE');
}

async function handleProxyRequest(
    request: NextRequest,
    pathSegments: string[],
    method: string
) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
        console.error('❌ Supabase URL not configured in proxy');
        return NextResponse.json(
            { error: 'Supabase URL not configured' },
            { status: 500 }
        );
    }

    const path = pathSegments.join('/');
    const targetUrl = `${supabaseUrl}/auth/v1/${path}`;

    const url = new URL(targetUrl);
    request.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
    });

    if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 [Auth Proxy] ${method} /auth/v1/${path}`);
        console.log(`   → Forwarding to: ${url.toString()}`);
    }

    const headers: HeadersInit = {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    };

    const authHeader = request.headers.get('authorization');
    if (authHeader) {
        headers['authorization'] = authHeader;
    }

    const contentType = request.headers.get('content-type');
    if (contentType) {
        headers['content-type'] = contentType;
    }

    const clientInfo = request.headers.get('x-client-info');
    if (clientInfo) {
        headers['x-client-info'] = clientInfo;
    }

    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
        try {
            const text = await request.text();
            if (text) {
                body = text;
            }
        } catch (error) {
            console.error('Error reading request body:', error);
        }
    }

    try {
        const response = await fetch(url.toString(), {
            method,
            headers,
            body,
            redirect: 'manual',
        });

        if (process.env.NODE_ENV === 'development') {
            console.log(`   ✅ Response: ${response.status} ${response.statusText}`);
        }

        // Handle redirect responses (e.g., OAuth authorize → Google)
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location');
            if (location) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`   ↪ Redirect to: ${location}`);
                }
                return NextResponse.redirect(location);
            }
        }

        // Log error responses for debugging
        if (response.status >= 400) {
            const errorText = await response.text();
            if (process.env.NODE_ENV === 'development') {
                console.error(`   ❌ Error response body:`, errorText);
            }
            
            const responseHeaders = new Headers();
            response.headers.forEach((value, key) => {
                if (
                    key.toLowerCase() !== 'content-encoding' &&
                    key.toLowerCase() !== 'transfer-encoding'
                ) {
                    responseHeaders.set(key, value);
                }
            });

            return new NextResponse(errorText, {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders,
            });
        }

        const responseHeaders = new Headers();
        
        response.headers.forEach((value, key) => {
            if (
                key.toLowerCase() !== 'content-encoding' &&
                key.toLowerCase() !== 'transfer-encoding'
            ) {
                responseHeaders.set(key, value);
            }
        });

        const data = await response.text();

        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('❌ [Auth Proxy] Error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to authentication service' },
            { status: 502 }
        );
    }
}
