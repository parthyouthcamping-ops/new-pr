import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID/Slug is required' }, { status: 400 });
        }

        // Fetch quotation from DB by slug or by ID
        const { data: result, error } = await supabase
            .from('quotations')
            .select('id, slug, itinerary, created_at')
            .or(`slug.eq.${id},id.eq.${id}`)
            .limit(1);

        if (error) throw error;

        if (!result || result.length === 0) {
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
