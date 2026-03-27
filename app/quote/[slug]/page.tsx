import { notFound } from "next/navigation";
import { PREDEFINED_QUOTES } from "@/lib/itineraries";
import { getQuotations } from "@/lib/store";
import LuxuryQuotationUI from "./LuxuryQuotationUI";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    console.log("Next.js Server Debug - Params Slug:", slug);

    // TASK 1: Use direct mapping if possible (PREDEFINED_QUOTES acts as our quotes map)
    let data = PREDEFINED_QUOTES[slug];

    // Optional: Fallback to DB if not in predefined (to be robust)
    // But as per Task 1, showing 404 if not found is key.
    if (!data) {
        // We call getQuotations which might have been saved in DB
        // Note: on the server, getQuotations might need special care with localStorage
        // but for predefined slugs like bali-6n7d, it will work.
        const allQuotations = await getQuotations();
        data = allQuotations.find(q => q.slug === slug) as any;
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
