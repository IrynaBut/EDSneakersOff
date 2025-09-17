import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  billing_address: any;
  shipping_address: any;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  payments?: Payment[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name?: string;
  product_image?: string;
  variant_size?: string;
  variant_color?: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_provider?: string;
  provider_transaction_id?: string;
  status: string;
  failure_reason?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  billing_address: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
  shipping_address: {
    first_name: string;
    last_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
  payment_method: string;
  notes?: string;
}

export const useOrders = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createOrder = async (orderData: CreateOrderData): Promise<{ order?: Order; error?: string }> => {
    if (!user) {
      return { error: 'Vous devez être connecté pour passer une commande' };
    }

    setLoading(true);
    try {
      // 1. Get cart items
      const { data: cartItems, error: cartError } = await supabase
        .from('cart')
        .select(`
          *,
          products (name, price, main_image_url),
          product_variants (size, color)
        `)
        .eq('user_id', user.id);

      if (cartError) throw cartError;
      if (!cartItems || cartItems.length === 0) {
        return { error: 'Votre panier est vide' };
      }

      // 2. Calculate total
      const totalAmount = cartItems.reduce((sum, item) => 
        sum + (item.products?.price || 0) * item.quantity, 0
      );

      // 3. Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: `EDN-${Date.now()}`, // Temporary, will use DB function later
          status: 'pending',
          payment_status: 'pending',
          total_amount: totalAmount,
          billing_address: orderData.billing_address,
          shipping_address: orderData.shipping_address,
          payment_method: orderData.payment_method,
          notes: orderData.notes
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 4. Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.products?.price || 0,
        total_price: (item.products?.price || 0) * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 5. Clear cart
      const { error: clearCartError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      if (clearCartError) throw clearCartError;

      toast.success('Commande créée avec succès !');
      return { order };

    } catch (error: any) {
      console.error('Error creating order:', error);
      const errorMessage = error.message || 'Erreur lors de la création de la commande';
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getOrders = async (): Promise<{ orders?: Order[]; error?: string }> => {
    if (!user) {
      return { error: 'Vous devez être connecté' };
    }

    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, main_image_url),
            product_variants (size, color)
          ),
          payments (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data
      const transformedOrders: Order[] = orders?.map(order => ({
        ...order,
        order_items: order.order_items?.map((item: any) => ({
          ...item,
          product_name: item.products?.name,
          product_image: item.products?.main_image_url,
          variant_size: item.product_variants?.size,
          variant_color: item.product_variants?.color,
        })) || [],
        payments: order.payments || []
      })) || [];

      return { orders: transformedOrders };
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      return { error: error.message || 'Erreur lors du chargement des commandes' };
    }
  };

  const getOrder = async (orderId: string): Promise<{ order?: Order; error?: string }> => {
    if (!user) {
      return { error: 'Vous devez être connecté' };
    }

    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, main_image_url),
            product_variants (size, color)
          ),
          payments (*)
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Transform data
      const transformedOrder: Order = {
        ...order,
        order_items: order.order_items?.map((item: any) => ({
          ...item,
          product_name: item.products?.name,
          product_image: item.products?.main_image_url,
          variant_size: item.product_variants?.size,
          variant_color: item.product_variants?.color,
        })) || [],
        payments: order.payments || []
      };

      return { order: transformedOrder };
    } catch (error: any) {
      console.error('Error fetching order:', error);
      return { error: error.message || 'Erreur lors du chargement de la commande' };
    }
  };

  const createPayment = async (orderId: string, paymentData: {
    amount: number;
    payment_method: string;
    payment_provider?: string;
    provider_transaction_id?: string;
    metadata?: any;
  }): Promise<{ payment?: Payment; error?: string }> => {
    if (!user) {
      return { error: 'Vous devez être connecté' };
    }

    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          amount: paymentData.amount,
          currency: 'EUR',
          payment_method: paymentData.payment_method,
          payment_provider: paymentData.payment_provider,
          provider_transaction_id: paymentData.provider_transaction_id,
          status: 'pending',
          metadata: paymentData.metadata
        })
        .select()
        .single();

      if (error) throw error;

      return { payment };
    } catch (error: any) {
      console.error('Error creating payment:', error);
      return { error: error.message || 'Erreur lors de la création du paiement' };
    }
  };

  return {
    loading,
    createOrder,
    getOrders,
    getOrder,
    createPayment
  };
};