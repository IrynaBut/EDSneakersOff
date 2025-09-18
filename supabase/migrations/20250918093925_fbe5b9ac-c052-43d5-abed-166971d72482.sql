-- Mise à jour des stocks avec des valeurs réalistes et variées
UPDATE product_variants SET stock_quantity = 5 WHERE id IN (
  SELECT id FROM product_variants ORDER BY RANDOM() LIMIT 3
);

UPDATE product_variants SET stock_quantity = 15 WHERE id IN (
  SELECT id FROM product_variants WHERE stock_quantity != 5 ORDER BY RANDOM() LIMIT 4
);

UPDATE product_variants SET stock_quantity = 3 WHERE id IN (
  SELECT id FROM product_variants WHERE stock_quantity NOT IN (5, 15) ORDER BY RANDOM() LIMIT 2
);

UPDATE product_variants SET stock_quantity = 50 WHERE stock_quantity NOT IN (5, 15, 3);

-- Ajouter le champ newsletter_subscribed aux profils
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS newsletter_subscribed BOOLEAN DEFAULT false;

-- Ajouter des champs d'adresse structurés
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS street_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS street_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Créer des commandes fictives pour le dashboard
INSERT INTO public.orders (user_id, order_number, status, total_amount, payment_status, shipping_address, billing_address, created_at) VALUES
-- Commande 1
((SELECT user_id FROM profiles WHERE email = 'iryna.but@epitech.digital' LIMIT 1), 'EDN-2024-001-1234', 'completed', 129.99, 'paid', '{"street": "15 rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "France"}', '{"street": "15 rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "France"}', NOW() - INTERVAL '15 days'),

-- Commande 2  
((SELECT user_id FROM profiles WHERE email = 'iryna.but@epitech.digital' LIMIT 1), 'EDN-2024-002-5678', 'shipped', 89.99, 'paid', '{"street": "23 avenue des Champs", "city": "Lyon", "postal_code": "69001", "country": "France"}', '{"street": "23 avenue des Champs", "city": "Lyon", "postal_code": "69001", "country": "France"}', NOW() - INTERVAL '8 days'),

-- Commande 3
((SELECT user_id FROM profiles WHERE email = 'iryna.but@epitech.digital' LIMIT 1), 'EDN-2024-003-9012', 'processing', 199.99, 'paid', '{"street": "45 boulevard Saint-Germain", "city": "Marseille", "postal_code": "13001", "country": "France"}', '{"street": "45 boulevard Saint-Germain", "city": "Marseille", "postal_code": "13001", "country": "France"}', NOW() - INTERVAL '3 days'),

-- Commande 4
((SELECT user_id FROM profiles WHERE email = 'iryna.but@epitech.digital' LIMIT 1), 'EDN-2024-004-3456', 'delivered', 149.99, 'paid', '{"street": "12 place Bellecour", "city": "Toulouse", "postal_code": "31000", "country": "France"}', '{"street": "12 place Bellecour", "city": "Toulouse", "postal_code": "31000", "country": "France"}', NOW() - INTERVAL '20 days'),

-- Commande 5
((SELECT user_id FROM profiles WHERE email = 'iryna.but@epitech.digital' LIMIT 1), 'EDN-2024-005-7890', 'pending', 75.99, 'pending', '{"street": "67 rue Victor Hugo", "city": "Lille", "postal_code": "59000", "country": "France"}', '{"street": "67 rue Victor Hugo", "city": "Lille", "postal_code": "59000", "country": "France"}', NOW() - INTERVAL '1 day'),

-- Commande 6
((SELECT user_id FROM profiles WHERE email = 'iryna.but@epitech.digital' LIMIT 1), 'EDN-2024-006-2468', 'completed', 249.99, 'paid', '{"street": "89 cours Mirabeau", "city": "Aix-en-Provence", "postal_code": "13100", "country": "France"}', '{"street": "89 cours Mirabeau", "city": "Aix-en-Provence", "postal_code": "13100", "country": "France"}', NOW() - INTERVAL '12 days');

-- Créer des items de commande pour ces commandes fictives
INSERT INTO public.order_items (order_id, product_id, variant_id, quantity, unit_price, total_price) 
SELECT 
  o.id as order_id,
  p.id as product_id,
  pv.id as variant_id,
  1 as quantity,
  p.price as unit_price,
  p.price as total_price
FROM orders o
CROSS JOIN LATERAL (
  SELECT id, price FROM products ORDER BY RANDOM() LIMIT 1
) p
CROSS JOIN LATERAL (
  SELECT id FROM product_variants WHERE product_id = p.id ORDER BY RANDOM() LIMIT 1  
) pv
WHERE o.order_number LIKE 'EDN-2024-%';