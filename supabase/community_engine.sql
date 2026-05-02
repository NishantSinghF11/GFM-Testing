-- ============================================
-- GFM COMMUNITY ENGINE: THREADS & DISCUSSIONS
-- ============================================

-- 1. COMMUNITY THREADS
CREATE TABLE IF NOT EXISTS public.community_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- 'strategy', 'intelligence', 'production'
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. THREAD VOTES (Prevents multiple votes from same user)
CREATE TABLE IF NOT EXISTS public.community_thread_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID REFERENCES public.community_threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote_type INTEGER CHECK (vote_type IN (1, -1)), -- 1 for upvote, -1 for downvote
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

-- 3. RLS POLICIES
ALTER TABLE public.community_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_thread_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Threads are viewable by everyone" ON public.community_threads;
CREATE POLICY "Threads are viewable by everyone" ON public.community_threads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create threads" ON public.community_threads;
CREATE POLICY "Users can create threads" ON public.community_threads FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update own threads" ON public.community_threads;
CREATE POLICY "Authors can update own threads" ON public.community_threads FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Votes are viewable by everyone" ON public.community_thread_votes;
CREATE POLICY "Votes are viewable by everyone" ON public.community_thread_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can vote" ON public.community_thread_votes;
CREATE POLICY "Users can vote" ON public.community_thread_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can change vote" ON public.community_thread_votes;
CREATE POLICY "Users can change vote" ON public.community_thread_votes FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove vote" ON public.community_thread_votes;
CREATE POLICY "Users can remove vote" ON public.community_thread_votes FOR DELETE USING (auth.uid() = user_id);

-- 4. UPDATE TRIGGERS (Auto-sync vote counts)
CREATE OR REPLACE FUNCTION public.update_thread_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.community_threads
    SET upvotes = upvotes + CASE WHEN NEW.vote_type = 1 THEN 1 ELSE 0 END,
        downvotes = downvotes + CASE WHEN NEW.vote_type = -1 THEN 1 ELSE 0 END
    WHERE id = NEW.thread_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.community_threads
    SET upvotes = upvotes - CASE WHEN OLD.vote_type = 1 THEN 1 ELSE 0 END,
        downvotes = downvotes - CASE WHEN OLD.vote_type = -1 THEN 1 ELSE 0 END
    WHERE id = OLD.thread_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_thread_vote_change ON public.community_thread_votes;
CREATE TRIGGER on_thread_vote_change
  AFTER INSERT OR DELETE ON public.community_thread_votes
  FOR EACH ROW EXECUTE PROCEDURE public.update_thread_vote_counts();

-- 5. VIEW TRACKING
CREATE OR REPLACE FUNCTION increment_thread_views(thread_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.community_threads
  SET views = COALESCE(views, 0) + 1
  WHERE id = thread_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
