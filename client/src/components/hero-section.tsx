import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Play, Info, ChevronLeft, ChevronRight, Star, Calendar, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Anime } from "@shared/schema";

interface HeroSectionProps {
  anime: Anime[];
  isLoading?: boolean;
}

export function HeroSection({ anime, isLoading = false }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featuredAnime = anime.slice(0, 5);

  useEffect(() => {
    if (!isAutoPlaying || featuredAnime.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredAnime.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    goToSlide(currentIndex === 0 ? featuredAnime.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide((currentIndex + 1) % featuredAnime.length);
  };

  if (isLoading) {
    return (
      <section className="relative h-[70vh] min-h-[500px] bg-muted">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted to-muted/50" />
        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
          <div className="h-12 w-96 max-w-full bg-background/20 rounded animate-pulse" />
          <div className="h-6 w-64 bg-background/20 rounded animate-pulse" />
          <div className="h-20 w-[600px] max-w-full bg-background/20 rounded animate-pulse" />
        </div>
      </section>
    );
  }

  if (featuredAnime.length === 0) {
    return null;
  }

  const current = featuredAnime[currentIndex];
  const bannerImage = current.images.jpg.large_image_url || current.images.jpg.image_url;

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden" data-testid="hero-section">
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative h-full container mx-auto px-4 flex items-end pb-16">
        <div className="max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {current.score && (
              <Badge variant="default" className="gap-1">
                <Star className="w-3 h-3 fill-current" />
                {current.score}
              </Badge>
            )}
            {current.year && (
              <Badge variant="secondary" className="gap-1">
                <Calendar className="w-3 h-3" />
                {current.year}
              </Badge>
            )}
            {current.type && (
              <Badge variant="secondary" className="gap-1">
                <Film className="w-3 h-3" />
                {current.type}
              </Badge>
            )}
            {current.episodes && (
              <Badge variant="secondary">{current.episodes} Episodes</Badge>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            {current.title}
          </h1>

          {current.title_english && current.title_english !== current.title && (
            <p className="text-lg text-muted-foreground">{current.title_english}</p>
          )}

          <p className="text-base sm:text-lg text-muted-foreground line-clamp-3 leading-relaxed">
            {current.synopsis}
          </p>

          <div className="flex flex-wrap gap-2">
            {current.genres?.slice(0, 4).map((genre) => (
              <Badge key={genre.mal_id} variant="outline">
                {genre.name}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={`/anime/${current.mal_id}`}>
              <Button size="lg" className="gap-2" data-testid="button-hero-watch">
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </Button>
            </Link>
            <Link href={`/anime/${current.mal_id}`}>
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-hero-info">
                <Info className="w-5 h-5" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
        <Button
          size="icon"
          variant="outline"
          className="bg-background/50 backdrop-blur-sm"
          onClick={goToPrevious}
          data-testid="button-hero-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="bg-background/50 backdrop-blur-sm"
          onClick={goToNext}
          data-testid="button-hero-next"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredAnime.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "bg-foreground/30 hover:bg-foreground/50"
            }`}
            data-testid={`button-hero-dot-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
