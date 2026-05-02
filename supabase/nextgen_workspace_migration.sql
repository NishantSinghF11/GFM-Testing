-- Add version tracking to workspace_files
ALTER TABLE public.workspace_files
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Add comment type tracking to workspace_comments
-- Types could be: 'general', 'revision', 'approved'
ALTER TABLE public.workspace_comments
ADD COLUMN IF NOT EXISTS comment_type TEXT DEFAULT 'general';

-- Add a boolean flag for whether a revision has been resolved
ALTER TABLE public.workspace_comments
ADD COLUMN IF NOT EXISTS resolved BOOLEAN DEFAULT false;
