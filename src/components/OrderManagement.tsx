import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Calendar,
  MapPin,
  CreditCard,
  ExternalLink,
  Package,
  User,
  Euro,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  billing_address: any;
  shipping_address: any;
  notes?: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email: string;
  } | null;
  order_items?: {
    id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    products?: { 
      name: string; 
      main_image_url?: string;
    };
    product_variants?: { 
      size: string; 
      color?: string;
    };
  }[];
}

interface OrderManagementProps {
  userRole: 'admin' | 'vendeur';
}

export const OrderManagement = ({ userRole }: OrderManagementProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email
          ),
          order_items (
            *,
            products (name, main_image_url),
            product_variants (size, color)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((ordersData as any) || []);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));

      toast.success(`Statut mis à jour vers: ${getStatusLabel(newStatus)}`);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newPaymentStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, payment_status: newPaymentStatus } : o
      ));

      toast.success(`Statut de paiement mis à jour vers: ${getPaymentStatusLabel(newPaymentStatus)}`);
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast.error('Erreur lors de la mise à jour du statut de paiement');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      completed: 'Terminée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      paid: 'Payée',
      failed: 'Échouée',
      refunded: 'Remboursée'
    };
    return labels[status] || status;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': 
      case 'processing': return 'default';
      case 'shipped': return 'outline';
      case 'delivered':
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'paid': return 'default';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (order.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesDate = !dateFilter || 
      new Date(order.created_at).toISOString().split('T')[0] === dateFilter;
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  const totalRevenue = orders
    .filter(o => ['paid'].includes(o.payment_status))
    .reduce((sum, o) => sum + o.total_amount, 0);

  const todayOrders = orders.filter(o => 
    new Date(o.created_at).toDateString() === new Date().toDateString()
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher commande, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="processing">En préparation</option>
          <option value="shipped">Expédiée</option>
          <option value="delivered">Livrée</option>
          <option value="completed">Terminée</option>
          <option value="cancelled">Annulée</option>
        </select>
        <Button onClick={loadOrders} variant="outline" size="sm">
          Actualiser
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              Aujourd'hui: {todayOrders.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <Euro className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {totalRevenue.toFixed(2)}€
            </div>
            <p className="text-xs text-muted-foreground">Commandes payées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <User className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {new Set(orders.map(o => o.user_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Clients uniques</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Commandes ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune commande trouvée
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 space-y-4">
                  {/* En-tête de commande */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-lg">#{order.order_number}</h4>
                      <p className="text-sm text-muted-foreground">
                        Client: {order.profiles?.first_name} {order.profiles?.last_name} ({order.profiles?.email})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.total_amount.toFixed(2)}€ • {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      <Badge variant={getPaymentStatusBadgeVariant(order.payment_status)}>
                        {getPaymentStatusLabel(order.payment_status)}
                      </Badge>
                    </div>
                  </div>

                  {/* Articles commandés */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="bg-secondary/20 p-3 rounded">
                      <div className="font-semibold mb-2">Articles commandés</div>
                      <div className="space-y-2">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {item.products?.main_image_url && (
                                <img 
                                  src={item.products.main_image_url} 
                                  alt={item.products.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <div className="font-medium">{item.products?.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {item.product_variants?.size && `Taille ${item.product_variants.size}`}
                                  {item.product_variants?.color && ` • ${item.product_variants.color}`}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">Qté: {item.quantity}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.unit_price.toFixed(2)}€ × {item.quantity} = {item.total_price.toFixed(2)}€
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Adresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.shipping_address && (
                      <div className="bg-secondary/20 p-3 rounded">
                        <div className="font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4"/>
                          Adresse de livraison
                        </div>
                        <p className="text-sm mt-1">
                          {order.shipping_address.first_name} {order.shipping_address.last_name}<br/>
                          {order.shipping_address.address_line_1}<br/>
                          {order.shipping_address.address_line_2 && `${order.shipping_address.address_line_2}\n`}
                          {order.shipping_address.postal_code} {order.shipping_address.city}<br/>
                          {order.shipping_address.country}
                        </p>
                      </div>
                    )}
                    {order.billing_address && (
                      <div className="bg-secondary/20 p-3 rounded">
                        <div className="font-semibold flex items-center gap-2">
                          <CreditCard className="h-4 w-4"/>
                          Adresse de facturation
                        </div>
                        <p className="text-sm mt-1">
                          {order.billing_address.first_name} {order.billing_address.last_name}<br/>
                          {order.billing_address.address_line_1}<br/>
                          {order.billing_address.address_line_2 && `${order.billing_address.address_line_2}\n`}
                          {order.billing_address.postal_code} {order.billing_address.city}<br/>
                          {order.billing_address.country}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions pour la gestion */}
                  {(userRole === 'admin' || userRole === 'vendeur') && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Statut:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmée</option>
                          <option value="processing">En préparation</option>
                          <option value="shipped">Expédiée</option>
                          <option value="delivered">Livrée</option>
                          <option value="completed">Terminée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Paiement:</span>
                        <select
                          value={order.payment_status}
                          onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="pending">En attente</option>
                          <option value="paid">Payée</option>
                          <option value="failed">Échouée</option>
                          <option value="refunded">Remboursée</option>
                        </select>
                      </div>
                      {order.payment_method && (
                        <Badge variant="outline">
                          {order.payment_method === 'card' ? 'Carte bancaire' : 
                           order.payment_method === 'paypal' ? 'PayPal' : 
                           order.payment_method}
                        </Badge>
                      )}
                    </div>
                  )}

                  {order.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                      <div className="font-semibold text-yellow-800">Notes:</div>
                      <p className="text-sm text-yellow-700">{order.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};