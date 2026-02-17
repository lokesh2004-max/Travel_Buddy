
-- Remove any feedback with null user_id (orphaned data)
DELETE FROM public.feedback WHERE user_id IS NULL;

-- Make user_id non-nullable
ALTER TABLE public.feedback ALTER COLUMN user_id SET NOT NULL;
