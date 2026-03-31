
const { supabase } = require('./lib/supabase');
const { neon } = require('@neondatabase/serverless');

async function check() {
    console.log('--- SUPABASE ---');
    const { data: sData, error: sErr } = await supabase.from('quotations').select('id, slug, trip_name');
    if (sErr) console.error('Supabase Error:', sErr.message);
    else console.log('Supabase Slugs:', sData.map(r => r.slug));

    console.log('\n--- NEON ---');
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
        const sql = neon(dbUrl);
        try {
            const rows = await sql`SELECT id, slug, trip_name FROM quotations`;
            console.log('Neon Slugs:', rows.map(r => r.slug));
        } catch (e) {
            console.error('Neon Error:', e.message);
        }
    }
}

check();
