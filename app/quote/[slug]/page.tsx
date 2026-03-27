import { notFound } from "next/navigation";
import { getQuotationBySlug } from "@/lib/store";
import LuxuryViewClient from "./LuxuryViewClient";

export default async function Page({ params }: { params: { slug: string } }) {
    if (!params.slug) {
        return notFound();
    }

    const quotation = await getQuotationBySlug(params.slug);

    if (!quotation) {
        return notFound();
    }

    // Now render the client view with the data
    return <LuxuryViewClient initialQuotation={quotation} />;
}
