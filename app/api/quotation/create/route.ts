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
    if (!process.env.DATABASE_URL) {
        return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
    }
    const sql = neon(process.env.DATABASE_URL);

    try {
        const body = await request.json();
        const { trip_name, price, itinerary } = body;

        if (!trip_name || !price || !itinerary) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate slug: trip-name-randomString
        const randomStr = generateRandomString();
        const slug = `${slugify(trip_name)}-${randomStr}`;

        // Insert into DB
        // We'll use the ID if provided, otherwise gen_random_uuid in DB will handle it.
        const id = uuidv4();

        await sql`
            INSERT INTO quotations (id, slug, trip_name, price, itinerary)
            VALUES (${id}, ${slug}, ${trip_name}, ${price}, ${itinerary}::jsonb)
        `;

        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const fullLink = `${protocol}://${host}/quotation/${slug}`;

        return NextResponse.json({
            success: true,
            slug,
            fullLink,
            id
        });
    } catch (error: any) {
        console.error('[CREATE QUOTATION ERROR]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
