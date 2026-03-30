import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!process.env.DATABASE_URL) {
        return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
    }
    const sql = neon(process.env.DATABASE_URL);

    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID/Slug is required' }, { status: 400 });
        }

        // Fetch quotation from DB by slug or by ID
        const result = await sql`
            SELECT id, slug, itinerary, created_at
            FROM quotations
            WHERE slug = ${id} OR id = ${id}
        `;

        if (result.length === 0) {
            return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
        }

        const quoteData = result[0];

        // Return the full itinerary JSON
        return NextResponse.json({
            ...quoteData.itinerary,
            id: quoteData.id,
            slug: quoteData.slug,
            createdAt: quoteData.created_at
        });
    } catch (error: any) {
        console.error('[FETCH QUOTATION ERROR]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
