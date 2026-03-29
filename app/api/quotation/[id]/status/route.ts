import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { status } = await request.json();

        if (!status || !["pending", "reserved", "booked", "cancelled"].includes(status)) {
            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }

        console.log(`[API] Received request to update quotation ID: ${id} to status: ${status}`);

        const quotation = await db.get(id);

        if (!quotation) {
            console.error(`[API] Quotation with ID ${id} not found.`);
            return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
        }

        console.log(`[API] Data fetched successfully. Current status is ${quotation.bookingStatus || 'pending'}`);

        quotation.bookingStatus = status;
        quotation.updatedAt = new Date().toISOString();

        await db.set(quotation);
        console.log(`[API] Database updated successfully for ID ${id} -> ${status}`);

        return NextResponse.json({ message: "Status updated successfully", quotation }, { status: 200 });
    } catch (error: any) {
        console.error(`[API] Internal server error editing status: ${error.message}`);
        return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
    }
}
