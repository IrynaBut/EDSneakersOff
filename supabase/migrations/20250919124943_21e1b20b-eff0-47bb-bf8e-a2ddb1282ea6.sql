-- Ajouter des champs pour marquer explicitement les promotions et nouveautés
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_promotion boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_new_arrival boolean DEFAULT false;