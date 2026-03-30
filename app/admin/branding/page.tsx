"use client";

import React, { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { 
    ImageIcon, 
    Save, 
    Instagram, 
    Globe, 
    Phone, 
    CheckCircle2, 
    Type, 
    Palette, 
    Loader2,
    Building2
} from "lucide-react";
import { getBrandSettings, saveBrandSettings } from "@/lib/store";
import { BrandSettings } from "@/lib/types";
import { toast } from "sonner";

export default function BrandingPage() {
    const [settings, setSettings] = useState<BrandSettings>({
        companyName: "YouthCamping",
        logoMode: "contain",
        brandColor: "#FF4D00",
        instagramLink: "",
        websiteLink: "",
        phoneNumber: "",
        footerText: "© 2024 YouthCamping. All rights reserved.",
        updatedAt: new Date().toISOString()
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const CLOUDINARY_CLOUD = "dltxunwku";
    const CLOUDINARY_PRESET = "quotation_upload";
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getBrandSettings();
                if (data) {
                    setSettings(prev => ({ ...prev, ...data }));
                }
            } catch (err) {
                console.error("Failed to load brand settings:", err);
                toast.error("Could not fetch brand data.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Logo must be under 5MB");
            return;
        }

        setIsUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", CLOUDINARY_PRESET);
            
            const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
            if (!res.ok) throw new Error("Upload failed");
            
            const data = await res.json();
            setSettings(prev => ({ ...prev, companyLogo: data.secure_url }));
            toast.success("Logo updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload logo.");
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            await saveBrandSettings({
                ...settings,
                updatedAt: new Date().toISOString()
            });
            toast.success("Branding settings saved globally!");
        } catch (err) {
            console.error("Save failed:", err);
            toast.error("Failed to save branding settings.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Brand Engine...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl space-y-12 pb-20">
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Global Branding</h2>
                <p className="text-gray-500 font-medium">Configure your company identity. These changes reflect across all luxury proposals instantly.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Logo & Visuals */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-4">
                        <Label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Company Logo</Label>
                        <label className="group relative aspect-square rounded-[3rem] border-4 border-dashed border-gray-100 flex items-center justify-center cursor-pointer hover:border-primary/30 transition-all overflow-hidden bg-white shadow-2xl shadow-gray-200/40">
                            {settings.companyLogo ? (
                                <img
                                    src={settings.companyLogo}
                                    className={`w-full h-full p-8 transition-all duration-500 ${
                                        settings.logoMode === 'fill' ? 'object-fill' :
                                        settings.logoMode === 'cover' ? 'object-cover' :
                                        'object-contain'
                                    }`}
                                    alt="Company Logo"
                                />
                            ) : isUploading ? (
                                <div className="text-primary flex flex-col items-center gap-3">
                                    <Loader2 className="w-10 h-10 animate-spin" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Uploading...</span>
                                </div>
                            ) : (
                                <div className="text-gray-300 group-hover:text-primary transition-colors flex flex-col items-center gap-3">
                                    <ImageIcon size={48} strokeWidth={1.5} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload PNG</span>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                            
                            {settings.companyLogo && !isUploading && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Change Logo</span>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Logo Display</Label>
                        <div className="flex flex-col gap-2">
                            {[
                                { id: 'contain', label: 'Contain', desc: 'Maintain ratio (Best for most logos)' },
                                { id: 'cover', label: 'Cover', desc: 'Fill entire area (Might crop)' }
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => setSettings(prev => ({ ...prev, logoMode: mode.id as any }))}
                                    className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all ${
                                        settings.logoMode === mode.id 
                                        ? 'border-primary bg-primary/[0.03] shadow-lg shadow-primary/5' 
                                        : 'border-gray-50 hover:border-gray-200 bg-white'
                                    }`}
                                >
                                    <span className={`text-[11px] font-black uppercase tracking-wider ${settings.logoMode === mode.id ? 'text-primary' : 'text-gray-900'}`}>{mode.label}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">{mode.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Identity & Links */}
                <div className="lg:col-span-8 space-y-8">
                    <GlassCard className="p-8 md:p-12 space-y-10 border-none shadow-2xl shadow-gray-200/50">
                        {/* Company Identity */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Identity</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Company Name</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                                        <Input
                                            className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-bold"
                                            placeholder="YouthCamping"
                                            value={settings.companyName || ''}
                                            onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Brand Main Color</Label>
                                    <div className="relative">
                                        <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                                        <Input
                                            className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-mono"
                                            placeholder="#FF4D00"
                                            value={settings.brandColor || ''}
                                            onChange={(e) => setSettings(prev => ({ ...prev, brandColor: e.target.value }))}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full shadow-inner border border-gray-100" style={{ backgroundColor: settings.brandColor || '#FF4D00' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social & Web */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-l-4 border-gray-200 pl-4">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Connections</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Instagram URL</Label>
                                        <div className="relative">
                                            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                                            <Input
                                                className="pl-12 h-14 rounded-2xl border-gray-100 font-medium"
                                                placeholder="https://instagram.com/youthcamping"
                                                value={settings.instagramLink || ''}
                                                onChange={(e) => setSettings(prev => ({ ...prev, instagramLink: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Website URL</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                                            <Input
                                                className="pl-12 h-14 rounded-2xl border-gray-100 font-medium"
                                                placeholder="https://youthcamping.in"
                                                value={settings.websiteLink || ''}
                                                onChange={(e) => setSettings(prev => ({ ...prev, websiteLink: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contact Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                                            <Input
                                                className="pl-12 h-14 rounded-2xl border-gray-100 font-medium"
                                                placeholder="+91 98765 43210"
                                                value={settings.phoneNumber || ''}
                                                onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Footer Legal Text</Label>
                                        <div className="relative">
                                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                                            <Input
                                                className="pl-12 h-14 rounded-2xl border-gray-100 font-medium"
                                                placeholder="© 2024 YouthCamping"
                                                value={settings.footerText || ''}
                                                onChange={(e) => setSettings(prev => ({ ...prev, footerText: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Action */}
                        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                    Last Sync: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleTimeString() : 'Never'}
                                </p>
                            </div>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || isUploading}
                                className="w-full md:w-auto rounded-2xl px-12 py-7 shadow-2xl shadow-primary/30 transition-all font-black uppercase tracking-widest text-xs"
                            >
                                {isSaving ? (
                                    <React.Fragment><Loader2 className="mr-2 animate-spin" size={18} /> Saving...</React.Fragment>
                                ) : (
                                    <React.Fragment><Save size={18} className="mr-2" /> Update Brand Engine</React.Fragment>
                                )}
                            </Button>
                        </div>
                    </GlassCard>

                    {/* Pro Tip */}
                    <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 flex gap-4 items-start">
                        <CheckCircle2 className="text-primary mt-1 shrink-0" size={20} />
                        <div>
                            <h4 className="font-black text-primary uppercase text-[11px] tracking-widest mb-1">Live Deployment</h4>
                            <p className="text-[11px] text-primary/70 font-bold leading-relaxed">
                                Updating these assets will trigger an immediate cache invalidation across all distributed proposal URLs. Your clients will always see the latest brand representation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
