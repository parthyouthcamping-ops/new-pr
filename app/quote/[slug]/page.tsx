import { notFound } from "next/navigation";
import { PREDEFINED_QUOTES } from "@/lib/itineraries";
import LuxuryQuotationUI from "@/components/LuxuryQuotationUI";
import { getQuotationBySlugSmart } from "@/lib/quotations-smart";

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
            data = await getQuotationBySlugSmart(slug);
        } catch (e: any) {
            console.error(`[quote/${slug}] DB error:`, e.message);
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
