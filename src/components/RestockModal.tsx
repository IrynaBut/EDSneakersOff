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
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [customSupplier, setCustomSupplier] = useState({
    name: '',
    contact: '',
    delay: '',
    price: 0.85
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const suppliers = [
    { id: 'nike-france', name: 'Nike France', delay: '3-5 jours', price: 0.85 },
    { id: 'adidas-europe', name: 'Adidas Europe', delay: '2-4 jours', price: 0.82 },
    { id: 'puma-direct', name: 'Puma Direct', delay: '4-7 jours', price: 0.88 },
    { id: 'converse-dist', name: 'Converse Distribution', delay: '5-8 jours', price: 0.80 },
    { id: 'autre', name: 'Autre', delay: 'À définir', price: 0.85 },
  ];

  const paymentMethods = [
    { id: 'credit_card', name: 'Carte de crédit', icon: '💳' },
    { id: 'bank_transfer', name: 'Virement bancaire', icon: '🏦' },
    { id: 'paypal', name: 'PayPal', icon: '🔷' },
    { id: 'check', name: 'Chèque', icon: '📄' },
  ];

  const selectedSupplier = suppliers.find(s => s.id === supplier);
  const currentSupplier = supplier === 'autre' ? customSupplier : selectedSupplier;
  const totalCost = quantity * (variant.products?.price || 0) * (currentSupplier?.price || 0.85);
  const selectedPaymentMethod = paymentMethods.find(p => p.id === paymentMethod);

  const handleRestock = async () => {
    onRestock(variant.id, quantity);
    
    // Simulate creating invoice
    const invoiceNumber = `FAC-${Date.now()}`;
    
    toast.success(`Commande confirmée avec succès !`, {
      description: `Facture ${invoiceNumber} générée et email de confirmation envoyé`,
    });
    
    // Simulate sending email
    setTimeout(() => {
      toast.info('Email de confirmation envoyé', {
        description: `La facture a été envoyée à ${currentSupplier?.name || 'le fournisseur'}`,
      });
    }, 1000);
    
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
                        {sup.id !== 'autre' && (
                          <span className="text-xs text-muted-foreground">
                            Délai: {sup.delay} • Coût: {(sup.price * 100).toFixed(0)}% du prix
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Supplier Form */}
          {supplier === 'autre' && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Informations Fournisseur Personnalisé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="supplier-name">Nom du fournisseur</Label>
                    <Input
                      id="supplier-name"
                      placeholder="Ex: Nike Direct"
                      value={customSupplier.name}
                      onChange={(e) => setCustomSupplier(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="supplier-contact">Contact</Label>
                    <Input
                      id="supplier-contact"
                      placeholder="Email ou téléphone"
                      value={customSupplier.contact}
                      onChange={(e) => setCustomSupplier(prev => ({ ...prev, contact: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="supplier-delay">Délai de livraison</Label>
                    <Input
                      id="supplier-delay"
                      placeholder="Ex: 2-3 jours"
                      value={customSupplier.delay}
                      onChange={(e) => setCustomSupplier(prev => ({ ...prev, delay: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="supplier-price">Coefficient prix</Label>
                    <Input
                      id="supplier-price"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      placeholder="0.85"
                      value={customSupplier.price}
                      onChange={(e) => setCustomSupplier(prev => ({ ...prev, price: parseFloat(e.target.value) || 0.85 }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                Mode de Paiement
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Changer le mode de paiement
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedPaymentMethod?.icon}</span>
                <div>
                  <div className="font-medium">{selectedPaymentMethod?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Dernier mode utilisé
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection Dialog */}
          <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choisir un Mode de Paiement</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setPaymentMethod(method.id);
                      setShowPaymentModal(false);
                    }}
                    className={`w-full p-3 border rounded-lg text-left hover:bg-accent transition-colors ${
                      paymentMethod === method.id ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-medium">{method.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

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
                <span className="text-sm">{currentSupplier?.delay}</span>
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
                  {((variant.products?.price || 0) * (currentSupplier?.price || 0.85)).toFixed(2)}€
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