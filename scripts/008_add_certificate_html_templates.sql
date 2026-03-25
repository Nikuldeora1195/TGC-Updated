-- Add HTML template support to reusable certificate templates

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

  ALTER TABLE public.certificate_templates
    ALTER COLUMN template_url SET DEFAULT '';
END $$;
