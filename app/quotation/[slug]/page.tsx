import { notFound } from "next/navigation";
import LuxuryQuotationUI from "@/components/LuxuryQuotationUI";
import { getQuotationBySlugSmart } from "@/lib/quotations-smart";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function QuotationPage({ 
    params 
}: { 
    params: Promise<{ slug: string }> 
}) {
    const { slug } = await params;
    console.log(`[quotation/${slug}] Fetching from DB...`);

    let data: any = null;
    try {
        data = await getQuotationBySlugSmart(slug);
    } catch (error: any) {
        console.error(`[quotation/${slug}] DB Exception:`, error.message);
    }

    if (!data) {
        console.log(`[quotation/${slug}] Data not found. Triggering 404.`);
        return notFound();
    }

    return <LuxuryQuotationUI q={data as any} />;
}
