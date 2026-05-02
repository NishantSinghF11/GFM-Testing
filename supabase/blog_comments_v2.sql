-- Add parent_id for nested replies
ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE;

-- Create blog_comment_likes table
CREATE TABLE IF NOT EXISTS blog_comment_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(comment_id, user_id)
);

-- Enable RLS for likes
ALTER TABLE blog_comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone" ON blog_comment_likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like comments" ON blog_comment_likes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can unlike comments" ON blog_comment_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE blog_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE blog_comment_likes;
