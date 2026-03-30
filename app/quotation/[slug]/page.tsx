import { notFound } from "next/navigation";
import { neon } from '@neondatabase/serverless';
import LuxuryQuotationUI from "@/app/quote/[slug]/LuxuryQuotationUI";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function QuotationPage({ 
    params 
}: { 
    params: Promise<{ slug: string }> 
}) {
    const { slug } = await params;

    if (!process.env.DATABASE_URL) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500 font-bold">DATABASE_URL is not configured.</p>
            </div>
        );
    }

    const sql = neon(process.env.DATABASE_URL);
    let data = null;

    try {
        const result = await sql`
            SELECT id, slug, trip_name, price, itinerary, created_at
            FROM quotations
            WHERE slug = ${slug}
            LIMIT 1
        `;

        if (result.length > 0) {
            const record = result[0];
            data = {
                ...record.itinerary,
                id: record.id,
                slug: record.slug,
                trip_name: record.trip_name,
                price: record.price,
                createdAt: record.created_at
            };
        }
    } catch (error) {
        console.error("Failed to fetch quotation:", error);
    }

    if (!data) {
        return notFound();
    }

    return <LuxuryQuotationUI q={data as any} />;
}
