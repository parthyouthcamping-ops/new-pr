import { notFound } from "next/navigation";
import { PREDEFINED_QUOTES } from "@/lib/itineraries";
import { getQuotations } from "@/lib/store";
import LuxuryQuotationUI from "@/components/LuxuryQuotationUI";
import { neon } from '@neondatabase/serverless';

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
            if (process.env.DATABASE_URL) {
                const sql = neon(process.env.DATABASE_URL);
                const result = await sql`SELECT id, slug, trip_name, price, itinerary, created_at FROM quotations WHERE slug = ${slug} LIMIT 1`;
                if (result.length > 0) {
                    const record = result[0];
                    data = {
                        ...record.itinerary,
                        id: record.id,
                        slug: record.slug,
                        trip_name: record.trip_name,
                        price: record.price,
                        createdAt: record.created_at
                    } as any;
                }
            }
        } catch (e) {
            console.error("Failed to fetch quotation from db:", e);
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
