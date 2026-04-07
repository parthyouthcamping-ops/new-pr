
import { createClient } from '@supabase/supabase-js';
import pkg from '@neondatabase/serverless';
const { neon } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listSlugs() {
    console.log('--- Listing Slugs from Database ---');
    
    // Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('Checking Supabase...');
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        const { data, error } = await supabase.from('quotations').select('id, slug, trip_name').order('created_at', { ascending: false });
        if (error) console.error('Supabase error:', error.message);
        else data.forEach(row => console.log(`- ${row.slug} (ID: ${row.id}, Trip: ${row.trip_name})`));
    }

    // Neon
    if (process.env.DATABASE_URL) {
        console.log('Checking Neon...');
        const sql = neon(process.env.DATABASE_URL);
        try {
            const rows = await sql`SELECT id, slug, trip_name FROM quotations ORDER BY created_at DESC`;
            rows.forEach(row => console.log(`- ${row.slug} (ID: ${row.id}, Trip: ${row.trip_name})`));
        } catch (e) {
            console.error('Neon error:', e.message);
        }
    }
}

listSlugs();
