
-- ══════════════════════════════════════════════════════════════════
-- Allow all authenticated users to read quiz_answers
-- Required for the compatibility scoring engine to compare
-- travel preferences across the user base.
-- ══════════════════════════════════════════════════════════════════

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view own quiz answers" ON public.quiz_answers;

-- New policy: any authenticated user can read all quiz_answers rows
CREATE POLICY "Authenticated users can view all quiz answers"
  ON public.quiz_answers
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Also make profiles readable to all authenticated users (if not already)
-- (already exists but ensure it covers the matching query correctly)
