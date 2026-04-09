
import { v4 as uuidv4 } from 'uuid';

async function createDetailedKeralaTamilNaduPackage() {
    const keralaQuotation = {
        id: uuidv4(),
        clientName: "Parth Youth Camping Group",
        destination: "Kerala & Tamil Nadu",
        status: "Published",
        pax: 12,
        duration: "7 Days • 6 Nights",
        travelDates: { from: "2026-06-15", to: "2026-06-21" },
        transportOption: "Private AC Tempo Traveller (12/17 Seater)",
        roomSharing: "Triple / Double",
        lowLevelPrice: 18499,
        highLevelPrice: 22999,
        heroImage: "https://images.unsplash.com/photo-1593693397690-31f675211a0b?q=80&w=2070&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1593693411515-c202e984293f?q=80&w=2070&auto=format&fit=crop",
        experiencePhotos: [
            "https://images.unsplash.com/photo-1593693397690-31f675211a0b",
            "https://images.unsplash.com/photo-1593693411515-c202e984293f",
            "https://images.unsplash.com/photo-1626245648825-99882956f4d5",
            "https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8",
            "https://images.unsplash.com/photo-1582510003544-4d00b7f74220"
        ],
        lowLevelHotels: [
            {
                id: uuidv4(),
                name: "Deluxe Heritage Stays (3★)",
                location: "Munnar, Thekkady, Kanyakumari, Rameshwaram",
                rating: 3,
                description: "Standard 3-star AC rooms with modern amenities and great hospitality.",
                roomType: "Standard AC Room",
                photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945"]
            }
        ],
        highLevelHotels: [
             {
                id: uuidv4(),
                name: "Premium Resort Collection (4★)",
                location: "Munnar, Thekkady, Kanyakumari, Rameshwaram",
                rating: 4,
                description: "Luxury 4-star properties with scenic views, swimming pools and multi-cuisine restaurants.",
                roomType: "Deluxe Pool View Room",
                photos: ["https://images.unsplash.com/photo-1582719478250-c89cae4df85b"]
            }
        ],
        itinerary: [
            {
                id: uuidv4(),
                day: 1,
                title: "Cochin Arrival → Munnar",
                description: "Pickup from Cochin Airport / Railway Station. Drive to Munnar, the world-famous hill station. Enroute visit beautiful waterfalls & vast tea plantations that paint the landscape green.",
                activities: ["Airport/Railway Pickup", "Drive to Munnar", "Waterfalls Visit", "Tea Garden Enroute"],
                meals: "Dinner",
                stay: "Munnar",
                photos: ["https://images.unsplash.com/photo-1593693397690-31f675211a0b"]
            },
            {
                id: uuidv4(),
                day: 2,
                title: "Munnar Sightseeing",
                description: "Full day sightseeing in Munnar. Visit Echo Point, Mattupetty Dam, the informative Tea Museum, and several scenic viewpoints. Evening free for local markets.",
                activities: ["Echo Point", "Mattupetty Dam", "Tea Museum", "Scenic Viewpoints", "Local Market"],
                meals: "Breakfast & Dinner",
                stay: "Munnar",
                photos: ["https://images.unsplash.com/photo-1516684732162-798a0062be99"]
            },
            {
                id: uuidv4(),
                day: 3,
                title: "Munnar → Thekkady",
                description: "Travel to Thekkady. Take a guided Spice Plantation Tour to learn about Kerala's rich spices. Later, enjoy a serene Periyar Lake Boat Cruise (optional).",
                activities: ["Drive to Thekkady", "Spice Plantation Tour", "Periyar Boat Cruise (Optional)"],
                meals: "Breakfast & Dinner",
                stay: "Thekkady",
                photos: ["https://images.unsplash.com/photo-1626245648825-99882956f4d5"]
            },
            {
                id: uuidv4(),
                day: 4,
                title: "Thekkady → Alleppey Houseboat",
                description: "Drive to Alleppey. Check into a traditional Kerala Houseboat for a magical cruise through the backwaters. Experience rustic village life and enjoy traditional meals served onboard.",
                activities: ["Houseboat Check-in", "Backwater Cruise", "Village Life View", "Sunset on Boat"],
                meals: "Breakfast, Lunch & Dinner",
                stay: "Traditional Houseboat",
                photos: ["https://images.unsplash.com/photo-1593693411515-c202e984293f"]
            },
            {
                id: uuidv4(),
                day: 5,
                title: "Alleppey → Kanyakumari Extension",
                description: "Drive to the southern tip of India, Kanyakumari. Visit the Vivekananda Rock Memorial and Triveni Sangam where three seas meet. Experience the mesmerizing sunset.",
                activities: ["Vivekananda Rock Memorial", "Triveni Sangam", "Sunset Views", "Temple Visit"],
                meals: "Breakfast & Dinner",
                stay: "Kanyakumari",
                photos: ["https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8"]
            },
            {
                id: uuidv4(),
                day: 6,
                title: "Kanyakumari → Rameshwaram Extension",
                description: "Travel to the holy island of Rameshwaram. Cross the engineering marvel Pamban Bridge. Visit Ramanathaswamy Temple, Agni Theertham, and the mystical Dhanushkodi.",
                activities: ["Ramanathaswamy Temple", "Pamban Bridge Visit", "Agni Theertham", "Dhanushkodi Exploration"],
                meals: "Breakfast & Dinner",
                stay: "Rameshwaram",
                photos: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220"]
            },
            {
                id: uuidv4(),
                day: 7,
                title: "Rameshwaram → Trivandrum Departure",
                description: "Drive to Trivandrum after a soul-stirring journey. Drop at the Airport or Railway Station for your journey home, carrying memories of Kerala & Tamil Nadu.",
                activities: ["Breakfast", "Drive to Trivandrum", "Airport/Railway Drop"],
                meals: "Breakfast",
                stay: "Departure",
                photos: ["https://images.unsplash.com/photo-1520113410140-54e6015d5ec3"]
            }
        ],
        includes: [
            "Accommodation for 6 Nights / 7 Days in well-rated hotels",
            "1 Night stay in traditional houseboat at Alleppey",
            "Daily Breakfast at hotels",
            "All meals (Lunch + Dinner + Breakfast) during houseboat stay",
            "Private vehicle for entire tour (pickup to drop)",
            "All sightseeing as per itinerary",
            "Driver allowance, toll taxes, parking & fuel charges",
            "Pickup from Cochin & drop at Trivandrum",
            "Assistance on arrival & departure"
        ],
        exclusions: [
            "Flights / Train tickets",
            "Early check-in & late check-out (subject to availability)",
            "Entry tickets to monuments & attractions",
            "Activities like: Boat safari, Elephant rides, Kathakali show, etc.",
            "Personal expenses (shopping, tips, laundry, etc.)",
            "Meals not mentioned in inclusions",
            "Travel insurance",
            "Any cost arising due to natural calamities, roadblocks, or strikes",
            "Temple special darshan / VIP entry charges"
        ],
        expert: {
            name: "Parth Sharma",
            whatsapp: "919999999999",
            designation: "Tour Architect"
        },
        cancellationPolicy: "Standard policy: 30 days before - 80% refund; 15 days - 50% refund; <7 days - No refund.",
        paymentPolicy: "50% Advance to confirm booking.",
        bookingAmount: "₹5,000 / Person"
    };

    console.log('--- Creating Detailed Kerala & Tamil Nadu Package ---');
    try {
        const response = await fetch('http://localhost:3000/api/quotation/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...keralaQuotation,
                trip_name: "🌴 KERALA & TAMIL NADU - HOLY & SCENIC TOUR (7 DAYS) 🌴",
                price: 18499
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log('✅ Success! Created Detailed Proposal:', data.id);
            console.log('🔗 Link:', data.fullLink);
        } else {
            console.error('❌ Error creating package:', data.error, data.details);
        }
    } catch (err) {
        console.error('❌ Network Error creating package:', err);
    }
}

createDetailedKeralaTamilNaduPackage();
