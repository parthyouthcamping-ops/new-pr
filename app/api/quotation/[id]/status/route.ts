import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { status } = await request.json();

        if (!status || !["pending", "reserved", "booked", "cancelled"].includes(status)) {
            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }

        const quotation = await db.get(id);

        if (!quotation) {
            return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
        }

        // Prevent updating if already booked (business logic requirement)
        // Wait: The requirement says: "Prevent updating if already "booked"".
        // Sometimes admins might need to cancel a booked trip, but let's strict to the requirement first.
        if (quotation.bookingStatus === "booked" && status !== "booked") {
             // Maybe allow only admin to change it? 
             // "Only admin can change status manually" is a requirement. 
             // Since this is the admin API (used from admin dashboard), we should probably allow admin to override. But "Prevent updating if already booked" was explicitly requested. Let's do it:
             return NextResponse.json({ error: "Cannot change status of an already booked trip" }, { status: 400 });
        }

        quotation.bookingStatus = status;
        quotation.updatedAt = new Date().toISOString();

        await db.set(quotation);

        return NextResponse.json({ message: "Status updated successfully", quotation }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
    }
}
