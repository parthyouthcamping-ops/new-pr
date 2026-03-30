import type { Metadata } from "next";
import { Montserrat, Caveat, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const caveat = Caveat({
    subsets: ["latin"],
    variable: "--font-caveat",
});

const dmSerif = DM_Serif_Display({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-dm-serif",
});

export const metadata: Metadata = {
    title: "YouthCamping | One Trip at a Time",
    description: "Ultra luxury travel quotation generator",
};

import { Toaster } from "sonner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${montserrat.variable} ${caveat.variable} ${dmSerif.variable} font-montserrat antialiased`}>
                {children}
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}
