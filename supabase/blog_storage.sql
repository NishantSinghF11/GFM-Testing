-- Create the blog-images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public Access for Blog Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'blog-images' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can delete their own blog images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'blog-images' AND 
        auth.uid() = owner
    );
