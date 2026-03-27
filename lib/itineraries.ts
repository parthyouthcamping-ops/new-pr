import { Quotation } from "./types";

export const PREDEFINED_QUOTES: Record<string, Quotation> = {
    "bali-6n7d": {
        id: "bali-static-001",
        slug: "bali-6n7d",
        clientName: "Exclusive Traveler",
        destination: "Bali, Indonesia",
        status: "Published",
        pax: 2,
        duration: "6 Nights / 7 Days",
        transportOption: "Private Car",
        roomSharing: "Double",
        packagePrice: 0,
        hotels: [],
        lowLevelHotels: [],
        highLevelHotels: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        travelDates: { from: "2024-06-01", to: "2024-06-07" },
        lowLevelPrice: 85000,
        highLevelPrice: 125000,
        heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2070&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1518548419970-58e3b40e9bc4?q=80&w=2070&auto=format&fit=crop",
        experiencePhotos: [
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=2070&auto=format&fit=crop"
        ],
        itinerary: [
            {
                id: "d1", day: 1, title: "Arrival & Coastal Majesty",
                description: "Welcome to the Island of Gods. Upon arrival at Ngurah Rai International Airport, you will be greeted by your private chauffeur and escorted to your luxury coastal retreat. As the sun begins to set, visit the Uluwatu Temple, perched dramatically on a cliff edge 70 meters above the Indian Ocean.",
                activities: ["Private Airport Greeting", "Luxury Transfer", "Uluwatu Temple Visit", "Kecak Fire Dance Performance"],
                meals: "Dinner included",
                stay: "Luxury Resort in Uluwatu",
                photos: ["https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "d2", day: 2, title: "Ubud Jungles & Sacred Cascades",
                description: "Venture into the heart of Bali's cultural soul. Explore the lush landscape of Ubud, starting with a refreshing visit to the Kanto Lampo Waterfall. Later, enjoy a decadent Balinese lunch overlooking the jungle canopy.",
                activities: ["Kanto Lampo Waterfall", "Traditional Balinese Lunch", "Tegalalang Rice Terraces", "Sacred Monkey Forest Sanctuary"],
                meals: "Breakfast & Lunch",
                stay: "Ubud Jungle Villa",
                photos: ["https://images.unsplash.com/photo-1518548419970-58e3b40e9bc4?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "d3", day: 3, title: "The Volcanic Heights of Kintamani",
                description: "Ascend to the highlands for breathtaking views of Mount Batur and its crater lake. Visit a local coffee plantation to taste the famous Luwak coffee before exploring the Tirta Empul Holy Water Temple.",
                activities: ["Batur Volcano Views", "Coffee Plantation Tour", "Tirta Empul Temple Ritual", "Mount Batur View Lunch"],
                meals: "Breakfast & Lunch",
                stay: "Ubud Jungle Villa",
                photos: ["https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "d4", day: 4, title: "Nusa Penida Island Expedition",
                description: "Board a private fast boat to the rugged island of Nusa Penida. Discover the iconic Kelingking Beach (T-Rex Bay) and the crystal-clear waters of Broken Beach and Angel's Billabong.",
                activities: ["Private Boat Charter", "Kelingking Beach Trek", "Broken Beach Sightseeing", "Snorkeling at Crystal Bay"],
                meals: "Breakfast, Lunch on Island",
                stay: "Ubud Jungle Villa",
                photos: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "d5", day: 5, title: "The Sunset Silhouette of Tanah Lot",
                description: "Depart Ubud for the chic shores of Seminyak. En route, visit the Tanah Lot Temple, one of Bali's most photographed landmarks, standing on a rock island in the sea. Afternoon at leisure on the beach.",
                activities: ["Tanah Lot Temple", "Seminyak Beach Club Access", "Private Sunset Dinner"],
                meals: "Breakfast & Dinner",
                stay: "Seminyak Beachfront Resort",
                photos: ["https://images.unsplash.com/photo-1518548419970-58e3b40e9bc4?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "d6", day: 6, title: "Bedugul Lakes & Heaven's Gate",
                description: "Explore the northern highlands. Visit the floating Pura Ulun Danu Bratan temple on the lake and walk through the iconic Handara Gate for the ultimate Bali photo opportunity.",
                activities: ["Wanagiri Hidden Hills", "Ulun Danu Bratan Temple", "Handara Gate Visit", "Local Market Exploration"],
                meals: "Breakfast & Lunch",
                stay: "Seminyak Beachfront Resort",
                photos: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "d7", day: 7, title: "Farewell to Paradise",
                description: "Enjoy a final Balinese breakfast and some last-minute shopping in Seminyak before your private transfer to the airport for your onward journey.",
                activities: ["Souvenir Shopping", "Last Beach Walk", "Private Airport Transfer"],
                meals: "Breakfast",
                stay: "N/A",
                photos: ["https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        optionalActivities: [
            { name: "Bali Swing (Ubud)", price: 2500, description: "Iconic swing over the jungle valley." },
            { name: "Candle Light Dinner (Seminyak)", price: 5000, description: "Private romantic dinner on the beach." },
            { name: "Scuba Diving (Nusa Penida)", price: 7500, description: "Discover Manta Point's underwater world." }
        ],
        includes: ["Luxury Resort Stays", "Private Chauffeur Driven Car", "Daily Breakfast & Gourmet Lunches", "All Entrance Fees", "Private Boat Charters", "Professional Photographer Access"],
        exclusions: ["International Flights", "Personal Expenses", "Travel Insurance", "Visa on Arrival", "Tipping for Guides"],
        expert: { name: "Anish", whatsapp: "919999999999", designation: "Bali Destination Specialist", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop" },
    },
    "vietnam-7n8d": {
        id: "vietnam-static-001",
        slug: "vietnam-7n8d",
        clientName: "Valued Guest",
        destination: "Vietnam North to South",
        status: "Published",
        pax: 2,
        duration: "7 Nights / 8 Days",
        transportOption: "Private Car",
        roomSharing: "Double",
        packagePrice: 0,
        hotels: [],
        lowLevelHotels: [],
        highLevelHotels: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        travelDates: { from: "2024-11-10", to: "2024-11-17" },
        lowLevelPrice: 95000,
        highLevelPrice: 155000,
        heroImage: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1555660220-44497747808a?q=80&w=2070&auto=format&fit=crop",
        experiencePhotos: [
            "https://images.unsplash.com/photo-1504457047772-27faf1c00561?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1509030450996-93525bbbf6b1?q=80&w=2070&auto=format&fit=crop"
        ],
        itinerary: [
            {
                id: "v1", day: 1, title: "Welcome to Hanoi",
                description: "Arrival in the thousand-year-ol capital of Vietnam. Meet your guide for a traditional Cyclo tour through the Old Quarter's 36 streets, followed by an evening Water Puppet performance.",
                activities: ["Hanoi Arrival", "Private Transfer", "Old Quarter Cyclo Tour", "Water Puppet Show"],
                meals: "Welcome Dinner",
                stay: "Luxury Boutique Hotel, Hanoi",
                photos: ["https://images.unsplash.com/photo-1509030450996-93525bbbf6b1?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "v2", day: 2, title: "The Emerald Beauty of Halong Bay",
                description: "Drive to Halong Bay to board a luxury 5-star cruise. Spend the day sailing amidst thousands of limestone karsts and emerald waters. Explore dark and bright caves and enjoy sunset on the deck.",
                activities: ["Limousine Transfer", "Luxury Cruise Check-in", "Cave Exploration", "Sunset Party"],
                meals: "All Meals on Board",
                stay: "Luxury Cruise Cabin",
                photos: ["https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "v3", day: 3, title: "Morning Calm & Fly to Da Nang",
                description: "Tai Chi on deck and brunch as the cruise heads back. Transfer to Hanoi airport for a short flight to Da Nang, then proceed to the ancient town of Hoi An.",
                activities: ["Tai Chi Lesson", "Flight to Da Nang", "Hoi An Ancient Town Evening"],
                meals: "Breakfast & Brunch",
                stay: "Riverside Resort, Hoi An",
                photos: ["https://images.unsplash.com/photo-1555660220-44497747808a?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "v4", day: 4, title: "Ba Na Hills & The Golden Bridge",
                description: "Take one of the world's longest cable cars to Ba Na Hills. Walk across the stunning Golden Bridge held by giant stone hands and enjoy the French Village and theme park.",
                activities: ["Cable Car Ride", "Golden Bridge Walk", "Fantasy Park", "French Village"],
                meals: "Breakfast & Buffet Lunch",
                stay: "Riverside Resort, Hoi An",
                photos: ["https://images.unsplash.com/photo-1504457047772-27faf1c00561?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "v5", day: 5, title: "The Imperial Splendor of Hue",
                description: "Drive over the scenic Hai Van Pass to Hue, the former imperial capital. Explore the Forbidden Purple City and the serene Thien Mu Pagoda.",
                activities: ["Hai Van Pass Scenic Drive", "Imperial Citadel Tour", "Thien Mu Pagoda Visit", "Perfume River Cruise"],
                meals: "Breakfast & Royal Dinner",
                stay: "Heritage Hotel, Hue",
                photos: ["https://images.unsplash.com/photo-1563214532-690a2be7480a?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "v6", day: 6, title: "Fly to Ho Chi Minh City",
                description: "Fly to Saigon. Explore the War Remnants Museum, Notre Dame Cathedral, and the Central Post Office before a gourmet dinner cruise on the Saigon River.",
                activities: ["Flight to Saigon", "City Landmark Tour", "Saigon River Dinner Cruise"],
                meals: "Breakfast & Dinner",
                stay: "Luxury Hotel, Saigon District 1",
                photos: ["https://images.unsplash.com/photo-1509030450996-93525bbbf6b1?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "v7", day: 7, title: "Mekong Delta River Life",
                description: "Escape the city to the lush Mekong Delta. Navigating the coconut-fringed canals on a traditional sampan and visit local fruit orchards and honey bee farms.",
                activities: ["Mekong Delta Cruise", "Traditional Music Performance", "Rowing Boat Trip", "Local Handicraft Workshops"],
                meals: "Breakfast & Local Mekong Lunch",
                stay: "Luxury Hotel, Saigon District 1",
                photos: ["https://images.unsplash.com/photo-1528353518104-dbd48bee7bc1?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "v8", day: 8, title: "Departure",
                description: "Morning at leisure at Ben Thanh Market for some last-minute shopping before your transfer to Tan Son Nhat airport for your departure.",
                activities: ["Ben Thanh Market", "Private Airport Transfer"],
                meals: "Breakfast",
                stay: "N/A",
                photos: ["https://images.unsplash.com/photo-1509030450996-93525bbbf6b1?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        optionalActivities: [
            { name: "Hanoi Street Food Tour", price: 2500, description: "Guided evening culinary journey." },
            { name: "Private Vespa Tour (Saigon)", price: 4500, description: "See the city like a local at night." },
            { name: "Cooking Class (Hoi An)", price: 3000, description: "Master the art of Vietnamese cuisine." }
        ],
        includes: ["5-star Hotel Stays", "Hanoi to Halong Limousine", "Luxury Cruise Expedition", "All Domestic Flights", "Private Tour Guide", "Personalized Itinerary App Access"],
        exclusions: ["International Flights", "Vietnam Visa Processing", "Personal Laundry & Drinks", "Weekend Surcharges"],
        expert: { name: "Anish", whatsapp: "919999999999", designation: "Vietnam Specialist", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop" },
    }
}
