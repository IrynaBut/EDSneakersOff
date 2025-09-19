-- Supprimer la fonction de points de fidélité
DROP FUNCTION IF EXISTS public.award_loyalty_points();

-- Supprimer la table des points de fidélité
DROP TABLE IF EXISTS public.loyalty_points;

-- Supprimer la colonne newsletter_subscribed de la table profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS newsletter_subscribed;