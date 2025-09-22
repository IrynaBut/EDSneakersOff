-- Marquer 10 produits en promotion avec des réductions de 5% à 20%
-- Répartis entre homme, femme, enfant

-- Promotions Homme (4 produits avec réductions variées)
UPDATE public.products 
SET is_promotion = true,
    original_price = price,
    price = ROUND(price * 0.95, 2) -- -5%
WHERE id = '3def7403-835f-45de-bcfa-7f8c1f1f9e23';

UPDATE public.products 
SET is_promotion = true,
    original_price = price,
    price = ROUND(price * 0.90, 2) -- -10%
WHERE id = '2258021c-64de-4341-b432-6a0c58df48e5';

UPDATE public.products 
SET is_promotion = true,
    original_price = price,
    price = ROUND(price * 0.85, 2) -- -15%
WHERE id = '19037855-2f3e-4550-88d2-8563cee5f0a3';

UPDATE public.products 
SET is_promotion = true,
    original_price = price,
    price = ROUND(price * 0.80, 2) -- -20%
WHERE id = '28e7470e-1677-4bc3-80a2-f4930e6a2160';

-- Promotions Femme (3 produits)
UPDATE public.products 
SET is_promotion = true,
    original_price = price,
    price = ROUND(price * 0.92, 2) -- -8%
WHERE id = '6d34e8bf-4cef-48b3-9341-a87a4819f604';

UPDATE public.products 
SET is_promotion = true,
    original_price = price,
    price = ROUND(price * 0.88, 2) -- -12%
WHERE id = '3a137947-ccec-4ffd-a66e-58c4e62053a4';

UPDATE public.products 
SET is_promotion = true,
    original_price = price,
    price = ROUND(price * 0.83, 2) -- -17%
WHERE id = '4cabfd49-4ec4-400d-82d9-2a587ffb63a5';

-- Promotions Enfant (3 produits)
UPDATE public.products 
SET is_promotion = true,
    original_price = price,
    price = ROUND(price * 0.93, 2) -- -7%
WHERE id = '175621f1-1507-497f-9414-e76d22c85e35';

UPDATE public.products 
SET is_promotion = true,
    original_price = price,
    price = ROUND(price * 0.87, 2) -- -13%
WHERE id = '7ede942a-bcd5-4530-8b05-1f021ac8f838';

UPDATE public.products 
SET is_promotion = true,
    original_price = price,
    price = ROUND(price * 0.82, 2) -- -18%
WHERE id = 'b02e8097-aa8a-4fe2-8375-145d53a2eaff';

-- Marquer 10 produits comme nouveautés
-- Répartis entre homme, femme, enfant

-- Nouveautés Homme (4 produits)
UPDATE public.products 
SET is_new_arrival = true
WHERE id IN (
    '8182cafe-9881-4ad2-adf1-944221055e71',
    '84fef2f0-ae1b-4074-98cf-8dcaa5a28b0c',
    '6e4240e7-66d5-4714-9010-fa607fd0184f',
    '8c5add97-2102-409f-82e2-0c9739fbae3c'
);

-- Nouveautés Femme (3 produits)
UPDATE public.products 
SET is_new_arrival = true
WHERE id IN (
    '3ee56dd9-79bd-47c5-84ff-55547d440e66',
    '69ea761e-d025-41b1-b606-29235ce90d6c',
    '33f4b8b8-8732-42e9-810e-7081c28c54e0'
);

-- Nouveautés Enfant (3 produits)
UPDATE public.products 
SET is_new_arrival = true
WHERE id IN (
    '0fb6391a-25b4-4820-b22b-78cc72de368f',
    '607ccc39-61d2-43c4-9f94-adcab5016634',
    '00a0e6f8-6f26-4d24-8233-ac612e6c9af1'
);