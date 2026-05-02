-- Run this in Supabase SQL Editor to allow file uploads

-- 1. Allow public to READ files from the bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'workspace_files');

-- 2. Allow authenticated users to UPLOAD files
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'workspace_files' 
  AND auth.role() = 'authenticated'
);

-- 3. Allow authenticated users to UPDATE files (optional but good for overwriting)
CREATE POLICY "Authenticated users can update" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'workspace_files' 
  AND auth.role() = 'authenticated'
);
