import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  main_image_url?: string;
  brand?: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, main_image_url, brand')
          .eq('is_active', true)
          .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)
          .limit(10);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop";
    if (imagePath.startsWith('http')) return imagePath;
    return `https://hsvfgfmvdymwcevisyhh.supabase.co/storage/v1/object/public/product-images/${imagePath}`;
  };

  const handleProductClick = () => {
    onOpenChange(false);
    setSearchTerm("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Rechercher des produits</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou marque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {!loading && searchTerm && results.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun produit trouvé pour "{searchTerm}"
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/produit/${product.id}`}
                    onClick={handleProductClick}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <img
                      src={getImageUrl(product.main_image_url)}
                      alt={product.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      {product.brand && (
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      )}
                    </div>
                    <span className="font-semibold">{product.price}€</span>
                  </Link>
                ))}
              </div>
            )}

            {!searchTerm && (
              <div className="text-center py-8 text-muted-foreground">
                Tapez pour rechercher des produits...
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;