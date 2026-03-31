
import { supabase } from './supabase';
import { neon } from '@neondatabase/serverless';

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
    // 1. Try Supabase
    if (hasSupabase()) {
        try {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
            const query = supabase.from('quotations').select('*');
            const { data, error } = isUUID 
                ? await query.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`).maybeSingle()
                : await query.eq('slug', idOrSlug).maybeSingle();

            if (data && !error) {
                console.log(`[db-smart] Found quotation in Supabase: ${idOrSlug}`);
                return mergeItinerary(data);
            }
        } catch (e) {
            console.warn(`[db-smart] Supabase fetch failed for ${idOrSlug}:`, e);
        }
    }

    // 2. Try Neon Fallback
    const sql = getNeonSql();
    if (sql) {
        try {
            const rows = await sql`SELECT * FROM quotations WHERE id = ${idOrSlug} OR slug = ${idOrSlug} LIMIT 1`;
            if (rows.length > 0) {
                console.log(`[db-smart] Found quotation in Neon: ${idOrSlug}`);
                return mergeItinerary(rows[0]);
            }
        } catch (e) {
            console.warn(`[db-smart] Neon fetch failed for ${idOrSlug}:`, e);
        }
    }

    return null;
}

/**
 * SMART GET BRANDING: Tries Supabase, falls back to Neon.
 */
export async function getBrandSettingsSmart() {
    if (hasSupabase()) {
        try {
            const { data, error } = await supabase.from('brand_settings').select('data').eq('id', 'global_brand').maybeSingle();
            if (data && !error) return data.data;
        } catch (e) {
             console.warn(`[db-smart] Supabase brand fetch failed, trying Neon...`);
        }
    }

    const sql = getNeonSql();
    if (sql) {
        try {
            const rows = await sql`SELECT data FROM brand_settings WHERE id = 'global_brand' LIMIT 1`;
            if (rows.length > 0) return rows[0].data;
        } catch (e) {
            console.warn(`[db-smart] Neon brand fetch failed:`, e);
        }
    }
    return null;
}

/**
 * SMART SET BRANDING: Saves to BOTH if possible, ensuring consistency.
 */
export async function saveBrandSettingsSmart(settings: any) {
    let success = false;

    if (hasSupabase()) {
        try {
            const { error } = await supabase.from('brand_settings').upsert({
                id: 'global_brand',
                data: settings,
                updated_at: new Date().toISOString()
            });
            if (!error) success = true;
            else console.error(`[db-smart] Supabase brand save error:`, error.message);
        } catch (e) {
            console.error(`[db-smart] Supabase brand save exception:`, e);
        }
    }

    const sql = getNeonSql();
    if (sql) {
        try {
            // Check if table exists in Neon first? Or just try upsert.
            await sql`
                INSERT INTO brand_settings (id, data, updated_at)
                VALUES ('global_brand', ${settings}, NOW())
                ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
            `;
            success = true;
        } catch (e) {
            console.error(`[db-smart] Neon brand save exception:`, e);
        }
    }

    if (!success) throw new Error("Failed to save branding settings to any database.");
    return { success: true };
}

function mergeItinerary(record: any) {
    if (!record) return null;
    const itinerary = typeof record.itinerary === 'string' ? JSON.parse(record.itinerary) : record.itinerary;
    return {
        ...itinerary,
        ...record,
        itinerary: itinerary, // Keep the raw itinerary object if needed
        createdAt: record.created_at || record.createdAt,
        updatedAt: record.updated_at || record.updatedAt,
    };
}
