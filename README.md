# TaskFlow — Kanban Board

A modern, drag-and-drop Kanban board built with Next.js, TypeScript, and Supabase. Features guest authentication, real-time task management, labels, filtering, and a responsive mobile-friendly layout.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Material UI (MUI)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Anonymous Sign-In
- **Drag & Drop:** @dnd-kit
- **Deployment:** Vercel

## Features

- Drag-and-drop tasks across 4 columns (To Do, In Progress, In Review, Done)
- Create, edit, and delete tasks with priority levels and due dates
- Labels/tags system with color-coded badges
- Search and filter by priority or label
- Board statistics dashboard
- Optimistic UI updates with rollback on error
- Confetti animation on task completion
- Guest sessions with Row Level Security (RLS)
- Responsive layout with mobile drawer for forms

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd sportlingo-kanban
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Enable **Anonymous Sign-In** in Authentication > Settings > Auth Providers
3. Run the schema in your Supabase SQL Editor:

```bash
# Copy the contents of supabase/schema.sql and run it in:
# Supabase Dashboard > SQL Editor > New Query
```

This creates:
- `tasks`, `labels`, `task_labels` tables with proper indexes
- PostgreSQL enums for `task_status` and `task_priority`
- Row Level Security policies so each guest only sees their own data

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials (found in Project Settings > API):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # Next.js App Router (layout, page, globals)
├── components/
│   ├── board/            # Board, Column, TaskCard
│   ├── filters/          # FilterBar with search and priority/label filters
│   ├── labels/           # LabelBadge, LabelPicker
│   ├── providers/        # MUI ThemeRegistry
│   ├── stats/            # BoardStats dashboard cards
│   ├── tasks/            # TaskModal, TaskForm, PriorityBadge, DueDateBadge
│   └── ui/               # Reusable primitives (Modal, Button, Input, etc.)
├── hooks/                # useAuth, useTasks, useLabels, useFilters, useMobile
├── lib/
│   ├── constants.ts      # Column definitions, priority config, label colors
│   ├── supabase/         # Supabase client and TypeScript types
│   ├── theme.ts          # MUI theme configuration
│   └── utils.ts          # Date formatting and urgency helpers
├── types/                # Re-exported type definitions
supabase/
└── schema.sql            # Database schema with RLS policies
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Next.js
