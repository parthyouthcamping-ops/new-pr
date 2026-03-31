
import { notFound } from "next/navigation";
import LuxuryQuotationUI from "@/components/LuxuryQuotationUI";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let data = null;
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/quotation/${slug}`, {
            next: { revalidate: 0 }
        });
        
        if (res.ok) {
            data = await res.json();
        } else {
            console.error(`[quote/${slug}] API error:`, res.status);
        }
    } catch (e) {
        console.error(`[quote/${slug}] Fetch error:`, e);
    }

    // Defensive: check for required fields
    if (!data || !data.id || !data.slug) {
        console.error(`[quote/${slug}] Quotation missing required fields. Data:`, data);
        return notFound();
    }

    return <LuxuryQuotationUI q={data} />;
}
