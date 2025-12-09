import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimeCard, AnimeCardSkeleton } from "@/components/anime-card";
import type { AnimeResponse, GenreResponse } from "@shared/schema";

export default function Browse() {
  const searchParams = useSearch();
  const [, navigate] = useLocation();

  const params = new URLSearchParams(searchParams);
  const initialGenre = params.get("genre") || "";
  const initialType = params.get("type") || "";
  const initialStatus = params.get("status") || "";
  const initialFilter = params.get("filter") || "";
  const initialPage = parseInt(params.get("page") || "1");

  const [genre, setGenre] = useState(initialGenre);
  const [type, setType] = useState(initialType);
  const [status, setStatus] = useState(initialStatus);
  const [orderBy, setOrderBy] = useState(initialFilter || "popularity");
  const [page, setPage] = useState(initialPage);
  const [showFilters, setShowFilters] = useState(false);

  const { data: genresData, isLoading: genresLoading } = useQuery<GenreResponse>({
    queryKey: ["/api/genres"],
  });

  const queryParams = new URLSearchParams();
  if (genre) queryParams.set("genres", genre);
  if (type) queryParams.set("type", type);
  if (status) queryParams.set("status", status);
  if (orderBy) queryParams.set("order_by", orderBy);
  queryParams.set("page", page.toString());

  const { data: animeData, isLoading: animeLoading } = useQuery<AnimeResponse>({
    queryKey: ["/api/anime/browse", queryParams.toString()],
  });

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (genre) newParams.set("genre", genre);
    if (type) newParams.set("type", type);
    if (status) newParams.set("status", status);
    if (orderBy && orderBy !== "popularity") newParams.set("filter", orderBy);
    if (page > 1) newParams.set("page", page.toString());
    
    const newSearch = newParams.toString();
    if (newSearch !== searchParams) {
      navigate(`/browse${newSearch ? `?${newSearch}` : ""}`, { replace: true });
    }
  }, [genre, type, status, orderBy, page]);

  const handleClearFilters = () => {
    setGenre("");
    setType("");
    setStatus("");
    setOrderBy("popularity");
    setPage(1);
  };

  const hasActiveFilters = genre || type || status || orderBy !== "popularity";

  const types = [
    { value: "", label: "All Types" },
    { value: "tv", label: "TV Series" },
    { value: "movie", label: "Movie" },
    { value: "ova", label: "OVA" },
    { value: "special", label: "Special" },
    { value: "ona", label: "ONA" },
    { value: "music", label: "Music" },
  ];

  const statuses = [
    { value: "", label: "All Status" },
    { value: "airing", label: "Currently Airing" },
    { value: "complete", label: "Finished Airing" },
    { value: "upcoming", label: "Not Yet Aired" },
  ];

  const orderOptions = [
    { value: "popularity", label: "Most Popular" },
    { value: "score", label: "Highest Rated" },
    { value: "start_date", label: "Newest First" },
    { value: "episodes", label: "Most Episodes" },
    { value: "favorites", label: "Most Favorited" },
  ];

  return (
    <div className="min-h-screen py-8" data-testid="page-browse">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    data-testid="button-clear-filters"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Genre</label>
                  <Select value={genre} onValueChange={(v) => { setGenre(v); setPage(1); }}>
                    <SelectTrigger data-testid="select-genre">
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Genres</SelectItem>
                      {genresData?.data?.map((g) => (
                        <SelectItem key={g.mal_id} value={g.mal_id.toString()}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
                    <SelectTrigger data-testid="select-type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={orderBy} onValueChange={(v) => { setOrderBy(v); setPage(1); }}>
                    <SelectTrigger data-testid="select-order">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Browse Anime</h1>
                {animeData?.pagination && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Showing {animeData.data.length} of {animeData.pagination.items.total.toLocaleString()} anime
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genre && genresData?.data && (
                  <Badge variant="secondary" className="gap-1">
                    {genresData.data.find(g => g.mal_id.toString() === genre)?.name}
                    <button onClick={() => setGenre("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {type && (
                  <Badge variant="secondary" className="gap-1">
                    {types.find(t => t.value === type)?.label}
                    <button onClick={() => setType("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {status && (
                  <Badge variant="secondary" className="gap-1">
                    {statuses.find(s => s.value === status)?.label}
                    <button onClick={() => setStatus("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {animeLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            ) : animeData?.data?.length ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {animeData.data.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))}
                </div>

                {animeData.pagination && animeData.pagination.last_visible_page > 1 && (
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
                      {Array.from({ length: Math.min(5, animeData.pagination.last_visible_page) }).map((_, i) => {
                        let pageNum: number;
                        if (animeData.pagination.last_visible_page <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= animeData.pagination.last_visible_page - 2) {
                          pageNum = animeData.pagination.last_visible_page - 4 + i;
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
                      disabled={!animeData.pagination.has_next_page}
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
                <p className="text-lg text-muted-foreground">No anime found matching your filters.</p>
                <Button variant="link" onClick={handleClearFilters} className="mt-2">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
