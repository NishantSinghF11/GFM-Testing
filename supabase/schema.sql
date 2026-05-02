-- ============================================
-- GigsForMe Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. PROFILES (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client', -- 'client' or 'creator'
  bio TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  cover_color TEXT DEFAULT '#8B5CF6',
  initials TEXT,
  rating NUMERIC(3,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  count INTEGER DEFAULT 0
);

-- 3. GIGS
CREATE TABLE IF NOT EXISTS public.gigs (
  id SERIAL PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT REFERENCES public.categories(id),
  tags TEXT[] DEFAULT '{}',
  thumb_color TEXT DEFAULT '#8B5CF6',
  featured BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  price_basic INTEGER NOT NULL DEFAULT 49,
  price_standard INTEGER NOT NULL DEFAULT 149,
  price_premium INTEGER NOT NULL DEFAULT 299,
  delivery_basic INTEGER DEFAULT 3,
  delivery_standard INTEGER DEFAULT 5,
  delivery_premium INTEGER DEFAULT 7,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  gig_id INTEGER REFERENCES public.gigs(id),
  client_id UUID REFERENCES public.profiles(id),
  creator_id UUID REFERENCES public.profiles(id),
  package TEXT NOT NULL DEFAULT 'basic', -- 'basic', 'standard', 'premium'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'revision', 'completed', 'cancelled'
  total_price NUMERIC(10,2) NOT NULL,
  is_retainer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id SERIAL PRIMARY KEY,
  gig_id INTEGER REFERENCES public.gigs(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id),
  rating NUMERIC(3,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id SERIAL PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id),
  receiver_id UUID REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only owner can write
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Gigs: anyone can read
CREATE POLICY "Gigs are viewable by everyone" ON public.gigs FOR SELECT USING (true);
CREATE POLICY "Creators can insert gigs" ON public.gigs FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own gigs" ON public.gigs FOR UPDATE USING (auth.uid() = creator_id);

-- Categories: public read
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Reviews: public read
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Clients can insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Orders: only involved users can see
CREATE POLICY "Users can see own orders" ON public.orders FOR SELECT USING (auth.uid() = client_id OR auth.uid() = creator_id);

-- Messages: only sender/receiver can see
CREATE POLICY "Users can see own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, initials)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 2))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- SEED: CATEGORIES
-- ============================================
INSERT INTO public.categories (id, name, icon, count) VALUES
  ('video-editing', 'Video Editing', '🎬', 245),
  ('cinematography', 'Cinematography', '🎥', 98),
  ('motion-graphics', 'Motion Graphics', '✨', 134),
  ('color-grading', 'Color Grading', '🎨', 87),
  ('sound-design', 'Sound Design', '🎵', 72),
  ('photography', 'Photography', '📷', 156),
  ('2d-3d-animation', '2D/3D Animation', '🌀', 63),
  ('vfx', 'VFX & Effects', '💥', 45)
ON CONFLICT (id) DO NOTHING;
