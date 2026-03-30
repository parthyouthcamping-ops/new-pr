import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
    if (!process.env.DATABASE_URL) {
        return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
    }
    const sql = neon(process.env.DATABASE_URL);

    try {
        console.log('[INIT] Dropping/Creating quotations table...');
        
        // We'll rename the old table if it exists to preserve data, or just drop it.
        // Given the specific schema request, it's safer to create a clean one.
        await sql`DROP TABLE IF EXISTS quotations CASCADE;`;

        await sql`
            CREATE TABLE quotations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                slug TEXT UNIQUE NOT NULL,
                trip_name TEXT NOT NULL,
                price NUMERIC NOT NULL,
                itinerary JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await sql`CREATE INDEX idx_quotations_slug ON quotations(slug);`;

        return NextResponse.json({ success: true, message: 'Table "quotations" initialized with requested schema.' });
    } catch (error: any) {
        console.error('[INIT] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
