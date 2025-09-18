import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Package, Calendar, CreditCard, Truck, MapPin, RotateCcw, Star } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  created_at: string;
  shipping_address: any;
  billing_address: any;
  order_items: any[];
}

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loyaltyPoints, setLoyaltyPoints] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        const [ordersResult, loyaltyResult] = await Promise.all([
          supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (name, main_image_url),
                product_variants (size, color)
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('loyalty_points')
            .select('*')
            .eq('user_id', user.id)
            .single()
        ]);

        if (ordersResult.error) throw ordersResult.error;
        setOrders(ordersResult.data || []);
        
        if (!loyaltyResult.error) {
          setLoyaltyPoints(loyaltyResult.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente de paiement', variant: 'secondary' as const },
      confirmed: { label: 'En cours de préparation', variant: 'default' as const },
      shipped: { label: 'Expédiée', variant: 'outline' as const },
      delivered: { label: 'Livrée', variant: 'default' as const },
      cancelled: { label: 'Annulée', variant: 'destructive' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente de paiement', variant: 'secondary' as const },
      paid: { label: 'Payée', variant: 'default' as const },
      failed: { label: 'Paiement échoué', variant: 'destructive' as const },
      refunded: { label: 'Remboursée', variant: 'outline' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
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

  const calculateLoyaltyPoints = (amount: number) => {
    return Math.floor(amount); // 1 point per euro
  };

  const handleReturnRequest = (orderId: string, orderNumber: string) => {
    toast({
      title: "Demande de retour initiée",
      description: `Votre demande de retour pour la commande ${orderNumber} a été prise en compte. Vous recevrez un email avec les instructions de retour.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mes Commandes</h1>
          <p className="text-muted-foreground">Suivez l'état de vos commandes et consultez votre historique d'achats</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune commande</h3>
              <p className="text-muted-foreground text-center mb-6">
                Vous n'avez pas encore passé de commande. Découvrez nos produits !
              </p>
              <Button asChild>
                <a href="/produits">Découvrir nos produits</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              const paymentInfo = getPaymentStatusBadge(order.payment_status);
              
              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Commande #{order.order_number}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            {order.total_amount}€
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                        <Badge variant={paymentInfo.variant}>
                          {paymentInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Order Items */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Articles commandés</h4>
                      <div className="space-y-3">
                        {order.order_items.map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg">
                            <img
                              src={item.products?.main_image_url || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop"}
                              alt={item.products?.name || "Produit"}
                              className="w-16 h-16 rounded-md object-cover"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium">{item.products?.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                Taille: {item.product_variants?.size} 
                                {item.product_variants?.color && ` • Couleur: ${item.product_variants.color}`}
                              </p>
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
                    </div>

                    <Separator className="my-6" />

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Shipping Address */}
                      {order.shipping_address && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Adresse de livraison
                          </h4>
                          <div className="bg-secondary/20 p-4 rounded-lg">
                            <p className="font-medium">
                              {order.shipping_address.first_name} {order.shipping_address.last_name}
                            </p>
                            <p>{order.shipping_address.address_line_1}</p>
                            {order.shipping_address.address_line_2 && (
                              <p>{order.shipping_address.address_line_2}</p>
                            )}
                            <p>
                              {order.shipping_address.postal_code} {order.shipping_address.city}
                            </p>
                            <p>{order.shipping_address.country || 'France'}</p>
                          </div>
                        </div>
                      )}

                      {/* Billing Address */}
                      {order.billing_address && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Adresse de facturation
                          </h4>
                          <div className="bg-secondary/20 p-4 rounded-lg">
                            <p className="font-medium">
                              {order.billing_address.first_name} {order.billing_address.last_name}
                            </p>
                            <p>{order.billing_address.address_line_1}</p>
                            {order.billing_address.address_line_2 && (
                              <p>{order.billing_address.address_line_2}</p>
                            )}
                            <p>
                              {order.billing_address.postal_code} {order.billing_address.city}
                            </p>
                            <p>{order.billing_address.country || 'France'}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="my-6" />

                    {/* Payment and Loyalty Points */}
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
                          <p className="text-sm text-muted-foreground">
                            1 point = 1€ d'achat
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Return Options for Delivered Orders */}
                    {order.status === 'delivered' && (
                      <>
                        <Separator className="my-6" />
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">Besoin de retourner un article ?</h4>
                            <p className="text-sm text-muted-foreground">
                              Vous avez 30 jours pour retourner vos articles
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => handleReturnRequest(order.id, order.order_number)}
                            className="flex items-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Demander un retour
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;