import { NextResponse } from 'next/server';
import { quotationValidStatuses, updateQuotationStatusByIdSmart } from "@/lib/quotations-smart";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { status } = await request.json();

        if (!status || !quotationValidStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${quotationValidStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        console.log(`[API /quotation/${id}/status] Updating to: ${status}`);
        const updated = await updateQuotationStatusByIdSmart(id, status);

        if (!updated) {
            console.error(`[API /quotation/${id}/status] Not found`);
            return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
        }

        console.log(`[API /quotation/${id}/status] ${updated.previousStatus} → ${updated.newStatus} ✓`);

        return NextResponse.json(
            {
                message: 'Status updated successfully',
                id,
                previousStatus: updated.previousStatus,
                newStatus: updated.newStatus,
                isBooked: updated.isBooked,
                isReserved: updated.isReserved,
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error(`[API /quotation/status] Error:`, error.message);
        return NextResponse.json(
            { error: 'Internal Server Error', message: error.message },
            { status: 500 }
        );
    }
}
