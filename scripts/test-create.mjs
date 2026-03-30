async function testCreate() {
    console.log('--- Creating Test Quotation ---');
    try {
        const response = await fetch('http://localhost:3000/api/quotation/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                trip_name: "Kashmir Luxury Paradise",
                price: 85000,
                itinerary: {
                    clientName: "Arjun",
                    destination: "Kashmir, India",
                    duration: "6 Days • 5 Nights",
                    pax: 2,
                    heroImage: "https://images.unsplash.com/photo-1566833925222-f5421fa763c3?q=80&w=2070&auto=format&fit=crop",
                    expert: {
                        name: "Sarah Jones",
                        whatsapp: "+919876543210"
                    },
                    itinerary: [
                        {
                            day: 1,
                            title: "Arrival in Srinagar",
                            description: "Welcome to the summer capital. Check into your luxury houseboat.",
                            activities: ["Shikara Ride", "Houseboat Check-in"],
                            photos: ["https://images.unsplash.com/photo-1566833925222-f5421fa763c3?q=80&w=2070&auto=format&fit=crop"]
                        }
                    ]
                }
            })
        });

        const data = await response.json();
        console.log('✅ Response:', data);
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

testCreate();
