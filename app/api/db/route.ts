import { NextResponse } from 'next/server';
import { getBrandSettingsSmart, saveBrandSettingsSmart } from '@/lib/db-smart';

export async function POST(request: Request) {
    try {
        const { action, id, data } = await request.json();

        if (action === 'set' && id === 'global_brand') {
            await saveBrandSettingsSmart(data);
            return NextResponse.json({ success: true });
        }

        if (action === 'get' && id === 'global_brand') {
            const settings = await getBrandSettingsSmart();
            return NextResponse.json(settings);
        }

        return NextResponse.json({ error: 'Invalid action or id' }, { status: 400 });
    } catch (error: any) {
        console.error('[API /api/db] ERROR:', error.message);
        return NextResponse.json({ 
            error: 'Database operation failed', 
            message: error.message 
        }, { status: 500 });
    }
}
