-- Add missing RLS policies for messages (SELECT + INSERT)
CREATE POLICY "Users can read messages in their matches"
ON public.messages FOR SELECT TO authenticated
USING (
  match_id IN (
    SELECT id FROM public.buddy_matches WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages in their matches"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND match_id IN (
    SELECT id FROM public.buddy_matches WHERE user_id = auth.uid()
  )
);

-- Add missing INSERT policy for notifications
CREATE POLICY "Users can insert own notifications"
ON public.notifications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Remove duplicate INSERT policy on buddy_matches
DROP POLICY IF EXISTS "Users can insert matches" ON public.buddy_matches;