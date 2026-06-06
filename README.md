# Rwanda Housing Marketplace Platform

Rwanda's most trusted digital housing marketplace — where renters, buyers, landlords, property managers, and commissioners connect directly.

## Vision

Become the default place where people in Rwanda search for housing. Free during growth phase. No hidden contact details. No paywalls.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)
- **Deployment:** Vercel + Supabase Cloud

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A Supabase project (for auth and database — step 2 in development sequence)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO/metadata |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # UI and layout components
│   ├── home/         # Home page sections
│   ├── layout/       # Header, footer
│   ├── listings/     # Listing components
│   └── ui/           # shadcn/ui primitives
├── config/           # Site config and constants
├── lib/              # Utilities, Supabase clients, mock data
├── providers/        # React context providers
└── types/            # Shared TypeScript types
```

## Design System

Inspired by Rwanda's national colors:

| Token | Color | Hex |
|-------|-------|-----|
| Primary | Blue | `#00A1DE` |
| Secondary | Yellow | `#FAD201` |
| Accent | Green | `#20603D` |

Typography: Inter (body), Geist (headings).

## Development Sequence

1. ✅ Project Foundation
2. Database Design
3. Authentication
4. Listing Creation
5. Listing Discovery
6. Search & Filters
7. Favorites
8. Agent Profiles
9. Verification System
10. Notifications
11. Analytics
12. Admin Dashboard
13. SEO
14. Accessibility
15. Performance Optimization
16. Production Deployment

See [AGENT.md](./AGENT.md) for the full product specification.

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Principles

- Mobile first
- Fast on slow networks
- Trust before revenue
- Simplicity over complexity
- Localized for Rwanda
- Listings first
- Frictionless discovery
