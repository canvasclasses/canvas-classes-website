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
        return NextResponse.json(
            { error: 'Supabase URL not configured' },
            { status: 500 }
        );
    }

    const path = pathSegments.join('/');
    const targetUrl = `${supabaseUrl}/rest/v1/${path}`;

    const url = new URL(targetUrl);
    request.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
    });

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

    const preferHeader = request.headers.get('prefer');
    if (preferHeader) {
        headers['prefer'] = preferHeader;
    }

    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
        headers['range'] = rangeHeader;
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
        });

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
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to database service' },
            { status: 502 }
        );
    }
}
