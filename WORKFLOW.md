# MyAptitude — Master Development Workflow & Roadmap

This document outlines the phased development plan for **MyAptitude**, a premium, gamified aptitude-training web application inspired by the dark, high-energy, mental-challenge aesthetic of Matiks.

---

## Technical Stack & Environment

- **Environment**: Node.js v24.21.0 / npm 11.19.0 (Windows PowerShell via `npm.cmd`)
- **Framework**: React 18 / 19
- **Build Tool**: Vite
- **Language**: JavaScript (ESModules)
- **Styling**: Vanilla CSS / Custom CSS Design System (matching specified theme tokens)
- **Icons**: Lucide React
- **Future Backend**: Supabase (Auth + PostgreSQL)

---

## Design System Specifications

### Color Tokens
- **Background**: `#101010`
- **Card Background**: `#19151F`
- **Primary Accent**: `#C6FF45` (Electric Lime)
- **Primary Text**: `#FFFFFF`
- **Secondary Text**: `#A8A5AF`
- **Borders & Dividers**: Subtle borders (`#2D2738` / `#231F2E`)
- **Semantic Colors**: Success (`#22C55E`), Error (`#EF4444`), Warning (`#F59E0B`), Info (`#3B82F6`)

### Visual Feel
- Dark, clean, brain-training game interface (Matiks-inspired).
- High contrast, crisp typography (Inter / Outfit / system sans), rounded card components.
- Smooth micro-interactions, responsive mobile-first architecture.

---

## Phase-by-Phase Roadmap

### [ ] Phase 0: Project Inspection & Baseline Setup
- **Goal**: Verify workspace, Node/npm tools, initialize baseline React + Vite application (in root or designated folder), verify development server and production build (`npm.cmd run build`).
- **Deliverables**: Runnable Vite + React template, verified build pipeline, baseline documentation.
- **Verification**: Zero errors on `npm run build`.

---

### [ ] Phase 1: Visual Foundation & Design System
- **Goal**: Implement the MyAptitude brand and visual design foundation.
- **Deliverables**:
  - CSS variables and design tokens (`#101010`, `#19151F`, `#C6FF45`, `#FFFFFF`, `#A8A5AF`).
  - Typography, layout primitives (container, grid, flex).
  - Common UI components: Buttons (Primary Lime, Secondary Dark, Ghost), Cards, Badges, Input fields, Progress bars.
  - Header / Navigation bar foundation with logo & stats badges (XP, streak).
  - Showcase / landing visual screen demonstrating the theme.
- **Verification**: Production build passes; responsive view tested across mobile and desktop.

---

### [ ] Phase 2: Welcome & Authentication UI
- **Goal**: Build onboarding slides, welcome experience, and demo auth forms.
- **Deliverables**:
  - Welcome / hero screen.
  - Interactive onboarding carousel/slides (feature intro).
  - Login & Sign-up modal / screens with form validation and password visibility toggle.
  - "Continue as Guest" flow.
  - Local authentication state context (mock/demo mode, strictly avoiding fake backend claims).
- **Verification**: Form validations, input state handling, guest mode transition tested.

---

### [ ] Phase 3: Home Dashboard
- **Goal**: Build a personalized, high-engagement student hub.
- **Deliverables**:
  - User greeting with level & XP progress bar.
  - Daily streak indicator with streak freeze/status.
  - "Daily Challenge" spotlight card.
  - Aptitude category cards (Quantitative, Logical, Numerical, Pattern Recognition, Verbal).
  - Quick practice recommendations and recent practice history cards.
  - Prominent "Start Practice" CTA button.
- **Verification**: Navigation between categories and buttons functional with mock data.

---

### [ ] Phase 4: Functional Aptitude Engine
- **Goal**: Build an interactive, timed quiz engine with clean separation of logic and presentation.
- **Deliverables**:
  - Structured local question bank (verified questions, correct keys, no duplicates per session).
  - Category and difficulty selector.
  - Timed practice mode with countdown timer.
  - Multiple-choice question card with responsive option selectors.
  - Instant answer validation, feedback, and concise step-by-step explanations.
  - Score & accuracy calculation engine.
  - Next question navigation and session completion trigger.
- **Verification**: Full practice session playable from question 1 to completion.

---

### [ ] Phase 5: Results & Gamification
- **Goal**: Calculate accurate post-session results, rewards, XP, and streak milestones.
- **Deliverables**:
  - Results screen with accuracy percentage, score, and completion time.
  - Question-by-question review (correct vs. incorrect breakdown with explanations).
  - Dynamic XP calculation (preventing duplicate awards for same session).
  - Level-up celebration modal/trigger when thresholds are crossed.
  - Action buttons: "Practice Again", "Review Mistakes", "Return to Dashboard".
- **Verification**: End-to-end quiz flow updating XP and showing accurate metrics.

---

### [ ] Phase 6: Profile & Progress Analytics
- **Goal**: User profile and historical analytics based on actual local session logs.
- **Deliverables**:
  - Profile summary with avatar, level, total XP, current & highest streak.
  - Category breakdown chart / radar / progress bars (accuracy per category).
  - Weekly activity heatmap / calendar bar.
  - Unlocked achievements badge grid.
  - Session history list with empty state handling.
  - Settings (theme preferences, sound toggle, reset data option).
- **Verification**: Session history and category stats accurately aggregate stored practice runs.

---

### [ ] Phase 7: Supabase Integration
- **Goal**: Connect Supabase Authentication and PostgreSQL database for cloud sync.
- **Deliverables**:
  - Supabase client initialization via `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
  - Real user sign-up, sign-in, session persistence, and logout.
  - PostgreSQL schema migration scripts (profiles, practice_sessions, user_achievements).
  - Row Level Security (RLS) policies for user data isolation.
  - Cloud sync for XP, streaks, and practice history with offline fallback/loading states.
- **Verification**: Cloud login, record persistence, and RLS verified.

---

### [ ] Phase 8: Final Polish & Deployment Preparation
- **Goal**: Comprehensive audits, accessibility checks, responsive verification, and production readiness.
- **Deliverables**:
  - Mobile, tablet, and desktop layout audits.
  - Keyboard navigation and reduced-motion accessibility support.
  - Error boundaries, fallback states, and 404 handling.
  - Final optimized production bundle build.
  - Deployment guide (Vercel / Netlify / Cloudflare Pages).
- **Verification**: Clean build, fast load time, flawless UI.

---

## Operating Protocol

1. **Strict Phased Progression**: Work is performed exclusively within the active phase.
2. **Review & Approval Gate**: After each phase is built and verified with `npm run build`, a summary is presented and execution pauses for explicit user approval before moving to the next phase.
3. **No Redundant Dependencies**: Pure React + CSS/Tailwind + Lucide icons.
