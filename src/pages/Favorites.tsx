import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/hooks/useProducts";

const Favorites = () => {
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
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
          .in('id', favorites)
          .eq('is_active', true);

        if (error) throw error;

        const transformedProducts: Product[] = data?.map(product => {
          const getImageUrl = (imagePath: string) => {
            if (!imagePath) return "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop";
            if (imagePath.startsWith('http')) return imagePath;
            return `https://hsvfgfmvdymwcevisyhh.supabase.co/storage/v1/object/public/product-images/${imagePath}`;
          };

          return {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.original_price,
            image: getImageUrl(product.main_image_url) || 
                   (product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : 
                   "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"),
            category: product.categories?.name || 
                     (product.gender === 'homme' ? 'Homme' : 
                      product.gender === 'femme' ? 'Femme' : 'Enfant'),
            rating: 5,
            isNew: new Date(product.created_at).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000),
            isOnSale: !!product.original_price && product.original_price > product.price,
            sizes: product.product_variants?.map(v => v.size).sort() || [],
            brand: product.brand,
            gender: product.gender,
            description: product.description,
            variants: product.product_variants || []
          };
        }) || [];

        setFavoriteProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching favorite products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favorites]);

  if (favoritesLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <Heart className="w-8 h-8 text-primary" />
                <span>Mes Favoris</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                {favoriteProducts.length} produit{favoriteProducts.length !== 1 ? 's' : ''} favori{favoriteProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Aucun favori</h2>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore ajouté de produits à vos favoris.
            </p>
            <Button asChild>
              <Link to="/">
                Découvrir nos produits
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;