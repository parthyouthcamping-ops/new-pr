
const { createClient } = require('@supabase/supabase-js');
const { neon } = require('@neondatabase/serverless');

const SUPABASE_URL = "https://wjpqrojginoeeluymavx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcHFyb2pnaW5vZWVsdXltYXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTAzMDIsImV4cCI6MjA5MDQyNjMwMn0.N1WJ12XLIATh_CFKHboGjx18AV9ZPyJjnBQHUQWvXQk";
const DATABASE_URL = "postgresql://neondb_owner:npg_7yvbHuEnq8DA@ep-purple-bread-ahahzaxh-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function check() {
    console.log('--- SUPABASE ---');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data: sData, error: sErr } = await supabase.from('quotations').select('slug');
    if (sErr) console.error('Supabase Error:', sErr.message);
    else console.log('Supabase Slugs:', sData.map(r => r.slug));

    console.log('\n--- NEON ---');
    const sql = neon(DATABASE_URL);
    try {
        const rows = await sql`SELECT slug FROM quotations`;
        console.log('Neon Slugs:', rows.map(r => r.slug));
    } catch (e) {
        console.error('Neon Error:', e.message);
    }
}

check();
