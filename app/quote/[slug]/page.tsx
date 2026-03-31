
import { notFound } from "next/navigation";
import LuxuryQuotationUI from "@/components/LuxuryQuotationUI";
import { getQuotationSmart } from "@/lib/db-smart";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    console.log(`[Page: /quote/${slug}] Fetching smartly...`);

    let data: any = null;
    try {
        data = await getQuotationSmart(slug);
    } catch (error: any) {
        console.error(`[Page: /quote/${slug}] Exception:`, error.message);
    }

    if (!data) {
        console.log(`[Page: /quote/${slug}] Data not found. Triggering 404.`);
        return notFound();
    }

    return <LuxuryQuotationUI q={data} />;
}
