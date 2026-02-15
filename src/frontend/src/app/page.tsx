
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, TrendingUp, Grid, List as ListIcon, Clock } from "lucide-react";
import { HeroSlider } from "@/components/HeroSlider";
import { getStrapiMedia } from "@/lib/api";
import { storyService } from "@/services/api";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

// Data types
interface ContentItem {
  id: number;
  title: string;
  slug: string;
  cover?: { url: string };
  view_count?: number;
  updatedAt: string;
  rating?: number;
  categories: { name: string }[];
  chapters?: { chapter_number: number }[];
}

// Data Fetching
async function getHomePageData() {
  try {
    const result = await storyService.getHomepageStories();
    // Log data stats for debugging
    console.log(`HomePage: Hero ${result.heroSlider?.length}, Trending ${result.trending?.length}, Latest ${result.latest?.length}, Popular ${result.popular?.length}`);
    return result as {
      heroSlider: ContentItem[];
      trending: ContentItem[];
      latest: ContentItem[];
      popular: ContentItem[];
    };
  } catch (error) {
    console.error("Failed to fetch homepage data", error);
    return null;
  }
}

export default async function HomePage() {
  const data = await getHomePageData();

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#141414] text-foreground font-sans items-center justify-center">
        <p className="text-muted">Unable to load content. Please check the backend connection.</p>
      </div>
    );
  }

  const { heroSlider, trending, latest, popular } = data;

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-foreground font-sans">
      <main className="flex-1 w-full">

        {/* HERO SECTION */}
        {heroSlider && heroSlider.length > 0 && (
          <HeroSlider items={heroSlider} />
        )}

        {/* TRENDING SECTION */}
        {trending && trending.length > 0 && (
          <section className="w-full max-w-[1280px] mx-auto px-6 section-gap animate-in fade-in transition-all duration-700 delay-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-accent" /> Trending Now
              </h2>
              <div className="flex gap-2">
                <button className="text-muted hover:text-white p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button className="text-muted hover:text-white p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 snap-x-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
              {trending.map((item, i) => (
                <div key={item.id} className="flex-none w-[200px] md:w-[220px] snap-center group relative cursor-pointer">
                  <div className="absolute -top-4 -left-4 w-12 h-12 flex items-center justify-center bg-accent text-white text-2xl font-black rounded-br-2xl rounded-tl-xl shadow-lg z-10 border-4 border-[#141414]">
                    #{i + 1}
                  </div>

                  <Link href={`/manga/${item.slug}`} className="relative block aspect-[3/4] rounded-2xl overflow-hidden bg-surface shadow-md transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                    <Image
                      src={getStrapiMedia(item.cover?.url || null) || "https://placehold.co/400x600"}
                      alt={item.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent p-4 flex flex-col justify-end">
                      <h3 className="text-white font-bold truncate">{item.title}</h3>
                      <p className="text-xs text-muted truncate">{item.view_count || 0} views</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LATEST UPDATES */}
        <section className="w-full max-w-[1280px] mx-auto px-6 section-gap animate-in fade-in transition-all duration-700 delay-200">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white relative pl-4 border-l-4 border-accent">
                Latest Updates
              </h2>
              <span className="hidden sm:inline-block px-3 py-1 bg-surface text-muted text-xs font-mono rounded-full border border-white/5">
                Updated: Just Now
              </span>
            </div>
            <Link href="/browse?sort=updatedAt:desc" className="text-sm font-semibold text-accent hover:text-white transition-colors flex items-center gap-1 group">
              View All <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {latest && latest.map((item) => (
              <div key={item.id} className="group relative flex flex-col gap-3">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface shadow-sm ring-1 ring-white/5 group-hover:ring-accent/50 transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(255,111,97,0.15)] group-hover:-translate-y-1">
                  <Image
                    src={getStrapiMedia(item.cover?.url || null) || "https://placehold.co/300x450"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <Link href={`/manga/${item.slug}`} className="px-4 py-2 bg-accent text-white font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform">
                      Read Now
                    </Link>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base leading-tight line-clamp-1 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Grid className="w-3 h-3" />
                      {/* Chapter info */}
                      Ch. {item.chapters && item.chapters.length > 0 ? item.chapters[item.chapters.length - 1].chapter_number : '?'}
                    </span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2h ago</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.categories && item.categories.slice(0, 2).map((cat, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-surface text-[10px] text-muted rounded border border-white/5">{cat.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* POPULAR SECTION */}
        <section className="w-full bg-[#1A1A1A] py-16 mt-16 border-t border-white/5">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-center gap-4 mb-10">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
              <h2 className="text-2xl font-bold text-white">Popular This Week</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popular && popular.map((item, i) => (
                <div key={item.id} className="flex bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-accent/30 transition-colors group p-4 gap-4">
                  <Link href={`/manga/${item.slug}`} className="w-[100px] h-[140px] relative flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={getStrapiMedia(item.cover?.url || null) || "https://placehold.co/200x280"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors mb-1 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold mb-2">
                      <Star className="w-3 h-3 fill-current" /> 4.9 • <span className="text-muted font-normal">Rank #{i + 1}</span>
                    </div>
                    <p className="text-xs text-muted line-clamp-2 mb-auto">
                      {/* Description */}
                      Read the popular manga {item.title} on SiTruyen. High quality images and fast updates.
                    </p>
                    <Link href={`/manga/${item.slug}`} className="text-xs font-bold text-accent hover:underline mt-2">Start Reading →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
