import { notFound } from "next/navigation";
import { supabase } from '@/lib/supabase';
import LuxuryQuotationUI from "@/components/LuxuryQuotationUI";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function QuotationPage({ 
    params 
}: { 
    params: Promise<{ slug: string }> 
}) {
    const { slug } = await params;
    console.log(`[quotation/${slug}] Fetching from Supabase...`);

    let data = null;

    try {
        const { data: record, error } = await supabase
            .from('quotations')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error(`[quotation/${slug}] Supabase Error:`, error.message);
        }

        if (record) {
            // Unpack itinerary JSON if it's a string, or use directly if it's an object
            const itineraryData = typeof record.itinerary === 'string' 
                ? JSON.parse(record.itinerary) 
                : record.itinerary;
                
            data = {
                ...itineraryData,
                id: record.id,
                slug: record.slug,
                trip_name: record.trip_name,
                price: record.price,
                createdAt: record.created_at
            };
        }
    } catch (error: any) {
        console.error(`[quotation/${slug}] Exception:`, error.message);
    }

    if (!data) {
        console.log(`[quotation/${slug}] Data not found. Triggering 404.`);
        return notFound();
    }

    return <LuxuryQuotationUI q={data as any} />;
}
