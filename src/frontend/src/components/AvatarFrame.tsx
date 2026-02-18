import Image from "next/image";
import { getStrapiMedia } from "@/lib/api";

interface AvatarFrameProps {
    src?: string | null; // Avatar URL
    username?: string; // Fallback initial
    frame?: string | null; // Frame Key (e.g. 'gold', 'bronze')
    size?: number; // px size
    className?: string;
}

export function AvatarFrame({ src, username, frame, size = 48, className = "" }: AvatarFrameProps) {
    const avatarUrl = src ? getStrapiMedia(src) : null;

    // Logic to determine frame image
    // Frame key 'default' or null means no frame
    const hasFrame = frame && frame !== "default";
    const frameUrl = hasFrame ? `/frame_${frame}.png` : null;

    // Scale factors to ensure frame overlays correctly
    // Typically frames are ~1.2x to 1.3x larger than the avatar container
    const frameSize = Math.floor(size * 1.4);

    return (
        <div
            className={`relative flex-shrink-0 flex items-center justify-center select-none ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Avatar Circle */}
            <div
                className="rounded-full overflow-hidden bg-surface border border-white/10 flex items-center justify-center relative z-10"
                style={{ width: size, height: size }}
            >
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt={username || "User"}
                        width={size}
                        height={size}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <span
                        className="font-bold text-muted uppercase"
                        style={{ fontSize: Math.max(10, size * 0.45) }}
                    >
                        {username?.[0] || "?"}
                    </span>
                )}
            </div>

            {/* Frame Overlay */}
            {hasFrame && frameUrl && (
                <div
                    className="absolute pointer-events-none z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        width: frameSize,
                        height: frameSize,
                    }}
                >
                    <Image
                        src={frameUrl}
                        alt="Frame"
                        width={frameSize}
                        height={frameSize}
                        className="w-full h-full object-contain"
                        unoptimized
                    />
                </div>
            )}
        </div>
    );
}
