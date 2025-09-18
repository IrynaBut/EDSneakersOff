-- Create invoices table for tracking supplier and client invoices
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('supplier', 'client')),
  supplier_name TEXT,
  supplier_contact TEXT,
  order_id UUID REFERENCES public.orders(id),
  variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER,
  unit_price NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create RLS policies for invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and vendeurs can manage invoices" 
ON public.invoices 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::text) OR has_role(auth.uid(), 'vendeur'::text))
WITH CHECK (has_role(auth.uid(), 'admin'::text) OR has_role(auth.uid(), 'vendeur'::text));

-- Add trigger for timestamp updates
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add more sample orders for better statistics
INSERT INTO public.orders (id, user_id, order_number, status, total_amount, shipping_address, billing_address, payment_status, payment_method, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT user_id FROM public.profiles WHERE email = 'iryna.but@epitech.digital'), 'EDN-2024-001-0001', 'completed', 250.00, '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', 'paid', 'credit_card', '2024-09-10 10:30:00+00'),
('550e8400-e29b-41d4-a716-446655440002', (SELECT user_id FROM public.profiles WHERE email = 'iryna.but@epitech.digital'), 'EDN-2024-001-0002', 'completed', 180.00, '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', 'paid', 'paypal', '2024-09-12 14:15:00+00'),
('550e8400-e29b-41d4-a716-446655440003', (SELECT user_id FROM public.profiles WHERE email = 'iryna.but@epitech.digital'), 'EDN-2024-001-0003', 'shipped', 320.00, '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', 'paid', 'credit_card', '2024-09-15 09:45:00+00'),
('550e8400-e29b-41d4-a716-446655440004', (SELECT user_id FROM public.profiles WHERE email = 'iryna.but@epitech.digital'), 'EDN-2024-001-0004', 'processing', 95.00, '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', 'paid', 'bank_transfer', '2024-09-16 16:20:00+00'),
('550e8400-e29b-41d4-a716-446655440005', (SELECT user_id FROM public.profiles WHERE email = 'iryna.but@epitech.digital'), 'EDN-2024-001-0005', 'pending', 145.00, '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', 'pending', 'credit_card', '2024-09-17 11:10:00+00'),
('550e8400-e29b-41d4-a716-446655440006', (SELECT user_id FROM public.profiles WHERE email = 'iryna.but@epitech.digital'), 'EDN-2024-001-0006', 'completed', 299.99, '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', 'paid', 'paypal', '2024-09-13 13:30:00+00'),
('550e8400-e29b-41d4-a716-446655440007', (SELECT user_id FROM public.profiles WHERE email = 'iryna.but@epitech.digital'), 'EDN-2024-001-0007', 'delivered', 87.50, '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', 'paid', 'credit_card', '2024-09-08 08:45:00+00'),
('550e8400-e29b-41d4-a716-446655440008', (SELECT user_id FROM public.profiles WHERE email = 'iryna.but@epitech.digital'), 'EDN-2024-001-0008', 'completed', 199.00, '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', '{"street": "123 Rue Example", "city": "Paris", "postal_code": "75001"}', 'paid', 'bank_transfer', '2024-09-11 15:20:00+00');

-- Add corresponding order items for the new orders
INSERT INTO public.order_items (order_id, product_id, variant_id, quantity, unit_price, total_price) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  pv.product_id,
  pv.id,
  2,
  125.00,
  250.00
FROM public.product_variants pv 
WHERE pv.size = '42' 
LIMIT 1;

INSERT INTO public.order_items (order_id, product_id, variant_id, quantity, unit_price, total_price) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440002',
  pv.product_id,
  pv.id,
  1,
  180.00,
  180.00
FROM public.product_variants pv 
WHERE pv.size = '40' 
LIMIT 1;

INSERT INTO public.order_items (order_id, product_id, variant_id, quantity, unit_price, total_price) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440003',
  pv.product_id,
  pv.id,
  2,
  160.00,
  320.00
FROM public.product_variants pv 
WHERE pv.size = '44' 
LIMIT 1;

INSERT INTO public.order_items (order_id, product_id, variant_id, quantity, unit_price, total_price) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440004',
  pv.product_id,
  pv.id,
  1,
  95.00,
  95.00
FROM public.product_variants pv 
WHERE pv.size = '38' 
LIMIT 1;

INSERT INTO public.order_items (order_id, product_id, variant_id, quantity, unit_price, total_price) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440005',
  pv.product_id,
  pv.id,
  1,
  145.00,
  145.00
FROM public.product_variants pv 
WHERE pv.size = '41' 
LIMIT 1;

INSERT INTO public.order_items (order_id, product_id, variant_id, quantity, unit_price, total_price) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440006',
  pv.product_id,
  pv.id,
  1,
  299.99,
  299.99
FROM public.product_variants pv 
WHERE pv.size = '43' 
LIMIT 1;

INSERT INTO public.order_items (order_id, product_id, variant_id, quantity, unit_price, total_price) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440007',
  pv.product_id,
  pv.id,
  1,
  87.50,
  87.50
FROM public.product_variants pv 
WHERE pv.size = '39' 
LIMIT 1;

INSERT INTO public.order_items (order_id, product_id, variant_id, quantity, unit_price, total_price) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440008',
  pv.product_id,
  pv.id,
  1,
  199.00,
  199.00
FROM public.product_variants pv 
WHERE pv.size = '42' 
LIMIT 1;