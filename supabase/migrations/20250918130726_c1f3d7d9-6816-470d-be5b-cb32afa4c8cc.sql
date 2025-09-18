-- Ajouter des données fictives cohérentes avec les bons types
DO $$
DECLARE
    user1_id uuid;
    user2_id uuid; 
    user3_id uuid;
    order1_id uuid := gen_random_uuid();
    order2_id uuid := gen_random_uuid();
    order3_id uuid := gen_random_uuid();
    order4_id uuid := gen_random_uuid();
    order5_id uuid := gen_random_uuid();
    product1_id uuid;
    product2_id uuid;
    variant1_id uuid;
    variant2_id uuid;
BEGIN
    -- Récupérer des utilisateurs existants ou créer des profils fictifs
    SELECT user_id INTO user1_id FROM profiles WHERE email = 'but.iryna@gmail.com' LIMIT 1;
    SELECT user_id INTO user2_id FROM profiles WHERE email = 'but_iryna@inbox.ru' LIMIT 1;
    SELECT user_id INTO user3_id FROM profiles WHERE email = 'iryna.but@epitech.digital' LIMIT 1;
    
    -- Si pas d'utilisateurs, créer des profils fictifs temporaires
    IF user1_id IS NULL THEN
        user1_id := gen_random_uuid();
        INSERT INTO profiles (user_id, email, first_name, last_name, role) 
        VALUES (user1_id, 'marie.martin@example.com', 'Marie', 'Martin', 'client');
    END IF;
    
    IF user2_id IS NULL THEN
        user2_id := gen_random_uuid();
        INSERT INTO profiles (user_id, email, first_name, last_name, role)
        VALUES (user2_id, 'pierre.dubois@example.com', 'Pierre', 'Dubois', 'client');
    END IF;
    
    IF user3_id IS NULL THEN
        user3_id := gen_random_uuid();
        INSERT INTO profiles (user_id, email, first_name, last_name, role)
        VALUES (user3_id, 'sophie.bernard@example.com', 'Sophie', 'Bernard', 'client');
    END IF;
    
    -- Récupérer des produits existants
    SELECT id INTO product1_id FROM products LIMIT 1;
    SELECT id INTO product2_id FROM products WHERE id != product1_id LIMIT 1;
    
    -- Si pas de produits, utiliser des UUIDs fictifs
    IF product1_id IS NULL THEN
        product1_id := gen_random_uuid();
    END IF;
    
    IF product2_id IS NULL THEN
        product2_id := gen_random_uuid();
    END IF;
    
    -- Récupérer des variants existants
    SELECT id INTO variant1_id FROM product_variants WHERE product_id = product1_id LIMIT 1;
    SELECT id INTO variant2_id FROM product_variants WHERE product_id = product2_id LIMIT 1;
    
    -- Si pas de variants, utiliser des UUIDs fictifs
    IF variant1_id IS NULL THEN
        variant1_id := gen_random_uuid();
    END IF;
    
    IF variant2_id IS NULL THEN
        variant2_id := gen_random_uuid();
    END IF;

    -- Insérer des commandes fictives avec statuts valides
    INSERT INTO orders (id, user_id, order_number, status, payment_status, total_amount, created_at, billing_address, shipping_address, payment_method) VALUES
    (order1_id, user1_id, 'EDN-2025-001-1234', 'delivered', 'paid', 149.99, NOW() - INTERVAL '3 days', '{"street": "123 Rue de la Paix", "city": "Paris", "postalCode": "75001", "country": "France"}', '{"street": "123 Rue de la Paix", "city": "Paris", "postalCode": "75001", "country": "France"}', 'credit_card'),
    (order2_id, user2_id, 'EDN-2025-001-5678', 'shipped', 'paid', 89.99, NOW() - INTERVAL '1 day', '{"street": "456 Avenue des Champs", "city": "Lyon", "postalCode": "69001", "country": "France"}', '{"street": "456 Avenue des Champs", "city": "Lyon", "postalCode": "69001", "country": "France"}', 'paypal'),
    (order3_id, user3_id, 'EDN-2025-001-9012', 'pending', 'paid', 199.50, NOW() - INTERVAL '2 hours', '{"street": "789 Boulevard Saint-Germain", "city": "Marseille", "postalCode": "13001", "country": "France"}', '{"street": "789 Boulevard Saint-Germain", "city": "Marseille", "postalCode": "13001", "country": "France"}', 'bank_transfer'),
    (order4_id, user1_id, 'EDN-2025-001-3456', 'delivered', 'paid', 299.99, NOW() - INTERVAL '5 days', '{"street": "123 Rue de la Paix", "city": "Paris", "postalCode": "75001", "country": "France"}', '{"street": "123 Rue de la Paix", "city": "Paris", "postalCode": "75001", "country": "France"}', 'credit_card'),
    (order5_id, user2_id, 'EDN-2025-001-7890', 'pending', 'pending', 75.00, NOW() - INTERVAL '6 hours', '{"street": "456 Avenue des Champs", "city": "Lyon", "postalCode": "69001", "country": "France"}', '{"street": "456 Avenue des Champs", "city": "Lyon", "postalCode": "69001", "country": "France"}', 'credit_card');

    -- Insérer des articles de commande
    INSERT INTO order_items (order_id, product_id, variant_id, quantity, unit_price, total_price) VALUES
    (order1_id, product1_id, variant1_id, 1, 149.99, 149.99),
    (order2_id, product2_id, variant2_id, 1, 89.99, 89.99),
    (order3_id, product1_id, variant1_id, 1, 199.50, 199.50),
    (order4_id, product1_id, variant1_id, 2, 149.99, 299.98),
    (order5_id, product2_id, variant2_id, 1, 75.00, 75.00);

    -- Insérer des factures cohérentes avec les bons types
    INSERT INTO invoices (invoice_number, type, order_id, variant_id, supplier_name, supplier_contact, total_amount, unit_price, quantity, status, payment_method, currency, due_date, paid_date, created_at, metadata) VALUES
    ('FACT-2025-001', 'client', order1_id, NULL, NULL, NULL, 149.99, 149.99, 1, 'paid', 'credit_card', 'EUR', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', '{"client_name": "Marie Martin", "tracking_number": "FR123456789"}'),
    ('FACT-2025-002', 'client', order2_id, NULL, NULL, NULL, 89.99, 89.99, 1, 'paid', 'paypal', 'EUR', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', '{"client_name": "Pierre Dubois", "tracking_number": "FR987654321"}'),
    ('FACT-2025-003', 'client', order3_id, NULL, NULL, NULL, 199.50, 199.50, 1, 'paid', 'bank_transfer', 'EUR', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', '{"client_name": "Sophie Bernard"}'),
    ('FACT-2025-004', 'client', order4_id, NULL, NULL, NULL, 299.99, 149.99, 2, 'paid', 'credit_card', 'EUR', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', '{"client_name": "Marie Martin", "tracking_number": "FR555666777"}'),
    ('FACT-FOUR-001', 'supplier', NULL, variant1_id, 'Nike France', 'commandes@nike.fr', 1200.00, 85.00, 20, 'paid', 'bank_transfer', 'EUR', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '8 days', '{"restock_batch": "NIKE-RST-001", "delivery_date": "2025-01-25"}'),
    ('FACT-FOUR-002', 'supplier', NULL, variant2_id, 'Adidas Europe', 'supply@adidas.eu', 900.00, 75.00, 15, 'pending', 'credit_card', 'EUR', NOW() + INTERVAL '7 days', NULL, NOW() - INTERVAL '2 days', '{"restock_batch": "ADIDAS-RST-002", "delivery_date": "2025-01-30"}');

    -- Insérer des paiements pour les commandes
    INSERT INTO payments (order_id, amount, payment_method, status, currency, created_at, metadata) VALUES
    (order1_id, 149.99, 'credit_card', 'completed', 'EUR', NOW() - INTERVAL '3 days', '{"transaction_id": "TX_123456", "card_last4": "1234"}'),
    (order2_id, 89.99, 'paypal', 'completed', 'EUR', NOW() - INTERVAL '1 day', '{"paypal_transaction_id": "PP_987654", "payer_email": "pierre.dubois@example.com"}'),
    (order3_id, 199.50, 'bank_transfer', 'completed', 'EUR', NOW() - INTERVAL '2 hours', '{"iban_last4": "5678", "reference": "VIRT789012"}'),
    (order4_id, 299.99, 'credit_card', 'completed', 'EUR', NOW() - INTERVAL '5 days', '{"transaction_id": "TX_345678", "card_last4": "9876"}');
    
END $$;