import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, MapPin, CreditCard, Star } from "lucide-react";
import { Order } from "@/hooks/useOrders";
import { Link } from "react-router-dom";

interface OrderConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

export const OrderConfirmationModal = ({ open, onOpenChange, order }: OrderConfirmationModalProps) => {
  const calculateLoyaltyPoints = (amount: number) => {
    return Math.floor(amount); // 1 point per euro
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      card: 'Carte bancaire',
      paypal: 'PayPal',
      bank_transfer: 'Virement bancaire',
      apple_pay: 'Apple Pay',
      google_pay: 'Google Pay'
    };
    return methods[method as keyof typeof methods] || method;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Merci pour votre commande !
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Votre commande #{order.order_number} a été confirmée avec succès
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Articles commandés
            </h3>
            <div className="space-y-3">
              {order.order_items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">Article #{index + 1}</h5>
                    <p className="text-sm text-muted-foreground">
                      Quantité: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.total_price}€</p>
                    <p className="text-sm text-muted-foreground">
                      {item.unit_price}€ / pièce
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">
                Total : {order.total_amount}€
              </p>
            </div>
          </div>

          <Separator />

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Adresse de livraison
              </h4>
              <div className="bg-secondary/20 p-4 rounded-lg">
                {order.shipping_address?.is_pickup_point ? (
                  <>
                    <p className="font-medium text-primary mb-2">📦 Point Relais</p>
                    <p className="font-medium">{order.shipping_address.address_line_1}</p>
                    <p>{order.shipping_address.address_line_2}</p>
                    <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">
                      {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                    </p>
                    <p>{order.shipping_address?.address_line_1}</p>
                    <p>{order.shipping_address?.postal_code} {order.shipping_address?.city}</p>
                  </>
                )}
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Adresse de facturation
              </h4>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <p className="font-medium">
                  {order.billing_address?.first_name} {order.billing_address?.last_name}
                </p>
                <p>{order.billing_address?.address_line_1}</p>
                <p>{order.billing_address?.postal_code} {order.billing_address?.city}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment & Loyalty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Méthode de paiement
              </h4>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <p>{getPaymentMethodLabel(order.payment_method || 'card')}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Points de fidélité gagnés
              </h4>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <p className="text-lg font-medium text-primary">
                  +{calculateLoyaltyPoints(order.total_amount)} points
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Prochaines étapes :</h4>
            <ul className="text-sm space-y-1">
              <li>• Vous allez recevoir un email de confirmation avec tous les détails</li>
              <li>• Votre commande sera traitée dans les prochaines 24h</li>
              <li>• Vous recevrez un email de suivi dès l'expédition</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Continuer mes achats
            </Button>
            <Button className="flex-1" asChild>
              <Link to="/commandes">
                Voir mes commandes
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};