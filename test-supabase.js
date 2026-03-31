const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('--- Testing Supabase Connection ---');
  
  // Test brand_settings table
  console.log('1. Checking brand_settings table...');
  const { data: brand, error: brandErr } = await supabase.from('brand_settings').select('count').limit(1);
  if (brandErr) {
    console.error('❌ brand_settings table error:', brandErr.message);
  } else {
    console.log('✅ brand_settings table exists.');
  }

  // Test quotations table
  console.log('2. Checking quotations table...');
  const { data: quote, error: quoteErr } = await supabase.from('quotations').select('count').limit(1);
  if (quoteErr) {
    console.error('❌ quotations table error:', quoteErr.message);
  } else {
    console.log('✅ quotations table exists.');
  }

  // List some slugs from quotations
  console.log('3. Fetching sample slugs from quotations...');
  const { data: slugs, error: slugsErr } = await supabase.from('quotations').select('id, slug').limit(5);
  if (slugsErr) {
    console.error('❌ Fetching slugs error:', slugsErr.message);
  } else {
    console.log('Sample Slugs:', slugs.map(s => s.slug).join(', '));
  }
}

test();
