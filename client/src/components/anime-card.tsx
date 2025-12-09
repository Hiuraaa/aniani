import { Link } from "wouter";
import { Star, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Anime } from "@shared/schema";

interface AnimeCardProps {
  anime: Anime;
  rank?: number;
  showRank?: boolean;
}

export function AnimeCard({ anime, rank, showRank = false }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <div
        className="group relative flex-shrink-0 w-36 sm:w-40 md:w-44 cursor-pointer"
        data-testid={`card-anime-${anime.mal_id}`}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
          {showRank && rank && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="default" className="font-bold">
                #{rank}
              </Badge>
            </div>
          )}
          <img
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                  <Play className="w-6 h-6 text-primary-foreground fill-current" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                {anime.genres?.slice(0, 2).map((genre) => (
                  <Badge key={genre.mal_id} variant="secondary" className="text-xs">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {anime.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {anime.score && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {anime.score}
              </span>
            )}
            {anime.type && <span>{anime.type}</span>}
            {anime.episodes && <span>{anime.episodes} eps</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AnimeCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-36 sm:w-40 md:w-44">
      <div className="aspect-[2/3] rounded-lg bg-muted animate-pulse" />
      <div className="mt-2 space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

export function AnimeCardLarge({ anime, rank }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <div
        className="group relative bg-card border border-card-border rounded-lg overflow-hidden cursor-pointer hover-elevate"
        data-testid={`card-anime-large-${anime.mal_id}`}
      >
        <div className="flex gap-4 p-4">
          {rank && (
            <div className="flex-shrink-0 w-12 flex items-center justify-center">
              <span className="text-3xl font-bold text-muted-foreground">
                {rank}
              </span>
            </div>
          )}
          <div className="flex-shrink-0 w-20 sm:w-24">
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0 py-1">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {anime.title}
            </h3>
            {anime.title_english && anime.title_english !== anime.title && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {anime.title_english}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              {anime.score && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-foreground">{anime.score}</span>
                </span>
              )}
              {anime.type && <span>{anime.type}</span>}
              {anime.episodes && <span>{anime.episodes} episodes</span>}
              {anime.status && <span>{anime.status}</span>}
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {anime.genres?.slice(0, 4).map((genre) => (
                <Badge key={genre.mal_id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
            {anime.synopsis && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-3 hidden sm:block">
                {anime.synopsis}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AnimeCardLargeSkeleton() {
  return (
    <div className="bg-card border border-card-border rounded-lg overflow-hidden p-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 flex items-center justify-center">
          <div className="w-8 h-8 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex-shrink-0 w-20 sm:w-24">
          <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 py-1 space-y-3">
          <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            <div className="h-6 w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-12 bg-muted rounded animate-pulse hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
