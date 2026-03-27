import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
    if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'DB URL not set' }, { status: 500 });
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const sql = neon(process.env.DATABASE_URL);

    try {
        if (slug) {
            const result = await sql`SELECT * FROM bookings WHERE trip_slug = ${slug} ORDER BY created_at DESC LIMIT 1`;
            return NextResponse.json(result[0] || null);
        } else {
            const result = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
            return NextResponse.json(result);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'DB URL not set' }, { status: 500 });
    const sql = neon(process.env.DATABASE_URL);

    try {
        const body = await request.json();
        const { action, id, status, tripSlug, name, phone, email } = body;

        // Initialize table if not exists (one-time or check)
        await sql`
            CREATE TABLE IF NOT EXISTS bookings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                trip_slug TEXT NOT NULL,
                customer_name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT,
                status TEXT DEFAULT 'reserved',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;

        if (action === 'update_status') {
             const getSlugRes = await sql`SELECT trip_slug FROM bookings WHERE id = ${id}`;
             const activeSlug = tripSlug || (getSlugRes.length > 0 ? getSlugRes[0].trip_slug : null);

             await sql`UPDATE bookings SET status = ${status} WHERE id = ${id}`;
             // Also update Quotation status
             if (activeSlug) {
                 const res = await fetch(`${new URL(request.url).origin}/api/db`, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ action: 'getAll' })
                 });
                 if (res.ok) {
                     const qs: any[] = await res.json();
                     const q = qs.find(q => q.slug === activeSlug);
                     if (q && q.bookingStatus !== 'booked') {
                         q.bookingStatus = status;
                         q.updatedAt = new Date().toISOString();
                         await fetch(`${new URL(request.url).origin}/api/db`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'set', id: q.id, slug: q.slug, data: q })
                         });
                     }
                 }
             }
             return NextResponse.json({ success: true });
        }

        if (action === 'delete') {
            await sql`DELETE FROM bookings WHERE id = ${id}`;
            return NextResponse.json({ success: true });
        }

        // Prevent duplicate or already booked trips
        if (tripSlug) {
            const res = await fetch(`${new URL(request.url).origin}/api/db`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'getAll' })
            });
            if (res.ok) {
                const qs: any[] = await res.json();
                const q = qs.find(q => q.slug === tripSlug);
                if (q && q.bookingStatus === 'booked') {
                    return NextResponse.json({ error: "Trip is already booked." }, { status: 400 });
                }
            }
        }

        const existing = await sql`SELECT * FROM bookings WHERE trip_slug = ${tripSlug} AND email = ${email}`;
        if (existing.length > 0) {
            return NextResponse.json({ error: "Duplicate booking detected for this trip and email." }, { status: 400 });
        }

        // New Booking
        const result = await sql`
            INSERT INTO bookings (trip_slug, customer_name, phone, email, status)
            VALUES (${tripSlug}, ${name}, ${phone}, ${email}, 'booked')
            RETURNING *
        `;

        // Update Quotation to booked
        try {
            const res = await fetch(`${new URL(request.url).origin}/api/db`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'getAll' })
            });
            if (res.ok) {
                const qs: any[] = await res.json();
                const q = qs.find(q => q.slug === tripSlug);
                if (q && q.bookingStatus !== 'booked') {
                    q.bookingStatus = 'booked';
                    q.updatedAt = new Date().toISOString();
                    await fetch(`${new URL(request.url).origin}/api/db`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'set', id: q.id, slug: q.slug, data: q })
                    });
                }
            }
        } catch (e) { console.error('Error updating quotation status to booked'); }

        return NextResponse.json(result[0]);
    } catch (error: any) {
        console.error('Booking API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
