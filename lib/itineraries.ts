import { Quotation } from "./types";

const bali6n7d: Quotation = {
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
            description: "Welcome to the Island of Gods. Upon arrival at Ngurah Rai International Airport, you will be greeted by your private chauffeur and escorted to your luxury coastal retreat.",
            activities: ["Private Airport Greeting", "Uluwatu Temple Visit", "Kecak Fire Dance Performance"],
            meals: "Dinner included",
            stay: "Luxury Resort in Uluwatu",
            photos: ["https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2070&auto=format&fit=crop"]
        },
        {
            id: "d2", day: 2, title: "Ubud Jungles & Sacred Cascades",
            description: "Explore the cultural soul of Bali in Ubud.",
            activities: ["Kanto Lampo Waterfall", "Rice Terraces Walk"],
            meals: "Breakfast & Lunch",
            stay: "Ubud Jungle Villa",
            photos: ["https://images.unsplash.com/photo-1518548419970-58e3b40e9bc4?q=80&w=2070&auto=format&fit=crop"]
        }
    ],
    optionalActivities: [
        { name: "Bali Swing (Ubud)", price: 2500, description: "Iconic swing over the jungle valley." }
    ],
    includes: ["Luxury Resort Stays", "Private Chauffeur Driven Car", "Daily Breakfast & Gourmet Lunches"],
    exclusions: ["International Flights", "Personal Expenses", "Travel Insurance"],
    expert: { name: "Anish", whatsapp: "919999999999", designation: "Bali Destination Specialist", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop" },
};

export const PREDEFINED_QUOTES: Record<string, Quotation> = {
    "bali-6n7d": bali6n7d,
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
        experiencePhotos: [],
        itinerary: [
            {
                id: "v1", day: 1, title: "Welcome to Hanoi",
                description: "Arrival in the thousand-year-ol capital of Vietnam.",
                activities: ["Hanoi Arrival", "Old Quarter Cyclo Tour"],
                meals: "Welcome Dinner",
                stay: "Luxury Boutique Hotel, Hanoi",
                photos: ["https://images.unsplash.com/photo-1509030450996-93525bbbf6b1?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        optionalActivities: [],
        includes: ["5-star Hotel Stays", "Internal Flights"],
        exclusions: [],
        expert: { name: "Anish", whatsapp: "919999999999", designation: "Destination Expert", photo: "" },
    },
    "trip-luxury-57fe4": {
        ...bali6n7d,
        id: "trip-luxury-57fe4",
        slug: "trip-luxury-57fe4",
        clientName: "Test Traveler"
    },
    "kerala-luxury-ed09e": {
        id: "kerala-static-001",
        slug: "kerala-luxury-ed09e",
        clientName: "Valued Guest",
        destination: "Kerala, India",
        status: "Published",
        pax: 2,
        duration: "5 Nights / 6 Days",
        transportOption: "Private Chauffeur Driven Sedan",
        roomSharing: "Double",
        packagePrice: 0,
        hotels: [],
        lowLevelHotels: [
            { id: "k1", name: "Fragrant Nature Fort Kochi", location: "Kochi", rating: 4, description: "A boutique heritage hotel offering a blend of history and modern comfort.", roomType: "Heritage Room", photos: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop"] },
            { id: "k2", name: "Amber Dale Luxury Hotel", location: "Munnar", rating: 4, description: "Perched on a hill with panoramic views of the tea valleys.", roomType: "Valley View Room", photos: ["https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=2070&auto=format&fit=crop"] }
        ],
        highLevelHotels: [
            { id: "k3", name: "Brunton Boatyard", location: "Kochi", rating: 5, description: "A magnificent heritage property reflecting the Victorian era.", roomType: "Sea View Room", photos: ["https://images.unsplash.com/photo-1582719478250-c89cae4df85b?q=80&w=2070&auto=format&fit=crop"] },
            { id: "k4", name: "Blanket Hotel & Spa", location: "Munnar", rating: 5, description: "A luxury retreat overlooking the Attukad waterfalls.", roomType: "Premier Room", photos: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"] }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        travelDates: { from: "2024-09-15", to: "2024-09-20" },
        lowLevelPrice: 45000,
        highLevelPrice: 78000,
        heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=2070&auto=format&fit=crop",
        experiencePhotos: [],
        itinerary: [
            {
                id: "k-d1", day: 1, title: "Arrival in Kochi & Colonial Exploration",
                description: "Arrival at Kochi International Airport. Meet our representative and transfer to your hotel. In the afternoon, explore the historical landmarks including the Chinese Fishing Nets, St. Francis Church, and the Dutch Palace. Witness a traditional Kathakali performance in the evening.",
                activities: ["Private Airport Transfer", "Fort Kochi Walking Tour", "Kathakali Performance"],
                meals: "Welcome Dinner",
                stay: "Kochi Heritage Hotel",
                photos: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "k-d2", day: 2, title: "Scenic Drive to Munnar Hills",
                description: "Proceed to Munnar, a landscape defined by rolling hills and vast tea plantations. En route, stop at the Valara and Cheeyappara waterfalls. Afternoon at leisure to enjoy the resort's estate.",
                activities: ["Scenic Drive through Western Ghats", "Waterfall Stops", "Resort Arrival Treatment"],
                meals: "Breakfast & Dinner",
                stay: "Munnar Plantation Resort",
                photos: ["https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "k-d3", day: 3, title: "Eravikulam & Tea Heritage Journey",
                description: "Morning visit to Eravikulam National Park to witness the Nilgiri Tahr. Later, visit the Tea Museum to understand the evolution of Munnar's tea industry. Guided walk through the private tea estates in the evening.",
                activities: ["Eravikulam National Park Safari", "Tea Museum Visit", "Private Estate Walk"],
                meals: "Breakfast & Lunch",
                stay: "Munnar Plantation Resort",
                photos: ["https://images.unsplash.com/photo-1518548419970-58e3b40e9bc4?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "k-d4", day: 4, title: "Thekkady Wildlife & Spice Trails",
                description: "Drive to Thekkady, the spice heartland of Kerala. Afternoon boat cruise on Periyar Lake for wildlife viewing. Visit a spice plantation to learn about the cultivation of cardamom, pepper, and cinnamon.",
                activities: ["Periyar Lake Boat Cruise", "Guided Spice Plantation Tour", "Evening Elephant Experience (Optional)"],
                meals: "Breakfast",
                stay: "Thekkady Nature Resort",
                photos: ["https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "k-d5", day: 5, title: "Backwater Serenity & Houseboat Living",
                description: "Transfer to Alleppey to board your private luxury houseboat. Spend the day cruising through the intricate network of backwaters, observing local life and lush paddy fields. Enjoy traditional Kerala cuisine prepared on board.",
                activities: ["Private Houseboat Boarding", "Backwater Navigation", "Traditional Onboard Dining"],
                meals: "All Meals Onboard",
                stay: "Private Luxury Houseboat",
                photos: ["https://images.unsplash.com/photo-1593115052912-5f674165a26c?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "k-d6", day: 6, title: "Disembarkation & Farewell to Kerala",
                description: "Enjoy a final breakfast on the backwaters before disembarking at Alleppey. Transfer to Kochi International Airport for your return flight.",
                activities: ["Morning Cruise", "Transfer to Airport"],
                meals: "Breakfast",
                stay: "N/A",
                photos: ["https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        optionalActivities: [
            { name: "Bamboo Rafting", price: 3500, description: "Eco-tourism activity in Periyar Tiger Reserve." },
            { name: "Ayurvedic Spa Treatment", price: 4500, description: "Authentic Keralite rejuvenation therapy." }
        ],
        includes: ["Private AC Luxury Vehicle", "All Accommodation as specified", "Houseboat stay with all meals", "Sightseeing entry tickets", "English speaking chauffeur guide"],
        exclusions: ["Domestic/International Airfare", "GST/Tourism Taxes", "Mandatory Gala Dinner on peak dates", "Tips and personal gratuities"],
        expert: { name: "Anish", whatsapp: "919999999999", designation: "South India Specialist", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop" },
    },
    "maldives-luxury-77f2d": {
        id: "maldives-static-001",
        slug: "maldives-luxury-77f2d",
        clientName: "Valued Guest",
        destination: "Maldives",
        status: "Published",
        pax: 2,
        duration: "4 Nights / 5 Days",
        transportOption: "Speedboat / Seaplane Transfer",
        roomSharing: "Double",
        packagePrice: 0,
        hotels: [],
        lowLevelHotels: [
            { id: "m1", name: "Sun Siyam Olhuveli", location: "South Male Atoll", rating: 4, description: "A vibrant resort combining traditional Maldives with modern luxury.", roomType: "Deluxe Water Villa", photos: ["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2070&auto=format&fit=crop"] }
        ],
        highLevelHotels: [
            { id: "m2", name: "Waldorf Astoria Ithaafushi", location: "South Male Atoll", rating: 5, description: "Ultra-luxury retreat with iconic white sand beaches.", roomType: "Ocean Villa with Pool", photos: ["https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2070&auto=format&fit=crop"] }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        travelDates: { from: "2024-10-10", to: "2024-10-14" },
        lowLevelPrice: 120000,
        highLevelPrice: 280000,
        heroImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2070&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2070&auto=format&fit=crop",
        experiencePhotos: [],
        itinerary: [
            {
                id: "m-d1", day: 1, title: "Arrival in Paradise",
                description: "Arrive at Velana International Airport. Transfer to your luxury resort via speedboat or seaplane. Check-in and enjoy your first Maldivian sunset from your overwater villa.",
                activities: ["Resort Transfer", "Check-in Orientation", "Sunset Viewing"],
                meals: "Dinner Included",
                stay: "Luxury Water Villa",
                photos: ["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "m-d2", day: 2, title: "Aquatic exploration & Marine Life",
                description: "Spend the morning snorkeling in the house reef. Afternoon at leisure or participate in guided scuba diving sessions to witness the vibrant coral ecosystems.",
                activities: ["House Reef Snorkeling", "Marine Biology Presentation", "Water Sports Center Visit"],
                meals: "Breakfast & Dinner",
                stay: "Luxury Water Villa",
                photos: ["https://images.unsplash.com/photo-1544122159-39cae2809c96?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        optionalActivities: [
            { name: "Private Sandbank Lunch", price: 15000, description: "Exclusive dining experience on a pristine sandbank." }
        ],
        includes: ["Luxury Villa Accommodation", "Return Speedboat Transfers", "Daily Half Board Meals", "Complimentary Snorkeling Gears"],
        exclusions: ["Seaplane Upgrade", "Personal Watersports", "International Flights"],
        expert: { name: "Anish", whatsapp: "919999999999", designation: "Island Destination Expert", photo: "" },
    },
    "switzerland-luxury-99a3c": {
        id: "swiss-static-001",
        slug: "switzerland-luxury-99a3c",
        clientName: "Valued Guest",
        destination: "Switzerland",
        status: "Published",
        pax: 2,
        duration: "6 Nights / 7 Days",
        transportOption: "Swiss Travel Pass - First Class",
        roomSharing: "Double",
        packagePrice: 0,
        hotels: [],
        lowLevelHotels: [
            { id: "s1", name: "Hotel Belvedere Grindelwald", location: "Grindelwald", rating: 4, description: "A family-run hotel with stunning views of the Eiger North Face.", roomType: "Classic Room", photos: ["https://images.unsplash.com/photo-1502404642507-0402b80026e6?q=80&w=2070&auto=format&fit=crop"] }
        ],
        highLevelHotels: [
            { id: "s2", name: "Bürgenstock Resort", location: "Lake Lucerne", rating: 5, description: "One of the most prestigious resorts in the world, perched high above Lake Lucerne.", roomType: "Lake View Palace Room", photos: ["https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=2070&auto=format&fit=crop"] }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        travelDates: { from: "2024-12-05", to: "2024-12-11" },
        lowLevelPrice: 245000,
        highLevelPrice: 485000,
        heroImage: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=2070&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1502404642507-0402b80026e6?q=80&w=2070&auto=format&fit=crop",
        experiencePhotos: [],
        itinerary: [
            {
                id: "s-d1", day: 1, title: "Arrival in Zurich & Lakeside Luxury",
                description: "Arrival at Zurich International Airport. Board the Swiss Rail for a first-class journey to Lucerne. Check-in to your lakeside hotel. Evening at leisure to explore the Chapel Bridge and the Old Town.",
                activities: ["First Class Rail Transfer", "Old Town Exploration", "Lakeside Gourmet Dinner"],
                meals: "Welcome Dinner",
                stay: "Luxury Hotel in Lucerne",
                photos: ["https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "s-d2", day: 2, title: "Mount Titlis - The Eternal Snow",
                description: "Excursion to Engelberg and Mount Titlis. Experience the Rotair, the world's first revolving cable car. Visit the Ice Grotto and walk across the Titlis Cliff Walk - Europe's highest suspension bridge.",
                activities: ["Rotair Cable Car Experience", "Ice Grotto Visit", "Cliff Walk Adventure"],
                meals: "Breakfast & Lunch on Peak",
                stay: "Luxury Hotel in Lucerne",
                photos: ["https://images.unsplash.com/photo-1516466723277-e42e44e99de0?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "s-d3", day: 3, title: "Bernese Oberland Panorama",
                description: "Scenic rail journey to Interlaken and then to Grindelwald. Spend the afternoon taking in the views of the Jungfrau massif. Evening fondue experience in a traditional Swiss chalet.",
                activities: ["Scenic Rail Journey", "Grindelwald Village Walk", "Traditional Fondue Dinner"],
                meals: "Breakfast & Fondue Dinner",
                stay: "Superior Hotel in Grindelwald",
                photos: ["https://images.unsplash.com/photo-1513673048123-08505a672ad2?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "s-d4", day: 4, title: "Jungfraujoch - Top of Europe",
                description: "The highlight of your journey. Board the Eiger Express and the Jungfrau Railway to reach the highest railway station in Europe at 3,454m. Explore the Sphinx Observatory and Alpine Sensation.",
                activities: ["Eiger Express Gondola", "Cogwheel Train to Jungfraujoch", "Sphinx Observatory Visit"],
                meals: "Breakfast",
                stay: "Superior Hotel in Grindelwald",
                photos: ["https://images.unsplash.com/photo-1517409241-073db5000572?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "s-d5", day: 5, title: "Golden Pass Scenic Line to Montreux",
                description: "Travel on the Golden Pass Express, one of the most beautiful train lines in Switzerland. Arrive in Montreux on the shores of Lake Geneva. Visit Chillon Castle, Switzerland's most visited historic monument.",
                activities: ["Golden Pass Express Journey", "Chillon Castle Guided Tour", "Montreux Riviera Walk"],
                meals: "Breakfast",
                stay: "Palace Hotel in Montreux",
                photos: ["https://images.unsplash.com/photo-1520113410140-54e6015d5ec3?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "s-d6", day: 6, title: "Zurich Cosmopolitan Flare",
                description: "Final rail journey back to Zurich. Afternoon shopping on Bahnhofstrasse and a visit to the Lindt Home of Chocolate. Farewell dinner in a historical guild house.",
                activities: ["Bahnhofstrasse Shopping", "Lindt Chocolate Museum", "Guild House Farewell Dinner"],
                meals: "Breakfast & Farewell Dinner",
                stay: "Boutique Hotel in Zurich",
                photos: ["https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=2070&auto=format&fit=crop"]
            },
            {
                id: "s-d7", day: 7, title: "Departure from Zurich",
                description: "Transfer to Zurich Airport for your international departure.",
                activities: ["Airport Transfer"],
                meals: "Breakfast",
                stay: "N/A",
                photos: ["https://images.unsplash.com/photo-1534008124450-482d0615965f?q=80&w=2070&auto=format&fit=crop"]
            }
        ],
        optionalActivities: [
            { name: "Paragliding in Interlaken", price: 18000, description: "Tandem flight with views of Eiger, Monch, and Jungfrau." },
            { name: "Chaplin's World Visit", price: 3500, description: "Museum dedicated to Charlie Chaplin in Corsier-sur-Vevey." }
        ],
        includes: ["6 Nights Luxury Accommodation", "8-Day Swiss Travel Pass (First Class)", "Daily Breakfast & 3 Specialty Dinners", "Jungfraujoch & Mt. Titlis Excursions", "Detailed Route Assistance"],
        exclusions: ["International Airfare", "Visa Fees", "Personal Shopping", "Travel Insurance"],
        expert: { name: "Anish", whatsapp: "919999999999", designation: "European Luxury Expert", photo: "" },
    }
}
