
import { v4 as uuidv4 } from 'uuid';

async function createGoaPackage() {
    // This object follows the Quotation type from lib/types.ts
    const goaQuotation = {
        id: uuidv4(),
        clientName: "Parth Youth Camping Group",
        destination: "Goa, India",
        status: "Published",
        pax: 12,
        duration: "5 Days • 4 Nights",
        travelDates: { from: "2026-05-10", to: "2026-05-14" },
        transportOption: "Private 12 Seater Tempo Traveller for Sightseeing",
        roomSharing: "Triple",
        lowLevelPrice: 12999,
        highLevelPrice: 12999,
        heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2070&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2070&auto=format&fit=crop",
        experiencePhotos: [
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop"
        ],
        lowLevelHotels: [
            {
                id: uuidv4(),
                name: "Camelot Fantasy Resort (3★)",
                location: "Calangute Level",
                rating: 3,
                description: "A premium 3-star property with an outdoor pool, deluxe rooms, and warm Goan hospitality. Perfect for group stays.",
                roomType: "Deluxe Pool View Room",
                photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        highLevelHotels: [
             {
                id: uuidv4(),
                name: "Camelot Fantasy Resort (Premium Wing)",
                location: "Calangute",
                rating: 4,
                description: "Upgraded luxury stay at Camelot with enhanced amenities and premium room services.",
                roomType: "Luxury Suite",
                photos: ["https://images.unsplash.com/photo-1582719478250-c89cae4df85b?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        itinerary: [
            {
                id: uuidv4(),
                day: 1,
                title: "Arrival + Water Sports",
                description: "Arrival at Goa Airport. Meet our representative and transfer to Camelot Fantasy Resort. Evening free for optional water sports at Baga/Calangute beach.",
                activities: ["Airport Pickup", "Hotel Check-in", "Welcome Drink", "Beach Explorations"],
                meals: "Dinner",
                stay: "Camelot Fantasy Resort",
                photos: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 2,
                title: "North Goa Sightseeing",
                description: "Full day tour of North Goa visiting Aguada Fort, Sinquerim, Calangute, Baga, Anjuna, and Vagator beaches. Conclude at Chapora Fort.",
                activities: ["Aguada Fort", "Sinquerim Beach", "Calangute & Baga", "Anjuna & Vagator", "Chapora Fort"],
                meals: "Breakfast & Dinner",
                stay: "Camelot Fantasy Resort",
                photos: ["https://images.unsplash.com/photo-1590050754845-2f20dc0124cc?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 3,
                title: "Dudhsagar Waterfall Trip",
                description: "A majestic journey to Dudhsagar Waterfalls via shared bus and Jeep Safari from Mollem. Optional Spice Plantation visit included.",
                activities: ["Dudhsagar Visit", "Jeep Safari Experience", "Nature Trail", "Spice Plantation"],
                meals: "Breakfast & Dinner",
                stay: "Camelot Fantasy Resort",
                photos: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 4,
                title: "South Goa Cultural Tour",
                description: "Explore the heritage of South Goa with visits to Mangeshi Temple, Old Goa Churches, Dona Paula, and Miramar Beach. Panjim Market & River Cruise evening.",
                activities: ["Mangeshi Temple", "Basilica of Bom Jesus", "Dona Paula", "River Cruise (Optional)"],
                meals: "Breakfast & Dinner",
                stay: "Camelot Fantasy Resort",
                photos: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 5,
                title: "Farewell & Departure",
                description: "Enjoy your breakfast and some last-minute shopping. Check-out and transfer to the airport for your journey home.",
                activities: ["Breakfast", "Check-out", "Airport Drop"],
                meals: "Breakfast",
                stay: "Departure",
                photos: ["https://images.unsplash.com/photo-1520113410140-54e6015d5ec3?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        includes: [
            "4 Nights Luxury Stay at Camelot Fantasy Resort",
            "Breakfast & Dinner at Hotel",
            "Private 12 Seater Tempo Traveller for Local Sightseeing",
            "Airport Pickup & Drop",
            "Full North Goa Sightseeing",
            "Full South Goa Sightseeing",
            "Dudhsagar Trip (SIC Basis)",
            "Welcome Drink on Arrival",
            "Complimentary Pool Access"
        ],
        exclusions: [
            "Airfare / Train Tickets",
            "Dudhsagar Jeep Safari Charges (Mandatory)",
            "Water Sports Charges & Tickets",
            "Mandovi Cruise Entry",
            "Monument Entry Fees",
            "Personal Expenses"
        ],
        expert: {
            name: "Parth Sharma",
            whatsapp: "919999999999",
            designation: "Travel Designer"
        }
    };

    console.log('--- Creating Goa 4N/5D Package with Dudhsagar ---');
    try {
        const response = await fetch('http://localhost:3000/api/quotation/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...goaQuotation, // CORRECTED: Spread the goaQuotation object
                trip_name: "🌴 GOA 4 NIGHTS / 5 DAYS PACKAGE WITH DUDHSAGAR 🌴",
                price: 12999
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log('✅ Success! Created Proposal:', data.id);
            console.log('🔗 Link:', data.fullLink);
        } else {
            console.error('❌ Error creating package:', data.error, data.details);
        }
    } catch (err) {
        console.error('❌ Network Error creating package:', err);
    }
}

createGoaPackage();
