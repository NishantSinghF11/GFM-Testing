-- Create the polls table
CREATE TABLE IF NOT EXISTS public.blog_polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]', -- Array of objects: {id, text}
    is_closed BOOLEAN DEFAULT false
);

-- Create the poll votes table
CREATE TABLE IF NOT EXISTS public.blog_poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    poll_id UUID REFERENCES public.blog_polls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    option_id TEXT NOT NULL,
    UNIQUE(poll_id, user_id) -- One vote per user per poll
);

-- Enable RLS
ALTER TABLE public.blog_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_poll_votes ENABLE ROW LEVEL SECURITY;

-- Policies for Polls
CREATE POLICY "Polls are viewable by everyone" ON public.blog_polls
    FOR SELECT USING (true);

CREATE POLICY "Authors can manage polls for their blogs" ON public.blog_polls
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.blogs 
            WHERE blogs.id = blog_polls.blog_id 
            AND blogs.author_id = auth.uid()
        )
    );

-- Policies for Votes
CREATE POLICY "Votes are viewable by everyone" ON public.blog_poll_votes
    FOR SELECT USING (true);

CREATE POLICY "Users can vote once" ON public.blog_poll_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);
