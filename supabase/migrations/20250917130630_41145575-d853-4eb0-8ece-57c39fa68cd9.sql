-- Fix infinite recursion in profiles policies
DROP POLICY IF EXISTS "Vendeurs can view client profiles" ON public.profiles;

-- Create a simple, non-recursive policy for vendeurs to view all profiles
CREATE POLICY "Vendeurs can view all profiles updated" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('vendeur', 'admin')
  )
);