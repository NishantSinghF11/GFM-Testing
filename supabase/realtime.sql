-- Run this in Supabase SQL Editor to add real-time support
-- Enable realtime on messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Allow users to update their own messages (mark as read)
CREATE POLICY "Users can update messages they received" ON public.messages
  FOR UPDATE USING (auth.uid() = receiver_id);
