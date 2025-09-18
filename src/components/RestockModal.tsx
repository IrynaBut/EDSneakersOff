import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Truck, Calendar, Euro, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
    email: '',
    phone: '',
    address: '',
    delay: '',
    price: 0.85
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedPaymentMethods] = useState([
    { id: 'card_1234', type: 'credit_card', brand: 'Visa', last4: '4242', expiry: '12/25', icon: '💳' },
    { id: 'paypal_1', type: 'paypal', email: 'vendor@example.com', icon: '🔷' }
  ]);

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
    setIsProcessing(true);
    
    try {
      // Simulate payment validation
      const paymentSuccess = Math.random() > 0.2; // 80% success rate
      const supplierStockAvailable = Math.random() > 0.1; // 90% stock available
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!supplierStockAvailable) {
        toast.error('Paiement impossible : manque de stock chez le fournisseur. Contactez le fournisseur directement.', {
          description: supplier === 'autre' ? customSupplier.contact : 'contact@fournisseur.fr',
          duration: 8000,
          action: {
            label: 'Contacter',
            onClick: () => {
              const contact = supplier === 'autre' ? customSupplier.contact : 'contact@fournisseur.fr';
              if (contact.includes('@')) {
                window.location.href = `mailto:${contact}`;
              } else {
                window.location.href = `tel:${contact}`;
              }
            }
          }
        });
        setIsProcessing(false);
        return;
      }

      if (!paymentSuccess) {
        toast.error('Échec du paiement. Veuillez réessayer ou contacter votre banque.', {
          description: 'Code erreur: PAYMENT_DECLINED',
          duration: 6000,
          action: {
            label: 'Réessayer',
            onClick: () => handleRestock()
          }
        });
        setIsProcessing(false);
        return;
      }

      // Success - Update stock and create invoice
      onRestock(variant.id, quantity);
      
      const invoiceNumber = `FACT-RST-${Date.now()}`;
      const currentSupplierInfo = supplier === 'autre' ? customSupplier : selectedSupplier;
      
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          type: 'supplier',
          variant_id: variant.id,
          supplier_name: currentSupplierInfo?.name || 'Fournisseur non spécifié',
          supplier_contact: supplier === 'autre' ? customSupplier.contact : 'contact@fournisseur.fr',
          total_amount: totalCost,
          unit_price: (variant.products?.price || 0) * (currentSupplierInfo?.price || 0.85),
          quantity: quantity,
          status: 'paid',
          payment_method: paymentMethod,
          currency: 'EUR',
          due_date: new Date().toISOString(),
          paid_date: new Date().toISOString(),
          metadata: {
            restock_batch: `RST-${Date.now()}`,
            delivery_date: deliveryDate,
            product_name: variant.products?.name,
            supplier_email: supplier === 'autre' ? customSupplier.email : 'contact@fournisseur.fr',
            supplier_phone: supplier === 'autre' ? customSupplier.phone : null
          }
        });

      if (invoiceError) {
        console.error('Error creating invoice:', invoiceError);
        toast.error('Erreur lors de la sauvegarde de la facture');
      } else {
        toast.success('Votre paiement a bien été effectué. Un mail de confirmation avec la facture a été envoyé.', {
          description: `Facture ${invoiceNumber} générée et sauvegardée`,
          duration: 5000,
        });
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Error during restock:', error);
      toast.error('Erreur lors du réapprovisionnement');
    } finally {
      setIsProcessing(false);
    }
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Réapprovisionnement - {variant.products?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-1">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                     <Label htmlFor="supplier-email">Email</Label>
                     <Input
                       id="supplier-email"
                       type="email"
                       placeholder="contact@fournisseur.com"
                       value={customSupplier.email}
                       onChange={(e) => setCustomSupplier(prev => ({ ...prev, email: e.target.value }))}
                     />
                   </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <div className="space-y-1">
                     <Label htmlFor="supplier-phone">Téléphone</Label>
                     <Input
                       id="supplier-phone"
                       placeholder="01 23 45 67 89"
                       value={customSupplier.phone}
                       onChange={(e) => setCustomSupplier(prev => ({ ...prev, phone: e.target.value }))}
                     />
                   </div>
                   <div className="space-y-1">
                     <Label htmlFor="supplier-address">Adresse</Label>
                     <Input
                       id="supplier-address"
                       placeholder="123 Rue Exemple, Paris"
                       value={customSupplier.address}
                       onChange={(e) => setCustomSupplier(prev => ({ ...prev, address: e.target.value }))}
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
               {savedPaymentMethods.length > 0 ? (
                 <div className="flex items-center gap-3">
                   <span className="text-2xl">{savedPaymentMethods[0].icon}</span>
                   <div>
                     <div className="font-medium">
                       {savedPaymentMethods[0].type === 'credit_card' 
                         ? `${savedPaymentMethods[0].brand} •••• ${savedPaymentMethods[0].last4}` 
                         : savedPaymentMethods[0].email}
                     </div>
                     <div className="text-xs text-muted-foreground">
                       {savedPaymentMethods[0].type === 'credit_card' 
                         ? `Expire ${savedPaymentMethods[0].expiry}` 
                         : 'Compte PayPal vérifié'}
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="flex items-center gap-3">
                   <span className="text-2xl">{selectedPaymentMethod?.icon}</span>
                   <div>
                     <div className="font-medium">{selectedPaymentMethod?.name}</div>
                     <div className="text-xs text-muted-foreground">
                       Nouveau mode de paiement
                     </div>
                   </div>
                 </div>
               )}
             </CardContent>
          </Card>

          {/* Payment Method Selection Dialog */}
          <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choisir un Mode de Paiement</DialogTitle>
              </DialogHeader>
               <div className="space-y-3">
                 <div className="text-sm font-medium mb-2">Méthodes sauvegardées</div>
                 {savedPaymentMethods.map((method) => (
                   <button
                     key={method.id}
                     onClick={() => {
                       setPaymentMethod(method.type);
                       setShowPaymentModal(false);
                     }}
                     className={`w-full p-3 border rounded-lg text-left hover:bg-accent transition-colors ${
                       paymentMethod === method.type ? 'border-primary bg-primary/10' : 'border-border'
                     }`}
                   >
                     <div className="flex items-center gap-3">
                       <span className="text-xl">{method.icon}</span>
                       <div>
                         <div className="font-medium">
                           {method.type === 'credit_card' 
                             ? `${method.brand} •••• ${method.last4}` 
                             : method.email}
                         </div>
                         <div className="text-xs text-muted-foreground">
                           {method.type === 'credit_card' 
                             ? `Expire ${method.expiry}` 
                             : 'Compte vérifié'}
                         </div>
                       </div>
                     </div>
                   </button>
                 ))}
                 
                 <div className="text-sm font-medium mb-2 pt-2 border-t">Nouveau mode de paiement</div>
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
             <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
               Annuler
             </Button>
             <Button onClick={handleRestock} className="bg-primary" disabled={isProcessing}>
               {isProcessing ? (
                 <>
                   <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                   Traitement en cours...
                 </>
               ) : (
                 <>
                   <Package className="h-4 w-4 mr-2" />
                   Confirmer la Commande
                 </>
               )}
             </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};