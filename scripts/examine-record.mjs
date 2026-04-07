
import pkgSupabase from '@supabase/supabase-js';
const { createClient } = pkgSupabase;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function examine() {
    const id = '164e3c60-7b03-4bc9-bb6f-a7186fbd9651';
    console.log(`Examining record ID: ${id}`);
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        const { data, error } = await supabase.from('quotations').select('id, slug, trip_name').eq('id', id).maybeSingle();
        if (error) console.error('Supabase error:', error.message);
        else console.log('Supabase Data:', data);
    }
}

examine();
