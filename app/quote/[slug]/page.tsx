import { notFound } from "next/navigation";
import { PREDEFINED_QUOTES } from "@/lib/itineraries";
import { supabase } from '@/lib/supabase';
import LuxuryQuotationUI from "@/components/LuxuryQuotationUI";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    console.log("Next.js Server Debug - Params Slug:", slug);

    // TASK 1: Use direct mapping if possible (PREDEFINED_QUOTES acts as our quotes map)
    let data = PREDEFINED_QUOTES[slug];

    // Optional: Fallback to DB if not in predefined (to be robust)
    if (!data) {
        try {
            const { data: record, error } = await supabase
                .from('quotations')
                .select('*')
                .eq('slug', slug)
                .single();
                
            if (error) {
                console.error(`[quote/${slug}] Supabase Error:`, error.message);
            }

            if (record) {
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
                } as any;
            }
        } catch (e: any) {
            console.error("Failed to fetch quotation from db:", e.message);
        }
    }

    // TASK 3: Remove Admin Fallback - Use notFound()
    if (!data) {
        console.error("Quotation not found for slug:", slug);
        return notFound();
    }

    // TASK 2: Pass corrected data into EXISTING UI (LuxuryQuotationUI)
    // The design remains EXACTLY SAME as it was in your previous luxury design.
    return <LuxuryQuotationUI q={data as any} />;
}
