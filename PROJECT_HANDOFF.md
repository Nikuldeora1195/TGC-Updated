# TechGenz Project Handoff

## 1. Stack Overview

- Framework: Next.js 16 App Router
- Language: TypeScript
- UI: Tailwind CSS v4 + Radix UI-based components
- Auth + DB: Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Analytics: Vercel Analytics
- Package manager files present: `package-lock.json`, `pnpm-lock.yaml`
- Root scripts from `package.json`:
  - `npm run dev`
  - `npm run build`
  - `npm run start`
  - `npm run lint`

## 2. Environment Variables Used

These names are referenced in code:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

Important:

- `.env.local` exists in the repo root.
- Do not share secret values with another chatbot unless you intend to.
- The app currently uses the anon key on both client and server helpers.

## 3. Actual Route Map

### Public routes

- `/`
  - Home page
  - Uses [app/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\page.tsx)
- `/about`
  - Static About page
  - Uses [app/about/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\about\page.tsx)
- `/events`
  - Public events listing
  - Reads published events from Supabase
  - Uses [app/events/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\events\page.tsx)
- `/gallery`
  - Public gallery listing
  - Reads gallery rows from Supabase
  - Uses [app/gallery/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\gallery\page.tsx)

### Auth routes

- `/auth/login`
  - Member login and admin login toggle
  - Uses Supabase password auth
  - Uses [app/auth/login/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\auth\login\page.tsx)
- `/auth/sign-up`
  - User signup
  - Sends confirmation email
  - Uses [app/auth/sign-up/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\auth\sign-up\page.tsx)
- `/auth/sign-up-success`
  - Confirmation instruction screen
  - Uses [app/auth/sign-up-success/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\auth\sign-up-success\page.tsx)
- `/auth/error`
  - Generic auth failure screen
  - Uses [app/auth/error/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\auth\error\page.tsx)

### Dashboard routes

All `/dashboard/*` routes are protected by middleware and dashboard layout auth checks.

- `/dashboard`
  - Student overview page
  - Redirects `admin` to `/dashboard/admin`
  - Redirects `core_team` to `/dashboard/core-team`
  - Uses [app/dashboard/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\page.tsx)
- `/dashboard/admin`
  - Admin overview dashboard
  - Uses [app/dashboard/admin/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\admin\page.tsx)
- `/dashboard/core-team`
  - Core team overview dashboard
  - Uses [app/dashboard/core-team/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\core-team\page.tsx)
- `/dashboard/events`
  - Member event registration page inside dashboard
  - Uses [app/dashboard/events/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\events\page.tsx)
- `/dashboard/events/new`
  - Create new event form
  - Uses [app/dashboard/events/new/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\events\new\page.tsx)
- `/dashboard/certificates`
  - Member certificates listing
  - Uses [app/dashboard/certificates/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\certificates\page.tsx)
- `/dashboard/help`
  - Member help desk / query submission page
  - Uses [app/dashboard/help/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\help\page.tsx)
- `/dashboard/members`
  - Members management screen
  - Uses [app/dashboard/members/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\members\page.tsx)
- `/dashboard/notifications`
  - Notifications feed
  - Uses [app/dashboard/notifications/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\notifications\page.tsx)
- `/dashboard/queries`
  - Staff/admin query management and replies
  - Uses [app/dashboard/queries/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\queries\page.tsx)

## 4. Routes Referenced In UI But Not Implemented

These are important because another chatbot may assume they exist:

- `/dashboard/attendance`
- `/dashboard/gallery`
- `/dashboard/settings`
- `/dashboard/certificates/issue`
- `/dashboard/notifications/new`
- `/dashboard/gallery/upload`
- `/dashboard/queries/[id]`
- `/dashboard/events/[id]`

These links are referenced from:

- [components/dashboard/sidebar.tsx](c:\Users\nikul\Downloads\TGC_V)\components\dashboard\sidebar.tsx)
- [app/dashboard/admin/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\admin\page.tsx)
- [app/dashboard/core-team/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\core-team\page.tsx)

## 5. API / Backend Architecture

There are currently **no Next.js API routes** and **no `app/api/*` handlers**.

Backend access is done directly with Supabase:

- Client-side helper:
  - [lib/supabase/client.ts](c:\Users\nikul\Downloads\TGC_V)\lib\supabase\client.ts)
- Server-side helper:
  - [lib/supabase/server.ts](c:\Users\nikul\Downloads\TGC_V)\lib\supabase\server.ts)
- Middleware session refresh + dashboard guard:
  - [lib/supabase/middleware.ts](c:\Users\nikul\Downloads\TGC_V)\lib\supabase\middleware.ts)
  - [middleware.ts](c:\Users\nikul\Downloads\TGC_V)\middleware.ts)

So when someone asks for “API details”, the real answer is:

- Auth is Supabase Auth
- Reads/writes are direct Supabase table operations from React components
- Access control depends mostly on Supabase RLS + a few UI/layout role checks

## 6. Auth Flow

### Signup flow

File: [app/auth/sign-up/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\auth\sign-up\page.tsx)

- Uses `supabase.auth.signUp()`
- Sends user metadata:
  - `name`
  - `role: "student"`
- Redirect target after email confirmation:
  - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
  - fallback: `${window.location.origin}/dashboard`
- After successful signup, pushes to `/auth/sign-up-success`

### Login flow

File: [app/auth/login/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\auth\login\page.tsx)

- Uses `supabase.auth.signInWithPassword({ email, password })`
- Has two modes:
  - Member login
  - Admin login
- If admin mode is selected:
  - fetches row from `members`
  - verifies `role === "admin"`
  - otherwise signs the user back out
- Normal login redirects to `/dashboard`
- Admin login redirects to `/dashboard/admin`

### Session protection

Files:

- [middleware.ts](c:\Users\nikul\Downloads\TGC_V)\middleware.ts)
- [lib/supabase/middleware.ts](c:\Users\nikul\Downloads\TGC_V)\lib\supabase\middleware.ts)
- [app/dashboard/layout.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\layout.tsx)

Behavior:

- Middleware refreshes Supabase session cookies
- Unauthenticated access to `/dashboard*` redirects to `/auth/login`
- Dashboard layout also checks `supabase.auth.getUser()`
- Layout loads the user’s `members` row to determine sidebar role

## 7. Supabase Tables Used By The App

Defined in [scripts/001_create_tables.sql](c:\Users\nikul\Downloads\TGC_V)\scripts\001_create_tables.sql)

### `members`

Purpose:

- Extends `auth.users`
- Stores profile and role data

Columns:

- `id UUID PRIMARY KEY REFERENCES auth.users(id)`
- `member_id TEXT UNIQUE`
- `name TEXT NOT NULL`
- `email TEXT NOT NULL`
- `phone TEXT`
- `role TEXT NOT NULL DEFAULT 'student'`
- `year TEXT`
- `avatar_url TEXT`
- `joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
- `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### `events`

Columns:

- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `title TEXT NOT NULL`
- `description TEXT`
- `event_date TIMESTAMP WITH TIME ZONE NOT NULL`
- `location TEXT`
- `image_url TEXT`
- `event_type TEXT DEFAULT 'workshop'`
- `max_attendees INTEGER`
- `is_published BOOLEAN DEFAULT false`
- `created_by UUID`
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
- `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### `event_attendance`

Columns:

- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `event_id UUID NOT NULL`
- `member_id UUID NOT NULL`
- `status TEXT DEFAULT 'registered'`
- `checked_in_at TIMESTAMP WITH TIME ZONE`
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### `certificates`

Columns:

- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `member_id UUID NOT NULL`
- `event_id UUID`
- `certificate_url TEXT NOT NULL`
- `title TEXT NOT NULL`
- `issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### `notifications`

Columns:

- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `title TEXT NOT NULL`
- `message TEXT NOT NULL`
- `notification_type TEXT DEFAULT 'general'`
- `target_role TEXT DEFAULT 'all'`
- `created_by UUID`
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### `queries`

Columns:

- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `member_id UUID NOT NULL`
- `subject TEXT NOT NULL`
- `question TEXT NOT NULL`
- `status TEXT DEFAULT 'open'`
- `reply TEXT`
- `replied_by UUID`
- `replied_at TIMESTAMP WITH TIME ZONE`
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### `gallery`

Columns:

- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `event_id UUID`
- `image_url TEXT NOT NULL`
- `caption TEXT`
- `uploaded_by UUID`
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

## 8. Supabase RLS Policies

Defined in [scripts/002_create_rls_policies.sql](c:\Users\nikul\Downloads\TGC_V)\scripts\002_create_rls_policies.sql)

Helper:

- `public.get_user_role()` returns current user role from `members`

### `members`

- Select: everyone
- Insert: own row only
- Update: own row or admin
- Delete: admin only

### `events`

- Select: published events, or any event if user is `core_team`/`admin`
- Insert: `core_team` or `admin`
- Update: `core_team` or `admin`
- Delete: admin only

### `event_attendance`

- Select: own rows or staff
- Insert: any authenticated user
- Update: staff only
- Delete: staff only

### `certificates`

- Select: own rows or admin
- Insert: admin only
- Delete: admin only

### `notifications`

- Select: everyone
- Insert: `core_team` or `admin`
- Update: `core_team` or `admin`
- Delete: admin only

### `queries`

- Select: own rows or staff
- Insert: authenticated user where `member_id = auth.uid()`
- Update: staff only

### `gallery`

- Select: everyone
- Insert: `core_team` or `admin`
- Delete: `core_team` or `admin`

## 9. Signup Trigger / Member Auto-Creation

Defined in [scripts/003_create_member_trigger.sql](c:\Users\nikul\Downloads\TGC_V)\scripts\003_create_member_trigger.sql)

Behavior:

- `generate_member_id()` creates IDs like `TGZ-1234`
- `handle_new_user()` inserts a `members` row after `auth.users` signup
- Pulls:
  - `name` from `raw_user_meta_data.name`
  - `role` from `raw_user_meta_data.role`
  - defaults role to `student`

This trigger is required for role-based logic to work correctly after signup.

## 10. Current Data Access By Screen

### Public pages

- `/events`
  - reads `events`
  - filters `is_published = true`
- `/gallery`
  - reads `gallery`
  - joins `events(title)`

### Student dashboard

- `/dashboard`
  - reads `members`
  - counts `event_attendance`
  - counts `certificates`
  - reads upcoming `events`
  - reads recent `notifications`
- `/dashboard/events`
  - reads `events`
  - reads own `event_attendance`
  - inserts into `event_attendance`
- `/dashboard/certificates`
  - reads own `certificates`
- `/dashboard/help`
  - reads own `queries`
  - inserts into `queries`
- `/dashboard/notifications`
  - reads `notifications`

### Staff/admin dashboards

- `/dashboard/admin`
  - reads counts from `members`, `events`, `certificates`, `queries`, `gallery`
  - reads latest `members`
- `/dashboard/core-team`
  - reads counts from `members`, `events`, `queries`, `gallery`
  - reads open `queries`
  - reads upcoming `events`
- `/dashboard/members`
  - reads all `members`
  - updates `members.role`
- `/dashboard/queries`
  - reads all `queries` with `members(name, email, member_id)`
  - updates query `reply`, `status`, `replied_by`, `replied_at`
- `/dashboard/events/new`
  - inserts into `events`

## 11. Folder Structure

High-level structure:

```text
TGC_V)/
|-- app/
|   |-- about/
|   |   `-- page.tsx
|   |-- auth/
|   |   |-- error/
|   |   |   `-- page.tsx
|   |   |-- login/
|   |   |   `-- page.tsx
|   |   |-- sign-up/
|   |   |   `-- page.tsx
|   |   `-- sign-up-success/
|   |       `-- page.tsx
|   |-- dashboard/
|   |   |-- admin/
|   |   |   `-- page.tsx
|   |   |-- certificates/
|   |   |   `-- page.tsx
|   |   |-- core-team/
|   |   |   `-- page.tsx
|   |   |-- events/
|   |   |   |-- new/
|   |   |   |   `-- page.tsx
|   |   |   `-- page.tsx
|   |   |-- help/
|   |   |   `-- page.tsx
|   |   |-- members/
|   |   |   `-- page.tsx
|   |   |-- notifications/
|   |   |   `-- page.tsx
|   |   |-- queries/
|   |   |   `-- page.tsx
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   |-- events/
|   |   `-- page.tsx
|   |-- gallery/
|   |   `-- page.tsx
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   |-- dashboard/
|   |   `-- sidebar.tsx
|   |-- home/
|   |   |-- core-team.tsx
|   |   |-- features.tsx
|   |   `-- hero.tsx
|   |-- ui/
|   |   `-- many reusable shadcn/radix-style components
|   |-- footer.tsx
|   |-- navbar.tsx
|   `-- theme-provider.tsx
|-- hooks/
|   |-- use-mobile.ts
|   `-- use-toast.ts
|-- lib/
|   |-- supabase/
|   |   |-- client.ts
|   |   |-- middleware.ts
|   |   `-- server.ts
|   `-- utils.ts
|-- public/
|   `-- icons/placeholders
|-- scripts/
|   |-- 001_create_tables.sql
|   |-- 002_create_rls_policies.sql
|   `-- 003_create_member_trigger.sql
|-- middleware.ts
|-- next.config.mjs
|-- package.json
|-- tsconfig.json
`-- README.md
```

## 12. Important Shared Components

- [components/navbar.tsx](c:\Users\nikul\Downloads\TGC_V)\components\navbar.tsx)
  - top navigation for public pages
- [components/footer.tsx](c:\Users\nikul\Downloads\TGC_V)\components\footer.tsx)
  - public site footer
- [components/dashboard/sidebar.tsx](c:\Users\nikul\Downloads\TGC_V)\components\dashboard\sidebar.tsx)
  - role-based sidebar links for `student`, `core_team`, `admin`
- `components/ui/*`
  - local reusable UI primitives

## 13. Navigation Summary

### Public navbar links

Defined in [components/navbar.tsx](c:\Users\nikul\Downloads\TGC_V)\components\navbar.tsx)

- `/`
- `/events`
- `/gallery`
- `/about`
- `/auth/login`
- `/auth/sign-up`

### Dashboard sidebar behavior

Defined in [components/dashboard/sidebar.tsx](c:\Users\nikul\Downloads\TGC_V)\components\dashboard\sidebar.tsx)

Student links:

- `/dashboard`
- `/dashboard/events`
- `/dashboard/certificates`
- `/dashboard/notifications`
- `/dashboard/help`

Core team links:

- `/dashboard`
- `/dashboard/events`
- `/dashboard/attendance` (missing page)
- `/dashboard/certificates`
- `/dashboard/gallery` (missing page)
- `/dashboard/queries`
- `/dashboard/notifications`

Admin links:

- `/dashboard`
- `/dashboard/members`
- `/dashboard/events`
- `/dashboard/attendance` (missing page)
- `/dashboard/certificates`
- `/dashboard/gallery` (missing page)
- `/dashboard/queries`
- `/dashboard/notifications`
- `/dashboard/settings` (missing page)

## 14. Current Gaps / Incomplete Areas

These are the biggest things another chatbot should know immediately:

- Several dashboard links point to pages that do not exist yet.
- There are no dedicated API routes; all mutations happen directly from client components.
- Role protection is split between:
  - UI redirects/layout checks
  - Supabase RLS
- Public gallery currently does **not render real images**; it shows a placeholder block even though `gallery.image_url` exists.
- `events.image_url` exists in schema but is not used in UI.
- `members.page.tsx` lets the client attempt role updates directly; behavior depends on RLS and current user role.
- `dashboard/events/new` does not do an explicit client-side role check before insert; authorization depends on Supabase policies.
- Some admin/core-team quick links point to nested routes that are not implemented.
- README is basically empty.

## 15. Likely Next Development Tasks

If another chatbot continues this project, the most natural next tasks are:

- Implement missing dashboard routes:
  - attendance
  - gallery management
  - settings
  - issue certificate
  - new notification
  - query detail page
  - event detail page
- Add actual image rendering/upload flow for gallery and event images
- Add explicit role guards around admin/core-team client pages
- Add schema foreign keys and indexes if needed
- Add form validation and toast/error handling consistency
- Expand README with setup steps and Supabase migration instructions

## 16. Useful Source Files To Start From

- App shell:
  - [app/layout.tsx](c:\Users\nikul\Downloads\TGC_V)\app\layout.tsx)
  - [app/dashboard/layout.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\layout.tsx)
- Auth:
  - [app/auth/login/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\auth\login\page.tsx)
  - [app/auth/sign-up/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\auth\sign-up\page.tsx)
- Core dashboards:
  - [app/dashboard/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\page.tsx)
  - [app/dashboard/admin/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\admin\page.tsx)
  - [app/dashboard/core-team/page.tsx](c:\Users\nikul\Downloads\TGC_V)\app\dashboard\core-team\page.tsx)
- Data model:
  - [scripts/001_create_tables.sql](c:\Users\nikul\Downloads\TGC_V)\scripts\001_create_tables.sql)
  - [scripts/002_create_rls_policies.sql](c:\Users\nikul\Downloads\TGC_V)\scripts\002_create_rls_policies.sql)
  - [scripts/003_create_member_trigger.sql](c:\Users\nikul\Downloads\TGC_V)\scripts\003_create_member_trigger.sql)
- Supabase wiring:
  - [lib/supabase/client.ts](c:\Users\nikul\Downloads\TGC_V)\lib\supabase\client.ts)
  - [lib/supabase/server.ts](c:\Users\nikul\Downloads\TGC_V)\lib\supabase\server.ts)
  - [lib/supabase/middleware.ts](c:\Users\nikul\Downloads\TGC_V)\lib\supabase\middleware.ts)

## 17. One-Sentence Summary

This is a Next.js + Supabase community platform with public pages, authenticated role-based dashboards, direct Supabase CRUD from components, a SQL schema already drafted in `scripts/`, and a handful of missing dashboard routes that are already linked in the UI but not built yet.
