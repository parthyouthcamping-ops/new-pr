
import { NextResponse } from 'next/server';
import { getQuotationApiByIdOrSlugSmart } from "@/lib/quotations-smart";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'ID/Slug is required' }, { status: 400 });
        }
        const quoteData = await getQuotationApiByIdOrSlugSmart(id);

        if (!quoteData) {
            console.error(`[API] Quotation not found for id/slug:`, id);
            return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
        }

        // Defensive: ensure required fields
        if (!quoteData.id || !quoteData.slug) {
            console.error(`[API] Quotation missing required fields:`, quoteData);
            return NextResponse.json({ error: 'Malformed quotation data' }, { status: 500 });
        }

        return NextResponse.json(quoteData);
    } catch (error: any) {
        console.error('[FETCH QUOTATION ERROR]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
