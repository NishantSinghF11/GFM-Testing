-- Run this in Supabase SQL Editor to add workspace tables

-- 1. WORKSPACE FILES
CREATE TABLE IF NOT EXISTS public.workspace_files (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES public.profiles(id),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. WORKSPACE COMMENTS
CREATE TABLE IF NOT EXISTS public.workspace_comments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id),
  text TEXT NOT NULL,
  timecode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on Realtime for commentsubli
ALTER PUBLICATION supabase_realtime ADD TABLE pc.workspace_comments;
