# MindEase 2.0 — PRD (HackMatrix Edition)

## Product Vision
A daily mental wellness ecosystem for students and young professionals. Not a therapy app — a **daily destination** that adds value every day through AI guidance, personalized activities, habit building, and self-awareness.

## Target Audience
- **Primary:** College students (18-26)
- **Secondary:** Young professionals, remote workers, competitive exam aspirants

## Design Philosophy
- **Vibe:** Playful, calming, premium, modern, emotionally warm
- **Style:** Modern-Tactile — Linear's structure + Headspace's warmth
- **Key Elements:** Glassmorphism, 20px border radius, soft shadows, generous whitespace

## Brand Colors (from DESIGN.md)
| Token | Hex | Usage |
|-------|-----|-------|
| primary | #006491 | Actions, focus states, progress |
| primary-container | #5DADE2 | Cards, highlights |
| secondary | #006D3D | Success, growth, completed tasks |
| secondary-container | #7EFB AE | Success backgrounds |
| tertiary | #705D00 | Accent, "aha" moments |
| tertiary-container | #C3A304 | Warning highlights |
| error | #BA1A1A | Destructive actions |
| surface | #F8FAFC | Page background |
| on-surface | #0D1C2E | Primary text |

## Typography
- **Headings:** Poppins (Semi-Bold 600)
- **Body/UI:** Inter (Regular 400, Medium 500)
- **Fluid scaling:** clamp() for responsive text

## Tech Stack
| Layer | Technology |
|-------|------------|
| Build | Vite 7 |
| Frontend | React 19 |
| Styling | Tailwind CSS + design tokens |
| 3D | React Three Fiber + drei |
| Animation | Framer Motion + GSAP (scroll) |
| Auth | Supabase Auth (Google OAuth + email/password) |
| Database | SQLite (local) via Prisma |
| AI | Mock responses (OpenAI-ready) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |

## User Roles
1. **Guest** — Can view landing page, pricing
2. **User** — Authenticated, full access to all modules
3. **Admin** — (Future) Content management, user analytics

## Core Pages & Modules

### Public Routes
| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Hero, features, CTA, pricing |
| `/login` | Login | Email/password + Google OAuth |
| `/signup` | Sign Up | Registration form |
| `/pricing` | Pricing | Free vs Premium plans |

### Authenticated Routes (`/app/*`)
| Route | Page | Description |
|-------|------|-------------|
| `/app/dashboard` | Dashboard | Greeting, mood check, quick actions, streak |
| `/app/mood` | Mood Tracking | Daily check-in, weekly chart, history |
| `/app/activities` | Activities Hub | Breathing, meditation, focus, stretch, grounding |
| `/app/journal` | Journal | AI-assisted writing, emotion detection, prompts |
| `/app/companion` | AI Companion | Conversational interface, memory, suggestions |
| `/app/music` | Music Space | Lo-fi, nature sounds, focus playlists |
| `/app/insights` | Insights | Mood graph, correlations, weekly summary |
| `/app/garden` | Habit Garden | Gamified habit tracking, virtual plants |
| `/app/community` | Community | Anonymous encouragement, shared wins |
| `/app/settings` | Settings | Profile, theme, notifications |
| `/app/resources` | Emergency | Crisis contacts, helplines, SOS |

## Core Features

### 1. Mood Check-in
- 5 emoji-based mood options (Happy, Calm, Neutral, Anxious, Sad)
- Optional note/journal prompt
- Daily streak tracking
- Mood-responsive theme changes

### 2. AI Companion (Mock)
- Chat interface with typing indicators
- Rule-based responses for MVP
- Context-aware suggestions
- Memory of previous conversations (localStorage)

### 3. Activities
- **Breathing:** 4-7-8, Box breathing with visual guides
- **Meditation:** Guided sessions with timer
- **Focus:** Pomodoro timer with ambient sounds
- **Stretch:** Quick routines with animations
- **Grounding:** 5-4-3-2-1 technique

### 4. Journal
- Rich text editor
- CBT-based AI reframe (rule-based)
- Emotion detection from text
- Private entries (localStorage for MVP)

### 5. Music Space
- Pre-built playlists (Lo-fi, Nature, Rain, Focus)
- Audio player with controls
- Volume normalization

### 6. Insights
- 7-day mood trend chart
- Activity effectiveness correlation
- Weekly summary cards

### 7. Habit Garden
- Complete activities to earn seeds
- Grow virtual plants
- Streak-based rewards
- Visual garden scene

### 8. Community
- Anonymous posts (no real names)
- Encouragement reactions only
- No public follower counts
- Positive interactions only

## Auth Flow
```
Landing Page → Sign Up / Login
                ↓
        Supabase Auth
        (Google OAuth OR Email/Password)
                ↓
        Session Token → localStorage
                ↓
        Protected Routes Access
```

## Database Schema (SQLite + Prisma)
```sql
-- Users (managed by Supabase Auth)
-- Extended profile in public profiles table

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mood_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  mood TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  prompt TEXT,
  reframe TEXT,
  emotion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE activity_completions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  activity_type TEXT NOT NULL,
  duration INTEGER,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE garden_plants (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  plant_type TEXT NOT NULL,
  growth_level INTEGER DEFAULT 0,
  last_watered TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Responsive Breakpoints
| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | 360-480px | Single column, bottom nav |
| Large Mobile | 481-600px | Single column, bottom nav |
| Tablet | 601-1024px | Collapsible sidebar |
| Laptop | 1025-1440px | Full sidebar |
| Desktop | 1441px+ | Max-width container |

## Animation Strategy
- **Page transitions:** Framer Motion (fade + slide)
- **Scroll reveals:** Intersection Observer + Framer Motion
- **Micro-interactions:** Hover states, button feedback
- **3D hero:** React Three Fiber floating elements
- **Reduced motion:** Respect `prefers-reduced-motion`

## Success Metrics
- Daily Active Users (DAU)
- 30-day retention rate
- Average session duration (<5 min target)
- Mood check-in completion rate
- Activity completion rate
- Journal entry frequency

## Phase 1 MVP Scope (This Build)
✅ Landing Page with auth
✅ Dashboard with mood check-in
✅ Mood Tracking with charts
✅ Activities Hub (breathing, meditation, focus, stretch)
✅ Journal with AI reframe
✅ AI Companion (mock)
✅ Music Space (basic)
✅ Insights Dashboard
✅ Habit Garden (basic)
✅ Community page
✅ Emergency Resources
✅ Settings page
✅ Dark mode
✅ Mobile responsive
✅ Supabase Auth (Google + email)

## Future Phases
- Real AI integration (OpenAI API)
- Smartwatch integration
- Spotify integration
- University partnerships
- Mobile apps (React Native)
