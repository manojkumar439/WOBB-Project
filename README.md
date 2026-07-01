# Wobb Influencer Search

A modern influencer search application built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Search Influencers**: Browse top creators across Instagram, YouTube, and TikTok
- **Platform Filtering**: Filter influencers by social media platform
- **Search by Name**: Search influencers by username or full name
- **Profile Details**: View detailed profile information including engagement rates, followers, and stats
- **Save to List**: Add influencers to a saved list with persistent storage (Supabase)
- **Responsive Design**: Beautiful UI that works on mobile, tablet, and desktop
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Animations**: Smooth micro-interactions using Framer Motion

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS 4** - Styling
- **Zustand** - State Management
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Supabase** - Database & Persistence

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Variables

The application uses Supabase for data persistence. Environment variables are pre-configured:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Project Structure

```
src/
├── assets/
│   └── data/
│       ├── profiles/      # Profile detail JSON files
│       └── search/        # Search results JSON files
├── components/
│   ├── Layout.tsx         # Main layout with header
│   ├── PlatformFilter.tsx # Platform tabs + search input
│   ├── ProfileCard.tsx    # Profile card component
│   ├── ProfileList.tsx    # Grid of profile cards
│   ├── SavedProfilesPanel.tsx # Slide-out saved list panel
│   └── VerifiedBadge.tsx  # Verified checkmark badge
├── lib/
│   └── supabase.ts        # Supabase client
├── pages/
│   ├── SearchPage.tsx    # Main search/dashboard page
│   └── ProfileDetailPage.tsx # Profile details page
├── store/
│   └── searchStore.ts    # Zustand store for state
├── types/
│   └── index.ts          # TypeScript type definitions
└── utils/
    ├── dataHelpers.ts    # Data loading & filtering
    ├── formatters.ts     # Number formatting utilities
    └── profileLoader.ts  # Dynamic profile loading
```

## Changes Made

### 1. Bug Fixes & Code Quality

- Fixed React 19 compatibility issue by removing incompatible `react-beautiful-dnd`
- Fixed unused imports and variables
- Fixed CSS syntax error in index.css (missing closing brace)
- Removed unused SearchBar component
- Fixed case-sensitive search in filterProfiles function
- Fixed engagement rate calculation display
- Removed orphaned PostCSS config that caused build errors

### 2. State Management

- Replaced React Context with Zustand for state management
- Created `searchStore.ts` with actions for:
  - Platform selection
  - Search query management
  - Adding/removing saved profiles
  - Fetching saved profiles from Supabase

### 3. Add to List Feature

- Implemented complete "Add to List" functionality:
  - Saves profiles to Supabase database
  - Prevents duplicate entries with unique constraint
  - Slide-out panel to view saved profiles
  - Grouped by platform in the saved list
  - Remove profiles from list
  - Persistent storage - survives page refresh
  - Visual feedback when adding profiles

### 4. UI/UX Redesign

- Modern, polished design with gradients and shadows
- Glass morphism effect on header
- Platform-specific color coding:
  - Instagram: Purple-pink-orange gradient
  - YouTube: Red
  - TikTok: Black
- Responsive layout (mobile, tablet, desktop)
- Improved typography with Inter font
- Better visual hierarchy
- Consistent spacing and alignment
- Card-based layout for profiles
- Animated header with logo
- Mobile hamburger menu
- Saved list count badge

### 5. Animations & Micro-interactions

- Page transitions with Framer Motion
- Hover effects on cards and buttons
- Scale animations on icons
- Staggered card animations
- Slide-in panel animation
- Loading spinners
- Platform icon badges on profile pictures

### 6. Performance Optimizations

- Memoized components (`memo`) for:
  - PlatformFilter
  - VerifiedBadge
  - ProfileCard
  - ProfileList
- Lazy loading for profile images
- Proper component structure to minimize re-renders
- Zustand selectors for efficient state updates

## Database Schema

### saved_profiles Table

```sql
CREATE TABLE saved_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  username text NOT NULL,
  fullname text NOT NULL,
  picture text NOT NULL,
  platform text NOT NULL,
  followers bigint NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  url text NOT NULL,
  added_at timestamptz DEFAULT now()
);

-- Unique constraint prevents duplicates
CREATE UNIQUE INDEX saved_profiles_user_platform_idx
  ON saved_profiles(user_id, platform);

-- RLS enabled with anonymous access (single-tenant)
```

## Libraries Added

- `zustand` (v5.0.5) - State management
- `@supabase/supabase-js` (v2.49.4) - Database client
- `framer-motion` (v12.15.0) - Animations
- `lucide-react` (v0.511.0) - Icons

## Libraries Removed

- `react-beautiful-dnd` - Incompatible with React 19

## Trade-offs

1. **No Authentication**: The app uses single-tenant storage (no user accounts). Saved profiles are shared across all users. This simplifies the UX but wouldn't scale for multi-user scenarios.

2. **Client-side Data**: Profile data is loaded from JSON files rather than an API. This keeps the app simple but limits scalability.

3. **Bundle Size**: Framer Motion adds ~40KB gzipped. This is acceptable given the significant UX improvement, but could be optimized further with lighter animation alternatives.

4. **Limited Profile Data**: Only 6 sample profiles have detailed data available. Other profiles show limited information.

## Remaining Improvements

- Add pagination for large profile lists
- Implement actual API integration for live data
- Add user authentication for personal saved lists
- Add export functionality for saved lists
- Add sorting options (followers, engagement rate, etc.)
- Add tests (unit, integration, e2e)
- Implement infinite scroll for search results
- Add profile comparison feature

## Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `npm run dev`    | Start development server |
| `npm run build`  | Production build         |
| `npm run preview | Preview production build |
| `npm run lint`   | Run ESLint               |
