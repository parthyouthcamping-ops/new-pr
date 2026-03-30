import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not defined in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function testConnection() {
  console.log('--- Testing Neon DB Connection ---');
  try {
    const result = await sql('SELECT 1 as test');
    console.log('✅ Connection successful:', result);
  } catch (err) {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  }
}

testConnection();
