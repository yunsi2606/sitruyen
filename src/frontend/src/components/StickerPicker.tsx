"use client";

import { useState } from "react";
import Image from "next/image";
import { StickerDisplay } from "./StickerDisplay";

interface StickerPickerProps {
    packs: any[];
    onSelect: (sticker: any) => void;
}

export function StickerPicker({ packs, onSelect }: StickerPickerProps) {
    const [selectedPackId, setSelectedPackId] = useState<number | null>(packs.length > 0 ? packs[0].id : null);

    const currentPack = packs.find(p => p.id === selectedPackId);

    // If no packs
    if (!packs || packs.length === 0) {
        return <div className="p-4 text-center text-xs text-muted">No stickers available</div>;
    }

    return (
        <div className="w-[320px] h-[350px] flex flex-col bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header / Tabs */}
            <div className="flex border-b border-white/5 overflow-x-auto scrollbar-hide bg-black/20 p-1 gap-1">
                {packs.map(pack => {
                    // Handle pack icon URL
                    const iconUrl = pack.icon?.url
                        ? (pack.icon.url.startsWith('http')
                            ? pack.icon.url
                            : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${pack.icon.url}`)
                        : null;

                    const isActive = pack.id === selectedPackId;

                    return (
                        <button
                            key={pack.id}
                            onClick={() => setSelectedPackId(pack.id)}
                            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-all ${isActive ? 'bg-white/10 shadow-inner ring-1 ring-white/10' : 'opacity-50 hover:opacity-100 hover:bg-white/5'}`}
                            title={pack.name}
                        >
                            <div className="w-6 h-6 relative grayscale-[50%] hover:grayscale-0 transition-all">
                                {iconUrl ? (
                                    <Image src={iconUrl} alt={pack.name} fill className="object-contain" unoptimized />
                                ) : (
                                    <span className="text-xs font-bold text-white uppercase">{pack.name.substring(0, 2)}</span>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                {currentPack?.stickers && currentPack.stickers.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3">
                        {currentPack.stickers.map((sticker: any) => (
                            <button
                                key={sticker.id}
                                onClick={() => onSelect(sticker)}
                                className="relative aspect-square flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors group"
                            >
                                <div className="transform group-hover:scale-110 active:scale-95 transition-transform will-change-transform">
                                    <StickerDisplay sticker={sticker} size={64} autoplay={false} />
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted text-xs">
                        Empty pack
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-white/5 text-[10px] text-muted text-center bg-black/10 font-medium">
                Select a sticker to send
            </div>
        </div>
    );
}
