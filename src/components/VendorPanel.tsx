import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp,
  AlertCircle,
  Search,
  Edit,
  Calendar,
  RefreshCw,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RestockModal } from './RestockModal';
import { Factures } from './Factures';
import { AddProductModal } from './AddProductModal';
import { OrderActions } from './OrderActions';

interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  products: {
    name: string;
    price: number;
  } | null;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  metadata?: {
    tracking_number?: string;
  };
  profiles?: {
    first_name?: string;
    last_name?: string;
    email: string;
  } | null;
}

export const VendorPanel = () => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    setLoading(true);
    try {
      // Charger tous les variants avec les produits
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select(`
          *,
          products (name, price)
        `)
        .order('stock_quantity', { ascending: true });

      if (variantsError) throw variantsError;
      setVariants(variantsData || []);

      // Charger toutes les commandes avec les profils clients
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders((ordersData as any) || []);

    } catch (error: any) {
      console.error('Error loading vendor data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (variantId: string, newStock: number) => {
    if (newStock < 0) {
      toast.error('Le stock ne peut pas être négatif');
      return;
    }

    try {
      const { error } = await supabase
        .from('product_variants')
        .update({ stock_quantity: newStock })
        .eq('id', variantId);

      if (error) throw error;

      setVariants(variants.map(v => 
        v.id === variantId ? { ...v, stock_quantity: newStock } : v
      ));

      toast.success('Stock mis à jour avec succès');
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast.error('Erreur lors de la mise à jour du stock');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));

      toast.success(`Statut de commande mis à jour vers ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour de la commande');
    }
  };

  const lowStockVariants = variants.filter(v => v.stock_quantity <= v.low_stock_threshold);
  const filteredVariants = variants.filter(v => 
    v.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.size.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || 
      new Date(o.created_at).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Panneau Vendeur</h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Aujourd'hui: {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              placeholder="Filtrer par date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-40"
            />
          </div>
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Statistiques vendeur */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits en Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{variants.length}</div>
            <p className="text-xs text-muted-foreground">
              Variants disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{lowStockVariants.length}</div>
            <p className="text-xs text-muted-foreground">
              Nécessite réapprovisionnement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes {dateFilter ? 'du jour' : 'Totales'}</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              {dateFilter ? `Le ${new Date(dateFilter).toLocaleDateString('fr-FR')}` : 'Toutes les commandes'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredOrders
                .filter(o => o.status === 'delivered')
                .reduce((sum, order) => sum + (order.total_amount || 0), 0)
                .toFixed(2)}€
            </div>
            <p className="text-xs text-muted-foreground">
              {dateFilter ? `Du ${new Date(dateFilter).toLocaleDateString('fr-FR')}` : 'Commandes livrées'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertes stock faible */}
      {lowStockVariants.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-red-700 dark:text-red-400">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Alertes Stock Faible ({lowStockVariants.length} produits)
              </div>
              <Badge variant="destructive" className="text-xs">
                Action requise
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockVariants.slice(0, 5).map((variant) => (
                <div key={variant.id} className="flex items-center justify-between p-3 bg-white dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                  <div>
                    <span className="font-medium text-red-900 dark:text-red-100">
                      {variant.products?.name} - {variant.size} {variant.color && `(${variant.color})`}
                    </span>
                    <div className="text-xs text-red-600 dark:text-red-300 mt-1">
                      Seuil d'alerte: {variant.low_stock_threshold} unités
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      {variant.stock_quantity} restant(s)
                    </Badge>
                    <RestockModal 
                      variant={variant} 
                      onRestock={(variantId, quantity) => updateStock(variantId, variant.stock_quantity + quantity)}
                    >
                      <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-100">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Restocker
                      </Button>
                    </RestockModal>
                  </div>
                </div>
              ))}
              {lowStockVariants.length > 5 && (
                <p className="text-xs text-muted-foreground text-center pt-2 border-t border-red-200">
                  Et {lowStockVariants.length - 5} autres produits en rupture de stock...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="stock" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="stock">Gestion Stock</TabsTrigger>
          <TabsTrigger value="orders">Suivi Commandes</TabsTrigger>
          <TabsTrigger value="factures">Factures</TabsTrigger>
        </TabsList>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Gestion des Stocks
                <AddProductModal onProductAdded={loadVendorData}>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un Produit
                  </Button>
                </AddProductModal>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Produits en stock critique en premier */}
                {filteredVariants
                  .sort((a, b) => {
                    const aLowStock = a.stock_quantity <= a.low_stock_threshold;
                    const bLowStock = b.stock_quantity <= b.low_stock_threshold;
                    if (aLowStock && !bLowStock) return -1;
                    if (!aLowStock && bLowStock) return 1;
                    return a.stock_quantity - b.stock_quantity;
                  })
                  .map((variant) => (
                  <div key={variant.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                    variant.stock_quantity <= variant.low_stock_threshold 
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20' 
                      : 'border-border'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          {variant.products?.name}
                        </h4>
                        {variant.stock_quantity <= variant.low_stock_threshold && (
                          <Badge variant="destructive" className="text-xs">
                            Stock critique
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Taille: {variant.size} {variant.color && `• Couleur: ${variant.color}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Prix: {variant.products?.price}€ • Seuil d'alerte: {variant.low_stock_threshold}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-center">
                        <div className="text-sm font-medium">Stock actuel</div>
                        <Badge variant={
                          variant.stock_quantity <= variant.low_stock_threshold ? 'destructive' : 'default'
                        }>
                          {variant.stock_quantity}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStock(variant.id, Math.max(0, variant.stock_quantity - 1))}
                          disabled={variant.stock_quantity <= 0}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={variant.stock_quantity}
                          onChange={(e) => updateStock(variant.id, parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                          min="0"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStock(variant.id, variant.stock_quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      {variant.stock_quantity <= variant.low_stock_threshold && (
                        <RestockModal 
                          variant={variant} 
                          onRestock={(variantId, quantity) => updateStock(variantId, variant.stock_quantity + quantity)}
                        >
                          <Button size="sm" variant="destructive">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Restocker
                          </Button>
                        </RestockModal>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Suivi des Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">#{order.order_number}</h4>
                      <p className="text-sm text-muted-foreground">
                        Client: {order.profiles?.first_name} {order.profiles?.last_name} ({order.profiles?.email || 'Email non disponible'})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.total_amount}€ • {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="processing">En préparation</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                      <OrderActions order={order} />
                    </div>
                  </div>
                ))}
                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune commande trouvée
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factures">
          <Factures />
        </TabsContent>
      </Tabs>
    </div>
  );
};