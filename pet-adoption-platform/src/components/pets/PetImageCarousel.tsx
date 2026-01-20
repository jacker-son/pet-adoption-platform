'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PetImageCarouselProps {
    images: { image_url: string; display_order: number }[];
    mainImage?: string | null;
    petName: string;
}

export function PetImageCarousel({ images, mainImage, petName }: PetImageCarouselProps) {
    const allImages = mainImage
        ? [{ image_url: mainImage, display_order: -1 }, ...images]
        : images;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFullscreen, setShowFullscreen] = useState(false);

    if (allImages.length === 0) {
        return (
            <div className="aspect-[4/3] bg-[var(--color-muted)] rounded-2xl flex items-center justify-center">
                <span className="text-8xl">🐾</span>
            </div>
        );
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--color-muted)] group">
                    <Image
                        src={allImages[currentIndex].image_url}
                        alt={`${petName} - 图片 ${currentIndex + 1}`}
                        fill
                        className="object-cover cursor-pointer"
                        onClick={() => setShowFullscreen(true)}
                    />

                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                        {currentIndex + 1} / {allImages.length}
                    </div>
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {allImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex
                                        ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30'
                                        : 'border-transparent hover:border-[var(--color-border)]'
                                    }`}
                            >
                                <Image
                                    src={img.image_url}
                                    alt={`${petName} - 缩略图 ${index + 1}`}
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {showFullscreen && (
                <div
                    className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                    onClick={() => setShowFullscreen(false)}
                >
                    <button
                        onClick={() => setShowFullscreen(false)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <Image
                        src={allImages[currentIndex].image_url}
                        alt={`${petName} - 全屏查看`}
                        fill
                        className="object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
