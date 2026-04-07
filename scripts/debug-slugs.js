const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function listAll() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase env vars');
        return;
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('quotations').select('id, slug, trip_name');
    if (error) {
        console.error('Error fetching:', error.message);
        return;
    }
    console.log('--- ALL QUOTATIONS ---');
    data.forEach(q => {
        console.log(`ID: ${q.id} | Slug: "${q.slug}" | Name: ${q.trip_name}`);
    });
}

listAll();
