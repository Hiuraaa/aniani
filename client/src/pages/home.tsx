import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/hero-section";
import { AnimeCarousel } from "@/components/anime-carousel";
import { GenreList } from "@/components/genre-list";
import type { AnimeResponse, GenreResponse } from "@shared/schema";

export default function Home() {
  const { data: trendingData, isLoading: trendingLoading } = useQuery<AnimeResponse>({
    queryKey: ["/api/anime/trending"],
  });

  const { data: popularData, isLoading: popularLoading } = useQuery<AnimeResponse>({
    queryKey: ["/api/anime/popular"],
  });

  const { data: airingData, isLoading: airingLoading } = useQuery<AnimeResponse>({
    queryKey: ["/api/anime/airing"],
  });

  const { data: upcomingData, isLoading: upcomingLoading } = useQuery<AnimeResponse>({
    queryKey: ["/api/anime/upcoming"],
  });

  const { data: topData, isLoading: topLoading } = useQuery<AnimeResponse>({
    queryKey: ["/api/anime/top"],
  });

  const { data: genreData, isLoading: genreLoading } = useQuery<GenreResponse>({
    queryKey: ["/api/genres"],
  });

  return (
    <div className="min-h-screen" data-testid="page-home">
      <HeroSection
        anime={trendingData?.data || []}
        isLoading={trendingLoading}
      />

      <AnimeCarousel
        title="Trending Now"
        anime={trendingData?.data || []}
        isLoading={trendingLoading}
        viewAllLink="/browse?filter=trending"
      />

      <AnimeCarousel
        title="Popular This Season"
        anime={popularData?.data || []}
        isLoading={popularLoading}
        viewAllLink="/browse?filter=popular"
      />

      <AnimeCarousel
        title="Currently Airing"
        anime={airingData?.data || []}
        isLoading={airingLoading}
        viewAllLink="/browse?status=airing"
      />

      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Browse by Genre</h2>
          <GenreList
            genres={genreData?.data?.slice(0, 12) || []}
            isLoading={genreLoading}
            compact
          />
        </div>
      </section>

      <AnimeCarousel
        title="Upcoming Anime"
        anime={upcomingData?.data || []}
        isLoading={upcomingLoading}
        viewAllLink="/browse?status=upcoming"
      />

      <AnimeCarousel
        title="Top Rated Anime"
        anime={topData?.data || []}
        isLoading={topLoading}
        viewAllLink="/top"
      />
    </div>
  );
}
