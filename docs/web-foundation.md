# Web Foundation

## Branch
`feature/web-foundation`

## Goal
Build the first real frontend foundation for Wanderlust in `apps/web`.

This phase should establish:
- sticky header
- hero section
- search section
- discovery section
- city card
- city browser grid
- clean routing into city detail pages

## Product direction
Wanderlust is a calm, premium, editorial city discovery product.

It should help users understand a city fast by focusing on:
- what to see
- what to eat
- city essence

It should not become:
- a booking app
- a ratings/reviews platform
- a restaurant directory
- a filter-heavy dashboard
- a map-first product

## Homepage structure
1. Header
2. HeroSection
3. SearchSection
4. DiscoverySection
5. CityBrowser

## Locked hero copy
Title:

The story of a city.  
Distilled.  
Made simple to explore.

Subtext:

What to see, what to eat — just what really matters

## Key components
- `components/layout/Header.tsx`
- `components/home/HeroSection.tsx`
- `components/home/SearchSection.tsx`
- `components/home/DiscoverySection.tsx`
- `components/city/CityCard.tsx`
- `components/city/CityBrowser.tsx`

## Data flow
Use existing monorepo content where possible.

Frontend should consume mapped view models through helper functions, for example:
- `getAllCities()`
- `getCityBySlug(slug)`
- `getHomepageDiscovery()`

## City cards
Requirements:
- rounded corners
- strong image
- country under city name
- hover reveals sentence
- full card clickable
- immersive, not UI-heavy
- no ratings/reviews/prices/badges clutter

## City detail direction
Structure:
- hero image
- essence
- quick facts
- must see
- more places
- food section

### Must see
- clickable feel should be obvious
- add small “Open in Maps” hint or icon
- do not hide interaction

### Food
- no popup cards
- keep restaurant suggestions inline
- text-based and contextual
- editorial, not directory-like

## Styling principles
Keep the experience:
- calm
- premium
- editorial
- simple
- intentional

Use:
- spacious layout
- restrained motion
- elegant typography
- soft surfaces
- strong imagery

Avoid:
- loud gradients
- dashboard density
- marketplace UI patterns
- gimmicky travel visuals

## Definition of done
This branch is complete when:
- homepage renders all main sections cleanly
- city cards are wired from content
- discovery blocks render from content
- card click leads to city detail route
- visual direction feels calm/editorial even before final polish
