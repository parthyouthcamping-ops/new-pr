
import { NextResponse } from 'next/server';
import { 
    getBrandSettingsSmart, 
    saveBrandSettingsSmart, 
    saveQuotationSmart, 
    getQuotationSmart, 
    getAllQuotationsSmart, 
    deleteQuotationSmart 
} from '@/lib/db-smart';

export async function POST(request: Request) {
    console.log('[API/DB] Processing request...');
    try {
        const payload = await request.clone().json();
        console.log('[API/DB] Payload:', JSON.stringify(payload, null, 2));

        const { action, id, slug, data } = payload;

        if (action === 'set') {
            if (id === 'global_brand') {
                console.log('[API/DB] Saving branding settings');
                await saveBrandSettingsSmart(data);
                return NextResponse.json({ success: true });
            } else {
                console.log(`[API/DB] Saving quotation: id=${id}, slug=${slug}`);
                const res = await saveQuotationSmart(id, slug, data);
                return NextResponse.json(res);
            }
        }

        if (action === 'get') {
            const result = (id === 'global_brand') 
                ? await getBrandSettingsSmart()
                : await getQuotationSmart(id);
            return NextResponse.json(result);
        }

        if (action === 'getAll') {
            const results = await getAllQuotationsSmart();
            return NextResponse.json(results);
        }

        if (action === 'delete') {
            await deleteQuotationSmart(id);
            return NextResponse.json({ success: true });
        }

        console.error('[API/DB] Unsupported action:', action);
        return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
    } catch (error: any) {
        console.error('[API/DB] CRITICAL ERROR:', error.message);
        return NextResponse.json({ 
            error: 'Database operation failed', 
            message: error.message 
        }, { status: 500 });
    }
}
