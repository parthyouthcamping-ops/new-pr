
import { v4 as uuidv4 } from 'uuid';

async function createKashmirPackage() {
    const quotation = {
        id: uuidv4(),
        clientName: "Special Group",
        destination: "Kashmir from Ahmedabad: Udhampur, Srinagar, Gulmarg, Sonmarg, Pahalgam & Jammu",
        status: "Published",
        pax: 2,
        duration: "11 Days • 10 Nights",
        travelDates: { from: "2026-05-15", to: "2026-05-25" },
        transportOption: "Private Tempo Traveller / Cab for Entire Journey (Jammu to Jammu)",
        roomSharing: "Double Sharing (Extra: +₹3,000)",
        lowLevelPrice: 28999,
        highLevelPrice: 31999,
        heroImage: "https://images.unsplash.com/photo-1566833984570-8e1f57997991?q=80&w=2070&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1598324789736-4861f89564a0?q=80&w=1974&auto=format&fit=crop",
        experiencePhotos: [
            "https://images.unsplash.com/photo-1590483734712-426b3846682c?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1623492701902-47dc207df5dc?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=2070&auto=format&fit=crop"
        ],
        lowLevelHotels: [
            {
                id: uuidv4(),
                name: "Hotel Grand Sharnam / Similar",
                location: "Srinagar (3 Nights)",
                rating: 3,
                description: "A cozy deluxe hotel located near the city center, offering comfortable rooms and warm Kashmiri hospitality.",
                roomType: "Deluxe Room",
                photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                name: "Deluxe Houseboat",
                location: "Dal Lake (1 Night)",
                rating: 3,
                description: "Experience the magic of Dal Lake in a traditional wooden houseboat with intricate carvings and lake views.",
                roomType: "Deluxe Bedroom",
                photos: ["https://images.unsplash.com/photo-1598324789736-4861f89564a0?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                name: "Hotel Pine Spring / Similar",
                location: "Pahalgam (1 Night)",
                rating: 3,
                description: "Situated amidst the pine forests, this hotel provides a serene atmosphere and easy access to Pahalgam's scenic spots.",
                roomType: "Standard Room",
                photos: ["https://images.unsplash.com/photo-1590483734712-426b3846682c?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                name: "Hotel Novelty / Similar",
                location: "Jammu (2 Nights)",
                rating: 3,
                description: "A well-maintained hotel in Jammu city, convenient for railway station access and local temple visits.",
                roomType: "Deluxe Room",
                photos: ["https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        highLevelHotels: [
            {
                id: uuidv4(),
                name: "The Lalit Grand Palace / Vivanta Dal View",
                location: "Srinagar (3 Nights)",
                rating: 5,
                description: "Luxury reimagined in the heritage palace of the Maharajas, overlooking the Zabarwan mountains and Dal Lake.",
                roomType: "Premium Room",
                photos: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                name: "Luxury Super Deluxe Houseboat",
                location: "Nigeen Lake (1 Night)",
                rating: 5,
                description: "An ultra-luxury houseboat experience in the quieter Nigeen Lake, featuring premium wood interiors and gourmet dining.",
                roomType: "Suite Room",
                photos: ["https://images.unsplash.com/photo-1598324789736-4861f89564a0?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                name: "Pahalgam Hotel / WelcomHotel Pine n Peak",
                location: "Pahalgam (1 Night)",
                rating: 5,
                description: "Kashmir's most iconic luxury resort offering breathtaking views of the Lidder River and snow-capped peaks.",
                roomType: "Superior Room",
                photos: ["https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                name: "Radisson Blu / Fortune Riviera",
                location: "Jammu (2 Nights)",
                rating: 5,
                description: "The peak of comfort in Jammu, featuring modern amenities, rooftop pools, and premium multi-cuisine dining.",
                roomType: "City View Suite",
                photos: ["https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        itinerary: [
            {
                id: uuidv4(),
                day: 1,
                title: "Ahmedabad to Jammu 🚂",
                description: "Departure from Ahmedabad by train (3AC). Enjoy an overnight journey through the plains of India as we head towards the crown of the country.",
                activities: ["Train Journey", "Overnight Travel"],
                meals: "On Board (Self-funded)",
                stay: "Train",
                photos: ["https://images.unsplash.com/photo-1502476610731-01eb20c028cc?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 2,
                title: "Arrival in Jammu → Drive to Srinagar 🏔️",
                description: "Upon arrival in Jammu, meet our representative and drive to Srinagar via the scenic Ramban & Banihal route. Check-in at your hotel and relax.",
                activities: ["Pickup from Jammu Station", "Scenic Mountain Drive", "Kashmir Valley Entry", "Check-in at Srinagar"],
                meals: "Dinner",
                stay: "Srinagar Hotel",
                photos: ["https://images.unsplash.com/photo-1566833984570-8e1f57997991?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 3,
                title: "Srinagar Local Sightseeing 🌸",
                description: "Explore the beauty of Srinagar. Visit the Shankaracharya Temple for panoramic views. Later, stroll through the Mughal Gardens (Nishat, Shalimar) and visit the Hazratbal Shrine.",
                activities: ["Shankaracharya Temple", "Mughal Gardens Visit", "Hazratbal Shrine", "Local Market Shopping"],
                meals: "Breakfast, Dinner",
                stay: "Srinagar Hotel",
                photos: ["https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 4,
                title: "Gulmarg Day Trip (Meadow of Flowers) 🚠",
                description: "Drive to Gulmarg, the premier winter resort. Take the famous Gondola Ride (Cable Car) to Phase 1 & Phase 2. Enjoy snow and adventure activities.",
                activities: ["Gondola Ride", "Snow Activities", "Golf Course Visit", "Scenic Photography"],
                meals: "Breakfast, Dinner",
                stay: "Srinagar",
                photos: ["https://images.unsplash.com/photo-1590483734712-426b3846682c?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 5,
                title: "Sonmarg Day Trip (Meadow of Gold) ✨",
                description: "Full day excursion to Sonmarg. Visit the Thajiwas Glacier and enjoy the scenic beauty of the Sindh River flowing through the valley.",
                activities: ["Thajiwas Glacier Visit", "Pony Rides", "Snow Point Exploration", "Sindh River Views"],
                meals: "Breakfast, Dinner",
                stay: "Srinagar",
                photos: ["https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 6,
                title: "Doodhpathri & Dal Lake Houseboat Stay ⛵",
                description: "Visit Doodhpathri, also known as 'Valley of Milk'. Later, experience the unique stay in a traditional Kashmiri Houseboat on Dal Lake. Enjoy a Shikara ride at sunset.",
                activities: ["Doodhpathri Meadows Visit", "Houseboat Check-in", "Sunset Shikara Ride", "Dal Lake Experience"],
                meals: "Breakfast, Dinner",
                stay: "Houseboat (Dal Lake)",
                photos: ["https://images.unsplash.com/photo-1598324789736-4861f89564a0?q=80&w=1974&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 7,
                title: "Pahalgam Drive (Valley of Shepherds) 🐏",
                description: "Transfer to Pahalgam. En route, visit the historic Martand Sun Temple and explore the lush Apple Gardens of Kashmir.",
                activities: ["Drive to Pahalgam", "Martand Sun Temple", "Apple Orchard Visit", "Saffron Fields stopover"],
                meals: "Breakfast, Dinner",
                stay: "Pahalgam",
                photos: ["https://images.unsplash.com/photo-1623492701902-47dc207df5dc?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 8,
                title: "Pahalgam Valleys → Drive to Jammu 🌄",
                description: "Morning sightseeing in Pahalgam. Visit Aru Valley, Betaab Valley, and Chandanwari by Union cab. Later in the evening, drive to Jammu.",
                activities: ["Aru Valley", "Betaab Valley", "Chandanwari", "Evening Drive to Jammu"],
                meals: "Breakfast, Dinner",
                stay: "Jammu Hotel",
                photos: ["https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 9,
                title: "Jammu Sightseeing & Leisure 🕍",
                description: "Spend your day exploring the 'City of Temples'. Visit the famous Raghunath Temple and explore the local markets of Jammu for shopping and relaxation.",
                activities: ["Raghunath Temple Visit", "Local Market Shopping", "City Exploration", "Relaxation"],
                meals: "Breakfast",
                stay: "Jammu Hotel",
                photos: ["https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 10,
                title: "Jammu → Train to Ahmedabad 🚆",
                description: "Transfer to Jammu Railway Station for your return journey via Firozpur train to Ahmedabad.",
                activities: ["Railway Station Drop", "Train Departure", "Overnight Journey"],
                meals: "Breakfast",
                stay: "Train",
                photos: ["https://images.unsplash.com/photo-1502476610731-01eb20c028cc?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: uuidv4(),
                day: 11,
                title: "Arrival in Ahmedabad 📍",
                description: "Reach Ahmedabad with beautiful memories of your Journey to the Crown of India.",
                activities: ["Arrival at Ahmedabad", "Trip Conclusion"],
                meals: "None",
                stay: "Home",
                photos: []
            }
        ],
        includes: [
            "Train Tickets (Ahmedabad/Delhi) - 3AC",
            "10 Nights Accommodation (Hotel + Houseboat)",
            "Daily Breakfast & Dinner",
            "Private Tempo Traveller / Cab for all transfers & sightseeing",
            "Shikara Ride on Dal Lake",
            "All State Permits & Parking Charges",
            "Trip Leader (on group basis)"
        ],
        exclusions: [
            "GST (5%) Extra",
            "Entry Fees to Monuments & Mughal Gardens",
            "Adventure Activities Cost (Gondola, Skiing, etc.)",
            "Union Cab Charges in Kashmir (Pahalgam etc.)",
            "Personal Expenses & Tips",
            "Anything not mentioned in Inclusions"
        ],
        expert: {
            name: "Parth Sharma",
            whatsapp: "919999999999", // Placeholder, usually fetched from env or DB
            designation: "Kashmir Travel Expert"
        },
        cancellationPolicy: "Full payment before 15 days. Advance ₹5,000 non-refundable upon confirmation.",
        paymentPolicy: "₹5,000 advance to confirm seat, balance before 15 days of travel.",
        bookingAmount: "₹5,000 / Person"
    };

    console.log('--- Creating Kashmir from Ahmedabad Package ---');
    try {
        const response = await fetch('http://localhost:3000/api/quotation/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...quotation,
                trip_name: "Kashmir Paradise: Ahmedabad Special",
                price: 28999
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log('\n✅ KASHMIR PACKAGE CREATED SUCCESSFULLY');
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

createKashmirPackage();
