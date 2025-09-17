-- Create payments table to track individual payment transactions
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    payment_method TEXT NOT NULL, -- 'card', 'paypal', 'bank_transfer', etc.
    payment_provider TEXT, -- 'stripe', 'paypal', etc.
    provider_transaction_id TEXT, -- Transaction ID from payment provider
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'
    failure_reason TEXT,
    metadata JSONB, -- Additional payment data (fees, provider response, etc.)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = payments.order_id 
        AND orders.user_id = auth.uid()
    )
);

CREATE POLICY "Admins and vendeurs can view all payments" 
ON public.payments 
FOR SELECT 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendeur'));

CREATE POLICY "Admins and vendeurs can manage payments" 
ON public.payments 
FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendeur'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendeur'));

-- Add index for performance
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_provider_transaction_id ON public.payments(provider_transaction_id);

-- Trigger for updating timestamps
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add payment tracking to orders (optional enhancement)
-- This helps track payment status at order level
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_payment_attempt TIMESTAMP WITH TIME ZONE;