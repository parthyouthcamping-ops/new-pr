"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
    images: string[];
    className?: string;
    autoplay?: boolean;
    interval?: number;
}

export const ImageSlider = ({
    images,
    className,
    autoplay = true,
    interval = 4000,
}: ImageSliderProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        dragFree: false,
        duration: 30, // smooth easing
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
    const isHovered = useRef(false);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo  = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on("select", onSelect);
        onSelect();
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi, onSelect]);

    // Autoplay
    useEffect(() => {
        if (!autoplay || !emblaApi || images?.length <= 1) return;
        const start = () => {
            autoplayTimer.current = setInterval(() => {
                if (!isHovered.current) emblaApi.scrollNext();
            }, interval);
        };
        start();
        return () => { if (autoplayTimer.current) clearInterval(autoplayTimer.current); };
    }, [autoplay, emblaApi, interval, images]);

    if (!images?.length) {
        return (
            <div className={cn("relative overflow-hidden bg-gray-100 flex items-center justify-center aspect-[4/3]", className)}>
                <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">No Photos</span>
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <div className={cn("relative overflow-hidden", className)}>
                <img
                    src={images[0]}
                    alt="Destination"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover aspect-[4/3]"
                />
            </div>
        );
    }

    return (
        <div
            className={cn("relative group overflow-hidden", className)}
            onMouseEnter={() => { isHovered.current = true; }}
            onMouseLeave={() => { isHovered.current = false; }}
        >
            {/* Slides */}
            <div className="overflow-hidden h-full" ref={emblaRef}>
                <div className="flex h-full touch-pan-y">
                    {images.map((img, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                            <img
                                src={img}
                                alt={`Photo ${index + 1}`}
                                loading={index === 0 ? "eager" : "lazy"}
                                decoding="async"
                                className="w-full h-full object-cover aspect-[4/3]"
                                style={{ imageRendering: "auto" }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Prev / Next arrows — visible on hover */}
            <button
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-110 z-10"
                onClick={scrollPrev}
            >
                <ChevronLeft size={18} />
            </button>
            <button
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-110 z-10"
                onClick={scrollNext}
            >
                <ChevronRight size={18} />
            </button>

            {/* Pagination dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {scrollSnaps.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => scrollTo(i)}
                        className={cn(
                            "rounded-full transition-all duration-300",
                            i === selectedIndex
                                ? "w-6 h-1.5 bg-white"
                                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                        )}
                    />
                ))}
            </div>

            {/* Progress bar at top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-10">
                <div
                    className="h-full bg-white/60 transition-all duration-300"
                    style={{ width: `${((selectedIndex + 1) / scrollSnaps.length) * 100}%` }}
                />
            </div>
        </div>
    );
};
