-- Create the blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT DEFAULT 'Uncategorized',
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public blogs are viewable by everyone" ON public.blogs
    FOR SELECT USING (published = true);

CREATE POLICY "Users can create their own blogs" ON public.blogs
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blogs" ON public.blogs
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own blogs" ON public.blogs
    FOR DELETE USING (auth.uid() = author_id);

-- Create a slug from title function
CREATE OR REPLACE FUNCTION public.create_blog_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
        -- Ensure slug is unique by appending a random string if needed
        IF EXISTS (SELECT 1 FROM public.blogs WHERE slug = NEW.slug) THEN
            NEW.slug := NEW.slug || '-' || floor(random() * 1000)::text;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_create_blog_slug
BEFORE INSERT ON public.blogs
FOR EACH ROW EXECUTE FUNCTION public.create_blog_slug();
