import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const VALID_STATUSES = ['pending', 'reserved', 'booked', 'cancelled', 'sent'];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { status } = await request.json();

        if (!status || !VALID_STATUSES.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
                { status: 400 }
            );
        }

        console.log(`[API /quotation/${id}/status] Updating to: ${status}`);

        // Fetch the current quotation row directly from DB
        const { data: record, error: fetchError } = await supabase
            .from('quotations')
            .select('itinerary')
            .eq('id', id)
            .single();

        if (fetchError || !record) {
            console.error(`[API /quotation/${id}/status] Not found`);
            return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
        }

        const quotation = record.itinerary as any;
        const prevStatus = quotation.bookingStatus;

        // Update status flags
        quotation.bookingStatus = status;
        quotation.isBooked      = status === 'booked';
        quotation.isReserved    = status === 'reserved';
        
        const { error: updateError } = await supabase
            .from('quotations')
            .update({ itinerary: quotation })
            .eq('id', id);

        if (updateError) throw updateError;

        console.log(`[API /quotation/${id}/status] ${prevStatus} → ${status} ✓`);

        return NextResponse.json({
            message: 'Status updated successfully',
            id,
            previousStatus: prevStatus,
            newStatus: status,
            isBooked: quotation.isBooked,
            isReserved: quotation.isReserved,
        }, { status: 200 });

    } catch (error: any) {
        console.error(`[API /quotation/status] Error:`, error.message);
        return NextResponse.json(
            { error: 'Internal Server Error', message: error.message },
            { status: 500 }
        );
    }
}
