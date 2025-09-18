import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Package, Calendar, CreditCard, Truck, MapPin } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  shipping_address: any;
  billing_address: any;
  order_items: any[];
}

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
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
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
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
      pending: { label: 'En attente', variant: 'secondary' as const },
      confirmed: { label: 'Confirmée', variant: 'default' as const },
      shipped: { label: 'Expédiée', variant: 'outline' as const },
      delivered: { label: 'Livrée', variant: 'default' as const },
      cancelled: { label: 'Annulée', variant: 'destructive' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      paid: { label: 'Payée', variant: 'default' as const },
      failed: { label: 'Échouée', variant: 'destructive' as const },
      refunded: { label: 'Remboursée', variant: 'outline' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
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

                    {/* Shipping Address */}
                    {order.shipping_address && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
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
                          <p>{order.shipping_address.country}</p>
                        </div>
                      </div>
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