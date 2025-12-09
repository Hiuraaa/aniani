import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Genre } from "@shared/schema";

interface GenreListProps {
  genres: Genre[];
  isLoading?: boolean;
  compact?: boolean;
}

const genreColors: Record<string, string> = {
  Action: "bg-red-500/20 text-red-400 border-red-500/30",
  Adventure: "bg-green-500/20 text-green-400 border-green-500/30",
  Comedy: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Drama: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Fantasy: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Horror: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Mystery: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Romance: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Sci-Fi": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Slice of Life": "bg-teal-500/20 text-teal-400 border-teal-500/30",
  Sports: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Supernatural: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Suspense: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export function GenreList({ genres, isLoading = false, compact = false }: GenreListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-md" />
        ))}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Link key={genre.mal_id} href={`/browse?genre=${genre.mal_id}`}>
            <Badge
              variant="outline"
              className={`cursor-pointer hover-elevate ${genreColors[genre.name] || ""}`}
              data-testid={`badge-genre-${genre.mal_id}`}
            >
              {genre.name}
            </Badge>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {genres.map((genre) => (
        <Link key={genre.mal_id} href={`/browse?genre=${genre.mal_id}`}>
          <div
            className={`p-4 rounded-lg border text-center cursor-pointer hover-elevate active-elevate-2 transition-all ${
              genreColors[genre.name] || "bg-card border-card-border"
            }`}
            data-testid={`card-genre-${genre.mal_id}`}
          >
            <span className="font-medium">{genre.name}</span>
            <p className="text-xs text-muted-foreground mt-1">
              {genre.count?.toLocaleString() || 0} anime
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function GenreListSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {Array.from({ length: 18 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>
  );
}
