
async function test() {
    const testData = {
        id: 'test-id-' + Math.random().toString(36).substring(2, 7),
        slug: 'test-slug-' + Math.random().toString(36).substring(2, 7),
        data: {
            destination: 'Test Destination',
            highLevelPrice: 1000,
            itinerary: [{ day: 1, text: 'Test' }]
        }
    };

    console.log('Testing Save Quotation...');
    try {
        const res = await fetch('http://localhost:3000/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'set',
                id: testData.id,
                slug: testData.slug,
                data: testData.data
            })
        });
        const result = await res.json();
        console.log('Result:', result);
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

test();
