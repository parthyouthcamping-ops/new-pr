import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    if (!process.env.DATABASE_URL) {
        return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
    }
    const sql = neon(process.env.DATABASE_URL);

    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Fetch quotation from DB
        const result = await sql`
            SELECT id, slug, trip_name, price, itinerary, created_at
            FROM quotations
            WHERE slug = ${slug}
        `;

        if (result.length === 0) {
            return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
        }

        const quoteData = result[0];

        // Return the itinerary JSON (which we use to store the full Quotation object)
        // or a combined object if needed.
        return NextResponse.json({
            ...quoteData.itinerary,
            id: quoteData.id,
            slug: quoteData.slug,
            trip_name: quoteData.trip_name,
            price: quoteData.price,
            createdAt: quoteData.created_at
        });
    } catch (error: any) {
        console.error('[FETCH QUOTATION ERROR]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
