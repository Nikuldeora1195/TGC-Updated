-- Update existing team_members section constraint to support vice/jr captain rows

ALTER TABLE public.team_members
  DROP CONSTRAINT IF EXISTS team_members_section_check;

ALTER TABLE public.team_members
  ADD CONSTRAINT team_members_section_check CHECK (
    section IN ('founder', 'co_founder', 'current_team', 'vice_captain', 'jr_captain', 'previous_batch')
  );
