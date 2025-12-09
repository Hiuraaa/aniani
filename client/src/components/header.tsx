import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Sun, Moon, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/lib/theme";
import { useQuery } from "@tanstack/react-query";
import type { Anime, AnimeResponse } from "@shared/schema";

export function Header() {
  const [location, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults, isLoading: isSearching } = useQuery<AnimeResponse>({
    queryKey: ["/api/anime/search", searchQuery],
    enabled: searchQuery.length >= 2,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setIsSearchOpen(false);
    }
  };

  const handleResultClick = (animeId: number) => {
    navigate(`/anime/${animeId}`);
    setShowResults(false);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse" },
    { href: "/top", label: "Top Anime" },
    { href: "/genres", label: "Genres" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home-logo">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                <Play className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
              <span className="text-xl font-bold hidden sm:block">AniStream</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={location === link.href ? "secondary" : "ghost"}
                    size="sm"
                    data-testid={`link-nav-${link.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div ref={searchRef} className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <div className="relative">
                    <Input
                      ref={inputRef}
                      type="search"
                      placeholder="Search anime..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowResults(true);
                      }}
                      onFocus={() => setShowResults(true)}
                      className="w-48 sm:w-64 pr-8"
                      data-testid="input-search"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        setShowResults(false);
                      }}
                      data-testid="button-close-search"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsSearchOpen(true)}
                  data-testid="button-open-search"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}

              {showResults && searchQuery.length >= 2 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-popover-border rounded-lg shadow-xl overflow-hidden">
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Searching...
                    </div>
                  ) : searchResults?.data?.length ? (
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.data.slice(0, 6).map((anime: Anime) => (
                        <button
                          key={anime.mal_id}
                          onClick={() => handleResultClick(anime.mal_id)}
                          className="w-full flex items-center gap-3 p-3 hover-elevate text-left"
                          data-testid={`search-result-${anime.mal_id}`}
                        >
                          <img
                            src={anime.images.jpg.small_image_url || anime.images.jpg.image_url}
                            alt={anime.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{anime.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {anime.type} {anime.episodes ? `• ${anime.episodes} eps` : ""}
                            </p>
                          </div>
                          {anime.score && (
                            <span className="text-sm font-medium text-yellow-500">
                              {anime.score}
                            </span>
                          )}
                        </button>
                      ))}
                      {searchResults.data.length > 6 && (
                        <button
                          onClick={handleSearch}
                          className="w-full p-3 text-center text-primary hover-elevate font-medium"
                          data-testid="button-view-all-results"
                        >
                          View all {searchResults.pagination?.items?.total || searchResults.data.length} results
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={location === link.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`link-mobile-nav-${link.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
