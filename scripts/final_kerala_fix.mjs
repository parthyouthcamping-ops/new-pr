
import pkgSupabase from '@supabase/supabase-js';
const { createClient } = pkgSupabase;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function updateItinerary() {
    const slug = '-kerala-tamil-nadu-6-nights-7-days--a7oahm';
    console.log(`Updating itinerary for slug: ${slug}`);
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Missing Supabase credentials');
        return;
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // 1. Fetch current record to preserve ID and other fields
    const { data: current, error: fetchError } = await supabase
        .from('quotations')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

    if (fetchError || !current) {
        console.error('Record not found or error:', fetchError?.message);
        return;
    }

    const currentItinerary = typeof current.itinerary === 'string' ? JSON.parse(current.itinerary) : current.itinerary;

    const updatedItinerary = {
        ...currentItinerary,
        heroImage: "https://images.unsplash.com/photo-1593693397690-31f675211a0b?auto=format&fit=crop&q=80&w=1200",
        includes: [
            "Assistance on Arrival & Departure",
            "06 Nights Accommodation in specified hotels/houseboat",
            "Daily Breakfast & Dinner at all hotels",
            "Full-board meals (Breakfast, Lunch, Snacks, Dinner) in Alleppey Houseboat",
            "Private AC Sedan/SUV for all transfers & sightseeing as per itinerary",
            "Fuel, Toll, Parking, and Driver Bata/Allowance",
            "Spice Plantation Tour in Thekkady",
            "Daily 01 Bottle of Mineral Water per person",
            "24/7 Travel Assistance throughout the journey"
        ],
        itinerary: currentItinerary.itinerary.map((day, idx) => {
            let photos = day.photos || [];
            if (idx === 0) photos = ["https://images.unsplash.com/photo-1582218776205-062016f1ca87?auto=format&fit=crop&q=80&w=800"]; // Cochin
            if (idx === 1) photos = ["https://images.unsplash.com/photo-1593693397690-31f675211a0b?auto=format&fit=crop&q=80&w=800"]; // Munnar
            if (idx === 2) photos = ["https://images.unsplash.com/photo-1602339752474-f724771dec2a?auto=format&fit=crop&q=80&w=800"]; // Thekkady
            if (idx === 3) photos = ["https://images.unsplash.com/photo-1585618116866-17e942004664?auto=format&fit=crop&q=80&w=800"]; // Alleppey
            if (idx === 4) photos = ["https://images.unsplash.com/photo-1599824639967-df4f0ec38515?auto=format&fit=crop&q=80&w=800"]; // Kanyakumari
            if (idx === 5) photos = ["https://images.unsplash.com/photo-1617377543261-267389f41b9d?auto=format&fit=crop&q=80&w=800"]; // Rameshwaram
            if (idx === 6) photos = ["https://images.unsplash.com/photo-1616110864380-60b540248c82?auto=format&fit=crop&q=80&w=800"]; // Trivandrum
            return { ...day, photos };
        })
    };

    const { error: updateError } = await supabase
        .from('quotations')
        .update({
            itinerary: updatedItinerary,
            updated_at: new Date().toISOString()
        })
        .eq('id', current.id);

    if (updateError) {
        console.error('Update failed:', updateError.message);
    } else {
        console.log('Successfully updated itinerary with images and inclusions!');
    }
}

updateItinerary();
