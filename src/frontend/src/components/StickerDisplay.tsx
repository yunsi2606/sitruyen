"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

interface StickerDisplayProps {
    sticker: {
        id: number;
        name: string;
        file: {
            url: string;
            mime: string;
            width: number;
            height: number;
        };
        duration?: number;
    };
    size?: number;
    autoplay?: boolean;
}

export function StickerDisplay({ sticker, size = 120, autoplay = false }: StickerDisplayProps) {
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [animationData, setAnimationData] = useState<any>(null);
    const lottieRef = useRef<LottieRefCurrentProps | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const fileUrl = sticker.file?.url ? (sticker.file.url.startsWith('http') ? sticker.file.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${sticker.file.url}`) : null;
    const isLottie = sticker.file?.mime?.includes("json") || fileUrl?.endsWith(".json");

    // Fetch Lottie JSON if needed
    useEffect(() => {
        if (isLottie && fileUrl && !animationData) {
            fetch(fileUrl)
                .then(res => res.json())
                .then(data => setAnimationData(data))
                .catch(err => console.error("Failed to load generic sticker json", err));
        }
    }, [isLottie, fileUrl, animationData]);

    // Observer for lazy playing
    useEffect(() => {
        if (!containerRef.current || !isLottie) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const currentLottie = lottieRef.current;
                    if (entry.isIntersecting) {
                        // Play once then stop
                        if (currentLottie) {
                            currentLottie.goToAndPlay(0, true);
                        }
                    } else {
                        if (currentLottie) {
                            currentLottie.stop();
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [isLottie, animationData]);

    if (!fileUrl) return null;

    if (isLottie && animationData) {
        return (
            <div
                ref={containerRef}
                style={{ width: size, height: size }}
                className="cursor-pointer"
                onClick={() => {
                    if (lottieRef.current) {
                        lottieRef.current.goToAndPlay(0, true);
                    }
                }}
            >
                <Lottie
                    lottieRef={lottieRef}
                    animationData={animationData}
                    loop={false}
                    autoplay={false}
                    style={{ width: '100%', height: '100%' }}
                    className="will-change-transform" // User requested explicit CSS
                />
            </div>
        );
    }

    // Fallback for WebP/Images
    return (
        <div ref={containerRef} className="relative transition-transform active:scale-95" style={{ width: size, height: size }}>
            <Image
                src={fileUrl}
                alt={sticker.name || "Sticker"}
                fill
                className="object-contain will-change-transform"
                unoptimized={fileUrl.endsWith('.gif')}
            />
        </div>
    );
}
