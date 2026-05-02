-- Run this in Supabase SQL Editor to add settings columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS twitter TEXT,
  ADD COLUMN IF NOT EXISTS instagram TEXT,
  ADD COLUMN IF NOT EXISTS youtube TEXT,
  ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'available',
  ADD COLUMN IF NOT EXISTS notifications JSONB DEFAULT '{"email_messages": true, "email_orders": true, "email_marketing": false, "push_messages": true, "push_orders": true, "sms_orders": false}'::jsonb;
