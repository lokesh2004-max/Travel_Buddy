
-- Drop FK constraints that block mock buddy inserts
ALTER TABLE public.buddy_matches DROP CONSTRAINT IF EXISTS buddy_matches_user1_id_fkey;
ALTER TABLE public.buddy_matches DROP CONSTRAINT IF EXISTS buddy_matches_user2_id_fkey;

-- Create the missing trigger to auto-create profiles on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
