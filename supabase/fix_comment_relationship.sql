-- Fix relationship between blog_comments and profiles
ALTER TABLE blog_comments 
DROP CONSTRAINT IF EXISTS blog_comments_author_id_fkey,
ADD CONSTRAINT blog_comments_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;
