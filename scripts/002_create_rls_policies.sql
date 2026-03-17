-- Row Level Security Policies for TechGenz Platform

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.members WHERE id = auth.uid()
$$;

-- Members Policies
CREATE POLICY "members_select_all" ON public.members
  FOR SELECT USING (true);

CREATE POLICY "members_insert_own" ON public.members
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "members_update_own" ON public.members
  FOR UPDATE USING (auth.uid() = id OR public.get_user_role() = 'admin');

CREATE POLICY "members_delete_admin" ON public.members
  FOR DELETE USING (public.get_user_role() = 'admin');

-- Events Policies
CREATE POLICY "events_select_published" ON public.events
  FOR SELECT USING (is_published = true OR public.get_user_role() IN ('core_team', 'admin'));

CREATE POLICY "events_insert_core_admin" ON public.events
  FOR INSERT WITH CHECK (public.get_user_role() IN ('core_team', 'admin'));

CREATE POLICY "events_update_core_admin" ON public.events
  FOR UPDATE USING (public.get_user_role() IN ('core_team', 'admin'));

CREATE POLICY "events_delete_admin" ON public.events
  FOR DELETE USING (public.get_user_role() = 'admin');

-- Event Attendance Policies
CREATE POLICY "attendance_select_own_or_staff" ON public.event_attendance
  FOR SELECT USING (
    member_id = auth.uid() OR 
    public.get_user_role() IN ('core_team', 'admin')
  );

CREATE POLICY "attendance_insert_authenticated" ON public.event_attendance
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "attendance_update_staff" ON public.event_attendance
  FOR UPDATE USING (public.get_user_role() IN ('core_team', 'admin'));

CREATE POLICY "attendance_delete_staff" ON public.event_attendance
  FOR DELETE USING (public.get_user_role() IN ('core_team', 'admin'));

-- Certificates Policies
CREATE POLICY "certificates_select_own_or_admin" ON public.certificates
  FOR SELECT USING (
    member_id = auth.uid() OR 
    public.get_user_role() = 'admin'
  );

CREATE POLICY "certificates_insert_admin" ON public.certificates
  FOR INSERT WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "certificates_delete_admin" ON public.certificates
  FOR DELETE USING (public.get_user_role() = 'admin');

-- Notifications Policies
CREATE POLICY "notifications_select_all" ON public.notifications
  FOR SELECT USING (true);

CREATE POLICY "notifications_insert_staff" ON public.notifications
  FOR INSERT WITH CHECK (public.get_user_role() IN ('core_team', 'admin'));

CREATE POLICY "notifications_update_staff" ON public.notifications
  FOR UPDATE USING (public.get_user_role() IN ('core_team', 'admin'));

CREATE POLICY "notifications_delete_admin" ON public.notifications
  FOR DELETE USING (public.get_user_role() = 'admin');

-- Queries Policies
CREATE POLICY "queries_select_own_or_staff" ON public.queries
  FOR SELECT USING (
    member_id = auth.uid() OR 
    public.get_user_role() IN ('core_team', 'admin')
  );

CREATE POLICY "queries_insert_authenticated" ON public.queries
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND member_id = auth.uid());

CREATE POLICY "queries_update_staff" ON public.queries
  FOR UPDATE USING (public.get_user_role() IN ('core_team', 'admin'));

-- Gallery Policies
CREATE POLICY "gallery_select_all" ON public.gallery
  FOR SELECT USING (true);

CREATE POLICY "gallery_insert_staff" ON public.gallery
  FOR INSERT WITH CHECK (public.get_user_role() IN ('core_team', 'admin'));

CREATE POLICY "gallery_delete_staff" ON public.gallery
  FOR DELETE USING (public.get_user_role() IN ('core_team', 'admin'));
