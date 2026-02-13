"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { GENRES } from "@/lib/data";

export function SidebarFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentGenre = searchParams.get("genre");
    const currentStatus = searchParams.get("status");

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="space-y-8 w-full">
            {/* Status Filter */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold tracking-tight text-foreground border-l-4 border-primary pl-3">
                    Status
                </h3>
                <div className="space-y-2">
                    {['All', 'Ongoing', 'Completed'].map((status) => {
                        const isActive = status === 'All' ? !currentStatus : currentStatus === status;
                        return (
                            <label
                                key={status}
                                className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
                    ${isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-surface text-muted-foreground'}
                 `}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-primary' : 'border-muted'}`}>
                                    {isActive && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                                <input
                                    type="radio"
                                    name="status"
                                    value={status === 'All' ? '' : status}
                                    checked={isActive}
                                    onChange={() => handleFilter('status', status === 'All' ? '' : status)}
                                    className="hidden"
                                />
                                <span className="text-sm">{status}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Genre Filter */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold tracking-tight text-foreground border-l-4 border-secondary pl-3">
                    Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                    {GENRES.map((genre) => {
                        const isActive = currentGenre === genre;
                        return (
                            <button
                                key={genre}
                                onClick={() => handleFilter('genre', isActive ? '' : genre)}
                                className={`
                  text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200
                  ${isActive
                                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                        : 'bg-surface text-muted-foreground border-border hover:border-muted hover:text-foreground'
                                    }
                `}
                            >
                                {genre}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
