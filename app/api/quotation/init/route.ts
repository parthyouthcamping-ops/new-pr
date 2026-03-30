import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ 
        success: true, 
        message: 'Table initialization is now handled manually in the Supabase Dashboard. This route is deprecated.' 
    });
}
