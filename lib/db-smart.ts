
import { supabase } from './supabase';
import { neon } from '@neondatabase/serverless';
import { PREDEFINED_QUOTES } from './itineraries';

const hasSupabase = () => 
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && 
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const hasNeon = () => Boolean(process.env.DATABASE_URL);

const getNeonSql = () => {
    if (!hasNeon()) return null;
    return neon(process.env.DATABASE_URL!);
};

/**
 * SMART GET: Tries Supabase first, falls back to Neon.
 */
export async function getQuotationSmart(idOrSlug: string) {
    console.log(`[db-smart] Searching for quotation: "${idOrSlug}"`);
    
    if (hasSupabase()) {
        try {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
            const query = supabase.from('quotations').select('*');
            
            let result;
            if (isUUID) {
                result = await query.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`).maybeSingle();
            } else {
                result = await query.eq('slug', idOrSlug).maybeSingle();
            }

            const { data, error } = result;
            if (data && !error) {
                console.log(`[db-smart] Found in Supabase: "${idOrSlug}"`);
                return mergeItinerary(data);
            }
            if (error) console.error('[db-smart] Supabase query error:', error.message);
        } catch (e: any) {
            console.warn(`[db-smart] Supabase fetch failed: ${e.message}`);
        }
    }

    const sql = getNeonSql();
    if (sql) {
        try {
            console.log(`[db-smart] Retrying with Neon for: "${idOrSlug}"`);
            const rows = await sql`SELECT * FROM quotations WHERE id::text = ${idOrSlug} OR slug = ${idOrSlug} LIMIT 1`;
            if (rows.length > 0) {
                console.log(`[db-smart] Found in Neon: "${idOrSlug}"`);
                return mergeItinerary(rows[0]);
            }
        } catch (e: any) {
            console.warn(`[db-smart] Neon fetch failed: ${e.message}`);
        }
    }

    console.log(`[db-smart] Quotation not found in remote DBs: "${idOrSlug}". Checking predefined fallback...`);
    if (PREDEFINED_QUOTES[idOrSlug]) {
        console.log(`[db-smart] Found in PREDEFINED_QUOTES: "${idOrSlug}"`);
        return PREDEFINED_QUOTES[idOrSlug];
    }

    return null;
}

/**
 * SMART GET ALL: Tries Supabase, falls back to Neon or merges? 
 * For now, mostly Supabase as it's the primary.
 */
export async function getAllQuotationsSmart() {
    let all: any[] = [];
    
    // 1. Get Predefined (Static)
    const predefined = Object.values(PREDEFINED_QUOTES).map(q => ({
        ...q,
        trip_name: q.destination,
        price: q.highLevelPrice,
        created_at: q.createdAt
    }));
    all = [...predefined];

    // 2. Get from Supabase
    if (hasSupabase()) {
        try {
            const { data, error } = await supabase
                .from('quotations')
                .select('id, slug, itinerary, created_at, trip_name, price')
                .order('created_at', { ascending: false });
            if (!error && data) {
                const fetched = data.map(mergeItinerary);
                const predefinedSlugs = new Set(all.map(p => p.slug));
                fetched.forEach(f => {
                    if (f && !predefinedSlugs.has(f.slug)) all.push(f);
                });
            }
        } catch (e) {
            console.warn(`[db-smart] Supabase getAll failed`);
        }
    } else {
        const sql = getNeonSql();
        if (sql) {
            try {
                const rows = await sql`SELECT id, slug, itinerary, created_at, trip_name, price FROM quotations ORDER BY created_at DESC`;
                const fetched = rows.map(mergeItinerary);
                const predefinedSlugs = new Set(all.map(p => p.slug));
                fetched.forEach(f => {
                    if (f && !predefinedSlugs.has(f.slug)) all.push(f);
                });
            } catch (e) {
                console.warn(`[db-smart] Neon getAll failed`);
            }
        }
    }

    return all;
}

/**
 * SMART SAVE QUOTATION: Saves to Supabase primarily.
 */
export async function saveQuotationSmart(id: string, slug: string, data: any) {
    let success = false;
    const cleanData = sanitizePayload(data);
    const tripName = cleanData?.destination || 'New Trip';
    const price = cleanData?.highLevelPrice || 0;
    const createdAt = cleanData?.createdAt || new Date().toISOString();

    if (hasSupabase()) {
        try {
            const { error } = await supabase.from('quotations').upsert({
                id,
                slug,
                itinerary: cleanData,
                trip_name: tripName,
                price: price,
                created_at: createdAt
            });
            if (!error) success = true;
            else if (error.code === '23505') throw new Error(`Slug '${slug}' already exists`);
        } catch (e: any) {
            if (e.message.includes('already exists')) throw e;
            console.error(`[db-smart] Supabase save error:`, e.message);
        }
    }

    const sql = getNeonSql();
    if (sql && !success) { // Fallback to Neon if Supabase failed (except for duplicate slug)
        try {
            await sql`
                INSERT INTO quotations (id, slug, itinerary, trip_name, price, created_at)
                VALUES (${id}, ${slug}, ${cleanData}, ${tripName}, ${price}, ${createdAt})
                ON CONFLICT (id) DO UPDATE SET 
                    slug = EXCLUDED.slug, 
                    itinerary = EXCLUDED.itinerary, 
                    trip_name = EXCLUDED.trip_name, 
                    price = EXCLUDED.price
            `;
            success = true;
        } catch (e) {
            console.error(`[db-smart] Neon save error:`, e);
        }
    }

    return { success };
}

/**
 * SMART DELETE
 */
export async function deleteQuotationSmart(id: string) {
    if (hasSupabase()) {
        await supabase.from('quotations').delete().eq('id', id);
    }
    const sql = getNeonSql();
    if (sql) {
        await sql`DELETE FROM quotations WHERE id::text = ${id}`;
    }
    return { success: true };
}

/**
 * SMART GET BRANDING
 */
export async function getBrandSettingsSmart() {
    if (hasSupabase()) {
        try {
            const { data, error } = await supabase.from('brand_settings').select('data').eq('id', 'global_brand').maybeSingle();
            if (data && !error) return data.data;
        } catch (e) {}
    }

    const sql = getNeonSql();
    if (sql) {
        const rows = await sql`SELECT data FROM brand_settings WHERE id = 'global_brand' LIMIT 1`;
        if (rows.length > 0) return rows[0].data;
    }
    return null;
}

/**
 * SMART SAVE BRANDING
 */
export async function saveBrandSettingsSmart(settings: any) {
    if (hasSupabase()) {
        try {
            await supabase.from('brand_settings').upsert({
                id: 'global_brand',
                data: settings,
                updated_at: new Date().toISOString()
            });
        } catch (e) {}
    }

    const sql = getNeonSql();
    if (sql) {
        await sql`
            INSERT INTO brand_settings (id, data, updated_at)
            VALUES ('global_brand', ${settings}, NOW())
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
        `;
    }
    return { success: true };
}

function mergeItinerary(record: any) {
    if (!record) return null;
    let itinerary = {};
    try {
        itinerary = typeof record.itinerary === 'string' 
            ? JSON.parse(record.itinerary) 
            : (record.itinerary || {});
    } catch (e) {
        console.error('[db-smart] Failed to parse itinerary for', record.id);
    }
    
    return {
        ...(typeof itinerary === 'object' ? itinerary : {}),
        id: record.id,
        slug: record.slug,
        createdAt: record.created_at || record.createdAt,
    };
}

function sanitizePayload(data: any): any {
    if (!data || typeof data !== 'object') return data;
    return JSON.parse(JSON.stringify(data, (_key, value) => {
        if (value instanceof File || value instanceof Blob) return undefined;
        return value;
    }));
}
