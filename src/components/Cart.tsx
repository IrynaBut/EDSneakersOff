import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, itemCount, totalAmount, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop";
    if (imagePath.startsWith('http')) return imagePath;
    return `https://hsvfgfmvdymwcevisyhh.supabase.co/storage/v1/object/public/product-images/${imagePath}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Mon Panier
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0 ? 'Votre panier est vide' : `${itemCount} article${itemCount > 1 ? 's' : ''} dans votre panier`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground text-center">
                Votre panier est vide.<br />
                Découvrez nos produits !
              </p>
              <Button asChild onClick={() => setIsOpen(false)}>
                <Link to="/produits">
                  Voir les produits
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-auto py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg bg-card">
                    <div className="flex-shrink-0">
                      <img
                        src={getImageUrl(item.product_image || '')}
                        alt={item.product_name || 'Produit'}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">
                        {item.product_name}
                      </h4>
                      {item.variant_size && (
                        <p className="text-sm text-muted-foreground">
                          Taille: {item.variant_size}
                          {item.variant_color && ` • ${item.variant_color}`}
                        </p>
                      )}
                      <p className="text-sm font-semibold">
                        {formatPrice(item.product_price || 0)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">Total:</span>
                  <span className="text-lg font-bold">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Passer la commande
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/produits">
                        Continuer mes achats
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      onClick={clearCart}
                      className="text-destructive hover:text-destructive"
                    >
                      Vider
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;