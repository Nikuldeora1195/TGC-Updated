-- Low-storage certificate template system

CREATE TABLE IF NOT EXISTS public.certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_id UUID,
  template_url TEXT NOT NULL DEFAULT '',
  html_content TEXT,
  text_color TEXT DEFAULT '#111827',
  name_y_percent NUMERIC DEFAULT 44,
  date_y_percent NUMERIC DEFAULT 60,
  code_y_percent NUMERIC DEFAULT 68,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'certificate_templates'
      AND column_name = 'html_content'
  ) THEN
    ALTER TABLE public.certificate_templates ADD COLUMN html_content TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'certificates'
      AND column_name = 'template_id'
  ) THEN
    ALTER TABLE public.certificates ADD COLUMN template_id UUID;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'certificates'
      AND column_name = 'certificate_code'
  ) THEN
    ALTER TABLE public.certificates ADD COLUMN certificate_code TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'certificates'
      AND column_name = 'recipient_name'
  ) THEN
    ALTER TABLE public.certificates ADD COLUMN recipient_name TEXT;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS certificates_certificate_code_idx
  ON public.certificates(certificate_code)
  WHERE certificate_code IS NOT NULL;

DROP POLICY IF EXISTS "certificate_templates_select_all" ON public.certificate_templates;
DROP POLICY IF EXISTS "certificate_templates_insert_admin" ON public.certificate_templates;
DROP POLICY IF EXISTS "certificate_templates_update_admin" ON public.certificate_templates;
DROP POLICY IF EXISTS "certificate_templates_delete_admin" ON public.certificate_templates;

CREATE POLICY "certificate_templates_select_all" ON public.certificate_templates
  FOR SELECT USING (true);

CREATE POLICY "certificate_templates_insert_admin" ON public.certificate_templates
  FOR INSERT WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "certificate_templates_update_admin" ON public.certificate_templates
  FOR UPDATE USING (public.get_user_role() = 'admin');

CREATE POLICY "certificate_templates_delete_admin" ON public.certificate_templates
  FOR DELETE USING (public.get_user_role() = 'admin');
