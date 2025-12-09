import { Play, Github, Twitter } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                <Play className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
              <span className="text-xl font-bold">AniStream</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for discovering and watching anime. Browse thousands of series from the largest anime database.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Browse</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/browse" className="hover:text-foreground transition-colors" data-testid="link-footer-browse">
                  All Anime
                </Link>
              </li>
              <li>
                <Link href="/top" className="hover:text-foreground transition-colors" data-testid="link-footer-top">
                  Top Anime
                </Link>
              </li>
              <li>
                <Link href="/genres" className="hover:text-foreground transition-colors" data-testid="link-footer-genres">
                  Genres
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/browse?type=tv" className="hover:text-foreground transition-colors">
                  TV Series
                </Link>
              </li>
              <li>
                <Link href="/browse?type=movie" className="hover:text-foreground transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/browse?status=airing" className="hover:text-foreground transition-colors">
                  Currently Airing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Data Source</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Powered by Jikan API - the unofficial MyAnimeList API.
            </p>
            <div className="flex gap-3">
              <a
                href="https://jikan.moe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-jikan"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            AniStream is not affiliated with or endorsed by MyAnimeList. All anime data is provided by the Jikan API.
          </p>
        </div>
      </div>
    </footer>
  );
}
