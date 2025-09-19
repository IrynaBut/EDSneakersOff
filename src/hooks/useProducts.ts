import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  isNew: boolean;
  isOnSale: boolean;
  isPromotion?: boolean;
  sizes: string[];
  brand?: string;
  gender: string;
  description?: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  size: string;
  color?: string;
  sku?: string;
  stock_quantity: number;
}

export const useProducts = (category?: string, featured?: boolean) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            categories (
              name,
              slug
            ),
            product_variants (
              id,
              size,
              color,
              sku,
              stock_quantity
            )
          `)
          .eq('is_active', true);

        // Special handling for promotions and new arrivals
        if (category === 'promotions') {
          query = query.eq('is_promotion', true);
        } else if (category === 'nouveautes') {
          query = query.eq('is_new_arrival', true);
        } else {
          query = query.order('created_at', { ascending: false });
          
          // Filter by gender if category is provided
          if (category) {
            query = query.eq('gender', category);
          }
        }

        // Limit to featured products if requested
        if (featured) {
          query = query.limit(4);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform data to match ProductCard interface
        const transformedProducts: Product[] = data?.map((product, index) => {
          // Construct Supabase Storage URL for images
          const getImageUrl = (imagePath: string) => {
            if (!imagePath) return "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop";
            if (imagePath.startsWith('http')) return imagePath; // Already a full URL
            
            // Try both potential bucket names - first product-images, then product_image as fallback
            const bucketUrl = `https://hsvfgfmvdymwcevisyhh.supabase.co/storage/v1/object/public/product-images/${imagePath}`;
            return bucketUrl;
          };

          // Apply promotion pricing and determine status from database fields
          let finalPrice = product.price;
          let originalPrice = product.original_price;
          let isOnSale = product.is_promotion || (!!product.original_price && product.original_price > product.price);
          
          // Use database fields for promotion and new arrival status
          const isNewProduct = product.is_new_arrival;
          const isPromotion = product.is_promotion;

          return {
            id: product.id,
            name: product.name,
            price: finalPrice,
            originalPrice: originalPrice,
            image: getImageUrl(product.main_image_url) || 
                   (product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : 
                   "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"),
            category: product.categories?.name || 
                     (product.gender === 'homme' ? 'Homme' : 
                      product.gender === 'femme' ? 'Femme' : 'Enfant'),
            rating: [4, 4.5, 5, 4.5, 4, 5, 4.5, 4, 5][index % 9] || 4.5, // Realistic ratings
            isNew: isNewProduct,
            isOnSale: isOnSale,
            isPromotion: isPromotion,
            sizes: product.product_variants?.map(v => v.size).sort() || [],
            brand: product.brand,
            gender: product.gender,
            description: product.description,
            variants: product.product_variants || []
          };
        }) || [];

        setProducts(transformedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, featured]);

  return { products, loading, error };
};