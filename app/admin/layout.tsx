"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, FileText, Palette, Hotel, Calendar, UserCheck, Wand2, Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";
import { useBrandSettings } from "@/hooks/useBrandSettings";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { brand } = useBrandSettings();

    const sidebarLinks = [
        { name: "All Quotes", icon: LayoutDashboard, id: "all", href: "/admin" },
        { name: "Create New", icon: Plus, id: "new", href: "/admin/new" },
        { name: "Branding", icon: Palette, id: "branding", href: "/admin/branding" },
    ];

    const aiLinks = [
        { name: "AI Generator", icon: Wand2, id: "ai-generator", href: "/admin/ai-generator" },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="flex min-h-screen bg-gray-50/50 font-montserrat">
            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-40">
                <div className="flex items-center gap-3">
                    {brand?.companyLogo ? (
                        <img src={brand.companyLogo} className="h-6 w-auto object-contain" alt="Logo" />
                    ) : (
                        <h1 className="text-xl font-black text-primary tracking-tighter">
                            YouthCamping
                        </h1>
                    )}
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 -mr-2 text-gray-500 hover:text-primary transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Backdrop for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:sticky top-0 h-[100dvh] w-80 bg-white border-r border-gray-100 p-8 flex flex-col gap-12 z-50 transition-transform duration-300 overflow-y-auto",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex flex-col gap-4">
                    {brand?.companyLogo ? (
                        <img src={brand.companyLogo} className="h-10 w-auto object-contain self-start" alt="Logo" />
                    ) : (
                        <h1 className="text-3xl font-black text-primary tracking-tighter">
                            YouthCamping
                        </h1>
                    )}
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-1">
                        Admin Dashboard
                    </p>
                </div>

                <nav className="flex flex-col gap-4">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.id}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all transform hover:translate-x-1",
                                pathname === link.href
                                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                                    : "text-gray-500 hover:bg-primary/5 hover:text-primary"
                            )}
                        >
                            <link.icon size={20} />
                            {link.name}
                        </Link>
                    ))}

                    {/* AI section separator */}
                    <div className="flex items-center gap-3 px-2 pt-2">
                        <div className="h-px flex-1 bg-amber-100" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">AI Tools</span>
                        <div className="h-px flex-1 bg-amber-100" />
                    </div>

                    {aiLinks.map((link) => (
                        <Link
                            key={link.id}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all transform hover:translate-x-1",
                                pathname === link.href
                                    ? "bg-gradient-to-r from-amber-500 to-primary text-white shadow-xl shadow-amber-400/20"
                                    : "text-amber-600 hover:bg-amber-50"
                            )}
                        >
                            <link.icon size={20} />
                            {link.name}
                            <span className="ml-auto text-[8px] font-black uppercase tracking-widest bg-amber-100 text-amber-600 px-2 py-1 rounded-full">NEW</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto flex flex-col gap-6">
                    <GlassCard variant="orange" className="p-6 rounded-3xl">
                        <h3 className="font-bold text-primary text-sm mb-2">Need Help?</h3>
                        <p className="text-[10px] text-primary/60 font-medium leading-relaxed">
                            If you encounter any issues building a luxury proposal, contact support.
                        </p>
                    </GlassCard>

                    <Button 
                        variant="ghost" 
                        className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl py-4 font-bold border border-transparent hover:border-red-100"
                        onClick={() => {
                            document.cookie = "admin_token=; path=/; max-age=0";
                            window.location.href = "/";
                        }}
                    >
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full lg:min-w-0 pt-24 pb-12 px-6 lg:p-12 overflow-y-auto">
                <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8 lg:mb-16">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Welcome back, Team
                        </h2>
                        <p className="text-gray-500 font-medium mt-2 text-sm lg:text-base">
                            Generate ultra-luxury travel proposals in seconds.
                        </p>
                    </div>

                    <Link href="/admin/new" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto rounded-2xl px-8 h-12 lg:h-14">
                            <Plus className="mr-2" size={20} />
                            New Proposal
                        </Button>
                    </Link>
                </header>

                {children}
            </main>
        </div>
    );
}
