"use client";

import { useEffect } from "react";
import { trackEvent, EVENTS } from "@/lib/gtag";

interface TrackMangaViewProps {
    mangaId: string;
    mangaTitle: string;
    mangaSlug: string;
}

export function TrackMangaView({ mangaId, mangaTitle, mangaSlug }: TrackMangaViewProps) {
    useEffect(() => {
        trackEvent(EVENTS.VIEW_MANGA, {
            manga_id: mangaId,
            manga_title: mangaTitle,
            manga_slug: mangaSlug
        });
    }, [mangaId, mangaTitle, mangaSlug]);

    return null;
}
