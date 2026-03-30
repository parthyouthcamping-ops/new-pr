"use client";

import { Quotation } from "@/lib/types";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ImageSlider } from "@/components/ui/ImageSlider";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Users,
    Calendar,
    MapPin,
    CheckCircle2,
    XCircle,
    Star,
    Sparkles,
    Utensils,
    Hotel as HotelIcon,
    Instagram,
    Globe,
    Smartphone,
    Check,
    Loader2,
    Clock,
    Car,
    Camera,
    Compass,
    Plane,
    Ship,
    Bus,
    Train,
    ChevronRight,
    ArrowRight,
    ShieldCheck,
    Coffee,
    Waves,
    Wifi,
    Wind
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HotelCard } from "@/components/ui/HotelCard";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Helper: add N days to a date string, return formatted label like "12 Oct 2026"
function getDayDate(baseDate: string | undefined, dayOffset: number): string {
    if (!baseDate) return '';
    try {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + dayOffset);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return ''; }
}

// Pick an icon for an activity keyword
function ActivityIcon({ label }: { label: string }) {
    const l = label.toLowerCase();
    if (l.includes('transfer') || l.includes('drive') || l.includes('pickup')) return <Car size={14} className="shrink-0 text-primary" />;
    if (l.includes('hotel') || l.includes('check') || l.includes('resort')) return <HotelIcon size={14} className="shrink-0 text-primary" />;
    if (l.includes('meal') || l.includes('dinner') || l.includes('lunch') || l.includes('breakfast')) return <Utensils size={14} className="shrink-0 text-primary" />;
    if (l.includes('photo') || l.includes('view') || l.includes('sunset')) return <Camera size={14} className="shrink-0 text-primary" />;
    if (l.includes('trek') || l.includes('hike') || l.includes('walk') || l.includes('explore')) return <Compass size={14} className="shrink-0 text-primary" />;
    return <Sparkles size={14} className="shrink-0 text-primary" />;
}


// Icon helper for Journey Stops
function StopIcon({ type, icon }: { type: string, icon?: string }) {
    const t = type.toLowerCase();
    const i = icon?.toLowerCase();
    
    if (t === 'arrival' || i === 'plane' || i === 'airport' || i === 'flight') return <Plane size={18} className="text-primary" />;
    if (t === 'departure' || i === 'departure') return <MapPin size={18} className="text-primary" />;
    if (t === 'stay' || i === 'hotel' || i === 'building') return <HotelIcon size={18} className="text-primary" />;
    if (i === 'drive' || i === 'car' || i === 'van') return <Bus size={18} className="text-primary" />;
    if (i === 'boat' || i === 'ship' || i === 'ferry') return <Ship size={18} className="text-primary" />;
    if (i === 'train' || i === 'rail') return <Train size={18} className="text-primary" />;
    
    return <MapPin size={18} className="text-primary" />;
}

interface LuxuryQuotationUIProps {
    q: Quotation;
}

export default function LuxuryQuotationUI({ q }: LuxuryQuotationUIProps) {
    const { brand } = useBrandSettings();
    const [selectedTier, setSelectedTier] = useState<'standard' | 'luxury'>('standard');
    const [expandedDay, setExpandedDay] = useState<number | null>(1);
    const [booking, setBooking] = useState<any>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingForm, setBookingForm] = useState({ 
        name: q.clientName || '', 
        phone: '', 
        email: '',
        travelers: q.pax || 1,
        travelDates: `${q.travelDates?.from || ''} to ${q.travelDates?.to || ''}`,
        specialRequests: ''
    });

    // Live status: booking state takes priority over server-rendered prop (avoids stale data)
    const liveStatus: string = booking?.status || q.bookingStatus || 'sent';
    const isBooked   = liveStatus === 'booked';
    const isReserved = liveStatus === 'reserved';
    const isPending  = liveStatus === 'pending';

    const { scrollYProgress } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    useEffect(() => {
        fetchBooking();
    }, [q.slug]);

    const fetchBooking = async () => {
        try {
            const res = await fetch(`/api/book?slug=${q.slug}`);
            const data = await res.json();
            if (data && !data.error) setBooking(data);
        } catch (err) {
            console.error('Failed to fetch booking status');
        }
    };

    // Sync quotation document's bookingStatus via PATCH so backend + frontend stay consistent
    const syncQuotationStatus = async (newStatus: string) => {
        try {
            await fetch(`/api/quotation/${q.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (err) {
            console.error('Failed to sync quotation status', err);
        }
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || isBooked || isReserved || isPending) return; // prevent duplicate submissions
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tripSlug: q.slug,
                    name: bookingForm.name,
                    phone: bookingForm.phone,
                    email: bookingForm.email,
                    travelers: bookingForm.travelers,
                    travelDates: bookingForm.travelDates,
                    specialRequests: bookingForm.specialRequests,
                })
            });
            const data = await res.json();
            if (res.ok && data.id) {
                // Update local booking state immediately (instant UI sync — no page reload needed)
                setBooking({ ...data, status: 'pending' });
                setIsBookingModalOpen(false);
                // Also patch the quotation document so admin dashboard stays accurate
                await syncQuotationStatus('pending');
                toast.success("Booking request submitted! Redirecting to WhatsApp…");
                
                // WhatsApp redirection with rich pre-filled message
                const bookingRef = data.id || q.slug;
                const waMessage = encodeURIComponent(
                    `Hi ${q.expert?.name || 'Travel Expert'},\n\n` +
                    `I've just submitted a booking request for my trip.\n\n` +
                    `*Trip:* ${q.destination}\n` +
                    `*Name:* ${bookingForm.name}\n` +
                    `*Phone:* ${bookingForm.phone}\n` +
                    `*Email:* ${bookingForm.email}\n` +
                    `*Travelers:* ${bookingForm.travelers}\n` +
                    `*Dates:* ${bookingForm.travelDates}\n` +
                    (bookingForm.specialRequests ? `*Special Requests:* ${bookingForm.specialRequests}\n` : '') +
                    `*Booking Ref:* ${bookingRef}\n\n` +
                    `Looking forward to connecting!`
                );
                const expertPhone = (q.expert?.whatsapp || '').replace(/[^0-9]/g, '');
                if (expertPhone) {
                    setTimeout(() => window.open(`https://wa.me/${expertPhone}?text=${waMessage}`, '_blank'), 1500);
                } else {
                    toast.info("Could not redirect to WhatsApp — no expert number configured.");
                }
            } else {
                toast.error(data.error || "Booking failed. Please try again.");
            }
        } catch (err) {
            toast.error("Booking failed. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Strict button visibility: booked → hide all; pending/reserved → show locked status; else → show CTA
    const renderBookingButton = (className?: string) => {
        if (isBooked) {
            return (
                <div className={`${className} flex items-center gap-2 bg-green-500 text-white rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest cursor-default`}>
                    <CheckCircle2 size={14} />
                    Booking Confirmed
                </div>
            );
        }

        if (isReserved) {
            return (
                <Button 
                    disabled
                    className={`${className} flex items-center gap-2 bg-blue-500 hover:bg-blue-500 cursor-not-allowed opacity-80`}
                >
                    <Check size={14} />
                    Reserved
                </Button>
            );
        }

        if (isPending) {
            return (
                <Button 
                    disabled
                    className={`${className} flex items-center gap-2 bg-yellow-500 hover:bg-yellow-500 cursor-not-allowed opacity-80`}
                >
                    <Loader2 size={14} className="animate-spin" />
                    Booking Requested
                </Button>
            );
        }

        return (
            <Button 
                onClick={() => setIsBookingModalOpen(true)}
                disabled={isSubmitting}
                className={className}
            >
                Confirm Booking
            </Button>
        );
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary/20">
            {/* ── CINEMATIC FLOATING PROGRESS INDICATOR ── */}
            <motion.div 
                className="fixed top-0 left-0 right-0 h-1.5 bg-primary/20 z-[200] origin-left"
                style={{ scaleX: scrollYProgress }}
            />
            <motion.div 
                className="fixed top-0 left-0 right-0 h-1.5 bg-primary z-[201] origin-left shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                style={{ scaleX: scrollYProgress }}
            />
            <div className="pdf-container overflow-x-hidden">
            {/* Global Styles + Glass System */}
            <style jsx global>{`
                /* ── Glass token system ── */
                :root {
                    --glass-light: rgba(255, 255, 255, 0.45);
                    --glass-dark:  rgba(18, 43, 30, 0.55);
                    --glass-white: rgba(255, 255, 255, 0.10);
                    --glass-blur:  blur(24px);
                    --glass-border-light: rgba(255,255,255,0.45);
                    --glass-border-dark:  rgba(255,255,255,0.10);
                    --glass-shadow: 0 8px 32px rgba(31,38,135,0.07);
                    --glass-shine: linear-gradient(120deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%);
                }

                .font-handwritten {
                    font-family: var(--font-caveat), cursive;
                }

                .font-serif {
                    font-family: var(--font-dm-serif), serif;
                }

                /* ── Glass mixins ── */
                .glass-panel {
                    background: var(--glass-light);
                    backdrop-filter: var(--glass-blur);
                    -webkit-backdrop-filter: var(--glass-blur);
                    border: 1px solid var(--glass-border-light);
                    box-shadow: var(--glass-shadow);
                }
                .glass-panel-dark {
                    background: rgba(12, 28, 20, 0.62);
                    backdrop-filter: var(--glass-blur);
                    -webkit-backdrop-filter: var(--glass-blur);
                    border: 1px solid var(--glass-border-dark);
                    box-shadow: 0 8px 40px rgba(0,0,0,0.38);
                }
                .glass-shine::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: var(--glass-shine);
                    border-radius: inherit;
                    pointer-events: none;
                }

                /* ── Subtle grain texture overlay ── */
                .grain-overlay::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
                    pointer-events: none;
                    border-radius: inherit;
                    opacity: 0.5;
                }

                /* ── Print overrides ── */
                @media print {
                    .no-print { display: none !important; }
                    .pdf-container { background: white !important; padding: 0 !important; color: black !important; }
                    .pdf-section { page-break-after: always; padding: 20mm !important; }
                    .itinerary-item { page-break-inside: avoid; margin-bottom: 20px; }
                    header, footer { border: none !important; position: static !important; }
                    .pricing-card { position: static !important; width: 100% !important; border: 2px solid #eee !important; box-shadow: none !important; }
                    img { max-width: 100% !important; }
                    .glass-card, .glass-panel, .glass-panel-dark { background: white !important; border: 1px solid #eee !important; box-shadow: none !important; }
                    .bg-primary { background-color: #f97316 !important; print-color-adjust: exact; }
                    .text-primary { color: #f97316 !important; print-color-adjust: exact; }
                }
            `}</style>

            {/* Status Banner — driven by liveStatus for instant UI sync */}
            {isBooked && (
                <div className="bg-green-500 text-white w-full text-center py-3 px-4 font-black uppercase tracking-[0.2em] text-xs md:text-sm shadow-md z-[200] relative">
                    <CheckCircle2 size={16} className="inline mr-2 -mt-1" />
                    Booking Confirmed — This trip is booked!
                </div>
            )}
            {isReserved && !isBooked && (
                <div className="bg-blue-500 text-white w-full text-center py-3 px-4 font-black uppercase tracking-[0.2em] text-xs md:text-sm shadow-md z-[200] relative">
                    <Check size={16} className="inline mr-2 -mt-1" />
                    Trip Reserved — Awaiting Confirmation
                </div>
            )}
            {isPending && !isBooked && !isReserved && (
                <div className="bg-yellow-500 text-white w-full text-center py-3 px-4 font-black uppercase tracking-[0.2em] text-xs md:text-sm shadow-md z-[200] relative">
                    <Loader2 size={16} className="inline mr-2 -mt-1 animate-spin" />
                    Booking Requested — Our expert will reach out shortly!
                </div>
            )}

            {/* ── NAVBAR — Glass blur ── */}
            <header className="sticky top-0 left-0 right-0 z-[100] h-20 md:h-[90px] flex items-center transition-all duration-300 no-print"
                style={{
                    background: 'rgba(255,255,255,0.82)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.07)'
                }}>
                <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <a href="https://www.youthcamping.in/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                            {brand && brand.companyLogo ? (
                                <img src={brand.companyLogo} className="h-8 md:h-12 w-auto object-contain" alt="Logo" />
                            ) : (
                                <img src="/images/logo-horizontal.png" className="h-[40px] md:h-[60px] w-auto object-contain" alt="YouthCamping Logo" />
                            )}
                        </a>
                        {/* Status pill reads liveStatus — updates immediately after booking */}
                        <div className={`hidden sm:flex px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-sm transition-colors duration-500 ${
                            liveStatus === 'booked'   ? 'bg-green-500'  :
                            liveStatus === 'reserved' ? 'bg-blue-500'   :
                            liveStatus === 'pending'  ? 'bg-yellow-500' :
                            liveStatus === 'cancelled'? 'bg-red-500'    : 'bg-orange-400'
                        }`}>
                            {liveStatus}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {renderBookingButton("rounded-xl font-black uppercase text-[8px] md:text-[10px] tracking-widest shadow-xl shadow-primary/20 h-10 md:h-12 px-4 md:px-8")}
                    </div>
                </div>
            </header>

            {/* ── CINEMATIC HERO ── */}
            <section className="relative h-[85vh] md:h-screen w-full overflow-hidden no-print">
                <ImageSlider 
                    images={[
                        ...(q.heroImage ? [q.heroImage] : []),
                        ...(q.experiencePhotos || []),
                        ...(q.itinerary?.flatMap(d => d.photos || []) || [])
                    ].filter(Boolean).slice(0, 10) as string[]} 
                    className="w-full h-full"
                    interval={6000}
                />
                
                {/* Refined Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-10 pointer-events-none" />

                {/* Hero Content */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4 md:space-y-6 max-w-5xl"
                    >
                        <div className="space-y-1">
                            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white drop-shadow-lg">
                                {q.clientName || 'Guest'}&apos;s
                            </span>
                            <h1 className="text-5xl md:text-[10rem] font-serif tracking-tight leading-[0.9] drop-shadow-2xl uppercase text-white">
                                {q.destination.split(',')[0]}
                            </h1>
                            <p className="text-sm md:text-xl font-medium tracking-[0.2em] uppercase text-white">
                                {q.duration || 'Personalized Luxury Escape'}
                            </p>
                        </div>

                        {/* Duration Capsule */}
                        <div className="pt-12 flex flex-col items-center gap-6">
                            <div className="px-8 py-3 rounded-full border border-white/30 backdrop-blur-md bg-white/10 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
                                {q.duration}
                            </div>
                            <motion.div 
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"
                            >
                                <div className="w-1 h-2 bg-white rounded-full" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── METADATA CHIPS (Avian Style) ── */}
            <div className="flex flex-wrap justify-center gap-4 py-8 bg-[#f5f5f7] no-print border-b border-gray-100">
                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
                    <Clock size={16} className="text-primary" />
                    <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">{q.duration}</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
                    <Calendar size={16} className="text-primary" />
                    <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">
                        {q.travelDates?.from ? new Date(q.travelDates.from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Flexible'}
                    </span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
                    <Users size={16} className="text-primary" />
                    <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">{q.pax} Adults</span>
                </div>
            </div>

            {/* ── PROFESSIONAL INTRODUCTION (Avian Style) ── */}
            <section className="py-16 md:py-24 container mx-auto px-4 md:px-6 pdf-section">
                <div className="flex flex-col items-center text-center mb-16 md:mb-24">
                    <span className="font-handwritten text-4xl md:text-5xl text-primary mb-2 block">We have Curated</span>
                    <h2 className="text-3xl md:text-6xl font-serif text-[#111827] uppercase tracking-tight leading-none brush-underline pb-4">
                        The Best Itinerary For You
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
                    <div className="space-y-6 md:space-y-10">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 md:w-16 h-12 md:h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                                <Sparkles size={28} />
                            </div>
                            <h3 className="text-xl md:text-3xl font-serif text-[#111827] leading-tight">
                                Handpicked Experiences <br/> 
                                <span className="text-[#6B7280] font-sans text-sm md:text-base font-bold tracking-wide">For a journey like never before</span>
                            </h3>
                        </div>
                        <p className="text-base md:text-xl text-[#4A4A4A] leading-relaxed font-normal">
                            We don&apos;t just plan trips — we orchestrate masterpieces. Every detail of your {q.destination} journey has been hand-selected to ensure a seamless blend of cultural immersion and uncompromising luxury.
                        </p>
                    </div>
                    <div className="relative mt-10 lg:mt-0">
                         <img
                             src={q.coverImage || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2070&auto=format&fit=crop&fm=webp'}
                             loading="lazy"
                             decoding="async"
                             className="w-full aspect-[16/10] object-cover rounded-3xl md:rounded-[3rem] shadow-4xl border-4 md:border-8 border-white relative z-10"
                             alt={`${q.destination} cover`}
                         />
                         <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl z-0" />
                    </div>
                </div>
            </section>

            {/* ── STAY & MEALS SUMMARY (Avian Style) ── */}
            <section className="py-12 no-print">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-sm">
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-gray-50 pb-8">
                                {q.journeyMap?.stops?.filter(s => s.type.toLowerCase().includes('stay') || s.type.toLowerCase().includes('city')).map((stop, i, arr) => (
                                    <div key={i} className="flex items-center gap-8 flex-1 min-w-[200px]">
                                        <div className="flex items-center gap-4">
                                            <span className="text-5xl md:text-7xl font-sans font-light text-gray-200">{(stop as any).nights || (i % 2 === 0 ? '2' : '1')}</span>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Night in</span>
                                                <span className="text-lg md:text-xl font-black text-[#111827] uppercase tracking-tight">{stop.name}</span>
                                            </div>
                                        </div>
                                        {i < arr.length - 1 && (
                                            <div className="h-12 w-px bg-gray-200 hidden lg:block ml-auto" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-6 bg-[#f5f5f7] p-6 rounded-2xl group transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-black/5">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                                        <HotelIcon size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-0.5">Accommodation</span>
                                        <span className="text-sm md:text-base font-bold text-[#111827]">1 Rooms at all locations ({selectedTier})</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 bg-[#f5f5f7] p-6 rounded-2xl group transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-black/5">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                                        <Utensils size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-0.5">Meal Plan</span>
                                        <span className="text-sm md:text-base font-bold text-[#111827]">Breakfast & Dinner Summary</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TRAVELLING — Avian Route Map ── */}
            {q.journeyMap && (
                <section className="py-16 md:py-24 bg-[#fafafa] relative overflow-hidden pdf-section border-y border-gray-100">
                    <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                        <div className="flex flex-col items-center mb-16">
                            <span className="font-handwritten text-3xl text-primary mb-2 block">Travelling</span>
                            <h2 className="text-3xl md:text-5xl font-serif text-[#111827] uppercase tracking-tight leading-none brush-underline pb-4">
                                Your Route Map
                            </h2>
                        </div>

                        <div className="relative max-w-5xl mx-auto">
                            {/* Path Line - Centered Dotted */}
                            <div className="absolute top-[2.5rem] left-0 w-full h-0.5 border-t-2 border-dotted border-gray-300 hidden md:block" />

                            <div className="overflow-x-auto pb-8 no-scrollbar -mx-4 px-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
                                <div className="flex md:justify-between items-start gap-12 md:gap-0 relative min-w-max md:min-w-0">
                                    {q.journeyMap?.stops?.map((stop, i) => (
                                        <div key={i} className="relative flex flex-col items-center group min-w-[120px]">
                                            {/* Stop Icon Node - On the line */}
                                            <div className="w-14 h-14 rounded-2xl bg-white shadow-lg border border-gray-200 flex items-center justify-center relative z-20 transition-all duration-500 group-hover:scale-110 group-hover:border-primary group-hover:text-primary">
                                                <StopIcon type={stop.type} icon={stop.icon} />
                                            </div>
                                            
                                            {/* Stop Name & Type Below */}
                                            <div className="mt-4 text-center">
                                                <span className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest block mb-1">
                                                    {stop.type}
                                                </span>
                                                <span className="text-xs md:text-sm font-black text-[#111827] uppercase tracking-tight block">
                                                    {stop.name}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── ITINERARY SECTION (Avian Style) ── */}
            <section className="py-16 md:py-28 bg-[#f9f9f7] pdf-section" id="itinerary">
                <div className="container mx-auto px-4 md:px-6">

                    {/* Section header */}
                    <div className="flex flex-col items-center text-center mb-16 md:mb-24">
                        <span className="font-handwritten text-4xl text-primary mb-2 block">Detailed</span>
                        <h2 className="text-4xl md:text-7xl font-serif text-[#111827] uppercase tracking-tight leading-none brush-underline pb-4">
                            ITINERARY
                        </h2>
                    </div>

                    {/* Day cards — Accordion Style */}
                    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                        {q.itinerary?.map((day, idx) => {
                            const isOpen = expandedDay === day.day;
                            const dayLabel = getDayDate(q.travelDates?.from, idx);
                            
                            return (
                                <motion.div
                                    key={day.id || idx}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                    className={`group relative rounded-[2rem] md:rounded-[3rem] transition-all duration-700 ${
                                        isOpen 
                                        ? 'bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border-primary/20 scale-[1.01]' 
                                        : 'bg-white/40 backdrop-blur-sm hover:bg-white border-transparent hover:shadow-3xl hover:-translate-y-1.5'
                                    } border-2 overflow-hidden`}
                                >
                                    {/* --- CARD HEADER (CLOSED STATE) --- */}
                                    <button
                                        onClick={() => {
                                            setExpandedDay(isOpen ? null : day.day);
                                            if (!isOpen) {
                                                setTimeout(() => {
                                                    document.getElementById(`day-card-${day.day}`)?.scrollIntoView({ 
                                                        behavior: 'smooth', 
                                                        block: 'center' 
                                                    });
                                                }, 300);
                                            }
                                        }}
                                        id={`day-card-${day.day}`}
                                        className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6"
                                    >
                                        <div className="flex items-center gap-6 md:gap-8 flex-1">
                                            {/* Day Badge - Avian Style (Grey Box) */}
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#f5f5f7] rounded-2xl flex flex-col items-center justify-center shrink-0 border border-gray-100 transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                                                <span className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1 text-[#6B7280]">Day</span>
                                                <span className="text-2xl md:text-3xl font-serif leading-none text-[#111827] group-hover:text-white">{day.day < 10 ? `0${day.day}` : day.day}</span>
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    {dayLabel && (
                                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                                            {dayLabel}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className={`text-lg md:text-3xl font-serif tracking-tight transition-colors duration-500 ${
                                                    isOpen ? 'text-[#111827]' : 'text-[#6B7280]'
                                                }`}>
                                                    {day.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${
                                            isOpen ? 'bg-primary border-primary text-white rotate-180' : 'border-gray-200 text-gray-300'
                                        }`}>
                                            <Compass size={20} />
                                        </div>
                                    </button>

                                    {/* --- EXPANDED CONTENT --- */}
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                            >
                                                <div className="p-6 md:p-8 pt-0 space-y-8">
                                                    {/* Image Slider inside the card */}
                                                    <div className="rounded-3xl overflow-hidden shadow-2xl relative aspect-video">
                                                        <ImageSlider 
                                                            images={day.photos || []} 
                                                            className="w-full h-full"
                                                        />
                                                        <div className="absolute top-4 left-4 z-10">
                                                            <div className="bg-black/40 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
                                                                <Camera size={14} className="text-white" />
                                                                <span className="text-white font-black text-[10px] uppercase tracking-widest">
                                                                    View Gallery
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                                        <div className="lg:col-span-2 space-y-6">
                                                            <div className="flex items-center gap-3">
                                                                <Sparkles size={16} className="text-primary" />
                                                                <h4 className="font-black uppercase tracking-[0.2em] text-xs text-[#111827]">Experience Overview</h4>
                                                            </div>
                                                            <p className="text-[#4A4A4A] text-base md:text-lg leading-relaxed font-bold">
                                                                {day.description}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-3">
                                                                <MapPin size={16} className="text-primary" />
                                                                <h4 className="font-black uppercase tracking-[0.2em] text-xs text-[#111827]">What&apos;s Included</h4>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {day.activities?.map((act, i) => (
                                                                    <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl group/chip hover:bg-primary/5 hover:border-primary/20 transition-all duration-300">
                                                                        <ActivityIcon label={act} />
                                                                        <span className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest">{act}</span>
                                                                    </div>
                                                                ))}
                                                                {day.meals && (
                                                                    <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-2.5 rounded-xl">
                                                                        <Utensils size={14} className="text-primary" />
                                                                        <span className="text-[11px] font-black text-primary uppercase tracking-widest">{day.meals}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── STAY / HOTEL OPTIONS SECTION ── */}
            <section className="py-16 md:py-28 bg-white pdf-section" id="hotels">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Section header */}
                    <div className="flex flex-col items-center text-center mb-16 md:mb-20 space-y-8">
                        <div className="space-y-4">
                            <span className="font-handwritten text-4xl text-primary mb-2 block">Premium</span>
                            <h2 className="text-4xl md:text-7xl font-serif text-[#111827] uppercase tracking-tight leading-none brush-underline pb-4">
                                Stay Options
                            </h2>
                        </div>
                        
                        {/* Package Selection Toggles */}
                        <div className="flex bg-[#fcfaf7] p-2 rounded-[1.5rem] shadow-xl shadow-black/5 border border-gray-100 no-print">
                            {['standard', 'luxury'].map((tier) => (
                                <button
                                    key={tier}
                                    onClick={() => setSelectedTier(tier as any)}
                                    className={`px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                                        selectedTier === tier 
                                        ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-105' 
                                        : 'text-[#6B7280] hover:text-[#111827]'
                                    }`}
                                >
                                    {tier === 'standard' ? 'Choice 01' : 'Choice 02'}
                                </button>
                            ))}
                        </div>

                        <p className="text-[#6B7280] font-bold text-xs md:text-sm uppercase tracking-[0.2em]">
                            Handpicked {selectedTier} accommodations for your comfort
                        </p>
                    </div>

                    {/* Hotel Cards Grid / Horizontal Scroll */}
                    <div className="relative">
                        <div className="flex md:grid md:grid-cols-1 lg:grid-cols-2 gap-6 overflow-x-auto md:overflow-visible no-scrollbar pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scroll-snap-x-mandatory">
                            {(selectedTier === 'standard' ? q.lowLevelHotels : q.highLevelHotels)?.map((hotel, idx) => (
                                <div key={hotel.id || idx} className="min-w-[85vw] md:min-w-0 scroll-snap-align-start">
                                    <HotelCard 
                                        hotel={hotel} 
                                        isRecommended={idx === 0} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

             {/* Inclusions & Exclusions */}
             <section className="py-16 md:py-24 container mx-auto px-4 md:px-6 pdf-section">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-6 md:space-y-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="h-px w-6 bg-green-500" />
                                <span className="text-green-600 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">What&apos;s Covered</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-[#111827] uppercase leading-none">Inclusions</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] border border-green-100/50 shadow-xl shadow-green-900/5">
                            {q.includes?.map((inc, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-green-50/50 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={14} className="text-green-600" />
                                    </div>
                                    <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#374151] leading-snug break-words">{inc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6 md:space-y-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="h-px w-6 bg-red-400" />
                                <span className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">What&apos;s Extra</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-[#111827] uppercase leading-none">Exclusions</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] border border-red-100/50 shadow-xl shadow-red-900/5">
                            {q.exclusions?.map((exc, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-red-50/50 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-red-400/10 flex items-center justify-center shrink-0">
                                        <XCircle size={14} className="text-red-500" />
                                    </div>
                                    <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#6B7280] leading-snug break-words">{exc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust & Testimonials Section */}
            <section className="py-20 md:py-28 bg-white pdf-section">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-primary" />
                                    <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Why Choose Us</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-[#111827] uppercase tracking-tighter leading-none">
                                    Trusted by <span className="text-primary">10K+</span> Travelers
                                </h2>
                            </div>
                            <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                                <div className="flex items-center gap-0.5 text-primary">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="currentColor" />)}
                                </div>
                                <div className="h-8 w-px bg-gray-200" />
                                <span className="text-base font-black text-[#111827]">4.8 Average Rating</span>
                            </div>
                            <p className="text-lg text-[#4A4A4A] font-bold leading-relaxed">
                                Join thousands who have experienced the Youthcamping difference. We prioritize your comfort and experiences above all else.
                            </p>
                        </div>
                        <div className="flex-1 grid grid-cols-1 gap-4">
                            {[
                                { name: "Rahul S.", review: "Youthcamping made our Bali trip absolutely seamless. The luxury villas were breathtaking!", rating: 5 },
                                { name: "Priya M.", review: "Best travel coordinators ever. The attention to detail in our Vietnam itinerary was unmatched.", rating: 5 }
                            ].map((testi, i) => (
                                /* ── Glass testimonial card ── */
                                <div key={i} className="p-6 rounded-2xl glass-shine relative"
                                    style={{
                                        background: 'rgba(250, 248, 243, 0.60)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.55)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)'
                                    }}>
                                    <div className="flex items-center gap-0.5 text-primary mb-3">
                                        {[...Array(testi.rating)].map((_, s) => <Star key={s} size={13} fill="currentColor" />)}
                                    </div>
                                    <p className="text-sm md:text-base text-[#374151] font-bold mb-3">&ldquo;{testi.review}&rdquo;</p>
                                    <p className="text-xs font-black text-[#111827] uppercase tracking-widest">{testi.name} — Verified Traveler</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Steps & Payment Policy */}
            <section className="py-20 md:py-28 bg-[#f9f9f7] pdf-section">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                        <div className="space-y-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-primary" />
                                    <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">The Process</span>
                                </div>
                                <h2 className="text-4xl font-serif text-[#111827] uppercase leading-none">3 Easy Steps</h2>
                            </div>
                            <div className="space-y-7">
                                {[
                                    { step: "01", title: "Review Itinerary", desc: "Explore our expert-curated day-wise plan covering the best of the destination." },
                                    { step: "02", title: "Confirm on WhatsApp", desc: "Talk to your dedicated coordinator and finalize your travel dates." },
                                    { step: "03", title: "Pack Your Bags", desc: "Pay the booking amount and receive your confirmation instantly." }
                                ].map((s, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <span className="text-4xl font-black text-primary transition-colors shrink-0">{s.step}</span>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-black text-[#111827] uppercase">{s.title}</h4>
                                            <p className="text-sm text-[#4A4A4A] font-bold">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* ── GLASS PRICE CTA CARD ── */}
                        <div className="rounded-3xl md:rounded-[2.5rem] self-start overflow-hidden relative bg-white border border-gray-100 shadow-2xl shadow-black/5"
                            style={{
                                boxShadow: '0 24px 64px rgba(0,0,0,0.06)'
                            }}>
                            {/* Avian Special Discount Banner */}
                            <div className="bg-[#e7f5e7] py-3 px-6 flex items-center justify-center gap-2 wavy-edge no-print">
                                <Sparkles size={14} className="text-green-600" />
                                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Special Discount Applied</span>
                            </div>
                            
                            <div className="p-8 md:p-12 space-y-7">
                                <div className="space-y-4 border-b pb-8 border-gray-100">
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-sm font-bold text-[#6B7280] uppercase tracking-widest">Total cost /person</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-4xl md:text-6xl font-serif text-[#111827] tracking-tighter">
                                            ₹{(selectedTier === 'standard' ? (q.lowLevelPrice || 0) : (q.highLevelPrice || 0)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1 border-b pb-5 border-gray-100">
                                    <h4 className="text-xl font-black text-primary uppercase leading-tight">Payment Policy</h4>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Transparent pricing, always</p>
                                </div>
                                <div className="space-y-5">
                                    {[
                                        { label: 'Booking Amount', value: '₹10,000 / Person', highlight: true },
                                        { label: 'Confirmation', value: 'Instant', highlight: false },
                                        { label: 'Cancellation', value: 'Full Refund (T&C)', highlight: false },
                                    ].map((row, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm py-1"
                                            style={{ borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.03)' : 'none', paddingBottom: i < 2 ? '1.25rem' : 0 }}>
                                            <span className="font-bold text-[#4A4A4A]">{row.label}</span>
                                            <span className={`font-black uppercase ${row.highlight ? 'text-primary' : 'text-[#111827]'}`}>{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                                {renderBookingButton("w-full bg-primary text-white hover:opacity-90 py-6 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/30")}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Modal */}
            <AnimatePresence>
                {isBookingModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBookingModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] glass-shine"
                            style={{
                                background: 'rgba(252, 250, 247, 0.92)',
                                backdropFilter: 'blur(28px)',
                                WebkitBackdropFilter: 'blur(28px)',
                                border: '1px solid rgba(255,255,255,0.6)',
                                boxShadow: '0 32px 80px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,1)'
                            }}
                        >
                            <div className="p-8 md:p-12 space-y-8">
                                <div className="space-y-2 text-center">
                                    <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] italic">RESERVATION</span>
                                    <h3 className="text-3xl font-black text-[#111827] uppercase">Secure Your Trip</h3>
                                    <p className="text-sm text-[#6B7280] font-bold italic">Enter your details and our expert will reach out.</p>
                                </div>

                                <form onSubmit={handleBook} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] ml-4">Full Name</label>
                                        <input 
                                            required
                                            value={bookingForm.name}
                                            onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all text-[#111827]"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] ml-4">WhatsApp Phone</label>
                                        <input 
                                            required
                                            type="tel"
                                            value={bookingForm.phone}
                                            onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all text-[#111827]"
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] ml-4">Email Address</label>
                                        <input 
                                            required
                                            type="email"
                                            value={bookingForm.email}
                                            onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all text-[#111827]"
                                            placeholder="you@email.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] ml-4">Number of Travelers</label>
                                        <input 
                                            required
                                            type="number"
                                            min="1"
                                            value={bookingForm.travelers}
                                            onChange={e => setBookingForm({...bookingForm, travelers: parseInt(e.target.value) || 1})}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all text-[#111827]"
                                            placeholder="e.g. 2"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] ml-4">Travel Dates</label>
                                        <input 
                                            type="text"
                                            value={bookingForm.travelDates}
                                            onChange={e => setBookingForm({...bookingForm, travelDates: e.target.value})}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all text-[#111827]"
                                            placeholder="e.g. Oct 12 to Oct 20"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] ml-4">Special Requests (Optional)</label>
                                        <textarea 
                                            value={bookingForm.specialRequests}
                                            onChange={e => setBookingForm({...bookingForm, specialRequests: e.target.value})}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all min-h-[100px] text-[#111827]"
                                            placeholder="Any dietary requirements or special occasions?"
                                        />
                                    </div>

                                    <Button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-white py-8 rounded-2xl font-black uppercase tracking-widest h-auto mt-4"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Reservation'}
                                    </Button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── EXPERT SECTION (Avian Style) ── */}
            <section className="mx-4 md:mx-6 mb-16 md:mb-24 rounded-[3.5rem] overflow-hidden relative pdf-section bg-gray-50/50 border border-gray-100 shadow-sm">
                <div className="p-10 md:p-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-center">
                        <div className="lg:col-span-4 flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full p-2 border-2 border-primary/20 bg-white shadow-2xl relative z-10 overflow-hidden">
                                    <img
                                        src={q.expert?.photo || 'https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?q=80&w=2070&auto=format&fit=crop'}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                                        alt={q.expert?.name || 'Expert'}
                                    />
                                </div>
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white px-6 py-2 rounded-full shadow-xl border border-gray-100">
                                    <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest whitespace-nowrap">Your Expert Hand</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left gap-8">
                            <div className="space-y-4">
                                <span className="font-handwritten text-4xl text-primary">Hey, {q.clientName || 'Traveler'}!</span>
                                <h3 className="text-3xl sm:text-5xl md:text-7xl font-serif text-[#111827] leading-[0.9] uppercase">
                                    I am <span className="text-primary italic">{q.expert?.name}</span>,<br /> 
                                    Your personal host.
                                </h3>
                                <p className="text-[#4A4A4A] text-lg md:text-xl font-bold max-w-2xl">
                                    I&apos;ve lived and breathed {q.destination.split(',')[0]} for over 8 years. My goal is to ensure every moment of your journey feels like it was written just for you.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto no-print">
                                <Button
                                    onClick={() => window.open(`https://wa.me/${(q.expert?.whatsapp || '').replace(/[^0-9]/g, '')}`, '_blank')}
                                    className="px-10 py-8 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-primary transition-all flex items-center gap-3 h-auto"
                                >
                                    <Sparkles size={16} /> Chat on WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simplified Footer */}
            <footer className="py-20 border-t text-center space-y-8" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <div className="flex flex-col items-center gap-6">
                    <a href="https://www.youthcamping.in/" target="_blank" rel="noopener noreferrer" className="block">
                        <img 
                            src="/images/logo-vertical.png" 
                            alt="YouthCamping" 
                            className="h-24 md:h-32 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100"
                        />
                    </a>
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#6B7280]">Luxury Travel Reimagined</p>
                </div>
                <div className="flex justify-center gap-10 no-print">
                   <Instagram size={20} className="text-[#6B7280] hover:text-primary transition-colors cursor-pointer" />
                   <Globe size={20} className="text-[#6B7280] hover:text-primary transition-colors cursor-pointer" />
                   <Smartphone size={20} className="text-[#6B7280] hover:text-primary transition-colors cursor-pointer" />
                </div>
                <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest pt-10">
                    &copy; {new Date().getFullYear()} YouthCamping Global Luxury Travel. All Rights Reserved.
                </p>
            </footer>

            {/* ── Sticky Mobile Booking CTA ── */}
            <div className="fixed bottom-0 left-0 right-0 z-[140] md:hidden no-print px-4 pb-4"
                style={{ 
                    background: 'linear-gradient(to top, rgba(255,255,255,0.95) 60%, transparent)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                }}>
                <div className="pt-4">
                    {renderBookingButton("w-full rounded-2xl font-black uppercase text-sm tracking-widest h-14 shadow-2xl shadow-primary/25")}
                </div>
            </div>
        </div>
    </div>
);
}
