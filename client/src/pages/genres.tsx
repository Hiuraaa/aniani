import { useQuery } from "@tanstack/react-query";
import { Tag } from "lucide-react";
import { GenreList, GenreListSkeleton } from "@/components/genre-list";
import type { GenreResponse } from "@shared/schema";

export default function Genres() {
  const { data, isLoading } = useQuery<GenreResponse>({
    queryKey: ["/api/genres"],
  });

  return (
    <div className="min-h-screen py-8" data-testid="page-genres">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Anime Genres</h1>
            <p className="text-muted-foreground">Browse anime by genre</p>
          </div>
        </div>

        {isLoading ? (
          <GenreListSkeleton />
        ) : data?.data?.length ? (
          <GenreList genres={data.data} />
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No genres available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
