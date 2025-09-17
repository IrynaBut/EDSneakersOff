import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Populated from joins
  product_name?: string;
  product_price?: number;
  product_image?: string;
  variant_size?: string;
  variant_color?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  loading: boolean;
  addToCart: (product_id: string, variant_id: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user, session } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');

  // Generate session ID for anonymous users
  useEffect(() => {
    if (!sessionId) {
      const id = localStorage.getItem('anonymous_session_id') || 
                `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('anonymous_session_id', id);
      setSessionId(id);
    }
  }, [sessionId]);

  // Calculate totals
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => 
    sum + (item.product_price || 0) * item.quantity, 0
  );

  const fetchCart = async () => {
    if (!sessionId && !user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('cart')
        .select(`
          *,
          products (
            name,
            price,
            main_image_url
          ),
          product_variants (
            size,
            color
          )
        `);

      // Filter by user or session
      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', sessionId).is('user_id', null);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data
      const transformedItems: CartItem[] = data?.map(item => ({
        ...item,
        product_name: item.products?.name,
        product_price: item.products?.price,
        product_image: item.products?.main_image_url,
        variant_size: item.product_variants?.size,
        variant_color: item.product_variants?.color,
      })) || [];

      setItems(transformedItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Erreur lors du chargement du panier');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product_id: string, variant_id: string, quantity: number = 1) => {
    try {
      // Check if item already exists in cart
      const existingItem = items.find(
        item => item.product_id === product_id && item.variant_id === variant_id
      );

      if (existingItem) {
        // Update quantity
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
        return;
      }

      // Add new item
      const insertData: any = {
        product_id,
        variant_id,
        quantity,
      };

      if (user) {
        insertData.user_id = user.id;
      } else {
        insertData.session_id = sessionId;
      }

      const { error } = await supabase
        .from('cart')
        .insert(insertData);

      if (error) throw error;

      await fetchCart();
      toast.success('Produit ajouté au panier');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  const updateQuantity = async (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', cartId);

      if (error) throw error;

      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const removeFromCart = async (cartId: string) => {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartId);

      if (error) throw error;

      await fetchCart();
      toast.success('Produit retiré du panier');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const clearCart = async () => {
    try {
      let query = supabase.from('cart').delete();

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', sessionId).is('user_id', null);
      }

      const { error } = await query;
      if (error) throw error;

      setItems([]);
      toast.success('Panier vidé');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Merge anonymous cart with user cart on login
  useEffect(() => {
    const mergeAnonymousCart = async () => {
      if (user && sessionId && items.length > 0) {
        try {
          // Update anonymous cart items to use user_id
          const { error } = await supabase
            .from('cart')
            .update({ 
              user_id: user.id,
              session_id: null,
              updated_at: new Date().toISOString()
            })
            .eq('session_id', sessionId)
            .is('user_id', null);

          if (error) throw error;
          
          await fetchCart();
        } catch (error) {
          console.error('Error merging cart:', error);
        }
      }
    };

    if (user && sessionId) {
      mergeAnonymousCart();
    } else if (sessionId) {
      fetchCart();
    }
  }, [user, sessionId]);

  // Refresh cart when session changes
  useEffect(() => {
    if (sessionId) {
      fetchCart();
    }
  }, [session]);

  const value = {
    items,
    itemCount,
    totalAmount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};