"use client";

import { useEffect, useState } from "react";
import { getQuotations, saveQuotation, deleteQuotation, generateSlug } from "@/lib/store";
import { Quotation } from "@/lib/types";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
    Eye,
    Share2,
    Trash2,
    Calendar,
    MapPin,
    Users,
    Clock,
    CheckCircle2,
    Edit,
    Link as LinkIcon,
    Check,
    Copy as DuplicateIcon,
    XCircle,
    Phone,
    Mail,
    Filter,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { MessageCircle as WhatsAppIcon } from "lucide-react";

export default function AdminDashboard() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<"proposals" | "bookings">("proposals");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null);
    const { brand } = useBrandSettings();
    const router = useRouter();

    const updateQuotationStatus = async (id: string, newStatus: string) => {
        try {
            await fetch(`/api/quotation/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            toast.success(`Trip status updated to ${newStatus}`);
            const data = await getQuotations();
            setQuotations(data);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        const load = async () => {
            const [qData, bRes] = await Promise.all([
                getQuotations(),
                fetch('/api/book').then(r => r.json())
            ]);
            setQuotations(qData);
            if (!bRes.error) setBookings(bRes);
        };
        load();
    }, []);

    const fetchBookings = async () => {
        const res = await fetch('/api/book');
        const data = await res.json();
        if (!data.error) setBookings(data);
    };

    const updateBookingStatus = async (id: string, status: string) => {
        try {
            await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update_status', id, status })
            });
            toast.success(`Booking marked as ${status}`);
            fetchBookings();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleConfirmDeleteBooking = async () => {
        if (!deleteBookingId) return;
        try {
            await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id: deleteBookingId })
            });
            toast.success("Booking deleted");
            fetchBookings();
        } catch (err) {
            toast.error("Failed to delete booking");
        } finally {
            setDeleteBookingId(null);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleteConfirmId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await deleteQuotation(deleteConfirmId);
            const data = await getQuotations();
            setQuotations(data);
            toast.success("Proposal deleted successfully");
        } catch (error) {
            toast.error("Failed to delete proposal.");
        } finally {
            setDeleteConfirmId(null);
        }
    };

    const handleDuplicate = async (q: Quotation) => {
        const newId = uuidv4();
        const duplicated: Quotation = {
            ...q,
            id: newId,
            clientName: `${q.clientName} (Copy)`,
            slug: generateSlug(q.destination, newId),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await saveQuotation(duplicated);
        toast.success("Proposal duplicated!");
        const data = await getQuotations();
        setQuotations(data);
    };

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopyLink = (slug: string, id: string) => {
        const url = `${window.location.origin}/quote/${slug}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleWhatsAppShare = (q: Quotation) => {
        const customerName = q.clientName || 'Valued Customer';
        const companyName = brand?.companyName || "YouthCamping";
        const quotationLink = `${window.location.origin}/quote/${q.slug}`;
        const expertName = q.expert?.name || "Travel Expert";
        const expertDesignation = q.expert?.designation || `${companyName} Destination Expert`;

        const message = `Hi ${customerName},

Greetings from ${companyName}.

As per our recent conversation, we've prepared a customized quotation for you based on your requirements. You can view the quotation by clicking on the following link: 
${quotationLink}

If you'd like to proceed, simply tap "Book My Trip" below and chat directly with our destination expert.

${expertName}
${expertDesignation}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Tab Navigation & Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50/50 p-2 rounded-2xl w-fit">
                        <button 
                            onClick={() => setActiveTab("proposals")}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'proposals' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Proposals ({quotations.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab("bookings")}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'bookings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Bookings ({bookings.length})
                        </button>
                    </div>

                    {activeTab === 'proposals' && (
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none bg-white border-2 border-gray-100 rounded-xl px-4 pr-10 py-2.5 text-xs font-black uppercase tracking-widest text-gray-600 outline-none focus:border-primary transition-colors cursor-pointer"
                            >
                                <option value="all">Check All Status</option>
                                <option value="pending">Pending</option>
                                <option value="reserved">Reserved</option>
                                <option value="booked">Booked</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    )}
                </div>

                {/* Dashboard Counters (Quick Stats) */}
                <div className="flex items-center gap-4">
                     <div className="flex flex-col items-end">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Bookings</span>
                         <span className="text-xl font-black text-green-500">{quotations.filter(q => q.bookingStatus === 'booked').length}</span>
                     </div>
                     <div className="w-px h-8 bg-gray-200"></div>
                     <div className="flex flex-col items-center">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Reserved Trips</span>
                         <span className="text-xl font-black text-blue-500">{quotations.filter(q => q.bookingStatus === 'reserved').length}</span>
                     </div>
                     <div className="w-px h-8 bg-gray-200"></div>
                     <div className="flex flex-col items-start">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Pending Quotes</span>
                         <span className="text-xl font-black text-orange-400">{quotations.filter(q => !q.bookingStatus || q.bookingStatus === 'pending').length}</span>
                     </div>
                </div>
            </div>

            {activeTab === "proposals" ? (
                quotations.length === 0 ? (
                <GlassCard className="flex flex-col items-center justify-center p-20 text-center gap-6">
                    <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                        <Clock size={48} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">No Proposals Yet</h3>
                        <p className="text-gray-500 font-medium mt-2">Start by creating your first luxury travel proposal.</p>
                    </div>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {quotations.filter(q => statusFilter === 'all' || (q.bookingStatus || 'pending') === statusFilter).map((q, idx) => (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <GlassCard className="group relative overflow-hidden h-full flex flex-col p-8 rounded-[2.5rem] border-2 border-white/40 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                                {/* Status Badges */}
                                <div className="absolute top-8 right-8 z-10 flex flex-col items-end gap-2">
                                    {q.bookingStatus === 'booked' && (
                                        <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm bg-green-500 text-white">
                                            <CheckCircle2 size={12} /> Booked
                                        </span>
                                    )}
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${q.status === 'Published' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {q.status}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-8 pt-4 h-full">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
                                            <MapPin size={12} />
                                            {q.destination}
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight line-clamp-2">
                                            {q.clientName}
                                        </h3>
                                        <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                            <Clock size={12} />
                                            {q.duration}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Guests</p>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                <Users size={14} className="text-primary" />
                                                {q.pax} Person(s)
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Travel Date</p>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                <Calendar size={14} className="text-primary" />
                                                {q.travelDates?.from ? new Date(q.travelDates.from).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "TBD"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 mt-auto">
                                        {/* Main Row */}
                                        <div className="flex gap-2">
                                            <Link href={`/quote/${q.slug}`} className="flex-1">
                                                <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest h-11 rounded-lg border-gray-100 hover:border-primary hover:bg-white border-2">
                                                    <Eye size={16} className="mr-2" /> View
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/edit/${q.id}`} className="flex-1">
                                                <Button className="w-full text-[10px] font-black uppercase tracking-widest h-11 rounded-lg shadow-lg shadow-primary/20">
                                                    <Edit size={16} className="mr-2" /> Edit
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* CRM Status Control */}
                                        <div className="flex items-center gap-2 bg-gray-50/80 p-1.5 rounded-xl border border-gray-100">
                                            <div className={`w-2 h-2 rounded-full shrink-0 ml-2 ${
                                                q.bookingStatus === 'booked' ? 'bg-green-500' :
                                                q.bookingStatus === 'reserved' ? 'bg-blue-500' :
                                                q.bookingStatus === 'cancelled' ? 'bg-red-500' : 'bg-orange-400'
                                            }`} />
                                            <select
                                                value={q.bookingStatus || 'pending'}
                                                onChange={(e) => updateQuotationStatus(q.id, e.target.value)}
                                                className="w-full bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-700 outline-none cursor-pointer py-1"
                                            >
                                                <option value="pending">Pending Status</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="booked">Booked Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        {/* Action Icons Row */}
                                        <div className="grid grid-cols-4 gap-2 items-center bg-gray-50/50 p-2 rounded-2xl">
                                            <Button
                                                variant="ghost"
                                                className={`h-11 rounded-xl text-gray-500 hover:text-primary transition-all flex items-center justify-center gap-1.5 px-0 ${copiedId === q.id ? 'bg-green-50 text-green-600' : 'hover:bg-white shadow-sm hover:shadow'}`}
                                                onClick={() => handleCopyLink(q.slug, q.id)}
                                                title="Copy Link"
                                            >
                                                {copiedId === q.id ? <Check size={14} /> : <LinkIcon size={14} />}
                                                <span className="text-[8px] font-black uppercase tracking-widest hidden sm:inline">Link</span>
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                className="h-11 rounded-xl text-gray-500 hover:text-green-600 hover:bg-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 px-0"
                                                onClick={() => handleWhatsAppShare(q)}
                                                title="Share to WhatsApp"
                                            >
                                                <WhatsAppIcon size={14} />
                                                <span className="text-[8px] font-black uppercase tracking-widest hidden sm:inline">WA</span>
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                className="h-11 rounded-xl text-gray-500 hover:text-blue-500 hover:bg-white shadow-sm hover:shadow transition-all flex items-center justify-center px-0"
                                                onClick={() => handleDuplicate(q)}
                                                title="Duplicate Proposal"
                                            >
                                                <DuplicateIcon size={16} />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                className="h-11 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center px-0"
                                                onClick={(e) => handleDeleteClick(e, q.id)}
                                                title="Delete Proposal"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )
        ) : (
            <div className="flex flex-col gap-8">
                    {bookings.length === 0 ? (
                        <GlassCard className="flex flex-col items-center justify-center p-20 text-center gap-6">
                            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                                <Calendar size={48} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">No Bookings Yet</h3>
                                <p className="text-gray-500 font-medium mt-2">Trip reservations will appear here.</p>
                            </div>
                        </GlassCard>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] border-2 border-white overflow-hidden shadow-xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Customer</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Trip Slug</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {bookings.map((b) => (
                                        <tr key={b.id} className="hover:bg-gray-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <p className="font-bold text-gray-900">{b.customer_name}</p>
                                                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-medium italic">
                                                        <span className="flex items-center gap-1"><Phone size={10} /> {b.phone}</span>
                                                        <span className="flex items-center gap-1"><Mail size={10} /> {b.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-bold text-gray-600 text-sm italic">/{b.trip_slug}</td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${
                                                    b.status === 'booked' ? 'bg-green-500 text-white' : 
                                                    b.status === 'cancelled' ? 'bg-red-400 text-white' : 
                                                    'bg-yellow-500 text-white'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {b.status === 'reserved' && (
                                                        <Button 
                                                            variant="ghost" 
                                                            className="h-10 rounded-xl text-green-600 hover:bg-green-50 hover:text-green-700 shadow-sm"
                                                            onClick={() => updateBookingStatus(b.id, 'booked')}
                                                        >
                                                            <CheckCircle2 size={16} className="mr-2" /> 
                                                            Confirm
                                                        </Button>
                                                    )}
                                                    {b.status !== 'cancelled' && (
                                                        <Button 
                                                            variant="ghost" 
                                                            className="h-10 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 shadow-sm"
                                                            onClick={() => updateBookingStatus(b.id, 'cancelled')}
                                                        >
                                                            <XCircle size={16} className="mr-2" /> 
                                                            Cancel
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        variant="ghost" 
                                                        className="h-10 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                                                        onClick={() => setDeleteBookingId(b.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal (Quotations) */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setDeleteConfirmId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm"
                        >
                            <GlassCard className="p-10 text-center shadow-3xl">
                                <Trash2 size={48} className="text-red-500 mx-auto mb-6" />
                                <h3 className="text-xl font-black text-gray-900 mb-2">Delete Trip?</h3>
                                <p className="text-sm text-gray-500 mb-8">This will permanently remove the proposal.</p>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                                    <Button className="flex-1 bg-red-500 hover:bg-red-600 rounded-xl" onClick={handleConfirmDelete}>Delete</Button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal (Bookings) */}
            <AnimatePresence>
                {deleteBookingId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setDeleteBookingId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm"
                        >
                            <GlassCard className="p-10 text-center shadow-3xl">
                                <Trash2 size={48} className="text-red-500 mx-auto mb-6" />
                                <h3 className="text-xl font-black text-gray-900 mb-2">Delete Booking?</h3>
                                <p className="text-sm text-gray-500 mb-8">This will permanently remove the booking record.</p>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteBookingId(null)}>Cancel</Button>
                                    <Button className="flex-1 bg-red-500 hover:bg-red-600 rounded-xl" onClick={handleConfirmDeleteBooking}>Delete</Button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
