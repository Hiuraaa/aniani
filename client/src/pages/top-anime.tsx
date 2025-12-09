import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeCardLarge, AnimeCardLargeSkeleton } from "@/components/anime-card";
import type { AnimeResponse } from "@shared/schema";

export default function TopAnime() {
  const [filter, setFilter] = useState<string>("bypopularity");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<AnimeResponse>({
    queryKey: ["/api/anime/top", filter, page],
  });

  const filters = [
    { value: "bypopularity", label: "Popular" },
    { value: "airing", label: "Airing" },
    { value: "upcoming", label: "Upcoming" },
    { value: "tv", label: "TV Series" },
    { value: "movie", label: "Movies" },
    { value: "ova", label: "OVA" },
    { value: "special", label: "Special" },
  ];

  return (
    <div className="min-h-screen py-8" data-testid="page-top-anime">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Top Anime</h1>
            <p className="text-muted-foreground">The highest rated anime of all time</p>
          </div>
        </div>

        <Tabs value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }} className="mb-6">
          <TabsList className="flex-wrap h-auto gap-1">
            {filters.map((f) => (
              <TabsTrigger
                key={f.value}
                value={f.value}
                data-testid={`tab-filter-${f.value}`}
              >
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <AnimeCardLargeSkeleton key={i} />
            ))}
          </div>
        ) : data?.data?.length ? (
          <>
            <div className="space-y-4">
              {data.data.map((anime, index) => (
                <AnimeCardLarge
                  key={anime.mal_id}
                  anime={anime}
                  rank={(page - 1) * 25 + index + 1}
                />
              ))}
            </div>

            {data.pagination && data.pagination.last_visible_page > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, data.pagination.last_visible_page) }).map((_, i) => {
                    let pageNum: number;
                    if (data.pagination.last_visible_page <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= data.pagination.last_visible_page - 2) {
                      pageNum = data.pagination.last_visible_page - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => setPage(pageNum)}
                        data-testid={`button-page-${pageNum}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={!data.pagination.has_next_page}
                  onClick={() => setPage(p => p + 1)}
                  data-testid="button-next-page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No anime found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
