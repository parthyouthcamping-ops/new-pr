
import { PREDEFINED_QUOTES } from '../lib/itineraries.js';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    console.log('--- Seeding Predefined Quotations to Database ---');
    const items = Object.values(PREDEFINED_QUOTES);
    
    for (const q of items) {
        console.log(`Seeding: ${q.destination} (${q.slug})`);
        try {
            const response = await fetch('http://localhost:3000/api/quotation/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trip_name: q.destination,
                    price: q.highLevelPrice,
                    clientName: q.clientName,
                    destination: q.destination,
                    itinerary: q
                })
            });
            const data = await response.json();
            if (data.success) {
                console.log(`✅ Seeded ${q.slug}`);
            } else {
                console.error(`❌ Failed ${q.slug}:`, data.error);
            }
        } catch (err) {
            console.error(`❌ Error seeding ${q.slug}:`, err.message);
        }
    }
    console.log('--- Seed Finished ---');
}

seed();
