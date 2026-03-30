import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

/**
 * Slugify a string: "Trip Name" -> "trip-name"
 */
function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

/**
 * Generate a random 6-character alphanumeric string
 */
function generateRandomString(length: number = 6) {
    return Math.random().toString(36).substring(2, 2 + length);
}

export async function POST(request: Request) {
    console.log('[API/QUOTATION/CREATE] Request received.');

    if (!process.env.DATABASE_URL) {
        console.error('[API/QUOTATION/CREATE] DATABASE_URL missing.');
        return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        const body = await request.json();
        const { trip_name, price, itinerary, clientName, destination } = body;

        // Use trip_name or clientName/destination if provided
        const finalTripName = trip_name || `${destination || 'Trip'} for ${clientName || 'Valued Client'}`;

        if (!finalTripName || !price || !itinerary) {
            console.warn('[API/QUOTATION/CREATE] Missing fields:', { finalTripName, price, hasItinerary: !!itinerary });
            return NextResponse.json({ error: 'Missing required fields (trip_name, price, itinerary)' }, { status: 400 });
        }

        // Generate slug: trip-name-randomString
        const randomStr = generateRandomString();
        const slug = `${slugify(finalTripName)}-${randomStr}`;
        const id = uuidv4();

        console.log('[API/QUOTATION/CREATE] Inserting quotation:', { id, slug, finalTripName });

        // Ensure itinerary is a valid JSON string if it's an object
        const itineraryJson = typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary);

        await sql`
            INSERT INTO quotations (id, slug, trip_name, price, itinerary, created_at, updated_at)
            VALUES (${id}, ${slug}, ${finalTripName}, ${price}, ${itineraryJson}::jsonb, NOW(), NOW())
        `;

        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const fullLink = `${protocol}://${host}/quotation/${slug}`;

        console.log('[API/QUOTATION/CREATE] Quotation saved successfully:', { slug });

        return NextResponse.json({
            success: true,
            slug,
            fullLink,
            id,
            message: 'Quotation created successfully'
        });

    } catch (error: any) {
        console.error('[API/QUOTATION/CREATE] UNCAUGHT ERROR:', error.message, error.stack);
        return NextResponse.json({ 
            error: 'Database save failed', 
            details: error.message,
            success: false
        }, { status: 500 });
    }
}
