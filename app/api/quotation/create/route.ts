
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { saveQuotationSmart } from '@/lib/db-smart';

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

function generateRandomString(length: number = 6) {
    return Math.random().toString(36).substring(2, 2 + length);
}

export async function POST(request: Request) {
    console.log('[API/QUOTATION/CREATE] Request received.');

    try {
        const body = await request.json();
        const { trip_name, price, itinerary, clientName, destination } = body;

        const finalTripName = trip_name || `${destination || 'Trip'} for ${clientName || 'Valued Client'}`;

        if (!finalTripName || !price || !itinerary) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const randomStr = generateRandomString();
        const slug = `${slugify(finalTripName)}-${randomStr}`;
        const id = uuidv4();

        console.log('[API/QUOTATION/CREATE] Saving smartly:', { id, slug });

        const result = await saveQuotationSmart(id, slug, {
            ...body,
            trip_name: finalTripName,
            price: price,
            itinerary: itinerary,
            createdAt: new Date().toISOString()
        });

        if (!result.success) {
            throw new Error('Fallback save failed');
        }

        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const fullLink = `${protocol}://${host}/quotation/${slug}`;

        return NextResponse.json({
            success: true,
            slug,
            fullLink,
            id,
            message: 'Quotation created successfully'
        });

    } catch (error: any) {
        console.error('[API/QUOTATION/CREATE] ERROR:', error.message);
        return NextResponse.json({ 
            error: 'Save failed', 
            details: error.message,
            success: false
        }, { status: 500 });
    }
}
