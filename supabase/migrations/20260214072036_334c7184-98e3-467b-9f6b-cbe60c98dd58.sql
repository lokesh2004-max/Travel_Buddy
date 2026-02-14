
-- 1. Profiles: restrict SELECT to authenticated users only
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 2. Feedback: require authentication for INSERT
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.feedback;
CREATE POLICY "Authenticated users can insert feedback"
ON public.feedback
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Notifications: restrict INSERT to service role only (remove public insert)
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
-- No public INSERT policy; notifications should be created via service_role from edge functions/triggers only
