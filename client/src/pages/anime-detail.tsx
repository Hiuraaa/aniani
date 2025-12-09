import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Calendar, Film, Clock, Users, Heart, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { AnimeDetailResponse, CharacterResponse, EpisodeResponse } from "@shared/schema";

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: animeData, isLoading: animeLoading } = useQuery<AnimeDetailResponse>({
    queryKey: ["/api/anime", id],
  });

  const { data: charactersData, isLoading: charactersLoading } = useQuery<CharacterResponse>({
    queryKey: ["/api/anime", id, "characters"],
  });

  const { data: episodesData, isLoading: episodesLoading } = useQuery<EpisodeResponse>({
    queryKey: ["/api/anime", id, "episodes"],
  });

  if (animeLoading) {
    return <AnimeDetailSkeleton />;
  }

  const anime = animeData?.data;

  if (!anime) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Anime not found</h1>
        <p className="text-muted-foreground">The anime you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const bannerImage = anime.images.jpg.large_image_url || anime.images.jpg.image_url;

  return (
    <div className="min-h-screen" data-testid="page-anime-detail">
      <div className="relative h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative h-full container mx-auto px-4 flex items-end pb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 w-40 md:w-52 -mb-24 relative z-10">
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border-4 border-background">
                <img
                  src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 space-y-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {anime.score && (
                  <Badge variant="default" className="gap-1 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {anime.score} / 10
                  </Badge>
                )}
                {anime.rank && (
                  <Badge variant="secondary">Ranked #{anime.rank}</Badge>
                )}
                {anime.popularity && (
                  <Badge variant="secondary">Popularity #{anime.popularity}</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                {anime.title}
              </h1>

              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-lg text-muted-foreground">{anime.title_english}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {anime.type && (
                  <span className="flex items-center gap-1">
                    <Film className="w-4 h-4" />
                    {anime.type}
                  </span>
                )}
                {anime.episodes && (
                  <span className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {anime.episodes} Episodes
                  </span>
                )}
                {anime.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {anime.duration}
                  </span>
                )}
                {anime.year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {anime.season ? `${anime.season} ${anime.year}` : anime.year}
                  </span>
                )}
                {anime.members && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {anime.members.toLocaleString()} members
                  </span>
                )}
                {anime.favorites && (
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {anime.favorites.toLocaleString()} favorites
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {anime.trailer?.youtube_id && (
                  <a
                    href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="gap-2" data-testid="button-watch-trailer">
                      <Play className="w-5 h-5 fill-current" />
                      Watch Trailer
                    </Button>
                  </a>
                )}
                <a href={anime.url} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="gap-2" data-testid="button-view-mal">
                    <ExternalLink className="w-5 h-5" />
                    View on MAL
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-28 md:pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="characters" data-testid="tab-characters">Characters</TabsTrigger>
                {anime.episodes && anime.episodes > 0 && (
                  <TabsTrigger value="episodes" data-testid="tab-episodes">Episodes</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {anime.synopsis || "No synopsis available."}
                  </p>
                </div>

                {anime.background && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Background</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {anime.background}
                    </p>
                  </div>
                )}

                {anime.trailer?.embed_url && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Trailer</h2>
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <iframe
                        src={anime.trailer.embed_url.replace("autoplay=1", "autoplay=0")}
                        title={`${anime.title} Trailer`}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="characters" className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Characters & Voice Actors</h2>
                {charactersLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                  </div>
                ) : charactersData?.data?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {charactersData.data.slice(0, 12).map((item) => (
                      <Card key={item.character.mal_id} className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-16 h-16">
                            <AvatarImage
                              src={item.character.images.jpg.image_url}
                              alt={item.character.name}
                            />
                            <AvatarFallback>
                              {item.character.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.character.name}</p>
                            <p className="text-sm text-muted-foreground">{item.role}</p>
                          </div>
                          {item.voice_actors?.[0] && (
                            <div className="text-right">
                              <p className="text-sm truncate">{item.voice_actors[0].person.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.voice_actors[0].language}
                              </p>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No character information available.</p>
                )}
              </TabsContent>

              {anime.episodes && anime.episodes > 0 && (
                <TabsContent value="episodes" className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Episodes</h2>
                  {episodesLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 rounded-lg" />
                      ))}
                    </div>
                  ) : episodesData?.data?.length ? (
                    <div className="space-y-2">
                      {episodesData.data.map((episode) => (
                        <Card key={episode.mal_id} className="p-4 hover-elevate">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="font-bold text-primary">
                                {episode.mal_id}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {episode.title || `Episode ${episode.mal_id}`}
                              </p>
                              {episode.aired && (
                                <p className="text-sm text-muted-foreground">
                                  Aired: {new Date(episode.aired).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {episode.score && (
                              <Badge variant="secondary" className="gap-1">
                                <Star className="w-3 h-3 fill-current text-yellow-500" />
                                {episode.score}
                              </Badge>
                            )}
                            {episode.filler && (
                              <Badge variant="outline">Filler</Badge>
                            )}
                            {episode.recap && (
                              <Badge variant="outline">Recap</Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No episode information available.</p>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Information</h2>
              <dl className="space-y-3 text-sm">
                {anime.type && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="font-medium">{anime.type}</dd>
                  </div>
                )}
                {anime.episodes && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Episodes</dt>
                    <dd className="font-medium">{anime.episodes}</dd>
                  </div>
                )}
                {anime.status && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="font-medium">{anime.status}</dd>
                  </div>
                )}
                {anime.aired?.string && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Aired</dt>
                    <dd className="font-medium text-right max-w-[60%]">{anime.aired.string}</dd>
                  </div>
                )}
                {anime.duration && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd className="font-medium">{anime.duration}</dd>
                  </div>
                )}
                {anime.rating && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Rating</dt>
                    <dd className="font-medium">{anime.rating}</dd>
                  </div>
                )}
                {anime.source && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Source</dt>
                    <dd className="font-medium">{anime.source}</dd>
                  </div>
                )}
              </dl>
            </Card>

            {anime.studios?.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-3">Studios</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.map((studio) => (
                    <Badge key={studio.mal_id} variant="secondary">
                      {studio.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {anime.genres?.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-3">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <Badge key={genre.mal_id} variant="outline">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {anime.themes?.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-3">Themes</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.themes.map((theme) => (
                    <Badge key={theme.mal_id} variant="outline">
                      {theme.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {anime.demographics?.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-3">Demographics</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.demographics.map((demo) => (
                    <Badge key={demo.mal_id} variant="outline">
                      {demo.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimeDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="relative h-[50vh] min-h-[400px] bg-muted">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative h-full container mx-auto px-4 flex items-end pb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Skeleton className="w-40 md:w-52 aspect-[2/3] rounded-lg" />
            <div className="flex-1 space-y-4 pb-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-12 w-96 max-w-full" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-10 w-80" />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 pt-28 md:pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-48" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
