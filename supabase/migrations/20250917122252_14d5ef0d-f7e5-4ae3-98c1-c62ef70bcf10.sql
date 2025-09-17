-- Insérer les 3 comptes de test avec leurs rôles spécifiques
-- Ces comptes seront créés automatiquement via le trigger handle_new_user lors de l'inscription

-- Mais on peut préparer des données pour forcer les rôles lors de l'inscription
-- Créer une fonction pour assigner automatiquement les rôles selon l'email

CREATE OR REPLACE FUNCTION public.assign_role_by_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Assigner le rôle admin pour but.iryna@gmail.com
  IF NEW.email = 'but.iryna@gmail.com' THEN
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE user_id = NEW.id;
    
  -- Assigner le rôle vendeur pour but_iryna@inbox.ru  
  ELSIF NEW.email = 'but_iryna@inbox.ru' THEN
    UPDATE public.profiles 
    SET role = 'vendeur' 
    WHERE user_id = NEW.id;
    
  -- Assigner le rôle client pour iryna.but@epitech.digital
  ELSIF NEW.email = 'iryna.but@epitech.digital' THEN
    UPDATE public.profiles 
    SET role = 'client' 
    WHERE user_id = NEW.id;
    
  -- Par défaut, tous les autres utilisateurs sont clients
  ELSE
    UPDATE public.profiles 
    SET role = 'client' 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Créer le trigger pour assigner automatiquement les rôles
DROP TRIGGER IF EXISTS on_auth_user_role_assignment ON auth.users;
CREATE TRIGGER on_auth_user_role_assignment
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.assign_role_by_email();

-- Améliorer les politiques RLS pour les différents rôles

-- Politique pour que les vendeurs puissent voir tous les profils (pour gérer les clients)
CREATE POLICY "Vendeurs can view client profiles" ON public.profiles
FOR SELECT 
USING (
  has_role(auth.uid(), 'vendeur') AND 
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('vendeur', 'admin')
);

-- Politique pour que les vendeurs puissent mettre à jour les stocks
CREATE POLICY "Vendeurs can update stock" ON public.product_variants
FOR UPDATE 
USING (has_role(auth.uid(), 'vendeur') OR has_role(auth.uid(), 'admin'));

-- Améliorer les politiques des commandes pour les vendeurs
DROP POLICY IF EXISTS "Vendeurs can update orders" ON public.orders;
CREATE POLICY "Vendeurs can update orders" ON public.orders
FOR UPDATE 
USING (has_role(auth.uid(), 'vendeur') OR has_role(auth.uid(), 'admin'));

-- Politique pour que les vendeurs puissent créer des paiements
CREATE POLICY "Vendeurs can create payments" ON public.payments
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'vendeur') OR has_role(auth.uid(), 'admin'));

-- Ajouter une table pour les points de fidélité des clients
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS sur loyalty_points
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour loyalty_points
CREATE POLICY "Users can view their own points" ON public.loyalty_points
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points" ON public.loyalty_points
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and vendeurs can view all points" ON public.loyalty_points
FOR SELECT 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendeur'));

CREATE POLICY "System can update loyalty points" ON public.loyalty_points
FOR UPDATE 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendeur'));

-- Trigger pour mettre à jour updated_at sur loyalty_points
CREATE TRIGGER update_loyalty_points_updated_at
BEFORE UPDATE ON public.loyalty_points
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour attribuer des points de fidélité lors d'une commande
CREATE OR REPLACE FUNCTION public.award_loyalty_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Attribuer 1 point pour chaque euro dépensé quand une commande est complétée
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO public.loyalty_points (user_id, points, total_earned)
    VALUES (NEW.user_id, FLOOR(NEW.total_amount), FLOOR(NEW.total_amount))
    ON CONFLICT (user_id) DO UPDATE SET
      points = loyalty_points.points + FLOOR(NEW.total_amount),
      total_earned = loyalty_points.total_earned + FLOOR(NEW.total_amount),
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;