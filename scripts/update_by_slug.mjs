
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function updateBookingAmount() {
    const slug = 'himachal-luxury-4-pax-special-qdlc0n';
    console.log(`Searching for record with slug: ${slug}`);
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        
        // 1. Fetch current data
        const { data, error: fetchError } = await supabase
            .from('quotations')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

        if (fetchError) {
            console.error('Supabase fetch error:', fetchError.message);
            return;
        }

        if (!data) {
            console.error(`No record found for slug: ${slug}`);
            return;
        }

        console.log('Record found. Full Data:', JSON.stringify(data, null, 2));
        console.log('Record found. Current bookingAmount:', data.bookingAmount);

        // 2. Update bookingAmount
        const { error: updateError } = await supabase
            .from('quotations')
            .update({ bookingAmount: "₹3,000 / Person" })
            .eq('slug', slug);

        if (updateError) {
            console.error('Supabase update error:', updateError.message);
        } else {
            console.log(`✅ Successfully updated bookingAmount to ₹3,000 / Person for slug: ${slug}`);
        }
    } else {
        console.error('Missing Supabase environment variables.');
    }
}

updateBookingAmount();
