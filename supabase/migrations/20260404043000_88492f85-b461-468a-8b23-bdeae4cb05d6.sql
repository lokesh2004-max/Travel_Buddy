
CREATE TABLE public.moments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  image_url text NOT NULL,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view moments"
ON public.moments FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can insert own moments"
ON public.moments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own moments"
ON public.moments FOR DELETE TO authenticated
USING (auth.uid() = user_id);
