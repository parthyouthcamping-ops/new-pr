import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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

        // Insert using Supabase Client
        const { error } = await supabase.from('quotations').insert({
            id,
            slug,
            trip_name: finalTripName,
            price,
            itinerary,
            created_at: new Date().toISOString()
        });

        if (error) {
            throw error;
        }

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
