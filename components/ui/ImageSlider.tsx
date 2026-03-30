"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
    images: string[];
    className?: string;
    autoplay?: boolean;
    interval?: number;
}

export const ImageSlider = ({
    images = [],
    className,
    autoplay = true,
    interval = 5000,
}: ImageSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Minimum swipe distance in px
    const minSwipeDistance = 50;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Autoplay logic
    useEffect(() => {
        if (autoplay && images.length > 1) {
            timerRef.current = setInterval(nextSlide, interval);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [autoplay, nextSlide, interval, images.length]);

    // Touch handlers for swipe
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();
    };

    if (!images || images.length === 0) {
        return (
            <div className={cn("w-full bg-gray-100 flex items-center justify-center rounded-2xl min-h-[300px]", className)}>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Photos Available</span>
            </div>
        );
    }

    return (
        <div 
            className={cn("relative w-full overflow-hidden group select-none", className)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Slider Track */}
            <div 
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((img, idx) => (
                    <div key={idx} className="w-full flex-shrink-0 h-full">
                        <img
                            src={img}
                            alt={`Slide ${idx + 1}`}
                            loading={idx === 0 ? "eager" : "lazy"}
                            decoding="async"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Desktop Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-black/40"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-black/40"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={cn(
                                "h-1.5 transition-all duration-300 rounded-full",
                                currentIndex === idx ? "w-8 bg-white" : "w-1.5 bg-white/40"
                            )}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
