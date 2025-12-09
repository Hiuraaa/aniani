# Design Guidelines: Modern Anime Streaming Website

## Design Approach
**Reference-Based Approach** inspired by Netflix, Crunchyroll, and modern anime streaming platforms. The design emphasizes visual storytelling through rich imagery, immersive browsing experiences, and content-first layouts that showcase anime artwork prominently.

## Core Design Principles
- **Content Supremacy**: Anime posters and artwork dominate the visual hierarchy
- **Immersive Discovery**: Horizontal scrolling carousels and category-based browsing
- **Information Density**: Balance rich metadata with clean presentation
- **Dual Theme Support**: Optimized for both dark and light modes (default to dark)

---

## Typography System

**Primary Font**: Inter or Noto Sans (via Google Fonts CDN) - clean, modern sans-serif
**Japanese Support**: Noto Sans JP for anime titles and Japanese text

**Hierarchy**:
- Hero Titles: text-4xl to text-6xl, font-bold
- Section Headers: text-2xl to text-3xl, font-semibold
- Anime Titles: text-lg to text-xl, font-medium
- Body Text: text-base, font-normal
- Metadata/Labels: text-sm, font-medium (genres, ratings, year)
- Captions: text-xs, uppercase tracking-wide

---

## Layout System

**Spacing Primitives**: Consistently use Tailwind units of **2, 4, 6, 8, 12, 16, 24**
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-24
- Card gaps: gap-4, gap-6

**Container Strategy**:
- Full-width sections with max-w-7xl inner containers
- Content grids: max-w-6xl
- Detail page content: max-w-4xl for readability

**Grid Systems**:
- Anime Cards: grid-cols-2 md:grid-cols-4 lg:grid-cols-6 (poster style)
- Featured Content: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Mobile: Always single column for carousels, 2-col for grids

---

## Component Library

### Navigation
**Top Header** (sticky, backdrop-blur):
- Logo (left), Search bar (center-left), Navigation links (Browse, Top Anime, Genres), Theme toggle, User menu (right)
- Height: h-16, semi-transparent with blur effect
- Search: Expandable input with autocomplete dropdown

### Homepage Components

**1. Hero Section** (h-[70vh] to h-[80vh]):
- Large banner image from trending anime (full-width, gradient overlay bottom)
- Anime title (text-5xl), synopsis (max 2-3 lines), metadata row (rating, year, episodes, genres)
- Primary CTA buttons with backdrop-blur backgrounds: "Watch Now" + "More Info"
- Auto-rotating carousel (4-5 featured anime)

**2. Horizontal Scrolling Carousels** (6-8 sections):
- Section title with "View All" link
- Overflow-x-scroll with smooth scrolling
- Cards: Anime poster (aspect-ratio-[2/3]), hover scale and shadow
- Categories: "Trending Now", "Popular This Season", "Top Rated", "Action", "Romance", "Recently Added"
- Card dimensions: w-48 on desktop, w-32 on mobile

**3. Continue Watching Row** (if applicable):
- Wider cards (16:9 aspect ratio) showing episode thumbnail
- Progress bar overlay at bottom
- "Episode X" badge

### Anime Detail Page

**Hero Banner** (h-[50vh]):
- Wide banner artwork (backdrop), gradient overlay
- Positioned content (left side): Large title, metadata grid (score, rank, year, season, episodes, status)
- Action buttons: "Watch", "Add to List", "Share"

**Content Grid** (2-column on desktop):
- Left column (w-2/3): Synopsis, Characters grid (circular avatars in grid-cols-4), Episodes list (scrollable)
- Right column (w-1/3): Info sidebar (genres as tags, studio, source, duration), Related anime (vertical list)

**Episodes List**:
- Each row: Thumbnail (16:9), Episode number + title, duration, air date
- Hover effect with play icon overlay

### Browse/Filter Page

**Filter Sidebar** (w-64, sticky):
- Genre checkboxes (in scrollable container)
- Year range slider
- Rating filter
- Season/Type dropdowns
- "Apply Filters" button

**Results Grid**:
- grid-cols-2 md:grid-cols-4 lg:grid-cols-5
- Poster cards with title overlay on hover
- Pagination at bottom (numbers + prev/next)

### Search Results
- Instant results dropdown from header search
- Full results page: Mixed layout showing anime, characters (if API supports)
- Anime cards in grid, character cards smaller

### Top Anime List
- Numbered list layout (rank badge on cards)
- Larger cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Shows poster + detailed metadata in card

---

## Interactive Elements

**Cards**:
- Rounded corners: rounded-lg
- Hover: scale-105, shadow-2xl transition
- Poster cards: Add overlay gradient on hover revealing title + quick info

**Buttons**:
- Primary: Larger, rounded-full or rounded-lg
- Secondary: Outlined variant
- Icon buttons: Circular (rounded-full) for actions like favorite, share

**Carousels**:
- Smooth scroll-behavior
- Left/right arrow navigation (absolute positioned)
- Snap scrolling (snap-x snap-mandatory)

**Loading States**:
- Skeleton screens for cards (pulsing placeholders)
- Shimmer effect for image loading

---

## Images Strategy

**Required Images**:
1. **Hero Section**: 5-6 high-quality anime banner images (1920x800px) from trending shows - horizontal compositions with space for text overlay
2. **Anime Posters**: Fetched from API (vertical 2:3 ratio)
3. **Episode Thumbnails**: 16:9 screencaps from API
4. **Character Images**: Circular avatars from API
5. **Placeholder**: Generic anime-style placeholder for failed image loads

**Image Treatment**:
- Lazy loading on all images
- Gradient overlays on hero banners (bottom to top fade)
- Rounded corners on cards: rounded-lg
- Object-fit: cover for all imagery

---

## Animations

**Sparingly Used**:
- Hero carousel transitions (fade/slide every 6-8 seconds)
- Card hover effects (transform scale)
- Page transitions (subtle fade-in)
- Search dropdown slide-down
- NO scroll-triggered animations, NO parallax effects

---

## Icons
**Heroicons** (via CDN): Play, Search, Star (rating), Calendar, Clock, User, Menu, X (close), ChevronLeft/Right (carousel), Heart (favorite), Share

---

## Accessibility
- Focus states visible on all interactive elements (ring-2 ring-offset-2)
- Alt text on all anime images
- ARIA labels on icon-only buttons
- Keyboard navigation for carousels
- High contrast text overlays on images
- Screen reader announcements for dynamic content updates

---

This design creates an immersive, visually-rich anime streaming experience that prioritizes content discovery through imagery while maintaining excellent usability and modern aesthetics.