-- Storage bucket and policies for reusable certificate templates

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-templates', 'certificate-templates', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "certificate templates upload for admin" ON storage.objects;
DROP POLICY IF EXISTS "certificate templates view public" ON storage.objects;
DROP POLICY IF EXISTS "certificate templates delete for admin" ON storage.objects;

CREATE POLICY "certificate templates upload for admin"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'certificate-templates'
  AND public.get_user_role() = 'admin'
);

CREATE POLICY "certificate templates view public"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'certificate-templates');

CREATE POLICY "certificate templates delete for admin"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'certificate-templates'
  AND public.get_user_role() = 'admin'
);
