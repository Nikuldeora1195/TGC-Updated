-- Team members table for public team page and admin management

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_role TEXT NOT NULL,
  section TEXT NOT NULL,
  batch_label TEXT,
  bio TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  email TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT team_members_section_check CHECK (
    section IN ('founder', 'co_founder', 'current_team', 'vice_captain', 'jr_captain', 'previous_batch')
  )
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_members_select_public_active" ON public.team_members
  FOR SELECT USING (is_active = true OR public.get_user_role() = 'admin');

CREATE POLICY "team_members_insert_admin" ON public.team_members
  FOR INSERT WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "team_members_update_admin" ON public.team_members
  FOR UPDATE USING (public.get_user_role() = 'admin');

CREATE POLICY "team_members_delete_admin" ON public.team_members
  FOR DELETE USING (public.get_user_role() = 'admin');
