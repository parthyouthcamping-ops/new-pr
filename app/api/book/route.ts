import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    try {
        if (slug) {
            const { data, error } = await supabase.from('bookings').select('*').eq('trip_slug', slug).order('created_at', { ascending: false }).limit(1).maybeSingle();
            if (error) throw error;
            return NextResponse.json(data || null);
        } else {
            const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return NextResponse.json(data);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, id, status, tripSlug, name, phone, email } = body;

        // Note: Table Initialization happens in Supabase Dashboard directly when the user sets it up.

        if (action === 'update_status') {
            const { data: getSlugRes } = await supabase.from('bookings').select('trip_slug').eq('id', id).maybeSingle();
            const activeSlug = tripSlug || (getSlugRes ? getSlugRes.trip_slug : null);

            const { error: updateError } = await supabase.from('bookings').update({ status }).eq('id', id);
            if (updateError) throw updateError;

            // Sync the quotation document's bookingStatus so the client page reflects it
            if (activeSlug) {
                try {
                    const res = await fetch(`${new URL(request.url).origin}/api/db`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'getAll' })
                    });
                    if (res.ok) {
                        const qs: any[] = await res.json();
                        const q = qs.find((q: any) => q.slug === activeSlug);
                        // Always allow status updates (admin can set any status)
                        if (q) {
                            q.bookingStatus = status;
                            q.isBooked    = status === 'booked';
                            q.isReserved  = status === 'reserved';
                            q.updatedAt   = new Date().toISOString();
                            await fetch(`${new URL(request.url).origin}/api/db`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'set', id: q.id, slug: q.slug, data: q })
                            });
                        }
                    }
                } catch (syncErr) {
                    console.error('[API /book] Failed to sync quotation status:', syncErr);
                }
            }
            return NextResponse.json({ success: true, status });
        }

        if (action === 'delete') {
            const { error } = await supabase.from('bookings').delete().eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        console.log(`[API /book] New Request. Slug: ${tripSlug}, Customer: ${name}, Action: ${action || 'New Booking'}`);

        // Prevent duplicate or already booked trips
        if (tripSlug) {
            console.log(`[API /book] Validating trip slug: ${tripSlug}`);
            const res = await fetch(`${new URL(request.url).origin}/api/db`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'getAll' })
            });
            if (res.ok) {
                const qs: any[] = await res.json();
                const q = qs.find((q: any) => q.slug === tripSlug);
                console.log(`[API /book] Found Quotation? ${!!q}. Current Status: ${q?.bookingStatus}`);
                if (q && q.bookingStatus === 'booked') {
                    console.error(`[API /book] Rejected: Trip ${tripSlug} is already booked.`);
                    return NextResponse.json({ error: "Trip is already booked." }, { status: 400 });
                }
            } else {
                console.error(`[API /book] Failed to fetch quotations for validation.`);
            }
        }

        const { data: existing } = await supabase.from('bookings').select('*').eq('trip_slug', tripSlug).eq('email', email);
        if (existing && existing.length > 0) {
            console.error(`[API /book] Rejected: Duplicate booking for ${email} on ${tripSlug}.`);
            return NextResponse.json({ error: "Duplicate booking detected for this trip and email." }, { status: 400 });
        }

        const { travelers, travelDates, specialRequests } = body;

        // New Booking
        const { data: result, error: insertError } = await supabase.from('bookings').insert({
            trip_slug: tripSlug,
            customer_name: name,
            phone,
            email,
            status: 'pending',
            travelers: travelers || null,
            travel_dates: travelDates || null,
            special_requests: specialRequests || null
        }).select();

        if (insertError) throw insertError;

        // Note: Automatic quotation status update to 'pending' removed as requested.
        // Status should be updated manually via admin action.

        return NextResponse.json(result ? result[0] : { success: true });
    } catch (error: any) {
        console.error('Booking API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
