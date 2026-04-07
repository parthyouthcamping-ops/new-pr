
import { v4 as uuidv4 } from 'uuid';

async function createShimlaManaliPackage() {
    const quotation = {
        id: uuidv4(),
        clientName: "Shruti Kansagara",
        destination: "Shimla, Manali, Kullu & Kasol",
        status: "Published",
        pax: 4,
        duration: "7 Days • 6 Nights",
        travelDates: { from: "2026-05-10", to: "2026-05-16" },
        transportOption: "Private Sedan / SUV for Entire Journey (Chandigarh to Chandigarh)",
        roomSharing: "Double Sharing",
        lowLevelPrice: 19500,
        highLevelPrice: 19500,
        heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1974&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=2070&auto=format&fit=crop",
        experiencePhotos: [
            "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1623492701902-47dc207df5dc?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1617653202545-931490e8d7e7?q=80&w=2070&auto=format&fit=crop"
        ],
        lowLevelHotels: [
            {
                id: uuidv4(),
                name: "Snow Valley Resorts (Semi-Deluxe)",
                location: "Shimla & Manali",
                rating: 3,
                description: "Experience Himalayan hospitality with clean, comfortable rooms and stunning views of the snow-capped peaks.",
                roomType: "Standard Room",
                photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        highLevelHotels: [],
        itinerary: [
            {
                id: uuidv4(),
                day: 1,
                title: "Arrival in Chandigarh → Shimla 🏔️",
                description: "Reach Chandigarh & meet our representative. Transfer to Shimla (4–5 hrs). Evening visit Mall Road, The Ridge, and Christ Church.",
                activities: ["Airport/Railway Station Pickup", "Scenic Drive to Shimla", "Mall Road Walk", "Christ Church Visit"],
                meals: "Dinner",
                stay: "Shimla",
                photos: ["https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 2,
                title: "Shimla → Kufri → Manali 🏔️",
                description: "Visit Kufri for snow activities and viewpoints. Later, drive to Manali (7–8 hrs) enjoying scenic mountain views.",
                activities: ["Kufri Sightseeing", "Snow Activities", "Long Drive to Manali", "Beas River Views"],
                meals: "Breakfast, Dinner",
                stay: "Manali",
                photos: ["https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 3,
                title: "Manali Local Sightseeing 🏞️",
                description: "Excursion to Hadimba Devi Temple, Vashisht Temple & Hot Springs. Afternoon explore Old Manali Cafes and Mall Road shopping.",
                activities: ["Hadimba Temple", "Vashisht Hot Springs", "Old Manali Cafe Crawl", "Mall Road Shopping"],
                meals: "Breakfast, Pack Lunch, Dinner",
                stay: "Manali",
                photos: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 4,
                title: "Solang Valley / Atal Tunnel → Kullu 🚇",
                description: "Adventure day at Solang Valley or visit the historic Atal Tunnel. Explore Sissu Village (if accessible) and then drive to Kullu.",
                activities: ["Solang Valley Adventure", "Atal Tunnel Crossing", "Sissu Village Visit", "Drive to Kullu"],
                meals: "Breakfast, Pack Lunch, Dinner",
                stay: "Kullu",
                photos: ["https://images.unsplash.com/photo-1623492701902-47dc207df5dc?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 5,
                title: "Kullu Adventure Day 🌊",
                description: "Full day dedicated to thrill-seekers! Experience high-energy River Rafting and various mountain adventure activities.",
                activities: ["White Water Rafting", "Paragliding (Optional)", "River Crossing", "Local Exploration"],
                meals: "Breakfast, Pack Lunch, Dinner",
                stay: "Kullu",
                photos: ["https://images.unsplash.com/photo-1533227268408-a7751e04838b?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 6,
                title: "Kullu → Kasol | Bijli Mahadev Trek 🥾",
                description: "Drive to Chansari Village. Trek to the divine Bijli Mahadev Temple (3–4 km). Enjoy 360-degree views of Parvati & Kullu Valleys. Drive to Kasol.",
                activities: ["Bijli Mahadev Trek", "Religious Visit", "Panoramic Views", "Evening in Kasol"],
                meals: "Breakfast, Pack Lunch, Dinner",
                stay: "Kasol",
                photos: ["https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 7,
                title: "Kasol → Chandigarh 🚐",
                description: "Morning at leisure by the Parvati River or explore Kasol Market. Drive back to Chandigarh (8–9 hrs) for departure.",
                activities: ["Parvati River Side Relaxing", "Kasol Market Shopping", "Long Drive Back", "Departure"],
                meals: "Breakfast, Lunch",
                stay: "Departure",
                photos: ["https://images.unsplash.com/photo-1617653202545-931490e8d7e7?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        includes: [
            "6 Nights Accommodation (Double Sharing)",
            "Breakfast & Dinner at Hotels",
            "Pack Lunch on selected days (Day 3, 4, 5, 6)",
            "Private Vehicle for Entire Journey (Chandigarh to Chandigarh)",
            "Driver Allowances, Tolls, Fuel, and Parking",
            "All Sightseeing as per Itinerary",
            "Bijli Mahadev Trek Assistance",
            "Assistance on Arrival & Departure"
        ],
        exclusions: [
            "Train Tickets / Airfare (Mumbai to Chandigarh & Return)",
            "Adventure Activities (Rafting, Paragliding, etc.)",
            "Entry Fees to Monuments & Parks",
            "Personal Expenses & Tips",
            "Anything not mentioned in Inclusions"
        ],
        expert: {
            name: "Parth Sharma",
            whatsapp: "919999999999",
            designation: "Luxury Travel Designer"
        },
        cancellationPolicy: "Booking cancellation according to terms and conditions",
        paymentPolicy: "50% Advance to confirm, balance 7 days before travel.",
        bookingAmount: "₹3,000 / Person"
    };

    console.log('--- Creating Shimla-Manali-Kullu-Kasol Package for Shruti Kansagara ---');
    try {
        const response = await fetch('http://localhost:3000/api/quotation/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...quotation,
                trip_name: "Himachal Luxury: 4 Pax Special",
                price: 19500
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log('\n✅ PROPOSAL CREATED SUCCESSFULLY');
            console.log(`🔗 PREVIEW LINK: ${data.fullLink}`);
            console.log(`🆔 ID: ${data.id}\n`);
        } else {
            console.error('❌ Error creating package:', data.error, data.details);
        }
    } catch (err) {
        console.error('❌ Network Error (Is the server running?):', err);
    }
    process.exit(0);
}

createShimlaManaliPackage();
