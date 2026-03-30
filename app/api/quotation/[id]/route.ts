import { NextResponse } from 'next/server';
import { getQuotationApiByIdOrSlugSmart } from "@/lib/quotations-smart";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID/Slug is required' }, { status: 400 });
        }
        const quoteData = await getQuotationApiByIdOrSlugSmart(id);

        if (!quoteData) {
            return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
        }

        return NextResponse.json(quoteData);
    } catch (error: any) {
        console.error('[FETCH QUOTATION ERROR]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
