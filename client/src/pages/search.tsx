import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimeCard, AnimeCardSkeleton } from "@/components/anime-card";
import type { AnimeResponse } from "@shared/schema";

export default function SearchPage() {
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const initialQuery = params.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearchTerm(initialQuery);
    setQuery(initialQuery);
  }, [initialQuery]);

  const { data, isLoading } = useQuery<AnimeResponse>({
    queryKey: ["/api/anime/search", searchTerm, page],
    enabled: searchTerm.length >= 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query);
    setPage(1);
  };

  return (
    <div className="min-h-screen py-8" data-testid="page-search">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
                data-testid="input-search-page"
              />
            </div>
            <Button type="submit" size="lg" data-testid="button-search-submit">
              Search
            </Button>
          </form>
        </div>

        {searchTerm.length < 2 ? (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">Search for Anime</h2>
            <p className="text-muted-foreground">
              Enter at least 2 characters to search
            </p>
          </div>
        ) : isLoading ? (
          <>
            <h2 className="text-lg mb-4">
              Searching for "<span className="font-semibold">{searchTerm}</span>"...
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 18 }).map((_, i) => (
                <AnimeCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : data?.data?.length ? (
          <>
            <h2 className="text-lg mb-4">
              Found {data.pagination?.items?.total || data.data.length} results for "
              <span className="font-semibold">{searchTerm}</span>"
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {data.data.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
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
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
            <p className="text-muted-foreground">
              No anime found for "<span className="font-semibold">{searchTerm}</span>".
              Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
