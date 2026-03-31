import { notFound } from "next/navigation";
import LuxuryQuotationUI from "@/components/LuxuryQuotationUI";
import { getQuotationSmart } from "@/lib/db-smart";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function QuotationPage({ 
    params 
}: { 
    params: Promise<{ slug: string }> 
}) {
    const { slug } = await params;
    console.log(`[quotation/${slug}] Fetching smartly...`);

    let data: any = null;
    try {
        data = await getQuotationSmart(slug);
    } catch (error: any) {
        console.error(`[quotation/${slug}] Exception:`, error.message);
    }

    if (!data) {
        console.log(`[quotation/${slug}] Data not found. Triggering 404.`);
        return notFound();
    }

    return <LuxuryQuotationUI q={data} />;
}
