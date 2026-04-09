
import pkgSupabase from '@supabase/supabase-js';
const { createClient } = pkgSupabase;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
    const slug = '-kerala-tamil-nadu-6-nights-7-days--a7oahm';
    console.log(`Checking record slug: ${slug}`);
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        const { data, error } = await supabase.from('quotations').select('*').eq('slug', slug).maybeSingle();
        if (error) {
            console.error('Supabase error:', error.message);
        } else if (data) {
            console.log('Record found. ITINERARY content structure:');
            const it = typeof data.itinerary === 'string' ? JSON.parse(data.itinerary) : data.itinerary;
            console.log('Object Keys:', Object.keys(it));
            console.log('Includes:', it.includes);
            console.log('Exclusions:', it.exclusions);
            if (it.itinerary && it.itinerary[0]) {
                console.log('Day 1 Photos:', it.itinerary[0].photos);
            }
        } else {
            console.log('Record not found.');
        }
    }
}

check();
