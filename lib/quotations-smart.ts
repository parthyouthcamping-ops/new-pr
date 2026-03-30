import { supabase } from '@/lib/supabase';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VALID_STATUSES = ['pending', 'reserved', 'booked', 'cancelled', 'sent'] as const;
export type BookingStatus = (typeof VALID_STATUSES)[number];

const hasSupabaseCreds = (): boolean =>
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const hasNeonCreds = (): boolean => Boolean(process.env.DATABASE_URL);

function parseMaybeJson(v: any): any {
    if (typeof v === 'string') {
        try {
            return JSON.parse(v);
        } catch {
            return v;
        }
    }
    return v;
}

async function getQuotationBySlugSupabase(slug: string): Promise<any | null> {
    const { data: record, error } = await supabase
        .from('quotations')
        .select('id, slug, trip_name, price, itinerary, created_at')
        .eq('slug', slug)
        .single();

    if (error || !record) return null;

    const itineraryData = parseMaybeJson(record.itinerary);
    if (!itineraryData) return null;

    return {
        ...itineraryData,
        id: record.id,
        slug: record.slug,
        trip_name: record.trip_name,
        price: record.price,
        createdAt: record.created_at,
    };
}

async function getQuotationApiByIdOrSlugSupabase(idOrSlug: string): Promise<any | null> {
    const isUUID = UUID_REGEX.test(idOrSlug);

    const query = supabase
        .from('quotations')
        .select('id, slug, itinerary, created_at')
        .limit(1);

    const { data: result, error } = isUUID
        ? await query.or(`slug.eq.${idOrSlug},id.eq.${idOrSlug}`)
        : await query.eq('slug', idOrSlug);

    if (error || !result || result.length === 0) return null;

    const quoteData = result[0];
    const itineraryData = parseMaybeJson(quoteData.itinerary);
    if (!itineraryData) return null;

    return {
        ...itineraryData,
        id: quoteData.id,
        slug: quoteData.slug,
        createdAt: quoteData.created_at,
    };
}

async function updateQuotationStatusByIdSupabase(id: string, status: string) {
    if (!VALID_STATUSES.includes(status as BookingStatus)) return null;

    const { data: record, error: fetchError } = await supabase
        .from('quotations')
        .select('itinerary')
        .eq('id', id)
        .single();

    if (fetchError || !record) return null;

    const quotation = parseMaybeJson(record.itinerary) as any;
    const prevStatus = quotation?.bookingStatus as string | undefined;

    quotation.bookingStatus = status;
    quotation.isBooked = status === 'booked';
    quotation.isReserved = status === 'reserved';

    const { error: updateError } = await supabase
        .from('quotations')
        .update({ itinerary: quotation })
        .eq('id', id);

    if (updateError) throw updateError;

    return {
        id,
        previousStatus: prevStatus,
        newStatus: status as BookingStatus,
        isBooked: quotation.isBooked,
        isReserved: quotation.isReserved,
    };
}

async function neonFallbackGetQuotationBySlug(slug: string): Promise<any | null> {
    if (!hasNeonCreds()) return null;
    const mod = await import('@/lib/quotations-neon');
    return mod.getQuotationBySlug(slug);
}

async function neonFallbackGetQuotationApiByIdOrSlug(idOrSlug: string): Promise<any | null> {
    if (!hasNeonCreds()) return null;
    const mod = await import('@/lib/quotations-neon');
    return mod.getQuotationApiByIdOrSlug(idOrSlug);
}

async function neonFallbackUpdateQuotationStatusById(id: string, status: string): Promise<any | null> {
    if (!hasNeonCreds()) return null;
    const mod = await import('@/lib/quotations-neon');
    return mod.updateQuotationStatusById(id, status);
}

export async function getQuotationBySlugSmart(slug: string): Promise<any | null> {
    if (hasSupabaseCreds()) {
        try {
            const data = await getQuotationBySlugSupabase(slug);
            if (data) return data;
            console.warn(`[quotations] Supabase quote not found for slug="${slug}", falling back to Neon (if configured).`);
        } catch (e) {
            // Fall through to Neon fallback
            console.warn(`[quotations] Supabase quote lookup failed for slug="${slug}", falling back to Neon.`, e);
        }
    }

    return neonFallbackGetQuotationBySlug(slug);
}

export async function getQuotationApiByIdOrSlugSmart(idOrSlug: string): Promise<any | null> {
    if (hasSupabaseCreds()) {
        try {
            const data = await getQuotationApiByIdOrSlugSupabase(idOrSlug);
            if (data) return data;
            console.warn(`[quotations] Supabase quotation not found for idOrSlug="${idOrSlug}", falling back to Neon (if configured).`);
        } catch (e) {
            // Fall through to Neon fallback
            console.warn(`[quotations] Supabase quotation lookup failed for idOrSlug="${idOrSlug}", falling back to Neon.`, e);
        }
    }

    return neonFallbackGetQuotationApiByIdOrSlug(idOrSlug);
}

export const quotationValidStatuses = VALID_STATUSES as readonly BookingStatus[];

export async function updateQuotationStatusByIdSmart(id: string, status: string): Promise<any | null> {
    if (hasSupabaseCreds()) {
        try {
            const updated = await updateQuotationStatusByIdSupabase(id, status);
            if (updated) return updated;
            console.warn(`[quotations] Supabase status update not applied (not found?) for id="${id}", falling back to Neon (if configured).`);
        } catch (e) {
            // Fall through to Neon fallback
            console.warn(`[quotations] Supabase status update failed for id="${id}", falling back to Neon.`, e);
        }
    }

    return neonFallbackUpdateQuotationStatusById(id, status);
}

