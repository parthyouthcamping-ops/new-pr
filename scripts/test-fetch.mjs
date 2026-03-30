async function testFetch() {
    const slug = 'kashmir-luxury-paradise-4647o3';
    console.log(`--- Fetching Quotation: ${slug} ---`);
    try {
        const response = await fetch(`http://localhost:3000/api/quotation/${slug}`);
        const data = await response.json();
        console.log('✅ Response:', data);
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

testFetch();
