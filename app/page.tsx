"use client";

import Link from "next/link";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { motion } from "framer-motion";

export default function Home() {
    const { brand } = useBrandSettings();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-white text-center font-montserrat relative selection:bg-primary/20 overflow-hidden">
            {/* SEO Metadata Emulation */}
            <title>YouthCamping | Luxury Travel Reimagined</title>
            <meta name="description" content="Hand-crafted travel quotations for the discerning traveler." />

            {/* Elegant Background Decoration */}
            <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-[120px] animae-pulse" />
            <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-gradient-to-tr from-primary/[0.05] via-transparent to-transparent blur-[120px]" />

            <div className="z-10 max-w-5xl w-full flex flex-col items-center gap-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center"
                >
                    {brand?.companyLogo ? (
                        <img src={brand.companyLogo} className="h-28 w-auto object-contain mb-8 drop-shadow-2xl" alt="Company Logo" />
                    ) : (
                        <h1 className="text-8xl font-[900] text-primary tracking-tighter mb-4 uppercase scale-90 md:scale-100 italic">
                            YouthCamping
                        </h1>
                    )}

                    <div className="h-px w-32 bg-primary/20 mb-8" />

                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter italic mb-4">
                        Curated Luxury Travel
                    </h2>
                    <p className="text-[10px] md:text-sm font-black text-primary uppercase tracking-[0.8em] opacity-60">
                        ONE TRIP AT A TIME • EST. 2024
                    </p>
                </motion.div>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="max-w-2xl text-gray-500 font-semibold leading-relaxed text-sm md:text-lg italic"
                >
                    &quot;We orchestrate bespoke journeys that transcend the ordinary, blending uncompromising luxury with authentic cultural immersion.&quot;
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col md:flex-row gap-8 mt-10"
                >
                    <button className="px-16 py-8 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-[2rem] shadow-4xl shadow-primary/40 hover:bg-primary-deep transition-all transform hover:-translate-y-2 hover:scale-110 active:scale-95 no-print">
                        Explore Our Tours
                    </button>
                    <Link href="/quote/bali-6n7d">
                        <button className="px-16 py-8 bg-white border-4 border-primary text-primary font-black uppercase tracking-widest text-[11px] rounded-[2rem] hover:bg-primary/5 transition-all transform hover:-translate-y-2 hover:scale-110 active:scale-95 no-print">
                            View Sample Quote
                        </button>
                    </Link>
                </motion.div>

                {/* Secure Entry — Very subtle and professional */}
                <div className="mt-32 opacity-0 hover:opacity-100 transition-opacity duration-700 no-print">
                    <Link
                        href="/login"
                        className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-primary transition-colors py-4 px-10 border border-gray-100 rounded-full hover:border-primary/20 hover:shadow-lg"
                    >
                        Management Login
                    </Link>
                </div>
            </div>

            <footer className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.6em] text-gray-400 opacity-50">
                &copy; {new Date().getFullYear()} YouthCamping Global Luxury Travel. All Rights Reserved.
            </footer>
        </main>
    );
}
