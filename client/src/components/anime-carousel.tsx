import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimeCard, AnimeCardSkeleton } from "./anime-card";
import type { Anime } from "@shared/schema";
import { Link } from "wouter";

interface AnimeCarouselProps {
  title: string;
  anime: Anime[];
  isLoading?: boolean;
  viewAllLink?: string;
}

export function AnimeCarousel({
  title,
  anime,
  isLoading = false,
  viewAllLink,
}: AnimeCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
          <div className="flex items-center gap-2">
            {viewAllLink && (
              <Link href={viewAllLink}>
                <Button variant="ghost" size="sm" data-testid={`link-view-all-${title.toLowerCase().replace(/\s+/g, "-")}`}>
                  View All
                </Button>
              </Link>
            )}
            <div className="hidden sm:flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                onClick={() => scroll("left")}
                data-testid={`button-scroll-left-${title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => scroll("right")}
                data-testid={`button-scroll-right-${title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="snap-start">
                  <AnimeCardSkeleton />
                </div>
              ))
            : anime.map((item, index) => (
                <div key={`${item.mal_id}-${index}`} className="snap-start">
                  <AnimeCard anime={item} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
