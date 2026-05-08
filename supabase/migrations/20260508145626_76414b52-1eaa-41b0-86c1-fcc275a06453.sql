-- ── guides table ──
CREATE TABLE public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'India',
  languages text[] DEFAULT '{}'::text[],
  expertise text,
  categories text[] DEFAULT '{}'::text[],
  hourly_price numeric NOT NULL DEFAULT 0,
  bio text,
  avatar_url text,
  is_verified boolean NOT NULL DEFAULT false,
  is_online boolean NOT NULL DEFAULT true,
  rating numeric NOT NULL DEFAULT 5,
  reviews_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view guides"
  ON public.guides FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can register as guide"
  ON public.guides FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guides can update own profile"
  ON public.guides FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guides can delete own profile"
  ON public.guides FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_guides_city ON public.guides(city);
CREATE INDEX idx_guides_user_id ON public.guides(user_id);

-- ── storage bucket ──
INSERT INTO storage.buckets (id, name, public)
VALUES ('guide-avatars', 'guide-avatars', true);

CREATE POLICY "Guide avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'guide-avatars');

CREATE POLICY "Authenticated users can upload guide avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'guide-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own guide avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'guide-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own guide avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'guide-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );