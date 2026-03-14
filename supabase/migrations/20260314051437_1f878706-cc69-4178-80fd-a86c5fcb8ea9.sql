-- Add advanced travel preference columns to profiles table for GNN compatibility engine
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS accommodation TEXT,
  ADD COLUMN IF NOT EXISTS group_size TEXT,
  ADD COLUMN IF NOT EXISTS destination_type TEXT;
