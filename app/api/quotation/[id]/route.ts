
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getQuotationSmart, deleteQuotationSmart } from "@/lib/db-smart";

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

        const res = await deleteQuotationSmart(id);
        return NextResponse.json(res);
    } catch (error: any) {
        console.error(`[API /api/quotation] DELETE ERROR:`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
