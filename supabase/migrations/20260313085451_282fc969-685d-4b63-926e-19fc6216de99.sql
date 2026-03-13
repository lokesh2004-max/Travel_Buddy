
-- 1. Add length constraints only (skip URL format check due to existing blob: URLs)
ALTER TABLE public.profiles
  ADD CONSTRAINT full_name_max_len CHECK (full_name IS NULL OR length(full_name) <= 200),
  ADD CONSTRAINT avatar_url_max_len CHECK (avatar_url IS NULL OR length(avatar_url) <= 500);

-- 2. Fix buddy_matches UPDATE policy
DROP POLICY IF EXISTS "Users can update their own matches" ON public.buddy_matches;

-- Recipient can accept or reject a match
CREATE POLICY "Recipient can accept or reject match"
ON public.buddy_matches FOR UPDATE
TO public
USING (auth.uid() = user2_id)
WITH CHECK (auth.uid() = user2_id);

-- Initiator can only withdraw (set to rejected) their own pending match
CREATE POLICY "Initiator can withdraw pending match"
ON public.buddy_matches FOR UPDATE
TO public
USING (auth.uid() = user1_id AND status = 'pending')
WITH CHECK (auth.uid() = user1_id AND status = 'rejected');
