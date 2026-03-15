
-- ════════════════════════════════════════════════════════════════════════════
-- STEP 1: Create quiz_answers table
-- This becomes the canonical source for travel preference data used by the
-- compatibility engine (and future GNN model).
-- ════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL UNIQUE,
  travel_style     TEXT,
  budget           TEXT,
  accommodation    TEXT,
  group_size       TEXT,
  destination_type TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz answers"
  ON public.quiz_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz answers"
  ON public.quiz_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz answers"
  ON public.quiz_answers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER update_quiz_answers_updated_at
  BEFORE UPDATE ON public.quiz_answers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ════════════════════════════════════════════════════════════════════════════
-- STEP 2: Remove travel-matching fields from profiles table.
-- These are now owned by quiz_answers; profiles stores identity only.
-- ════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS travel_style,
  DROP COLUMN IF EXISTS budget_range,
  DROP COLUMN IF EXISTS accommodation,
  DROP COLUMN IF EXISTS group_size,
  DROP COLUMN IF EXISTS destination_type;
