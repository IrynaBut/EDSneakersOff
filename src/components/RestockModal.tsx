import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Truck, Calendar, Euro } from 'lucide-react';
import { toast } from 'sonner';

interface RestockModalProps {
  variant: {
    id: string;
    products: {
      name: string;
      price: number;
    } | null;
    size: string;
    color?: string;
    stock_quantity: number;
  };
  onRestock: (variantId: string, quantity: number) => void;
  children: React.ReactNode;
}

export const RestockModal = ({ variant, onRestock, children }: RestockModalProps) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(20);
  const [supplier, setSupplier] = useState('nike-france');
  const [deliveryDate, setDeliveryDate] = useState('');

  const suppliers = [
    { id: 'nike-france', name: 'Nike France', delay: '3-5 jours', price: 0.85 },
    { id: 'adidas-europe', name: 'Adidas Europe', delay: '2-4 jours', price: 0.82 },
    { id: 'puma-direct', name: 'Puma Direct', delay: '4-7 jours', price: 0.88 },
    { id: 'converse-dist', name: 'Converse Distribution', delay: '5-8 jours', price: 0.80 },
  ];

  const selectedSupplier = suppliers.find(s => s.id === supplier);
  const totalCost = quantity * (variant.products?.price || 0) * (selectedSupplier?.price || 0.85);

  const handleRestock = () => {
    onRestock(variant.id, quantity);
    toast.success(`Commande de réapprovisionnement envoyée à ${selectedSupplier?.name}`, {
      description: `${quantity} unités seront livrées dans ${selectedSupplier?.delay}`,
    });
    setOpen(false);
  };

  // Calculate suggested delivery date
  React.useEffect(() => {
    if (selectedSupplier) {
      const days = parseInt(selectedSupplier.delay.split('-')[1]) || 5;
      const date = new Date();
      date.setDate(date.getDate() + days);
      setDeliveryDate(date.toISOString().split('T')[0]);
    }
  }, [selectedSupplier]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Réapprovisionnement - {variant.products?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Informations Produit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Produit:</span>
                <span className="font-medium">{variant.products?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Taille:</span>
                <Badge variant="outline">{variant.size}</Badge>
              </div>
              {variant.color && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Couleur:</span>
                  <Badge variant="outline">{variant.color}</Badge>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Stock actuel:</span>
                <Badge variant="destructive">{variant.stock_quantity}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Prix de vente:</span>
                <span className="font-medium">{variant.products?.price}€</span>
              </div>
            </CardContent>
          </Card>

          {/* Restock Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité à commander</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Fournisseur</Label>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id}>
                      <div className="flex flex-col">
                        <span>{sup.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Délai: {sup.delay} • Coût: {(sup.price * 100).toFixed(0)}% du prix
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Delivery Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Informations de Livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Livraison prévue:
                </span>
                <Badge variant="secondary">
                  {new Date(deliveryDate).toLocaleDateString('fr-FR')}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Délai estimé:</span>
                <span className="text-sm">{selectedSupplier?.delay}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Mode de transport:</span>
                <span className="text-sm">Express (Chronopost)</span>
              </div>
            </CardContent>
          </Card>

          {/* Cost Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Euro className="h-4 w-4" />
                Récapitulatif des Coûts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Prix unitaire fournisseur:</span>
                <span className="text-sm">
                  {((variant.products?.price || 0) * (selectedSupplier?.price || 0.85)).toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Quantité:</span>
                <span className="text-sm">{quantity} unités</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-medium">
                <span>Total de la commande:</span>
                <span className="text-lg text-primary">{totalCost.toFixed(2)}€</span>
              </div>
              <div className="text-xs text-muted-foreground">
                * Prix hors taxes et frais de port
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleRestock} className="bg-primary">
              <Package className="h-4 w-4 mr-2" />
              Confirmer la Commande
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};