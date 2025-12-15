import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-Demand Revalidation API Route
 * 
 * Call this endpoint to immediately regenerate static pages after
 * updating content in the admin dashboard.
 * 
 * Usage:
 * POST /api/revalidate
 * Headers: x-revalidate-secret: YOUR_SECRET
 * 
 * Optional body:
 * { "path": "/blog" } - to revalidate a specific path
 */
export async function POST(request: NextRequest) {
    try {
        // Verify the secret token
        const secret = request.headers.get('x-revalidate-secret');

        if (secret !== process.env.REVALIDATE_SECRET) {
            return NextResponse.json(
                { error: 'Invalid revalidation secret' },
                { status: 401 }
            );
        }

        // Parse optional request body for specific path
        let pathToRevalidate = '/';
        try {
            const body = await request.json();
            if (body.path) {
                pathToRevalidate = body.path;
            }
        } catch {
            // No body or invalid JSON - revalidate homepage
        }

        // Revalidate the specified path
        revalidatePath(pathToRevalidate, 'layout');

        // Also revalidate common paths
        revalidatePath('/', 'page');
        revalidatePath('/blog', 'page');

        return NextResponse.json({
            revalidated: true,
            path: pathToRevalidate,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[Revalidation] Error:', error);
        return NextResponse.json(
            { error: 'Revalidation failed' },
            { status: 500 }
        );
    }
}

// Also support GET for simple webhook integrations
export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json(
            { error: 'Invalid revalidation secret' },
            { status: 401 }
        );
    }

    revalidatePath('/', 'layout');
    revalidatePath('/blog', 'page');

    return NextResponse.json({
        revalidated: true,
        timestamp: new Date().toISOString(),
    });
}
