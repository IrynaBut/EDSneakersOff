-- Clean up invalid orders and create proper sample orders for iryna.but@epitech.digital

-- First, let's clean up any invalid orders (processing, pending payment)
DELETE FROM order_items WHERE order_id IN (
  SELECT id FROM orders WHERE status IN ('processing', 'pending')
);

DELETE FROM orders WHERE status IN ('processing', 'pending');

-- Get the user_id for iryna.but@epitech.digital
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Find the user_id for iryna.but@epitech.digital
    SELECT user_id INTO target_user_id 
    FROM profiles 
    WHERE email = 'iryna.but@epitech.digital';
    
    -- If user doesn't exist, skip
    IF target_user_id IS NULL THEN
        RAISE NOTICE 'User iryna.but@epitech.digital not found';
        RETURN;
    END IF;
    
    -- Clean up existing orders for this user first
    DELETE FROM order_items WHERE order_id IN (
        SELECT id FROM orders WHERE user_id = target_user_id
    );
    DELETE FROM orders WHERE user_id = target_user_id;
    
    -- Insert first order: DELIVERED
    INSERT INTO orders (
        id,
        user_id,
        order_number,
        status,
        payment_status,
        total_amount,
        billing_address,
        shipping_address,
        payment_method,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        target_user_id,
        'EDN-2024-156-7891',
        'delivered',
        'paid',
        129.98,
        '{"first_name": "Iryna", "last_name": "But", "email": "iryna.but@epitech.digital", "phone": "+33 6 12 34 56 78", "address_line_1": "15 rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "France"}',
        '{"first_name": "Iryna", "last_name": "But", "address_line_1": "15 rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "France"}',
        'card',
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '10 days'
    );
    
    -- Insert second order: SHIPPED
    INSERT INTO orders (
        id,
        user_id,
        order_number,
        status,
        payment_status,
        total_amount,
        billing_address,
        shipping_address,
        payment_method,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        target_user_id,
        'EDN-2024-261-4567',
        'shipped',
        'paid',
        85.99,
        '{"first_name": "Iryna", "last_name": "But", "email": "iryna.but@epitech.digital", "phone": "+33 6 12 34 56 78", "address_line_1": "Point Relais - Tabac Presse Le Marais", "address_line_2": "23 rue des Rosiers", "city": "Paris", "postal_code": "75004", "country": "France", "is_pickup_point": true}',
        '{"first_name": "Iryna", "last_name": "But", "address_line_1": "Point Relais - Tabac Presse Le Marais", "address_line_2": "23 rue des Rosiers", "city": "Paris", "postal_code": "75004", "country": "France", "is_pickup_point": true}',
        'card',
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '3 days'
    );
    
END $$;

-- Now create order items for these orders
DO $$
DECLARE
    target_user_id UUID;
    order1_id UUID;
    order2_id UUID;
    product1_id UUID;
    product2_id UUID;
    variant1_id UUID;
    variant2_id UUID;
BEGIN
    -- Get user_id
    SELECT user_id INTO target_user_id 
    FROM profiles 
    WHERE email = 'iryna.but@epitech.digital';
    
    IF target_user_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Get order IDs
    SELECT id INTO order1_id FROM orders WHERE user_id = target_user_id AND order_number = 'EDN-2024-156-7891';
    SELECT id INTO order2_id FROM orders WHERE user_id = target_user_id AND order_number = 'EDN-2024-261-4567';
    
    -- Get some product and variant IDs (assuming they exist)
    SELECT id INTO product1_id FROM products LIMIT 1;
    SELECT id INTO product2_id FROM products LIMIT 1 OFFSET 1;
    
    IF product1_id IS NOT NULL THEN
        SELECT id INTO variant1_id FROM product_variants WHERE product_id = product1_id LIMIT 1;
    END IF;
    
    IF product2_id IS NOT NULL THEN
        SELECT id INTO variant2_id FROM product_variants WHERE product_id = product2_id LIMIT 1;
    END IF;
    
    -- Insert order items for first order (delivered)
    IF order1_id IS NOT NULL AND variant1_id IS NOT NULL THEN
        INSERT INTO order_items (
            order_id,
            product_id,
            variant_id,
            quantity,
            unit_price,
            total_price
        ) VALUES 
        (order1_id, product1_id, variant1_id, 2, 64.99, 129.98);
    END IF;
    
    -- Insert order items for second order (shipped)
    IF order2_id IS NOT NULL AND variant2_id IS NOT NULL THEN
        INSERT INTO order_items (
            order_id,
            product_id,
            variant_id,
            quantity,
            unit_price,
            total_price
        ) VALUES 
        (order2_id, product2_id, variant2_id, 1, 85.99, 85.99);
    END IF;
    
END $$;