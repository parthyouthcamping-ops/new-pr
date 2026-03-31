
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getQuotationSmart } from "@/lib/db-smart";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'ID/Slug is required' }, { status: 400 });
        }
        
        const quoteData = await getQuotationSmart(id);

        if (!quoteData) {
            console.error(`[API /api/quotation/${id}] Not found`);
            return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
        }

        // Defensive: ensure required fields
        if (!quoteData.id || !quoteData.slug) {
            console.error(`[API /api/quotation/${id}] Malformed data:`, quoteData);
            return NextResponse.json({ error: 'Malformed quotation data' }, { status: 500 });
        }

        return NextResponse.json(quoteData);
    } catch (error: any) {
        console.error(`[API /api/quotation] ERROR:`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // DELETE: We just try Supabase directly as most new work is there
        const { error } = await supabase.from('quotations').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Quotation deleted successfully' });
    } catch (error: any) {
        console.error(`[API /api/quotation] DELETE ERROR:`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
