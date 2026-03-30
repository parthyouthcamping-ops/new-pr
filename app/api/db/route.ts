import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/** Ensure a value is safe to store in Neon JSONB (no File objects / non-serialisable values). */
function sanitizePayload(data: any): any {
    if (!data || typeof data !== 'object') return data;
    return JSON.parse(JSON.stringify(data, (_key, value) => {
        // Drop File objects, Blob, undefined — anything not JSON-serialisable
        if (value instanceof File || value instanceof Blob) return undefined;
        if (typeof value === 'undefined') return null;
        return value;
    }));
}

const isUrl = (v: unknown): v is string =>
    typeof v === 'string' && (v.startsWith('http://') || v.startsWith('https://'));

function scrubImageFields(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const scrubHotels = (hotels: any[]) =>
        (hotels || []).map((h: any) => ({
            ...h,
            photos: (h.photos || []).filter(isUrl)
        }));

    return {
        ...data,
        heroImage:        isUrl(data.heroImage)        ? data.heroImage        : null,
        coverImage:       isUrl(data.coverImage)       ? data.coverImage       : null,
        routeMap:         isUrl(data.routeMap)         ? data.routeMap         : null,
        experiencePhotos: (data.experiencePhotos || []).filter(isUrl),
        hotels:           scrubHotels(data.hotels),
        lowLevelHotels:   scrubHotels(data.lowLevelHotels),
        highLevelHotels:  scrubHotels(data.highLevelHotels),
        itinerary: (data.itinerary || []).map((day: any) => ({
            ...day,
            photos: (day.photos || []).filter(isUrl)
        })),
        expert: data.expert ? {
            ...data.expert,
            photo: isUrl(data.expert.photo) ? data.expert.photo : null
        } : data.expert,
        customSections: (data.customSections || []).map((s: any) => ({
            ...s,
            image: isUrl(s.image) ? s.image : null
        }))
    };
}

export async function POST(request: Request) {
    let requestData: any = {};

    try {
        requestData = await request.json();
        const { action, id, slug, data } = requestData;

        if (action === 'set') {
            // Scrub image fields, then sanitize to pure JSON before handing to Neon
            const cleanData = sanitizePayload(id === 'global_brand' ? data : scrubImageFields(data));

            console.log('[DB API] Saving payload for id:', id, '— keys:', Object.keys(cleanData || {}));

            // Stringify explicitly if needed, but Supabase accepts JS objects for JSONB columns!
            // However, to be safe and consistent with the previous logic, we can pass cleanData directly.

            if (id === 'global_brand') {
                const { error } = await supabase.from('brand_settings').upsert({
                    id: 'global_brand',
                    data: cleanData,
                    updated_at: new Date().toISOString()
                });
                if (error) throw error;
            } else {
                const createdAt = cleanData?.createdAt || new Date().toISOString();
                const tripName = cleanData?.destination || 'New Trip';
                const price = cleanData?.highLevelPrice || 0;

                const { error } = await supabase.from('quotations').upsert({
                    id: id,
                    slug: slug,
                    itinerary: cleanData,
                    trip_name: tripName,
                    price: price,
                    created_at: createdAt
                });
                if (error) throw error;
            }
            return NextResponse.json({ success: true });
        }

        if (action === 'get') {
            if (id === 'global_brand') {
                const { data: record, error } = await supabase.from('brand_settings').select('data').eq('id', id).maybeSingle();
                if (error) throw error;
                return NextResponse.json(record?.data || null);
            } else {
                const { data: record, error } = await supabase.from('quotations').select('itinerary').eq('id', id).maybeSingle();
                if (error) throw error;
                return NextResponse.json(record?.itinerary || null);
            }
        }

        if (action === 'getAll') {
            const { data: records, error } = await supabase.from('quotations').select('itinerary').order('created_at', { ascending: false });
            if (error) throw error;
            return NextResponse.json(records?.map((r: any) => r.itinerary) || []);
        }

        if (action === 'delete') {
            const { error } = await supabase.from('quotations').delete().eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('[DB API] DATABASE ERROR:', {
            action: requestData?.action,
            id: requestData?.id,
            error: error.message,
            detail: error.detail,
            stack: error.stack,
        });

        if (error.code === '23505' || error.message?.includes('quotations_slug_key')) {
            return NextResponse.json({
                error: `The slug '${requestData.slug}' is already taken. Please try again.`,
                code: 'DUPLICATE_SLUG'
            }, { status: 400 });
        }

        return NextResponse.json({
            error: 'Database operation failed',
            message: error.message
        }, { status: 500 });
    }
}
