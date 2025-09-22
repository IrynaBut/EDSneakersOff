import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Percent, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PromotionModalProps {
  children: React.ReactNode;
  product: {
    id: string;
    name: string;
    price: number;
    original_price?: number;
    is_promotion?: boolean;
  };
  onPromotionUpdated?: () => void;
}

export const PromotionModal = ({ children, product, onPromotionUpdated }: PromotionModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [promotionData, setPromotionData] = useState({
    isPromotion: product.is_promotion || false,
    discountPercentage: 0
  });

  useEffect(() => {
    if (open && product.original_price && product.price < product.original_price) {
      // Calculate existing discount percentage
      const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
      setPromotionData({
        isPromotion: product.is_promotion || false,
        discountPercentage: discount
      });
    } else {
      setPromotionData({
        isPromotion: product.is_promotion || false,
        discountPercentage: 0
      });
    }
  }, [open, product]);

  const calculatePromotionPrice = (originalPrice: number, discountPercentage: number): number => {
    return Math.round(originalPrice * (1 - discountPercentage / 100) * 100) / 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updateData: any = {
        is_promotion: promotionData.isPromotion
      };

      if (promotionData.isPromotion && promotionData.discountPercentage > 0) {
        // Calculate new promotion price
        const originalPrice = product.original_price || product.price;
        const newPrice = calculatePromotionPrice(originalPrice, promotionData.discountPercentage);
        
        updateData = {
          ...updateData,
          original_price: originalPrice,
          price: newPrice
        };
      } else if (!promotionData.isPromotion) {
        // Remove promotion - restore original price
        const originalPrice = product.original_price || product.price;
        updateData = {
          ...updateData,
          price: originalPrice,
          original_price: null
        };
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id);

      if (error) throw error;

      const actionText = promotionData.isPromotion 
        ? `Promotion de ${promotionData.discountPercentage}% appliquée`
        : 'Promotion supprimée';
      
      toast.success(actionText);
      setOpen(false);
      onPromotionUpdated?.();

    } catch (error: any) {
      console.error('Error updating promotion:', error);
      toast.error('Erreur lors de la mise à jour de la promotion');
    } finally {
      setLoading(false);
    }
  };

  const originalPrice = product.original_price || product.price;
  const promotionPrice = promotionData.discountPercentage > 0 
    ? calculatePromotionPrice(originalPrice, promotionData.discountPercentage)
    : product.price;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Gestion des Promotions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="bg-secondary/20 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">{product.name}</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Prix actuel: {product.price.toFixed(2)}€</Badge>
              {product.is_promotion && (
                <Badge variant="destructive">En promotion</Badge>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Promotion Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="promotion-toggle" className="text-sm font-medium">
                Activer la promotion
              </Label>
              <Switch
                id="promotion-toggle"
                checked={promotionData.isPromotion}
                onCheckedChange={(checked) => 
                  setPromotionData(prev => ({ ...prev, isPromotion: checked }))
                }
              />
            </div>

            {promotionData.isPromotion && (
              <>
                {/* Discount Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="discount">Pourcentage de réduction (%)</Label>
                  <div className="relative">
                    <Input
                      id="discount"
                      type="number"
                      min="1"
                      max="80"
                      step="1"
                      required
                      value={promotionData.discountPercentage}
                      onChange={(e) => 
                        setPromotionData(prev => ({ 
                          ...prev, 
                          discountPercentage: parseInt(e.target.value) || 0 
                        }))
                      }
                      className="pr-8"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Price Preview */}
                {promotionData.discountPercentage > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-2">
                    <h5 className="text-sm font-medium text-green-700 dark:text-green-300">
                      Aperçu des prix
                    </h5>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prix original:</span>
                        <span className="line-through">{originalPrice.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between font-medium text-green-600 dark:text-green-400">
                        <span>Prix promotionnel:</span>
                        <span>{promotionPrice.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Économie:</span>
                        <span>{(originalPrice - promotionPrice).toFixed(2)}€ (-{promotionData.discountPercentage}%)</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Mise à jour...' : 'Appliquer'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};