-- Corriger la politique RLS récursive et garantir les profils/roles
-- 1) Supprimer la politique récursive qui causait "infinite recursion detected"
DROP POLICY IF EXISTS "Vendeurs can view all profiles updated" ON public.profiles;

-- (Les autres politiques existantes restent, dont "Users can view their own profile" et
--  "Admins and vendeurs can view all profiles" qui utilisent has_role.)

-- 2) Créer/mettre à jour les profils pour les 3 emails
-- Insérer si absent (récupère user_id depuis auth.users), puis aligner first_name et role
INSERT INTO public.profiles (user_id, email, first_name, role)
SELECT u.id, u.email, 'Iryna', 'admin'
FROM auth.users u
WHERE u.email = 'but.iryna@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = u.id);

INSERT INTO public.profiles (user_id, email, first_name, role)
SELECT u.id, u.email, 'Thomas', 'vendeur'
FROM auth.users u
WHERE u.email = 'but_iryna@inbox.ru'
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = u.id);

INSERT INTO public.profiles (user_id, email, first_name, role)
SELECT u.id, u.email, 'Iryna', 'client'
FROM auth.users u
WHERE u.email = 'iryna.but@epitech.digital'
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = u.id);

-- Forcer la cohérence des rôles/prénoms
UPDATE public.profiles SET first_name = 'Iryna', role = 'admin'   WHERE email = 'but.iryna@gmail.com';
UPDATE public.profiles SET first_name = 'Thomas', role = 'vendeur' WHERE email = 'but_iryna@inbox.ru';
UPDATE public.profiles SET first_name = 'Iryna', role = 'client'   WHERE email = 'iryna.but@epitech.digital';