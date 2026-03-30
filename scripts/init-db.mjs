import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not defined in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function init() {
  console.log('--- Initializing Quotations Table ---');
  try {
    // Create the table
    await sql(`
      CREATE TABLE IF NOT EXISTS quotations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        trip_name TEXT NOT NULL,
        price NUMERIC NOT NULL,
        itinerary JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "quotations" created or already exists.');
    
    // Add index on slug
    await sql('CREATE INDEX IF NOT EXISTS idx_quotations_slug ON quotations(slug);');
    console.log('✅ Index on "slug" created.');
    
  } catch (err) {
    console.error('❌ Error initializing database:', err);
    process.exit(1);
  }
}

init();
